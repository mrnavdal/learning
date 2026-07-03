# Vstupní baseline (diagnostický kvíz, 2026-07-03)

Diagnostika před první lekcí ustavila, co učit a co ne. ~8 let Flutter/Dart → programátorské základy, `async`/`await` a event loop (v kontextu Dart isolate) jsou pevné; neučit znovu.

**Solidní (floor — stavět na tom):**
- SQL: napsal správný dotaz `SELECT * FROM ... WHERE user_id = 42 ORDER BY date DESC`. Rozumí i rozdílu SQL vs NoSQL.
- Middleware: koncept sedí (uvedl auth/authz příklad).
- Auth: ví, že existuje JWT i session (zatím vágně, neumí mechaniku).

**Částečné mezery (doučit lehce):**
- Moduly: `require` vs `import` popsal nepřesně („require načte celý soubor, import jen třídu"). Neví, čím se `package.json` liší od `pubspec.yaml`. → CommonJS vs ESM, scripts, semver.
- REST metody: má POST/PUT prohozené („post zapisuje, put vytváří"). Status kódy: 200 vs 201 tuší, `409` nezná. → REST lekce.
- HTTP server: přiznaně neví, co server dělá na nízké úrovni. → lekce „HTTP server holýma rukama".

**Evidence:** viz odpovědi v transcriptu session 2026-07-03.
