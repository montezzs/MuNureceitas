// js/countdown.js
// Pequeno script para o widget de contagem rápida na index.
// Agora usa startCountdownGlobal para evitar sobreposição.

(function(){
  const startBtn = document.getElementById('startCountdown');
  const input = document.getElementById('countMinutes');
  const display = document.getElementById('countdownDisplay');

  if(!startBtn || !display || !input) return;

  startBtn.addEventListener('click', function(){
    const mins = Math.max(0, Number(input.value) || 0);
    // Usa função central (limpa intervalos anteriores e toca som)
    if(window.startCountdownGlobal){
      window.startCountdownGlobal(mins);
    } else {
      // fallback simples (não esperado)
      let sec = mins * 60;
      display.textContent = `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;
      let id = setInterval(()=>{
        sec--;
        display.textContent = `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;
        if(sec <= 0){ clearInterval(id); try { alert('⏰ Tempo encerrado!'); } catch(e){} }
      }, 1000);
    }
  });
})();
