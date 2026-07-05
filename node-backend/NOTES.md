# Notes

## Learner profile
- ~8 years Flutter/Dart experience. Strong on: async/await, OOP, HTTP clients (consuming APIs), app architecture, state management. Treat programming fundamentals as known.
- The gap is server-side, not programming.
- Started the Zero to Mastery Node.js course but dislikes video learning.

## Teaching preferences
- **No videos.** Prefers interactive lessons, questions, and quizzes.
- Wants to be quizzed on what they already know (diagnostic-driven).
- Tight feedback loops. Effortful retrieval over passive reading.
- **Language: Czech.** The user learns better in Czech — teach and converse in Czech. Keep technical terms, code, and API/HTTP keywords in English (industry standard), but explain in Czech. Lessons (HTML) should also be authored in Czech.
- **⭐⭐ HLOUBKA: téma = oblouk více lekcí, ne jeden průlet (výslovné přání, 2026-07-04).** Uživatel řekl, že lekce jsou moc povrchní a že teasery advanced věcí na konci jsou málo. Cíl: *„porozumět tématu natolik, aby mě ty otázky napadly samy od sebe."*
  - Každé téma rozpadni na **sekvenci lekcí** (oblouk), ne jednu. Lekce dál krátká (pracovní paměť), ale **téma jde do hloubky napříč více lekcemi**.
  - Uč **proč / z prvních principů / mentální model**, ne jen *jak*. Learner musí umět odvodit, ne jen zopakovat.
  - Advanced otázky, co jsem dřív dával jako teaser na konec, jsou ve skutečnosti **osnova dalších lekcí v oblouku** — nedávej je jako „mimo rozsah", ale jako „další zastávka".
  - Test hloubky: napadly by tyhle follow-up otázky uživatele SAMY? Když ne, lekce byla moc mělká.
  - Dřívější lekce 01–05 byly dělané starým (mělkým) stylem — kandidáti na prohloubení do oblouků (viz roadmapa, až vznikne).
