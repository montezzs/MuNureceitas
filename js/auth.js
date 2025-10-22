// js/auth.js - simulated auth for demo
(function () {
  const f = document.getElementById('loginForm'); if (!f) return;
  f.addEventListener('submit', (e) => {
    e.preventDefault(); const user = f.querySelector('#user')?.value || ''; const pass = f.querySelector('#pass')?.value || '';
    const msg = document.getElementById('loginMsg');
    if (user.length >= 3 && pass.length >= 3) {
      msg.textContent = 'Bem-vindo(a), ' + user + '! (login simulado)';
      msg.style.color = 'green'; f.reset();
    } else {
      msg.textContent = 'Credenciais inválidas'; msg.style.color = 'crimson';
    }
  });
})();