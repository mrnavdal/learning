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
    DEFAULT_SEC_PER_BREATH: DEFAULT_SEC_PER_BREATH
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

    var tl = buildTimeline(cfg.steps, cfg.secPerBreath);

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
    tl.items.forEach(function (it, i) {
      var row = el('div', 'sr-row');
      row.setAttribute('data-i', i);
      var dur = it.breaths ? it.breaths + ' dech' + (it.breaths >= 5 ? 'ů' : it.breaths > 1 ? 'y' : '') : formatClock(it.sec);
      row.innerHTML = '<span class="sr-row-name">' + esc(it.name)
        + (it.side ? ' <em>(' + esc(it.side) + ')</em>' : '') + '</span>'
        + '<span class="sr-row-dur">' + esc(dur) + '</span>';
      list.appendChild(row);
    });

    root.appendChild(head);
    root.appendChild(now);
    root.appendChild(bar);
    root.appendChild(nextEl);
    root.appendChild(controls);
    root.appendChild(el('div', 'sr-listhead', 'Celá praxe — ' + formatClock(tl.total)));
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
