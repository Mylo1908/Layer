# Optionaler privater KI-Server

GitHub Pages liefert nur die Oberfläche. Dieser Server muss separat auf einem Node.js-22+-Host mit HTTPS laufen. Noch kein Server oder OpenAI-Zugang ist eingerichtet. Die API wird separat abgerechnet; Kosten im OpenAI-Projekt begrenzen. Keine Schlüssel ins Repository oder in Vite-Variablen schreiben.

Umgebungsvariablen am Host setzen:
- OPENAI_API_KEY: privater OpenAI-API-Schlüssel
- LAYER_ACCESS_TOKEN: zufälliger privater Zugangscode mit mindestens 32 Zeichen
- ALLOWED_ORIGIN: https://mylo1908.github.io
- OPENAI_IMAGE_MODEL: optional, Standard gpt-image-1.5 (Zugriff im API-Projekt erforderlich)
- DAILY_LIMIT: optional, Standard 20 Versuche pro UTC-Tag
- PORT: optional, Standard 8787

Start: `node server/server.mjs` (aus app). In Layer unter Einstellungen die HTTPS-Adresse ohne /prettify sowie den Zugangscode eintragen. Der Zugangscode bleibt nur in der Browsersitzung. Nach Tab-/App-Neustart ggf. erneut eingeben. Ein bewusst gewählter Cloud-Modus sendet das Foto an deinen Server und OpenAI. Keine automatische Cloud-Übertragung als Ersatz für lokale Fehler.

Einzelbenutzerbetrieb: maximal ein Auftrag gleichzeitig, maximal 10 MB pro PNG. Das Tageslimit liegt im RAM und wird bei Neustart zurückgesetzt; nur eine Instanz verwenden. Für öffentlichen oder Mehrbenutzerbetrieb sind persistente Limits, individuelle Anmeldung und ein Reverse-Proxy mit Request-/Zeitlimits erforderlich. Der Server speichert keine Bilder und protokolliert keine Schlüssel.

Die KI betrachtet das Foto beim Bearbeiten. Sie liefert noch keine separaten Kategorie-/Farb-Metadaten. Vorschläge aus Dateinamen bleiben lokal; Felder bitte prüfen. Generierte Details können vom Original abweichen. Original und Vorschau vergleichen.

Ohne Server: im Fotoeditor „Mit ChatGPT verschönern“ nutzen, Foto und Auftrag manuell an ChatGPT übergeben, dort erstelltes PNG herunterladen und über „KI-Ergebnis importieren“ laden. Kein automatischer Zugriff auf deine Chats.

Geprüfte API-Dokumentation: https://developers.openai.com/api/docs/guides/image-generation
