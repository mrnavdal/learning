# Mylná představa: Node = víc vláken + load balancing

V diagnostice uživatel na otázku „jak Node zvládne tisíce požadavků" odpověděl „má víc vláken a load balancing, každý požadavek si vezme volné vlákno" — klasický thread-per-request model (Java/PHP), který u Node **neplatí**.

Proč to je důležité: z runtime modelu plyne skoro všechno ostatní v Node (proč `async/await`, proč neblokovat CPU v hlavním vlákně, kde Node exceluje). Proto je to první lekce ([[lessons/0001]]) — oprava mýtu navázaná na jeho znalost Dart event loopu.

**Status:** Lekce 0001 dodána (blokující vs. neblokující, event loop, libuv thread pool). **Zatím bez důkazu osvojení** — čeká se, jak dopadne kvíz v lekci a follow-up. Až potvrdí porozumění (např. správně zdůvodní, proč `pbkdf2Sync` blokuje), založit navazující LR, který tenhle povýší z „mýtus" na „opraveno".
