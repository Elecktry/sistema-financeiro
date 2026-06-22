const lista = document.getElementById("lista");

// Recupera as movimentações salvas no navegador.
// Caso não exista nada salvo, inicia com um array vazio.
let movimentacoes =
    JSON.parse(
        localStorage.getItem("movimentacoes")
    ) || [];

for (const movimentacao of movimentacoes) {
    criarMovimentacao(
        movimentacao.descricao,
        movimentacao.valor,
        movimentacao.tipo,
        movimentacao.id
    );
}

atualizarSaldo()


// adicionar()
// ├── pega input
// ├── valida
// ├── salva no array
// ├── salva no localStorage
// └── chama criarMovimentacao()

function adicionar() {

    //salva os conteudo digitado no form    
    const descricaoInput =
        document.getElementById("descricao");

    const valorInput =
        document.getElementById("valor");


    //define o valor deles, filtrando pelo value que queremos
    const descricao =
        descricaoInput.value;

    const valor =
        Number(valorInput.value);

    //checkbox
    const tipoInput = document.querySelector('input[name="tipo"]:checked');

    //validação
    if (!tipoInput) {
        alert("Selecione receita ou despesa.");
        return;
    }

    const tipo = tipoInput.value;


    //valida se os campos foram preenchidos corretamente
    if (descricao === "" || valorInput.value === "") {
        alert("Preencha todos os campos.");
        return;
    }


    const novaMovimentacao = {
        id: Date.now(),
        descricao,
        valor,
        tipo
    };


    //salva os campos de descrição e valor no localStorage
    movimentacoes.push(novaMovimentacao);

    // Salva o array atualizado no LocalStorage
    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );

    //chamando a função movimentação 
    criarMovimentacao(descricao, valor, tipo, novaMovimentacao.id);
    atualizarSaldo();


    //após adicionar um novo item deixa o campo em branco
    //para ser preenchido novamente
    descricaoInput.value = "";
    valorInput.value = "";

    //volta o cursor do mouse para descrição após adicionar
    //uma nova alteração
    descricaoInput.focus();
}


// criarMovimentacao()
// ├── cria HTML
// ├── cria botão
// ├── atualiza saldo
// └── trata exclusão

function criarMovimentacao(descricao, valor, tipo, id) {

    const item = document.createElement("li");
    const botao = document.createElement("button");

    //monta a exibição dos item pela descrição + valor
    //e insere um botao de excluir logo no final do item
    item.textContent =
        `${descricao} - R$ ${valor.toFixed(2)} (${tipo})`;
    
    botao.textContent = "Excluir";

    // ul =  listaa
    // └── li = item
    //     └── button = botão de exclusão
    item.appendChild(botao);
    lista.appendChild(item);

    //função do botão excluir
    botao.addEventListener("click", function () {

        movimentacoes = movimentacoes.filter(mov => mov.id !== id);

        localStorage.setItem(
            "movimentacoes",
            JSON.stringify(movimentacoes)
        );

        item.remove();

        atualizarSaldo();
    });

}

function atualizarSaldo() {
    saldo = 0;

    for (const mov of movimentacoes) {
        if (mov.tipo === "receita") {
            saldo += mov.valor;
        } else {
            saldo -= mov.valor;
        }
    }

    // Atualiza o saldo exibido na tela
    document.getElementById("saldo").textContent =
        `R$ ${saldo.toFixed(2)} `;
}