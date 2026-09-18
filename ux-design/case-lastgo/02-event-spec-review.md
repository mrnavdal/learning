# Review event specu (v1) — 2026-09-18

Spec dodal uživatel jako tabulku `# / Step / Event / Properties / What it answers`,
9 kroků + 7b. Hodnocení: **silný, místy silnější než kostra, kterou jsem dodal
v referenci.** Níž nálezy seřazené podle ceny, ne podle pořadí v tabulce.

## Co je vyloženě dobře (a proč to má cenu umět pojmenovat)

**1. Rozdělení klient / server (kroky 7, 8, 9 serverové).**
Nejlepší rozhodnutí v celém specu. Klientský `payment_completed` neztrácí data
náhodně — ztrácí **systematicky ty nejpomalejší a nejvíc třené případy**
(3-D Secure odklopí člověka do bankovní appky, appku může systém zabít), tedy
přesně ty, které by stály za studování. Server přes webhook je jediný pravdivý
zdroj. Tenhle typ úvahy je rozdíl mezi „nasypat eventy“ a navrhnout měření.

**2. Rozdělení 7 `reservation_paid` (server, peníze) a 7b `payment_result_shown`
(klient, co člověk viděl).**
Tohle je pokročilé a většina seniorů to nemá. Mezera mezi těmi dvěma čísly je
samostatná třída defektu: *zaplaceno, ale zákazník nikdy neviděl potvrzení* →
podpora, duplicitní pokusy, nedůvěra. Pojmenovat to `payment_result_shown`
místo `payment_completed` je přesně ta disciplína, o kterou jde: **event měří
pozorovatelnou událost, ne to, co si o ní myslíme.**

**3. `from` na `reservation_started`** (feed_card vs. offer_detail) — nákup
z karty je jiný akt než nákup po přečtení detailu. Bez toho se express booking
nedá vyladit.
**4. `requires_confirmation` + `custom_fields_count`** — dvě věci, které dělají
checkout dlouhým, povýšené na vlastnosti. Přesně ta štědrost, která se vyplatí za tři měsíce.
**5. `minutes_late` se znaménkem** (záporné = dřív) — jeden event místo dvou, směr zachován.
**6. `app_env`** — nudné a zásadní. Bez toho staging traffic tiše ředí produkční čísla.

## Musí se opravit před spuštěním

### N1 · Trychtýř se přetrhne na kroku s penězi (identita)
Kroky 1–6 jsou klientské a anonymní. Kroky 7–9 jsou serverové a klíčované přes
`reservation_id` / `business_id`. **Spec nikde neříká, jakým identifikátorem se
tyhle dvě poloviny spojí.** Když serverové eventy ponesou jen `user_id` a
klientské jen anonymní device id, nejde spočítat „z kolika lidí, co otevřeli
appku, někdo zaplatil“ — tedy jediná otázka, kvůli které to celé vzniká.

**Oprava:** klient pošle svoje analytické id s požadavkem na vytvoření
rezervace, backend ho uloží **na rezervaci** a přilepí ho ke *každému*
navazujícímu serverovému eventu (`reservation_paid`, `code_validated`,
`reservation_cancelled`). Plus standardní slití anonymního a přihlášeného id
při `signup_completed`.
Zpětně se to nedopočítá. Tohle je z celého seznamu nejdražší chyba.

### N2 · `feed_viewed` musí odejít i s `offers_shown: 0`
Krok se jmenuje „Sees **at least one** offer“, ale celý smysl vlastnosti
`offers_shown` je odlišit prázdný feed (problém nabídky) od plného feedu, na
který nikdo neklikne (problém návrhu). Když event nevznikne při nule, ta
distinkce mizí a v datech se prázdný feed tváří jako odchod z appky.
**Oprava:** event vzniká vždy, když se feed vykreslí. Krok přejmenovat na
„Uvidí feed“, podmínka „aspoň jedna nabídka“ je až filtr nad daty.

### N3 · Větev „čeká na potvrzení“ nemá žádné eventy
`booking_mode` a `requires_confirmation` znamenají, že část rezervací čeká na
odpověď partnera (na portálu „Čeká na odpověď“, s lhůtou a automatickým
zrušením). `payment_result_shown` to zná jako `outcome: awaiting_confirmation`
— **ale co se stalo potom, v datech není.**

U last-minute produktu je to kritické: když potvrzení trvá 40 minut a termín
začíná za 60, produkt je rozbitý — a nikde to neuvidíš.
**Oprava:** serverové `reservation_confirmed` / `reservation_rejected` /
`reservation_confirmation_expired` s `minutes_waited` a `booking_mode`.
A klientská strana téhož: vrátil se člověk zjistit výsledek?

## Doplnit, když už v tom bude

- **N4 · `attempt_number` u `reservation_payment_failed`.** Bez něj nerozeznáš
  „jeden člověk selhal třikrát“ od „selhali tři lidé“. Jiný problém, jiná oprava.
- **N5 · `code_validation_failed { reason }`** na straně partnera. Dnes je v
  backlogu ticket #66 („lookup nerozliší zrušený kód od neznámého“) — tohle je
  jeho měřicí strana. Bez eventu selhání nepoznáš, jak často se to u pultu děje.
