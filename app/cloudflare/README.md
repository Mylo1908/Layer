# Automatisches Layer Prettify

Implementiert, aber noch nicht mit einem Betreiberkonto verbunden oder gegen echte Modelle getestet. `app/public/ai-config.json` ist absichtlich leer: Solange kein funktionierender Dienst hinterlegt ist, bleibt der bisherige ChatGPT-Import verfügbar. Kein Demo-Ergebnis wird als echte KI-Generierung ausgegeben.

## Ablauf

Foto auswählen → Browser verkleinert die Referenz auf maximal 511 Pixel → Worker analysiert sie mit Llama 3.2 Vision → validiert Namen/Kategorie/Farbe/Bildauftrag → FLUX.2 klein 4B erzeugt ein neues Produktbild aus **Bildauftrag und Referenzfoto** → Browser entfernt den Hintergrund mit IS-Net → prüft Transparenz → speichert automatisch das Ergebnis im Kleiderschrank. Das Original bleibt getrennt gespeichert. Es ist keine manuelle Prompt-Übergabe, kein Nutzerkonto und kein API-Schlüssel für App-Nutzer nötig.

KI kann Details verändern, insbesondere Logos, Schrift und Muster. Der echte Modelltest ist vor Aktivierung erforderlich. Die App muss während der Verarbeitung geöffnet bleiben; mobile Browser garantieren keine Hintergrundausführung. Entwürfe und generierte Zwischenbilder bleiben lokal erhalten, sodass nach einem Fehler beim Freistellen kein weiteres Bild generiert werden muss.

## Einmalig vom Betreiber einzurichten

1. Ein Cloudflare-Konto mit **Workers Free** und Workers AI verwenden. Kein Upgrade auf einen kostenpflichtigen Tarif nötig. Cloudflare dokumentiert 10.000 kostenlose Neurons täglich; nach Verbrauch schlägt die Generierung bis zum Reset fehl. Das Kontingent gilt für das Betreiberkonto, nicht pro App-Nutzer. Limits/Modellverfügbarkeit im eigenen Konto prüfen.
2. Die Lizenz und Acceptable Use Policy für Llama 3.2 Vision lesen und selbst akzeptieren. Cloudflare verlangt dafür eine initiale Modellanfrage mit `{"prompt":"agree"}`. Die offizielle Anleitung steht unter https://developers.cloudflare.com/workers-ai/guides/tutorials/llama-vision-tutorial/. Der Worker nimmt diese Zustimmung nicht automatisch vor. Auch die FLUX-Modellbedingungen prüfen.
3. Aus `app/cloudflare/` mit Node 22+ und Wrangler 4.36+ anmelden und veröffentlichen:

   ```sh
   npx wrangler@4 login
   npx wrangler@4 deploy
   ```

   Das OAuth-Login erfolgt im eigenen Browser. Keine API-Schlüssel in GitHub, Frontend-Konfiguration oder Chat schreiben. `wrangler.jsonc` enthält die AI-Bindung und die erlaubte Website-Origin.
4. Die ausgegebene Adresse um `/prettify` ergänzen. Zunächst lokal in `app/public/ai-config.json` eintragen, z. B. `{"endpoint":"https://layer-prettify.DEIN-SUBDOMAIN.workers.dev/prettify"}`. Für einen lokalen Browser-Test vorübergehend dessen Origin in Wrangler setzen und anschließend wieder `https://mylo1908.github.io` verwenden.
5. Ein echtes Kleidungsfoto testen: ein Upload ohne weitere Klicks, Analyse sinnvoll, neues Bild erzeugt, Schnitt/Farbe/Muster ausreichend erhalten, echter transparenter Hintergrund, automatisches Speichern und Wiederladen, Original separat vorhanden. Fehler bei Kontingent oder Freistellung dürfen kein Referenzfoto als Produktbild speichern.
6. Erst nach diesem Test die Konfiguration für GitHub Pages veröffentlichen: `npm --prefix app run build`, Inhalt von `app/dist/` in das Repository-Root kopieren und committen. `ai-config.json` wird absichtlich nicht durch den Service Worker gecacht. Mit leerem Endpoint lässt sich wieder auf den bisherigen Import umstellen.

## Betrieb und Grenzen

