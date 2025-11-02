const pedidosTableBody = document.querySelector("#pedidosTable tbody");

// Carregar todos os pedidos
async function carregarPedidos() {
    try {
        const res = await fetch("http://localhost:8080/api/pedidos");
        const pedidos = await res.json();

        pedidosTableBody.innerHTML = "";

        pedidos.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.idPedido}</td>
                <td>${p.numeroPedido}</td>
                <td>R$ ${p.valorPedido.toFixed(2)}</td>
                <td>${new Date(p.dataCriacao).toLocaleString()}</td>
                <td>${p.aceito === null ? "Pendente" : (p.aceito ? "Aceito" : "Recusado")}</td>
                <td>
                    ${p.produtos.map(prod => prod.nome).join(", ")}
                </td>
                <td>
                    ${p.aceito === null ? `
                    <button class="btn btn-success btn-sm btn-aceitar" data-id="${p.idPedido}">Aceitar</button>
                    <button class="btn btn-danger btn-sm btn-recusar ms-1" data-id="${p.idPedido}">Recusar</button>
                    ` : ""}
                </td>
            `;
            pedidosTableBody.appendChild(tr);
        });

        ativarAcoes();
    } catch (e) {
        console.error("Erro ao carregar pedidos:", e);
    }
}

// Ativar botões Aceitar / Recusar
function ativarAcoes() {
    document.querySelectorAll(".btn-aceitar").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            await fetch(`http://localhost:8080/api/pedidos/${id}/aceitar`, { method: "POST" });
            carregarPedidos();
        });
    });

    document.querySelectorAll(".btn-recusar").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            await fetch(`http://localhost:8080/api/pedidos/${id}/recusar`, { method: "POST" });
            carregarPedidos();
        });
    });
}

// Inicialização
document.addEventListener("DOMContentLoaded", carregarPedidos);
