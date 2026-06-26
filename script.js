const lista = document.getElementById("lista");

let graficoCategorias;
let graficoMensal;

//MODAL ADICIONAR MAIS MOVIMENTAÇÕES
const modal = document.getElementById("modal");

const botaoAbrirModal =
    document.getElementById("abrir-modal");

const botaoFecharModal =
    document.getElementById("fechar-modal");

const botaoCancelarModal =
    document.getElementById("cancelar-modal");


//FUNÇÃO MODAL
function abrirModal() {
    modal.classList.add("ativo");

    document
        .getElementById("descricao")
        .focus();
}

function fecharModal() {
    modal.classList.remove("ativo");
}

//CONECTANDO OS BOTÕES ÀS FUNÇÕES

botaoAbrirModal.addEventListener(
    "click",
    abrirModal
);

botaoFecharModal.addEventListener(
    "click",
    fecharModal
);

botaoCancelarModal.addEventListener(
    "click",
    fecharModal
);

//FECHA O MODAL CLICANDO NA PARTE ESCURA DO MODAL
modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        fecharModal();
    }
});

//FECHA O MODAL CLICANDO NA A TECLA ESC
document.addEventListener("keydown", function (event) {
    if (
        event.key === "Escape" &&
        modal.classList.contains("ativo")
    ) {
        fecharModal();
    }
});


// Recupera as movimentações salvas no navegador.
// Caso não exista nada salvo, inicia com um array vazio.
let movimentacoes =
    JSON.parse(
        localStorage.getItem("movimentacoes")
    ) || [];

movimentacoes = movimentacoes.map(function (movimentacao) {
    return {
        ...movimentacao,
        data: movimentacao.data || new Date().toISOString()
    };
});

localStorage.setItem(
    "movimentacoes",
    JSON.stringify(movimentacoes)
);

for (const movimentacao of movimentacoes) {
    criarMovimentacao(
        movimentacao.descricao,
        movimentacao.valor,
        movimentacao.tipo,
        movimentacao.categoria,
        movimentacao.id
    );
}




atualizarSaldo()

atualizarGraficoCategorias()


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
        descricao.trim() === "" ||
        valorInput.value === "" ||
        valor <= 0 ||
        categoria === ""
    ) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    if (valor > 999999999) {
        alert("O valor informado é muito alto.");
        return;
    }



    const novaMovimentacao = {
        id: Date.now(),
        descricao,
        valor,
        tipo,
        categoria,
        data: new Date().toISOString()
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
    atualizarGraficoCategorias();
    atualizarGraficoMensal();
    fecharModal();


    //após adicionar um novo item deixa o campo em branco
    //para ser preenchido novamente
    descricaoInput.value = "";
    valorInput.value = "";
    categoriaInput.value = "";

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
        `${descricaoFormatada}  ${sinal} ${formatarMoeda(valor)} ${categoria}`;

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
        atualizarGraficoCategorias();
        atualizarGraficoMensal();
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
//formata o numero para nao quebrar os cards
// function formatarValorCompacto(valor) {
//     return new Intl.NumberFormat("pt-BR", {
//         style: "currency",
//         currency: "BRL",
//         notation: "compact",
//         maximumFractionDigits: 1
//     }).format(valor);
// }


//grafico de gastos mensais
function atualizarGraficoMensal() {
    const canvas = document.getElementById("grafico-mensal");

    if (!canvas) {
        return;
    }

    const gastosPorMes = {};

    for (const movimentacao of movimentacoes) {
        if (movimentacao.tipo !== "despesa") {
            continue;
        }

        const data = new Date(movimentacao.data);

        const mes = data.toLocaleDateString("pt-BR", {
            month: "short",
            year: "numeric"
        });

        if (!gastosPorMes[mes]) {
            gastosPorMes[mes] = 0;
        }

        gastosPorMes[mes] += Number(movimentacao.valor);
    }
    const posicaoLegenda =
        window.innerWidth <= 600 ? "bottom" : "right";
    const meses = Object.keys(gastosPorMes);
    const valores = Object.values(gastosPorMes);

    if (graficoMensal) {
        graficoMensal.destroy();
    }

    graficoMensal = new Chart(canvas, {
        type: "bar",

        data: {
            labels: meses,

            datasets: [
                {
                    label: "Gastos mensais",
                    data: valores,
                    borderWidth: 3,
                    tension: 0.3,
                    fill: false
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: posicaoLegenda,

                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 12,
                        boxWidth: 8,
                        font: {
                            size: 11
                        }
                    }
                }
            },


            scales: {
                    x: {
                        ticks: {
                            maxRotation: 35,
                            minRotation: 35
                        }
                    }
                }
            }
        });
}

function atualizarGraficoCategorias() {
    const despesas = movimentacoes.filter(function (mov) {
        return mov.tipo === "despesa";
    });

    const totaisPorCategoria = {};

    for (const despesa of despesas) {
        const categoria = despesa.categoria;

        if (totaisPorCategoria[categoria]) {
            totaisPorCategoria[categoria] += Number(despesa.valor);
        } else {
            totaisPorCategoria[categoria] = Number(despesa.valor);
        }
    }

    const categorias = Object.keys(totaisPorCategoria);
    const valores = Object.values(totaisPorCategoria);

    if (graficoCategorias) {
        graficoCategorias.destroy();
    }

    const canvas =
        document.getElementById("grafico-categorias");

    graficoCategorias = new Chart(canvas, {
        type: "doughnut",

        data: {
            labels: categorias,

            datasets: [
                {
                    label: "Despesas",
                    data: valores
                }
            ]
        },


        options: {
            responsive: true,

            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 14
                    }
                }
            }
        }


    });
}




atualizarSaldo();
atualizarGraficoCategorias();
atualizarGraficoMensal();