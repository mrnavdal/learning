#!/usr/bin/env node
/* Test jádra sql-injection.js — ověří, že concat je zranitelný a param bezpečný.
 * Spusť:  node tools/test-sql-injection.js
 */
'use strict';
const { runLogin, evalWhere, demoTable } = require('../assets/sql-injection.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }

const T = demoTable();
const INJ = "' OR '1'='1' --";

// --- WHERE evaluátor ---
ok('evalWhere: admin řádek, správné heslo', evalWhere("username = 'admin' AND password = 's3cret'", T[0]) === true);
ok('evalWhere: admin řádek, špatné heslo', evalWhere("username = 'admin' AND password = 'x'", T[0]) === false);
ok('evalWhere: tautologie \' OR \'1\'=\'1', evalWhere("username = '' OR '1'='1'", T[0]) === true);

// --- concat režim: zranitelný ---
ok('concat: správné přihlášení projde', runLogin('concat', 'admin', 's3cret', T).length === 1);
ok('concat: špatné heslo neprojde', runLogin('concat', 'admin', 'spatne', T).length === 0);
const cInj = runLogin('concat', INJ, '', T);
ok('concat: injection VRÁTÍ řádky (zranitelné)', cInj.length > 0);
ok('concat: injection vrátí admina', cInj.some(r => r.username === 'admin'));

// --- param režim: bezpečný ---
ok('param: správné přihlášení projde', runLogin('param', 'admin', 's3cret', T).length === 1);
ok('param: injection NEVRÁTÍ nic (bezpečné)', runLogin('param', INJ, '', T).length === 0);
ok('param: injection jako username = doslovný string', runLogin('param', INJ, 's3cret', T).length === 0);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
