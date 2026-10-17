# Layer

Dein digitaler Kleiderschrank mit KI-Produktbildern und Outfits aus mehreren Schichten.

**App:** https://mylo1908.github.io/Layer/

## Foto → Analyse → Bestätigung

1. Ein Kleidungsstück fotografieren oder auswählen.
2. Optional Hinweise und mehrere passende Saisons ergänzen.
3. **Nur analysieren** erstellt eine Vorschau, noch kein Produktbild.
4. Name, Kategorie, Farbe, Beschreibung, Saison und Layering prüfen und bei Bedarf bearbeiten.
5. Erst **KI-Bild erstellen** startet die neue Bildgenerierung. Layer stellt das Ergebnis lokal frei und sichert es als Entwurf.
6. Referenz und KI-Bild vergleichen; bei Bedarf mit Freitext nachbessern.
7. Erst **Übernehmen** speichert das Ergebnis im Kleiderschrank.

Es gibt keine manuellen ChatGPT-, Prompt-, JSON- oder Bildimport-Zwischenschritte. Eine Turnstile-Sicherheitsprüfung schützt Analyse und Generierung. Das Foto ist die Hauptquelle; Zusatzinfos dienen als ergänzender Kontext. Referenztreue ist insbesondere bei Logos, Schrift und feinen Mustern nicht garantiert.

Entwürfe, bestätigte Zwischenbilder, Originale und die Sammlung liegen lokal in IndexedDB. Wiederaufnahme erzeugt kein weiteres Bild, wenn bereits eines im Entwurf gespeichert ist. Ältere einwertige Saisonangaben und bestehende Bilder bleiben kompatibel. Backups erhalten neue und alte Metadaten.

Oberteile können **Layer unten**, **Layer oben**, **Layer unten oder oben** oder **Nicht relevant** sein. Die Outfit-Vorschläge berücksichtigen diese Auswahl und Saison-Mehrfachauswahlen.

## Entwicklung und Veröffentlichung

`app/` enthält React/TypeScript, Worker und Tests. Mit Node.js LTS: `npm --prefix app ci`, `npm --prefix app test`, `npm --prefix app run build`. Den Inhalt von `app/dist/` ins Repository-Hauptverzeichnis übernehmen. `source.zip` und Service Worker werden beim Build erzeugt. Modell-/WASM-Dateien unter `models/` werden weiterverwendet und nicht verändert.

Worker: `app/cloudflare/worker.ts`. Beide Phasen bleiben durch Turnstile und IP-/gemeinsame Standort-Limits geschützt. Die Bildgenerierung verlangt zusätzlich eine signierte, zum Foto passende Analyse und eine explizite Bestätigung. Das ist kein strikt weltweites Tagesbudget. Kein kostenpflichtiger Dienst wurde aktiviert.

Regelmäßig Backups exportieren. „App aktualisieren“ übernimmt neue Versionen ohne die Sammlung zu löschen. Browserdaten löschen oder Gerätewechsel kann lokale Daten entfernen. Kein Test auf einem echten iPhone; Kamera, Touch und Installation dort separat prüfen.

Lizenz: AGPL-3.0-or-later; Drittanbietertexte unter `licenses/`. Weitere technische Hinweise: [Worker-Dokumentation](app/cloudflare/README.md).

## Ergebnis prüfen und nachbessern
Nach Erstellung und lokaler Freistellung bleibt das Ergebnis als Entwurf in einer Vergleichsansicht. Erst **Übernehmen** speichert das Kleidungsstück im Kleiderschrank. Referenz, Ergebnis, Kritik und Revision bleiben beim Schließen/Neuladen erhalten. Nachbessern verwendet die bestehende Analyse, das Originalfoto und die aktuelle Kritik; es führt keine erneute Analyse aus. Frühere Ergebnisse können wiederhergestellt werden. Nach Ablauf der einstündigen Analysefreigabe kann sie separat erneuert werden, ohne das Bild zu verwerfen. Jede neue Generierung benötigt ein frisches Turnstile-Token und bleibt rate-limitiert. Keine automatischen Wiederholungsschleifen.

Die Nachbesserung verwendet aus Kompatibilitätsgründen Analyse + Originalreferenz + Kritik statt eines zusätzlichen generierten Referenzbildes. Exakte Drucke/Farben und die Beachtung jeder Kritik sind modellbedingt nicht garantiert; die finale Entscheidung bleibt beim Nutzer. Kleidungsdetails bieten eine Großansicht mit Produkt-/Originalumschaltung.

Validierung dieses Updates: automatisierte Worker-/Persistenztests und isolierter Browser-Review mit Mock-Generierung und Mock-Freistellung; vorhandene Live-Modell- und echte IS-Net-Tests werden wiederverwendet. Keine zusätzliche kostenpflichtige oder unnötige Live-Generierung.
