// js/recipeUtils.js
// Helper para as páginas de receita (copiar ingredientes a partir da receita)

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

})();
