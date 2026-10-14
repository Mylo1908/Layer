# Layer

Dein lokaler digitaler Kleiderschrank: fotografieren, automatisch mit KI freistellen und Outfits mit mehreren Kleidungsschichten erstellen.

**App öffnen:** https://mylo1908.github.io/Layer/

Neue Fotos werden automatisch verarbeitet. Nach dem KI-Fortschritt erscheint die freigestellte Vorschau; anschließend Name/Kategorie ergänzen und speichern. Kleine isolierte Hintergrundreste werden automatisch entfernt. Die manuellen Werkzeuge sind optional.

Die KI läuft lokal im Browser. Es gibt keine Foto-Uploads, API-Schlüssel oder bezahlten KI-Dienste. Ergebnisse hängen vom Foto und vom Gerät ab.

- `app/`: vollständiger React-/TypeScript-Quellcode, Tests, Windows-Anleitungen und Build-Skripte.
- `models/`: vollständige KI-Modell-/WASM-Dateien am erwarteten App-Pfad.
- `source.zip`: aktueller herunterladbarer Quellcode.
- Die vorhandenen `models-Teil-1`/`models-Teil-2`-Ordner bleiben für ältere App-Versionen erhalten.

Entwicklung: im Ordner `app` mit Node.js LTS `npm ci`, `npm run dev`, `npm test`, `npm run build`. Die Modelle werden aus dem übergeordneten `models`-Ordner übernommen. Der fertige Inhalt von `app/dist` gehört für GitHub Pages ins Repository-Hauptverzeichnis.

Neue Versionen: App und alle Safari-Tabs mit Layer schließen und neu öffnen. Wenn „App aktualisieren“ erscheint, antippen. Die lokal gespeicherte Sammlung wird dadurch nicht gelöscht. Regelmäßig Backups exportieren.

Validierung: 25 automatisierte Tests, TypeScript-/Produktions-Build und vollständige lokale Worker-Bildverarbeitung mit echtem IS-Net/WASM bestanden. Kein Test auf einem echten iPhone; Kamera, Touch und Installation dort beim ersten Gebrauch prüfen.

Projektlizenz: AGPL-3.0-or-later. Drittanbieterhinweise stehen in `licenses` und im Quellcode.
