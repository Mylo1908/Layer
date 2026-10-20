# Layer 1.4.0 – Photo First

Echte Kleidungsfotos aufnehmen/auswählen, lokal freistellen, Original vergleichen und bestätigen. Metadaten manuell bearbeiten oder optional analysieren lassen. Layer erzeugt keine neuen Kleidungsbilder; alte Bilder bleiben erhalten.

## Start und Build

Node.js LTS: `npm ci`, `npm run dev`. Produktion: `npm test`, `npm run build`. Der Build prüft Frontend und Worker und erzeugt `dist/` mit Quellcodearchiv, Offline-Shell und Lizenzen. Modelle liegen in `public/models/` und werden aus dem vorhandenen Projekt übernommen, bevor nötigenfalls der begrenzte Modell-Download verwendet wird.

## Daten

IndexedDB `layer-wardrobe`, Schema 3, Backupformat 1 bleiben erhalten. Der Import wird vor der gemeinsamen Transaktion validiert; Fehler brechen alle Schreibvorgänge ab. Kleidung, Originale, alte generierte Bilder, Zusatzfotos, Kaufpreise, Outfits, Collagen, Kalender und Tragehistorie bleiben kompatibel. Ältere `automatic-new`-Entwürfe sind ausdrücklich anhand des Originals wiederaufnehmbar; ihre bisherigen Bilder und Angaben bleiben im alten Entwurf gespeichert.

## Fotos und KI

Ein Hauptfoto plus drei Zusatzperspektiven. Freistellung und einfache Alternative laufen lokal; nur die Alpha-Maske wird auf die unveränderten Foto-RGB-Werte angewandt. Ergebnisse immer prüfen. Das Original ist ein sicherer Rückfall. Die optionale Metadatenanalyse überträgt eine verkleinerte Referenz sowie ausdrücklich eingegebene Hinweise, nie Kaufpreise. Vorschläge sind separat auswählbar; manuelle Korrekturen sind zunächst abgewählt. Die Outfit-KI erhält nur begrenzte Kleidungsmetadaten, keine Bilder, Kaufpreise oder persönlichen Notizen. Turnstile und Limits bleiben verpflichtend.

## Collagen und bestehende Funktionen

Drei Layouts, manuelle Bearbeitung, Undo/Redo und PNG bleiben erhalten. Neue Collagen erhalten eine dünne weiße Alpha-Kontur; alte sind ohne ausdrückliche Änderung randlos. Die Kontur ist nur Darstellungs-/Exportoption und verändert keine gespeicherten Kleidungsbilder. Favoriten, Accessoires, Layering, Kalender, Statistiken und Cost-per-Wear bleiben vorhanden.

## Grenzen und Prüfung

Masken können bei Schmuck, Fasern und ähnlichen Vorder-/Hintergrundfarben Fehler enthalten. Material, Marken und Farbwerte sind nur bei ausreichender Grundlage gesichert. Browser können lokale Daten entfernen; regelmäßige Backups bleiben nötig. Die Testseite `insights-check.html` verwendet synthetische Bilder und getrennte Datenbanknamen. Prüfergebnisse, Auditumfang und verbleibende Risiken stehen in `docs/AUDIT_1.4.md`.
