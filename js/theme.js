// js/theme.js - apply dark mode and persist it
(function(){
  const key = 'mnu_theme_final_v1';
  const root = document.documentElement;
  function apply(t){ if(t==='dark') root.classList.add('dark'); else root.classList.remove('dark'); }
  function makeButton(){
    const header = document.querySelector('.site-header'); if(!header) return;
    let btn = document.getElementById('themeBtn');
    if(!btn){ btn = document.createElement('button'); btn.id='themeBtn'; btn.className='theme-toggle'; header.appendChild(btn); }
    btn.addEventListener('click', ()=>{
      const cur = localStorage.getItem(key) || 'light'; const next = cur==='light' ? 'dark' : 'light';
      localStorage.setItem(key, next); apply(next); btn.textContent = next==='dark' ? 'Modo Claro' : 'Modo Escuro';
    });
    const cur = localStorage.getItem(key) || 'light'; btn.textContent = cur==='dark' ? 'Modo Claro' : 'Modo Escuro';
  }
  apply(localStorage.getItem(key) || 'light');
  document.addEventListener('DOMContentLoaded', makeButton);
})();