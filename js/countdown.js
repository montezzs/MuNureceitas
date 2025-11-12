// js/countdown.js
// Widget de contagem rápida na index - usa window.startCountdownGlobal quando disponível
(function(){
  // Variável local para prevenir múltiplos intervals caso o fallback seja usado
  let localIntervalId = null;

  function formatMMSSFromSeconds(s){
    s = Math.max(0, Math.floor(s));
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const sec = (s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  }

  // Função fallback caso window.startCountdownGlobal não exista
  function startLocalCountdown(minutes, displayEl){
    // limpa intervalos anteriores
    if(localIntervalId) {
      clearInterval(localIntervalId);
      localIntervalId = null;
    }
    const mins = Math.max(0, Math.floor(Number(minutes) || 0));
    let sec = mins * 60;
    if(displayEl) displayEl.textContent = formatMMSSFromSeconds(sec);

    if(sec <= 0){
      try { alert('⏰ Tempo encerrado!'); } catch(e){}
      return;
    }

    localIntervalId = setInterval(()=>{
      sec--;
      if(displayEl) displayEl.textContent = formatMMSSFromSeconds(sec);
      if(sec <= 0){
        clearInterval(localIntervalId);
        localIntervalId = null;
        try { alert('⏰ Tempo encerrado!'); } catch(e){}
      }
    }, 1000);
  }

  // Aguarda DOM pronto para registrar handlers
  document.addEventListener('DOMContentLoaded', function(){
    const startBtn = document.getElementById('startCountdown') || document.querySelector('[data-action="startCountdown"]');
    const input = document.getElementById('countMinutes') || document.querySelector('[data-count-minutes]');
    const display = document.getElementById('countdownDisplay') || document.querySelector('.countdownDisplay, #countdownDisplay');

    if(!startBtn) return; // sem botão, nada a fazer

    startBtn.addEventListener('click', function(){
      const raw = input ? input.value : startBtn.dataset && startBtn.dataset.minutes;
      // tenta interpretar "mm:ss" também: se contiver ":" vamos passar como string para a função global que a parseia
      const isTimeString = typeof raw === 'string' && raw.indexOf(':') !== -1;

      if(window.startCountdownGlobal && typeof window.startCountdownGlobal === 'function'){
        // se a função global existe, use-a; preferir passar string "mm:ss" ou número de segundos
        if(isTimeString) {
          window.startCountdownGlobal(raw); // timer.js parseia "mm:ss" ou "hh:mm:ss"
        } else {
          // se o input for numérico interpretamos como MINUTOS para o widget rápido
          const mins = Math.max(0, Number(raw) || 0);
          // convert to seconds to keep behaviour consistent
          window.startCountdownGlobal(mins * 60);
        }
      } else {
        // fallback local
        const mins = isTimeString ? 0 : Math.max(0, Number(raw) || 0);
        startLocalCountdown(mins, display);
      }
    });
  });

})();
