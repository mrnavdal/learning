/* session-runner.js — běhoun tréninkové jednotky (komponent pro sessions).
 *
 * Přehraje libovolnou praxi krok po kroku: ukáže aktuální pozici, cue, odpočet,
 * co přijde dál, a jede dál sám. Cvičíš doma sám s telefonem u podložky —
 * tohle je náhrada za hlas lektora, který říká "ještě tři dechy".
 *
 * Použití v session:
 *   <div class="session-runner" data-session='{"secPerBreath":8,"steps":[…]}'></div>
 *   <script src="../assets/session-runner.js"></script>
 *
 * Krok:
 *   { "name": "Cat-Cow", "sanskrit": "Marjaryasana", "breaths": 8, "cue": "…", "block": "Rozehřátí" }
 *   Délka se zadá BUĎ `breaths` (přepočte se přes secPerBreath), NEBO `sec` napevno.
 *
 * Varianty délky praxe:
 *   Krok bez `tier` je jádro praxe a je v každé variantě. Krok s `tier: 75` se objeví
 *   ve variantě 75 min a delší, `tier: 90` jen v devadesátiminutové. Nabídku variant
 *   určí `lengths: [60, 75, 90]`, výchozí je `defaultLength`.
 *   Uživatel si tak podle dne vybere kratší nebo delší verzi TÉŽE praxe — oblouk
 *   zůstane celý, jen se ubere z prostředka.
 *
 * Jádro (buildTimeline / stepAt / formatClock) jsou čisté funkce → testovatelné v Node
 * (viz tools/test-session-runner.js).
 */
