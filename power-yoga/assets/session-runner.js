/* session-runner.js — běhoun tréninkové jednotky (komponent pro sessions).
 *
 * Přehraje libovolnou praxi krok po kroku. Cvičíš doma sám s telefonem u podložky —
 * tohle je náhrada za hlas lektora.
 *
 * Tři věci, na kterých stojí použitelnost u podložky:
 *   1) ZVUKOVÝ ODPOČET — 3 pípnutí před koncem kroku a tón na konci, takže nemusíš
 *      koukat na displej. V pozici se stejně díváš jinam.
 *   2) PŘECHODY — po každém kroku se běhoun ZASTAVÍ a ukáže, jak se dostaneš do další
 *      pozice. Pokračuje se až na ťuknutí, takže máš čas se v klidu přesrovnat.
 *   3) VARIANTY DÉLKY — jedna praxe jede v 25/30/35 min se zachovaným obloukem.
 *
 * Použití v session:
 *   <div class="session-runner" data-session='{"secPerBreath":8,"steps":[…]}'></div>
 *   <script src="../assets/session-runner.js"></script>
 *
 * Krok:
 *   {
 *     "block": "Rozehřátí",              // část praxe
 *     "name": "Cat-Cow",
 *     "sanskrit": "Marjaryasana",        // volitelné
 *     "side": "pravá ruka",              // volitelné
 *     "breaths": 8,                      // NEBO "sec": 60
 *     "transition": "Z lehu se přetoč…", // jak se DO téhle pozice dostaneš z předchozí
 *     "cue": "Nádech propadáš břichem…"  // co v pozici dělat
 *   }
 *
 * Varianty délky:
 *   Krok bez `tier` je jádro praxe a je v každé variantě. Krok s `tier: 75` se objeví
 *   ve variantě 75 min a delší. Nabídku určí `lengths: [60,75,90]`, výchozí `defaultLength`.
 *
 * Další volby: `lead` (kolik vteřin před koncem pípat, default 3),
 *              `autoAdvance: true` (přeskočí obrazovku přechodu — nedoporučeno).
 *
 * Čisté jádro (buildTimeline / stepAt / filterSteps / countdownCue / remainingFrom /
 * formatClock) je testovatelné v Node — viz tools/test-session-runner.js.
 */
