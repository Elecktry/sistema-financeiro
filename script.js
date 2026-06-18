const lista = document.getElementById("lista");

// criar uma variavel para o saldo e define o valor para 0s
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
    botao.addEventListener("click", function() {
        
        //pega o valor do item, e debita do saldo total
        saldo -= valor  

        //altera o texto do saldo 
        //para saldo atual junto com as mudaças excluidas
        document.getElementById("saldo").textContent =
            `R$ ${saldo.toFixed(2)}`;

        item.remove();
    
    });

    //soma o valor de cada item adicionado na lista
    saldo += valor;

    //altera o texto do saldo, mostra o saldo atual 
    document.getElementById("saldo").textContent =
        `R$ ${saldo.toFixed(2)}`;


    //após adicionar um novo item deixa o campo em branco
    //para ser preenchido novamente
    descricaoInput.value = "";
    valorInput.value = "";

    //volta o cursor do mouse para descrição após adicionar
    //uma nova alteração
    descricaoInput.focus();

    


}
