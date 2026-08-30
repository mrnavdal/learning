# Notes — Power jóga

## Learner profile (zjištěno 2026-08-30)
- **Zkušenost:** „párkrát zkusil" — byl na pár lekcích / zkoušel video. Základní pozice
  zná jménem, ale **nic systematicky**. Neber jako úplného nováčka, ale nic nepředpokládej.
- **Rozpočet:** cíl **60–90 min, 2–3× týdně**; teď je na 1. kroku rampy (25–35 min).
  → Lekce zůstává krátká (pracovní paměť), ale **sestavy stav pro aktuální krok rampy**.
  Nikdy nestav rovnou 90min praxi, protože je to cíl — stav pro to, co unese dnes.
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

## Roadmapa (4 oblouky, 10 lekcí) — stav 2026-08-30 (přestavěno po upřesnění mise)

**Oblouk A — Motor praxe**
1. **Dech řídí pohyb** — jeden dech = jeden pohyb, nádech = expanze / výdech = flexe, ujjayi · lekce 0001 ✓
2. **Pozdrav slunci A** — první ucelená sekvence, atom power jógy · TODO
3. **Čaturanga & rameno** — lopatka, serratus anterior, bezpečná progrese, objem opakování · TODO

**Oblouk B — Slovník pozic**
4. **Postoje** — Warrior I/II, Chair, Triangle: co dělají, jak drží nohy · TODO
5. **Ramena & hrudní páteř do hloubky** — co dělá sezení, které pozice to opravdu řeší · TODO
   (jádro mise — mobilita ramen; sem patří thread the needle, rotace Th páteře, otevírání hrudníku)

**Oblouk C — Skládání sestavy**
6. **Oblouk sestavy** — anatomie 25min praxe: centering → rozehřátí → slunce → postoje → vrchol → protipozice → zem → savasana · TODO
7. **Vrcholová pozice a zpětné plánování** — vyber cíl, odvoď přípravu; protipozice jako pravidlo · TODO

**Oblouk D — Síla a progrese** ⭐ (přidán 2026-08-30, viz LR-0002)
8. **Šest pák progrese** — jak se v józe přidává zátěž bez činek: páka (leverage), tempo
   a excentrika, čas pod napětím, rozsah pohybu, opora/stabilita, objem a hustota. Tohle je
   znalostní jádro celého oblouku — bez něj je „přejít na těžší pozici" jen hádání. · TODO
9. **Progresní řady** — konkrétní žebříčky u klíčových pozic (prkno → čaturanga s koleny →
   plná čaturanga → boční prkno; dvounožné → jednonožné stoje; příprava na crow). Kde jsi
   teď a **jak poznáš, že je čas na další příčku** — i kdy couvnout. · TODO
10. **Plánování týdne s progresí** — rozložení tvrdých a lehkých praxí, regenerace, vedení
    záznamu, kdy přidat příčku. + poctivé pojmenování stropu čisté jógy (chybějící tah)
    a co s tím v rámci jógy jde dělat. · TODO

### Pravidlo pro celý oblouk D
Progresivní overload potřebuje **záznam** — bez čísel (kolik kol, jak dlouhá výdrž, která
příčka) se přidávat zátěž nedá, protože není proti čemu porovnávat. Než začne oblouk D,
musí existovat komponent/formát pro trénink. Viz backlog `training-log`.

## Pracovní rytmus: lekce ke každému tréninku (dohodnuto 2026-08-30)
Uživatel sám nabídl, že si ke **každé cvičební session udělá novou lekci**, probere ji se
mnou a věci z ní pak implementuje v tréninku. Beru to — je to ideální feedback loop, protože
jinak nemám jak vidět, jak cvičí. Rozdělení:

- **`lessons/`** — číslovaný učební oblouk (A–D výše). Backbone, jede svým tempem,
  jedna lekce = jedna nová dovednost nebo mentální model.
