#!/usr/bin/env node
/*
 * build-standalone.js — z lekce/reference udělá samostatnou stránku pro Artifact.
 *
 * Artifact na claude.ai má striktní CSP: blokuje externí <link> stylesheet i
 * <script src>. Musí to být jedna soběstačná stránka. Tenhle skript proto:
 *   1) vezme HTML lekce,
 *   2) vytáhne obsah <body>,
 *   3) inlinuje assets/styles.css do <style>,
 *   4) inlinuje assets/quiz.js do <script> (nahradí <script src=...>),
 *   5) zahodí <!DOCTYPE>/<html>/<head>/<body> obal (Artifact ho dodá sám).
 *
 * Použití:  node tools/build-standalone.js lessons/0004-....html
 * Výstup:   build/<stejny-nazev>.html   (připravené k publikaci jako Artifact)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const input = process.argv[2];
if (!input) {
  console.error('Použití: node tools/build-standalone.js <cesta-k-lekci.html>');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');           // node-backend/
const srcPath = path.resolve(process.cwd(), input);
const html = fs.readFileSync(srcPath, 'utf8');

// 1) obsah <body>
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) { console.error('Nenašel jsem <body>.'); process.exit(1); }
let body = bodyMatch[1];

// 2) pryč s odkazem na quiz.js (skript inlinujeme níž) a případnými prázdnými řádky
body = body.replace(/<script[^>]*src=["'][^"']*quiz\.js["'][^>]*>\s*<\/script>/i, '').trim();

// 3) inline assety
const css = fs.readFileSync(path.join(root, 'assets', 'styles.css'), 'utf8');
let quizJs = fs.readFileSync(path.join(root, 'assets', 'quiz.js'), 'utf8');

// DŮLEŽITÉ: když v inlinovaném JS je řetězec "</script>" (třeba v komentáři),
// HTML parser by na něm skript předčasně ukončil a zbytek vykreslil jako text.
// Zneškodníme ho na "<\/script>" — pro JS identické, pro HTML parser neviditelné.
quizJs = quizJs.replace(/<\/script/gi, '<\\/script');

// 4) sestav soběstačnou stránku (bez doctype/html/head/body — Artifact je obalí)
const out =
`<style>
${css}
</style>

${body}

<script>
${quizJs}
</script>
`;

const outDir = path.join(root, 'build');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, path.basename(srcPath));
fs.writeFileSync(outPath, out, 'utf8');
console.log('Hotovo →', path.relative(root, outPath));
