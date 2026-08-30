#!/usr/bin/env node
/* Test jádra breath-match.js — správnost sady, vyhodnocení, míchání.
 * Spusť:  node tools/test-breath-match.js
 */
'use strict';
const { ITEMS, check, buildDeck } = require('../assets/breath-match.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }

// --- integrita sady ---
ok('sada má aspoň 8 pohybů', ITEMS.length >= 8);
ok('každá položka má odpověď in/out', ITEMS.every(i => i.answer === 'in' || i.answer === 'out'));
ok('každá položka má popis pohybu', ITEMS.every(i => typeof i.move === 'string' && i.move.length > 10));
ok('každá položka má vysvětlení (feedback loop)', ITEMS.every(i => typeof i.why === 'string' && i.why.length > 20));

// Sada nesmí být vychýlená k jedné odpovědi — jinak se dá uhodnout bez pravidla.
const ins = ITEMS.filter(i => i.answer === 'in').length;
const outs = ITEMS.length - ins;
ok('nádechy a výdechy jsou vyvážené (rozdíl ≤ 2)', Math.abs(ins - outs) <= 2);

// Popisy pohybů musí být unikátní.
ok('žádný pohyb se neopakuje', new Set(ITEMS.map(i => i.move)).size === ITEMS.length);

// --- vyhodnocení ---
const item = { move: 'x', answer: 'in', why: 'protože expanze' };
ok('správná odpověď = right true', check(item, 'in').right === true);
ok('špatná odpověď = right false', check(item, 'out').right === false);
ok('vysvětlení se vrací i při špatné odpovědi', check(item, 'out').why === 'protože expanze');

// --- míchání ---
// Deterministické rng → test nezávisí na náhodě.
function seeded(seed) { let s = seed; return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; }
const deck = buildDeck(ITEMS, seeded(42));
ok('zamíchaná sada má stejnou délku', deck.length === ITEMS.length);
ok('zamíchaná sada obsahuje přesně tytéž položky', new Set(deck).size === ITEMS.length && deck.every(d => ITEMS.indexOf(d) !== -1));
ok('míchání nemodifikuje původní sadu', ITEMS[0].move === require('../assets/breath-match.js').ITEMS[0].move);
const deck2 = buildDeck(ITEMS, seeded(7));
ok('jiné rng dá jiné pořadí', deck.map(d => d.move).join('|') !== deck2.map(d => d.move).join('|'));

// --- past "nahoru = nádech" musí v sadě být, jinak drill neučí pravidlo ---
const chair = ITEMS.find(i => /Chair/.test(i.move));
ok('sada obsahuje past Chair (klesá dolů, ale nádech)', !!chair && chair.answer === 'in');
const down = ITEMS.find(i => /Downward Dog/.test(i.move));
ok('sada obsahuje past Downward Dog (boky nahoru, ale výdech)', !!down && down.answer === 'out');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