- **`sessions/`** — konkrétní plány praxe, `NNNN-<nazev>.html`. Založeno 2026-08-30.
  Každá session má **pevný tvar**: (1) 🎯 *dnešní téma* — jedna nová aplikovaná věc k probrání,
  (2) běhoun praxe (`session-runner`), (3) 📝 *zápis* — konkrétní čísla, která mi uživatel
  pošle do chatu, (4) odkazy zpět do `lessons/`. Session nikdy neduplikuje teorii z lekce,
  jen ji aplikuje.
  **Další session vzniká ze zápisu předchozí, ne ze šablony.** To je celý smysl — uživatel
  chtěl „probírat každou tréninkovou jednotku něco nového".
- Po tréninku mi napiš, jak to šlo → z toho vzniká learning record a kalibruje se další lekce.

Pozor na past: sessions **nesmí nahradit** učební oblouk. Kdyby to sklouzlo k „vygeneruj mi
sestavu na dnešek", uživatel se naučí cvičit, ale ne skládat — a to je přesně cíl mise.

## Rampa délky praxe (cíl 60–90 min, 2–3× týdně)
Uživatel míří na 60–90 min 2–3× týdně, ale **chce se tam vypracovat postupně** (výslovně
2026-08-30). Délka praxe je tím pádem sama o sobě páka progresivního overloadu — patří
do oblouku D.

| Krok | Délka | Stav |
|---|---|---|
| 1 | 25–35 min | ← teď (trénink 01) |
| 2 | 40–45 min | |
| 3 | 55–60 min | |
| cíl | 75–90 min | |

**Postup podle důkazů, ne kalendáře.** Na další krok až když platí všechno:
1. ujjayi vydrží plynulé celou praxi včetně poslední třetiny,
2. druhý den žádná bolest v ramenou/zápěstích (svalová únava OK, bolest kloubu ne),
3. poslední blok praxe neodbývá,
4. současnou délku zvládl 3× po sobě.

Když podmínka neplatí, zůstává na kroku. Celá rampa ≈ 2 měsíce.

⚠️ **Délka nesmí přicházet z většího objemu vinyas.** Prodlužuj drženými pozicemi, prací
na zemi a delším závěrem — objem opakování vůči síle je hlavní faktor zranění ramene
(viz RESOURCES, Yoganatomy). Zátěž na ramena a zápěstí drž zatím konstantní.

## Komponenty (assets/) — inventář & backlog
Reuse je default. Před psaním lekce si projdi `assets/` a stav z existujících prvků.
**Vzor komponentu:** čisté jádro (`CORE`, testovatelné) + `module.exports` guard +
DOM wrapper + Node test v `tools/test-*.js`. Stejný vzor jako v `node-backend/`.

- **Hotové:** `styles.css`, `quiz.js`, `breath-pacer.js` (l01 — časovaný dech s vizuální
  vlnou a počítadlem kol), `breath-match.js` (l01 — drill nádech/výdech na pohyb),
  `session-runner.js` (s01 — **běhoun praxe**: přehraje libovolnou sestavu krok po kroku
  s odpočtem, cue, náhledem dalšího kroku a přehledem celé praxe; umí **varianty délky**
  přes `tier` na kroku + `lengths`, takže jedna praxe jede v 25/30/35 a jádro zůstane).
  ⭐ `session-runner` je **datově řízený** — nová session = jen nová JSON sada kroků, žádný
  nový kód. Používej ho pro každý trénink a později i v oblouku C pro přehrání sestav,
  které si uživatel sám složí. Tím pádem `flow-player` z backlogu odpadá, je to on.
- **Backlog:**
  - `shoulder-check.js` (l05) — self-test rozsahu ramene, uživatel zapíše výsledek, opakuje za měsíc.
  - `training-log.js` (před obloukem D) — **předpoklad progresivního overloadu.** Zápis
    praxe (datum, pozice, výdrž/počty, příčka progrese, jak šel dech), uloženo v
    `localStorage`, s přehledem trendu. Bez čísel se zátěž přidávat nedá.
  - `progression-ladder.js` (l09) — žebříček příček u jedné pozice: kde jsi, co je další,
    jaká je vstupní podmínka na postup. Znovupoužitelný pro každou pozici.
  - `sequence-builder.js` (l06/07) — **klíčový komponent celé mise.** Stavebnice: uživatel
    skládá pozice do sestavy, komponent hlídá oblouk (chybí rozehřátí? vrchol bez protipozice?
    vejde se to do 25 min?) a dává okamžitou zpětnou vazbu.
