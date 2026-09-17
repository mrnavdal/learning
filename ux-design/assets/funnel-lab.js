/* funnel-lab.js — trychtýř jako kroky úkolu (komponent pro lekce).
 *
 * Učí tři věci, které se nedají naučit čtením:
 *   1) Trychtýř = kroky JEDNOHO úkolu nad jednou kohortou. Ne „conversion
 *      rate na obrazovku“ — ta nemá společného jmenovatele.
 *   2) Opravuje se krok s největší ABSOLUTNÍ ztrátou, ne s nejhorším procentem.
 *   3) Krok, který neměříš, splyne se sousedním → slepé místo. Když v něm leží
 *      ta největší ztráta, nepoznáš, který z těch kroků ji způsobil.
 *
 * Použití v lekci:
 *   <div class="funnel-lab"></div>
 *   <script src="../assets/funnel-lab.js"></script>
 *
 * Jádro analyze() je čistá funkce → testovatelné v Node
 * (viz tools/test-funnel-lab.js).
 */
(function () {
  'use strict';

  var SCENARIOS = [
    {
      id: 'pred',
      name: 'Před',
      note: 'Rezervace i platba se dějí v systému partnera. Krok „zaplatí“ je proto <strong>mimo tvoji appku</strong> — nemůžeš ho změřit, ani kdybys chtěl. To není chybějící instrumentace, to je vlastnost toho návrhu.',
      steps: [
        { key: 'open',    label: 'Otevře appku',              count: 1000 },
        { key: 'feed',    label: 'Uvidí aspoň jednu nabídku', count: 900 },
        { key: 'detail',  label: 'Otevře detail nabídky',     count: 640 },
        { key: 'start',   label: 'Klikne na rezervovat',      count: 430 },
        { key: 'pay',     label: 'Zaplatí',                   count: 45, unmeasurable: true,
          whyUnmeasurable: 'Děje se v cizím systému. Tohle číslo bys musel chtít po partnerovi — a stejně nepoznáš, kdo z tvých lidí to byl.' },
        { key: 'arrive',  label: 'Dorazí, kód ověřen',        count: 38 }
      ]
    },
    {
      id: 'po',
      name: 'Po (hypotéza)',
      note: 'Rezervace i platba jsou v appce. Krok „zaplatí“ je najednou <strong>měřitelný</strong> — a to je půlka hodnoty toho rozhodnutí, o které se obvykle nemluví. Sleduj, kam se ztráta přesune.',
      steps: [
        { key: 'open',    label: 'Otevře appku',              count: 1000 },
        { key: 'feed',    label: 'Uvidí aspoň jednu nabídku', count: 900 },
        { key: 'detail',  label: 'Otevře detail nabídky',     count: 640 },
        { key: 'start',   label: 'Klikne na rezervovat',      count: 430 },
        { key: 'pay',     label: 'Zaplatí',                   count: 310 },
        { key: 'arrive',  label: 'Dorazí, kód ověřen',        count: 270 }
      ]
    }
  ];

  // ---- Čisté jádro ----------------------------------------------------

  // steps: [{key,label,count,unmeasurable?}], measured: pole boolů stejné délky.
  // Krok 0 je vždy měřený (je to jmenovatel). Neměřitelný krok se nedá zapnout.
  //
  // Vrací:
  //   rows  — jeden řádek na krok (i neměřený, kvůli vykreslení)
  //   spans — úseky mezi dvěma měřenými kroky: kde a kolik lidí zmizelo
  //   worst — index úseku s největší absolutní ztrátou
  //   blindWorst — leží největší ztráta ve slepém místě?
  function analyze(steps, measured) {
    var m = steps.map(function (s, i) {
      if (s.unmeasurable) return false;
      if (i === 0) return true;
      return measured ? !!measured[i] : true;
    });

    var rows = steps.map(function (s, i) {
      return { key: s.key, label: s.label, count: s.count, measured: m[i], index: i };
    });

    var spans = [], prev = 0;
    for (var i = 1; i < steps.length; i++) {
      if (!m[i]) continue;
      spans.push({
        from: prev, to: i,
        fromLabel: steps[prev].label, toLabel: steps[i].label,
        loss: steps[prev].count - steps[i].count,
        dropPct: steps[prev].count ? Math.round((1 - steps[i].count / steps[prev].count) * 100) : 0,
        hidden: i - prev - 1,
        hiddenLabels: steps.slice(prev + 1, i).map(function (s) { return s.label; })
      });
      prev = i;
    }

    var worst = -1;
    spans.forEach(function (sp, i) { if (worst < 0 || sp.loss > spans[worst].loss) worst = i; });

    return {
      rows: rows,
      spans: spans,
      worst: worst,
      blindWorst: worst >= 0 && spans[worst].hidden > 0,
      measuredCount: m.filter(Boolean).length,
      tailUnmeasured: !m[steps.length - 1]
    };
  }

  // Verdikt jednou větou — používá lekce i test.
  function verdict(res) {
    if (res.worst < 0) return { tone: 'warn', text: 'Neměříš nic kromě prvního kroku — trychtýř nemáš, máš jen návštěvnost.' };
    var sp = res.spans[res.worst];
    if (sp.hidden > 0) {
      return {
        tone: 'warn',
        text: 'Největší ztráta (−' + sp.loss + ' lidí) leží mezi „' + sp.fromLabel + '“ a „' + sp.toLabel
            + '“, ale mezi nimi ' + (sp.hidden === 1 ? 'je 1 neměřený krok' : 'jsou ' + sp.hidden + ' neměřené kroky')
            + ' (' + sp.hiddenLabels.join(', ') + '). Víš, že lidi mizí — nepoznáš kde. Slepé místo přesně tam, kde je práce.'
      };
    }
    return {
      tone: 'good',
      text: 'Největší absolutní ztráta: „' + sp.fromLabel + '“ → „' + sp.toLabel + '“, −' + sp.loss
          + ' lidí (−' + sp.dropPct + ' %). Tady leží tvoje příští rozhodnutí — ne tam, kde je nejhorší procento.'
    };
  }

  var CORE = { SCENARIOS: SCENARIOS, analyze: analyze, verdict: verdict };
  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  // ---- DOM wrapper ----------------------------------------------------

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function build(root) {
    var scenario = SCENARIOS[0];
    var measured = {};

    var switcher = el('div', 'fl-scenarios');
    var note = el('div', 'fl-note');
    var list = el('div', 'fl-steps');
    var verdictBox = el('div', 'fl-verdict');
    var hint = el('p', 'note-small', 'Čísla jsou ilustrativní — tvar trychtýře je reálný, tvoje čísla do něj dosadíš, až poběží analytika. Klikáním na „měřím / neměřím“ si zkus, co se stane, když ti chybí event.');

    var btns = {};
    SCENARIOS.forEach(function (sc) {
      var b = el('button', 'fl-scenario', sc.name);
      b.type = 'button';
      b.addEventListener('click', function () { scenario = sc; measured = {}; render(); });
      btns[sc.id] = b;
      switcher.appendChild(b);
    });

    root.appendChild(el('div', 'fl-h', 'Kdy se co děje'));
    root.appendChild(switcher);
    root.appendChild(note);
    root.appendChild(list);
    root.appendChild(verdictBox);
    root.appendChild(hint);

    function flags() {
      return scenario.steps.map(function (s, i) {
        if (s.unmeasurable) return false;
        if (i === 0) return true;
        return measured[scenario.id + ':' + s.key] !== false;
      });
    }

    function render() {
      Object.keys(btns).forEach(function (id) { btns[id].classList.toggle('is-on', id === scenario.id); });
      note.innerHTML = scenario.note;

      var res = analyze(scenario.steps, flags());
      var max = scenario.steps[0].count;
      list.innerHTML = '';

      res.rows.forEach(function (row, i) {
        // ztráta proti předchozímu MĚŘENÉMU kroku
        var span = null;
        res.spans.forEach(function (sp) { if (sp.to === i) span = sp; });

        var item = el('div', 'fl-step' + (row.measured ? '' : ' is-hidden'));
        var head = el('div', 'fl-step-head');
        head.appendChild(el('span', 'fl-label', row.label));

        var toggle = el('button', 'fl-toggle' + (row.measured ? ' is-on' : ''), row.measured ? 'měřím' : 'neměřím');
        toggle.type = 'button';
        if (scenario.steps[i].unmeasurable) {
          toggle.textContent = 'nejde měřit';
          toggle.classList.add('is-locked');
          toggle.title = scenario.steps[i].whyUnmeasurable;
        } else if (i === 0) {
          toggle.classList.add('is-locked');
          toggle.title = 'První krok je jmenovatel celého trychtýře — bez něj nemáš z čeho počítat.';
        } else {
          toggle.addEventListener('click', function () {
            var k = scenario.id + ':' + row.key;
            measured[k] = !(measured[k] !== false);
            render();
          });
        }
        head.appendChild(toggle);
        item.appendChild(head);

        var track = el('div', 'fl-track');
        var fill = el('div', 'fl-fill' + (row.measured ? '' : ' fl-blind'));
        fill.style.width = Math.max(1, Math.round(row.count / max * 100)) + '%';
        track.appendChild(fill);
        item.appendChild(track);

        var val = el('div', 'fl-val');
        val.innerHTML = row.measured
          ? '<strong>' + row.count + '</strong> lidí'
          : '<strong>?</strong> <span class="fl-dim">neměřeno' + (scenario.steps[i].unmeasurable ? ' — ' + scenario.steps[i].whyUnmeasurable : '') + '</span>';
        item.appendChild(val);

        if (span) {
          var lossCls = 'fl-loss' + (res.worst >= 0 && res.spans[res.worst] === span ? ' is-worst' : '') + (span.hidden ? ' is-blind' : '');
          var txt = '−' + span.loss + ' lidí (−' + span.dropPct + ' %) od „' + span.fromLabel + '“';
          if (span.hidden) txt += ' · přes ' + span.hidden + ' neměřený' + (span.hidden > 1 ? 'ch kroků' : ' krok');
          item.appendChild(el('div', lossCls, txt));
        }

        list.appendChild(item);
      });

      var v = verdict(res);
      verdictBox.className = 'fl-verdict ' + v.tone;
      verdictBox.textContent = v.text;
    }

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.funnel-lab'), build);
  });
})();
