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
- **`sessions/`** — *(vznikne s prvním tréninkem)* konkrétní plány praxe. Každá session:
  co dnes cvičit (sestava s dechem a počty), **jeden bod k procvičení** z aktuální lekce,
  a místo na zápis, jak to dopadlo. Odkazuje do `lessons/`, neduplikuje je.
- Po tréninku mi napiš, jak to šlo → z toho vzniká learning record a kalibruje se další lekce.

Pozor na past: sessions **nesmí nahradit** učební oblouk. Kdyby to sklouzlo k „vygeneruj mi
sestavu na dnešek", uživatel se naučí cvičit, ale ne skládat — a to je přesně cíl mise.

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
