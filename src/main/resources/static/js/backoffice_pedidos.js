async function validarAcessoBackoffice() {
    const token = sessionStorage.getItem("tokenAdmin");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/administradores/login/validar", {
            method: "GET",
            headers: {
                "X-Admin-Auth": token
            }
        });

        if (!response.ok) {
            sessionStorage.clear();
            window.location.href = "login.html";
        }

    } catch (erro) {
        sessionStorage.clear();
        window.location.href = "login.html";
    }
}
validarAcessoBackoffice();


const pedidosTableBody = document.querySelector("#pedidosTable tbody");

// Carregar todos os pedidos
async function carregarPedidos() {
    try {
        const res = await fetch("http://localhost:8080/api/pedidos"); // ajuste se o endpoint tiver /api
        const pedidos = await res.json();

        pedidosTableBody.innerHTML = "";

        pedidos.forEach(p => {
            const tr = document.createElement("tr");

            // Converte o enum para texto amigável
            let statusTexto = "";
            switch (p.status) {
                case "ACEITO":
                    statusTexto = "Aceito";
                    break;
                case "RECUSADO":
                    statusTexto = "Recusado";
                    break;
                default:
                    statusTexto = "Pendente";
            }

            tr.innerHTML = `
                <td>${p.idPedido}</td>
                <td>${p.numeroPedido}</td>
                <td>R$ ${p.valorPedido.toFixed(2)}</td>
                <td>${new Date(p.dataCriacao).toLocaleString()}</td>
                <td>${statusTexto}</td>
                <td>${p.produtos.map(prod => prod.nome).join(", ")}</td>
                <td>
                    ${p.status === "PENDENTE" ? `
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
            await atualizarStatus(id, "ACEITO");
        });
    });

    document.querySelectorAll(".btn-recusar").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            await atualizarStatus(id, "RECUSADO");
        });
    });
}

// Função genérica para atualizar o status
async function atualizarStatus(id, novoStatus) {
    try {
        const res = await fetch(`http://localhost:8080/api/pedidos/${id}/status?status=${novoStatus}`, {
            method: "PUT"
        });

        if (!res.ok) {
            console.error(`Erro ao atualizar status do pedido ${id}:`, res.status);
            return;
        }

        await carregarPedidos();
    } catch (e) {
        console.error("Erro ao atualizar status:", e);
    }
}

// Inicialização
document.addEventListener("DOMContentLoaded", carregarPedidos);
