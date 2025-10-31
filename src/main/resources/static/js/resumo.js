let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
const resumoItens = document.getElementById("resumoItens");
const totalResumo = document.getElementById("totalResumo");
const finalizarPedido = document.getElementById("finalizarPedido");

function renderizarResumo() {
    resumoItens.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;

        const div = document.createElement("div");
        div.className = "resumo-item d-flex justify-content-between align-items-center mb-3";
        div.innerHTML = `
            <span>
                ${item.nome} 
                <button class="btn-qty btn-sm" data-index="${index}" data-action="menos">-</button>
                ${item.quantidade}
                <button class="btn-qty btn-sm" data-index="${index}" data-action="mais">+</button>
            </span>
            <span>
                R$ ${(item.preco * item.quantidade).toFixed(2)}
                <button class="btn-remove-item btn btn-sm btn-danger ms-2" data-index="${index}">✖</button>
            </span>
        `;
        resumoItens.appendChild(div);
    });

    totalResumo.textContent = total.toFixed(2);

    // Botão remover item
    document.querySelectorAll(".btn-remove-item").forEach(btn => {
        btn.addEventListener("click", e => {
            const idx = e.target.dataset.index;
            carrinho.splice(idx, 1);
            salvarResumo();
        });
    });

    // Botões de quantidade
    document.querySelectorAll(".btn-qty").forEach(btn => {
        btn.addEventListener("click", e => {
            const idx = e.target.dataset.index;
            const acao = e.target.dataset.action;
            const item = carrinho[idx];

            if(acao === "mais") {
                if(item.quantidade < item.estoque) item.quantidade++;
                else alert("Não é possível adicionar mais que o estoque.");
            } else if(acao === "menos") {
                item.quantidade--;
                if(item.quantidade <= 0) carrinho.splice(idx, 1);
            }
            salvarResumo();
        });
    });
}

// Salvar no localStorage e atualizar visual
function salvarResumo() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderizarResumo();
}

// Finalizar pedido
finalizarPedido.addEventListener("click", () => {
    if(carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    alert("Pedido finalizado com sucesso!");
    carrinho = [];
    salvarResumo();
    window.location.href = "index.html"; // volta para a home
});

// Inicialização
document.addEventListener("DOMContentLoaded", renderizarResumo);
