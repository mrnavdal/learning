#!/usr/bin/env node
/* Test jádra funnel-lab.js.
 * Spusť:  node tools/test-funnel-lab.js
 */
'use strict';
const { SCENARIOS, analyze, verdict } = require('../assets/funnel-lab.js');

let pass = 0, fail = 0;
function ok(label, cond) { console.log((cond ? '✓' : '✗') + ' ' + label); cond ? pass++ : fail++; }

const pred = SCENARIOS.find(s => s.id === 'pred');
const po = SCENARIOS.find(s => s.id === 'po');
const all = steps => steps.map(() => true);

// --- struktura ---
ok('oba scénáře mají stejné kroky ve stejném pořadí',
   pred.steps.map(s => s.key).join('>') === po.steps.map(s => s.key).join('>'));
ok('trychtýř je monotónní — nikde nepřibude víc lidí, než bylo v kroku před tím',
   SCENARIOS.every(sc => sc.steps.every((s, i) => i === 0 || s.count <= sc.steps[i - 1].count)));

// --- jmenovatel a zamčené kroky ---
const r0 = analyze(po.steps, po.steps.map(() => false));
ok('krok 0 je měřený vždy — je to jmenovatel', r0.rows[0].measured === true);
ok('když neměříš nic dalšího, není žádný úsek', r0.spans.length === 0);
ok('a verdikt na to upozorní', verdict(r0).tone === 'warn' && /návštěvnost/.test(verdict(r0).text));

const rPred = analyze(pred.steps, all(pred.steps));
ok('neměřitelný krok nejde zapnout, ani když o to požádáš',
   rPred.rows.find(r => r.key === 'pay').measured === false);

// --- PŘED: největší ztráta leží ve slepém místě (to je celá pointa) ---
ok('PŘED: největší ztráta je ve slepém místě', rPred.blindWorst === true);
const spPred = rPred.spans[rPred.worst];
ok('PŘED: slepý úsek jde od kliknutí na rezervovat k příchodu',
   spPred.fromLabel.includes('rezervovat') && spPred.toLabel.includes('Dorazí'));
ok('PŘED: v úseku je schovaný právě krok Zaplatí',
   spPred.hidden === 1 && spPred.hiddenLabels[0] === 'Zaplatí');
ok('PŘED: verdikt varuje', verdict(rPred).tone === 'warn');

// --- PO: vše měřeno, ztráta je lokalizovaná ---
const rPo = analyze(po.steps, all(po.steps));
ok('PO: žádné slepé místo', rPo.spans.every(s => s.hidden === 0));
ok('PO: každý krok má svůj úsek', rPo.spans.length === po.steps.length - 1);
ok('PO: verdikt je konstruktivní', verdict(rPo).tone === 'good');

// --- klíčové ponaučení: největší ABSOLUTNÍ ztráta ≠ nejhorší procento ---
const worstAbs = rPo.spans[rPo.worst];
const worstPct = rPo.spans.reduce((a, b) => (b.dropPct > a.dropPct ? b : a));
ok('PO: nejhorší procento je jinde než největší absolutní ztráta (jinak komponent nic neučí)',
   worstAbs !== worstPct);
ok('PO: verdikt ukazuje na absolutní ztrátu, ne na procento',
   verdict(rPo).text.includes('−' + worstAbs.loss));

// --- vypnutí eventu vyrobí slepé místo ---
const m = all(po.steps); m[2] = false;   // „Otevře detail nabídky“
const rBlind = analyze(po.steps, m);
ok('vypnutý event sloučí dva kroky do jednoho úseku',
   rBlind.spans.some(s => s.hidden === 1 && s.hiddenLabels[0] === 'Otevře detail nabídky'));
ok('a slepý úsek se stane tím největším (ztráty se sečtou)', rBlind.blindWorst === true);
ok('ztráta slepého úseku = součet ztrát kroků, které skryl',
   rBlind.spans[rBlind.worst].loss === 900 - 430);
ok('verdikt jmenuje, který krok chybí', verdict(rBlind).text.includes('Otevře detail nabídky'));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
