// --- Controle de sessão ---
const sessao = JSON.parse(sessionStorage.getItem("adminLogado"));
if (!sessao) {
    window.location.href = "login.html";
} else {
    document.getElementById("adminNome").textContent = sessao.nome;
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("adminLogado");
    window.location.href = "login.html";
});

// --- Carregamento de produtos ---
const produtosTableBody = document.querySelector("#produtosTable tbody");

async function carregarProdutos() {
    try {
        const res = await fetch("http://localhost:8080/api/produtos");
        const produtos = await res.json();

        produtosTableBody.innerHTML = "";
        produtos.forEach(p => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td class="td-nome" data-id="${p.id}">${p.nome}</td>
                <td class="td-marca" data-id="${p.id}">${p.marca}</td>
                <td class="td-preco" data-id="${p.id}">R$ ${p.preco.toFixed(2)}</td>

                <td>
                    <input type="number" 
                        value="${p.estoque}" 
                        min="0" 
                        data-id="${p.id}"
                        class="input-estoque">
                </td>

                <!-- STATUS COM SELECT (visual antigo restaurado) -->
                <td>
                    <select class="select-status" data-id="${p.id}">
                        <option value="DISPONIVEL" ${p.status === "DISPONIVEL" ? "selected" : ""}>DISPONÍVEL</option>
                        <option value="INDISPONIVEL" ${p.status === "INDISPONIVEL" ? "selected" : ""}>INDISPONÍVEL</option>
                    </select>
                </td>

                <td>
                    <button class="btn-salvar" data-id="${p.id}">Salvar</button>
                    <button class="btn-excluir" data-id="${p.id}">Excluir</button>
                </td>
            `;

            produtosTableBody.appendChild(tr);
        });

        ativarAcoesProdutos();
    } catch (e) {
        console.error("Erro ao carregar produtos:", e);
    }
}

function ativarAcoesProdutos() {

    // SALVAR ALTERAÇÕES
    document.querySelectorAll(".btn-salvar").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            const nome = document.querySelector(`.td-nome[data-id="${id}"]`).textContent;
            const marca = document.querySelector(`.td-marca[data-id="${id}"]`).textContent;
            const precoTexto = document.querySelector(`.td-preco[data-id="${id}"]`).textContent.replace("R$", "").trim();
            const preco = parseFloat(precoTexto);
            const estoque = parseInt(document.querySelector(`.input-estoque[data-id="${id}"]`).value);
            const status = document.querySelector(`.select-status[data-id="${id}"]`).value;

            const body = { nome, marca, preco, estoque, status };

            await fetch(`http://localhost:8080/api/produtos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            alert("Produto atualizado!");
            carregarProdutos();
        });
    });

    // EXCLUIR PRODUTO
    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (confirm("Deseja realmente excluir este produto?")) {
                await fetch(`http://localhost:8080/api/produtos/${btn.dataset.id}`, {
                    method: "DELETE"
                });
                carregarProdutos();
            }
        });
    });
}

carregarProdutos();