(function () {
  'use strict';

  var DEFAULT_SEC_PER_BREATH = 8;   // 4 s nádech + 4 s výdech = tempo vinyasy

  /* Ze seznamu kroků udělá časovou osu s absolutními časy.
     Vrací { items:[{…krok, sec, start, end}], total } — vše v sekundách. */
  function buildTimeline(steps, secPerBreath) {
    var spb = secPerBreath || DEFAULT_SEC_PER_BREATH;
    var t = 0;
    var items = steps.map(function (s) {
      var sec = s.sec != null ? s.sec : Math.round((s.breaths || 1) * spb);
      if (sec < 1) sec = 1;
      var item = {
        name: s.name, sanskrit: s.sanskrit || '', cue: s.cue || '', block: s.block || '',
        breaths: s.breaths || null, side: s.side || '',
        sec: sec, start: t, end: t + sec
      };
      t += sec;
      return item;
    });
    return { items: items, total: t };
  }

  /* Kroky patřící do varianty dlouhé `minutes`. Krok bez `tier` je v každé variantě. */
  function filterSteps(steps, minutes) {
    return steps.filter(function (s) { return !s.tier || s.tier <= minutes; });
  }

  /* Kde jsme v praxi po `elapsed` sekundách. */
  function stepAt(timeline, elapsed) {
    if (elapsed < 0) elapsed = 0;
    if (elapsed >= timeline.total) {
      return { index: timeline.items.length, item: null, remaining: 0, done: true };
    }
    for (var i = 0; i < timeline.items.length; i++) {
      var it = timeline.items[i];
      if (elapsed < it.end) {
        return { index: i, item: it, remaining: it.end - elapsed, done: false };
      }
    }
    return { index: timeline.items.length, item: null, remaining: 0, done: true };
  }

  function formatClock(sec) {
    if (sec < 0) sec = 0;
    var s = Math.ceil(sec);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  var CORE = {
    buildTimeline: buildTimeline, stepAt: stepAt, formatClock: formatClock,
    filterSteps: filterSteps, DEFAULT_SEC_PER_BREATH: DEFAULT_SEC_PER_BREATH
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function build(root) {
    var cfg;
    try { cfg = JSON.parse(root.getAttribute('data-session') || '{}'); }
    catch (e) { root.textContent = 'Chyba v datech praxe: ' + e.message; return; }
    if (!cfg.steps || !cfg.steps.length) { root.textContent = 'Praxe nemá žádné kroky.'; return; }

    var lengths = cfg.lengths && cfg.lengths.length ? cfg.lengths : null;
    var current = cfg.defaultLength || (lengths ? lengths[lengths.length - 1] : null);
    var tl = buildTimeline(lengths ? filterSteps(cfg.steps, current) : cfg.steps, cfg.secPerBreath);

    var lenBar = el('div', 'sr-lengths');
    var lenBtns = [];

    var head = el('div', 'sr-head');
    var blockLbl = el('div', 'sr-block');
    var clock = el('div', 'sr-clock');
    head.appendChild(blockLbl);
    head.appendChild(clock);

    var now = el('div', 'sr-now');
    var nowName = el('div', 'sr-name');
    var nowSans = el('div', 'sr-sanskrit');
    var nowCount = el('div', 'sr-count');
    var nowCue = el('div', 'sr-cue');
    now.appendChild(nowName); now.appendChild(nowSans); now.appendChild(nowCount); now.appendChild(nowCue);

    var nextEl = el('div', 'sr-next');
    var bar = el('div', 'sr-bar');
    var barFill = el('div', 'sr-bar-fill');
    bar.appendChild(barFill);

    var controls = el('div', 'sr-controls');
    var go = el('button', 'sr-go', 'Spustit praxi');
    go.type = 'button';
    var skip = el('button', 'sr-skip', 'Přeskočit →');
    skip.type = 'button';
    var reset = el('button', 'sr-skip sr-reset', '↺ Od začátku');
    reset.type = 'button';
    controls.appendChild(go); controls.appendChild(skip); controls.appendChild(reset);

    var list = el('div', 'sr-list');
    var listHead = el('div', 'sr-listhead');

    function renderList() {
      listHead.textContent = 'Celá praxe — ' + formatClock(tl.total);
      list.innerHTML = '';
      tl.items.forEach(function (it, i) {
        var row = el('div', 'sr-row');
        row.setAttribute('data-i', i);
        var dur = it.breaths ? it.breaths + ' dech' + (it.breaths >= 5 ? 'ů' : it.breaths > 1 ? 'y' : '') : formatClock(it.sec);
        row.innerHTML = '<span class="sr-row-name">' + esc(it.name)
          + (it.side ? ' <em>(' + esc(it.side) + ')</em>' : '') + '</span>'
          + '<span class="sr-row-dur">' + esc(dur) + '</span>';
        list.appendChild(row);
      });
    }
    renderList();

    if (lengths) {
      lengths.forEach(function (mins) {
        var b = el('button', 'sr-len' + (mins === current ? ' is-on' : ''), mins + ' min');
        b.type = 'button';
        b.addEventListener('click', function () {
          if (mins === current) return;
          current = mins;
          lenBtns.forEach(function (x, xi) { x.classList.toggle('is-on', lengths[xi] === current); });
          stop();
          elapsed = 0;
          tl = buildTimeline(filterSteps(cfg.steps, current), cfg.secPerBreath);
          renderList();
          go.textContent = 'Spustit praxi';
          paint();
        });
        lenBtns.push(b);
        lenBar.appendChild(b);
      });
      root.appendChild(lenBar);
    }

    root.appendChild(head);
    root.appendChild(now);
    root.appendChild(bar);
    root.appendChild(nextEl);
    root.appendChild(controls);
    root.appendChild(listHead);
    root.appendChild(list);

    var timer = null, elapsed = 0, running = false, lastTick = 0;

    function paint() {
      var st = stepAt(tl, elapsed);
      if (st.done) {
        stop();
        blockLbl.textContent = 'Hotovo';
        clock.textContent = formatClock(tl.total);
        nowName.textContent = 'Praxe dokončená';
        nowSans.textContent = '';
        nowCount.textContent = '';
        nowCue.innerHTML = 'Zůstaň chvíli ležet. Až budeš u telefonu, zapiš si, jak to šlo — '
          + 'ta čísla jsou to jediné, proti čemu se dá příště porovnat.';
        nextEl.textContent = '';
        barFill.style.width = '100%';
        Array.prototype.forEach.call(list.children, function (r) { r.classList.remove('is-now'); r.classList.add('is-done'); });
        return;
      }
      var it = st.item;
      blockLbl.textContent = it.block || '';
      clock.textContent = formatClock(tl.total - elapsed);
      nowName.textContent = it.name + (it.side ? ' — ' + it.side : '');
      nowSans.textContent = it.sanskrit;
      nowCount.textContent = Math.ceil(st.remaining);
      nowCue.textContent = it.cue;
      barFill.style.width = (100 * (it.sec - st.remaining) / it.sec) + '%';
      var nx = tl.items[st.index + 1];
      nextEl.innerHTML = nx
        ? 'Dál: <strong>' + esc(nx.name) + (nx.side ? ' (' + esc(nx.side) + ')' : '') + '</strong>'
        : 'Poslední krok.';
      Array.prototype.forEach.call(list.children, function (r, i) {
        r.classList.toggle('is-now', i === st.index);
        r.classList.toggle('is-done', i < st.index);
      });
    }

    function tick() {
      var t = Date.now();
      elapsed += (t - lastTick) / 1000;
      lastTick = t;
      paint();
    }

    function start() {
      running = true;
      lastTick = Date.now();
      go.textContent = 'Pauza';
      go.classList.add('is-running');
      timer = setInterval(tick, 200);
      paint();
    }

    function stop() {
      running = false;
      if (timer) { clearInterval(timer); timer = null; }
      go.textContent = elapsed > 0 ? 'Pokračovat' : 'Spustit praxi';
      go.classList.remove('is-running');
    }

    go.addEventListener('click', function () { running ? stop() : start(); });
    skip.addEventListener('click', function () {
      var st = stepAt(tl, elapsed);
      elapsed = st.done ? tl.total : st.item.end;
      paint();
    });
    reset.addEventListener('click', function () {
      stop(); elapsed = 0;
      go.textContent = 'Spustit praxi';
      paint();
    });

    paint();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.session-runner'), build);
  });
})();
