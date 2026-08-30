/* breath-match.js — drill "nádech, nebo výdech?" (komponent pro lekce).
 *
 * Dostaneš popis pohybu, vybereš dech. Okamžitá zpětná vazba i s důvodem.
 * Tohle není jen kvíz o dýchání — je to trénink PRAVIDLA, podle kterého se
 * později skládají sekvence: pořadí pozic v sestavě určuje, co se dá nadechnout
 * a co vydechnout. Bez tohohle pravidla se sestava skládat nedá.
 *
 * Použití v lekci:
 *   <div class="breath-match"></div>
 *   <script src="../assets/breath-match.js"></script>
 *
 * Volitelně vlastní sada:  data-items='[{"move":"…","answer":"in","why":"…"}]'
 *
 * Jádro (check / buildDeck) jsou čisté funkce → testovatelné v Node
 * (viz tools/test-breath-match.js).
 */
(function () {
  'use strict';

  /* Pravidlo: nádech = expanze (otevírá se přední strana těla, páteř se prodlužuje),
     výdech = komprese (přední strana se zavírá, tělo se skládá nebo rotuje).
     Záměrně jsou uvnitř i položky, kde "nahoru/dolů" vede na špatnou odpověď —
     rozhoduje hrudník a páteř, ne směr pohybu v prostoru. */
  var ITEMS = [
    {
      move: 'Ze stoje vytahuješ obě paže nad hlavu a prodlužuješ páteř.',
      answer: 'in',
      why: 'Přední strana těla se otevírá a páteř se prodlužuje — čistá expanze. Nádech.'
    },
    {
      move: 'Skládáš se v kyčlích dopředu do předklonu k nohám.',
      answer: 'out',
      why: 'Trup se skládá na stehna a hrudní koš se stlačuje. Výdech navíc uvolní břicho, takže se dostaneš hlouběji.'
    },
    {
      move: 'Z předklonu zvedáš hrudník do poloviční pozice, záda narovnaná, pohled dopředu.',
      answer: 'in',
      why: 'Páteř se prodlužuje a hrudník se otevírá dopředu. Expanze → nádech. Tenhle mezikrok existuje právě proto, aby ses mezi dvěma výdechy nadechl.'
    },
    {
      move: 'Ze stoje pokrčuješ kolena do hlubokého dřepu (Chair), ruce jdou nad hlavu.',
      answer: 'in',
      why: 'Past. Tělo klesá dolů, ale to nerozhoduje — ruce jdou nad hlavu a hrudník se zvedá, takže se přední strana otevírá. Expanze → nádech. Směr v prostoru je slepá stopa, sleduj hrudník a páteř.'
    },
    {
      move: 'Z prkna spouštíš trup dolů do Chaturangy, lokty u těla.',
      answer: 'out',
      why: 'Tělo se skládá k zemi a hrudní koš je stlačený. Výdech. Navíc: vydechnout tady pomáhá zpevnit střed těla, což je přesně to, co ti chrání ramena.'
    },
    {
      move: 'Z Chaturangy se převaluješ přes špičky vpřed, hrudník ven a vzhůru (Upward Dog).',
      answer: 'in',
      why: 'Záklon otevírá celou přední stranu těla — nejexpanznější moment celého pozdravu slunci. Nádech.'
    },
    {
      move: 'Tlačíš boky vzad a vzhůru do Downward Dog.',
      answer: 'out',
      why: 'Trup se skládá k stehnům (kyčle jdou do flexe), i když boky letí nahoru. Komprese → výdech. Další ukázka, že "nahoru" neznamená nádech.'
    },
    {
      move: 'Sedáš si na paty a skládáš se čelem k podložce do Child\'s Pose.',
      answer: 'out',
      why: 'Maximální složení těla do klubíčka. Výdech — a v téhle pozici ho pak necháváš dlouhý, proto je to úlevová pozice.'
    },
    {
      move: 'Ve vzporu klečmo propadáš břichem k zemi a otevíráš hrudník (Cow).',
      answer: 'in',
      why: 'Páteř do extenze, hrudník se otevírá. Expanze → nádech. Cat-Cow je nejjednodušší cvičení na propojení dechu s pohybem právě proto, že je to čistá expanze a komprese za sebou.'
    },
    {
      move: 'Otáčíš trup do twistu a opíráš loket za protilehlé koleno.',
      answer: 'out',
      why: 'Rotace stlačuje hrudní koš — vydechnout ho zúží a pustí tě hlouběji. Do twistu se vydechuje, nádechem se mezi opakováními znovu prodloužíš.'
    }
  ];

  function check(item, choice) {
    return { right: item.answer === choice, why: item.why };
  }

  /* Zamíchá kopii sady. `rng` se dá podstrčit → deterministický test. */
  function buildDeck(items, rng) {
    var r = rng || Math.random;
    var deck = items.slice();
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var tmp = deck[i]; deck[i] = deck[j]; deck[j] = tmp;
    }
    return deck;
  }

  var CORE = { ITEMS: ITEMS, check: check, buildDeck: buildDeck };

  if (typeof module !== 'undefined' && module.exports) module.exports = CORE;
  if (typeof document === 'undefined') return;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function build(root) {
    var items = ITEMS;
    var raw = root.getAttribute('data-items');
    if (raw) { try { items = JSON.parse(raw); } catch (e) { /* fallback na ITEMS */ } }

    var deck = buildDeck(items);
    var i = 0, correct = 0;

    var progress = el('div', 'bm-progress');
    var move = el('div', 'bm-move');
    var btns = el('div', 'bm-btns');
    var why = el('div', 'bm-why');
    var next = el('button', 'bm-next', 'Další →');
    next.type = 'button';
    var score = el('div', 'bm-score');

    root.appendChild(progress);
    root.appendChild(move);
    root.appendChild(btns);
    root.appendChild(why);
    root.appendChild(next);
    root.appendChild(score);

    function answer(choice, btnEls) {
      var item = deck[i];
      var res = check(item, choice);
      if (res.right) correct++;
      btnEls.forEach(function (b) {
        b.disabled = true;
        if (b.getAttribute('data-choice') === item.answer) b.classList.add('is-correct');
        else if (b.getAttribute('data-choice') === choice) b.classList.add('is-wrong');
      });
      why.className = 'bm-why ' + (res.right ? 'ok' : 'no');
      why.innerHTML = '<strong>' + (res.right ? 'Sedí. ' : 'Ne. ') + '</strong>' + res.why;
      next.style.display = i < deck.length - 1 ? '' : 'none';
      if (i === deck.length - 1) finish();
    }

    function finish() {
      score.innerHTML = 'Hotovo — <strong>' + correct + ' / ' + deck.length + '</strong>. '
        + (correct === deck.length
            ? 'Pravidlo máš. Tohle je přesně ta znalost, ze které se pak skládají sestavy — napiš mi a jdeme dál.'
            : 'Co nesedělo, mrkni na důvod znovu. Pomůcka: nekoukej, kam se tělo hýbe v prostoru — koukej, jestli se přední strana těla otevírá, nebo zavírá.');
    }

    function render() {
      progress.textContent = 'Pohyb ' + (i + 1) + ' z ' + deck.length;
      move.textContent = deck[i].move;
      why.className = 'bm-why';
      why.innerHTML = '';
      next.style.display = 'none';
      btns.innerHTML = '';
      var made = [];
      [['in', 'Nádech'], ['out', 'Výdech']].forEach(function (pair) {
        var b = el('button', 'bm-btn', pair[1]);
        b.type = 'button';
        b.setAttribute('data-choice', pair[0]);
        b.addEventListener('click', function () { answer(pair[0], made); });
        made.push(b);
        btns.appendChild(b);
      });
    }

    next.addEventListener('click', function () { i++; render(); });
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.breath-match'), build);
  });
})();
