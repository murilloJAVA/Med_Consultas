document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.querySelector("input[type='email']").value;
        const senha = document.querySelector("input[type='password']").value;

        if (email && senha) {
            localStorage.setItem("usuario", email);
            window.location.href = "index.html";
        } else {
            alert("Preencha todos os campos!");
        }
    });
});