// js/backToTop.js - button that appears when scrolling
(function(){
  const btn = document.createElement('button'); btn.id='backToTop'; btn.title='Voltar ao topo'; btn.innerHTML='↑'; document.body.appendChild(btn);
  btn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll', ()=>{ btn.style.display = window.scrollY>300 ? 'block' : 'none'; }, {passive:true});
})();