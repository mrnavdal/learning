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
- **Hotové:** `styles.css`, `quiz.js` (převzato z node-backend), `decision-trace.js` (l01 — skládání řetězu Cíl→Bariéra→Rozhodnutí→Důkaz, 2 scénáře, na konci složí větu do případovky), `funnel-lab.js` (l02 — trychtýř LASTGO Před/Po, vypínání eventů vyrábí slepá místa, absolutní ztráta vs. procento).
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
2. **Tok, ne obrazovky** — kroky úkolu = eventy, trychtýř, slepá místa, identita · lekce 0002 ✓ (`funnel-lab.js`)
   ↳ *Pořadí přehozeno oproti původnímu plánu:* spouští produkci a implementuje analytiku právě teď, okno se zavírá.
3. Úkol uživatele do hloubky (JTBD) — jak se ptát, aby lidé nelhali; + IA · TODO
4. Heuristický audit — 10 heuristik jako rentgen, první reálný nález na LASTGO · TODO
   ↳ *Pozn.:* lekce „co je bariéra“ odpadla — umí to (viz LR-0002).

**Oblouk 2 — Řemeslo (aby to vypadalo i fungovalo profesionálně)**
5. Vizuální hierarchie — co oko vidí první a proč · 6. Typografie & spacing systém ·
7. Barva, kontrast, stavy + WCAG · 8. Komponenty & design tokens → Flutter theme ·
9. Stavy obrazovky (empty/loading/error/offline) — kde padají amatéři

**Oblouk 3 — Důkaz a business**
10. Usability test s 5 lidmi · 11. Metriky, kterým klient rozumí · 12. Jak rozhodnutí prodat

**Oblouk 4 — Portfolio**
13. Portfolio jako produkt (struktura, positioning, cena) · 14. LASTGO jako vlajková případovka

## LASTGO — co o produktu vím (zjištěno 2026-09-17 z vlastních artifactů uživatele)
Nezjišťoval jsem to dotazem — přečetl jsem artifacty v jeho účtu. **Ověřit s ním, co je aktuální.**

- **Co to je:** marketplace na **last-minute volné termíny se slevou**. Podnik (sauna, fitness, lekce…) vypíše z „aktivity“ (šablona) konkrétní **termín = „sleva“** s volnými místy; zákazník ho najde, rezervuje a **zaplatí předem**; u pultu partner ověří **pětiznakový kód** rezervace.
- **Tři plochy:**
  - **Flutter klient** (zákazník): `/discover`, `/offer/:id`, `/reservations`, `/reservation/:id`, `/business/:id`, `/profile`, auth, onboarding dialog. V2 zmiňuje feed **„Nabídky“ se třemi záložkami**, kartu na aktivitu, čas jako řadicí osu.
  - **Partnerský web:** `/validate` (jediná obrazovka používaná **vestoje, s člověkem před sebou**), `/dashboard` („Dnes“), `/offers` (Slevy), `/reservations`, `/activities`, `/settings`, auth.
  - **API:** `mrnavdal/lastgo-api` (Node), tickety s labely `track:*`.
- **Byznys model:** provize, Stripe Connect (connected accounts partnerů), storno poplatky a penále za nedodržený závazek, DPH z provize.
- **Aktuální stav (od uživatele, 17. 9. 2026):** lidé se do appky dostávají (kolik = neví, nemá analytiku), část si založí účet, **slevu si nekoupí nikdo**. Z jeho vlastního UX výzkumu: nechtějí odcházet z appky do cizího rezervačního systému a nechápou, jak to celé funguje. → Rozhodl se implementovat **rezervaci i platbu přímo v appce**. Produkci spouští **příští týden**, analytika se implementuje teď.
- **Fáze (k 12. 8. 2026):** v2 rozpracovaná — klient 5/8 tras, partner web 5/7 tras. **Produkce ještě neběží** (otevřené tickety na prod provisioning, domény, migraci dat, retirement legacy React klienta).
- **⚠️ Zásadní důsledek pro výuku:** produkt **nemá živé uživatele ani analytiku**. Článek „Důkaz“ tedy zatím nemůže stát na číslech z provozu. To není problém — je to téma: důkaz se v téhle fázi bere z **usability testu s 5 lidmi**, heuristického auditu a předem vypsané metriky, kterou *budeš* měřit. Nepředstírat data, která nejsou.

