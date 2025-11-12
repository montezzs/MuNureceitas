// js/timer.js
// Cronômetro e contagem regressiva - versão corrigida e segura

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

  // --- Seletores flexíveis: aceita ID único ou várias classes ---
  const getStopwatchDisplays = () => document.querySelectorAll('#timerDisplay, .timerDisplay');
  const getCountdownDisplays = () => document.querySelectorAll('#countdownDisplay, .countdownDisplay');

  // --- Formatação mm:ss ---
  function fmtSecondsToMMSS(s){
    s = Math.max(0, Math.floor(s));
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const sec = (s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  }

  // --- UI updates ---
  function updateStopwatchUI(){
    const text = fmtSecondsToMMSS(swSeconds);
    getStopwatchDisplays().forEach(el => el.textContent = text);
  }

  function updateCountdownUI(){
    const text = fmtSecondsToMMSS(cdSeconds);
    getCountdownDisplays().forEach(el => el.textContent = text);
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
    } catch(e){
      // autoplay/AudioContext pode ser bloqueado — sem problema, apenas log
      console.warn('Beep não disponível:', e);
    }
  }

  // ========== STOPWATCH ==========
  function swStart(){
    if(swRunning) return;
    // ao iniciar stopwatch, garantir que countdown esteja parado
    cdStop();

    swRunning = true;
    if(swInterval) clearInterval(swInterval);

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
    swPause();
    swSeconds = 0;
    updateStopwatchUI();
  }

  // ========== COUNTDOWN ==========
  function cdStartFromSeconds(seconds){
    // ao iniciar countdown, pausar stopwatch para evitar conflito de displays
    swPause();

    const secs = Math.max(0, Math.floor(Number(seconds) || 0));
    if(cdInterval) {
      clearInterval(cdInterval);
      cdInterval = null;
    }
    cdSeconds = secs;
    cdRunning = true;
    updateCountdownUI();

    if(cdSeconds <= 0){
      cdRunning = false;
      cdSeconds = 0;
      updateCountdownUI();
      playBeep();
      try { alert('⏰ Tempo encerrado!'); } catch(e) {}
      return;
    }

    cdInterval = setInterval(()=>{
      cdSeconds--;
      updateCountdownUI();
      if(cdSeconds <= 0){
        clearInterval(cdInterval);
        cdInterval = null;
        cdRunning = false;
        cdSeconds = 0;
        updateCountdownUI();
        playBeep();
        try { alert('⏰ Tempo encerrado!'); } catch(e) {}
      }
    }, 1000);
  }

  // wrapper que aceita minutos ou segundos ou hh:mm:ss
  function cdStart(input){
    const secs = parseTimeToSeconds(input);
    cdStartFromSeconds(secs);
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

  // ========== Utilitários ==========
  function parseTimeToSeconds(input){
    // aceita número (segundos), número em minutos (se sinalizamos min), ou strings "mm:ss" ou "hh:mm:ss"
    if(input == null) return 0;
    if(typeof input === 'number' && !isNaN(input)) return Math.max(0, Math.floor(input));
    const s = String(input).trim();
    if(/^\d+$/.test(s)) return parseInt(s, 10); // segundos diretos
    const parts = s.split(':').map(p => parseInt(p,10));
    if(parts.length === 3) return parts[0]*3600 + (parts[1]||0)*60 + (parts[2]||0);
    if(parts.length === 2) return parts[0]*60 + (parts[1]||0);
    return 0;
  }

  // ========== Expor funções globais (compatibilidade) ==========
  // startTimerGlobal: origem ambígua em alguns projetos — aqui trataremos:
  // se passar "minutes" como número inteiro >=1, interpretamos como MINUTOS -> convert to seconds
  // se quiser passar segundos, basta passar Number de segundos diretamente (ex: 90)
  window.startTimerGlobal = function(arg){
    // se é número >= 60 -> consideramos que pode ser segundos; mas para compatibilidade antiga, se é pequeno (<= 300) = minutos?
    // Para ser previsível: se quiser iniciar o cronômetro com X minutos, chame startTimerGlobal({minutes: 5})
    if(typeof arg === 'object' && arg !== null && 'minutes' in arg){
      const mins = Math.max(0, Math.floor(Number(arg.minutes) || 0));
      swSeconds = mins * 60;
    } else if(typeof arg === 'number' && arg > 0){
      // se foi passado um número e for pequeno (< 1000), assumimos segundos
      swSeconds = Math.max(0, Math.floor(arg));
    }
    updateStopwatchUI();
    swStart();
  };

  window.pauseTimerGlobal = swPause;
  window.resetTimerGlobal = swReset;

  window.startCountdownGlobal = function(input){ cdStart(input); };
  window.pauseCountdownGlobal = cdStop;
  window.resetCountdownGlobal = cdReset;

  // Atalhos por clique (genéricos): tenta detectar botões com ids padrão
  document.addEventListener('click', function(e){
    const target = e.target;
    if(!target) return;

    // Se o botão tiver data-action em vez de id, funciona também
    const action = target.dataset && target.dataset.action ? target.dataset.action : target.id;

    if(action === 'start') swStart();
    else if(action === 'pause') swPause();
    else if(action === 'reset') swReset();
    else if(action === 'startCountdown') {
      // se o botão tem data-seconds ou data-minutes, respeita
      const secs = target.dataset.seconds || target.dataset.minutes || null;
      if(secs) window.startCountdownGlobal(secs);
    }
  });

  // Inicializa displays ao carregar
  document.addEventListener('DOMContentLoaded', function(){
    updateStopwatchUI();
    updateCountdownUI();
  });

})();
