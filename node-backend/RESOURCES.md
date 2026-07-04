# Node.js Backend Resources

## Knowledge

- [Node.js docs: Overview of Blocking vs Non-Blocking](https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking)
  Official. The canonical mental model: JS is single-threaded, concurrency = the event loop running callbacks while I/O proceeds elsewhere. Use for: lesson 0001, anything about why Node scales.
- [Node.js docs: The Event Loop, Timers, and process.nextTick()](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
  Official. The phases of the event loop in detail. Use for: deeper dives on ordering/timers once the basics land.
- [Node.js docs: Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
  Official. Worker pool (libuv) vs event loop, which APIs use which, why blocking kills throughput. Use for: the thread-pool nuance, CPU-bound work.
- [MDN: The event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
  High-trust reference for the JS execution model (call stack, queue, run-to-completion). Use for: grounding the single-thread claim.
- [Node.js docs: Anatomy of an HTTP Transaction](https://nodejs.org/learn/http/anatomy-of-an-http-transaction)
  Official. The built-in `http` module: `createServer`, request/response objects, method/url, status/headers/body. Use for: lesson 0002, understanding what a raw server does before Express.
- [Node.js API: HTTP](https://nodejs.org/api/http.html)
  Official API reference for `http`. Use for: exact signatures of `res.writeHead`, `res.end`, request properties.

- [Express docs: Hello World / Routing / Using middleware](https://expressjs.com/en/starter/hello-world.html)
  Official Express 5.x. `app.get/post/put/delete`, `req.params`, `res.status().json()`, middleware `(req, res, next)`, `express.json()`. Use for: lesson 0003 and all Express work.

- [MDN: HTTP methods / status codes / Idempotent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
  High-trust. Safe/idempotent methods, status-code classes, 201/204/409. Norma je RFC 9110. Use for: lesson 0004, REST semantics.
- [node-postgres (`pg`) docs](https://node-postgres.com/features/queries)
  Official. `Pool`, `pool.query(text, values)`, `.rows`, parametrizace `$1`. Use for: lesson 0005, all DB access from Node.
- [OWASP: SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
  High-trust security reference. Parameterized queries as the primary defense. Use for: lesson 0005, anything security/injection.
- [PostgreSQL: Error Codes](https://www.postgresql.org/docs/current/errcodes-appendix.html)
  Official. `23505 = unique_violation` (→ map to HTTP 409) etc. Use for: mapping DB errors to status codes.

## Wisdom (Communities)

- [r/node](https://www.reddit.com/r/node/)
  Active Node.js subreddit. Use for: architecture questions, "is this idiomatic", career/hiring threads.
- [Node.js Discord](https://nodejs.org/en/get-involved/community) — official community hub.
  Use for: real-time help, unblocking.

## Gaps

- Not yet sourced: auth (JWT/sessions, password hashing — bcrypt/argon2), testing, deployment/containerization. Fill as those lessons come up.
- Note: web fetch je v remote session blokovaný egress policy (403), takže tyhle odkazy nešly živě ověřit — jsou to kanonické URL. Až fetch půjde, projít a doplnit anotace.
