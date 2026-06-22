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
        movimentacao.id,
        movimentacao.categoria
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

    const categoriaInput =
        document.getElementById("categoria");


    //define o valor deles, filtrando pelo value que queremos
    const descricao =
        descricaoInput.value;

    const valor =
        Number(valorInput.value);


    const categoria =
        categoriaInput.value;


    //checkbox
    const tipoInput = document.querySelector('input[name="tipo"]:checked');


    const tipo = tipoInput.value;


    //valida se os campos foram preenchidos corretamente
    if (
        descricao === "" ||
        valorInput.value === "" ||
        categoria === ""
    ) {
        alert("Preencha todos os campos.");
        return;
    }

    const novaMovimentacao = {
        id: Date.now(),
        descricao,
        valor,
        tipo,
        categoria
    };


    //salva os campos de descrição e valor no localStorage
    movimentacoes.push(novaMovimentacao);

    // Salva o array atualizado no LocalStorage
    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );

    //chamando a função movimentação 
    criarMovimentacao(descricao, valor, tipo, categoria, novaMovimentacao.id);
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

function criarMovimentacao(descricao, valor, tipo, categoria, id) {

    const item = document.createElement("li");
    const texto = document.createElement("span");
    const botao = document.createElement("button");
    const descricaoFormatada =
        descricao.charAt(0).toUpperCase() + descricao.slice(1);


    let sinal;

    if (tipo === "receita") {
        sinal = "+";
        item.classList.add("receita");
    } else {
        sinal = "-";
        item.classList.add("despesa");
    }




    texto.textContent =
        `${descricaoFormatada}  ${sinal} R$ ${formatarMoeda(valor)} ${categoria}`;

    botao.textContent = "Excluir";

    // ul =  listaa
    // └── li = item
    //     └── button = botão de exclusão
    item.appendChild(texto);
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
    let totalReceitas = 0;
    let totalDespesas = 0;

    for (const mov of movimentacoes) {
        if (mov.tipo === "receita") {
            totalReceitas += mov.valor;
        } else {
            totalDespesas += mov.valor;
        }
    }

    const saldo = totalReceitas - totalDespesas;

    document.getElementById("total-receitas").textContent =
        formatarMoeda(totalReceitas);

    document.getElementById("total-despesas").textContent =
        formatarMoeda(totalDespesas);

    document.getElementById("saldo").textContent =
        formatarMoeda(saldo);
}

//formatação da moeda pt-br

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}