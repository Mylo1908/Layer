# Layer 1.2

Dein digitaler Kleiderschrank mit KI-Produktbildern und Outfits aus mehreren Schichten.

**App:** https://mylo1908.github.io/Layer/

## Layer 1.2: Outfit-Kalender

Monats- und Wochenansicht beginnen am Montag und verwenden lokale Kalendertage. Gespeicherte Outfits lassen sich mehrfach pro Tag planen, mit Anlass und Notiz versehen, ändern und verschieben. **Heute tragen** am gespeicherten Outfit aktualisiert nach ausdrücklicher Bestätigung den heutigen Eintrag. Geplant ist nicht automatisch getragen; Markierungen sind rückgängig zu machen.

Schema 2 wird auf 3 erweitert, ausschließlich um `calendarEntries`. Historische Namen, Kleidungsstück-IDs, lokales Datum, Status und Zeitstempel bleiben auch nach Löschen des Originals erhalten. Ebenen und Hintergrund dienen als Vorschau, fehlende Referenzen werden angezeigt. Änderungen am Original verändern nicht rückwirkend die historischen Daten. Bilder werden nicht zusätzlich kopiert.

Backups bleiben Formatversion 1 mit optionalem `calendarEntries`. Alte Backups löschen keine vorhandenen Kalendereinträge. Datum, Status, Struktur und doppelte IDs werden vor der gemeinsamen Importtransaktion geprüft. Gleiche IDs werden wie bisher durch die Backup-Version ersetzt, andere Einträge bleiben bestehen. Der Kalender funktioniert lokal und offline ohne externe Kalenderdienste oder KI.

Validierung 1.2: 112 automatisierte Tests und Produktionsbuild erfolgreich, einschließlich v2-Migration mit erhaltenen Bildern/Outfits/Collagen, Mehrfacheinträgen, parallelem Heute-tragen, Statuswechsel, Wiederaufnahme, Referenzerhalt, alten/neuen Backups und Schaltjahr-/Zeitzonenlogik.

## Layer 1.1: lokaler Import und Collagen

**Kleidung hinzufügen** öffnet jetzt den schnellen lokalen Import: Kamera oder Datei wählen, optional freistellen, Name und Kategorie prüfen, übernehmen. Dateinamen liefern Vorschläge; Farbe, Saison und Beschreibung sind optional. Der ausführliche KI-Workflow bleibt als Alternative verfügbar.

Pro Stück sind ein Hauptfoto und drei zusätzliche Perspektiven möglich. Miniaturen lassen sich vergrößern, beschriften, entfernen und ausdrücklich zum Hauptfoto machen. Zusatzfotos sind keine separaten Kleidungsstücke. Neue Galerieaufnahmen werden bei Bedarf auf maximal 2000 Pixel und 4 MB begrenzt; geeignete PNG/JPEG/WebP-Dateien bleiben unverändert. Vorhandene Originale bleiben erhalten. Import- und Bearbeitungsentwürfe werden lokal gespeichert; alte Backups und Datensätze benötigen keine Schemaänderung. Neue Backups enthalten Galerie und Fotoquellen.

Die drei Collage-Vorlagen gewichten Hauptkleidung, Schuhe und Accessoire-Untertypen. Motivgrenzen, Seitenverhältnisse und begrenzte Kollisionskorrektur verhindern Verzerrungen und unnötige Überlappungen. Sechs reproduzierbare Varianten sind über **Neu anordnen** erreichbar. Rückgängig/Wiederholen erhält die vorherige Anordnung. Kleine Touch-Ziele, Schnellregler für Größe/Drehung/Ebene und Randbegrenzung erleichtern die mobile Bearbeitung. Der PNG-Export bleibt 1200 × 1800 Pixel und wird aus denselben Motiven und Positionen erzeugt.

