// js/timer.js
// Cronômetro e contagem regressiva - corrigido
// IA: trechos de utilidade criados/ajustados com ajuda da IA.

(function(){
  // Estado do stopwatch (cronômetro que sobe)
  let swInterval = null;
  let swSeconds = 0;
  let swRunning = false;

  // Estado do countdown (contagem regressiva que desce)
  let cdInterval = null;
  let cdSeconds = 0;
  let cdRunning = false;

  // Seletores que aparecem nas páginas
  const stopwatchDisplays = () => document.querySelectorAll('#timerDisplay'); // mostra o tempo atual (usado como display genérico)
  const countdownDisplays = () => document.querySelectorAll('#countdownDisplay'); // display para o widget de contagem rápida na index

  // Formatação mm:ss
  function fmt(s){
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const sec = (s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  }

  // Atualiza todos os displays de stopwatch (id="timerDisplay")
  function updateStopwatchUI(){
    stopwatchDisplays().forEach(el => el.textContent = fmt(swSeconds));
  }

  // Atualiza os displays de countdown (id="countdownDisplay") e também #timerDisplay (para quando usamos countdown em receitas)
  function updateCountdownUI(){
    // atualiza displays específicos de countdown
    countdownDisplays().forEach(el => el.textContent = fmt(cdSeconds));
    // também atualiza displays genéricos (por exemplo, o painel da receita que utiliza id="timerDisplay")
    stopwatchDisplays().forEach(el => el.textContent = fmt(cdSeconds));
  }

  // Play beep simples com Web Audio API (sem arquivos externos)
  function playBeep(){
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880; // tom
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.value = 0.0001;
      // ataque rápido
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      o.start();
      // decaimento
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
      o.stop(ctx.currentTime + 0.75);
    } catch(e){
      // fallback silencioso (alguns navegadores bloqueiam até interação)
      console.warn('Beep não disponível:', e);
    }
  }

  // ========== STOPWATCH (cronômetro que sobe) ==========
  function swStart(){
    if(swRunning) return;
    swRunning = true;
    // garantir que o stopwatch não conflite com countdown (não pausa automaticamente, apenas separa estados)
    if(swInterval) clearInterval(swInterval);
    swInterval = setInterval(()=>{
      swSeconds++;
      updateStopwatchUI();
    }, 1000);
  }

  function swPause(){
    if(swInterval) clearInterval(swInterval);
    swRunning = false;
    swInterval = null;
  }

  function swReset(){
    if(swInterval) clearInterval(swInterval);
    swInterval = null;
    swRunning = false;
    swSeconds = 0;
    updateStopwatchUI();
  }

  // ========== COUNTDOWN (contagem regressiva que desce) ==========
  function cdStart(minutes){
  const mins = Math.max(0, Math.floor(minutes || 0));
  if(cdInterval) clearInterval(cdInterval);
  cdSeconds = mins * 60;
  cdRunning = true;
  updateCountdownUI();

  cdInterval = setInterval(()=>{
    // se chegou a zero ou menos, parar imediatamente antes de atualizar
    if(cdSeconds <= 0){
      clearInterval(cdInterval);
      cdInterval = null;
      cdRunning = false;
      cdSeconds = 0; // garante que exiba 00:00
      updateCountdownUI(); // atualiza para o zero real
      playBeep();
      try { alert('⏰ Tempo encerrado!'); } catch(e){ /* ignore */ }
      return; // encerra a execução desta iteração
    }

    // só chega aqui se ainda há tempo
    cdSeconds--;
    updateCountdownUI();
  }, 1000);
}

  function cdStop(){
    if(cdInterval) clearInterval(cdInterval);
    cdInterval = null;
    cdRunning = false;
  }

  function cdReset(){
    cdStop();
    cdSeconds = 0;
    updateCountdownUI();
  }

  // Expor funções globais
  window.startTimerGlobal = function(minutes){
    // mantive compatibilidade: se receber minutes > 0, inicia o stopwatch com valor inicial (como antes),
    // mas para a funcionalidade pedida de receitas, usaremos startCountdownFromRecipe (ver recipeUtils).
    if(typeof minutes === 'number' && minutes > 0){
      swSeconds = Math.max(0, Math.floor(minutes) * 60);
      updateStopwatchUI();
    }
    swStart();
  };

  window.pauseTimerGlobal = swPause;
  window.resetTimerGlobal = swReset;

  // Funções para contagem regressiva (índice e receitas)
  window.startCountdownGlobal = function(minutes){
    cdStart(minutes);
  };
  window.pauseCountdownGlobal = cdStop;
  window.resetCountdownGlobal = cdReset;

  // Atalhos por clique em botões que usam ids comuns (compatibilidade com estrutura HTML atual)
  document.addEventListener('click', function(e){
    const id = e.target && e.target.id;
    if(!id) return;
    if(id === 'start') swStart();
    if(id === 'pause') swPause();
    if(id === 'reset') swReset();
  });

  // Inicializa displays ao carregar (mostra 00:00)
  document.addEventListener('DOMContentLoaded', function(){ updateStopwatchUI(); updateCountdownUI(); });
})();
