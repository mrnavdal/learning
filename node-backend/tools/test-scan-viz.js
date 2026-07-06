#!/usr/bin/env node
/* Test jádra scan-viz.js — ověří seq vs index a kdy index nepomůže.
 * Spusť:  node tools/test-scan-viz.js
 */
'use strict';
const { rowsTouched, indexCost, indexUsable } = require('../assets/scan-viz.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }

// bez indexu = seq scan = N (u všech typů)
ok('bez indexu, eq → N', rowsTouched('eq', false, 1000000) === 1000000);
ok('bez indexu, prefix → N', rowsTouched('prefix', false, 1000) === 1000);

// s indexem: eq a prefix jsou logaritmické
ok('index, eq, 1M → ~20 (log2)', rowsTouched('eq', true, 1000000) === 20);
ok('index, eq, 1M je mnohem míň než N', rowsTouched('eq', true, 1000000) < 1000);
ok('index, prefix → taky logaritmické', rowsTouched('prefix', true, 1000000) === 20);

// leading wildcard: index nepomůže → seq scan i s indexem
ok('index, suffix (LIKE %x) → pořád N', rowsTouched('suffix', true, 1000000) === 1000000);
ok('indexUsable suffix = false', indexUsable('suffix') === false);
ok('indexUsable eq = true', indexUsable('eq') === true);

// index roste logaritmicky: 10× víc řádků ≈ +3 kroky (log2 10 ≈ 3.3)
const a = indexCost(1000), b = indexCost(1000000);   // 1000× víc řádků
ok('index roste log: 1000× řádků → jen ~2× kroků', b < a * 3 && b > a);

// monotonie: víc řádků → seq roste lineárně
ok('seq scan roste lineárně s N', rowsTouched('eq', false, 2000) === 2 * rowsTouched('eq', false, 1000));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