**Mehrfoto-KI: Plan C.** Die vorhandene Analyse verwendet weiterhin genau ein Referenzbild; Zusatzfotos bleiben lokal sichtbar und werden nicht heimlich zusätzlich ausgewertet. Keine neue generative Bildfunktion und keine zusätzlichen KI-Anfragen. Modell-Schnittstelle: https://developers.cloudflare.com/workers-ai/models/llama-3.2-11b-vision-instruct/

Validierung: 102 automatisierte Tests einschließlich Galerie-/Backup-Rundlauf, Entwurfswiederaufnahme, Layoutvarianten, Motivproportionen, Rand-/Kollisionsprüfung und Gestenmathematik. Browserprüfungen sind davon getrennt; ein echter iPhone/Safari-Hardwaretest ist hier nicht verfügbar.

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

## Outfit-Suche und Favoriten (18.10.2026)
Favoriten werden atomar als reine Metadatenänderung gespeichert. Bild-Blobs werden dabei nicht neu geschrieben; Object-URLs bleiben bei Metadatenänderungen erhalten und werden nach Bildwechsel erst nach dem DOM-Commit widerrufen. Keine Datenmigration und kein Löschen bestehender Bilder.

Im Outfit-Editor unter **Hinzufügen**: kombinierbare Mehrfachfilter für Saison, Farbe, Kategorie und Layering, Favoriten und Ausschluss bereits verwendeter Stücke. Innerhalb einer Gruppe ODER, zwischen Gruppen UND. Ganzjährige Kleidung passt zu allen Saisons; die Auswahl Ganzjährig beschränkt die Saison nicht. **Passendes Outfit finden** arbeitet standardmäßig lokal und regelbasiert. Freitext versteht typische deutsche Saison-/Farb-/Kategorie-/Layeringwünsche; Stil und Anlass sind ohne gespeicherte Beschreibungen nur eingeschränkt ableitbar. Für komplexere Wünsche ist optional eine geschützte Cloudflare-KI-Auswahl mit Llama 3.2 3B verfügbar. Maximal 200 gefilterte Kleidungsmetadaten werden übertragen, keine Bilder. Serverseitige Kandidaten-Whitelist und erneute Clientprüfung verhindern unbekannte, doppelte, gefilterte oder strukturell ungeeignete IDs. Die lokale IndexedDB ist die Quelle der Kleidung; der Server kann deren Bestand nicht unabhängig auslesen.

Vorschläge ändern zunächst nichts. **Vorschlag einsetzen** ersetzt ausdrücklich die Zusammenstellung im Editor, Rückgängig bleibt möglich. Bestehende Outfits werden nur durch explizites Speichern geändert. Bei KI-Fehlern wird ein lokaler Vorschlag sichtbar als regelbasiert gekennzeichnet; keine automatischen KI-Wiederholungen.

Zentrale Pose-Templates in `app/src/garment-poses.ts` standardisieren nur die Präsentation je bestätigter Kategorie, mit Cardigan-Erkennung und neutralem Fallback. Nach Freistellung werden neue Ergebnisse proportional auf eine maximale Kantenlänge von 1024 Pixeln gebracht, mit transparentem Rand und variabler Bildfläche passend zum Seitenverhältnis. Keine Verzerrung oder Neuberechnung vorhandener Bilder. Referenztreue bleibt modellbedingt begrenzt. Das Pinterest-Board war nicht abrufbar; die konkreten Kategorie-Vorgaben aus dem Auftrag sind umgesetzt, ohne das Board als visuell geprüft auszugeben.