### Existující UX materiál v jeho artifactech (nečíst znovu celé, jen když je potřeba)
- **„Sedm obrazovek“** (21. 8. 2026) — hotový audit partnerského portálu: globální nálezy (podtitulek u každého nadpisu = onboarding, co nikdy neskončí; tři seznamy = tři různé idiomy; obsah na třetinu využité šířky) + obrazovky Dnes / Ověření kódu / Slevy / Rezervace / Aktivity / Nastavení / Přihlášení, s konkrétním před/po a počty slov.
- **„Portál u pultu“**, **„LastGO klient prototyp“**, **„Rozhodnutí k v4“**, **„LastGo v2 — kde stojí práce“** — další kontext.
- ❓ **Otevřená otázka na uživatele:** kolik z těch nálezů vymyslel on a kolik mu nasypal agent? To je nejlepší dostupná diagnostika jeho skutečné úrovně — na ní stojí kalibrace oblouku 1.

## Otevřené otázky (doplnit od uživatele)
1. ~~Diagnostika úrovně~~ — **zodpovězeno jeho řetězem, viz LR-0002.** Kalibrace nahoru.
2. **Která plocha bude vlajková případovka** — partnerský portál (silná story: člověk vestoje u pultu, provozní nástroj), nebo zákaznický Flutter klient (líp se ukazuje, ale je to „další booking appka“)?
3. **Kdo je klient**, kterému se bude portfolio ukazovat? (agentura / startup / firma bez IT / lokální podniky) — mění, co v případovce zdůraznit.
4. **Nástroj:** Figma, nebo designovat rovnou v kódu? (viz Prostředí — Figma účet má jen View/Dev seat.)

## Prostředí (remote web session)
- **Web fetch FUNGUJE** (ověřeno 2026-09-17: nngroup.com, lawsofux.com, w3.org, webaim.org vrací 200). Starší poznámka v `node-backend/NOTES.md` o blokovaném egressu je pro tenhle environment **neaktuální**.
- **Figma MCP je připojené** jako `dev@tymbe.com`, ale seaty jsou **View** (dev's team) a **Dev** (TYMBE, a.s.) → čtení designu/Dev Mode ano, **zakládání a editace design souborů pravděpodobně ne**. Na vlastní návrhy bude potřeba osobní Figma účet (Starter má 3 soubory zdarma) nebo designovat v kódu.
- Hosting lekcí: stejně jako u backendu → `node tools/build-standalone.js lessons/000X-*.html` → publikovat jako Artifact.

## Working notes
- 2026-09-17: **Odpověděl vlastním řetězem na LASTGO — kalibrace nahoru, viz LR-0002.** Reálný výzkum s lidmi má za sebou, bariéra i rozhodnutí sedí. Mezery: cíl bez čísla, dvě bariéry slepené do jednoho rozhodnutí, rozhodnutí předběhlo důkaz (sázka místo testu). Dodána **lekce 0002 (Tok, ne obrazovky)** + `funnel-lab.js` + reference `trychtyr-a-eventy.html` s návrhem event spec pro LASTGO.
- 2026-09-17: Publikováno jako Artifact — lekce 01: https://claude.ai/artifact/Jo98HmRsVJZH2yuNoZ89qD · reference: https://claude.ai/artifact/E2mFtmA8LE2yrqoV3vG7AX
- 2026-09-17: Starý rozcestník `claude.ai/code/artifact/b5de0f60-…` z node-backend NOTES **už neexistuje** (read vrací not found). Až bude potřeba, publikovat nový z `index.html`.
- 2026-09-17: Workspace založen. Mise sepsána (portfolio + LASTGO jako vlajková případovka). Dodána **lekce 0001 (UX je rozhodnutí, ne vkus)** + komponent `decision-trace.js` + reference `retez-rozhodnuti.html`. Čeká se na popis LASTGO → pak lekce 02 (úkol uživatele) už na reálném produktu.
