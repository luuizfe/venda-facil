const loginForm = document.getElementById("loginForm");
const erroLogin = document.getElementById("erroLogin");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch("http://localhost:8080/api/administradores/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        if(response.ok){
            const admin = await response.json();
            // Salva no sessionStorage para controle de acesso ao backoffice
            sessionStorage.setItem("adminLogado", JSON.stringify(admin));
            window.location.href = "backoffice.html"; // redireciona
        } else {
            erroLogin.classList.remove("d-none");
        }

    } catch (erro) {
        console.error("Erro no login:", erro);
        erroLogin.classList.remove("d-none");
    }
});
