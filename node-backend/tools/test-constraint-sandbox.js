#!/usr/bin/env node
/* Test jádra constraint-sandbox.js — ověří vynucení každého constraintu + PG kódy.
 * Spusť:  node tools/test-constraint-sandbox.js
 */
'use strict';
const { validateInsert } = require('../assets/constraint-sandbox.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }

const rows = [{ id: 1, email: 'ada@example.cz', age: 36, country_id: 1 }];

// platný insert
let r = validateInsert(rows, { email: 'grace@x.cz', age: '29', country_id: '2' });
ok('platný řádek → ok', r.ok === true);

// NOT NULL
r = validateInsert(rows, { email: '', age: '29', country_id: '1' });
ok('prázdný email → not_null / 23502 / 400', !r.ok && r.violation.code === '23502' && r.violation.http === 400);

// UNIQUE
r = validateInsert(rows, { email: 'ada@example.cz', age: '20', country_id: '1' });
ok('duplicitní email → unique / 23505 / 409', !r.ok && r.violation.code === '23505' && r.violation.http === 409);

// CHECK
r = validateInsert(rows, { email: 'x@y.cz', age: '-5', country_id: '1' });
ok('záporný věk → check / 23514 / 422', !r.ok && r.violation.code === '23514' && r.violation.http === 422);

// FOREIGN KEY
r = validateInsert(rows, { email: 'x@y.cz', age: '20', country_id: '99' });
ok('neexistující země → fk / 23503 / 409', !r.ok && r.violation.code === '23503' && r.violation.http === 409);

// TYPE
r = validateInsert(rows, { email: 'x@y.cz', age: 'abc', country_id: '1' });
ok('nečíselný věk → type / 22P02 / 400', !r.ok && r.violation.code === '22P02' && r.violation.http === 400);

// nullable pole smí být prázdné
r = validateInsert(rows, { email: 'ok@x.cz', age: '', country_id: '' });
ok('prázdné nullable (age, country_id) → ok', r.ok === true);

// pořadí: NOT NULL se hlásí dřív než UNIQUE (email prázdný a zároveň by byl unikátní problém)
r = validateInsert(rows, { email: '', age: '-5', country_id: '99' });
ok('víc porušení naráz → hlásí první (not_null)', !r.ok && r.violation.kind === 'not_null');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