- Omezení hostingu: statický hosting, jen client-side JS (žádný backend).

## Hosting lekcí (jak si je prohlížím v browseru)
Stejná cesta jako u `node-backend/`: **Artifacty na claude.ai** — okamžitá publikace, žádné CI.
- Build: `node tools/build-standalone.js lessons/000X-....html` → `build/` (inlinuje `styles.css`
  i všechny `assets/*.js`). Pak publikovat přes Artifact tool. `build/` je v `.gitignore`.
- Build zahazuje `<head>`, takže **název artifactu se předává parametrem `title`** — při
  redeploji ho drž stejný, jinak se uživateli přejmenuje záložka.
- Křížové prokliky mezi lekcemi uvnitř artifactu nefungují (každý = vlastní URL).
- Redeploy jde na stejnou URL při stejné `file_path` **ve stejné konverzaci**; z jiné session
  se musí předat `url`.

**Publikované URL (aktualizovat při nové lekci / re-deploji):**
- L01 Dech řídí pohyb: https://claude.ai/code/artifact/53dc86cf-b875-487a-a8b5-9a1301cb5d78
- 📄 Reference „Dech u podložky": https://claude.ai/code/artifact/d08ae0f8-f236-4157-9be4-f35a24db05fd
- 🧘 Trénink 01 „První praxe": https://claude.ai/code/artifact/f0d12b87-14ab-46c9-b97d-eefc6a272c05

## Working notes
- 2026-08-30: **Založen `sessions/` + trénink 01.** Uživatel chce ke každé tréninkové
  jednotce probrat něco nového → session dostala sekci „🎯 dnešní téma". U tréninku 01 je
  tématem **dech jako měřák zátěže** (v prknech si všímat vteřiny, kdy se dech zlomí).
  Zvoleno schválně: propojí lekci 01 (dech je limit) s novým cílem mise (progresivní
  overload) a **vyrobí první číslo do záznamu** — nultý bod, proti kterému se dá měřit.
  Praxe 17:16, oblouk usazení → rozehřátí → hlavní → závěr, jen pohyby z lekce 01
  + poloviční pozdrav slunci (bezpečný pro začátečníka, plná čaturanga až v lekci 03).
- 2026-08-30: **Cíl délky změněn na 60–90 min / 2–3× týdně, s postupnou rampou.**
  Trénink 01 přepsán z 17 min na 25/30/35 (volba v běhounu) a doplněn o rampu i podmínky
  postupu. `session-runner` rozšířen o varianty délky (`tier`), +8 testů.
  Délka přibyla drženými pozicemi a prací na zemi (Puppy pose, Sphinx, holubička, most),
  **ne dalšími vinyasami** — zátěž na ramena zůstala stejná.
- **Čeká na zápis z tréninku 01** (zvolená délka, prkna: vteřina zlomu dechu ×3, kde zmizelo
  ujjayi, přítomnost v poslední třetině, tužší strana u thread the needle, co tlačilo
  a co druhý den). Z toho postavit trénink 02 a rozhodnout o kroku rampy.
- 2026-08-30: Workspace založen. Mise vyjasněna přes vstupní dotazník (zkušenost, čas,
  zdraví, komunita). Dodána **lekce 0001 (Dech řídí pohyb)** + komponenty `breath-pacer.js`,
  `breath-match.js` + reference `dech-a-pohyb.html`.
  Zvolený start: dech, protože je to zároveň (a) dovednost na hned, (b) **pravidlo, podle
  kterého se později skládají sekvence** — nádech/výdech určuje pořadí pozic. Tím se
  hned první lekce váže na hlavní cíl mise (skládání sestav), ne jen na „cvičení jógy".
- **Čeká na zpětnou vazbu:** jak mu sedne tempo dechu (4s vs 5s), jestli ujjayi zvládl
  vytvořit zvuk, a jestli mu drill nádech/výdech přišel triviální nebo tak akorát.
  Podle toho kalibruj obtížnost lekce 02.
