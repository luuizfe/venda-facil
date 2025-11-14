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

            if (acao === "mais") {
                if (item.quantidade < item.estoque) item.quantidade++;
                else alert("Não é possível adicionar mais que o estoque.");
            } else if (acao === "menos") {
                item.quantidade--;
                if (item.quantidade <= 0) carrinho.splice(idx, 1);
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

// --- Finalizar pedido ---
finalizarPedido.addEventListener("click", async () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const valorTotal = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

    const pedido = {
        numeroPedido: Math.floor(Math.random() * 1000000), // exemplo de número gerado
        valorPedido: valorTotal,
        produtos: carrinho
    };

    try {
        // Envia para backend
        const response = await fetch("http://localhost:8080/api/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });

        if (response.ok) {
            alert("Pedido finalizado com sucesso!");

// --- Envia para WhatsApp de forma legível ---
            let mensagem = `📦 *Resumo do Pedido* 📦\n\n`;
            mensagem += `Número do Pedido: ${pedido.numeroPedido}\n\n`;
            pedido.produtos.forEach((item, i) => {
                mensagem += `${i+1}. ${item.nome}\n`;
                mensagem += `   Quantidade: ${item.quantidade}\n`;
                mensagem += `   Preço unitário: R$ ${item.preco.toFixed(2)}\n`;
                mensagem += `   Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}\n\n`;
            });
            mensagem += `💰 *Total: R$ ${pedido.valorPedido.toFixed(2)}*`;

            mensagem +=`\n\nNome: ${document.getElementById("nome").value}
                        \nNumeros de contato: ${document.getElementById("number").value}
                        \nObservações: ${document.getElementById("obs").value}`;

            const numeroWhats = "5511939084480";
            const urlWhats = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;
            window.open(urlWhats, "_blank");

            // Limpa carrinho e volta para home
            localStorage.removeItem("carrinho");
            window.location.href = "index.html";
        } else {
            alert("Erro ao enviar pedido. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao enviar pedido:", error);
        alert("Não foi possível finalizar o pedido. Verifique sua conexão.");
    }
});

// Inicialização
document.addEventListener("DOMContentLoaded", renderizarResumo);
