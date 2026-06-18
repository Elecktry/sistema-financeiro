const lista = document.getElementById("lista");

let saldo = 0;

function adicionar() {

    //FORMULARIO DE PREENCHIMENTO

    const descricaoInput =
        document.getElementById("descricao");

    const valorInput =
        document.getElementById("valor");

    const descricao =
        descricaoInput.value;

    const valor =
        Number(valorInput.value);

    if (descricao === "" || valorInput.value === "") {
        alert("Preencha todos os campos.");
        return;
    }

    //LISTA DE ITEMS

    const item = document.createElement("li");
    const botao = document.createElement("button");

    item.textContent =
        `${descricao} - R$ ${valor.toFixed(2)}`;

    botao.textContent = "Excluir";

    item.appendChild(botao);

    lista.appendChild(item);


    botao.addEventListener("click", function() {
        
        saldo -= valor  

        document.getElementById("saldo").textContent =
            `R$ ${saldo.toFixed(2)}`;

        item.remove();
    
    });


    saldo += valor;

    document.getElementById("saldo").textContent =
        `R$ ${saldo.toFixed(2)}`;

    descricaoInput.value = "";
    valorInput.value = "";

    descricaoInput.focus();

    


}
