# UX Design Resources

Pravidlo: do lekcí se cituje odsud, ne z hlavy. Všechny odkazy ověřeny 2026-09-17 (HTTP 200).

## Knowledge — základ a proces

- [NN/g — The Definition of User Experience (UX)](https://www.nngroup.com/articles/definition-user-experience/)
  Norman & Nielsen, tedy lidé, kteří ten termín zavedli. Na to: UX ≠ UI ≠ použitelnost.
  Použij pro: vymezení pojmů, argument klientovi, proč „udělejte to hezčí“ není zadání.
- [NN/g — Usability 101](https://www.nngroup.com/articles/usability-101-introduction-to-usability/)
  Pět složek použitelnosti (learnability, efficiency, memorability, errors, satisfaction).
  Použij pro: rozklad vágního „je to nepohodlné“ na měřitelné komponenty.
- [NN/g — 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
  Nielsenových 10 heuristik. Nejlepší poměr užitku k času v celém oboru.
  Použij pro: heuristický audit (oblouk 1, lekce 4) — přímý deliverable pro klienta.
- [NN/g — Task Analysis](https://www.nngroup.com/articles/task-analysis/)
  Jak rozložit úkol uživatele na kroky dřív, než navrhneš obrazovky.
  Použij pro: task flow, hledání zbytečných kroků.
- [NN/g — Journey Mapping 101](https://www.nngroup.com/articles/journey-mapping-101/)
  Mapa cesty včetně toho, co se děje mimo tvůj produkt.
  Použij pro: případovku — ukazuje klientovi kontext, ne jen obrazovky.
- [NN/g — Why You Only Need to Test with 5 Users](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/)
  Klasika: 5 uživatelů odhalí ~85 % problémů použitelnosti; radši 3× pět než 1× patnáct.
  Použij pro: obhajobu malého (a levného) testu před klientem.
- [NN/g — Design Critiques](https://www.nngroup.com/articles/design-critiques/)
  Jak dávat a přijímat zpětnou vazbu na návrh, aniž se z toho stane hádka o vkus.
  Použij pro: prezentaci návrhu klientovi.

## Knowledge — řemeslo a systém

- [Laws of UX — Jon Yablonski](https://lawsofux.com/)
  Zákony z kognitivní psychologie (Hick, Fitts, Miller, Jakob, Von Restorff…) s citací původní studie.
  Použij pro: mechanismus za rozhodnutím. Nikdy necituj samotný zákon — jdi na primární zdroj, který u něj je.
- [Refactoring UI — Wathan & Schoger](https://www.refactoringui.com/)
  Placená kniha psaná vývojáři pro vývojáře: hierarchie, spacing, barva, stíny. Nejrychlejší cesta od „vypadá to jako od programátora“ k „vypadá to profesionálně“.
  Použij pro: oblouk 2. (Placené — kupovat, až na to dojde řada.)
- [Material Design 3](https://m3.material.io/)
  Systém, ve kterém už roky staví ve Flutteru — jenže tady zezadu: *proč* jsou ta pravidla taková.
  Použij pro: tokeny, typografickou škálu, komponenty, a most design → Flutter theme.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
  Druhá polovina mobilního světa. Kde se liší od Material — a proč.
  Použij pro: iOS konvence, srovnání platformních idiomů.
- [WCAG 2.2 — Quick Reference (W3C)](https://www.w3.org/WAI/WCAG22/quickref/)
  Normativní zdroj přístupnosti. Ne blogpost, ale standard.
  Použij pro: kontrast, velikost cílů, fokus, klávesnice — a jako argument u zakázek pro veřejný sektor.
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
  Nástroj: spočítá kontrastní poměr a řekne AA/AAA verdikt.
  Použij pro: okamžitou kontrolu palety.
- [Inclusive Components — Heydon Pickering](https://inclusive-components.design/)
  Komponenty (tabs, modal, menu) rozebrané do hloubky včetně přístupnosti.
  Použij pro: když navrhuješ komponent, který má nestandardní chování.

## Knowledge — případovky a portfolio

- [Growth.Design — Case Studies](https://growth.design/case-studies)
  Rozbory reálných produktů s psychologickým principem u každého rozhodnutí. Formát sám je ukázka, jak případovku vyprávět.
  Použij pro: strukturu vlastní případovky, slovník pro klienta.
- [Case Study Club](https://www.casestudy.club/)
  Kurátorovaná sbírka UX případovek z portfolií. Sleduj **strukturu**, ne vizuál.
  Použij pro: benchmark, jak má vypadat případovka, kterou klient dočte.
- [Mobbin](https://mobbin.com/)
  Knihovna reálných obrazovek z produkčních appek, tříděná podle toků.
  Použij pro: než vymyslíš vzor, podívej se, co už uživatel zná odjinud (Jakobův zákon).

## Wisdom (komunity)

- [r/UXDesign](https://www.reddit.com/r/UXDesign/)
  Slušně moderované, hodně praktikujících. Použij pro: kritiku portfolia a případovek, reality-check cen a scope.
- [Smashing Magazine — UX](https://www.smashingmagazine.com/category/ux/)
  Redakčně vedené, autoři z praxe. Použij pro: hloubkové články k jednomu problému.
- Lokálně (CZ): meetupy okolo produktu a designu (např. UX/produktové srazy v Praze/Brně), a **hlavně 5 reálných lidí na test LASTGO**.
  Nejrychlejší moudrost není fórum — je to sledovat živého člověka, jak se zasekne na tvé obrazovce.

## Gaps
- Chybí ověřený zdroj konkrétně na **cenotvorbu a scoping UX zakázek pro freelancera** (jak nacenit audit / redesign). Dohledat před obloukem 4.
- Chybí dobrý český zdroj — zatím vše anglicky. Není blokující (učící se čte anglicky), ale pro **materiály směrem ke klientovi** se bude hodit česká terminologie → řeší `GLOSSARY.md`.
