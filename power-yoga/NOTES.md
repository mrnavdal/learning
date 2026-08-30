# Notes — Power jóga

## Learner profile (zjištěno 2026-08-30)
- **Zkušenost:** „párkrát zkusil" — byl na pár lekcích / zkoušel video. Základní pozice
  zná jménem, ale **nic systematicky**. Neber jako úplného nováčka, ale nic nepředpokládej.
- **Rozpočet:** 20–30 min, 3–4× týdně. → Lekce musí být krátká a **každá sestava musí
  reálně vejít do 20–30 min**. Nedělej 60min sekvence, které si stejně nezacvičí.
- **Zdraví:** bez omezení a bolestí. Standardní progrese je OK.
  ⚠️ Ověřuj průběžně — power jóga zatěžuje **zápěstí a ramena**; kdyby se něco ozvalo,
  hned to zapiš sem a přidej learning record.
- **Komunita:** jen online (fóra, subreddity). **Nenabízej studia ani lektory naživo.**
- **Prostředí:** doma, sám. Žádná korekce zvenčí → zpětná vazba musí být zabudovaná
  přímo v lekci (self-check cues, „jak poznáš, že to je špatně").

## Teaching preferences (přeneseno z node-backend workspace + potvrzeno)
- **Jazyk: čeština.** Sanskrt a zavedené anglické názvy pozic nech v originále
  (Chaturanga, Downward Dog), ale všechno vysvětluj česky. Lekce (HTML) taky česky.
- **Žádná videa.** Nikdy nedávej YouTube jako primární zdroj. Text, diagram, interaktivní prvek.
- **⭐⭐ HLOUBKA: téma = oblouk více lekcí, ne jeden průlet.** Uživatel chce rozumět tak,
  aby ho follow-up otázky napadaly samy. Uč **proč / mentální model**, ne jen *jak*.
- **⭐ Interaktivní komponenty > statický text.** Je OK obětovat víc úsilí na stavbu
  komponentů. U jógy to znamená: časovač dechu, přehrávač sekvence, stavebnice sestavy —
  ne jen fotky pozic a odstavce.
- **Feedback loop musí být automatický.** Kvíz je minimum, ne cíl.

## Specifikum jógy: znalost vs. dovednost
Tenhle workspace je **silně dovednostní**. Znalost (anatomie, názvosloví) je jen tolik,
kolik je potřeba pro dovednost. Platí:
- Lekce vždy končí **něčím, co si hned zacvičí** — ne teorií na později.
- **Reference dokumenty** (`reference/`) jsou tu důležitější než u programování: karty
  pozic a sestav, které si vytiskne / otevře na podložce vedle sebe. Musí být čitelné
  na jeden pohled a dobře se tisknout.
- Nemám jak vidět, jak cvičí. Proto každá pozice potřebuje **self-check cue** —
  ověřitelný pocit nebo test („když ti padá loket ven, je to špatně").

## Roadmapa (3 oblouky, 8 lekcí) — stav 2026-08-30

**Oblouk A — Motor praxe**
1. **Dech řídí pohyb** — jeden dech = jeden pohyb, nádech = expanze / výdech = flexe, ujjayi · lekce 0001 ✓
2. **Pozdrav slunci A** — první ucelená sekvence, atom power jógy · TODO
3. **Čaturanga & rameno** — lopatka, serratus anterior, bezpečná progrese, objem opakování · TODO

**Oblouk B — Slovník pozic**
4. **Postoje** — Warrior I/II, Chair, Triangle: co dělají, jak drží nohy · TODO
5. **Ramena & hrudní páteř do hloubky** — co dělá sezení, které pozice to opravdu řeší · TODO
   (jádro mise — mobilita ramen; sem patří thread the needle, rotace Th páteře, otevírání hrudníku)

**Oblouk C — Skládání a plánování (hlavní cíl mise)**
6. **Oblouk sestavy** — anatomie 25min praxe: centering → rozehřátí → slunce → postoje → vrchol → protipozice → zem → savasana · TODO
7. **Vrcholová pozice a zpětné plánování** — vyber cíl, odvoď přípravu; protipozice jako pravidlo · TODO
8. **Plánování týdne** — intenzita, objem, regenerace, kam dát ramenní práci · TODO

## Komponenty (assets/) — inventář & backlog
Reuse je default. Před psaním lekce si projdi `assets/` a stav z existujících prvků.
**Vzor komponentu:** čisté jádro (`CORE`, testovatelné) + `module.exports` guard +
DOM wrapper + Node test v `tools/test-*.js`. Stejný vzor jako v `node-backend/`.

- **Hotové:** `styles.css`, `quiz.js`, `breath-pacer.js` (l01 — časovaný dech s vizuální
  vlnou a počítadlem kol), `breath-match.js` (l01 — drill nádech/výdech na pohyb).
- **Backlog:**
  - `flow-player.js` (l02) — přehraje pozdrav slunci krok po kroku, časovaně, s dechem.
    Postav ho tak, aby uměl přehrát **libovolnou** sekvenci → použije se pak i v oblouku C.
  - `shoulder-check.js` (l05) — self-test rozsahu ramene, uživatel zapíše výsledek, opakuje za měsíc.
  - `sequence-builder.js` (l06/07) — **klíčový komponent celé mise.** Stavebnice: uživatel
    skládá pozice do sestavy, komponent hlídá oblouk (chybí rozehřátí? vrchol bez protipozice?
    vejde se to do 25 min?) a dává okamžitou zpětnou vazbu.
- Omezení hostingu: statický hosting, jen client-side JS (žádný backend).

## Working notes
- 2026-08-30: Workspace založen. Mise vyjasněna přes vstupní dotazník (zkušenost, čas,
  zdraví, komunita). Dodána **lekce 0001 (Dech řídí pohyb)** + komponenty `breath-pacer.js`,
  `breath-match.js` + reference `dech-a-pohyb.html`.
  Zvolený start: dech, protože je to zároveň (a) dovednost na hned, (b) **pravidlo, podle
  kterého se později skládají sekvence** — nádech/výdech určuje pořadí pozic. Tím se
  hned první lekce váže na hlavní cíl mise (skládání sestav), ne jen na „cvičení jógy".
- **Čeká na zpětnou vazbu:** jak mu sedne tempo dechu (4s vs 5s), jestli ujjayi zvládl
  vytvořit zvuk, a jestli mu drill nádech/výdech přišel triviální nebo tak akorát.
  Podle toho kalibruj obtížnost lekce 02.
