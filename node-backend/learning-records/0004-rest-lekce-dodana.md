# REST lekce (0004) dodána — idempotence + status kódy

Navázáno přesně na příslib z konce lekce 03. Lekce 0004 uzavírá poslední velkou mezeru z [[0001-prior-knowledge-baseline]] na straně REST: POST/PUT (prohozené v diagnostice → opraveno už v 03, tady utvrzeno přes **idempotenci** jako důvod), status kódy (200 vs 201 vs 204) a **409** (v baseline „nezná").

**Přístup:** idempotence zavedena přes most z Flutteru (retry po timeoutu — POST nebezpečný, PUT/GET/DELETE OK), protože to je pro hireability víc než definice — je to „proč" za volbou metody. 409 vysvětleno kontrastem 400 vs 409 vs 500 (validní vstup × stav serveru × spadlý kód) — přesně ta jemnost, na kterou se ptají u pohovoru.

**Zatím bez důkazu osvojení** — čeká se na kvíz (4 otázky) a follow-up. Až potvrdí (hlavně 409 zdůvodnění a idempotenci POSTu), lze REST považovat za solidní floor a stavět dál.

**Vytvořen reference cheat sheet** `reference/rest-metody-a-status-kody.html` (metody + idempotence + status kódy) — první REST reference, drž se jí v dalších lekcích.

## Zbývající mezery / další ZPD
- **Databáze (Postgres/SQL)** — logický další krok mise. SQL má uživatel jako floor (baseline), takže učit *server-side delta*: připojení z Node (`pg`), perzistence, a 409 znovu — tentokrát vynucené DB unique constraintem. To spojí REST s daty.
- Moduly (CommonJS vs ESM), semver — částečně načato v lekci 03 (package.json), plná lekce zatím ne. Nižší priorita než DB.

## Provozní poznámka (prostředí)
2026-07-03: V remote session **egress policy blokuje web fetch** (MDN, httpwg → 403 z proxy). RESOURCES odkazy jsou kanonické a platné, ale nešly v této session ověřit živě. REST fakta jsou RFC 9110 standard (stabilní), proto lekce postavena na nich s odkazem na primární zdroj. Pro budoucí sessions: potřeba povolit síťovou politiku prostředí (viz odpověď uživateli).
