// js/timer.js
// Cronômetro e contagem regressiva - versão corrigida e melhorada

(function(){
  // Estado do stopwatch (cronômetro que sobe)
  let swInterval = null;
  let swSeconds = 0;
  let swRunning = false;

  // Estado do countdown (contagem regressiva que desce)
  let cdInterval = null;
  let cdSeconds = 0;
  let cdRunning = false;

  // Reuse do AudioContext para tocar beep (evita criar muitos ctx)
  let audioCtx = null;

  // --- Seletores ---
  // Nota: ideal usar classes (ex: .timerDisplay) em vez de IDs múltiplos.
  const getStopwatchDisplays = () => document.querySelectorAll('#timerDisplay');
  const getCountdownDisplays = () => document.querySelectorAll('#countdownDisplay');

  // --- Formatação mm:ss ---
  function fmt(s){
    s = Math.max(0, Math.floor(s));
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const sec = (s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  }

  // --- UI updates ---
  function updateStopwatchUI(){
    const text = fmt(swSeconds);
    getStopwatchDisplays().forEach(el => el.textContent = text);
  }

  function updateCountdownUI(){
    const text = fmt(cdSeconds);
    // importante: atualiza apenas os displays específicos de countdown
    getCountdownDisplays().forEach(el => el.textContent = text);
    // ---- removi a atualização de #timerDisplay aqui para evitar conflito com o stopwatch ----
  }

  // --- Beep com Web Audio API (reuso do contexto) ---
  async function playBeep(){
    try {
      if(!audioCtx){
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if(audioCtx.state === 'suspended'){
        try { await audioCtx.resume(); } catch(e){ /* ignore */ }
      }

      const ctx = audioCtx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);

      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      o.start(ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
      o.stop(ctx.currentTime + 0.75);

      // se quiser fechar o contexto, pode fazer após 1s, mas deixei comentado
      // setTimeout(() => { try { audioCtx.close(); audioCtx = null; } catch(e){} }, 1000);

    } catch(e){
      console.warn('Beep não disponível:', e);
    }
  }

  // ========== STOPWATCH ==========
  function swStart(){
    if(swRunning) return;
    swRunning = true;

    if(swInterval) clearInterval(swInterval);

    // atualiza UI imediatamente (evita 1s de atraso visual)
    updateStopwatchUI();

    swInterval = setInterval(()=>{
      swSeconds++;
      updateStopwatchUI();
    }, 1000);
  }

  function swPause(){
    if(swInterval) {
      clearInterval(swInterval);
      swInterval = null;
    }
    swRunning = false;
  }

  function swReset(){
    if(swInterval) {
      clearInterval(swInterval);
      swInterval = null;
    }
    swRunning = false;
    swSeconds = 0;
    updateStopwatchUI();
  }

  // ========== COUNTDOWN ==========
  function cdStart(minutes){
    // Ao iniciar o countdown, PAUSAR o stopwatch para evitar conflito de displays
    swPause();

    // aceita minutos inteiros ou decimais; transforma em inteiro de minutos >= 0
    const mins = Math.max(0, Math.floor(Number(minutes || 0)));
    if(cdInterval) {
      clearInterval(cdInterval);
      cdInterval = null;
    }
    cdSeconds = mins * 60;
    cdRunning = true;
    updateCountdownUI();

    // Se já for zero, trate imediatamente sem criar intervalo
    if(cdSeconds <= 0){
      cdRunning = false;
      cdSeconds = 0;
      updateCountdownUI();
      playBeep();
      try { alert('⏰ Tempo encerrado!'); } catch(e){ /* ignore */ }
      return;
    }

    cdInterval = setInterval(()=>{
      if(cdSeconds <= 0){
        clearInterval(cdInterval);
        cdInterval = null;
        cdRunning = false;
        cdSeconds = 0;
        updateCountdownUI();
        playBeep();
        try { alert('⏰ Tempo encerrado!'); } catch(e){ /* ignore */ }
        return;
      }
      cdSeconds--;
      updateCountdownUI();
    }, 1000);
  }

  function cdStop(){
    if(cdInterval){
      clearInterval(cdInterval);
      cdInterval = null;
    }
    cdRunning = false;
  }

  function cdReset(){
    cdStop();
    cdSeconds = 0;
    updateCountdownUI();
  }

  // ========== Expor funções globais (compatibilidade) ==========
  window.startTimerGlobal = function(minutes){
    if(typeof minutes === 'number' && minutes > 0){
      swSeconds = Math.max(0, Math.floor(minutes) * 60);
      updateStopwatchUI();
    }
    swStart();
  };

  window.pauseTimerGlobal = swPause;
  window.resetTimerGlobal = swReset;

  window.startCountdownGlobal = function(minutes){
    cdStart(minutes);
  };
  window.pauseCountdownGlobal = cdStop;
  window.resetCountdownGlobal = cdReset;

  // Atalhos por clique
  document.addEventListener('click', function(e){
    const id = e.target && e.target.id;
    if(!id) return;
    if(id === 'start') swStart();
    if(id === 'pause') swPause();
    if(id === 'reset') swReset();
  });

  // Inicializa displays ao carregar
  document.addEventListener('DOMContentLoaded', function(){
    updateStopwatchUI();
    updateCountdownUI();
  });

})();
