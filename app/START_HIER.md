# In wenigen Schritten auf dein iPhone

## 1. ZIP auf deinem Windows-Laptop entpacken

Rechtsklick auf `Layer-PWA.zip` → **Alle extrahieren**. Öffne den entpackten
Projektordner. In `dist` ist die **fertige Website**, inklusive KI-Modell und
aller Offline-Dateien. `index.html` per Doppelklick zu öffnen reicht für eine
PWA nicht: Sie benötigt einen Webserver und für das iPhone HTTPS.

Für diese schnelle Installation brauchst du weder Node.js noch Android Studio.

## 2. Kostenloses HTTPS über GitHub Pages

Stand 14.10.2026: GitHub Pages ist bei **GitHub Free für öffentliche Repositories**
verfügbar. Die kostenlose `github.io`-Adresse unterstützt HTTPS. Keine eigene
Domain und kein bezahlter Plan erforderlich. Ein kostenloses GitHub-Konto ist
nur für die Veröffentlichung erforderlich; die App selbst verlangt kein Konto.

1. Öffne <https://github.com/> und melde dich mit einem kostenlosen Konto an.
2. Wähle **New repository**. Name beispielsweise **layer**.
3. Wähle **Public**. Kein Upgrade, keine Testphase und kein Private-Repository wählen.
4. Aktiviere **Add a README file** und klicke **Create repository**.
5. Im Repository: **Add file → Upload files**.
6. Öffne auf Windows den Ordner **`dist`**. Markiere dessen **gesamten Inhalt**,
   also `index.html`, `assets`, `models`, `icons`, `manifest.webmanifest`, `sw.js`,
   `source.zip`, `licenses` und `.nojekyll`, und ziehe ihn in die Upload-Fläche.
   Lade die Ordner mit ihren Unterordnern hoch; ihre Struktur muss erhalten bleiben.
   **Nicht den äußeren Projektordner und nicht den Ordner `dist` selbst hochladen.**
7. Warte auf alle Uploads und klicke **Commit changes**, direkt auf `main`.
8. Öffne **Settings → Pages**.
9. Unter **Build and deployment → Source** wähle **Deploy from a branch**.
10. Unter **Branch** wähle **main** und **/(root)**. Klicke **Save**.
11. Nach der Veröffentlichung erscheint dort die tatsächliche Website-Adresse,
    typischerweise `https://DEINNAME.github.io/layer/`. Öffne **Visit site**.
12. Nutze HTTPS; **Enforce HTTPS** ist bei der `github.io`-Adresse normalerweise aktiv.

Die KI-Dateien sind in kleine Dateien aufgeteilt. Alle Upload-Dateien bleiben unter
GitHubs Browser-Grenze von 25 MiB pro Datei; es sind weniger als 100 Dateien.
Die Website bleibt weit unter dem Pages-Limit von 1 GB.

Veröffentlicht werden **nur App-Code und allgemeine KI-Dateien**. Deine Kleidung,
Outfits und Backups gehören **nicht** in dieses öffentliche Repository. Sie
entstehen erst auf deinem Gerät und werden von der App nicht übertragen.

Offizielle Quellen:

- Kostenloser Plan / Pages-Limits: <https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits>
- HTTPS: <https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https>
- Uploads: <https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository>

## 3. Auf deinem iPhone installieren

1. Öffne die **veröffentlichte HTTPS-Adresse in Safari** auf deinem iPhone.
2. Warte, bis die App geladen ist und unten **Offline bereit** steht.
3. Tippe auf **Teilen**, ggf. zunächst auf das Menü mit den drei Punkten / **Mehr**.
4. Scrolle zu **Zum Home-Bildschirm**.
5. Falls angezeigt: **Als Web-App öffnen** aktivieren.
6. Name **Layer** lassen, dann **Hinzufügen**.
7. Öffne ab jetzt das **Layer-Icon auf deinem Home-Bildschirm**.
8. In Layer: **Einstellungen → KI offline vorbereiten**. Im WLAN warten, bis
   „KI-Dateien sind offline gespeichert“ erscheint (ca. 56 MB).
9. Optional **Beständigen Speicher anfragen** antippen. Safari entscheidet darüber.

Apple-Anleitung: <https://support.apple.com/guide/iphone/bookmark-a-website-iph42ab2f3a7/ios>

## 4. Deine ersten Kleidungsstücke

1. **Kleidung hinzufügen** oder das Plus unten antippen.
2. **Fotografieren**: iPhone-Kamera wählen. Oder **Foto wählen** für die Fotomediathek.
3. Kleidung flach hinlegen, komplett abbilden, gut beleuchten.
4. Das Bild wird lokal verkleinert und automatisch mit KI freigestellt.
5. Bei Bedarf **Radieren** oder **Zurückmalen** und die Pinselgröße nutzen.
6. Für ruhige, einfarbige Hintergründe ist **Einfach** mit Toleranzregler eine
   schnellere Alternative. **Original** setzt die Freistellung zurück.
7. Gib einen Namen ein. „Weißes Longsleeve“ oder „Strickpullover“ schlägt eine
   Kategorie vor. Die Kategorie kannst du jederzeit selbst wählen.
8. Farbe, Saison, Notizen ergänzen und **Stück speichern**.

