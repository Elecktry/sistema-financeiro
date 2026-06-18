const lista = document.getElementById("lista");

let saldo = 0;

function adicionar() {

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

    const item = document.createElement("li");

    item.textContent =
        `${descricao} - R$ ${valor.toFixed(2)}`;

    lista.appendChild(item);

    saldo += valor;

    document.getElementById("saldo").textContent =
        `R$ ${saldo.toFixed(2)}`;

    descricaoInput.value = "";
    valorInput.value = "";

    descricaoInput.focus();
}
