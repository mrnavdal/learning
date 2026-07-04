/* rest-playground.js — interaktivní REST API simulátor (komponent pro lekce).
 *
 * Mini API s pamětí (in-memory /users). Uživatel "posílá" requesty a živě vidí
 * status kód, tělo odpovědi a jak se mění stav serveru. Účel: osahat si na
 * vlastní kůži idempotenci a status kódy z lekce 04.
 *
 * Použití v lekci:
 *   <div class="rest-playground"></div>
 *   <script src="../assets/rest-playground.js"></script>
 *
 * Jádro handle() je čistá funkce (stav in → {status, body, note} out), takže
 * jde otestovat v Node bez prohlížeče (viz tools/test-rest-playground.js).
 */
(function () {
  'use strict';

  // ---- Čisté jádro: zpracuj request proti stavu, vrať odpověď ----
  function handle(state, method, path, body) {
    var parts = String(path).replace(/^\/+|\/+$/g, '').split('/'); // ['users'] | ['users','42']
    if (parts[0] !== 'users') {
      return { status: 404, body: { error: 'Neznámá cesta' }, note: 'Žádná route nesedí → Express vrací 404.' };
    }
    var hasId = parts.length > 1 && parts[1] !== '';
    var id = hasId ? parseInt(parts[1], 10) : null;

    if (method === 'GET') {
      if (!hasId) return { status: 200, body: state.users, note: 'GET kolekce → 200 + seznam. Safe i idempotentní.' };
      var u = find(state, id);
      return u ? { status: 200, body: u, note: 'GET položky → 200.' }
               : { status: 404, body: { error: 'Uživatel nenalezen' }, note: 'ID neexistuje → 404.' };
    }

    if (method === 'POST') {
      if (hasId) return { status: 405, body: { error: 'POST míří na kolekci /users' }, note: 'POST jde na kolekci, ne na /users/:id.' };
      if (!body || !body.email) return { status: 400, body: { error: 'Chybí email' }, note: 'Nevalidní vstup → 400 (chyba klienta).' };
      if (state.users.some(function (x) { return x.email === body.email; }))
        return { status: 409, body: { error: 'E-mail už je zaregistrovaný' }, note: '⚠ Vstup je OK, ale koliduje se stavem serveru → 409 (ne 400, ne 500).' };
      var created = { id: state.nextId++, name: body.name || '', email: body.email };
      state.users.push(created);
      return { status: 201, body: created, note: 'Vytvořen nový zdroj → 201. POST NENÍ idempotentní — pošli znovu a přibude duplikát.' };
    }

    if (method === 'PUT') {
      if (!hasId) return { status: 405, body: { error: 'PUT míří na /users/:id' }, note: 'PUT jde na konkrétní URI, ne na kolekci.' };
      if (!body || !body.email) return { status: 400, body: { error: 'Chybí email' }, note: 'Nevalidní vstup → 400.' };
      var idx = state.users.findIndex(function (x) { return x.id === id; });
      if (idx === -1) return { status: 404, body: { error: 'Uživatel nenalezen' }, note: 'Není co nahradit → 404.' };
      state.users[idx] = { id: id, name: body.name || '', email: body.email };
      return { status: 200, body: state.users[idx], note: 'Nahrazeno → 200. PUT JE idempotentní — stejné tělo znovu = stejný stav.' };
    }

    if (method === 'DELETE') {
      if (!hasId) return { status: 405, body: { error: 'DELETE míří na /users/:id' }, note: 'DELETE jde na konkrétní URI.' };
      var before = state.users.length;
      state.users = state.users.filter(function (x) { return x.id !== id; });
      if (state.users.length < before) return { status: 204, body: null, note: 'Smazáno → 204 (bez těla).' };
      return { status: 404, body: { error: 'Uživatel nenalezen' }, note: 'Už neexistuje → 404. Ale DELETE je idempotentní: stav je pořád „pryč".' };
    }

    return { status: 405, body: { error: 'Nepodporovaná metoda' }, note: '' };
  }

  function find(state, id) { return state.users.find(function (x) { return x.id === id; }); }
  function freshState() { return { users: [{ id: 1, name: 'Ada', email: 'ada@example.cz' }], nextId: 2 }; }

  // Export pro Node test; v prohlížeči pokračuj k DOM widgetu.
  if (typeof module !== 'undefined' && module.exports) module.exports = { handle: handle, freshState: freshState };
  if (typeof document === 'undefined') return;

  // ---- DOM widget ----
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function statusKind(s) { return s >= 200 && s < 300 ? 'ok' : (s >= 400 && s < 500 ? 'warn' : 'err'); }

  function build(root) {
    var state = freshState();

    // --- ovládání ---
    var method = el('select', 'rp-select');
    ['GET', 'POST', 'PUT', 'DELETE'].forEach(function (m) {
      var o = document.createElement('option'); o.value = m; o.textContent = m; method.appendChild(o);
    });
    var path = el('input', 'rp-input'); path.type = 'text'; path.value = '/users'; path.setAttribute('aria-label', 'cesta');

    var name = el('input', 'rp-input rp-body'); name.type = 'text'; name.placeholder = 'name'; name.value = 'Grace';
    var email = el('input', 'rp-input rp-body'); email.type = 'text'; email.placeholder = 'email'; email.value = 'grace@example.cz';

    var send = el('button', 'rp-btn rp-send', 'Odeslat →'); send.type = 'button';

    var controls = el('div', 'rp-controls');
    var row1 = el('div', 'rp-row');
    row1.appendChild(method); row1.appendChild(path); row1.appendChild(send);
    var row2 = el('div', 'rp-row rp-bodyrow');
    var bodyLabel = el('span', 'rp-body-label', 'tělo:');
    row2.appendChild(bodyLabel); row2.appendChild(name); row2.appendChild(email);
    controls.appendChild(row1); controls.appendChild(row2);

    // --- presety (učí idempotenci) ---
    var presets = el('div', 'rp-presets');
    presets.appendChild(el('span', 'rp-presets-label', 'Rychlé scénáře:'));
    [
      { t: 'POST 2× stejný email', run: function () { req('POST', '/users', { name: 'Lin', email: 'lin@x.cz' }); req('POST', '/users', { name: 'Lin', email: 'lin@x.cz' }); } },
      { t: 'PUT 2× (idempotentní)', run: function () { req('PUT', '/users/1', { name: 'Ada L.', email: 'ada@example.cz' }); req('PUT', '/users/1', { name: 'Ada L.', email: 'ada@example.cz' }); } },
      { t: 'DELETE 2×', run: function () { req('DELETE', '/users/1', null); req('DELETE', '/users/1', null); } }
    ].forEach(function (p) {
      var b = el('button', 'rp-chip', p.t); b.type = 'button';
      b.addEventListener('click', p.run);
      presets.appendChild(b);
    });

    // --- výstupy ---
    var response = el('div', 'rp-response');
    var stateView = el('div', 'rp-state');
    var log = el('div', 'rp-log');

    var grid = el('div', 'rp-grid');
    var left = el('div'); left.appendChild(el('div', 'rp-h', 'Odpověď')); left.appendChild(response);
    var right = el('div'); right.appendChild(el('div', 'rp-h', 'Stav serveru (in-memory)')); right.appendChild(stateView);
    grid.appendChild(left); grid.appendChild(right);

    var logWrap = el('div', 'rp-logwrap');
    logWrap.appendChild(el('div', 'rp-h', 'Log requestů')); logWrap.appendChild(log);

    root.appendChild(controls);
    root.appendChild(presets);
    root.appendChild(grid);
    root.appendChild(logWrap);

    // toggle tělo podle metody
    function syncBody() {
      var m = method.value;
      var show = (m === 'POST' || m === 'PUT');
      row2.style.display = show ? '' : 'none';
    }
    method.addEventListener('change', syncBody);
    syncBody();

    function renderState() {
      stateView.innerHTML = '';
      if (!state.users.length) { stateView.appendChild(el('div', 'rp-empty', '(prázdno)')); return; }
      state.users.forEach(function (u) {
        stateView.appendChild(el('div', 'rp-user',
          '<code>#' + u.id + '</code> ' + esc(u.name) + ' &lt;' + esc(u.email) + '&gt;'));
      });
    }

    function renderResponse(m, p, res) {
      var kind = statusKind(res.status);
      response.innerHTML = '';
      response.appendChild(el('div', 'rp-reqline', '<code>' + m + ' ' + esc(p) + '</code>'));
      response.appendChild(el('div', 'rp-status rp-' + kind, res.status + ' ' + statusText(res.status)));
      if (res.note) response.appendChild(el('div', 'rp-note', res.note));
      response.appendChild(el('pre', 'rp-json', esc(res.body === null ? '(bez těla)' : JSON.stringify(res.body, null, 2))));
    }

    function pushLog(m, p, res) {
      var line = el('div', 'rp-log-line');
      line.appendChild(el('span', 'rp-badge rp-' + statusKind(res.status), String(res.status)));
      line.appendChild(el('span', 'rp-log-req', m + ' ' + esc(p)));
      log.insertBefore(line, log.firstChild);
    }

    // odeslání requestu (jádro + překreslení)
    function req(m, p, body) {
      var res = handle(state, m, p, body);
      renderResponse(m, p, res);
      renderState();
      pushLog(m, p, res);
    }

    send.addEventListener('click', function () {
      var m = method.value;
      var body = (m === 'POST' || m === 'PUT') ? { name: name.value, email: email.value } : null;
      req(m, path.value, body);
    });

    renderState();
    response.appendChild(el('div', 'rp-hint', 'Vyber metodu a odešli. Sleduj status kód a pravý panel se stavem.'));
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function statusText(s) {
    var map = { 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 500: 'Server Error' };
    return map[s] || '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.rest-playground'), build);
  });
})();
