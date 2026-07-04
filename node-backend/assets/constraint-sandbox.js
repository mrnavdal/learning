/* constraint-sandbox.js — interaktivní demo databázových constraints (komponent).
 *
 * Uživatel zkouší INSERT do tabulky `users` a vidí, které řádky DB PŘIJME a které
 * ODMÍTNE — s konkrétním porušeným constraintem, Postgres error kódem a rozumným
 * mapováním na HTTP status. Cíl: pochopit schéma jako VYNUCENÝ kontrakt.
 *
 * Použití v lekci:
 *   <div class="constraint-sandbox"></div>
 *   <script src="../assets/constraint-sandbox.js"></script>
 *
 * Jádro validateInsert() je čistá funkce → testovatelné v Node
 * (viz tools/test-constraint-sandbox.js).
 */
(function () {
  'use strict';

  // Postgres error kódy → jak je typicky mapovat na HTTP (mapování je designové rozhodnutí)
  var PG = {
    not_null:   { code: '23502', name: 'not_null_violation',    http: 400 },
    type:       { code: '22P02', name: 'invalid_text_representation', http: 400 },
    check:      { code: '23514', name: 'check_violation',       http: 422 },
    unique:     { code: '23505', name: 'unique_violation',      http: 409 },
    fk:         { code: '23503', name: 'foreign_key_violation', http: 409 }
  };

  // „Cizí" tabulka pro FK: existující země
  var COUNTRIES = [
    { id: 1, name: 'Česko' }, { id: 2, name: 'Slovensko' }, { id: 3, name: 'Polsko' }
  ];

  // Čisté jádro: zkus vložit řádek, vrať {ok:true, row} nebo {ok:false, violation}
  function validateInsert(existingRows, input) {
    // input: { email, age, country_id }  (id je serial → doplní DB)

    // 1) NOT NULL — email musí existovat
    if (input.email == null || String(input.email).trim() === '') {
      return fail('not_null', 'email', 'Sloupec "email" je NOT NULL, ale chybí hodnota.');
    }
    // 2) TYPE — age i country_id musí být celé číslo (nebo prázdné, pokud nullable)
    if (input.age !== '' && input.age != null && !isInt(input.age)) {
      return fail('type', 'age', '"' + input.age + '" není platný integer pro sloupec "age".');
    }
    if (input.country_id !== '' && input.country_id != null && !isInt(input.country_id)) {
      return fail('type', 'country_id', '"' + input.country_id + '" není platný integer pro "country_id".');
    }
    // 3) CHECK — age >= 0
    if (input.age !== '' && input.age != null && parseInt(input.age, 10) < 0) {
      return fail('check', 'users_age_check', 'CHECK (age >= 0) porušen: age = ' + input.age + '.');
    }
    // 4) UNIQUE — email nesmí už existovat
    if (existingRows.some(function (r) { return r.email === input.email; })) {
      return fail('unique', 'users_email_key', 'UNIQUE(email) porušen: "' + input.email + '" už v tabulce je.');
    }
    // 5) FOREIGN KEY — country_id musí ukazovat na existující zemi (nebo být NULL)
    if (input.country_id !== '' && input.country_id != null) {
      var cid = parseInt(input.country_id, 10);
      if (!COUNTRIES.some(function (c) { return c.id === cid; })) {
        return fail('fk', 'users_country_id_fkey', 'FOREIGN KEY: země s id=' + cid + ' neexistuje.');
      }
    }
    return { ok: true };
  }

  function fail(kind, constraint, message) {
    var meta = PG[kind];
    return { ok: false, violation: { kind: kind, constraint: constraint, message: message, code: meta.code, name: meta.name, http: meta.http } };
  }
  function isInt(v) { return /^-?\d+$/.test(String(v).trim()); }

  var CORE = { validateInsert: validateInsert, COUNTRIES: COUNTRIES, PG: PG };
  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  // ---------- DOM widget ----------
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function build(root) {
    var rows = [{ id: 1, email: 'ada@example.cz', age: 36, country_id: 1 }];
    var nextId = 2;

    // schéma (jen na ukázku)
    var schema = el('pre', 'cs-schema',
      'CREATE TABLE users (\n' +
      '  id          serial PRIMARY KEY,\n' +
      '  email       text   NOT NULL UNIQUE,\n' +
      '  age         int    CHECK (age >= 0),\n' +
      '  country_id  int    REFERENCES countries(id)\n' +
      ');');

    var email = mkInput('email', 'grace@example.cz');
    var age = mkInput('age', '29');
    var country = mkInput('country_id', '2');

    var form = el('div', 'cs-form');
    form.appendChild(field('email', email));
    form.appendChild(field('age', age));
    form.appendChild(field('country_id', country));

    var presets = el('div', 'cs-presets');
    presets.appendChild(el('span', 'cs-presets-label', 'Zkus porušit:'));
    [
      { t: 'prázdný email', f: function () { email.value = ''; age.value = '29'; country.value = '1'; } },
      { t: 'duplicitní email', f: function () { email.value = 'ada@example.cz'; age.value = '20'; country.value = '1'; } },
      { t: 'záporný věk', f: function () { email.value = 'x@y.cz'; age.value = '-5'; country.value = '1'; } },
      { t: 'neexistující země', f: function () { email.value = 'x@y.cz'; age.value = '20'; country.value = '99'; } }
    ].forEach(function (p) {
      var b = el('button', 'cs-chip', p.t); b.type = 'button';
      b.addEventListener('click', function () { p.f(); insert(); });
      presets.appendChild(b);
    });

    var insertBtn = el('button', 'cs-btn', 'INSERT →'); insertBtn.type = 'button';
    var result = el('div', 'cs-result');
    var tableView = el('div', 'cs-table');

    root.appendChild(el('div', 'cs-h', 'Schéma tabulky (kontrakt)'));
    root.appendChild(schema);
    root.appendChild(el('div', 'cs-h', 'Vlož řádek'));
    root.appendChild(form);
    root.appendChild(presets);
    root.appendChild(insertBtn);
    root.appendChild(result);
    root.appendChild(el('div', 'cs-h', 'Tabulka users'));
    root.appendChild(tableView);

    insertBtn.addEventListener('click', insert);

    function insert() {
      var input = { email: email.value, age: age.value, country_id: country.value };
      var res = validateInsert(rows, input);
      result.className = 'cs-result';
      if (res.ok) {
        rows.push({ id: nextId++, email: input.email, age: input.age === '' ? null : parseInt(input.age, 10), country_id: input.country_id === '' ? null : parseInt(input.country_id, 10) });
        result.classList.add('ok');
        result.innerHTML = '✅ <strong>INSERT ok</strong> → řádek přidán. V API bys vrátil <code>201 Created</code>.';
      } else {
        var v = res.violation;
        result.classList.add('reject');
        result.innerHTML =
          '⛔ <strong>DB odmítla</strong> — ' + esc(v.message) +
          '<div class="cs-map"><span class="cs-code">' + v.code + ' ' + v.name + '</span>' +
          ' → rozumný HTTP status <span class="cs-http">' + v.http + '</span></div>';
      }
      renderTable();
    }

    function renderTable() {
      tableView.innerHTML = '';
      var head = el('div', 'cs-tr cs-thead');
      ['id', 'email', 'age', 'country_id'].forEach(function (c) { head.appendChild(el('span', 'cs-td', c)); });
      tableView.appendChild(head);
      rows.forEach(function (r) {
        var tr = el('div', 'cs-tr');
        [r.id, r.email, r.age == null ? 'NULL' : r.age, r.country_id == null ? 'NULL' : r.country_id].forEach(function (c) {
          tr.appendChild(el('span', 'cs-td', esc(c)));
        });
        tableView.appendChild(tr);
      });
    }

    function mkInput(name, ph) { var i = el('input', 'cs-input'); i.type = 'text'; i.placeholder = ph; i.value = ph; i.setAttribute('aria-label', name); return i; }
    function field(label, input) { var f = el('label', 'cs-field'); f.appendChild(el('span', 'cs-lbl', label)); f.appendChild(input); return f; }

    renderTable();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.constraint-sandbox'), build);
  });
})();
