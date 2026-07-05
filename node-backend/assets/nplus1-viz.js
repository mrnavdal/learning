/* nplus1-viz.js — vizualizér N+1 problému (komponent pro lekce).
 *
 * Stejná data (posty + jejich autoři) načtená třemi strategiemi, a živě spočítá,
 * KOLIK dotazů to poslalo do DB:
 *   - nplus1: 1 dotaz na posty + N dotazů na autory → 1+N  (tichý zabiják)
 *   - join:   1 JOIN dotaz                          → 1
 *   - batch:  1 na posty + 1 IN(...) na autory      → 2
 * Posuvník mění počet postů → uvidíš, jak N+1 roste, zatímco JOIN zůstává 1.
 *
 * Jádro runStrategy() je čistá funkce → testovatelné v Node
 * (viz tools/test-nplus1-viz.js).
 */
(function () {
  'use strict';

  var AUTHORS = [
    { id: 1, name: 'Ada' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Cyril' }
  ];

  function makePosts(n) {
    var out = [];
    for (var i = 1; i <= n; i++) out.push({ id: i, title: 'Post ' + i, author_id: AUTHORS[(i - 1) % AUTHORS.length].id });
    return out;
  }

  function uniq(arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); }

  // Čisté jádro: vrať {queries:[SQL...], rows:[{title, author}]}
  function runStrategy(strategy, posts, authors) {
    var byId = {}; authors.forEach(function (a) { byId[a.id] = a; });
    var queries = [], rows = [];

    if (strategy === 'nplus1') {
      queries.push('SELECT * FROM posts');                              // 1
      posts.forEach(function (p) {
        queries.push('SELECT * FROM authors WHERE id = ' + p.author_id); // +N
        rows.push({ title: p.title, author: byId[p.author_id].name });
      });
    } else if (strategy === 'join') {
      queries.push('SELECT p.title, a.name\nFROM posts p JOIN authors a ON a.id = p.author_id'); // 1
      posts.forEach(function (p) { rows.push({ title: p.title, author: byId[p.author_id].name }); });
    } else if (strategy === 'batch') {
      queries.push('SELECT * FROM posts');                              // 1
      var ids = uniq(posts.map(function (p) { return p.author_id; }));
      queries.push('SELECT * FROM authors WHERE id IN (' + ids.join(', ') + ')'); // +1
      posts.forEach(function (p) { rows.push({ title: p.title, author: byId[p.author_id].name }); });
    }
    return { queries: queries, rows: rows };
  }

  var CORE = { runStrategy: runStrategy, makePosts: makePosts, AUTHORS: AUTHORS };
  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  // ---------- DOM widget ----------
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function build(root) {
    var strategy = 'nplus1';
    var n = 5;

    var stratRow = el('div', 'nq-strats');
    var defs = [
      { k: 'nplus1', label: 'N+1 (naivně)' },
      { k: 'join', label: 'JOIN' },
      { k: 'batch', label: 'Batch IN(…)' }
    ];
    var stratBtns = {};
    defs.forEach(function (d) {
      var b = el('button', 'nq-strat' + (d.k === strategy ? ' is-on' : ''), d.label); b.type = 'button';
      b.addEventListener('click', function () { strategy = d.k; sync(); render(); });
      stratBtns[d.k] = b; stratRow.appendChild(b);
    });

    var slider = el('input', 'nq-slider'); slider.type = 'range'; slider.min = '1'; slider.max = '20'; slider.value = String(n);
    var sliderLabel = el('span', 'nq-slabel');
    var sliderWrap = el('label', 'nq-sliderwrap');
    sliderWrap.appendChild(el('span', 'nq-lbl', 'počet postů')); sliderWrap.appendChild(slider); sliderWrap.appendChild(sliderLabel);
    slider.addEventListener('input', function () { n = parseInt(slider.value, 10); render(); });

    var counter = el('div', 'nq-counter');
    var log = el('div', 'nq-log');
    var result = el('div', 'nq-result');

    root.appendChild(el('div', 'nq-h', 'Strategie načtení postů + jejich autorů'));
    root.appendChild(stratRow);
    root.appendChild(sliderWrap);
    root.appendChild(counter);
    root.appendChild(el('div', 'nq-h', 'Dotazy poslané do DB'));
    root.appendChild(log);
    root.appendChild(el('div', 'nq-h', 'Výsledek (u všech strategií stejný)'));
    root.appendChild(result);

    function sync() { defs.forEach(function (d) { stratBtns[d.k].classList.toggle('is-on', d.k === strategy); }); }

    function render() {
      sliderLabel.textContent = n;
      var posts = makePosts(n);
      var res = runStrategy(strategy, posts, AUTHORS);
      var c = res.queries.length;

      counter.className = 'nq-counter ' + (c === 1 ? 'good' : (strategy === 'nplus1' ? 'bad' : 'ok'));
      counter.innerHTML = 'Dotazů do DB: <strong>' + c + '</strong>' +
        (strategy === 'nplus1' ? ' &nbsp;<span class="nq-formula">= 1 + ' + n + ' (1+N)</span>' :
         strategy === 'batch' ? ' &nbsp;<span class="nq-formula">= konstantní 2, ať je postů kolik chce</span>' :
                                ' &nbsp;<span class="nq-formula">= konstantní 1, ať je postů kolik chce</span>');

      log.innerHTML = '';
      res.queries.forEach(function (q, i) {
        var line = el('div', 'nq-qline');
        line.appendChild(el('span', 'nq-qnum', '#' + (i + 1)));
        line.appendChild(el('pre', 'nq-sql', esc(q)));
        log.appendChild(line);
      });
      if (res.queries.length > 8) {
        log.appendChild(el('div', 'nq-more', '… a takhle to roste s každým dalším postem.'));
      }

      result.innerHTML = '';
      res.rows.slice(0, 6).forEach(function (r) {
        result.appendChild(el('div', 'nq-row', '<strong>' + esc(r.title) + '</strong> — ' + esc(r.author)));
      });
      if (res.rows.length > 6) result.appendChild(el('div', 'nq-more', '… (' + res.rows.length + ' celkem)'));
    }

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.nplus1-viz'), build);
  });
})();