- ~~**N6 · Krok se svolením k poloze.**~~ **Neplatí.** ⚠ znamenalo, že polohu ani
  `party_size` produkt nepotřebuje; obojí ze specu odstraněno (2026-09-18).
  Nález byl podmíněný a podmínka neplatí. **Zbývá ověřit:** jestli feed polohu
  nepoužívá *vůbec* (pak opravdu žádný krok se svolením neexistuje), nebo jen
  nezaznamenává vzdálenost (pak ten krok v trychtýři pořád je).
- **N7 · Dwell / scroll na detailu nabídky.** Krok 4 („works out what they are
  buying“) je dnes nejhůř instrumentovaný krok celého toku — a přitom odpovídá
  **druhé bariéře z výzkumu** („nechápou, jak to funguje“), tedy té, kterou
  rozhodnutí nemuselo vyřešit. `offer_closed { dwell_ms, scrolled_pct }` je
  levné a udělá z toho kroku informaci.

## Vědomě AŽ POTOM (ne teď)
- **Imprese nabídek.** `list_position` řekne, kam lidé klikli, ale míru prokliku
  podle pozice spočítat nejde, dokud nevíš, které nabídky byly **vidět**.
  Imprese jsou drahé na objem i na implementaci. Má to smysl, až bude feed
  dost dlouhý na to, aby se o jeho řazení dalo rozhodovat.

## Drobnost, nepovinné
`code_validated` vypadává z rodiny `reservation_*`. Jako `reservation_redeemed`
by šel celý životní cyklus číst jedním dotazem: *started → paid → confirmed →
redeemed / cancelled / expired*. Objektem je rezervace, kód je jen mechanismus.

## Poznámka k portfoliu
Sloupec „What it answers“ je ta nejcennější část celé tabulky a klient ho nikdy
nevidí. **Neškrtat.** Do případovky patří jako důkaz, že měření bylo *navržené*
— ne že se zapnula analytika a čekalo se, co vypadne.


---

# Rozhodnutí 2026-09-18: `payment_result_shown` × `reservation_result_viewed`

**Verdikt: nechat zvlášť.** Ne kvůli preferenci — kvůli tomu, že jde o **dva
různé objekty**, a to rozhodla už zvolená konvence `objekt_slovesoVMinulémČase`.

- `payment` a `reservation` mají **různý životní cyklus**. Platba může selhat,
  aniž kdy vznikne stav rezervace. Rezervace může být odmítnuta nebo vypršet
  dlouho po dokonale úspěšné platbě.
- Sloučený event by musel u `outcome: failed` popisovat rezervaci, která
  neexistuje. Tam, kde jeden event potřebuje větev „tahle vlastnost pro tenhle
  případ nedává smysl“, jsou to ve skutečnosti dva eventy.
- **Různý jmenovatel.** `payment_result_shown` se počítá z lidí, kteří platili.
  `reservation_result_viewed` z rezervací, které došly do konečného stavu.
  Jiná kohorta = jiný trychtýř; sloučit je je táž chyba jako míra konverze na obrazovku.
- **Mezi nimi je čekání** — a právě ta mezera je to nejcennější, co se tu dá
  měřit: **kolik lidí se nikdy nedozvědělo, jak to dopadlo.** Po sloučení ta
  otázka zmizí.

## Pravidlo, které z toho plyne obecně
**Dva eventy jde v dotazu sloučit. Jeden event nejde zpětně rozdělit.**
Při pochybnostech se tedy štěpí. Sloučení je vratné rozhodnutí, sloučení
předem je nevratné.

## Kdy naopak sloučit
Stejný okamžik **a** stejný jmenovatel **a** stejné rozhodnutí, které z toho
plyne **a** defekt nemůže existovat v jednom bez druhého. Musí platit všechno.

## Pravidla vzniku
| Případ | `payment_result_shown` | `reservation_result_viewed` |
|---|---|---|
| Instant, zaplaceno | `outcome: paid` | `surface: checkout`, `minutes_since_payment: 0`, `first_view: true` |
| Vyžaduje potvrzení | `outcome: awaiting_confirmation` | až později — `surface: push / reservations`, `minutes_since_payment: 47` |
| Platba selhala | `outcome: failed` | **nevzniká** — rezervace žádný stav nemá |

Vlastnosti k doplnění na `reservation_result_viewed`: `surface`
(checkout / push / reservations / deep_link), `minutes_since_payment`,
`first_view` (bool), `outcome` (confirmed / rejected / expired).

Díky `surface: checkout` jdou ta dvě čísla kdykoli složit do jednoho
(„viděl výsledek“), kdyby se to ukázalo jako správný pohled.

**Metrika, kterou to celé odemyká:** zaplacené rezervace, které došly do
konečného stavu a **nikdy** k nim nevznikl `reservation_result_viewed`.
To jsou lidé, kteří zaplatili a nedozvěděli se, jestli něco mají.

## Poznámka: `party_size` odstraněn
Rozumné, pokud je dohledatelný joinem přes `reservation_id`. **Ověřit ale kde
se budeš ptát:** když se otázky kladou v analytickém nástroji, který na
aplikační databázi nevidí, je vlastnost, co není na eventu, prakticky
neexistující. Navíc se to dotýká nedořešené nejednoznačnosti z auditu
„Sedm obrazovek“ (*jedna rezervace pro dva lidi obsadila jedno místo*) —
až se bude rozhodovat, co „místo“ znamená, budou se reálná čísla hodit.