- Der Worker speichert/loggt keine Bilder oder Prompts; zur KI-Verarbeitung werden sie an Cloudflare übertragen. Die Website informiert darüber vor der Fotoauswahl. Cloudflares Datenverarbeitung richtet sich nach deren Bedingungen.
- Anfragen sind auf PNG, 2 MiB und 511 × 511 Pixel begrenzt; das Bildmodell erhält ausschließlich die serverseitig erzeugte Analyse und das Referenzfoto. Kein offener Prompt-/URL-Proxy.
- Das IP-Limit erlaubt 3 Versuche/Minute je Cloudflare-Standort. Es ist kein globales Kostenlimit. CORS ist keine Authentifizierung: Nicht-Browser-Clients können Origins nachahmen und kostenloses Kontingent verbrauchen. Für größere öffentliche Nutzung zusätzliche Zugriffskontrolle vorsehen. Auf Workers Free bleiben; keine automatische kostenpflichtige Erweiterung ist konfiguriert.
- Ein Browser-Timeout kann eine bereits laufende Modellanfrage nicht zurücknehmen. Nach Netzwerkabbruch kann ein erneuter Versuch erneut Kontingent verbrauchen.
- IS-Net lädt beim ersten Mal ungefähr 56 MB; Browser benötigt Worker und OffscreenCanvas. Nicht unterstützte Geräte erhalten einen Fehler statt eines falschen Produktbilds.
- Tests ersetzen die AI-Bindung durch kontrollierte Antworten und prüfen Reihenfolge, Referenzübergabe, Fehler, Größenlimit und Rate-Limit. Kein echter Modellaufruf ohne Betreiberkonto durchgeführt.

Quellen: https://developers.cloudflare.com/workers-ai/platform/pricing/ · https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/ · https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

## Turnstile-Absicherung (17.10.2026)

Der Worker verlangt jetzt für jeden neuen Bildauftrag einen frischen `X-Turnstile-Token` und das Betreiber-Secret `TURNSTILE_SECRET`. Siteverify muss `success: true`, Hostname `mylo1908.github.io` und Action `layer_prettify` bestätigen. Ungültige/abgelaufene/wiederverwendete Tokens und fehlende Secrets sperren den KI-Zugriff; Verifikationsfehler bleiben geschlossen. Die SPA rendert explizit mit `interaction-only` und entfernt das Widget nach jedem Versuch. Gespeicherte KI-Zwischenbilder benötigen keine neue Tokenprüfung.

Zusätzlich zum IP-Limit gibt es einen gemeinsamen Bucket von drei Anfragen pro Minute je Cloudflare-Standort. Das ist eine zusätzliche Begrenzung, kein weltweites hartes Tagesbudget. Turnstile ist Bot-Abwehr, keine Benutzeranmeldung. Ein strikt globales Budget benötigt einen zentralen Zähler (beispielsweise Durable Object); wegen ungeprüfter Tarifvoraussetzungen wird dafür kein zusätzlicher Dienst aktiviert.

41 automatisierte Tests und Produktions-Build erfolgreich. Vor Aktivierung bleiben der vollständige Browsernachweis und eine erfolgreiche echte Turnstile-Prüfung nötig. Der synthetische Bildtest ersetzt kein echtes Kleidungsfoto; Bildtreue ist insbesondere für Schrift und feine Details nicht garantiert. Die Prompts verbieten jetzt ausdrücklich erfundene Kontrastkragen und andere nicht sichtbare Besatzdetails.

### Browsernachweis und aktueller Blocker

Die separate `pipeline-test.html` wurde im leeren Cloud-Browserprofil mit dem bereits generierten JPEG getestet: KI-Zwischenergebnis in IndexedDB abgelegt, Seite neu geladen, im echten AutomaticPhotoEditor fortgesetzt, echte IS-Net-Freistellung ausgeführt und automatisch gespeichert. `requireTransparency` bestätigt nach erneutem Laden sichtbare und transparente Pixel; genau ein Kleidungsstück ist vorhanden, der Entwurf bereinigt. Das Stück erscheint auch auf der Hauptseite und bleibt beim Service-Worker-Update erhalten. Dieser Wiederaufnahmetest löst keine neue Cloud-KI-Anfrage aus. Die Testseite verwendet dieselbe Origin-Datenbank und ist nur für ein leeres Testprofil bestimmt.

Live-POST gegen `turnstile-20261017-1`: HTTP 503, `TURNSTILE_CONFIG`. Die aktive Produktionsversion kann das Runtime-Secret nicht lesen. Bis zur Behebung bleiben beide `ai-config.json`-Dateien leer. Betreiberaktion: In `layer-prettify` unter **Settings → Variables and Secrets** das Runtime-Secret **TURNSTILE_SECRET** für Production hinterlegen und bereitstellen; nicht lediglich als Build-Variable speichern. Den Wert niemals in Chat oder Repository kopieren. Danach ist eine erfolgreiche echte Tokenprüfung mit abschließendem Upload noch erforderlich.

### Grenzen des Bildvergleichs und der Tokenprüfung

Die synthetische Referenz enthält selbst einen hellgrauen Bogen am Hals. Der zuvor als erfunden bewertete weiße Kragen kann daraus abgeleitet worden sein; mit diesem vereinfachten Testbild ist eine Halluzination deshalb nicht eindeutig nachgewiesen. Ein Echtfoto-Test bleibt offen.

Der echte Turnstile-Client lädt im Browser und zeigt bei Bedarf eine interaktive Menschprüfung. Diese wurde im automatisierten Test nicht gelöst; ein erfolgreicher echter Token ist daher noch nicht nachgewiesen. Die vorgelagerte HTTP-Prüfung des Workers belegt unabhängig davon das fehlende Runtime-Secret und die geschlossene Fehlerbehandlung.
