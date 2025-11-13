
// 🍋 QUIZ DE RECEITAS — Versão com trava de cliques (feito com ajuda da IA)
const perguntas = [
    {
        pergunta: "Qual desses ingredientes é essencial para fazer um bolo crescer?",
        opcoes: ["Açúcar", "Fermento", "Manteiga", "Essência de baunilha"],
        correta: 1
    },
    {
        pergunta: "Qual é o ingrediente principal de um pudim?",
        opcoes: ["Farinha", "Leite condensado", "Café", "Fermento"],
        correta: 1
    },
    {
        pergunta: "Qual desses é um bolo típico de festas juninas?",
        opcoes: ["Bolo de cenoura", "Bolo de milho", "Bolo de chocolate", "Bolo de laranja"],
        correta: 1
    },
    {
        pergunta: "Qual desses ingredientes é usado para fazer chantilly?",
        opcoes: ["Leite", "Creme de leite fresco", "Farinha", "Ovo"],
        correta: 1
    }
];

let perguntaAtual = 0;
let bloqueado = false; // 🔒 impede múltiplos cliques

function carregarPergunta() {
    const q = perguntas[perguntaAtual];
    const pergunta = document.getElementById("pergunta");
    const opcoesDiv = document.getElementById("opcoes");
    const msg = document.getElementById("mensagem");

    pergunta.textContent = q.pergunta;
    msg.textContent = "";
    opcoesDiv.innerHTML = "";
    bloqueado = false; // desbloqueia para nova pergunta

    q.opcoes.forEach((texto, i) => {
        const btn = document.createElement("button");
        btn.textContent = texto;
        btn.style.margin = "6px";
        btn.onclick = () => verificarResposta(i === q.correta, btn);
        opcoesDiv.appendChild(btn);
    });
}

function verificarResposta(correto, botaoClicado) {
    if (bloqueado) return; // se já respondeu, ignora
    bloqueado = true; // trava os botões

    const msg = document.getElementById("mensagem");
    const body = document.body;
    const botoes = document.querySelectorAll("#opcoes button");

    // Desativa todos os botões após o clique
    botoes.forEach(b => b.disabled = true);

    if (correto) {
        msg.textContent = "✅ Resposta certa!";
        msg.style.color = "green";
        botaoClicado.style.backgroundColor = "#8eff8e";
        body.style.backgroundColor = "#b5f5b5";
    } else {
        msg.textContent = "❌ Errou! Tente de novo!";
        msg.style.color = "red";
        botaoClicado.style.backgroundColor = "#ff8e8e";
        body.style.backgroundColor = "#ffb5b5";
    }

    // Aguarda 2 segundos antes de mostrar a próxima pergunta
    setTimeout(() => {
        body.style.backgroundColor = "";
        perguntaAtual = (perguntaAtual + 1) % perguntas.length;
        carregarPergunta();
    }, 2000);
}

window.onload = carregarPergunta;

