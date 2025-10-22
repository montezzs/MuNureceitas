// js/mouseEffects.js - subtle cursor dot
(function(){
  const d = document.createElement('div'); 
  d.style.position='fixed'; 
  d.style.width='10px'; 
  d.style.height='10px'; 
  d.style.borderRadius='50%';
  d.style.pointerEvents='none'; 
  d.style.zIndex='10000'; 
  d.style.background='var(--accent)';
   d.style.boxShadow='0 6px 18px rgba(31,111,255,0.12)';
  document.body.appendChild(d); 
  window.addEventListener('mousemove',(e)=>{ d.style.left=e.clientX+'px'; d.style.top=e.clientY+'px'; });
})();