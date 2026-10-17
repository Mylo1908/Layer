# Automatisches Layer Prettify

Implementiert und direkt gegen den öffentlichen Worker getestet; der vollständige Browserablauf und ausreichender Missbrauchsschutz sind noch offen. `app/public/ai-config.json` ist absichtlich leer: Solange kein funktionierender Dienst hinterlegt ist, bleibt der bisherige ChatGPT-Import verfügbar. Kein Demo-Ergebnis wird als echte KI-Generierung ausgegeben.

## Verifizierter Zwischenstand vom 17.10.2026

- Worker-Commit `58d81f240a6e7f595f58425e019f65aaa5081544`: Cloudflare Workers Builds meldet Erfolg. Der öffentliche OPTIONS-Aufruf bestätigt `X-Layer-Worker-Version: diagnostics-20261017-1`.
- Ein gültiger POST mit einer synthetischen blauen T-Shirt-Referenz lieferte HTTP 200, gültige Metadaten und ein neues, dekodierbares JPEG (1024 × 1024). Das Ergebnis ist kein freigestelltes PNG; Freistellung erfolgt erst im Browser. Visuelle Abweichung: weißer Kragen ergänzt. Noch kein Test mit echtem Kleidungsfoto.
- Vorherige POSTs lieferten `MODEL_UNAVAILABLE` in `analysis`; der erfolgreiche Test belegt keine dauerhaft fehlerfreie Verfügbarkeit.
- 38 Tests und Produktions-Build bestanden. Speicherung/Entwürfe sind durch automatisierte Tests geprüft, ein vollständiger automatischer Browserablauf einschließlich echter IS-Net-Freistellung und Wiederladen ist noch nicht nachgewiesen. Der isolierte lokale Server war aus dem Cloud-Browser nicht erreichbar.
- Fremde Origin liefert HTTP 403. Origin/CORS plus drei Anfragen je Minute/IP/Standort verhindern keinen verteilten Kontingentmissbrauch. Tarif/Tageskontingent sind ohne Betreiberzugriff nicht verifiziert. Öffentliche Aktivierung bleibt ausgesetzt.
- Vor Aktivierung: serverseitig validierten Turnstile-Schutz mit Betreiberkonfiguration oder gleichwertige Zugriffskontrolle einrichten, anschließend vollständigen Browserablauf mit Wiederaufnahme und gespeichertem KI-Zwischenergebnis testen. Keine weiteren OAuth-Versuche erforderlich; Worker-Änderungen werden über GitHub automatisch deployt.

## Ablauf

Foto auswählen → Browser verkleinert die Referenz auf maximal 511 Pixel → Worker analysiert sie mit Llama 3.2 Vision → validiert Namen/Kategorie/Farbe/Bildauftrag → FLUX.2 klein 4B erzeugt ein neues Produktbild aus **Bildauftrag und Referenzfoto** → Browser entfernt den Hintergrund mit IS-Net → prüft Transparenz → speichert automatisch das Ergebnis im Kleiderschrank. Das Original bleibt getrennt gespeichert. Es ist keine manuelle Prompt-Übergabe, kein Nutzerkonto und kein API-Schlüssel für App-Nutzer nötig.

KI kann Details verändern, insbesondere Logos, Schrift und Muster. Der echte Modelltest ist vor Aktivierung erforderlich. Die App muss während der Verarbeitung geöffnet bleiben; mobile Browser garantieren keine Hintergrundausführung. Entwürfe und generierte Zwischenbilder bleiben lokal erhalten, sodass nach einem Fehler beim Freistellen kein weiteres Bild generiert werden muss.

## Einmalig vom Betreiber einzurichten

