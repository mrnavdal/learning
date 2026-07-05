#!/usr/bin/env node
/* Test jádra migration-runner.js — ověří naivní pád i bezpečný postup.
 * Spusť:  node tools/test-migration-runner.js
 */
'use strict';
const { applyMigration, freshState } = require('../assets/migration-runner.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }

// naivní NOT NULL na plné tabulce → selže
let s = freshState();
let r = applyMigration(s, { name: 'm', op: 'addColumnNotNull', column: 'phone' });
ok('naivní ADD NOT NULL na 3 řádcích → selže', r.ok === false);
ok('po selhání se sloupec NEpřidal', s.columns.every(c => c.name !== 'phone'));

// naivní NOT NULL na PRÁZDNÉ tabulce → projde
s = freshState(); s.rows = [];
r = applyMigration(s, { name: 'm', op: 'addColumnNotNull', column: 'phone' });
ok('ADD NOT NULL na prázdné tabulce → projde', r.ok === true);

// bezpečný postup: nullable → backfill → SET NOT NULL
s = freshState();
ok('krok 1 add nullable → ok', applyMigration(s, { name: 'a', op: 'addColumn', column: 'phone' }).ok === true);
ok('po addColumn mají řádky NULL', s.rows.every(row => row.phone === null));
ok('SET NOT NULL PŘED backfillem → selže (jsou NULL)', applyMigration(s, { name: 'b', op: 'setNotNull', column: 'phone' }).ok === false);
ok('krok 2 backfill → ok', applyMigration(s, { name: 'c', op: 'backfill', column: 'phone', value: '—' }).ok === true);
ok('krok 3 SET NOT NULL po backfillu → ok', applyMigration(s, { name: 'd', op: 'setNotNull', column: 'phone' }).ok === true);
ok('sloupec phone je teď NOT NULL', s.columns.find(c => c.name === 'phone').notNull === true);

// applied historie roste
ok('applied obsahuje počáteční + 3 kroky', s.applied.length === 4);

// UNIQUE na sloupci s duplicitami → selže
s = freshState();
applyMigration(s, { name: 'a', op: 'addColumn', column: 'tier' });
applyMigration(s, { name: 'b', op: 'backfill', column: 'tier', value: 'free' });
ok('ADD UNIQUE na duplicitách → selže', applyMigration(s, { name: 'c', op: 'addUnique', column: 'tier' }).ok === false);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
