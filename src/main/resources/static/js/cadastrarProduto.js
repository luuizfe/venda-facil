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



const form = document.getElementById('produtoForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const produto = {
        nome: document.getElementById('nome').value,
        marca: document.getElementById('marca').value,
        descricao: document.getElementById('descricao').value,
        preco: parseFloat(document.getElementById('preco').value),          // CORRETO
        estoque: parseInt(document.getElementById('quantidade').value) || 0, // CORRETO
    };

    const formData = new FormData();
    // Converter objeto produto para JSON e enviar como blob
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
            window.location.href = '/html/backoffice.html';
        } else {
            alert('Erro ao cadastrar produto!');
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao conectar com o servidor!');
    }
});
