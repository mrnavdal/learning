# Event spec: navrhuje měření, nejen zapisuje eventy

**Evidence:** Po lekci 02 dodal vlastní event spec (9 kroků + 7b) ve formátu
krok / event / vlastnosti / *na co to odpoví*. Tři věci v něm jsou nad úrovní,
kterou lekce učila:

1. **Rozdělil klientské a serverové eventy** a zdůvodnil to mechanismem:
   při 3-D Secure odchází člověk do bankovní appky a klientský event ztrácí
   data **systematicky**, ne náhodně — mizí ty nejvíc třené případy.
2. **Rozdělil „peníze proběhly“ a „zákazník viděl výsledek“** (`reservation_paid`
   vs. `payment_result_shown`) a výslovně odmítl název `payment_completed`,
   protože event má měřit pozorovatelnou událost, ne domněnku o ní.
3. **Vlastnosti volil podle budoucích otázek**, ne podle obrazovek
   (`from`, `requires_confirmation`, `custom_fields_count`, `list_position`).

Tohle nebylo v lekci. Odvodil to sám — což je přesně ten test hloubky z NOTES:
*napadly by ty otázky learnera samy?* Tady ano.

**Kde jsou meze (to je teď ZPD):** nálezy byly systémové, ne lokální —
věci, které nejdou vidět z jednoho řádku tabulky, jen z celku:
- **Spoj mezi anonymním klientem a serverovými eventy** (trychtýř se trhá na
  kroku s penězi) — chybí, protože to není vlastnost žádného *jednoho* eventu.
- **`feed_viewed` při nule nabídek** — rozpor mezi názvem kroku a účelem vlastnosti.
- **Celá větev „čeká na potvrzení“** — krok úkolu, který se odehrává, když je
  appka zavřená, takže se na něj při procházení obrazovek nepřijde.

Společný vzorec: **kroky, které se nedějí na obrazovce** (systémový dialog,
čekání na partnera, handoff do banky) jsou jeho slepé místo. Umí zmapovat, co
vidí. Do dalších lekcí (IA, heuristiky, stavy obrazovky) zapracovat právě tohle
— stavy a přechody, které nemají vlastní obrazovku.

**Kalibrace:** oblouk 1 lze zkrátit na zbývající dva díly, tempo držet vysoko.
