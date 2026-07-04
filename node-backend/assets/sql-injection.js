/* sql-injection.js — interaktivní demo SQL injection (komponent pro lekce).
 *
 * Ukazuje TÝŽ vstup ve dvou režimech přihlášení:
 *   - "concat": SQL se skládá stringem → klasický `' OR '1'='1' --` prolomí login.
 *   - "param":  parametrizovaný dotaz ($1,$2) → vstup je bezpečně brán jako hodnota.
 *
 * Jádro NENÍ fake: WHERE klauzule concat režimu se vyhodnocuje malým, ale
 * skutečným SQL-WHERE evaluátorem (literály, sloupce, =, AND, OR, závorky, -- komentář).
 *
 * Použití v lekci:
 *   <div class="sql-injection"></div>
 *   <script src="../assets/sql-injection.js"></script>
 */
(function () {
  'use strict';

  // ---------- Mini SQL-WHERE evaluátor (čisté funkce) ----------
  function stripComment(s) {
    var i = s.indexOf('--');
    return i === -1 ? s : s.slice(0, i);
  }

  function tokenize(s) {
    var t = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c === ' ' || c === '\t' || c === '\n') { i++; continue; }
      if (c === "'") {                       // string literál
        var j = i + 1, buf = '';
        while (j < s.length && s[j] !== "'") { buf += s[j]; j++; }
        t.push({ k: 'str', v: buf }); i = j + 1; continue;
      }
      if (c === '=' ) { t.push({ k: '=' }); i++; continue; }
      if (c === '(') { t.push({ k: '(' }); i++; continue; }
      if (c === ')') { t.push({ k: ')' }); i++; continue; }
      if (/[A-Za-z0-9_]/.test(c)) {          // identifikátor / klíčové slovo
        var w = '';
        while (i < s.length && /[A-Za-z0-9_]/.test(s[i])) { w += s[i]; i++; }
        var up = w.toUpperCase();
        if (up === 'AND' || up === 'OR') t.push({ k: up });
        else t.push({ k: 'id', v: w });
        continue;
      }
      i++; // neznámý znak přeskoč
    }
    return t;
  }

  // rekurzivní sestup: OR má nejnižší prioritu, pak AND, pak porovnání
  function evalWhere(where, row) {
    var t = tokenize(stripComment(where)), p = 0;
    function peek() { return t[p]; }
    function val() {
      var tok = t[p++];
      if (!tok) return '';
      if (tok.k === 'str') return tok.v;
      if (tok.k === 'id') return row[tok.v] != null ? String(row[tok.v]) : '';
      return '';
    }
    function cmp() {
      if (peek() && peek().k === '(') { p++; var v = orExpr(); if (peek() && peek().k === ')') p++; return v; }
      var a = val();
      if (peek() && peek().k === '=') { p++; var b = val(); return a === b; }
      return !!a; // holá hodnota jako pravdivost (nepoužito v našich případech)
    }
    function andExpr() { var v = cmp(); while (peek() && peek().k === 'AND') { p++; var r = cmp(); v = v && r; } return v; }
    function orExpr() { var v = andExpr(); while (peek() && peek().k === 'OR') { p++; var r = andExpr(); v = v || r; } return v; }
    return orExpr();
  }

  // ---------- „Databáze" a přihlášení ----------
  function demoTable() {
    return [
      { id: 1, username: 'admin', password: 's3cret' },
      { id: 2, username: 'alice', password: 'hunter2' }
    ];
  }

  function buildSql(mode, username, password) {
    if (mode === 'concat') {
      return "SELECT * FROM users\nWHERE username = '" + username + "' AND password = '" + password + "'";
    }
    return "SELECT * FROM users\nWHERE username = $1 AND password = $2";
  }

  // vrať řádky, které dotaz „vrátí"
  function runLogin(mode, username, password, table) {
    table = table || demoTable();
    if (mode === 'param') {
      // parametr = hodnota, NIKDY se nemíchá do SQL textu → injection je jen literál
      return table.filter(function (r) { return r.username === username && r.password === password; });
    }
    // concat: postav WHERE ze stringu a vyhodnoť ho (přesně jak by to udělala DB)
    var where = "username = '" + username + "' AND password = '" + password + "'";
    return table.filter(function (r) { return evalWhere(where, r); });
  }

  var CORE = { evalWhere: evalWhere, buildSql: buildSql, runLogin: runLogin, demoTable: demoTable };
  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  // ---------- DOM widget ----------
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function build(root) {
    var mode = 'concat';

    var user = el('input', 'sqli-input'); user.type = 'text'; user.value = 'admin'; user.setAttribute('aria-label', 'username');
    var pass = el('input', 'sqli-input'); pass.type = 'text'; pass.value = 's3cret'; pass.setAttribute('aria-label', 'password');

    var uRow = el('label', 'sqli-field'); uRow.appendChild(el('span', 'sqli-lbl', 'username')); uRow.appendChild(user);
    var pRow = el('label', 'sqli-field'); pRow.appendChild(el('span', 'sqli-lbl', 'password')); pRow.appendChild(pass);

    var mConcat = el('button', 'sqli-mode is-on', '❌ String concat'); mConcat.type = 'button';
    var mParam = el('button', 'sqli-mode', '✅ Parametrizováno'); mParam.type = 'button';
    var modes = el('div', 'sqli-modes'); modes.appendChild(mConcat); modes.appendChild(mParam);

    var inject = el('button', 'sqli-chip', "💉 Zkus injection"); inject.type = 'button';
    var login = el('button', 'sqli-btn', 'Přihlásit'); login.type = 'button';
    var actions = el('div', 'sqli-actions'); actions.appendChild(inject); actions.appendChild(login);

    var sqlOut = el('pre', 'sqli-sql');
    var result = el('div', 'sqli-result');

    root.appendChild(el('div', 'sqli-h', 'Přihlašovací formulář'));
    var form = el('div', 'sqli-form'); form.appendChild(uRow); form.appendChild(pRow);
    root.appendChild(form);
    root.appendChild(modes);
    root.appendChild(actions);
    root.appendChild(el('div', 'sqli-h', 'Dotaz odeslaný do Postgresu'));
    root.appendChild(sqlOut);
    root.appendChild(result);

    function setMode(m) {
      mode = m;
      mConcat.classList.toggle('is-on', m === 'concat');
      mParam.classList.toggle('is-on', m === 'param');
      run();
    }
    mConcat.addEventListener('click', function () { setMode('concat'); });
    mParam.addEventListener('click', function () { setMode('param'); });
    inject.addEventListener('click', function () { user.value = "' OR '1'='1' --"; pass.value = ''; run(); });
    login.addEventListener('click', run);
    user.addEventListener('input', run);
    pass.addEventListener('input', run);

    function run() {
      var u = user.value, p = pass.value;
      var sql = buildSql(mode, u, p);
      if (mode === 'param') sql += "\n-- values: ['" + esc(u) + "', '" + esc(p) + "']";
      sqlOut.textContent = sql;

      var rows = runLogin(mode, u, p, demoTable());
      result.className = 'sqli-result';
      if (rows.length) {
        var breach = (u !== 'admin' && rows.some(function (r) { return r.username === 'admin'; }));
        result.classList.add(breach ? 'breach' : 'ok');
        result.innerHTML = breach
          ? '💥 <strong>Průnik!</strong> Přihlášen jako <code>' + esc(rows[0].username) + '</code> bez správného hesla. Injection prošla.'
          : '✅ Přihlášen jako <code>' + esc(rows[0].username) + '</code>. (' + rows.length + ' řádek)';
      } else {
        result.classList.add('deny');
        result.innerHTML = '🔒 Nikdo. Dotaz nevrátil žádný řádek — přihlášení zamítnuto.';
      }
    }

    run();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.sql-injection'), build);
  });
})();