(function () {
  'use strict';

  var DEFAULT_SEC_PER_BREATH = 8;   // 4 s nádech + 4 s výdech = tempo vinyasy
  var DEFAULT_LEAD = 3;             // vteřiny zvukového odpočtu před koncem kroku

  /* Ze seznamu kroků udělá časovou osu s absolutními časy (vše v sekundách). */
  function buildTimeline(steps, secPerBreath) {
    var spb = secPerBreath || DEFAULT_SEC_PER_BREATH;
    var t = 0;
    var items = steps.map(function (s) {
      var sec = s.sec != null ? s.sec : Math.round((s.breaths || 1) * spb);
      if (sec < 1) sec = 1;
      var item = {
        name: s.name, sanskrit: s.sanskrit || '', cue: s.cue || '',
        transition: s.transition || '', block: s.block || '',
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

  /* Kde jsme v praxi po `elapsed` sekundách (pro souvislé přehrávání bez pauz). */
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

  /* Kolik cvičení zbývá od kroku `index`, když je v něm odcvičeno `stepElapsed` sekund.
     Přechody se do toho nepočítají — ty trvají, jak dlouho potřebuješ. */
  function remainingFrom(timeline, index, stepElapsed) {
    if (index >= timeline.items.length) return 0;
    var rest = timeline.total - timeline.items[index].start;
    var left = rest - (stepElapsed || 0);
    return left > 0 ? left : 0;
  }

  /* Jaký zvuk zahrát při přechodu z `prevRemaining` na `remaining` vteřin do konce kroku.
     'tick' = odpočtové pípnutí, 'end' = konec kroku, null = ticho. */
  function countdownCue(prevRemaining, remaining, lead) {
    var l = lead == null ? DEFAULT_LEAD : lead;
    if (remaining <= 0) return prevRemaining > 0 ? 'end' : null;
    var p = Math.ceil(prevRemaining), n = Math.ceil(remaining);
    if (n < p && n >= 1 && n <= l) return 'tick';
    return null;
  }

  function formatClock(sec) {
    if (sec < 0) sec = 0;
    var s = Math.ceil(sec);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  var CORE = {
    buildTimeline: buildTimeline, stepAt: stepAt, filterSteps: filterSteps,
    countdownCue: countdownCue, remainingFrom: remainingFrom, formatClock: formatClock,
    DEFAULT_SEC_PER_BREATH: DEFAULT_SEC_PER_BREATH, DEFAULT_LEAD: DEFAULT_LEAD
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

  /* ---- Zvuk: krátké tóny přes Web Audio, žádné externí soubory ---- */
  function makeSound() {
    var actx = null, muted = false;
    function ctx() {
      if (actx) return actx;
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      try { actx = new Ctx(); } catch (e) { return null; }
      return actx;
    }
    function tone(freq, dur, vol) {
      if (muted) return;
      var c = ctx();
      if (!c) return;
      if (c.state === 'suspended' && c.resume) c.resume();
      try {
        var o = c.createOscillator(), g = c.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, c.currentTime);
        g.gain.exponentialRampToValueAtTime(vol, c.currentTime + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
        o.connect(g); g.connect(c.destination);
        o.start();
        o.stop(c.currentTime + dur + 0.03);
      } catch (e) { /* zvuk je bonus, nikdy nesmí shodit praxi */ }
    }
    return {
      /* odemkne audio na uživatelské gesto (jinak to prohlížeč zablokuje) */
      unlock: function () { var c = ctx(); if (c && c.state === 'suspended' && c.resume) c.resume(); },
      tick: function () { tone(880, 0.09, 0.22); },
      end: function () { tone(523.25, 0.38, 0.3); },
      isMuted: function () { return muted; },
      toggle: function () { muted = !muted; if (!muted) this.unlock(); return muted; }
    };
  }

  function build(root) {
    var cfg;
    try { cfg = JSON.parse(root.getAttribute('data-session') || '{}'); }
    catch (e) { root.textContent = 'Chyba v datech praxe: ' + e.message; return; }
    if (!cfg.steps || !cfg.steps.length) { root.textContent = 'Praxe nemá žádné kroky.'; return; }

    var sound = makeSound();
    var lead = cfg.lead == null ? DEFAULT_LEAD : cfg.lead;
    var autoAdvance = cfg.autoAdvance === true;
    var lengths = cfg.lengths && cfg.lengths.length ? cfg.lengths : null;
    var current = cfg.defaultLength || (lengths ? lengths[lengths.length - 1] : null);
    var tl = buildTimeline(lengths ? filterSteps(cfg.steps, current) : cfg.steps, cfg.secPerBreath);

    /* ---- prvky ---- */
    var lenBar = el('div', 'sr-lengths'), lenBtns = [];

    var head = el('div', 'sr-head');
    var blockLbl = el('div', 'sr-block');
    var clock = el('div', 'sr-clock');
    head.appendChild(blockLbl); head.appendChild(clock);

    var now = el('div', 'sr-now');
    var nowName = el('div', 'sr-name');
    var nowSans = el('div', 'sr-sanskrit');
    var nowCount = el('div', 'sr-count');
    var nowCue = el('div', 'sr-cue');
    now.appendChild(nowName); now.appendChild(nowSans); now.appendChild(nowCount); now.appendChild(nowCue);

    var trans = el('div', 'sr-transition');
    var transLbl = el('div', 'sr-trans-label', 'Přechod');
    var transName = el('div', 'sr-trans-name');
    var transText = el('div', 'sr-trans-text');
    var transGo = el('button', 'sr-trans-go', 'Jsem nachystaný →');
    transGo.type = 'button';
    trans.appendChild(transLbl); trans.appendChild(transName); trans.appendChild(transText); trans.appendChild(transGo);
    trans.hidden = true;

    var bar = el('div', 'sr-bar');
    var barFill = el('div', 'sr-bar-fill');
    bar.appendChild(barFill);

    var nextEl = el('div', 'sr-next');

    var controls = el('div', 'sr-controls');
    var go = el('button', 'sr-go', 'Spustit praxi');
    go.type = 'button';
    var skip = el('button', 'sr-skip', 'Přeskočit →');
    skip.type = 'button';
    var reset = el('button', 'sr-skip sr-reset', '↺ Od začátku');
    reset.type = 'button';
    var mute = el('button', 'sr-skip sr-mute', '🔊 Zvuk');
    mute.type = 'button';
    mute.setAttribute('aria-pressed', 'false');
    controls.appendChild(go); controls.appendChild(skip); controls.appendChild(reset); controls.appendChild(mute);

    var listHead = el('div', 'sr-listhead');
    var list = el('div', 'sr-list');

    function renderList() {
      listHead.textContent = 'Celá praxe — ' + formatClock(tl.total) + ' čistého cvičení';
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
          tl = buildTimeline(filterSteps(cfg.steps, current), cfg.secPerBreath);
          renderList();
          hardReset();
        });
        lenBtns.push(b);
        lenBar.appendChild(b);
      });
      root.appendChild(lenBar);
    }
    root.appendChild(head);
    root.appendChild(now);
    root.appendChild(trans);
    root.appendChild(bar);
    root.appendChild(nextEl);
    root.appendChild(controls);
    root.appendChild(listHead);
    root.appendChild(list);

    /* ---- stav ---- */
    var IDLE = 'idle', RUN = 'run', PAUSE = 'pause', WAIT = 'wait', DONE = 'done';
    var mode = IDLE, idx = 0, stepElapsed = 0, timer = null, lastTick = 0;

    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function markList() {
      Array.prototype.forEach.call(list.children, function (r, i) {
        r.classList.toggle('is-now', i === idx && mode !== DONE);
        r.classList.toggle('is-done', i < idx || mode === DONE);
      });
    }

    function showTransition(nextIdx) {
      var nx = tl.items[nextIdx];
      trans.hidden = false;
      now.hidden = true;
      transName.textContent = nx.name + (nx.side ? ' — ' + nx.side : '');
      transText.textContent = nx.transition
        || 'Přejdi v klidu do další pozice. Až budeš nachystaný, ťukni na tlačítko.';
      blockLbl.textContent = nx.block || '';
      nextEl.innerHTML = 'Čeká na tebe — <strong>' + esc(formatClock(nx.sec)) + '</strong>'
        + '. Čas neběží, sesbírej se.';
      barFill.style.width = '0%';
    }

    function hideTransition() {
      trans.hidden = true;
      now.hidden = false;
    }

    function paintRunning() {
      var it = tl.items[idx];
      var remaining = it.sec - stepElapsed;
      blockLbl.textContent = it.block || '';
      clock.textContent = formatClock(remainingFrom(tl, idx, stepElapsed)) + ' zbývá';
      nowName.textContent = it.name + (it.side ? ' — ' + it.side : '');
      nowSans.textContent = it.sanskrit;
      nowCount.textContent = Math.max(0, Math.ceil(remaining - 0.001));
      nowCount.classList.toggle('is-soon', remaining <= lead + 0.001);
      nowCue.textContent = it.cue;
      barFill.style.width = (100 * Math.min(1, stepElapsed / it.sec)) + '%';
      var nx = tl.items[idx + 1];
      nextEl.innerHTML = nx
        ? 'Dál: <strong>' + esc(nx.name) + (nx.side ? ' (' + esc(nx.side) + ')' : '') + '</strong>'
        : 'Poslední krok praxe.';
      markList();
    }

    function finish() {
      stopTimer();
      mode = DONE;
      hideTransition();
      blockLbl.textContent = 'Hotovo';
      clock.textContent = formatClock(tl.total);
      nowName.textContent = 'Praxe dokončená';
      nowSans.textContent = '';
      nowCount.textContent = '';
      nowCount.classList.remove('is-soon');
      nowCue.innerHTML = 'Zůstaň chvíli ležet. Až budeš u telefonu, zapiš si čísla — '
        + 'jsou to jediná data, proti kterým se dá příště porovnat.';
      nextEl.textContent = '';
      barFill.style.width = '100%';
      go.textContent = 'Spustit praxi';
      go.classList.remove('is-running');
      markList();
    }

    function endStep() {
      stopTimer();
      sound.end();
      if (idx >= tl.items.length - 1) { finish(); return; }
      if (autoAdvance) { idx++; stepElapsed = 0; startTimer(); return; }
      mode = WAIT;
      go.textContent = 'Pokračovat';
      go.classList.remove('is-running');
      showTransition(idx + 1);
      markList();
    }

    function tick() {
      var t = Date.now();
      var dt = (t - lastTick) / 1000;
      lastTick = t;
      var it = tl.items[idx];
      var before = it.sec - stepElapsed;
      stepElapsed += dt;
      var after = it.sec - stepElapsed;
      var cue = countdownCue(before, after, lead);
      if (cue === 'tick') sound.tick();
      if (after <= 0) { paintRunning(); endStep(); return; }
      paintRunning();
    }

    function startTimer() {
      mode = RUN;
      hideTransition();
      lastTick = Date.now();
      stopTimer();
      timer = setInterval(tick, 100);
      go.textContent = 'Pauza';
      go.classList.add('is-running');
      paintRunning();
    }

    function pause() {
      stopTimer();
      mode = PAUSE;
      go.textContent = 'Pokračovat';
      go.classList.remove('is-running');
    }

    function advance() {
      idx++;
      stepElapsed = 0;
      startTimer();
    }

    function hardReset() {
      stopTimer();
      mode = IDLE; idx = 0; stepElapsed = 0;
      hideTransition();
      go.textContent = 'Spustit praxi';
      go.classList.remove('is-running');
      paintRunning();
      clock.textContent = formatClock(tl.total) + ' celkem';
      nowCount.textContent = formatClock(tl.items[0].sec);
      nowCount.classList.remove('is-soon');
    }

    go.addEventListener('click', function () {
      sound.unlock();
      if (mode === WAIT) { advance(); return; }
      if (mode === DONE) { hardReset(); return; }
      if (mode === RUN) { pause(); return; }
      startTimer();     // IDLE i PAUSE
    });
    transGo.addEventListener('click', function () { sound.unlock(); advance(); });
    skip.addEventListener('click', function () {
      sound.unlock();
      if (mode === DONE) return;
      if (mode === WAIT) { advance(); return; }
      stepElapsed = tl.items[idx].sec;
      endStep();
    });
    reset.addEventListener('click', hardReset);
    mute.addEventListener('click', function () {
      var m = sound.toggle();
      mute.textContent = m ? '🔇 Ticho' : '🔊 Zvuk';
      mute.classList.toggle('is-off', m);
      mute.setAttribute('aria-pressed', m ? 'true' : 'false');
    });

    hardReset();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.session-runner'), build);
  });
})();
