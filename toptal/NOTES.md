# Notes — Toptal workspace

## Learner profile
- ~8 let Flutter/Dart. Silné: produktový vývoj, architektura appek, async/await, state management.
- Slabé / netrénované: algoritmy pod časem (škola, dávno), mobile system design nahlas, angličtina v technickém výkladu.
- Druhá kolej: `node-backend/` (backend hloubka). Sem se přenáší jen to, co Toptal reálně testuje.

## Rozhodnutí z úvodní konzultace (2026-09-12)
- **Track:** Flutter / mobile (ne backend) — nejsilnější karta, nejvyšší šance projít.
- **Fáze:** ještě nepřihlášen → termín si stanovujeme sami, gate je objektivní (viz PLAN.md).
- **Algo jazyk:** JavaScript/TS — skoro vždy dostupný na testovací platformě, navíc synergie s `node-backend/`.
- **Jazyk přípravy:** hybrid — výklad česky, drily / think-aloud / mocky anglicky.
- **Rozpočet:** 5–8 h/týden, cíl přihlášky ~12 týdnů.

## Teaching preferences (dědí se z node-backend)
- Žádná videa. Interaktivní komponenty > statický text.
- Hloubkový styl: téma = oblouk lekcí. Learner musí umět **odvodit**, ne zopakovat.
- Retrieval-first: háčky a diagnostické otázky před výkladem. Tenhle loop mu sedí.
- U „✅" odpovědí, které jen echo-ují můj hint, doptat se na mechaniku — ať to není jen fluency.

## Specifika tohoto workspace
- **Metrika navíc: čas.** Algo drily se logují s časem a počtem pokusů (`drills/LOG.md`), ne jen ✓/✗.
- **Komponenty:** potřeba jiný typ než quiz.js — stopky + log pokusů + odhalení vzoru po čase.
  Backlog: `timed-drill.js`, `complexity-match.js` (úloha ↔ optimální složitost), `trace-viz` (widget/element/render tree).
- Prostředí (remote web session): egress blokuje web fetch → pracuju z obecné znalosti procesu.
  Konkrétní detaily z Toptalu doplní uživatel, až je uvidí.

## Working notes
- 2026-09-12: Workspace založen, koncepce dohodnuta (3 paralelní tratě, 3 fáze, objektivní gate). Zadána vstupní diagnostika A (3 algo úlohy na čas, JS) + B (5 otázek na Flutter internals).
