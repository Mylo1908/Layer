# Layer: Analyse und bestätigte Bildgenerierung

## Protokoll review-v2

`POST /prettify` erhält weiterhin PNG (max. 511 × 511 Pixel, 2 MiB), aber zusätzlich `X-Layer-Phase: analyze|generate` sowie URI-kodiertes JSON in `X-Layer-Context`. `X-Turnstile-Token` wird für jede neue Phase frisch geprüft. CORS erlaubt nur die bestehende App-Origin. OPTIONS gibt das Protokoll `review-v2` über einen lesbaren Header bekannt; ein alter Worker kann deshalb beim neuen Analyseaufruf nicht versehentlich sofort generieren.

- **analyze**: optionale Nutzerhinweise und Saisons als sekundärer Kontext. Vision erkennt sichtbare Merkmale, bei Bedarf formatiert Llama 4 Scout JSON. Ergebnis: editierbare Vorschau und HMAC-signiertes Analyse-Ticket. Kein Bildgenerator wird aufgerufen.
- **generate**: explizit `confirmed: true`, gültiges Ticket, zum Ticket passendes Referenzfoto und geprüfte editierte Metadaten. Der signierte visuelle Prompt kann nicht durch Client-Prompts ersetzt werden. Die Metadaten dienen als sekundärer Kontext; sichtbare Fotodetails haben Vorrang. FLUX bekommt Prompt und Referenz. Keine zusätzliche Analyse erforderlich.

Das Ticket ist eine Stunde gültig und mit dem Referenzbild-Hash verknüpft. Signierschlüssel wird per domänenspezifischem HMAC aus dem bereits vorhandenen Runtime-Secret abgeleitet; Secret-Werte werden nie veröffentlicht. Nach Ablauf erneut analysieren. Tickets ersetzen Turnstile und Limits nicht.

## Schutz und Betrieb

Runtime-Secret `TURNSTILE_SECRET` erforderlich. Siteverify muss Erfolg, Hostname `mylo1908.github.io` und Action `layer_prettify` bestätigen. Fehlende/ungültige/abgelaufene/wiederverwendete Tokens werden ohne Modellaufrufe abgelehnt. IP-Limit und gemeinsamer Standort-Bucket bleiben bestehen (je 3 Anfragen/Minute). Zwei erfolgreiche Phasen verbrauchen zwei Anfragen. Der gemeinsame Bucket ist kein strikt weltweiter Tageszähler.

Kein OAuth-Neuversuch, kein Tarifwechsel und keine neue Infrastruktur nötig. Vorhandene GitHub-Build-Integration veröffentlicht den Worker. Alte Clients ohne Phasen-Header erhalten eine Aufforderung zum App-Update, kein automatisch generiertes Bild.

## Daten und Wiederaufnahme

Saison-Arrays und Layering werden zusätzlich zum kompatiblen alten Saisonfeld gespeichert. Ältere Datensätze werden beim Lesen normalisiert; Bilder werden nicht verändert. Analyse, Nutzerhinweise, editierte Werte, Referenz, Ticket und erzeugte Zwischenbilder werden lokal als Entwurf gespeichert. Beim Wiederöffnen startet keine Generierung automatisch. Bereits erzeugte Bilder können ohne neue KI-/Turnstile-Anfrage freigestellt und gespeichert werden. Speicherung verwendet eine stabile Kleidungs-ID, damit Wiederholungen keine Duplikate anlegen.

## Verifikation

Automatisierte Tests prüfen Phasentrennung, Foto-/Ticketbindung, Ablauf/Tampering, Metadatenbearbeitung, Turnstile-Fehler, MIME-Typen, Saisons/Layering, Backups und ältere Daten. Browserprüfung mit Mock-KI/Mock-Turnstile: Foto und Hinweise nach Neuladen erhalten; Analyse-Vorschau bei null Generierungen; Bearbeitungen nach Neuladen erhalten; genau eine Generierung nach Klick; lokale echte Freistellung und transparente Speicherung; alle bearbeiteten Felder und genau ein neues Stück nach Neuladen erhalten. Für diese Prüfung wurde keine neue Live-KI-Generierung verbraucht.

Die eigentlichen Cloudflare-Modelle, Referenzübergabe, lokale IS-Net-Freistellung und echte Turnstile-Validierung wurden in der vorherigen Version erfolgreich live geprüft. Die neuen getrennten Worker-Zweige werden gezielt mit kontrollierten Modellantworten geprüft. Ein zusätzlicher echter KI-Test ist bei einem konkret auftretenden Providerfehler sinnvoll, nicht als Wiederholungsschleife. Referenztreue bleibt bei Text/Logos begrenzt; ein echtes Kleidungsfoto war für die ursprünglichen Tests nicht verfügbar.

### Nachbesserung
`generate` akzeptiert optional `refinement` (1–1000 Zeichen). Signierte Analyse, Fotobindung, Bestätigung, frischer Turnstile-Token und Rate-Limits gelten unverändert. Die Kritik ist nicht vertrauenswürdiger sekundärer Kontext und darf nur dasselbe Kleidungsstück gezielt korrigieren; das Original bleibt die maßgebliche Referenz. Der Client speichert Generierungen ausschließlich als Entwurf bis zur endgültigen Übernahme.

### Outfit-Auswahl
POST `/outfit`, `Content-Type: application/json`, `X-Turnstile-Token`; Body: `{wish,items,filters,usedIds,preferFavorites}`. Nur begrenzte Metadaten (max. 200 Kandidaten, 160 KB Body), keine Bilder. Gemeinsame Siteverify-Prüfung mit korrektem Host/Action, fehlendes Secret fail-closed, bestehende IP-/Standort-Budgets. Textmodell `@cf/meta/llama-3.2-3b-instruct`; keine externen Anbieter oder kostenpflichtigen Upgrades. Modell-IDs werden gegen erneut gefilterte Kandidaten, Wünsche, Eindeutigkeit und Layering-/Outfitstruktur geprüft. Falsches Schema, Anbieterfehler oder unmögliche Auswahl liefern einen festen Fehler und erlauben den ausdrücklich gekennzeichneten lokalen Rückfall. OPTIONS meldet `outfit-v1`, `poses-v1` und `refinement-v1`. Grenzen: keine serverseitige Kopie der lokalen IndexedDB, kein weltweites hartes Tagesbudget.

Die Outfit-Antwort nutzt ein JSON-Schema mit kurzen Kandidatenkennungen (`g0` usw.). Der Worker ordnet sie den ursprünglichen IDs zu und prüft danach weiterhin alle Outfitregeln. Fehler melden die Phase `model`, `format` oder `selection` mit festen Kategorien, niemals rohe Modell-/Anbieterdiagnostik oder Geheimnisse.
