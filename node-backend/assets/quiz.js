/* Reusable quiz widget with immediate, automatic feedback.
 *
 * Usage in a lesson:
 *   <div class="quiz" data-quiz='[ ... JSON ... ]'></div>
 *   <script src="../assets/quiz.js"></script>
 *
 * Each question object:
 *   {
 *     "q": "Question text (may contain <code> etc.)",
 *     "options": ["A", "B", "C", "D"],   // keep same length/shape — no formatting clues
 *     "answer": 2,                         // index of correct option
 *     "why": "Explanation shown after answering (both right and wrong)."
 *   }
 *
 * Design notes:
 * - Feedback is instant and automatic (tight feedback loop).
 * - Explanation shows regardless of correctness — retrieval + reinforcement.
 * - Score tallied at the end to reward completion.
 */
(function () {
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function renderQuiz(root) {
    var questions;
    try { questions = JSON.parse(root.getAttribute('data-quiz')); }
    catch (err) { root.textContent = 'Quiz data error: ' + err.message; return; }

    var answered = 0, correct = 0;
    var scoreEl = el('div', 'quiz-score');

    questions.forEach(function (item, qi) {
      var card = el('div', 'quiz-card');
      card.appendChild(el('div', 'quiz-q', '<span class="quiz-num">' + (qi + 1) + '.</span> ' + item.q));

      var opts = el('div', 'quiz-opts');
      var locked = false;

      item.options.forEach(function (opt, oi) {
        var b = el('button', 'quiz-opt');
        b.type = 'button';
        b.innerHTML = opt;
        b.addEventListener('click', function () {
          if (locked) return;
          locked = true;
          answered++;
          var right = oi === item.answer;
          if (right) correct++;
          Array.prototype.forEach.call(opts.children, function (child, ci) {
            child.disabled = true;
            if (ci === item.answer) child.classList.add('is-correct');
            else if (ci === oi) child.classList.add('is-wrong');
          });
          var why = el('div', 'quiz-why ' + (right ? 'ok' : 'no'));
          why.innerHTML = '<strong>' + (right ? 'Správně.' : 'Ne tak docela.') + '</strong> ' + item.why;
          card.appendChild(why);
          updateScore();
        });
        opts.appendChild(b);
      });

      card.appendChild(opts);
      root.appendChild(card);
    });

    root.appendChild(scoreEl);

    function updateScore() {
      if (answered === questions.length) {
        scoreEl.innerHTML = 'Hotovo — <strong>' + correct + ' / ' + questions.length + '</strong>. '
          + (correct === questions.length
              ? 'Sedí to. Napiš mi, ať jdeme dál.'
              : 'Co nesedělo, projdi znovu výše — nebo se mě zeptej.');
      } else {
        scoreEl.textContent = answered + ' / ' + questions.length + ' zodpovězeno';
      }
    }
    updateScore();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.quiz'), renderQuiz);
  });
})();
