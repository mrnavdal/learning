# Hloubkový pivot: téma = oblouk více lekcí + start DB oblouku

## Klíčová zpětná vazba (2026-07-04)
Uživatel řekl, že lekce jsou **moc povrchní** a že teasery advanced věcí na konci jsou málo. Chce *„porozumět tématu natolik, aby ho ty otázky napadly samy od sebe"* a explicitně počítá s **více lekcemi na téma**.

## Rozhodnutí (potvrzené uživatelem)
- Zvolil **„prohloubit databáze teď"** (ze 4 nabídnutých směrů: roadmapa / prohloubit DB / vpřed na auth / zpět k základům).
- **Nový standard hloubky** (zapsán v NOTES teaching preferences ⭐⭐): téma → **oblouk krátkých, ale hlubokých lekcí**; učit *proč / z prvních principů*; advanced otázky jsou další zastávky oblouku, ne teasery. Test: napadly by follow-up otázky uživatele samy?

## Co dodáno
- Lekce 0005 přeznačena jako **Databáze 1/7**; její footer nasměrován na díl 2 + přidán rozpis oblouku.
- **Lekce 0006 — Schéma jako kontrakt (2/7)**: první lekce v novém hloubkovém stylu. Ústřední myšlenka *naděje vs. záruka* (aplikační validace × DB constraint). Typy jako první constraint (numeric/timestamptz/text/uuid — návrhová rozhodnutí). Pět constraintů, do hloubky FK + `ON DELETE` (RESTRICT/CASCADE/SET NULL). Most: PG error kódy (23502/23505/23514/23503) → HTTP status → propojení s lekcí 04 a dílem 1.
- **Komponent `constraint-sandbox.js`** (4. v knihovně) — INSERT vs constraints, ukazuje porušený constraint + PG kód + HTTP status. Node test 8/8.

## Stav osvojení
Bez důkazu — čeká na kvíz + follow-up. Signál úspěchu nového stylu: až se uživatel začne ptát sám na partial unique index / composite PK / kdy se FK kontroluje (to jsou záměrně zaseté háčky ve footeru 0006).

## Další
DB oblouk díl 3 = **Migrace** (jak měnit schéma bez ztráty dat). Plný plán oblouku v NOTES. Auth až po DB oblouku.
