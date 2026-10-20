# Layer 1.4.0 – Photo First: Audit und Prüfbasis

Stand: 20.10.2026. Ausgangscommit `fa07d248041034b1af03aee40ba35ca319241a11` (Layer 1.3). Die Prüfung umfasst Anwendungsquellen, Cloudflare-Worker, den stillgelegten optionalen Server, Build-/Modellskripte, Konfiguration, Daten-/Backup-Logik und vorhandene Tests. Sie ist kein unabhängiges Penetrationstest-Zertifikat und schließt unbekannte Fehler nicht aus. Verbleibendes Work-Kontingent ist nicht zuverlässig abrufbar; es wird keine exakte Budgetkontrolle behauptet.

## Umgesetzt

- Einheitlicher Fotoimport: Kamera/Galerie/PNG, Hauptfoto plus drei Perspektiven, ausdrückliche Fotobestätigung, optionale lokale Freistellung, Originalvergleich, Freistellung übernehmen/ablehnen oder Original verwenden, editierbare Metadaten, stabile Speicherung und Entwurf.
- Neue Bilder sind echte Nutzerfotos. Keine FLUX-/Provider-Bildaufrufe oder Client-Generierung. `generate` und `/generate` liefern 410 nach Origin-Prüfung, vor Token-/Limiter-/Modellarbeit. Der frühere optionale Node-Bildserver ist ebenfalls stillgelegt. Alte gespeicherte generierte Bilder bleiben lesbar; ältere Entwürfe bleiben erhalten und anhand des Originals wiederaufnehmbar.
- Metadatenanalyse ohne Bildprompt/Ticket. Kategorie, Accessoire-Typ, Marke, Kleidungsart, Material, Passform/Schnitt, Saison, Layering und bestehende regionale Farb-/Musterfelder sind manuell bearbeitbar. Marken nur bei eindeutiger sichtbarer Grundlage, Materialien nicht als erfundene Zusammensetzung. Analyse-Vorschläge werden separat ausgewählt; manuelle Werte sind zunächst abgewählt. Nicht ausgewählte Materialangaben werden auch nicht indirekt über die visuellen Details überschrieben.
- Weiße Alpha-Kontur Aus/Dünn/Mittel. Neue Collagen: Dünn; alte ohne Option: Aus. Silhouettenmaske, kein rechteckiger Rahmen für opake Fotos. Die Kleidungsdatei wird nicht verändert. Vorschau und Export verwenden dieselben aufbereiteten Motive. Kontur ist Teil von Speicherung/Backup und Undo/Redo.

## Befunde und Korrekturen

| Priorität | Befund | Korrektur / Nachweis |
|---|---|---|
| Hoch | Aktive generative Client-, Worker- und optionale Server-Wege | Entfernt bzw. 410-Tombstone; Negativtests verlangen null Modell-/Verifikationsaufrufe |
| Hoch | Bei synchronem Speicherfehler während Backup-Import konnten vorangegangene Schreibvorgänge sonst noch committen | Alle Bilder vor Transaktion decodieren; Fehler brechen Transaktion ausdrücklich ab; injizierter QuotaExceededError nach erstem Datensatz führt zu vollständigem Rollback |
| Hoch | Vite 7.1.12 durch aktuelle npm-Advisories betroffen, besonders bei erreichbarem Entwicklungsserver | Gepinnt auf 7.3.7; erneuter npm-Audit: 0 gemeldete Schwachstellen. Statisches Pages-Hosting führt keinen Vite-Devserver aus |
| Hoch | Bildwechsel konnte die vorherige Perspektivquelle für die Freistellung behalten | Neue Perspektivquelle ist das neu ausgewählte Foto, erstes Original bleibt separat erhalten |
| Mittel | Maskenbereinigung entfernte auch kleine sinnvolle getrennte Accessoire-Details | Konservative begrenzte Komponentenschwelle, Erhalt länglicher Kleinteile, Alpha-only-Komposition auf Original-RGB; Tests für Ketten/Fasern und RGB-Erhalt |
| Mittel | Nachbearbeitung konnte vor Ergebnisprüfung gespeichert werden | Ausstehende Freistellung separat gespeichert; Speichern erst nach Bestätigung/Originalwahl |
| Mittel | Limiter-Ausfall konnte ungefangenen Worker-Fehler auslösen | Fail-closed-Helfer für Analyse und Outfit; kein Modellaufruf bei Binding-Fehler |
| Mittel | Fokusfalle des Elterndialogs kollidierte mit nativer Bild-Großansicht | Aktuell obersten offenen Dialog zur Tab-Begrenzung bestimmen |
| Mittel | Wiederholte Collage-Randwechsel erzeugten unnötige neue Motiv-URLs/Berechnungen | Cache je Foto/Variante; globale schwache Motiv-Blob-Memoisierung, URL-Freigabe beim Unmount |
| Mittel | Doppeltes Speichern eines neuen Outfits/Collage konnte neue IDs erzeugen | Stabile Editor-ID und synchrone Operationssperre |
| Mittel | Galerie-Verarbeitung konnte parallel zum Schließen laufen | Verarbeitungszustand an Elterneditor weitergeben; Aktionen bis Abschluss sperren |
| Mittel | Fehlerhafte Modell-Dateiliste konnte beim Offline-Vorbereiten fremde/außerhalb liegende Pfade verwenden | Gemeinsame Ressourcenvalidierung, nur bekannte Ressourcen, gleicher Origin und Modellpfad, keine Query-/Fragment-URLs |
| Mittel | Kalenderränder bei 1900/9999 konnten ungültige Tage rendern | Begrenzte Navigation und Filterung gültiger Kalendertage; Grenztests |
| Mittel | Ein lokaler zufälliger Vorschlag konnte Kleid und Hose gleichzeitig enthalten | Unterteil entfällt, wenn als Basis ein Kleid gewählt ist |
| Niedrig | Bild-/Hilfetexte und Hosting-Anleitung bezogen sich auf Generierung | UI, Einstellungen, Startanleitung und READMEs aktualisiert |
| Niedrig | Rein transparente PNGs bzw. SVG-Uploads konnten ungeeignete Hauptbilder erzeugen | Sichtbarkeitsprüfung und explizite Fotoformatgrenzen; Fehler lassen bisherigen Entwurf unangetastet |