1. Ein Cloudflare-Konto mit **Workers Free** und Workers AI verwenden. Kein Upgrade auf einen kostenpflichtigen Tarif nötig. Cloudflare dokumentiert 10.000 kostenlose Neurons täglich; nach Verbrauch schlägt die Generierung bis zum Reset fehl. Das Kontingent gilt für das Betreiberkonto, nicht pro App-Nutzer. Limits/Modellverfügbarkeit im eigenen Konto prüfen.
2. Die Lizenz und Acceptable Use Policy für Llama 3.2 Vision lesen und selbst akzeptieren. Cloudflare verlangt dafür eine initiale Modellanfrage mit `{"prompt":"agree"}`. Die offizielle Anleitung steht unter https://developers.cloudflare.com/workers-ai/guides/tutorials/llama-vision-tutorial/. Der Worker nimmt diese Zustimmung nicht automatisch vor. Auch die FLUX-Modellbedingungen prüfen.
3. Aus `app/cloudflare/` mit Node 22+ und Wrangler 4.36+ anmelden und veröffentlichen:

   ```sh
   npx wrangler@4 login
   npx wrangler@4 deploy
   ```

   Das OAuth-Login erfolgt im eigenen Browser. Keine API-Schlüssel in GitHub, Frontend-Konfiguration oder Chat schreiben. `wrangler.jsonc` enthält die AI-Bindung und die erlaubte Website-Origin.
4. Die ausgegebene Adresse um `/prettify` ergänzen. Zunächst lokal in `app/public/ai-config.json` eintragen, z. B. `{"endpoint":"https://layer-prettify.DEIN-SUBDOMAIN.workers.dev/prettify"}`. Für einen lokalen Browser-Test vorübergehend dessen Origin in Wrangler setzen und anschließend wieder `https://mylo1908.github.io` verwenden.
5. Ein echtes Kleidungsfoto testen: ein Upload ohne weitere Klicks, Analyse sinnvoll, neues Bild erzeugt, Schnitt/Farbe/Muster ausreichend erhalten, echter transparenter Hintergrund, automatisches Speichern und Wiederladen, Original separat vorhanden. Fehler bei Kontingent oder Freistellung dürfen kein Referenzfoto als Produktbild speichern.
6. Erst nach diesem Test die Konfiguration für GitHub Pages veröffentlichen: `npm --prefix app run build`, Inhalt von `app/dist/` in das Repository-Root kopieren und committen. `ai-config.json` wird absichtlich nicht durch den Service Worker gecacht. Mit leerem Endpoint lässt sich wieder auf den bisherigen Import umstellen.

## Betrieb und Grenzen

- Der Worker speichert/loggt keine Bilder oder Prompts; zur KI-Verarbeitung werden sie an Cloudflare übertragen. Die Website informiert darüber vor der Fotoauswahl. Cloudflares Datenverarbeitung richtet sich nach deren Bedingungen.
- Anfragen sind auf PNG, 2 MiB und 511 × 511 Pixel begrenzt; das Bildmodell erhält ausschließlich die serverseitig erzeugte Analyse und das Referenzfoto. Kein offener Prompt-/URL-Proxy.
- Das IP-Limit erlaubt 3 Versuche/Minute je Cloudflare-Standort. Es ist kein globales Kostenlimit. CORS ist keine Authentifizierung: Nicht-Browser-Clients können Origins nachahmen und kostenloses Kontingent verbrauchen. Für größere öffentliche Nutzung zusätzliche Zugriffskontrolle vorsehen. Auf Workers Free bleiben; keine automatische kostenpflichtige Erweiterung ist konfiguriert.
- Ein Browser-Timeout kann eine bereits laufende Modellanfrage nicht zurücknehmen. Nach Netzwerkabbruch kann ein erneuter Versuch erneut Kontingent verbrauchen.
- IS-Net lädt beim ersten Mal ungefähr 56 MB; Browser benötigt Worker und OffscreenCanvas. Nicht unterstützte Geräte erhalten einen Fehler statt eines falschen Produktbilds.
- Tests ersetzen die AI-Bindung durch kontrollierte Antworten und prüfen Reihenfolge, Referenzübergabe, Fehler, Größenlimit und Rate-Limit. Kein echter Modellaufruf ohne Betreiberkonto durchgeführt.

Quellen: https://developers.cloudflare.com/workers-ai/platform/pricing/ · https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/ · https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
