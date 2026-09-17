# Notes — UX Design

## Learner profile
- ~8 let Flutter/Dart. UI staví roky: layouty, komponenty, stavy, animace, Material. **Řemeslo implementace neučit.**
- Paralelně jede backend track (`node-backend/`) — má rád mentální modely a „proč“, ne recepty.
- Mezera není v kreslení. Mezera je v: **rozhodování s důkazem**, výzkumu, IA/tocích, vizuálním systému jako systému, ověřování a **prodeji rozhodnutí klientovi**.
- Dělá vlastní appku **LASTGO** — má být vlajková případovka v portfoliu. ⚠️ Zatím **nevím, co LASTGO je** — doplnit hned, jak řekne (viz Otevřené otázky).

## Teaching preferences (převzato z node-backend, potvrzeno stejným učícím se)
- **Čeština.** Termíny anglicky, výklad česky. Lekce (HTML) taky česky.
- **Žádná videa.** Interaktivní lekce, kvízy, okamžitý automatický feedback.
- **⭐⭐ HLOUBKA: téma = oblouk více lekcí.** Ne jeden průlet. Learner musí umět odvodit, ne zopakovat. Advanced otázky nejsou „mimo rozsah“, jsou to **další zastávky oblouku**.
  - Test hloubky: napadly by ty follow-up otázky učícího se **samy**? Když ne, lekce byla mělká.
- **⭐ Interaktivní komponenty > statický text.** Je OK obětovat víc času na stavbu komponentu. Kvízy jsou minimum, ne cíl.
- **Retrieval-first loop funguje.** Po lekci dávat háčky (otázky do diskuze) a z odpovědí diagnostikovat — tak to jede na backend tracku a sedí mu to.

## UX-specifické zásady pro tenhle track
- **Každá lekce = kus portfolia.** Sekce „Na LASTGO“ na konci lekce produkuje artefakt (řetěz, audit, flow, tokeny, test plan), který se pak jen slepí do případovky. Učení a deliverable v jednom.
- **Nikdy „hezčí“.** Každé rozhodnutí v lekci se obhajuje mechanismem (co to dělá s pozorností / pamětí / námahou / rizikem), ne estetikou.
- **Most do Flutteru je náš cheat code.** Design tokens ↔ ThemeData, komponenty ↔ widgety, stavy obrazovky ↔ AsyncValue. Používat ten most pořád — je to jeho nespravedlivá výhoda proti „čistým“ designérům.
- Terminologii držet podle `GLOSSARY.md` (vznikne, až první termíny fakt umí — ne dřív).

## Komponenty (assets/) — inventář & backlog
Reuse je default. Před psaním lekce projít `assets/`.
- **Hotové:** `styles.css`, `quiz.js` (převzato z node-backend), `decision-trace.js` (l01 — skládání řetězu Cíl→Bariéra→Rozhodnutí→Důkaz, 2 scénáře, na konci složí větu do případovky).
- **Vzor komponentu:** čisté jádro (testovatelné) + DOM wrapper + Node test v `tools/test-*.js`.
- **Backlog:**
  - `squint-viz` — rozmazání obrazovky (CSS filter), ať je vidět skutečná vizuální hierarchie.
  - `contrast-lab` — poměr kontrastu naživo + WCAG AA/AAA verdikt (napojit na WebAIM).
  - `flow-builder` — poskládej task flow z kroků, ukáže počet kroků a místa odpadu.
  - `heuristic-audit` — projdi obrazovku podle 10 heuristik, výstup = nález se závažností (rovnou deliverable).
  - `spacing-scale` — přepínání 4/8pt gridu a type scale na živé ukázce.
  - `state-matrix` — empty / loading / error / offline / success na jedné obrazovce.

## Roadmapa (4 oblouky)
**Oblouk 1 — Od problému k rozhodnutí**
1. **UX je rozhodnutí, ne vkus** — řetěz Cíl → Bariéra → Rozhodnutí → Důkaz · lekce 0001 ✓ (`decision-trace.js`)
2. Kdo a proč — úkol uživatele (JTBD), jak se ptát, aby ti lidé nelhali · TODO
3. Tok, ne obrazovky — task flow + IA, kde se ztrácí lidi · TODO
4. Heuristický audit — 10 heuristik jako rentgen, první reálný nález na LASTGO · TODO

**Oblouk 2 — Řemeslo (aby to vypadalo i fungovalo profesionálně)**
5. Vizuální hierarchie — co oko vidí první a proč · 6. Typografie & spacing systém ·
7. Barva, kontrast, stavy + WCAG · 8. Komponenty & design tokens → Flutter theme ·
9. Stavy obrazovky (empty/loading/error/offline) — kde padají amatéři

**Oblouk 3 — Důkaz a business**
10. Usability test s 5 lidmi · 11. Metriky, kterým klient rozumí · 12. Jak rozhodnutí prodat

**Oblouk 4 — Portfolio**
13. Portfolio jako produkt (struktura, positioning, cena) · 14. LASTGO jako vlajková případovka

## Otevřené otázky (doplnit od uživatele)
1. **Co LASTGO je?** Komu, jaký úkol řeší, v jaké je fázi, má uživatele a data (analytika)? Bez toho jsou cvičení obecná.
2. **Kdo je klient**, kterému se bude portfolio ukazovat? (agentura / startup / firma bez IT / freelance zakázky) — mění, co v případovce zdůraznit.
3. **Nástroj:** Figma, nebo designovat rovnou v kódu? (viz Prostředí — Figma účet má jen View/Dev seat.)

## Prostředí (remote web session)
- **Web fetch FUNGUJE** (ověřeno 2026-09-17: nngroup.com, lawsofux.com, w3.org, webaim.org vrací 200). Starší poznámka v `node-backend/NOTES.md` o blokovaném egressu je pro tenhle environment **neaktuální**.
- **Figma MCP je připojené** jako `dev@tymbe.com`, ale seaty jsou **View** (dev's team) a **Dev** (TYMBE, a.s.) → čtení designu/Dev Mode ano, **zakládání a editace design souborů pravděpodobně ne**. Na vlastní návrhy bude potřeba osobní Figma účet (Starter má 3 soubory zdarma) nebo designovat v kódu.
- Hosting lekcí: stejně jako u backendu → `node tools/build-standalone.js lessons/000X-*.html` → publikovat jako Artifact.

## Working notes
- 2026-09-17: Workspace založen. Mise sepsána (portfolio + LASTGO jako vlajková případovka). Dodána **lekce 0001 (UX je rozhodnutí, ne vkus)** + komponent `decision-trace.js` + reference `retez-rozhodnuti.html`. Čeká se na popis LASTGO → pak lekce 02 (úkol uživatele) už na reálném produktu.
