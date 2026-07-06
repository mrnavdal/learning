#!/usr/bin/env node
/* Test jádra race-sim.js — ověří lost update i jeho opravy.
 * Spusť:  node tools/test-race-sim.js
 */
'use strict';
const { simulate } = require('../assets/race-sim.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }

const INIT = 100, AMT = 30, EXPECTED = 40;

// naivně → lost update
const naive = simulate('naive', INIT, AMT);
ok('naive: konečný zůstatek = 70 (jeden odečet ztracen)', naive.final === 70);
ok('naive: NENÍ správně', naive.correct === false);
ok('naive: expected je 40', naive.expected === EXPECTED);
ok('naive: oba čtou stejnou hodnotu 100', naive.steps[0].read === 100 && naive.steps[1].read === 100);

// atomický UPDATE → správně
const atomic = simulate('atomic', INIT, AMT);
ok('atomic: konečný zůstatek = 40', atomic.final === 40);
ok('atomic: je správně', atomic.correct === true);
ok('atomic: dva kroky (dva UPDATE)', atomic.steps.length === 2);

// SELECT FOR UPDATE → správně, T2 čeká
const lock = simulate('lock', INIT, AMT);
ok('lock: konečný zůstatek = 40', lock.final === 40);
ok('lock: je správně', lock.correct === true);
ok('lock: T2 je někde zablokovaný (čeká na zámek)', lock.steps.some(s => s.blocked));
ok('lock: T2 po odblokování čte 70, ne 100', lock.steps.some(s => s.tx === 'T2' && s.read === 70));

// robustnost: jiné hodnoty
const big = simulate('atomic', 1000, 250);
ok('atomic s jinými čísly: 1000 − 2×250 = 500', big.final === 500 && big.correct);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