- **⭐ Interaktivní komponenty > statický text (výslovné přání, 2026-07-04).** Uživatel chce VĚTŠÍ důraz na tvorbu a používání interaktivních prvků. Je explicitně OK obětovat víc úsilí/času na stavbu komponentů. Kvízy jsou teprve začátek — nezůstávat u nich.
  - **Default posture:** když má koncept vizuální/interaktivní úhel (event loop, tok requestu, stavový automat, matching, „napiš kód a zvaliduj"), postav pro něj **komponent**, ne jen odstavec + kvíz.
  - Každý nový prvek piš jako **znovupoužitelný komponent do `assets/`** a linkuj ho z lekcí (nikdy neinlinovat to, co by druhá lekce duplikovala) — viz [Assets] v SKILL.md.
  - Preferovat interaktivitu, která dává **automatický feedback** (jako quiz.js), ne jen dekorativní animace.

## Komponenty (assets/) — inventář & backlog
Reuse je default. Před psaním lekce si projdi `assets/` a stav z existujících prvků.
- **Hotové:** `styles.css`, `quiz.js`, `rest-playground.js` (l04), `sql-injection.js` (l05), `constraint-sandbox.js` (l06), `migration-runner.js` (l07), `nplus1-viz.js` (l08 — N+1 vs JOIN vs batch, posuvník počtu postů).
- **Vzor komponentu:** čisté jádro (testovatelné) + DOM wrapper + Node test v `tools/test-*.js`. Drž se ho — ověřuj logiku, ne jen typecheck.
- **Backlog (nápady dle mise, stav 2026-07-04):**
  - `event-loop-viz` — animace requestu: call stack → callback queue → libuv thread pool (pozvedne abstraktní lekci 01).
  - `http-sim` — zadáš `POST /users/42`, ukáže match na Express route + `req.params` + status.
  - `code-fill` — doplň handler / kód, okamžitá validace (tvrdší feedback loop než kvíz).
  - `drag-match` — spoj status kódy ↔ situace, HTTP metody ↔ CRUD.
- Omezení hostingu: Pages i artifacty = **statický hosting**, jen client-side JS. Reálný Node server nerozjedeš → **simuluj** logiku v JS.

## Working notes
- 2026-07-03: Workspace initialized. Ran an initial diagnostic quiz to locate ZPD (awaiting answers).
- 2026-07-03: Lekce 0004 (REST — idempotence + status kódy + 409) dodána, + reference cheat sheet + interaktivní REST hrací plocha (`rest-playground.js`).
- 2026-07-04: Lekce 0005 (databáze — `pg`, parametrizace, SQL injection, 409 přes 23505) dodána + komponent `sql-injection.js`.
- 2026-07-04: **Přechod na hloubkový styl (téma = oblouk).** Databáze se stávají oblohem 7 dílů. Lekce 05 přeznačena jako díl 1/7. Dodán **díl 2/7 (0006 Schéma jako kontrakt)** + komponent `constraint-sandbox.js`. Auth přesunut ZA DB oblouk.
- 2026-07-04: Dodán **díl 3/7 (0007 Migrace)** + `migration-runner.js`. Uživatel: schéma i migrace jsou pro něj opakování, zatím bez dotazů. Další = díl 4 (JOINy & N+1).
- 2026-07-04: Dodán **díl 4/7 (0008 JOINy & N+1)** + `nplus1-viz.js`. Přitvrzeno tempo (JOIN svižně, těžiště N+1 + tradeoff JOIN vs batch). Další = díl 5 (Indexy & výkon).
- 2026-07-04: **Diagnostika přes háčky z lekce 07** (uživatel poprvé prošel retrieval loop). Skóre 2/3 s dobrým citem: transakční DDL/rollback ✅, kdy dropnout sloupec ✅ (princip; doplněn timing přes deploy), multi-instance migrace 🔴 (doučeno: advisory lock + kompatibilita během rolloutu). **Kalibrace:** DB hloubku má solidní, můžu v dalších dílech přitvrdit tempo/úroveň. Retrieval-first loop mu sedí → používat háčky aktivně.

## DB oblouk (7 dílů) — plán a stav
1. **Dotaz z Node** — `pg`, pool, parametrizace, injection · lekce 0005 ✓
2. **Schéma jako kontrakt** — typy, NOT NULL/UNIQUE/CHECK/PK/FK, ON DELETE · lekce 0006 ✓
3. **Migrace** — verzování schématu, expand/backfill/contract na živých datech, zámky (CONCURRENTLY) · lekce 0007 ✓ (`migration-runner.js`). Schéma je uživateli povědomé (opakování) → jel jsem svižněji přes základy, hloubka v live-data části.
4. **JOINy & N+1** — vztahy, N+1 (lazy loading), JOIN vs batch/DataLoader tradeoff, jak N+1 poznat · lekce 0008 ✓ (`nplus1-viz.js`)
4. **JOINy & N+1** — vztahy napříč tabulkami, N+1 problém, kdy JOIN vs víc dotazů · TODO
5. **Indexy & výkon** — proč SELECT bez indexu škáluje blbě, B-tree, EXPLAIN, kdy (ne)indexovat · TODO
6. **Transakce & souběh** — ACID, BEGIN/COMMIT, race conditions (navazuje na 23505), izolační úrovně, optimistic vs pessimistic locking · TODO
7. **Provoz & bezpečnost** — connection pooling do hloubky, secrets/env, least privilege, zálohy · TODO
(Otevřené hloubkové otázky, co si mají „napadnout samy": partial unique index, composite PK, deferred FK checks, ON DELETE volby — zapleteny do dílů 3–6.)
- **Prostředí (remote web session): egress policy blokuje web fetch** (MDN/httpwg vrací 403 z proxy). Ne bug, ne obejít — je to network policy prostředí. Fix = povolit/rozšířit síťovou politiku při vytváření environmentu (docs: code.claude.com/docs → Claude Code on the web). Povolené jsou balíčkové registry (npm, pypi…) a anthropic.com.

## Hosting lekcí (jak si je uživatel prohlíží v browseru)
Uživatel je na telefonu, chce lekce otevírat v prohlížeči bez čekání na deploy.
Řešení: **Artifacty na claude.ai** (`claude.ai/code/artifact/...`) — okamžitá publikace, žádné CI.
- Build: `node tools/build-standalone.js lessons/000X-....html` → `build/` (inlinuje styles.css + quiz.js; escapuje `</script>`). Pak publikovat přes Artifact tool.
- POZOR: tenhle typ (code-artifact) se **neobjevuje** v „Artifacts" záložce běžné claude.ai appky — ta ukazuje jen chat-artifacty. Přístup přes URL / rozcestník.
- Křížové prokliky mezi lekcemi uvnitř artifactu nefungují (každý = vlastní URL) → řešeno rozcestníkem s absolutními URL.

**Publikované URL (aktualizovat při re-deploji / nové lekci — redeploy jde na stejnou URL při stejné file_path):**
- 📚 Rozcestník: https://claude.ai/code/artifact/b5de0f60-09c7-40f4-a8ea-9b5f5fdc091b
- L01: https://claude.ai/code/artifact/d28a136e-1c24-4d19-b4eb-87b4b7977907
- L02: https://claude.ai/code/artifact/2719a6e4-00dd-42d0-a152-6696a2375606
- L03: https://claude.ai/code/artifact/fe7b762f-6b8c-45b8-a66a-0a022b1d6e31
- L04: https://claude.ai/code/artifact/ea5fb376-d308-4a23-8bbc-b74edc44017b
