# Technischer Aufbau

## Datenfluss

Kamera/Fotoimport → lokale Canvas-Normalisierung → lokale KI im Web Worker
oder Rand-Freistellung/Pinsel → transparenter Beschnitt → IndexedDB.
Outfits referenzieren Kleidungs-IDs und speichern ihre Ebenenparameter.

Es gibt keinen Backend-Server und keinen Foto-Upload. Alle Laufzeitdateien,
einschließlich der KI-Modelle, werden von der eigenen HTTPS-Website geladen.
Keine Analytik, externen Schriftarten oder kostenpflichtigen APIs.

## Dateien

| Datei | Aufgabe |
| --- | --- |
| `src/App.tsx` | Schrank, Suche, Kategorien, Favoriten, Outfitübersicht |
| `src/components/PhotoEditor.tsx` | Kameraimport, Freistellung, Pinsel, Metadaten |
| `src/components/OutfitEditor.tsx` | Layer-Collage, Gesten, Reihenfolge, Undo/Redo, PNG |
| `src/components/Settings.tsx` | Backups, Offline-KI, Installation, Quellcode |
| `src/db.ts` | IndexedDB, Validierung, Import/Export, referenzielle Bereinigung |
| `src/cutout.worker.ts` | IMG.LY/IS-Net-Berechnung außerhalb der Oberfläche |
| `src/images.ts` | Bildnormalisierung, Beschnitt, Worker-Protokoll, Download |
| `src/logic.ts` | Kategorienvorschläge, Outfit-Regeln, Rand-Flood-Fill |
| `public/sw.js` | Versionierter Offline-Shell-Cache, separater Modell-Cache |
| `scripts/prepare-models.mjs` | Modelle aus fertigem Build übernehmen / nachladen |
| `scripts/download-models.mjs` | Versionsgebundene Modell-/WASM-Dateien laden |
| `scripts/prepare-source.mjs` | Quellcode-Angebot beim Build erneuern |
| `scripts/precache.mjs` | Hash und Shell-Dateiliste im Service Worker erzeugen |

## Koordinaten und Ebenen

Die Collage ist intern 600×750 Einheiten groß und im UI proportional skaliert.
Jede Ebene hat Mittelpunkt x/y, Breite, Drehung, Sperrstatus und Kleidungs-ID.
Die Bildhöhe folgt dem Seitenverhältnis des freigestellten Bilds.
Array-Reihenfolge = Ebenenreihenfolge von hinten nach vorne. So können mehrere
Oberteile ohne besondere Kategorienbeschränkung überlagert werden.
Der PNG-Export rendert dieselben Transformationen auf 1200×1500 Pixel.

## Speicher und Backups

Die Datenbank `layer-wardrobe` hat Stores `garments` und `outfits`.
Kleidung enthält Original-, unbeschnittenes Bearbeitungs- und beschnittenes
Anzeigebild als Blob. Das Bearbeitungsbild erhält die Geometrie für präzises
Rückmalen aus dem Original. Backups serialisieren die Blobs als Data-URLs.
Vor einem Import werden Format, Typen, eindeutige IDs, Referenzen, numerische
Werte und Bild-MIME-Typen geprüft. Der Schreibvorgang ist eine Transaktion.
Einträge mit gleicher ID werden ersetzt, andere behalten ihre Identität.

## Safari und Offline

Die App benötigt keine COOP-/COEP-Serverheader. ONNX läuft CPU/WASM und kann
ohne SharedArrayBuffer auf einen Thread zurückfallen. Der eigene Worker hält
die React-Oberfläche unabhängig von der Modellberechnung.
Worker werden nach jedem Ergebnis/Fehler beendet, um KI-Arbeitsspeicher freizugeben.

Der Service Worker speichert die gesamte Oberfläche inklusive Worker-Chunks.
KI-Modelle werden beim Laden separat gecacht; über die Einstellungen können
alle erforderlichen Modell-/WASM-Dateien vollständig vorbereitet werden.
Update-Versionen aktivieren sich erst nach dem Schließen der alten App-Fenster.

Offline gilt nach vollständigem erstmaligem Laden, solange Browserdaten erhalten
bleiben. Die App bietet Backup-Export und eine Anfrage für persistenten Speicher.
Ein Speicher-/Quota-Fehler wird angezeigt; persistente Aufbewahrung hängt von
Safari ab und wird nicht garantiert.
