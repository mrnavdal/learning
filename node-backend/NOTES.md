# Notes

## Learner profile
- ~8 years Flutter/Dart experience. Strong on: async/await, OOP, HTTP clients (consuming APIs), app architecture, state management. Treat programming fundamentals as known.
- The gap is server-side, not programming.
- Started the Zero to Mastery Node.js course but dislikes video learning.

## Teaching preferences
- **No videos.** Prefers interactive lessons, questions, and quizzes.
- Wants to be quizzed on what they already know (diagnostic-driven).
- Tight feedback loops. Effortful retrieval over passive reading.
- **Language: Czech.** The user learns better in Czech — teach and converse in Czech. Keep technical terms, code, and API/HTTP keywords in English (industry standard), but explain in Czech. Lessons (HTML) should also be authored in Czech.

## Working notes
- 2026-07-03: Workspace initialized. Ran an initial diagnostic quiz to locate ZPD (awaiting answers).
- 2026-07-03: Lekce 0004 (REST — idempotence + status kódy + 409) dodána, + reference cheat sheet. Zavírá poslední REST mezeru z baseline. Další ZPD: databáze (Postgres/SQL) — perzistence + `pg` z Node.
- **Prostředí (remote web session): egress policy blokuje web fetch** (MDN/httpwg vrací 403 z proxy). Ne bug, ne obejít — je to network policy prostředí. Fix = povolit/rozšířit síťovou politiku při vytváření environmentu (docs: code.claude.com/docs → Claude Code on the web). Povolené jsou balíčkové registry (npm, pypi…) a anthropic.com.

## Hosting lekcí (jak si je uživatel prohlíží v browseru)
Uživatel je na telefonu, chce lekce otevírat v prohlížeči bez čekání na deploy.
Řešení: **Artifacty na claude.ai** (`claude.ai/code/artifact/...`) — okamžitá publikace, žádné CI.
- Build: `node tools/build-standalone.js lessons/000X-....html` → `build/` (inlinuje styles.css + quiz.js; escapuje `</script>`). Pak publikovat přes Artifact tool.
- POZOR: tenhle typ (code-artifact) se **neobjevuje** v „Artifacts" záložce běžné claude.ai appky — ta ukazuje jen chat-artifacty. Přístup přes URL / rozcestník.
- Křížové prokliky mezi lekcemi uvnitř artifactu nefungují (každý = vlastní URL) → řešeno rozcestníkem s absolutními URL.

**Publikované URL (aktualizovat při re-deploji / nové lekci — redeploy jde na stejnou URL při stejné file_path):**
- 📚 Rozcestník: https://claude.ai/code/artifact/b5de0f60-09c7-40f4-a8ea-9b5f5fdc091b
- L01: https://claude.ai/code/artifact/d28a136e-1c24-4d19-b4eb-87b4b7977907
- L02: https://claude.ai/code/artifact/2719a6e4-00dd-42d0-a152-6696a2375606
- L03: https://claude.ai/code/artifact/fe7b762f-6b8c-45b8-a66a-0a022b1d6e31
- L04: https://claude.ai/code/artifact/ea5fb376-d308-4a23-8bbc-b74edc44017b
