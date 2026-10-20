# Layer 1.4.0 – Photo First

**App:** https://mylo1908.github.io/Layer/

Echte Kleidungsfotos statt generativer Produktbilder: Kamera/Galerie, ein Hauptfoto und drei Zusatzperspektiven, lokale Hintergrundentfernung, Originalvergleich und ausdrückliche Bestätigung. Die optionale Cloud-KI analysiert Kleidungsdaten; Vorschläge sind bearbeitbar und überschreiben manuelle Angaben nur nach Auswahl. Marke, Kleidungsart, Material, Passform, Schnitt, Saison und Farbinformationen bleiben optional.

Vorhandene generierte Bilder und Originale bleiben gespeichert. Der frühere Generierungsendpunkt ist serverseitig mit HTTP 410 stillgelegt. Keine Bildgenerierungsmodelle, Provider-Bildaufrufe oder Generierungstickets im aktiven Ablauf. Outfit-KI und lokale Vorschläge nutzen ausschließlich vorhandene Kleidungsstücke.

## Bestehende Funktionen

Kleiderschrank, Zubehörtypen, Favoriten, Layering, Outfit-Editor, Classic/Editorial/Compact-Collagen mit manueller Bearbeitung, Undo/Redo, PNG 1200 × 1800, Outfit-Kalender, geplante/getragene Outfits, dokumentierte Tragehistorie, Statistik und Cost-per-Wear. Neue Collagen haben einen dünnen weißen Alpha-Konturrand; bei älteren bleibt er ohne ausdrückliche Änderung aus. Einstellungen, Backups und Offline-Nutzung bleiben erhalten.

## Datenschutz und Daten

Alle Sammlungen liegen lokal in IndexedDB. Schema 3 und Backupformat 1 bleiben kompatibel. Nur die optionale Metadatenanalyse sendet eine verkleinerte Referenz und freigegebene Hinweise; die Outfit-KI erhält begrenzte Metadaten, keine Bilder, Preise oder persönlichen Notizen. Die Freistellung ist lokal. Originalfarben bleiben erhalten; Modellmasken und einfache Freistellung müssen visuell geprüft werden. Alte Entwürfe lassen sich anhand ihres Originals wiederaufnehmen, ohne den alten Entwurf zu löschen.

## Build, Prüfung und Betrieb

`app/` enthält Quellen, Tests und Worker. Node.js LTS: `npm --prefix app ci`, `npm --prefix app test`, `npm --prefix app run build`. Der Build prüft Frontend und Worker und erzeugt `source.zip` sowie Offline-Shell. `app/dist/` wird in das Repository-Hauptverzeichnis übernommen; Modelle und Lizenzhinweise werden mitverteilt. Die vorhandene Cloudflare-GitHub-Integration veröffentlicht den Worker ohne neue Zugangsdaten im Code.

Das Audit einschließlich behobener Fehler, Prüfmethoden und verbleibender Einschränkungen steht in [app/docs/AUDIT_1.4.md](app/docs/AUDIT_1.4.md). Die isolierte Browser-Testseite `insights-check.html` verwendet synthetische Bilder und eigene IndexedDB-Namen.

AGPL-3.0-or-later; Freistellung mit IMG.LY/IS-Net. Regelmäßige JSON-Backups bleiben erforderlich: Browser können lokale Daten entfernen. Eine umfassende Codeprüfung garantiert keine Fehlerfreiheit unter allen Geräten, Bildern und Netzbedingungen.
