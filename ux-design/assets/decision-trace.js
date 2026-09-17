/* decision-trace.js — skládání řetězu rozhodnutí (komponent pro lekce).
 *
 * Learner dostane reálnou situaci a skládá čtyři články řetězu:
 *   Cíl → Bariéra → Rozhodnutí → Důkaz
 * U každého článku vybírá z nabídky, kde tři možnosti jsou typické pasti
 * (vkus, aktivita místo výsledku, řešení převlečené za problém, názor místo
 * důkazu). Feedback je okamžitý a vysvětluje MECHANISMUS chyby, ne verdikt.
 *
 * Po složení celého řetězu komponent poskládá větu, která je doslova
 * odstavec do případovky v portfoliu — to je celá pointa.
 *
 * Použití v lekci:
 *   <div class="decision-trace"></div>
 *   <script src="../assets/decision-trace.js"></script>
 *
 * Jádro (SCENARIOS, check, assemble, validate) je čisté → testovatelné v Node
 * (viz tools/test-decision-trace.js).
 */
(function () {
  'use strict';

  var LINKS = [
    { key: 'cil',        name: 'Cíl',        hint: 'Co se má změnit ve výsledku — a čím to změříš.' },
    { key: 'bariera',    name: 'Bariéra',    hint: 'Co přesně brání dojít k cíli — a odkud to víš.' },
    { key: 'rozhodnuti', name: 'Rozhodnutí', hint: 'Co měníš — a proč zrovna to odstraní tu bariéru.' },
    { key: 'dukaz',      name: 'Důkaz',      hint: 'Podle čeho poznáš, že to zabralo — i kdyby nezabralo.' }
  ];

  var SCENARIOS = [
    {
      id: 'servis',
      name: 'Zakázka pro klienta',
      context: 'Autoservis má web, kde si zákazník objedná termín. Z <strong>1000</strong> lidí, kteří objednávku začnou, ji dokončí <strong>180</strong>. Klient ti napíše: „Udělejte to hezčí, vypadá to staře.“',
      options: [
        [
          { t: 'Dokončených objednávek 30 % místo 18 % do konce kvartálu', ok: true,
            short: 'zvednout dokončené objednávky z 18 % na 30 %',
            why: 'Má číslo, výchozí stav i lhůtu. Tohle je věta, kterou lze po kvartálu prohrát — a právě proto má cenu.' },
          { t: 'Objednávkový formulář bude působit moderně a přehledně', ok: false,
            why: 'Popis vzhledu, ne výsledek. Nezměříš to, takže to nemůžeš ani prohrát — a co nemůžeš prohrát, za to ti nikdo nezaplatí prémii.' },
          { t: 'Překreslíme dvanáct obrazovek a zavedeme design systém', ok: false,
            why: 'Aktivita — co uděláš. Cíl je, co se změní. Aktivitu prodáváš na hodiny, výsledek na hodnotu. Přesně tady se láme tvoje sazba.' },
          { t: 'Zákazníci budou z objednávání nadšení a spokojení', ok: false,
            why: 'Pocit. Nadšení nejde pozorovat ani vyvrátit a klientovi nepřinese jedinou zakázku navíc.' }
        ],
        [
          { t: 'Formulář žádá VIN hned v prvním kroku; 62 % tam odpadne', ok: true,
            short: 'lidé odpadají na VINu, který v tu chvíli nemají po ruce',
            why: 'Konkrétní místo v toku plus číslo, odkud to víš. Bariéra je pozorovatelná — buď ji vidíš v datech, nebo u člověka při testu.' },
          { t: 'Vzhled je zastaralý, staré fonty a nemoderní barvy', ok: false,
            why: 'Tvůj dojem z vizuálu, ne chování uživatele. Může to být pravda a přesto to není důvod, proč lidé odcházejí.' },
          { t: 'Uživatelé jsou netrpěliví a nechce se jim vyplňovat', ok: false,
            why: 'Vina na uživateli. Nedá se to vyvrátit ani opravit. Kdykoli ti bariéra vyjde jako vlastnost uživatele, hledals špatně.' },
          { t: 'Konkurence má lepší web a přetahuje si naše zákazníky', ok: false,
            why: 'Hypotéza o trhu, ne překážka ve tvém toku. I kdyby platila, obrazovkou ji nezměníš.' }
        ],
        [
          { t: 'Na VIN se zeptat až po potvrzení termínu, ne před ním', ok: true,
            short: 'přesunout VIN až za potvrzení termínu',
            why: 'Míří přesně na pozorované místo odpadu a odstraňuje požadavek, který v daném kroku není k ničemu. Termín jde zarezervovat bez VINu — ten potřebuje až technik.' },
          { t: 'Přidat ukazatel postupu, ať je vidět, kolik kroků zbývá', ok: false,
            why: 'Bariéru zobrazuje, ale neodstraňuje. Kdo VIN u sebe nemá, po zobrazení progress baru ho mít nezačne.' },
          { t: 'Poslat e-mail s připomínkou nedokončené objednávky', ok: false,
            why: 'Záchranná síť až za bariérou — léčí následek. A e-mail většinou ani nemáš, protože lidé odpadli dřív, než ho vyplnili.' },
          { t: 'Zvětšit odesílací tlačítko a dát mu výraznější barvu', ok: false,
            why: 'Lidé neodcházejí proto, že tlačítko nevidí. Odcházejí proto, že nad ním po nich chceš údaj, který u sebe nemají.' }
        ],
        [
          { t: 'Dokončení vyroste z 18 % nad 25 % do čtyř týdnů, jinak zpět', ok: true,
            short: 'dokončení nad 25 % do čtyř týdnů, jinak se změna vrací',
            why: 'Číslo, práh, lhůta — a hlavně předem vyslovené „jinak zpět“. Důkaz, který nemůže dopadnout špatně, není důkaz.' },
          { t: 'Klient potvrdí, že se mu nová verze líbí mnohem víc', ok: false,
            why: 'Názor zadavatele není chování zákazníka. Tohle je nejdražší past freelancera: spokojený klient a pořád mrtvý formulář.' },
          { t: 'Na obrazovce bude méně polí, což je prokazatelně lepší', ok: false,
            why: 'Popis změny, ne důkaz účinku. Že jsi něco udělal, není totéž co že to zabralo.' },
          { t: 'Zeptáme se pěti lidí, zda jim formulář přijde snazší', ok: false,
            why: 'Deklarovaný pocit není chování — a ptáš se jiných lidí než těch, co odpadli. Test s pěti lidmi je skvělý na hledání bariér, mizerný jako důkaz výsledku.' }
        ]
      ]
    },
    {
      id: 'vlastni',
      name: 'Vlastní produkt',
      context: 'Vydal jsi appku. <strong>200</strong> instalací, druhý den se vrátí <strong>24</strong> lidí (12 %). Láká tě dodělat další funkci — máš jich rozpracovaných pět.',
      options: [
        [
          { t: 'Návrat druhý den z 12 % na 25 % během jednoho měsíce', ok: true,
            short: 'zvednout návrat druhý den z 12 % na 25 %',
            why: 'Retence je u vlastního produktu ta nejpoctivější metrika: říká, jestli lidem appka opravdu k něčemu je, nebo ji jen zkusili.' },
          { t: 'Appka bude mít víc funkcí než konkurenční aplikace', ok: false,
            why: 'Funkce nejsou výsledek. Další funkce v appce, kam se nikdo nevrací, jenom prodlouží seznam věcí, kterým nikdo nerozumí.' },
          { t: 'Onboarding přepíšeme na tři svižné a jasné obrazovky', ok: false,
            why: 'Řešení převlečené za cíl. Rozhodl jsi dřív, než víš, kde lidé odcházejí — a to je nejdražší chyba v celém oboru.' },
          { t: 'Uživatelé konečně pochopí, k čemu je appka dobrá', ok: false,
            why: 'Blízko, ale „pochopí“ neuvidíš. Pochopení poznáš vždy jen podle chování — tak ho rovnou napiš jako chování.' }
        ],
        [
          { t: 'První spuštění je prázdná obrazovka; 71 % odejde do minuty', ok: true,
            short: 'první spuštění vítá prázdnou obrazovkou',
            why: 'Cold start: appka po instalaci nemá žádný obsah, takže neukáže, k čemu je. Konkrétní místo, konkrétní číslo — s tím se dá pracovat.' },
          { t: 'Appce chybí funkce, kvůli kterým by lidé zůstali', ok: false,
            why: 'Tvrzení bez signálu — a nejpohodlnější možné, protože vede přesně k tomu, co stejně chceš dělat: programovat.' },
          { t: 'Chybí push notifikace, které by lidi vracely zpátky', ok: false,
            why: 'Řešení převlečené za bariéru. Poznáš to takhle: dá se to říct větou „chybí nám X“? Pak je to nápad, ne překážka.' },
          { t: 'Uživatelé nečtou onboarding, takže nepochopí hodnotu', ok: false,
            why: 'Domněnka o tom, co se děje člověku v hlavě, bez jediného pozorování. Nedá se vyvrátit, tedy se na ní nedá stavět.' }
        ],
        [
          { t: 'Napoprvé appku naplnit ukázkovými daty, jdou smazat', ok: true,
            short: 'napoprvé naplnit appku ukázkovými daty',
            why: 'Nahrazuje prázdno hotovým stavem přesně v místě odpadu. Člověk uvidí, co appka umí, aniž by to musel nejdřív celé naťukat sám.' },
          { t: 'Přidat uvítací průvodce na čtyři kroky a pak pustit dál', ok: false,
            why: 'Vysvětluje místo aby ukázal — a přidává práci ještě před první hodnotou. Prázdná obrazovka za tutoriálem je pořád prázdná obrazovka.' },
          { t: 'Poslat druhý den ráno push: vrať se dokončit svůj profil', ok: false,
            why: 'Tlačí člověka zvenčí do stejného prázdna. Když se vrátí, uvidí přesně to, co ho poprvé vyhnalo.' },
          { t: 'Předělat barvy a ikonu, ať appka působí důvěryhodněji', ok: false,
            why: 'Netýká se místa, kde lidé odcházejí. Může to být správná práce — ale ne teď a ne v tomhle řetězu.' }
        ],
        [
          { t: 'Podíl lidí s vlastním záznamem den 1 plus návrat den 2', ok: true,
            short: 'podíl lidí s vlastním záznamem první den a návrat druhý den',
            why: 'Dvě čísla: mezikrok (dorazil člověk k vlastnímu obsahu?) a cíl (vrátil se?). Mezikrok ti řekne, jestli selhalo řešení, nebo celá hypotéza.' },
          { t: 'Hodnocení v obchodě stoupne z 3,8 na 4,3 hvězdičky', ok: false,
            why: 'Pomalé, zašuměné a měří něco jiného. Hvězdičkami hýbe i cena, jeden bug nebo jedna naštvaná recenze.' },
          { t: 'Appka bude po změně vypadat hned zaplněná a živá', ok: false,
            why: 'Popis změny, ne důkaz účinku. Tohle uvidíš na simulátoru za pět minut a o lidech ti to neřekne nic.' },
          { t: 'Projdeš si to sám a uznáš, že je to teď o dost lepší', ok: false,
            why: 'Ty nejsi vzorek. Znáš každou obrazovku dopředu, takže nemůžeš zažít zmatek — tomu se říká curse of knowledge.' }
        ]
      ]
    }
  ];

  // ---- Čisté jádro ----------------------------------------------------

  // Vyhodnoť volbu. Vrací { ok, why, done } — done = byl to poslední článek.
  function check(scenario, linkIndex, optIndex) {
    var opt = scenario.options[linkIndex][optIndex];
    return { ok: !!opt.ok, why: opt.why, done: opt.ok && linkIndex === LINKS.length - 1 };
  }

  // Index správné možnosti v článku.
  function correctIndex(scenario, linkIndex) {
    var opts = scenario.options[linkIndex];
    for (var i = 0; i < opts.length; i++) if (opts[i].ok) return i;
    return -1;
  }

  // Slož odstavec do případovky z hotového řetězu.
  function assemble(scenario) {
    function s(i) { return scenario.options[i][correctIndex(scenario, i)].short; }
    return 'Protože ' + s(1) + ', rozhodl jsem se ' + s(2) + '. '
         + 'Cíl: ' + s(0) + '. Ověřím to takhle: ' + s(3) + '.';
  }

  // Strukturální kontrola dat (používá test): přesně jedna správná možnost
  // v článku, u správné je `short`, u všech je `why`, a možnosti mají
  // podobnou délku — aby délka nebyla nápovědou.
  function validate(scenarios) {
    var problems = [];
    (scenarios || SCENARIOS).forEach(function (sc) {
      if (sc.options.length !== LINKS.length) problems.push(sc.id + ': jiný počet článků než ' + LINKS.length);
      sc.options.forEach(function (opts, li) {
        var right = opts.filter(function (o) { return o.ok; });
        if (right.length !== 1) problems.push(sc.id + '/' + LINKS[li].key + ': správných možností = ' + right.length);
        if (right[0] && !right[0].short) problems.push(sc.id + '/' + LINKS[li].key + ': správné možnosti chybí short');
        opts.forEach(function (o, oi) {
          if (!o.why || o.why.length < 40) problems.push(sc.id + '/' + LINKS[li].key + '/' + oi + ': chybí nebo je moc krátké why');
        });
        var lens = opts.map(function (o) { return o.t.length; });
        var spread = Math.max.apply(null, lens) - Math.min.apply(null, lens);
        if (spread > 14) problems.push(sc.id + '/' + LINKS[li].key + ': rozptyl délek možností = ' + spread + ' znaků (nápověda formátem)');
      });
    });
    return problems;
  }

  // Fisher-Yates. Pořadí možností se míchá při vykreslení, aby pozice
  // nebyla nápovědou (v datech je správná možnost první kvůli čitelnosti).
  function shuffledOrder(n, rnd) {
    var idx = [], i, j, t;
    for (i = 0; i < n; i++) idx.push(i);
    rnd = rnd || Math.random;
    for (i = n - 1; i > 0; i--) {
      j = Math.floor(rnd() * (i + 1));
      t = idx[i]; idx[i] = idx[j]; idx[j] = t;
    }
    return idx;
  }

  var CORE = { LINKS: LINKS, SCENARIOS: SCENARIOS, check: check, correctIndex: correctIndex, assemble: assemble, validate: validate, shuffledOrder: shuffledOrder };
  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  // ---- DOM wrapper ----------------------------------------------------

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function build(root) {
    var scenario = SCENARIOS[0];
    var picked = [];   // index správné volby pro hotové články
    var current = 0;

    var head = el('div', 'dt-h', 'Vyber situaci');
    var switcher = el('div', 'dt-scenarios');
    var context = el('div', 'dt-context');
    var chain = el('div', 'dt-chain');
    var summary = el('div', 'dt-summary');
    var progress = el('div', 'dt-progress');
    var actions = el('div', 'dt-actions');
    var resetBtn = el('button', 'dt-reset', '↺ Zkusit znovu');
    resetBtn.type = 'button';
    actions.appendChild(resetBtn);

    var btns = {};
    SCENARIOS.forEach(function (sc) {
      var b = el('button', 'dt-scenario', sc.name);
      b.type = 'button';
      b.addEventListener('click', function () { scenario = sc; reset(); });
      btns[sc.id] = b;
      switcher.appendChild(b);
    });

    resetBtn.addEventListener('click', reset);

    root.appendChild(head);
    root.appendChild(switcher);
    root.appendChild(context);
    root.appendChild(chain);
    root.appendChild(summary);
    root.appendChild(progress);
    root.appendChild(actions);

    function reset() { picked = []; current = 0; render(); }

    function render() {
      Object.keys(btns).forEach(function (id) { btns[id].classList.toggle('is-on', id === scenario.id); });
      context.innerHTML = scenario.context;
      chain.innerHTML = '';
      summary.innerHTML = '';
      summary.style.display = 'none';

      LINKS.forEach(function (link, li) {
        var state = li < current ? 'is-done' : (li === current ? 'is-active' : 'is-locked');
        var card = el('div', 'dt-link ' + state);
        var headRow = el('div', 'dt-link-head');
        headRow.appendChild(el('span', 'dt-badge', li < current ? '✓' : String(li + 1)));
        headRow.appendChild(el('span', 'dt-name', link.name));
        card.appendChild(headRow);

        if (li < current) {
          var chosen = scenario.options[li][picked[li]];
          card.appendChild(el('div', 'dt-picked', chosen.t));
        } else if (li === current) {
          card.appendChild(el('div', 'dt-hint', link.hint));
          var opts = el('div', 'dt-opts');
          var solved = false;
          shuffledOrder(scenario.options[li].length).forEach(function (oi) {
            var opt = scenario.options[li][oi];
            var b = el('button', 'dt-opt', opt.t);
            b.type = 'button';
            b.addEventListener('click', function () {
              if (solved || b.disabled) return;
              var res = check(scenario, li, oi);
              var why = card.querySelector('.dt-why');
              if (why) why.remove();
              var box = el('div', 'dt-why ' + (res.ok ? 'ok' : 'no'));
              box.innerHTML = '<strong>' + (res.ok ? 'Ano. ' : 'Ne. ') + '</strong>' + opt.why;
              if (res.ok) {
                solved = true;
                b.classList.add('is-correct');
                Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; });
                card.appendChild(box);
                picked[li] = oi;
                setTimeout(function () { current = li + 1; render(); }, 1400);
              } else {
                b.classList.add('is-wrong');
                b.disabled = true;
                card.appendChild(box);
              }
            });
            opts.appendChild(b);
          });
          card.appendChild(opts);
        } else {
          card.appendChild(el('div', 'dt-hint', link.hint));
        }
        chain.appendChild(card);
      });

      if (current >= LINKS.length) {
        summary.style.display = '';
        summary.innerHTML = '<div class="dt-h">Tohle je odstavec do tvé případovky</div>'
          + '<em>„' + assemble(scenario) + '“</em>'
          + '<p class="note-small">Klient tuhle větu pochopí, i když o designu neví nic. A ty za ni můžeš ručit — každý článek stojí na tom předchozím.</p>';
        progress.textContent = 'Řetěz hotový. Přepni na druhou situaci a zkus to znovu.';
      } else {
        progress.textContent = 'Článek ' + (current + 1) + ' ze ' + LINKS.length + '.';
      }
    }

    reset();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.decision-trace'), build);
  });
})();
