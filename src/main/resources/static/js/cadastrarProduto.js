// =====================================================
// 🔒 VALIDAR ACESSO DO ADMIN
// =====================================================
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


// =====================================================
// 💲 FORMATAÇÃO AUTOMÁTICA DO CAMPO DE PREÇO
// =====================================================

const precoInput = document.getElementById("preco");

precoInput.addEventListener("input", () => {
    let valor = precoInput.value.replace(/\D/g, ""); // remover tudo que não é número

    if (valor.length === 0) {
        precoInput.value = "";
        return;
    }

    // transforma para decimal
    valor = (valor / 100).toFixed(2);

    // formata para padrão brasileiro
    valor = valor.replace(".", ",");

    precoInput.value = `R$ ${valor}`;
});


// =====================================================
// 📦 CADASTRAR PRODUTO
// =====================================================

const form = document.getElementById('produtoForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Converter o valor formatado (R$ XX,XX) para número puro
    const precoConvertido = parseFloat(
        precoInput.value
            .replace("R$", "")
            .replace(/\s/g, "")
            .replace(",", ".")
    );

    const produto = {
        nome: document.getElementById('nome').value,
        marca: document.getElementById('marca').value,
        descricao: document.getElementById('descricao').value,
        preco: precoConvertido, // valor 100% correto para o backend
        estoque: parseInt(document.getElementById('quantidade').value) || 0,
    };

    const formData = new FormData();
    formData.append('produto', new Blob([JSON.stringify(produto)], { type: "application/json" }));

    const imagens = document.getElementById('imagens').files;
    for (let i = 0; i < imagens.length; i++) {
        formData.append('imagens', imagens[i]);
    }

    try {
        const response = await fetch('http://localhost:8080/api/produtos', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
            window.location.reload();
        } else {
            alert('Erro ao cadastrar produto!');
        }

    } catch (err) {
        console.error(err);
        alert('Erro ao conectar com o servidor!');
    }
});
