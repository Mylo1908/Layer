# Layer — dein persönlicher Kleiderschrank

Eine funktionsfähige, unabhängige PWA für dein iPhone. React + TypeScript + Vite,
IndexedDB und lokale KI-Freistellung. Keine API-Schlüssel, keine App-Konten,
keine Abonnements. Dieses Projekt übernimmt deine beschriebenen Anforderungen
an den digitalen Kleiderschrank und das Layering. Es ist keine Alta-Daily-Kopie.

## Der schnellste Weg auf dein iPhone

Du brauchst für den fertigen Build **keine Entwicklungssoftware**.
Das ZIP enthält in **`dist` die bereits gebaute Website inklusive KI-Dateien**.

1. ZIP unter Windows per Rechtsklick → **Alle extrahieren** entpacken.
2. Lies **[START_HIER.md](START_HIER.md)**. Dort stehen die einzelnen Schritte für
   GitHub Pages, kostenloses HTTPS und die Installation auf deinem iPhone.
3. Lade den **Inhalt** von `dist` in ein öffentliches GitHub-Repository hoch.
4. Aktiviere GitHub Pages. Öffne dessen HTTPS-Adresse in Safari und füge sie
   deinem Home-Bildschirm hinzu.

Deine Kleidungsfotos werden **nicht** auf GitHub hochgeladen. Dort liegen nur
die allgemeinen App-Dateien. Deine Sammlung legst du später lokal in der App an.

## Enthaltene Funktionen

- Kameraaufnahme oder Fotoimport, lokal auf maximal 1.200 Pixel normalisiert.
- Automatische KI-Freistellung mit IS-Net, CPU/WASM in einem Web Worker.
- Einfache Freistellung für einfarbige Hintergründe plus Radier-/Rückmalpinsel.
- Automatischer Beschnitt transparenter Ränder und einheitliche Produktansicht.
- Kategorien, Namenssuche, Saisonfilter, Farbe, Notizen und Favoriten.
- Kategorienvorschlag anhand des Namens; manuelle Bildkategorisierung als Alternative.
- Beliebig viele Oberteile und andere Kleidungsebenen pro Outfit.
- Verschieben mit Maus/Finger, Zwei-Finger-Skalieren und -Drehen, Größen- und
  Drehregler, kleine Positionsschritte, Ebene nach vorn/hinten, Sperren,
  Duplizieren, Entfernen, Rückgängig/Wiederholen im Editor.
- Outfits speichern, erneut bearbeiten, duplizieren und als PNG exportieren.
- Regelbasierte zufällige Outfit-Vorschläge mit optionalem Layering.
- IndexedDB für Kleidung, Originalbilder, Bearbeitungsbilder und Outfits.
- Offline-Oberfläche durch Service Worker; KI-Dateien separat vollständig cachebar.
- JSON-Backup mit Bildern und Outfits; geprüfter Import in einer Datenbanktransaktion.
- App-Manifest, Home-Bildschirm-Icons, Safe-Area-Unterstützung, responsive Oberfläche.

## Unter Windows selbst entwickeln

Installiere kostenlos **Node.js LTS**, mindestens Node 22.12, von
<https://nodejs.org/>. Ein Mac ist nicht erforderlich.

Einfach: `Windows_Start.cmd` doppelklicken. Dann <http://localhost:5173/> öffnen.
Für einen neuen Produktions-Build: `Windows_Build.cmd` doppelklicken.

Oder in der **Eingabeaufforderung (cmd)** im entpackten Projektordner:

```bat
npm ci
npm run dev
```

Für Tests und fertige Website:

```bat
npm test
npm run build
```

Der Build übernimmt die KI-Dateien zunächst aus dem mitgelieferten `dist/models`
in `public/models`. Falls beide fehlen, lädt er sie einmalig von IMG.LY herunter.
Alle Dateien werden danach von deiner eigenen Website geladen. Der Quellcode-Download
der App wird beim Build automatisch erneuert; `node_modules` gehören nicht ins ZIP.

`npm run preview` zeigt den Produktions-Build auf <http://localhost:4173/>.
Nur dieser Produktions-Build registriert den Service Worker. Der Entwicklungsmodus
hat bewusst keine Offline-Registrierung, damit Änderungen sofort sichtbar sind.

## Grenzen, die du kennen solltest

- Die KI entfernt den Hintergrund. Sie erfindet kein neues Produktfoto,
  glättet keine Falten und simuliert nicht, wie das Outfit an deinem Körper sitzt.
- Freistellung hängt vom Foto ab. Kleidung vollständig, gut beleuchtet und möglichst
  vor kontrastierendem Hintergrund fotografieren. Schwierige Kanten per Pinsel korrigieren.
- Die Kategorie wird aus dem Namen vorgeschlagen, **nicht per Bilderkennungsmodell**.
- Outfit-Vorschläge folgen Kategorien und Zufall, keinem trainierten Styling-Modell.
- Empfohlen: aktuelle iOS-/Safari-Version, mindestens iOS 17. Die KI braucht
  OffscreenCanvas, Web Worker und WASM SIMD; bei Geräten mit wenig Arbeitsspeicher
  kann sie fehlschlagen. Einfache Freistellung und manuelle Korrektur bleiben nutzbar.
- Browser-Speicher ist keine garantierte Datensicherung. Regelmäßig Backups exportieren.
- Keine automatische Synchronisierung zwischen Windows, Safari und Home-Bildschirm-App.
  Benutze die installierte App für deine Sammlung; bei Bedarf per Backup übertragen.
- Die Website muss zum ersten Laden erreichbar sein. Offline funktioniert sie danach
  nur, solange Browser-Cache und lokale Daten nicht gelöscht werden.

## Projekt, Lizenz und Prüfung

- **[docs/REA_ANALYSE.md](docs/REA_ANALYSE.md)**: tatsächliche Nutzbarkeit des verlinkten GitHub-Projekts.
- **[docs/PRUEFBERICHT.md](docs/PRUEFBERICHT.md)**: ausgeführte Tests und verbleibende Gerätetests.
- **[docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md)**: Aufbau und Datenfluss.
- **[LICENSE.md](LICENSE.md)** und **[docs/THIRD_PARTY.md](docs/THIRD_PARTY.md)**: freie Lizenzen.

Projektlizenz: **AGPL-3.0-or-later**, passend zur IMG.LY-Bibliothek. In den
Einstellungen der veröffentlichten App steht ein vollständiger Quellcode-Download.
Behalte diesen und die Lizenztexte beim Weiterveröffentlichen bei.

Kosten-/Hosting-Angaben wurden am **14.10.2026** anhand der offiziellen Quellen
geprüft. Die hier verwendeten Funktionen benötigen keinen bezahlten Dienst.
Kostenlose Anbieter können ihre Bedingungen künftig ändern; eine unveränderliche
Hosting-Zusage für alle Zukunft kann dieses Projekt nicht geben.

## Aktualisierung: automatische Fotofreistellung

Neue Fotos werden automatisch mit KI freigestellt. Fortschritt und Ergebnis stehen direkt in der Vorschau. Manuelle Werkzeuge sind optional eingeklappt. Die KI-Dateien sind unter `models/` erreichbar, die Dateiliste wird geprüft. Bei neuen App-Versionen erscheint „App aktualisieren“. Die lokale Sammlung wird dabei nicht gelöscht.
