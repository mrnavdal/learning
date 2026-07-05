/* migration-runner.js — interaktivní demo migrací na živých datech (komponent).
 *
 * Ukazuje jádro migrací: schéma se mění v uspořádaných, sledovaných krocích, a
 * DDL na tabulce s daty NENÍ zadarmo. Naivní `ADD COLUMN ... NOT NULL` na plné
 * tabulce spadne; bezpečná cesta je nullable → backfill → SET NOT NULL.
 *
 * Použití v lekci:
 *   <div class="migration-runner"></div>
 *   <script src="../assets/migration-runner.js"></script>
 *
 * Jádro applyMigration() je čistá funkce → testovatelné v Node
 * (viz tools/test-migration-runner.js).
 */
(function () {
  'use strict';

  function col(state, name) { return state.columns.find(function (c) { return c.name === name; }); }

  // Aplikuj migraci na stav. Vrať {ok:true} (a zmutuj stav) nebo {ok:false, error}.
  function applyMigration(state, mig) {
    switch (mig.op) {
      case 'addColumn': {                       // přidej nullable sloupec
        if (col(state, mig.column)) return err('Sloupec "' + mig.column + '" už existuje.');
        state.columns.push({ name: mig.column, notNull: false, unique: false });
        state.rows.forEach(function (r) { r[mig.column] = null; });
        return done(state, mig);
      }
      case 'addColumnNotNull': {                // naivní: NOT NULL bez defaultu
        if (col(state, mig.column)) return err('Sloupec "' + mig.column + '" už existuje.');
        if (state.rows.length > 0)
          return err(state.rows.length + ' existujících řádků by mělo "' + mig.column + '" = NULL, ale NOT NULL to zakazuje. (Prázdná tabulka by prošla.)');
        state.columns.push({ name: mig.column, notNull: true, unique: false });
        return done(state, mig);
      }
      case 'backfill': {                        // doplň hodnotu do existujících řádků
        if (!col(state, mig.column)) return err('Sloupec "' + mig.column + '" neexistuje — nejdřív ho přidej.');
        state.rows.forEach(function (r) { r[mig.column] = mig.value; });
        return done(state, mig);
      }
      case 'setNotNull': {                      // přitvrď na NOT NULL
        var c = col(state, mig.column);
        if (!c) return err('Sloupec "' + mig.column + '" neexistuje.');
        if (state.rows.some(function (r) { return r[mig.column] == null; }))
          return err('Sloupec "' + mig.column + '" má v některých řádcích NULL — nejdřív backfill.');
        c.notNull = true;
        return done(state, mig);
      }
      case 'addUnique': {                       // unikátní constraint
        var cc = col(state, mig.column);
        if (!cc) return err('Sloupec "' + mig.column + '" neexistuje.');
        var seen = {}, dup = false;
        state.rows.forEach(function (r) { var v = r[mig.column]; if (v != null) { if (seen[v]) dup = true; seen[v] = true; } });
        if (dup) return err('Sloupec "' + mig.column + '" má duplicity — UNIQUE neprojde.');
        cc.unique = true;
        return done(state, mig);
      }
      case 'dropColumn': {
        if (!col(state, mig.column)) return err('Sloupec "' + mig.column + '" neexistuje.');
        state.columns = state.columns.filter(function (c) { return c.name !== mig.column; });
        state.rows.forEach(function (r) { delete r[mig.column]; });
        return done(state, mig);
      }
      default: return err('Neznámá operace: ' + mig.op);
    }
  }

  function done(state, mig) { state.applied.push(mig.name); return { ok: true }; }
  function err(message) { return { ok: false, error: message }; }

  function freshState() {
    return {
      columns: [
        { name: 'id', notNull: true, unique: true },
        { name: 'email', notNull: true, unique: true }
      ],
      rows: [
        { id: 1, email: 'ada@example.cz' },
        { id: 2, email: 'bob@example.cz' },
        { id: 3, email: 'cyril@example.cz' }
      ],
      applied: ['0001_create_users']
    };
  }

  var CORE = { applyMigration: applyMigration, freshState: freshState };
  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  // ---------- DOM widget ----------
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function build(root) {
    var state = freshState();

    var out = el('div', 'mr-out');
    var schemaView = el('div', 'mr-schema');
    var dataView = el('div', 'mr-data');
    var appliedView = el('div', 'mr-applied');

    var MIGS = [
      { label: 'ADD phone text  (nullable)', mig: { name: '0002_add_phone', op: 'addColumn', column: 'phone' } },
      { label: '💥 ADD phone text NOT NULL  (naivně)', mig: { name: '0002_add_phone_nn', op: 'addColumnNotNull', column: 'phone' }, danger: true },
      { label: "BACKFILL phone = '—'", mig: { name: '0003_backfill_phone', op: 'backfill', column: 'phone', value: '—' } },
      { label: 'SET phone NOT NULL', mig: { name: '0004_phone_notnull', op: 'setNotNull', column: 'phone' } }
    ];

    var btns = el('div', 'mr-btns');
    MIGS.forEach(function (m) {
      var b = el('button', 'mr-btn' + (m.danger ? ' mr-danger' : ''), esc(m.label)); b.type = 'button';
      b.addEventListener('click', function () { runMig(m.mig); });
      btns.appendChild(b);
    });
    var reset = el('button', 'mr-btn mr-reset', '↺ Reset'); reset.type = 'button';
    reset.addEventListener('click', function () { state = freshState(); render(); out.innerHTML = ''; });
    btns.appendChild(reset);

    root.appendChild(el('div', 'mr-h', 'Migrace (klikej v pořadí — a zkus tu naivní ①→💥)'));
    root.appendChild(btns);
    root.appendChild(out);
    root.appendChild(el('div', 'mr-h', 'Schéma teď'));
    root.appendChild(schemaView);
    root.appendChild(el('div', 'mr-h', 'Data'));
    root.appendChild(dataView);
    root.appendChild(el('div', 'mr-h', 'Applied (verzovaná historie)'));
    root.appendChild(appliedView);

    function runMig(mig) {
      var res = applyMigration(state, mig);
      out.className = 'mr-out ' + (res.ok ? 'ok' : 'reject');
      out.innerHTML = res.ok
        ? '✅ <code>' + esc(mig.name) + '</code> proběhla.'
        : '⛔ <code>' + esc(mig.name) + '</code> selhala — ' + esc(res.error);
      render();
    }

    function render() {
      // schéma
      schemaView.innerHTML = '';
      state.columns.forEach(function (c) {
        var badges = '';
        if (c.notNull) badges += '<span class="mr-badge">NOT NULL</span>';
        if (c.unique) badges += '<span class="mr-badge">UNIQUE</span>';
        schemaView.appendChild(el('div', 'mr-colrow', '<code>' + esc(c.name) + '</code> ' + badges));
      });
      // data
      dataView.innerHTML = '';
      var cols = state.columns.map(function (c) { return c.name; });
      var head = el('div', 'mr-tr mr-thead');
      cols.forEach(function (c) { head.appendChild(el('span', 'mr-td', esc(c))); });
      dataView.appendChild(head);
      state.rows.forEach(function (r) {
        var tr = el('div', 'mr-tr');
        cols.forEach(function (c) { tr.appendChild(el('span', 'mr-td', r[c] == null ? '<em>NULL</em>' : esc(r[c]))); });
        dataView.appendChild(tr);
      });
      // applied
      appliedView.innerHTML = state.applied.map(function (a) { return '<div class="mr-applied-row">✓ ' + esc(a) + '</div>'; }).join('');
    }

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.migration-runner'), build);
  });
})();