## Automatisierte Ergebnisse vor Veröffentlichung

- **137 Tests bestanden**, vollständiger Testlauf; bestehende Sicherheits-/Persistenz-/Kalender-/Statistik-/Backup-/Offline-Prüfungen weiterverwendet.
- Frühere Generierungs-Positivtests wurden gezielt durch Sperr-/Kompatibilitätstests ersetzt, nicht zur Umgehung von Fehlern entfernt.
- Separate strikte TypeScript-Prüfung für Frontend und Worker ist jetzt Bestandteil des Builds.
- Datenbank weiterhin Schema 3, Backupformat weiterhin Version 1. Keine destruktive Migration.
- Prüfung auf veröffentlichte Secrets/Schlüssel, persönliche Bilder und Datenbankdateien erfolgt für Quellen und Quellcodearchiv vor dem Upload.

## Praktische Prüfmethode

`insights-check.html` rendert denselben App-Code in wählbaren Viewportbreiten (320/390/430/768/1100). Alle IndexedDB-Namen erhalten das Präfix `layer-photo-first-check:`. Testfotos sind synthetisch und werden im Browser gezeichnet; keine persönlichen Nutzerfotos oder Sammlungen für Tests. Vorbereitete historische Bilder/Collage/Entwurf dienen ausschließlich Kompatibilitätsprüfungen. Ein Live-Endpunkt-Prüfer verwendet OPTIONS und bewusst tokenlose Anfragen, ohne Modelle aufzurufen. Reale Analyse-/Outfit-Modellaufrufe werden nicht durch diese technischen Endpoint-Prüfungen behauptet.

Dieses Archiv wird vor dem Deployment erzeugt. Das tatsächliche Deployment- und Browserergebnis wird im Abschluss des Ausführungslaufs gemeldet; ungetestete Punkte gelten dadurch nicht als bestanden.

## Verbleibende Grenzen

- Die Modellmaske kann Schmuck, Fasern oder ähnlich gefärbten Hintergrund falsch trennen. Die Tests belegen Maskenlogik und Fehlerpfade, keine garantierte Erkennung jeder realen Form. Ergebnis vergleichen und im Zweifel Original verwenden.
- Die Kontur verwendet eine begrenzte chamfer-basierte Alpha-Dilatation; sehr starke Vergrößerung kann die diskrete Maskengeometrie zeigen. Kein farbkalibrierter Bildeditor.
- Eine erkannte Marke/Materialstruktur und HEX-Farbe sind KI-Vorschläge bzw. ungefähre Pixelwerte, keine verifizierte Material- oder Markenprüfung.
- Keine Cloud-Synchronisierung. Browser-Speicher kann gelöscht werden; Backups bleiben erforderlich. Preise und Notizen bleiben lokal.
- Turnstile und Standort-/IP-Limits ersetzen keinen weltweiten harten Tageszähler. Die vorhandenen kostenlosen Betreiberkontingente und Modellfreigaben bleiben externe Voraussetzungen. Kein Tarifwechsel und keine kostenpflichtigen Dienste wurden eingerichtet.
- Ohne echte Geräte lassen sich iPhone-Safari-Gesten, Kamerazugriff, Speicherdruck, Home-Screen-Lebenszyklus und Hintergrundzustände nur begrenzt prüfen. Responsive Browserprüfung ist kein Hardwaretest.
