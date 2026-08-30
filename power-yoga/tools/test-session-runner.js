#!/usr/bin/env node
/* Test jádra session-runner.js — časová osa praxe, hledání aktuálního kroku, formát času.
 * Spusť:  node tools/test-session-runner.js
 */
'use strict';
const { buildTimeline, stepAt, formatClock, DEFAULT_SEC_PER_BREATH } = require('../assets/session-runner.js');

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

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
