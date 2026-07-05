#!/usr/bin/env node
/* Test jádra nplus1-viz.js — ověří počty dotazů a stejnost výsledku.
 * Spusť:  node tools/test-nplus1-viz.js
 */
'use strict';
const { runStrategy, makePosts, AUTHORS } = require('../assets/nplus1-viz.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }

const posts5 = makePosts(5);

// počty dotazů
ok('N+1 s 5 posty → 6 dotazů (1+5)', runStrategy('nplus1', posts5, AUTHORS).queries.length === 6);
ok('JOIN → 1 dotaz', runStrategy('join', posts5, AUTHORS).queries.length === 1);
ok('Batch → 2 dotazy', runStrategy('batch', posts5, AUTHORS).queries.length === 2);

// škálování N+1
ok('N+1 s 20 posty → 21 dotazů', runStrategy('nplus1', makePosts(20), AUTHORS).queries.length === 21);
ok('JOIN s 20 posty → pořád 1', runStrategy('join', makePosts(20), AUTHORS).queries.length === 1);
ok('Batch s 20 posty → pořád 2', runStrategy('batch', makePosts(20), AUTHORS).queries.length === 2);

// výsledek je u všech strategií stejný
const a = runStrategy('nplus1', posts5, AUTHORS).rows;
const b = runStrategy('join', posts5, AUTHORS).rows;
const c = runStrategy('batch', posts5, AUTHORS).rows;
ok('N+1 a JOIN vrací stejná data', JSON.stringify(a) === JSON.stringify(b));
ok('JOIN a Batch vrací stejná data', JSON.stringify(b) === JSON.stringify(c));
ok('data mají správně přiřazené autory', a[0].author === 'Ada' && a[1].author === 'Bob');

// batch pošle jen unikátní author_id (3 autoři, i když 5 postů)
const bq = runStrategy('batch', posts5, AUTHORS).queries[1];
ok('batch IN(...) obsahuje unikátní id (1, 2, 3)', /IN \(1, 2, 3\)/.test(bq));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
