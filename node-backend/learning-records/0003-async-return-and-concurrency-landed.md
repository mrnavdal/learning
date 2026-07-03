# Runtime model + async-return: osvojeno

Po lekci 0001 uživatel napsal „pochopil jsem" a položil dobré prohlubující otázky (proč 4 vlákna, callback vs promise) — známka aktivního zpracování, ne pasivního čtení. Na kontrolní otázku (`const data = fs.readFile(...)`) správně určil **jádro**: callback-style funkce nevrací výsledek přes `return`, data přijdou přes callback. Detail spletl (myslel „instance funkce" místo `undefined`/throw) — opraveno.

Znamená to: **[[0002-misconception-node-concurrency]] lze považovat za opravený.** Můžu volně stavět na promise/async modelu bez opakování základů. Callback styl uživatel rozpozná, ale píše v `async/await` (přechod z Dart `Future` je přímočarý).

**Implikace:** další mezery k zacílení zůstávají z [[0001-prior-knowledge-baseline]] — HTTP server (lekce 0002 dodána), REST/status kódy (POST/PUT prohozené, 409), moduly (CommonJS vs ESM). Programátorské ani async základy neučit.
