document.addEventListener("DOMContentLoaded", () => {

    const btnNova = document.querySelector("#btn-nova-consulta");
    const form = document.querySelector("#form-consulta");
    const lista = document.querySelector("#lista-consultas");

    let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

    // MOSTRAR / ESCONDER FORM
    btnNova.addEventListener("click", () => {
        form.style.display = form.style.display === "none" ? "block" : "none";
    });

    // RENDERIZAR CONSULTAS
    function renderizar() {
        lista.innerHTML = "";

        consultas.forEach((c, index) => {
            const item = document.createElement("div");
            item.classList.add("consulta-item");

            item.innerHTML = `            
            <div class="consulta">
                <div class="info">
                    <h4><span class="tag"> ${c.nome} </span></h4>
                    <p>📅<span>${c.data}</span></p>
                    <p>⏰<span>${c.hora}</span></p>
                    <p>📍<span>${c.local}</span></p>
                </div>
                <span data-index="${index}" 
                    class="btn-delete"
                    style="cursor:pointer; margin-left:10px;">
                    🗑️
                </span>
            </div>
            `
            ;

            lista.appendChild(item);
        });

        // EVENTO DE EXCLUIR
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const i = e.target.getAttribute("data-index");
                consultas.splice(i, 1);
                salvar();
            });
        });
    }

    // SALVAR NO LOCALSTORAGE
    function salvar() {
        localStorage.setItem("consultas", JSON.stringify(consultas));
        renderizar();
    }

    // SUBMIT DO FORM
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.querySelector("#nome").value;
        const data = document.querySelector("#data").value;
        const hora = document.querySelector("#hora").value;
        const local  = document.querySelector("#local").value;

        if (!nome || !data) {
            alert("Preencha os campos!");
            return;
        }

        consultas.push({ nome, data, hora, local});

        // ordenar por data (melhora MUITO o projeto)
        consultas.sort((a, b) => new Date(a.data) - new Date(b.data));

        salvar();

        form.reset();
        form.style.display = "none";
    });

    renderizar();
});