## 5. Longsleeve unter Strickpullover

1. Beide Teile vorher fotografieren und speichern.
2. **Outfits → Outfit erstellen** öffnen.
3. **Hinzufügen** → Longsleeve wählen.
4. Noch einmal **Hinzufügen** → Pullover wählen.
5. In der Ebenenliste steht der Pullover **über dem Longsleeve**. Bei Bedarf
   auswählen und **Vor** oder **Zurück** antippen.
6. Longsleeve auswählen und ein Stück nach unten ziehen. Falls nötig größer machen.
7. Pullover darüber platzieren und etwas kleiner machen. So bleibt der Saum
   des Longsleeves im Gürtelbereich sichtbar.
8. Ein Finger verschiebt; zwei Finger auf demselben Stück vergrößern/verkleinern
   und drehen. Regler und Pfeile ermöglichen kleine, genaue Änderungen.
9. Weitere Teile ergänzen. Es gibt keine Beschränkung auf ein Oberteil.
10. Outfitnamen eingeben und **Outfit speichern**. In der Übersicht wieder öffnen,
    weiter bearbeiten oder als PNG exportieren.

Das ist eine frei gestaltbare Collage deiner Kleidung, keine Simulation von
Stoffverhalten. Wie viel vom Longsleeve sichtbar ist, bestimmst du mit Position
und Größe der zwei freigestellten Bilder.

## 6. Offline und Backups

Teste nach der Einrichtung: Flugmodus einschalten, Layer schließen und erneut
über das Home-Bildschirm-Icon öffnen. Öffne deinen Schrank, ändere ein Outfit
und speichere es. Mit vorbereiteten KI-Dateien kannst du auch offline freistellen.

Vor vielen neuen Fotos und regelmäßig danach:
**Einstellungen → Backup exportieren → in „Dateien“ sichern**.
Ein Backup enthält alle Original- und bearbeiteten Bilder sowie die Outfits.
Mit **Importieren** kannst du es auf einem anderen Gerät wieder einlesen.
Gleiche IDs werden ersetzt, andere bestehende Einträge bleiben erhalten.

Die App synchronisiert nicht automatisch. Browserdaten löschen, Speicherbereinigung
oder ein Gerätewechsel können die lokale Sammlung entfernen. Website-Speicher
ist grundsätzlich begrenzt und ohne Backups keine dauerhafte Garantie.
Siehe <https://webkit.org/blog/14403/updates-to-storage-policy/>.

## 7. Häufige Probleme

**Leere Seite / 404:** Prüfe, dass `index.html` im Repository ganz oben liegt und
nicht in einem Ordner `dist`. Unter Pages müssen `main` und `/(root)` ausgewählt sein.

**KI-Dateien fehlen:** Den gesamten Ordner `models` mit allen Dateien hochladen.
Der Build enthält keine Remote-API-Ausweichlösung; fehlende Dateien müssen ergänzt werden.

**KI langsam / fehlgeschlagen:** Aktuelles iOS verwenden, andere speicherintensive
Apps schließen und Kleidung auf ruhigem Hintergrund fotografieren. Alternativ
„Einfach“ und den Pinsel nutzen. Arbeitsspeicher und Fotoqualität begrenzen die KI.

**Neue Version wird nicht sichtbar:** App schließen, ebenso alle Safari-Tabs mit
Layer. Dann erneut öffnen; offline gespeicherte Versionen wechseln erst nach dem
Schließen der alten Fenster. Vor einer manuellen Bereinigung unbedingt Backup erstellen.

**Offline geht nicht:** Erst im WLAN vollständig laden, auf „Offline bereit“ warten,
die KI-Dateien separat speichern und anschließend erneut testen. Nicht im Privatmodus verwenden.

**Schrank im Safari-Tab anders als im Home-Icon:** Möglich bei unterschiedlichen
Speicherbereichen. Backup im bisherigen Bereich exportieren und im Zielbereich importieren.

**Windows möchte npm.ps1 ausführen:** Benutze die mitgelieferten `.cmd`-Dateien
oder die Eingabeaufforderung `cmd`, statt die PowerShell-Ausführungsrichtlinie zu ändern.

## 8. Später den Code ändern

Lies `README.md`. Node.js LTS kostenlos installieren, `Windows_Start.cmd` öffnen,
Quellcode in `src` bearbeiten. `Windows_Build.cmd` erzeugt eine neue `dist`-Version
mit aktuellem Quellcode-Download. Lade dessen Inhalt anschließend wieder in
dein GitHub-Repository hoch. Website-Adresse gleich lassen, damit lokale Daten
unter derselben Herkunft erreichbar bleiben.

Die KI-Modell-Dateien liegen im Lieferpaket platzsparend nur in `dist/models`.
Der erste Entwicklungsstart/Build übernimmt sie automatisch nach `public/models`.

Die Preise und Limits wurden am 14.10.2026 offiziell geprüft. Es gibt in dieser
App keine Funktion, die später zwangsläufig ein kostenpflichtiges Abo oder eine
bezahlte API benötigt. Anbieterbedingungen für kostenloses Hosting können sich
in Zukunft ändern; die App und ihre Daten bleiben exportierbar.
