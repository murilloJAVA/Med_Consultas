document.addEventListener("DOMContentLoaded", () => {
    const total = document.querySelector("#total-consultas");
    const proxima = document.querySelector("#proxima-consulta");

    let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

    consultas.sort((a,b)=> new Date(a.data)-new Date(b.data));

    if (total) total.textContent = consultas.length;

    if (proxima) {
        if (consultas.length > 0) {
            proxima.textContent = "Próxima: " + consultas[0].nome + " - " + consultas[0].data;
        } else {
            proxima.textContent = "Nenhuma consulta agendada";
        }
    }
});