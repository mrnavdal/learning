#!/usr/bin/env node
/* Test jádra decision-trace.js.
 * Ověřuje logiku i to, že data neprozrazují odpověď formátem.
 * Spusť:  node tools/test-decision-trace.js
 */
'use strict';
const { LINKS, SCENARIOS, check, correctIndex, assemble, validate, shuffledOrder } = require('../assets/decision-trace.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }

// --- struktura dat ---
ok('řetěz má čtyři články (Cíl → Bariéra → Rozhodnutí → Důkaz)', LINKS.length === 4);
ok('články jsou ve správném pořadí', LINKS.map(l => l.key).join('>') === 'cil>bariera>rozhodnuti>dukaz');
const problems = validate(SCENARIOS);
ok('validace dat nehlásí problémy' + (problems.length ? ': ' + problems.join(' | ') : ''), problems.length === 0);
ok('scénáře jsou aspoň dva', SCENARIOS.length >= 2);

// --- vyhodnocení volby ---
SCENARIOS.forEach(sc => {
  LINKS.forEach((link, li) => {
    const ci = correctIndex(sc, li);
    ok(sc.id + '/' + link.key + ': správná volba projde', check(sc, li, ci).ok === true);
    const wrong = sc.options[li].findIndex((o, i) => i !== ci);
    const res = check(sc, li, wrong);
    ok(sc.id + '/' + link.key + ': špatná volba neprojde a vysvětlí proč', res.ok === false && res.why.length > 40);
  });
  ok(sc.id + ': done je true jen u posledního článku',
     check(sc, 3, correctIndex(sc, 3)).done === true && check(sc, 0, correctIndex(sc, 0)).done === false);
});

// --- délky možností neprozrazují odpověď ---
SCENARIOS.forEach(sc => {
  sc.options.forEach((opts, li) => {
    const lens = opts.map(o => o.t.length);
    const ci = correctIndex(sc, li);
    const isLongest = lens[ci] === Math.max(...lens) && lens.filter(l => l === lens[ci]).length === 1;
    // nejdelší možnost nesmí být systematicky ta správná — kontrolujeme aspoň,
    // že to neplatí ve všech článcích najednou
    opts.forEach(o => { if (o.t.length > 62) fail++, console.log('✗ ' + sc.id + '/' + LINKS[li].key + ': možnost delší než 62 znaků (' + o.t.length + ')'); });
    void isLongest;
  });
});
const longestIsCorrectEverywhere = SCENARIOS.every(sc =>
  sc.options.every((opts, li) => opts[correctIndex(sc, li)].t.length === Math.max(...opts.map(o => o.t.length))));
ok('správná odpověď NENÍ vždycky ta nejdelší', !longestIsCorrectEverywhere);
// v datech je správná záměrně první (čitelnost zdroje) — o to důležitější je,
// aby ji DOM míchal, jinak se řetěz vyřeší nazpaměť pozicí
ok('data mají správnou možnost první (čitelný zdroj)',
   SCENARIOS.every(sc => sc.options.every((opts, li) => correctIndex(sc, li) === 0)));
const order = shuffledOrder(4, (() => { let i = 0; const seq = [0.9, 0.1, 0.6]; return () => seq[i++ % seq.length]; })());
ok('shuffledOrder vrací permutaci (nic nezmizí, nic se nezdvojí)',
   order.length === 4 && [...order].sort().join('') === '0123');
let sawNonIdentity = false;
for (let i = 0; i < 40; i++) if (shuffledOrder(4).join('') !== '0123') sawNonIdentity = true;
ok('shuffledOrder opravdu míchá (40 pokusů dalo jiné pořadí)', sawNonIdentity);

// --- složení odstavce do případovky ---
SCENARIOS.forEach(sc => {
  const sentence = assemble(sc);
  ok(sc.id + ': věta začíná „Protože"', sentence.startsWith('Protože '));
  ok(sc.id + ': věta obsahuje cíl i důkaz', sentence.includes('Cíl:') && sentence.includes('Ověřím to takhle:'));
  ok(sc.id + ': věta je dost konkrétní (obsahuje číslo)', /\d/.test(sentence));
  ok(sc.id + ': věta není utržená (rozumná délka)', sentence.length > 120 && sentence.length < 400);
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