Validierung: 73 automatisierte Tests, TypeScript für Frontend und Worker sowie Produktions-Build erfolgreich. Isolierter Browser-Test reproduziert die URL-Widerrufslücke des alten Hooks (sichtbare URL widerrufen: 1) und bestätigt 0 solche Widerrufe mit dem neuen Hook. Favoriten mehrfach an/aus, Ansichtswechsel, Neuladen, Detailbearbeitung, Outfit mit drei vorhandenen Ebenen und unverändertes Bestands-Outfit geprüft. Mehrfachfilter und Ausschluss verwendeter Stücke, lokaler Vorschlag und gekennzeichneter Rückfall nach simuliertem KI-Ausfall geprüft. Produktnormierung liefert proportional skaliertes transparentes PNG (Test: 649 × 1024). Der neue Textmodell-Aufruf ist serverseitig automatisiert mit Mock-Antworten geprüft; der echte Browser-Aufruf benötigt noch die menschliche Turnstile-Bestätigung. Kein zusätzlicher Live-Bildgenerierungsversuch.

Der erste echte Text-KI-Test passierte die Turnstile-Prüfung, lieferte aber keinen gültigen Vorschlag. Die Modellantwort wird nun auf kurze serverseitige Auswahlkennungen und ein JSON-Schema begrenzt; echte Kleidungs-IDs bleiben nur in der serverseitigen Zuordnung. Modellzugriff, Antwortformat und Auswahlfehler werden mit festen, geheimnisfreien Fehlerkategorien getrennt. Die lokale Rückfalllösung bleibt erhalten. Ein erneuter gezielter Live-Test dieser Korrektur steht noch aus.

Die Live-Diagnose bestätigt: Modellaufruf und JSON-Format funktionieren, die freie Zusammenstellung einzelner IDs erfüllte jedoch die Outfitregeln nicht zuverlässig. Deshalb werden vollständige Kombinationen jetzt vorab regelbasiert geprüft. Die Text-KI wählt nur noch eine erlaubte Option aus diesem begrenzten Menü; deren echte Kleidungs-IDs werden danach nochmals geprüft. Dasselbe Menü verbessert den lokalen Vorschlag. Ein gezielter Live-Test dieser Auswahl steht noch aus.

### Präzise Kleidungsdetails

Material kann vor der Analyse angegeben werden. Farbton und Farbverteilung, weitere Farben, Muster/Streifen, Aufdrucke und Unsicherheiten sind in der Vorschau bearbeitbar und bleiben in Entwürfen, Kleidungsstücken und Backups erhalten. Explizite Hinweise werden getrennt extrahiert und serverseitig über erkannte Vermutungen gelegt; Material und Saison werden direkt aus den Eingaben übernommen. Bestätigte Korrekturen haben anschließend Vorrang.

Der FLUX-Auftrag wird aus den aufgelösten Angaben neu erstellt; der ursprüngliche `imagePrompt` wird nicht weiterverwendet. Bei Kategorie-/Farbwechsel entfallen unbestätigte identische Altbeschreibungen und Farb-/Musterdetails, damit alte Anweisungen nicht widersprechen. Unveränderte Referenzdetails bleiben maßgeblich. Feine Streifen, kleine Aufdrucke und Schrift sind modellbedingt nicht garantiert originalgetreu; unsichere Details müssen geprüft werden. HMAC-Fotobindung, Turnstile und Limits bleiben erhalten.

Validierung: 79 automatisierte Tests, einschließlich tatsächlichem FLUX-Multipart-Auftrag, Materialpriorität, Metadaten-/Backup-Rundlauf und bestehenden Sicherheits-, Outfit- und Favoritenprüfungen. Keine zusätzliche Bildgenerierung für diese Änderung.

### Strukturierte Farb- und Musteranalyse

Der Client misst RGB-Farbcluster aus den opaken Pixeln der mittleren 80 % des Referenzfotos. Die Palette enthält Hex-Werte und Häufigkeiten; sie ist keine Segmentierung und kann Hintergrundfarben enthalten. Vision ordnet die Kandidaten Grundfarbe, Streifen, Akzenten und Kleidungsregionen zu. Keine kalibrierten Textilfarben und keine exakten Faseranteile werden behauptet.

