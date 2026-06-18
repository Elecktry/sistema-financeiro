const lista = document.getElementById("lista");

// criar uma variavel para o saldo e define o valor para 0s
let saldo = 0;

let movimentacoes =
    JSON.parse(
        localStorage.getItem("movimentacoes")
    ) || [];

for (const movimentacao of movimentacoes) {
    criarMovimentacao(
        movimentacao.descricao,
        movimentacaovalor
    )
}


function adicionar() {

    const descricaoInput =
        document.getElementById("descricao");

    const valorInput =
        document.getElementById("valor");

    const descricao =
        descricaoInput.value;

    const valor =
        Number(valorInput.value);

    //valida se os campos foram preenchidos corretamente
    if (descricao === "" || valorInput.value === "") {
        alert("Preencha todos os campos.");
        return;
    }



    movimentacoes.push({
        descricao,
        valor
    });

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );

    //chamando a função movimentação 
    criarMovimentacao(descricao, valor);


    //após adicionar um novo item deixa o campo em branco
    //para ser preenchido novamente
    descricaoInput.value = "";
    valorInput.value = "";

    //volta o cursor do mouse para descrição após adicionar
    //uma nova alteração
    descricaoInput.focus();
}


function criarMovimentacao(descricao, valor) {

    const item = document.createElement("li");
    const botao = document.createElement("button");

    //monta a exibição dos item pela descrição + valor
    //e insere um botao de excluir logo no final do item
    item.textContent =
        `${descricao} - R$ ${valor.toFixed(2)}`;

    botao.textContent = "Excluir";

    // ul =  listaa
    // └── li = item
    //     └── button = botão de exclusão
    item.appendChild(botao);
    lista.appendChild(item);

    //função do botão excluir
    botao.addEventListener("click", function () {

        saldo -= valor;

        document.getElementById("saldo").textContent =
            `R$ ${saldo.toFixed(2)}`;

        movimentacoes = movimentacoes.filter(function (mov) {

            return !(
                mov.descricao === descricao &&
                mov.valor === valor
            );

        });

        localStorage.setItem(
            "movimentacoes",
            JSON.stringify(movimentacoes)
        );

        item.remove();

    });

    //soma o valor de cada item adicionado na lista
    saldo += valor;

    // Atualiza o saldo exibido na tela
    document.getElementById("saldo").textContent =
        `R$ ${saldo.toFixed(2)}`;

}

