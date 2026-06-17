const lista = document.getElementById("lista");

function adicionar() {
    const descricao =
        document.getElementById("descricao").value;

    const valor =
        document.getElementById("valor").value;

    const item = document.createElement("li");

    item.textContent =
        `${descricao} - R$ ${valor}`;

    lista.appendChild(item);
}