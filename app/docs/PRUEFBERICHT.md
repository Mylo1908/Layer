# Prüfbericht — 14.10.2026

## Tatsächlich ausgeführt

- TypeScript-Prüfung des gesamten Anwendungsquellcodes.
- Produktions-Build mit Vite inklusive ES-Modul-Worker.
- 12 automatisierte Node-Tests mit echter IndexedDB-API über fake-indexeddb:
  Kategorienvorschläge, mehrere Oberteile, Layer-Reihenfolge, Grenzen beim
  Ebenenwechsel, Rand-Freistellung einschließlich geschützter Innenflächen,
  1-Pixel-Grenzfall, Blob-Erhaltung, referenzielle Bereinigung beim Löschen,
  Import mit bestehenden Einträgen, Abweisung ungültiger Bilddaten vor
  Datenbankmutation, doppelte IDs/fehlende Referenzen/NaN und CSS-Injektion.
- Gebündeltes quantisiertes IS-Net-Modell mit ONNX Runtime Web unter Node
  geladen und eine CPU/WASM-Inferenz ausgeführt. Eingang `[1,3,1024,1024]`,
  Ausgang `[1,1,1024,1024]`; geprüfte Ausgabewerte endlich. Gemessene reine
  Inferenzzeit dieser Umgebung: etwa 18,2 Sekunden. Das ist kein iPhone-Benchmark.
- Zusätzliche Service-Worker-Tests für Offline-Navigation unter Repository-Pfad,
  cache-first Dateien, getrennten Modell-Cache und Verhalten bei vollem Cache.
- Paketprüfung: ZIP-Integrität, erforderliche Einstiegspunkte und Modell-Chunks,
  Offline-Dateiliste, relativer Basis-Pfad und Browser-Upload-Grenzen.

## Erkennbare Fehler behoben

- Worker-Ausgabe auf ES-Module gestellt, damit ONNX-Code-Splitting baubar ist.
- CPU-only ONNX-Bundle statt unnötiger WebGPU-Dateien verwendet.
- Produktionsausgabe vor Neubuild bereinigt, damit alte Chunks nicht mitgeliefert werden.
- Unbeschnittenes Bearbeitungsbild getrennt gespeichert, damit Rückmalen nach
  erneutem Öffnen geometrisch korrekt bleibt.
- Gesten auf einer aktiven Ebene gehalten; zweite Finger auf fremden Ebenen ignoriert.
- Cache-Schreibfehler blockieren erfolgreich geladene Inhalte nicht.
- Windows-kompatibler Testaufruf ohne erforderlichen Unix-IPC-Socket.

## Nicht auf echtem Gerät geprüft

Diese Umgebung stellt keinen freigegebenen Browser-QA-Zugang für dieses Projekt
und kein iPhone bereit. Deshalb keine Behauptung eines vollständigen Safari-,
Kamera-, Touch-, Installations- oder Home-Bildschirm-Tests. Insbesondere die
KI-Qualität bei echten Kleidungsfotos und die Speichernutzung auf deinem iPhone
müssen beim ersten Einrichten kontrolliert werden.

Empfohlener kurzer Abnahmetest auf deinem iPhone:

1. Home-Bildschirm-Installation, einmal online öffnen, KI offline vorbereiten.
2. Longsleeve und Pullover fotografieren; Freistellung prüfen und ggf. korrigieren.
3. Beide Teile in einem Outfit schichten, Longsleeve-Saum sichtbar platzieren.
4. Mit zwei Fingern skalieren/drehen, Ebenenreihenfolge ändern, speichern.
5. App schließen/öffnen, Outfit bearbeiten und PNG exportieren.
6. Backup exportieren und in einem zweiten Browserprofil importieren.
7. Flugmodus: App neu öffnen, gespeicherte Kleidung/Outfits prüfen, neues Foto
   einfach oder mit vorbereiteter KI freistellen und ein Outfit speichern.

GitHub-Veröffentlichung erfolgt durch dich mit dem mitgelieferten fertigen Build;
dieses Lieferpaket beansprucht keine bereits veröffentlichte Website-Adresse.

## GitHub-Reparatur

Modellpfade im Repository normalisiert, Ressourcenprüfung vor KI-Start ergänzt, automatische Fotofreistellung mit Fortschrittsanzeige und eindeutigem Erfolgsstatus. Manuelle Werkzeuge bleiben optional. Neue HTML-/Modellmetadaten werden online frisch geladen, Offline-Navigation bleibt erhalten. Zusätzliche Tests prüfen Modellressourcen und Online-Updates. Ein vollständiger Bildtest mit Canvas-Adapter in Node prüft echte Freistellung; ein iPhone-/Safari-Test bleibt separat erforderlich.

Die aktualisierte Prüfung umfasst 25 automatisierte Tests. Der vollständige Worker-Bildtest läuft mit echten IS-Net-/WASM-Dateien und einem lokalen Canvas-Adapter in Node. Bei einem synthetischen 600×600-Kleidungsbild blieb das Kleidungsstück erhalten; der Hintergrund wurde transparent. Kleine isolierte Maskenreste werden automatisch entfernt, getrennte große Teile (z. B. ein Schuhpaar) bleiben erhalten.
