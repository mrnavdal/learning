#!/usr/bin/env node
/* Test jádra breath-pacer.js — fáze dechu, zbývající čas, počítání kol, velikost koule.
 * Spusť:  node tools/test-breath-pacer.js
 */
'use strict';
const { phaseAt, scaleFor, MIN_SCALE, MAX_SCALE } = require('../assets/breath-pacer.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }
function near(a, b) { return Math.abs(a - b) < 1e-6; }

// --- fáze v cyklu 5 s nádech / 5 s výdech ---
ok('start = nádech na začátku', phaseAt(0, 5, 5).phase === 'in' && near(phaseAt(0, 5, 5).progress, 0));
ok('2,5 s = půlka nádechu', phaseAt(2500, 5, 5).phase === 'in' && near(phaseAt(2500, 5, 5).progress, 0.5));
ok('přesně 5 s = překlopení do výdechu', phaseAt(5000, 5, 5).phase === 'out' && near(phaseAt(5000, 5, 5).progress, 0));
ok('7,5 s = půlka výdechu', phaseAt(7500, 5, 5).phase === 'out' && near(phaseAt(7500, 5, 5).progress, 0.5));

// --- počítání dokončených kol ---
ok('před koncem 1. cyklu = 0 kol', phaseAt(9999, 5, 5).round === 0);
ok('po 10 s = 1 kolo hotové', phaseAt(10000, 5, 5).round === 1);
ok('po 80 s = 8 kol (cíl lekce splněn)', phaseAt(80000, 5, 5).round === 8);

// --- zbývající čas (to, co vidí uživatel jako odpočet) ---
ok('na začátku zbývá 5 s nádechu', near(phaseAt(0, 5, 5).remaining, 5));
ok('v 1 s zbývají 4 s nádechu', near(phaseAt(1000, 5, 5).remaining, 4));
ok('v 6 s zbývají 4 s výdechu', near(phaseAt(6000, 5, 5).remaining, 4));

// --- nesymetrické tempo (delší výdech — použije se v pozdějších lekcích) ---
const asym = phaseAt(5000, 4, 6);
ok('tempo 4/6: v 5. s už je výdech', asym.phase === 'out' && near(asym.progress, 1 / 6));
ok('tempo 4/6: kolo trvá 10 s', phaseAt(10000, 4, 6).round === 1);

// --- záporný / nulový čas nespadne ---
ok('záporný elapsed se ošetří jako 0', phaseAt(-500, 5, 5).phase === 'in' && phaseAt(-500, 5, 5).round === 0);

// --- velikost koule: nádech roste, výdech klesá, nikdy mimo rozsah ---
ok('koule na začátku nádechu = minimum', near(scaleFor(phaseAt(0, 5, 5)), MIN_SCALE));
ok('koule na konci nádechu = maximum', near(scaleFor(phaseAt(4999.9999, 5, 5)), MAX_SCALE) || scaleFor(phaseAt(4999.9999, 5, 5)) > MAX_SCALE - 1e-4);
ok('koule na začátku výdechu = maximum', near(scaleFor(phaseAt(5000, 5, 5)), MAX_SCALE));
let monotone = true, prev = -1;
for (let t = 0; t < 5000; t += 100) { const s = scaleFor(phaseAt(t, 5, 5)); if (s < prev) monotone = false; prev = s; }
ok('během nádechu koule jen roste', monotone);
let shrinks = true; prev = 99;
for (let t = 5000; t < 10000; t += 100) { const s = scaleFor(phaseAt(t, 5, 5)); if (s > prev) shrinks = false; prev = s; }
ok('během výdechu koule jen klesá', shrinks);
let inRange = true;
for (let t = 0; t < 30000; t += 37) { const s = scaleFor(phaseAt(t, 4, 4)); if (s < MIN_SCALE - 1e-9 || s > MAX_SCALE + 1e-9) inRange = false; }
ok('koule nikdy nevyjede z rozsahu', inRange);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
