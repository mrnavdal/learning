#!/usr/bin/env node
/* Test jádra session-runner.js — časová osa praxe, hledání aktuálního kroku, formát času.
 * Spusť:  node tools/test-session-runner.js
 */
'use strict';
const { buildTimeline, stepAt, formatClock, filterSteps, countdownCue, remainingFrom,
        DEFAULT_SEC_PER_BREATH, DEFAULT_LEAD } = require('../assets/session-runner.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }

const steps = [
  { name: 'Usazení', breaths: 10, block: 'Usazení' },   // 10 × 8 = 80 s
  { name: 'Cat-Cow', breaths: 8, block: 'Rozehřátí' },  //  8 × 8 = 64 s
  { name: 'Prkno', sec: 30, block: 'Hlavní část' }      //          30 s
];

// --- stavba časové osy ---
const tl = buildTimeline(steps);
ok('výchozí tempo je 8 s na dech', DEFAULT_SEC_PER_BREATH === 8);
ok('dechy se přepočtou na sekundy', tl.items[0].sec === 80 && tl.items[1].sec === 64);
ok('`sec` má přednost před přepočtem', tl.items[2].sec === 30);
ok('celkový čas je součet kroků', tl.total === 80 + 64 + 30);
ok('kroky navazují bez děr', tl.items[0].end === tl.items[1].start && tl.items[1].end === tl.items[2].start);
ok('první krok začíná v nule', tl.items[0].start === 0);
ok('poslední krok končí na celkovém čase', tl.items[2].end === tl.total);

// vlastní tempo praxe
const slow = buildTimeline(steps, 10);
ok('vlastní tempo 10 s/dech prodlouží dechové kroky', slow.items[0].sec === 100 && slow.items[1].sec === 80);
ok('krok se zadaným `sec` tempo neovlivní', slow.items[2].sec === 30);

// --- kde jsme v praxi ---
ok('v čase 0 běží první krok', stepAt(tl, 0).index === 0 && stepAt(tl, 0).item.name === 'Usazení');
ok('v čase 79 pořád první krok', stepAt(tl, 79).index === 0);
ok('v čase 80 se překlopí na druhý', stepAt(tl, 80).index === 1 && stepAt(tl, 80).item.name === 'Cat-Cow');
ok('v čase 150 běží třetí krok', stepAt(tl, 150).index === 2 && stepAt(tl, 150).item.name === 'Prkno');
ok('odpočet kroku sedí', stepAt(tl, 10).remaining === 70 && stepAt(tl, 100).remaining === 44);

// hranice
ok('na konci praxe je done', stepAt(tl, tl.total).done === true && stepAt(tl, tl.total).item === null);
ok('za koncem praxe je pořád done', stepAt(tl, tl.total + 999).done === true);
ok('těsně před koncem done ještě není', stepAt(tl, tl.total - 0.5).done === false);
ok('záporný čas se ošetří jako 0', stepAt(tl, -50).index === 0);

// každý okamžik praxe patří právě jednomu kroku
let covered = true;
for (let t = 0; t < tl.total; t += 0.5) {
  const st = stepAt(tl, t);
  if (st.done || t < st.item.start || t >= st.item.end) covered = false;
}
ok('každý okamžik praxe patří právě jednomu kroku', covered);

// --- prázdné a mezní vstupy ---
const empty = buildTimeline([]);
ok('prázdná praxe má nulový čas', empty.total === 0 && empty.items.length === 0);
ok('prázdná praxe je rovnou done', stepAt(empty, 0).done === true);
ok('krok bez délky dostane aspoň 1 s', buildTimeline([{ name: 'x', sec: 0 }]).items[0].sec === 1);

// --- formát času ---
ok('formatClock(0) = 0:00', formatClock(0) === '0:00');
ok('formatClock(9) = 0:09', formatClock(9) === '0:09');
ok('formatClock(65) = 1:05', formatClock(65) === '1:05');
ok('formatClock(600) = 10:00', formatClock(600) === '10:00');
ok('formatClock zaokrouhluje nahoru', formatClock(59.2) === '1:00');
ok('formatClock nejde do záporu', formatClock(-5) === '0:00');

// --- varianty délky praxe (rampa 25/30/35) ---
const tiered = [
  { name: 'Usazení', sec: 60 },                 // jádro — v každé variantě
  { name: 'Cat-Cow', sec: 60 },                 // jádro
  { name: 'Postoje navíc', sec: 300, tier: 30 },
  { name: 'Zem navíc', sec: 300, tier: 35 },
  { name: 'Savasana', sec: 120 }                // jádro
];
ok('varianta 25 obsahuje jen jádro', filterSteps(tiered, 25).length === 3);
ok('varianta 30 přidá krok s tier 30', filterSteps(tiered, 30).length === 4);
ok('varianta 35 obsahuje všechno', filterSteps(tiered, 35).length === 5);
ok('varianty jsou vnořené (delší obsahuje kratší)',
  filterSteps(tiered, 25).every(s => filterSteps(tiered, 30).indexOf(s) !== -1) &&
  filterSteps(tiered, 30).every(s => filterSteps(tiered, 35).indexOf(s) !== -1));
ok('delší varianta je fakt delší',
  buildTimeline(filterSteps(tiered, 25)).total < buildTimeline(filterSteps(tiered, 30)).total &&
  buildTimeline(filterSteps(tiered, 30)).total < buildTimeline(filterSteps(tiered, 35)).total);
ok('jádro zůstává v každé variantě (končí savasanou)',
  [25, 30, 35].every(m => filterSteps(tiered, m).slice(-1)[0].name === 'Savasana'));
ok('filtr nemodifikuje původní seznam', tiered.length === 5);
ok('kroky bez tier projdou i při nulové délce', filterSteps(tiered, 0).length === 3);

// --- zvukový odpočet ---
ok('výchozí odpočet jsou 3 vteřiny', DEFAULT_LEAD === 3);
ok('pípne na 3. vteřině do konce', countdownCue(3.05, 2.95, 3) === 'tick');
ok('pípne na 2. vteřině', countdownCue(2.05, 1.95, 3) === 'tick');
ok('pípne na 1. vteřině', countdownCue(1.05, 0.95, 3) === 'tick');
ok('mlčí dřív než 3 vteřiny do konce', countdownCue(4.05, 3.95, 3) === null);
ok('mlčí uprostřed kroku', countdownCue(20.1, 20.0, 3) === null);
ok('na konci kroku zahraje end', countdownCue(0.05, -0.05, 3) === 'end');
ok('end zazní jen jednou', countdownCue(-0.05, -0.15, 3) === null);
ok('nepípne dvakrát ve stejné vteřině', countdownCue(2.9, 2.85, 3) === null);
ok('delší odpočet lze nastavit', countdownCue(5.05, 4.95, 5) === 'tick' && countdownCue(5.05, 4.95, 3) === null);
ok('odpočet 0 nepípá vůbec', countdownCue(1.05, 0.95, 0) === null);
// každá vteřina odpočtu pípne právě jednou (simulace 100ms ticků)
(function () {
  let prev = 10, ticks = 0, ends = 0;
  for (let t = 0.1; t <= 10.5; t += 0.1) {
    const nowR = 10 - t;
    const c = countdownCue(prev, nowR, 3);
    if (c === 'tick') ticks++;
    if (c === 'end') ends++;
    prev = nowR;
  }
  ok('přes celý krok pípne přesně 3× + 1 konec', ticks === 3 && ends === 1);
})();

// --- zbývající čas praxe od daného kroku ---
ok('od začátku zbývá celá praxe', remainingFrom(tl, 0, 0) === tl.total);
ok('odečte odcvičené v aktuálním kroku', remainingFrom(tl, 0, 30) === tl.total - 30);
ok('od druhého kroku chybí první', remainingFrom(tl, 1, 0) === tl.total - 80);
ok('v posledním kroku zbývá jen on', remainingFrom(tl, 2, 0) === 30);
ok('za koncem praxe zbývá 0', remainingFrom(tl, tl.items.length, 0) === 0);
ok('nikdy nejde do záporu', remainingFrom(tl, 2, 999) === 0);

// --- přechody se propisují do časové osy ---
const withTrans = buildTimeline([
  { name: 'A', sec: 10, transition: 'Z lehu se posaď.' },
  { name: 'B', sec: 10 }
]);
ok('transition se přenese na položku', withTrans.items[0].transition === 'Z lehu se posaď.');
ok('chybějící transition je prázdný řetězec', withTrans.items[1].transition === '');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
