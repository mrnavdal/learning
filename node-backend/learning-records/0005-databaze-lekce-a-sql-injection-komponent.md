# Lekce 05 (databáze) + první „not-quiz" interaktivní komponent

Navazuje na misi (perzistence + „securing backends") a přímo na dotaz uživatele z konce lekce 04 (jak řešit 409 přes DB unique constraint). SQL má uživatel jako **floor** (baseline: napsal správný SELECT), takže lekce neučí SQL, ale **server-side delta**: `pg` (Pool/query/rows, async), parametrizované dotazy a **SQL injection** jako hlavní bezpečnostní pointa.

## Pedagogické rozhodnutí
- Jedna hlavní výhra lekce = **parametrizace vs. string concat** (nejčastější juniorní díra). Vše ostatní (pg mental model, 409 přes 23505) je kolem toho.
- 409 přes `23505` uzavírá smyčku z lekce 04 + přidává **race condition** argument (SELECT-pak-INSERT je špatně) — interview-grade.
- Plaintext `password` v demo tabulce je záměrný cliffhanger → lekce 06 (auth, hashování).

## Komponenty (naplnění preference „víc interaktivních prvků")
- **Nový komponent `sql-injection.js`** — demo prolomení loginu. Uvnitř **skutečný mini SQL-WHERE evaluátor** (literály, sloupce, =, AND, OR, --komentář), ne fake. Concat režim injection pustí, param ne.
- Ověřeno Node testem `tools/test-sql-injection.js` — **10/10** (včetně: concat injection vrátí admina, param nevrátí nic).
- Knihovna komponentů má teď **3 prvky**: `quiz.js`, `rest-playground.js`, `sql-injection.js`. Vzor „čisté jádro + DOM wrapper + Node test" se drží → dobře reusovatelné a verifikovatelné.

## Stav osvojení
Bez důkazu — čeká na kvíz + follow-up. Až uživatel potvrdí (hlavně *proč* parametr zastaví injection a *proč* 23505 místo SELECT-first), lze DB základ považovat za floor a jít na auth.

## Další ZPD
- **Lekce 06: autentizace** — hashování hesel (bcrypt/argon2), pak JWT vs session + tradeoffs. Přirozeně navazuje na plaintext heslo z demo.
- Backlog komponentů (NOTES): `event-loop-viz`, `code-fill`, `drag-match`; nově nabízí se `jwt-inspector` pro lekci 06.
