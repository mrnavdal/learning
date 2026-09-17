# Umí výzkum a řetěz složí sám — kalibrace nahoru

**Evidence:** Na úkol z lekce 01 (napiš řetěz pro LASTGO) odpověděl vlastním,
skutečným řetězem, ne cvičným:

- **Bariéra:** z rozhovorů s lidmi — „nechce se jim odcházet z aplikace, aby se
  zarezervovali v systému někoho jiného, a obecně nechápou, jak to funguje.“
  Pozorované, ne domnělé. Dvě bariéry, ne jedna.
- **Rozhodnutí:** implementovat rezervaci a platby přímo v appce. Míří přesně
  na bariéru (a) — žádná kosmetika, žádné obcházení.
- **Důkaz:** „hlavní je, že se začnou dít rezervace bez mého přičinění samy od
  sebe.“ To je **behaviorální, falsifikovatelný signál** a je lepší než míra
  konverze, kterou zmínil jako první. Instinkt „vanity metrika není důkaz“ má
  správný, jen pro něj neměl jméno.

**Co z toho plyne pro výuku — kalibrace nahoru.** Rozdíl mezi bariérou a vkusem,
mezi pozorováním a domněnkou, mezi aktivitou a výsledkem už nepotřebuje učit.
Oblouk 1 se zkracuje: lekce o tom, „co je bariéra“, odpadá.

**Tři reálné mezery, které v jeho řetězu zbyly** (to je teď ZPD):

1. **Cíl bez čísla a bez jmenovatele.** Sám říká „nevíme kolik“ — nemá funnel,
   takže nemá z čeho počítat. Zároveň to znamená, že nemá s čím porovnat „po“.
2. **Dvě bariéry slepené do jednoho rozhodnutí.** Rezervace v appce řeší
   „nechce se mi odcházet“. Neřeší nutně „nechápu, jak to funguje“ — to je
   bariéra porozumění, která po nasazení může zůstat. Tohle si neuvědomil.
3. **Rozhodnutí předběhlo důkaz.** Postavil několikaměsíční featuru a ověření
   přijde až po ní. To je sázka, ne test. Není to chyba (výzkum ji podpírá a
   platby v appce jsou stejně strategicky správné), ale je to **ten reflex,
   který dělá rozdíl u placené zakázky**: „co nejmenšího stačí, abych tu
   hypotézu ověřil dřív, než to postavím?“

**Načasování:** produkci spouští příští týden a **právě teď implementuje
analytiku**. Okno na to naučit ho navrhnout trychtýř a eventy je teď — zpětně
se data nedopočítají. Proto pořadí oblouku 1 přehozeno: lekce 02 = tok a eventy
(původně 3), JTBD do hloubky až potom.
