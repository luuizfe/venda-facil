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

        if (response.ok) {
            const data = await response.json();

            // Salva admin e token
            sessionStorage.setItem("adminLogado", JSON.stringify(data.admin));
            sessionStorage.setItem("tokenAdmin", data.token);

            window.location.href = "backoffice.html";
        } else {
            erroLogin.classList.remove("d-none");
        }

    } catch (erro) {
        console.error("Erro no login:", erro);
        erroLogin.classList.remove("d-none");
    }
});
