#!/usr/bin/env node
/* Test jádra rest-playground.js — ověří status kódy a hlavně idempotenci.
 * Spusť:  node tools/test-rest-playground.js
 */
'use strict';
const { handle, freshState } = require('../assets/rest-playground.js');

let pass = 0, fail = 0;
function eq(label, got, want) {
  const ok = got === want;
  console.log((ok ? '✓' : '✗') + ' ' + label + '  (got ' + got + ', want ' + want + ')');
  ok ? pass++ : fail++;
}

// GET
let s = freshState();
eq('GET /users → 200', handle(s, 'GET', '/users').status, 200);
eq('GET /users/1 → 200', handle(s, 'GET', '/users/1').status, 200);
eq('GET /users/999 → 404', handle(s, 'GET', '/users/999').status, 404);

// POST create + 409
s = freshState();
eq('POST nový → 201', handle(s, 'POST', '/users', { name: 'Lin', email: 'lin@x.cz' }).status, 201);
eq('POST duplicitní email → 409', handle(s, 'POST', '/users', { name: 'Lin', email: 'lin@x.cz' }).status, 409);
eq('POST bez emailu → 400', handle(s, 'POST', '/users', { name: 'X' }).status, 400);
eq('POST na /users/1 → 405', handle(s, 'POST', '/users/1', { email: 'a@b.cz' }).status, 405);

// POST NENÍ idempotentní: 2× jiný email → 2 přibydou
s = freshState();
const n0 = s.users.length;
handle(s, 'POST', '/users', { email: 'a@x.cz' });
handle(s, 'POST', '/users', { email: 'b@x.cz' });
eq('POST 2× (různý email) přidá 2 záznamy', s.users.length - n0, 2);

// PUT JE idempotentní: 2× stejné tělo → stav identický
s = freshState();
const r1 = handle(s, 'PUT', '/users/1', { name: 'Ada L.', email: 'ada@example.cz' });
const snap = JSON.stringify(s.users);
const r2 = handle(s, 'PUT', '/users/1', { name: 'Ada L.', email: 'ada@example.cz' });
eq('PUT existující → 200', r1.status, 200);
eq('PUT 2× → stav nezměněn (idempotence)', JSON.stringify(s.users), snap);
eq('PUT neexistující → 404', handle(s, 'PUT', '/users/999', { email: 'z@z.cz' }).status, 404);

// DELETE idempotentní: 204 pak 404, ale stav stejný ("pryč")
s = freshState();
eq('DELETE existující → 204', handle(s, 'DELETE', '/users/1').status, 204);
eq('DELETE stejné znovu → 404', handle(s, 'DELETE', '/users/1').status, 404);
eq('DELETE 2× → uživatel je pryč', s.users.some(u => u.id === 1), false);

// neznámá cesta
eq('GET /neco → 404', handle(freshState(), 'GET', '/neco').status, 404);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
