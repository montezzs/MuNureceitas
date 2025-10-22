// js/recipeUtils.js
// Helpers para as páginas de receita (copiar ingredientes e iniciar contagem regressiva a partir da receita)

(function(){
  // Copiar ingredientes para clipboard
  window.copyIngredients = function(){
    const list = document.querySelector('.ingredients');
    if(!list) return alert('Ingredientes não encontrados.');
    const items = Array.from(list.querySelectorAll('li')).map(li => li.textContent.trim());
    const title = document.querySelector('.recipe-main h2')?.textContent || 'Receita';
    const text = title + '\n\n' + items.map(i => '- ' + i).join('\n');
    navigator.clipboard?.writeText(text).then(()=> alert('Ingredientes copiados!')).catch(()=> alert('Não foi possível copiar.'));
  };

  // Iniciar contagem regressiva a partir da receita (minutes)
  window.startTimerFromRecipe = function(minutes){
    // limpa stopwatch caso esteja rodando (opcional)
    if(window.pauseTimerGlobal) window.pauseTimerGlobal();

    // chama a função de contagem regressiva global (que limpa intervalos anteriores)
    if(window.startCountdownGlobal){
      window.startCountdownGlobal(minutes);
    } else {
      alert('Contador não disponível no momento.');
    }
  };
})();
