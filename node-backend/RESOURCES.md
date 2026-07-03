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

## Wisdom (Communities)

- [r/node](https://www.reddit.com/r/node/)
  Active Node.js subreddit. Use for: architecture questions, "is this idiomatic", career/hiring threads.
- [Node.js Discord](https://nodejs.org/en/get-involved/community) — official community hub.
  Use for: real-time help, unblocking.

## Gaps

- Not yet sourced: Express/routing, REST design, SQL/Postgres, auth (JWT/sessions), testing, deployment. Fill as those lessons come up.
