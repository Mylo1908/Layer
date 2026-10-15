# Layer

Dein lokaler digitaler Kleiderschrank: fotografieren, automatisch mit KI freistellen und Outfits mit mehreren Kleidungsschichten erstellen.

**App öffnen:** https://mylo1908.github.io/Layer/

ChatGPT Prettify ist der Hauptablauf: Foto wählen → Analyseauftrag mit Foto manuell in ChatGPT senden → JSON-Antwort übernehmen → individuellen Bildauftrag im selben Chat senden → neues transparentes KI-PNG importieren und speichern. Neue Stücke lassen sich erst nach dem Ergebnisimport speichern. Name, Kategorie und Farbe werden aus der Analyse vorgeschlagen.

Referenzfoto und Produktbild bleiben getrennt. Der Kleiderschrank und die Outfits nutzen das Produktbild. Entwürfe bleiben lokal in IndexedDB erhalten, auch nach dem Wechsel zu ChatGPT oder Neuladen. Nach Rückkehr „Kleidung hinzufügen“ öffnen.

Für automatische KI-Neuerstellung sind Client und privater Node-Server vorbereitet; Hosting und API-Zugang müssen noch eingerichtet werden. Fotos werden dann an den eigenen Server und OpenAI übertragen, API-Kosten fallen separat an. Anleitung: [app/server/README.md](app/server/README.md). Die Serveroberfläche ist für den manuellen Hauptablauf ausgeblendet. Ergebnisse bitte auf Abweichungen prüfen.

- `app/`: vollständiger React-/TypeScript-Quellcode, Tests, Windows-Anleitungen und Build-Skripte.
- `models/`: vollständige KI-Modell-/WASM-Dateien am erwarteten App-Pfad.
- `source.zip`: aktueller herunterladbarer Quellcode.
- Die vorhandenen `models-Teil-1`/`models-Teil-2`-Ordner bleiben für ältere App-Versionen erhalten.

Entwicklung: im Ordner `app` mit Node.js LTS `npm ci`, `npm run dev`, `npm test`, `npm run build`. Die Modelle werden aus dem übergeordneten `models`-Ordner übernommen. Der fertige Inhalt von `app/dist` gehört für GitHub Pages ins Repository-Hauptverzeichnis.

Neue Versionen: App und alle Safari-Tabs mit Layer schließen und neu öffnen. Wenn „App aktualisieren“ erscheint, antippen. Die lokal gespeicherte Sammlung wird dadurch nicht gelöscht. Regelmäßig Backups exportieren.

Validierung dieser Änderung: 29 automatisierte Tests inklusive Server-Zugang und Tageslimit mit simuliertem Bildanbieter; TypeScript-/Produktions-Build. Echte API-Bildgenerierung ist noch nicht getestet. Kein Test auf einem echten iPhone; Kamera, Touch und Installation dort beim ersten Gebrauch prüfen.

Projektlizenz: AGPL-3.0-or-later. Drittanbieterhinweise stehen in `licenses` und im Quellcode.

## Automatisches Prettify (vorbereitet)

Die automatische Foto → Analyse → Bildgenerierung → Freistellung → Speicherung ist implementiert. Ein Cloudflare-Worker mit Workers-AI-Bindung liegt unter `app/cloudflare/`. Der echte Dienst ist noch nicht verbunden; `ai-config.json` bleibt bis zum Modelltest leer. Die Live-App verwendet solange weiterhin den funktionierenden ChatGPT-Import. Einmaliges Betreiber-Setup, Kontingent und Tests: [app/cloudflare/README.md](app/cloudflare/README.md). Keine API-Schlüssel für Endnutzer erforderlich.
