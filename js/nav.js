// js/nav.js - mobile toggle + active link highlight
(function(){
  const t = document.getElementById('navToggle'); if(t){ t.addEventListener('click', ()=> document.body.classList.toggle('nav-open')); t.addEventListener('mousedown',(e)=>e.preventDefault()); }
  const cur = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a=>{ if(a.getAttribute('href')===cur) a.classList.add('active'); });
})();