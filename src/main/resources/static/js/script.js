// URL da API do backend
const API_URL = "http://localhost:8080/api/produtos";

// Lista de produtos
let produtos = [];

// Carrinho salvo no localStorage
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Referências do DOM
const produtosContainer = document.getElementById("produtosContainer");
const carrinhoOverlay = document.getElementById("carrinhoOverlay");
const carrinhoItens = document.getElementById("carrinhoItens");
const totalCarrinho = document.getElementById("totalCarrinho");
const carrinhoBtn = document.getElementById("carrinhoBtn");
const fecharCarrinho = document.getElementById("fecharCarrinho");
const finalizarCompraBtn = document.getElementById("finalizarCompra");
const searchBar = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// 🔹 Carrega os produtos do backend
async function carregarProdutos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro na resposta da API");
        produtos = await response.json();
        renderizarProdutos();
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        produtosContainer.innerHTML = `<p class="text-danger text-center">Erro ao carregar produtos.</p>`;
    }
}

// 🔹 Renderiza os cards de produtos
function renderizarProdutos() {
    produtosContainer.innerHTML = produtos.map((p, i) => `
        <div class="col">
            <div class="card h-100">

                <img src="${p.imagemPadrao}" 
                     class="card-img-top" 
                     alt="Imagem do Produto" 
                     style="height: 180px; object-fit: cover;">

                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.nome}</h5>
                    <p class="card-text">${p.descricao || "Sem descrição."}</p>
                    <p class="fw-bold">R$ ${p.preco.toFixed(2)}</p>
                    <p>Estoque: ${p.estoque}</p>

                    <button class="btn btn-add-cart mt-auto" data-index="${i}">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".btn-add-cart").forEach(btn => {
        btn.addEventListener("click", e => {
            const produto = produtos[e.target.dataset.index];
            adicionarAoCarrinho(produto);
        });
    });
}

// 🔹 Renderiza os cards de produtos buscados por nome ou categoria
function renderizarProdutosBuscados() {
    if (!searchBar.value){
        renderizarProdutos();
    }
    produtosContainer.innerHTML = "";
    produtos.map((p, i) => {
        const termo = document.getElementById("searchInput").value.trim().toLowerCase();

        if (
            p.nome.toLowerCase().includes(termo) ||
            (p.descricao && p.descricao.toLowerCase().includes(termo))
        )
        {
            produtosContainer.innerHTML =
                produtosContainer.innerHTML +
                `
        <div class="col">
            <div class="card h-100">

                <img src="${p.imagemPadrao}" 
                     class="card-img-top" 
                     alt="Imagem do Produto" 
                     style="height: 180px; object-fit: cover;">

                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.nome}</h5>
                    <p class="card-text">${p.descricao || "Sem descrição."}</p>
                    <p class="fw-bold">R$ ${p.preco.toFixed(2)}</p>
                    <p>Estoque: ${p.estoque}</p>

                    <button class="btn btn-add-cart mt-auto" data-index="${i}">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    `;
        }
    });

    document.querySelectorAll(".btn-add-cart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const produto = produtos[e.target.dataset.index];
            adicionarAoCarrinho(produto);
        });
    });
}


// 🔹 Adiciona um produto ao carrinho
function adicionarAoCarrinho(produto) {
    const item = carrinho.find(p => p.id === produto.id);
    if (item) {
        if (item.quantidade < produto.estoque) item.quantidade++;
        else return alert("Estoque insuficiente!");
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    salvarCarrinho();
    mostrarMensagem("Produto adicionado!");
}

// 🔹 Renderiza o carrinho
function renderizarCarrinho() {
    carrinhoItens.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, i) => {
        total += item.preco * item.quantidade;
        carrinhoItens.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${item.nome} (${item.quantidade}x)</span>
                <span>R$ ${(item.preco * item.quantidade).toFixed(2)}
                    <button class="btn btn-sm btn-danger" data-index="${i}">✖</button>
                </span>
            </div>
        `;
    });

    totalCarrinho.textContent = total.toFixed(2);

    // Remover item
    document.querySelectorAll(".btn-danger").forEach(btn => {
        btn.addEventListener("click", e => {
            const idx = e.target.dataset.index;
            carrinho.splice(idx, 1);
            salvarCarrinho();
        });
    });
}

// 🔹 Salva o carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderizarCarrinho();
}

// 🔹 Mensagem de feedback
function mostrarMensagem(texto) {
    const msg = document.createElement("div");
    msg.textContent = texto;
    msg.style.cssText = `
        position: fixed; top: 10px; right: 10px;
        background: #f2d3da; color: black;
        padding: 8px 12px; border-radius: 6px;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
        z-index: 1000;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// 🔹 Mostrar carrinho
carrinhoBtn.addEventListener("click", () => {
    carrinhoOverlay.classList.remove("d-none");
    renderizarCarrinho();
});

// 🔹 Fechar carrinho
fecharCarrinho.addEventListener("click", () => {
    carrinhoOverlay.classList.add("d-none");
});

// 🔹 Finalizar compra
finalizarCompraBtn.addEventListener("click", () => {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    window.location.href = "resumo.html";
});

// 🔹 Inicializa ao carregar
document.addEventListener("DOMContentLoaded", carregarProdutos);

//Gatilho da barra de busca
searchButton.addEventListener("click", renderizarProdutosBuscados);

// 🔹 Busca em tempo real (sem botão)
searchBar.addEventListener("keyup", () => {
    renderizarProdutosBuscados();
});
