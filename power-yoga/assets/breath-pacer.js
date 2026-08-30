/* breath-pacer.js — časovač dechu (komponent pro lekce).
 *
 * Vizuální metronom dechu: koule se nadechuje (roste) a vydechuje (zmenšuje)
 * v zadaném tempu, počítá dokončená kola a hlásí splnění cíle.
 * Uživatel cvičí doma sám — tohle je jeho jediná "objektivní" zpětná vazba na tempo.
 *
 * Použití v lekci:
 *   <div class="breath-pacer" data-pacer='{"target":8}'></div>
 *   <script src="../assets/breath-pacer.js"></script>
 *
 * Konfigurace (vše volitelné):
 *   target  — kolik kol dechu je cíl (default 8)
 *   tempos  — [{label, in, out}] nabídka temp v sekundách
 *   start   — index výchozího tempa
 *
 * Jádro (phaseAt / scaleFor) jsou čisté funkce → testovatelné v Node
 * (viz tools/test-breath-pacer.js).
 */
(function () {
  'use strict';

  var DEFAULT_TEMPOS = [
    { label: '4 s', in: 4, out: 4, note: 'Tempo vinyasy — takhle rychle se dýchá v pohybu.' },
    { label: '5 s', in: 5, out: 5, note: '~6 dechů za minutu. Tady je efekt na nervovou soustavu největší.' },
    { label: '6 s', in: 6, out: 6, note: 'Pomalé a dlouhé. Dobré na závěr praxe nebo na zklidnění.' }
  ];

  var MIN_SCALE = 0.55, MAX_SCALE = 1.0;

  /* Kde jsme v dechovém cyklu po `elapsed` ms.
     Vrací { phase:'in'|'out', progress:0..1, remaining: sekundy, round: dokončených kol } */
  function phaseAt(elapsed, inSec, outSec) {
    var inMs = inSec * 1000, outMs = outSec * 1000, cycle = inMs + outMs;
    if (elapsed < 0) elapsed = 0;
    var round = Math.floor(elapsed / cycle);
    var t = elapsed - round * cycle;
    if (t < inMs) {
      return { phase: 'in', progress: t / inMs, remaining: (inMs - t) / 1000, round: round };
    }
    var t2 = t - inMs;
    return { phase: 'out', progress: t2 / outMs, remaining: (outMs - t2) / 1000, round: round };
  }

  /* Velikost koule pro daný stav: nádech roste, výdech se zmenšuje. */
  function scaleFor(state) {
    var span = MAX_SCALE - MIN_SCALE;
    return state.phase === 'in'
      ? MIN_SCALE + span * state.progress
      : MAX_SCALE - span * state.progress;
  }

  var CORE = { phaseAt: phaseAt, scaleFor: scaleFor, DEFAULT_TEMPOS: DEFAULT_TEMPOS, MIN_SCALE: MIN_SCALE, MAX_SCALE: MAX_SCALE };

  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function build(root) {
    var cfg = {};
    try { cfg = JSON.parse(root.getAttribute('data-pacer') || '{}'); } catch (e) { cfg = {}; }
    var tempos = cfg.tempos || DEFAULT_TEMPOS;
    var target = cfg.target || 8;
    var current = cfg.start != null ? cfg.start : 1;

    var controls = el('div', 'bp-controls');
    var tempoBtns = [];
    tempos.forEach(function (t, i) {
      var b = el('button', 'bp-tempo' + (i === current ? ' is-on' : ''), t.label);
      b.type = 'button';
      b.addEventListener('click', function () {
        current = i;
        tempoBtns.forEach(function (x, xi) { x.classList.toggle('is-on', xi === i); });
        note.textContent = tempos[current].note || '';
        stop();
      });
      tempoBtns.push(b);
      controls.appendChild(b);
    });
    var go = el('button', 'bp-go', 'Začít dýchat');
    go.type = 'button';
    controls.appendChild(go);

    var note = el('div', 'bp-idle', tempos[current].note || '');
    var stage = el('div', 'bp-stage');
    var orb = el('div', 'bp-orb');
    var phaseLbl = el('div', 'bp-phase', 'Nádech');
    var countLbl = el('div', 'bp-count', '');
    orb.appendChild(phaseLbl); orb.appendChild(countLbl);
    stage.appendChild(orb);

    var meter = el('div', 'bp-meter');
    var track = el('div', 'bp-track');
    var fill = el('div', 'bp-fill');
    track.appendChild(fill);
    var rounds = el('span', 'bp-rounds', '0 / ' + target);
    meter.appendChild(el('span', null, 'Kola'));
    meter.appendChild(track);
    meter.appendChild(rounds);

    var done = el('div', 'bp-done');

    root.appendChild(controls);
    root.appendChild(note);
    root.appendChild(stage);
    root.appendChild(meter);
    root.appendChild(done);

    var raf = null, startedAt = 0;

    function paint(state) {
      orb.style.transform = 'scale(' + scaleFor(state).toFixed(4) + ')';
      orb.classList.toggle('is-out', state.phase === 'out');
      phaseLbl.textContent = state.phase === 'in' ? 'Nádech' : 'Výdech';
      countLbl.textContent = Math.ceil(state.remaining - 0.001);
      var r = Math.min(state.round, target);
      rounds.textContent = r + ' / ' + target;
      fill.style.width = (100 * r / target) + '%';
    }

    function tick(now) {
      var t = tempos[current];
      var state = phaseAt(now - startedAt, t.in, t.out);
      if (state.round >= target) {
        stop();
        fill.style.width = '100%';
        rounds.textContent = target + ' / ' + target;
        done.innerHTML = '<strong>' + target + ' kol hotovo.</strong> Takhle dlouho ti trvá '
          + target + ' dechů v tempu ' + t.label + ' — ' + Math.round(target * (t.in + t.out))
          + ' vteřin. Zapamatuj si ten pocit, tohle je tempo, ve kterém se pak budeš hýbat.';
        return;
      }
      paint(state);
      raf = requestAnimationFrame(tick);
    }

    function start() {
      done.innerHTML = '';
      startedAt = performance.now();
      go.textContent = 'Stop';
      go.classList.add('is-running');
      raf = requestAnimationFrame(tick);
    }

    function stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      go.textContent = 'Začít dýchat';
      go.classList.remove('is-running');
      orb.style.transform = 'scale(' + MIN_SCALE + ')';
      orb.classList.remove('is-out');
      phaseLbl.textContent = 'Nádech';
      countLbl.textContent = '';
    }

    go.addEventListener('click', function () { raf ? stop() : start(); });
    stop();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.breath-pacer'), build);
  });
})();
