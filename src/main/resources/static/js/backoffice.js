const sessao = JSON.parse(localStorage.getItem("adminSession"));
if(!sessao) window.location.href = "login.html";
else document.getElementById("adminNome").textContent = sessao.nome;

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("adminSession");
    window.location.href = "login.html";
});

const produtosTableBody = document.querySelector("#produtosTable tbody");

async function carregarProdutos() {
    try {
        const res = await fetch("http://localhost:8080/api/produtos");
        const produtos = await res.json();

        produtosTableBody.innerHTML = "";
        produtos.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.nome}</td>
                <td>${p.marca}</td>
                <td>R$ ${p.preco.toFixed(2)}</td>
                <td><input type="number" value="${p.estoque}" min="0" data-id="${p.id}" class="input-estoque"></td>
                <td><button class="btn-excluir" data-id="${p.id}">Excluir</button></td>
            `;
            produtosTableBody.appendChild(tr);
        });

        ativarAcoesProdutos();
    } catch(e) {
        console.error(e);
    }
}

function ativarAcoesProdutos() {
    document.querySelectorAll(".input-estoque").forEach(input => {
        input.addEventListener("change", async (e) => {
            const id = e.target.dataset.id;
            const estoque = parseInt(e.target.value);
            await fetch(`http://localhost:8080/api/produtos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estoque })
            });
            carregarProdutos();
        });
    });

    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.addEventListener("click", async e => {
            if(confirm("Deseja realmente excluir este produto?")) {
                await fetch(`http://localhost:8080/api/produtos/${btn.dataset.id}`, { method: "DELETE" });
                carregarProdutos();
            }
        });
    });
}

carregarProdutos();
