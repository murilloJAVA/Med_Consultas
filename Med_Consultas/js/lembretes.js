document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("input");
    const btn = document.querySelector("button");
    const lista = document.querySelector("#lista-lembretes");

    let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];

    function render(){
        if (!lista) return;
        lista.innerHTML = "";
        lembretes.forEach((l,i)=>{
            const li = document.createElement("li");
            li.innerHTML = `${l} <button onclick="rem(${i})">X</button>`;
            lista.appendChild(li);
        });
    }

    window.rem = function(i){
        lembretes.splice(i,1);
        localStorage.setItem("lembretes", JSON.stringify(lembretes));
        render();
    }

    if (btn){
        btn.addEventListener("click", ()=>{
            lembretes.push(input.value);
            localStorage.setItem("lembretes", JSON.stringify(lembretes));
            input.value="";
            render();
        });
    }

    render();
});