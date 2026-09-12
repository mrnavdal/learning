# PLAN — Toptal (Flutter/mobile track)

## Trychtýř: co každá brána testuje

| # | Brána | Co doopravdy filtruje | Moje riziko |
|---|---|---|---|
| 1 | Screening call (~30 min, EN) | Angličtina, komunikace, story | 🟡 střední |
| 2 | Timed test (algoritmy, ~90 min) | Rychlost + složitost pod tlakem | 🔴 **hlavní riziko** |
| 3 | Live technical screening (~90 min, EN) | Hloubka ve stacku + myšlení nahlas | 🔴 **hlavní riziko** |
| 4 | Test project (dny až týdny) | Architektura, testy, README, git | 🟢 hraju doma |
| 5 | Final / continued excellence | Profesionalita, follow-through | 🟢 |

Detaily (délka testu, nabízené jazyky, podoba test projectu) Toptal občas mění —
až je uvidíš naostro, dopiš je sem.

## Tři tratě, běží paralelně

Rozpočet ~6 h/týden:

| Trať | Dávka | Náplň |
|---|---|---|
| **A — Algo drill** | 4× 45 min | Vzory + časované úlohy v JS. Denní rytmus, ne víkendové nárazy. |
| **B — Hloubka** | 1× 90 min | Flutter internals → mobile system design. Formát oblouku. |
| **C — Výkon** | 1× 60 min | Anglicky: think-aloud, story, mocky. Roste ke konci. |

**Proč paralelně:** trychtýř netestuje po částech v čase, testuje po částech najednou.
Sekvenční plán skončí tím, že na mock přijdeš s vychladlými algoritmy.

## Fáze

### Fáze 1 — Vzory & základ (týdny 1–4)
- **A:** Big-O intuice, hashmapa/set, two pointers, sliding window, sort + binary search
- **B:** Flutter internals oblouk — widget/element/render tree, keys, const, rebuild vs repaint, isolates
- **C:** 60s pitch anglicky + 3 behaviorální odpovědi, nahlas

### Fáze 2 — Hloubka & rychlost (týdny 5–9)
- **A:** stack/queue, stromy, grafy (BFS/DFS), rekurze → memoizace, lehké DP; nástup časovaných setů
- **B:** Mobile system design oblouk — offline-first, sync & konflikty, cache vrstvy, API pro mizernou síť, auth na zařízení
- **C:** think-aloud drily anglicky nad algo úlohami (mluvit a kódovat zároveň je samostatná dovednost)

### Fáze 3 — Simulace (týdny 10–12)
- **A:** plné simulace testu (3 úlohy / 90 min), rozbor chyb
- **B:** mixed drill — náhodná hloubková otázka, odpověď do 2 minut
- **C:** plný mock live screening anglicky + test-project playbook

## Gate: kdy se přihlásit

Přihláška **až** když sedí všechno tohle — ne dřív, ne podle pocitu:

- [ ] 3 simulované testy po sobě: ≥ 2/3 úloh v limitu a v optimální složitosti
- [ ] Easy úloha ≤ 10 min, medium ≤ 25 min, stabilně
- [ ] Flutter internals: 5 vrstev follow-up otázek bez zaseknutí
- [ ] 1 mobile system design odjetý celý, nahlas, anglicky
- [ ] 60s pitch + 3 behaviorální odpovědi anglicky plynule

## Metriky (jiné než u ostatních témat)

U DB oblouku byla metrika porozumění. Tady jsou **dvě**:
1. **Porozumění** — napadly by mě follow-up otázky samy?
2. **Čas** — za jak dlouho a na kolikátý pokus jsem našel správnou složitost?

Proto se u algo dril logují časy, ne jen ✓/✗. Viz `drills/LOG.md`.

## Stav

- 2026-09-12: Workspace založen. Koncepce dohodnuta. Čeká se na vstupní diagnostiku (algo + Flutter internals).
