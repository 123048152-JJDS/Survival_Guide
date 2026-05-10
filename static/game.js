let quizState = null;

function initQuiz(seccion, preguntas, commitment, isLast = false) {
  const seleccionadas = preguntas
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  quizState = {
    current: 0,
    correct: 0,
    done: false,
    preguntas: seleccionadas,
    commitment,
    seccion,
    isLast
  };
  renderQuiz(quizState);
}

function renderQuiz(state) {
  const container = document.getElementById('quiz-content');

  if (!state.done) {
    const q = state.preguntas[state.current];
    const esUltima = state.current === state.preguntas.length - 1;

    container.innerHTML = `
      <h3>// QUIZ DE DESBLOQUEO</h3>
      <p class="quiz-progress">Pregunta ${state.current + 1} de ${state.preguntas.length} &nbsp;·&nbsp; Correctas: ${state.correct} ✓</p>
      <p class="quiz-question">${q.q}</p>
      <div class="quiz-options">
        ${q.opts.map((opt, i) => `
          <button class="quiz-opt" onclick="responder(this, ${i}, ${q.correct})">
            ${String.fromCharCode(65 + i)}) ${opt}
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="quiz-feedback"></div>
      <button class="btn-next" id="btn-next" onclick="siguiente()">
        ${esUltima ? '[ VER RESULTADO ]' : '[ SIGUIENTE PREGUNTA → ]'}
      </button>
    `;
  } else {
    const paso = state.correct >= 2;
    if (paso) {
      container.innerHTML = `
        <h3>// QUIZ DE DESBLOQUEO</h3>
        <p class="quiz-progress" style="color:var(--success)">
          ✓ ¡${state.correct}/${state.preguntas.length} correctas! Has pasado el quiz.
        </p>
        <div class="commitment-zone" style="display:flex">
          <label>
            <input type="checkbox" id="cb-commit" onchange="toggleBtn()"/>
            ${state.commitment}
          </label>
          <button class="btn-unlock" id="btn-unlock" onclick="completar()">
            ${state.isLast ? '[ COMPLETAR ✓ ]' : '[ DESBLOQUEAR → ]'}
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <h3>// QUIZ DE DESBLOQUEO</h3>
        <p class="quiz-progress" style="color:var(--danger)">
          ✗ Solo ${state.correct}/${state.preguntas.length} correctas. Necesitas al menos 2.
        </p>
        <p style="font-size:12px; color:var(--muted); margin-top:0.5rem;">
          Se seleccionarán 3 preguntas nuevas al reintentar.
        </p>
        <button class="btn-next" style="display:block" onclick="reintentar()">[ REINTENTAR ]</button>
      `;
    }
  }
}

function responder(btnEl, elegido, correcto) {
  const botones = document.querySelectorAll('.quiz-opt');
  const feedback = document.getElementById('quiz-feedback');
  const btnNext = document.getElementById('btn-next');
  botones.forEach(b => b.disabled = true);
  if (elegido === correcto) {
    btnEl.classList.add('correct');
    quizState.correct++;
    feedback.className = 'quiz-feedback correct';
    feedback.textContent = '✓ ¡Correcto!';
  } else {
    btnEl.classList.add('wrong');
    botones[correcto].classList.add('correct');
    feedback.className = 'quiz-feedback wrong';
    feedback.textContent = '✗ Incorrecto. La respuesta correcta está marcada.';
  }
  feedback.style.display = 'block';
  btnNext.style.display = 'inline-block';
}

function siguiente() {
  if (quizState.current < quizState.preguntas.length - 1) {
    quizState.current++;
  } else {
    quizState.done = true;
  }
  renderQuiz(quizState);
}

function reintentar() {

    initQuiz(
    quizState.seccion,
    quizState._todas,
    quizState.commitment,
    quizState.isLast
  );
}

function toggleBtn() {
  const cb = document.getElementById('cb-commit');
  const btn = document.getElementById('btn-unlock');
  if (cb && btn) btn.classList.toggle('ready', cb.checked);
}

function completar() {
  const cb = document.getElementById('cb-commit');
  if (!cb || !cb.checked) return;
  if (quizState.isLast) {
    showVictory();
  } else {
    window.location.href = '/unlock/' + quizState.seccion;
  }
}

function showVictory() {
  const victory = document.createElement('div');
  victory.style.cssText = 'position:fixed;inset:0;background:rgba(10,14,26,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:1000;text-align:center;padding:2rem;';
  victory.innerHTML = `
    <div style="font-size:64px;margin-bottom:1rem;">🏆</div>
    <h2 style="font-family:'Press Start 2P',monospace;font-size:20px;color:#00e5ff;margin-bottom:1rem;">¡FELICIDADES!</h2>
    <p style="font-family:'Press Start 2P',monospace;font-size:10px;color:#ff6b35;margin-bottom:2rem;line-height:2;">
      SURVIVAL GUIDE COMPLETADO<br/>400 XP OBTENIDOS
    </p>
    <p style="font-size:14px;color:#94a3b8;max-width:400px;line-height:1.8;">
      Ya conoces las reglas, el sistema de evaluación, los objetivos y todas las fechas clave.<br/>
      ¡Ahora sí estás listo para sobrevivir Programación Móvil!
    </p>
    <button onclick="window.location.href='/unlock/timeline'"
      style="margin-top:2rem;font-family:'Press Start 2P',monospace;font-size:10px;padding:1rem 2rem;background:transparent;border:2px solid #00e5ff;color:#00e5ff;border-radius:4px;cursor:pointer;">
      [ FINALIZAR ]
    </button>
  `;
  document.body.appendChild(victory);
}