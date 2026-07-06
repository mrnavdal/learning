/* scan-viz.js — vizualizér seq scan vs index scan (komponent pro lekce).
 *
 * Ukazuje, kolik řádků musí DB "osahat", aby našla řádek podle podmínky:
 *   - bez indexu → sekvenční scan, projde VŠECH N řádků (lineární).
 *   - s B-tree indexem → ~log2(N) kroků (logaritmické) … pokud podmínka indexu sedne.
 * Posuvník mění velikost tabulky (10 … 1 000 000) → uvidíš, jak propast roste.
 * Tři typy dotazů ukážou, kdy index NEPOMŮŽE (leading wildcard LIKE '%x').
 *
 * Jádro rowsTouched() je čistá funkce → testovatelné v Node
 * (viz tools/test-scan-viz.js).
 */
(function () {
  'use strict';

  // kolik kroků udělá B-tree lookup pro N řádků (výška stromu ~ log)
  function indexCost(n) { return Math.max(1, Math.ceil(Math.log2(Math.max(2, n)))); }

  // Čisté jádro: kolik řádků DB "osahá"
  //   queryType: 'eq' (= 'x'), 'prefix' (LIKE 'x%'), 'suffix' (LIKE '%x')
  //   hasIndex:  je na sloupci B-tree index?
  function rowsTouched(queryType, hasIndex, n) {
    if (!hasIndex) return n;                 // bez indexu vždy seq scan
    if (queryType === 'suffix') return n;    // leading wildcard → index nepoužitelný, seq scan
    return indexCost(n);                     // 'eq' i 'prefix' umí B-tree (rovnost + rozsah)
  }

  // pomáhá index u tohohle dotazu vůbec?
  function indexUsable(queryType) { return queryType !== 'suffix'; }

  var CORE = { rowsTouched: rowsTouched, indexCost: indexCost, indexUsable: indexUsable };
  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  // ---------- DOM widget ----------
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function fmt(n) { return n.toLocaleString('cs-CZ'); }

  var SIZES = [10, 100, 1000, 10000, 100000, 1000000];
  var QUERIES = [
    { k: 'eq', label: "= 'ada@x.cz'", note: 'Rovnost — B-tree ji najde přímo (log kroků).' },
    { k: 'prefix', label: "LIKE 'ada%'", note: 'Prefix — B-tree je seřazený, umí i rozsah zleva.' },
    { k: 'suffix', label: "LIKE '%x.cz'", note: '⚠ Leading wildcard — index NEPOMŮŽE, nutný seq scan.' }
  ];

  function build(root) {
    var sizeIdx = 3;      // 10 000
    var queryType = 'eq';

    var slider = el('input', 'sv-slider'); slider.type = 'range'; slider.min = '0'; slider.max = String(SIZES.length - 1); slider.value = String(sizeIdx);
    var sizeLabel = el('span', 'sv-slabel');
    var sliderWrap = el('label', 'sv-sliderwrap');
    sliderWrap.appendChild(el('span', 'sv-lbl', 'řádků v tabulce')); sliderWrap.appendChild(slider); sliderWrap.appendChild(sizeLabel);
    slider.addEventListener('input', function () { sizeIdx = parseInt(slider.value, 10); render(); });

    var qRow = el('div', 'sv-queries');
    var qBtns = {};
    QUERIES.forEach(function (q) {
      var b = el('button', 'sv-query' + (q.k === queryType ? ' is-on' : ''), q.label); b.type = 'button';
      b.addEventListener('click', function () { queryType = q.k; render(); });
      qBtns[q.k] = b; qRow.appendChild(b);
    });

    var qNote = el('div', 'sv-qnote');
    var bars = el('div', 'sv-bars');
    var verdict = el('div', 'sv-verdict');

    root.appendChild(el('div', 'sv-h', 'Dotaz'));
    root.appendChild(el('pre', 'sv-sql', "SELECT * FROM users WHERE email <TYP>;"));
    var sqlPre = root.lastChild;
    root.appendChild(qRow);
    root.appendChild(qNote);
    root.appendChild(sliderWrap);
    root.appendChild(el('div', 'sv-h', 'Kolik řádků musí DB osahat'));
    root.appendChild(bars);
    root.appendChild(verdict);

    function bar(label, touched, n, kind) {
      var pct = Math.max(0.4, (touched / n) * 100);
      var wrap = el('div', 'sv-bar');
      wrap.appendChild(el('div', 'sv-bar-label', label));
      var track = el('div', 'sv-track');
      var fill = el('div', 'sv-fill sv-' + kind); fill.style.width = Math.min(100, pct) + '%';
      track.appendChild(fill);
      wrap.appendChild(track);
      wrap.appendChild(el('div', 'sv-bar-val', fmt(touched) + ' řádků'));
      return wrap;
    }

    function render() {
      var n = SIZES[sizeIdx];
      sizeLabel.textContent = fmt(n);
      var q = QUERIES.find(function (x) { return x.k === queryType; });
      qBtns && Object.keys(qBtns).forEach(function (k) { qBtns[k].classList.toggle('is-on', k === queryType); });
      qNote.textContent = q.note;
      sqlPre.textContent = 'SELECT * FROM users WHERE email ' +
        (queryType === 'eq' ? "= 'ada@x.cz'" : queryType === 'prefix' ? "LIKE 'ada%'" : "LIKE '%x.cz'") + ';';

      var seq = rowsTouched(queryType, false, n);
      var idx = rowsTouched(queryType, true, n);

      bars.innerHTML = '';
      bars.appendChild(bar('🐌 bez indexu (seq scan)', seq, n, 'seq'));
      bars.appendChild(bar('⚡ s indexem na email', idx, n, idx === n ? 'seq' : 'idx'));

      if (!indexUsable(queryType)) {
        verdict.className = 'sv-verdict warn';
        verdict.innerHTML = 'Index tu <strong>nepomůže</strong> — <code>LIKE \'%x\'</code> nemá pevný začátek, takže B-tree nemá kde začít. Oba případy = seq scan přes ' + fmt(n) + ' řádků.';
      } else {
        var speed = Math.round(seq / idx);
        verdict.className = 'sv-verdict good';
        verdict.innerHTML = 'S indexem <strong>~' + fmt(idx) + '</strong> kroků místo <strong>' + fmt(seq) + '</strong> → zhruba <strong>' + fmt(speed) + '×</strong> méně práce. A čím větší tabulka, tím větší propast (lineární vs logaritmické).';
      }
    }

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.scan-viz'), build);
  });
})();
