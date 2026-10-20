# Layer Worker – Photo First 1.4

Worker `layer-prettify`, Entry `worker.ts`, Konfiguration `wrangler.jsonc`. Bestehende GitHub-Build-Integration. `TURNSTILE_SECRET` bleibt ausschließlich Runtime-Secret, keine Zugangsdaten im Code.

POST `/prettify` oder `/analyze`, PNG bis 2 MiB und 511 × 511 Pixel. Header: `X-Layer-Phase: analyze`, frischer `X-Turnstile-Token`, URL-kodiertes JSON `X-Layer-Context`. Antwort: `{analysis: ...}`, keine Bilder, Bildprompts oder Tickets. OPTIONS meldet `photo-metadata-v1` und `metadata-v1, outfit-v1, photo-first-v1`.

Vision: `@cf/meta/llama-3.2-11b-vision-instruct`, maximal ein Formatierungsrückfall mit `@cf/meta/llama-4-scout-17b-16e-instruct`. Nur Metadaten, sichtbare Details und vorsichtige Schätzungen; keine erfundenen Marken, Etiketten oder Materialprozente. Manuelle Korrekturen und Vorschlagübernahme entscheidet der Nutzer im Client.

POST mit `X-Layer-Phase: generate` sowie POST `/generate` antworten nach der Origin-Prüfung mit **410 GENERATION_REMOVED**, vor Body-Decodierung, Siteverify, Limits oder Modellaufrufen. Alte Tickets werden nicht mehr ausgewertet. Vorhandene Bilder im Browser bleiben unverändert.

POST `/outfit`: JSON `{wish,items,filters,usedIds,preferFavorites}` bis 160 KB und 200 Kandidaten. Textmodell `@cf/meta/llama-3.2-3b-instruct` wählt aus einem begrenzten Menü bereits validierter Kombinationen. IDs, Filter, Zubehör und Layering werden erneut geprüft. Keine erfundenen Stücke; gekennzeichneter lokaler Rückfall bei KI-Fehlern.

Origin exakt `https://mylo1908.github.io`; Siteverify muss Host `mylo1908.github.io` und Action `layer_prettify` bestätigen. Fehlerhafte Tokens, fehlende Secrets und Limiter-Ausfälle verhindern Modellarbeit. Bestehendes IP-Limit und gemeinsamer Standort-Bucket bleiben je 3 Anfragen/Minute; kein strikt weltweiter Tageszähler. Fehler liefern feste Kategorien, ggf. numerische Providercodes, nie rohe Diagnostik. Live-Status und Grenzen stehen im Auditbericht.