`appearance` ergänzt die vorhandene grobe Filterfarbe und ältere Freitextfelder: Grundfarbname/-Hex, zusätzliche und Akzentfarben mit Position, Musterart/-richtung/-rhythmus/-größe/-regionen, Streifenfolge/-breiten/-abstände, Printtext/-position/-größe/-farben, Logo sowie Kragen-, Bündchen- und Nahtdetails. Alle Felder sind optional, validiert, bearbeitbar und werden in Entwürfen, Kleidungsstücken und Backups gespeichert. `measuredPalette` bleibt als Messgrundlage erhalten. Strick wurde als manuelle Materialangabe ergänzt.

Regressionsmaßstab: olivfarbenes Longsleeve mit dünnen cremefarbenen horizontalen Doppelstreifen, breiten oliven Zwischenräumen und einfarbig oliven Kragen/Bündchen. Automatisierte Prüfungen messen ein synthetisches Streifenbild und prüfen die tatsächliche FLUX-Anfrage mit diesem Detailmodell. Sie belegen Datenfluss und Widerspruchsbereinigung, keine verbesserte Bildtreue eines echten generierten Vergleichsbildes. Dafür wurde kein weiterer Live-KI-Aufruf ausgeführt.

### Accessoires und Collagen

Accessoires behalten ihre Hauptkategorie; `accessoryType` ist optional und unterstützt Schmuck, Uhren, Brillen, Taschen, Kopfhörer, Gürtel, Kopfbedeckungen und weitere Typen. Suche und Outfitfilter berücksichtigen den Untertyp. Die lokale und textbasierte Outfit-Auswahl kann mehrere ausdrücklich gewünschte Typen gemeinsam auswählen und erfindet keine IDs. Die generative Bildpipeline und deren Worker bleiben unverändert.

„Foto / PNG ohne Bild-KI importieren“ speichert das gewählte Original lokal, verwendet transparente PNGs direkt und bietet die vorhandene lokale KI- sowie einfache Freistellung an. Bei Fehlern bleiben Original und letztes Ergebnis erhalten. Erst die ausdrückliche Übernahme speichert das Accessoire. Ein lokaler Entwurf unterstützt Wiederaufnahme.

Collagen sind unabhängig von Outfits in einem zusätzlichen IndexedDB-Store gespeichert (additives Schema v2). Classic, Editorial und Compact ordnen die sichtbaren alpha-beschnittenen Motive deterministisch auf 600 × 900 Einheiten an. Große Kleidungsstücke haben Vorrang; Accessoire-Typen beeinflussen die Größe. Der Algorithmus begrenzt Platzierung und Skalierung auf neun Versuche je Motiv und maximal 32 automatisch platzierte Motive. Nicht platzierte Bilder werden ausdrücklich zur manuellen Platzierung oder Abwahl angeboten. Namen, Ebenen, Positionen, Größen, Drehungen, Hintergrund, Vorlage, optionale Outfit-ID und Zeitstempel bleiben gespeichert.

Verschieben, Skalieren, Drehen, Ebenenreihenfolge und Undo/Redo nutzen den bisherigen Editor. Export und Vorschau verwenden dieselben beschnittenen Motive und dieselben Koordinaten; PNGs sind 1200 × 1800 Pixel groß. Über den Rand verschobene Motive müssen vor dem Export korrigiert werden. Fehlende Bilder blockieren den Export mit einer Meldung. Das Löschen von Kleidung löscht keine Collage: Referenzen und eine sichtbare Fehlermarkierung bleiben erhalten. Backups ergänzen optional `collages`; ältere Backups bleiben importierbar und löschen keine vorhandenen Collagen.

Validierung: 95 Tests inkl. Migration des alten v1-Speichers, Kollisionsfreiheit und Grenzen aller Vorlagen, Alpha-Beschnitt, mehrere Accessoire-Typen und Backup-Rundlauf. Isolierter Browser-Test: transparente lokale Übernahme mit einfacher Freistellung, separate Collage-Speicherung, Vorlagen und Undo/Redo, PNG 1200 × 1800; ursprüngliches Outfit unverändert, keine KI-Aufrufe.
