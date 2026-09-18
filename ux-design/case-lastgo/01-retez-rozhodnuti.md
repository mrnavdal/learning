# Řetěz rozhodnutí: rezervace a platba do appky

Zapsáno 2026-09-17 podle toho, jak to uživatel popsal. Formulace jsou jeho,
strukturu dodal řetěz z lekce 01.

## Cíl
Aby si lidé, kteří se do appky dostali, skutečně koupili slevu.
**Chybí číslo a chybí jmenovatel** — v době rozhodnutí nebyla analytika, takže
neexistuje „před“, ke kterému se dá „po“ přirovnat. To je v případovce potřeba
přiznat, ne domyslet zpětně.

## Bariéra (z vlastního výzkumu s lidmi)
1. **Nechce se jim odcházet z appky**, aby dokončili rezervaci v systému partnera.
2. **Nechápou, jak to celé funguje.**

Pozorované, ne domnělé — to je ten článek, který celý řetěz drží.
⚠️ Jsou to **dvě bariéry**, ne jedna. Rozhodnutí níž míří na první.

## Rozhodnutí
Implementovat **rezervaci i platbu přímo v aplikaci**.

Míří přesně na bariéru 1. Na bariéru 2 míří jen nepřímo (odpadne předávání do
cizího prostředí, což je část toho zmatku) — **porozumění tomu, co si člověk
kupuje a co se stane u pultu, může nasazení přežít.**

Druhý důvod, který v původním zdůvodnění nezazněl a do případovky patří:
krok, který se děje v cizím systému, **nelze nikdy změřit**. Rozhodnutí tedy
neodstranilo jen tření pro uživatele, ale i trvalé slepé místo přesně v tom
kroku, kde se rozhoduje o penězích.

## Důkaz
„Hlavní je, že se začnou dít rezervace **bez mého přičinění**, samy od sebe.“

Behaviorální a nenafouknutelný signál — lepší než míra konverze, kterou
uživatel zmínil jako první. **Chybí mu práh a lhůta**, vyslovené dřív, než
dorazí první data (produkce se spouští v týdnu od 22. 9. 2026).

## Poctivá poznámka do sekce „co bych udělal jinak“
Rozhodnutí předběhlo důkaz: featura na několik měsíců, ověření až po ní. Sázka,
ne test. Výzkum ji podpírá a platby v appce jsou strategicky správně tak jako
tak — ale otázka, která u placené zakázky dělá rozdíl, zní: *co nejmenšího
stačí, abych tu hypotézu ověřil dřív, než to postavím?*
