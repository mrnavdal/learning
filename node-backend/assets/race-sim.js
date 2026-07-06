/* race-sim.js — simulátor souběhu dvou transakcí (komponent pro lekce).
 *
 * Dva požadavky odečtou z účtu naráz. Ukazuje, jak naivní read-modify-write
 * ztratí jeden odečet (lost update), a jak to spraví atomický UPDATE, zámek
 * (SELECT FOR UPDATE) nebo — myšlenkově — optimistic verzování.
 *
 * Použití v lekci:
 *   <div class="race-sim"></div>
 *   <script src="../assets/race-sim.js"></script>
 *
 * Jádro simulate() je čistá funkce → testovatelné v Node
 * (viz tools/test-race-sim.js).
 */
(function () {
  'use strict';

  // Čisté jádro: vrať {steps, final, expected, correct, strategy}
  //   strategy: 'naive' | 'atomic' | 'lock'
  function simulate(strategy, initial, amount) {
    var steps = [], final, expected = initial - 2 * amount;

    if (strategy === 'naive') {
      steps.push(s('T1', 'READ', initial, initial, 'přečte zůstatek = ' + initial));
      steps.push(s('T2', 'READ', initial, initial, 'přečte zůstatek = ' + initial + ' (taky ' + initial + '!)'));
      steps.push(s('T1', 'WRITE', initial - amount, null, 'zapíše ' + initial + ' − ' + amount + ' = ' + (initial - amount)));
      steps.push(s('T2', 'WRITE', initial - amount, null, 'zapíše ' + initial + ' − ' + amount + ' = ' + (initial - amount) + ' — přepíše T1!'));
      final = initial - amount;
    } else if (strategy === 'atomic') {
      steps.push(s('T1', 'UPDATE', initial - amount, null, 'UPDATE … SET balance = balance − ' + amount + ' (atomicky) → ' + (initial - amount)));
      steps.push(s('T2', 'UPDATE', initial - 2 * amount, null, 'UPDATE … SET balance = balance − ' + amount + ' (atomicky) → ' + (initial - 2 * amount)));
      final = initial - 2 * amount;
    } else if (strategy === 'lock') {
      steps.push(s('T1', 'SELECT … FOR UPDATE', initial, initial, 'zamkne řádek, přečte ' + initial));
      steps.push(s('T2', 'SELECT … FOR UPDATE', initial, null, 'čeká — řádek zamčen T1', true));
      steps.push(s('T1', 'WRITE + COMMIT', initial - amount, null, 'zapíše ' + (initial - amount) + ', commit → odemkne'));
      steps.push(s('T2', 'SELECT vrací', initial - amount, initial - amount, 'odblokováno, přečte aktuálních ' + (initial - amount)));
      steps.push(s('T2', 'WRITE + COMMIT', initial - 2 * amount, null, 'zapíše ' + (initial - amount) + ' − ' + amount + ' = ' + (initial - 2 * amount)));
      final = initial - 2 * amount;
    }

    return { steps: steps, final: final, expected: expected, correct: final === expected, strategy: strategy };
  }

  function s(tx, action, db, read, note, blocked) {
    return { tx: tx, action: action, db: db, read: read, note: note, blocked: !!blocked };
  }

  var CORE = { simulate: simulate };
  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  // ---------- DOM widget ----------
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var STRATS = [
    { k: 'naive', label: 'Naivně (read-modify-write)' },
    { k: 'atomic', label: 'Atomický UPDATE' },
    { k: 'lock', label: 'SELECT … FOR UPDATE' }
  ];

  function build(root) {
    var strategy = 'naive';
    var INIT = 100, AMOUNT = 30;

    var stratRow = el('div', 'rs-strats');
    var btns = {};
    STRATS.forEach(function (st) {
      var b = el('button', 'rs-strat' + (st.k === strategy ? ' is-on' : ''), st.label); b.type = 'button';
      b.addEventListener('click', function () { strategy = st.k; render(); });
      btns[st.k] = b; stratRow.appendChild(b);
    });

    var scenario = el('div', 'rs-scenario', 'Účet má <strong>' + INIT + '</strong>. Dva požadavky (T1, T2) naráz odečtou po <strong>' + AMOUNT + '</strong>. Správný zůstatek: <strong>' + (INIT - 2 * AMOUNT) + '</strong>.');
    var timeline = el('div', 'rs-timeline');
    var verdict = el('div', 'rs-verdict');

    root.appendChild(el('div', 'rs-h', 'Strategie zápisu'));
    root.appendChild(stratRow);
    root.appendChild(scenario);
    root.appendChild(el('div', 'rs-h', 'Průběh v čase (shora dolů)'));
    root.appendChild(timeline);
    root.appendChild(verdict);

    function render() {
      Object.keys(btns).forEach(function (k) { btns[k].classList.toggle('is-on', k === strategy); });
      var res = simulate(strategy, INIT, AMOUNT);

      timeline.innerHTML = '';
      res.steps.forEach(function (st) {
        var row = el('div', 'rs-step ' + (st.tx === 'T1' ? 'rs-left' : 'rs-right'));
        var card = el('div', 'rs-card' + (st.blocked ? ' rs-blocked' : ''));
        card.appendChild(el('div', 'rs-tx', st.tx + ' · ' + st.action));
        card.appendChild(el('div', 'rs-note', st.note));
        row.appendChild(card);
        var dbTag = el('div', 'rs-db', st.blocked ? '🔒' : 'DB=' + st.db);
        row.appendChild(dbTag);
        timeline.appendChild(row);
      });

      verdict.className = 'rs-verdict ' + (res.correct ? 'good' : 'bad');
      verdict.innerHTML = res.correct
        ? '✅ Konečný zůstatek <strong>' + res.final + '</strong> = správně (' + res.expected + '). Oba odečty se započítaly.'
        : '💥 Konečný zůstatek <strong>' + res.final + '</strong>, ale mělo být <strong>' + res.expected + '</strong>. <strong>Lost update</strong> — jeden odečet zmizel, protože T2 přepsal, co T1 nevěděl že změnil.';
    }

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.race-sim'), build);
  });
})();
