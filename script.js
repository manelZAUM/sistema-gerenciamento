// Array para armazenar os produtos carregando do localStorage
let produtosEstoque = JSON.parse(localStorage.getItem('meu_estoque')) || [];

const formCadastro = document.getElementById('form-cadastro-prod');
const tabelaCorpo = document.getElementById('tabela-cadastros-corpo');

// 1. Função para cadastrar o produto
formCadastro.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que a página recarregue

    // Captura os valores dos inputs
    const categoria = document.getElementById('c-prod-categoria').value;
    const nome = document.getElementById('c-prod-nome').value;
    const qtd = parseInt(document.getElementById('c-prod-qtd').value);
    const custo = parseFloat(document.getElementById('c-prod-custo').value);
    const venda = parseFloat(document.getElementById('c-prod-venda').value);
    
    // Cria um objeto para o novo produto
    const novoProduto = {
        id: Date.now(),
        categoria: categoria,
        nome: nome,
        qtd: qtd,
        custo: custo,
        venda: venda
    };

    // Adiciona ao array e salva no LocalStorage
    produtosEstoque.push(novoProduto);
    localStorage.setItem('meu_estoque', JSON.stringify(produtosEstoque));

    // Limpa o formulário e atualiza a tabela
    formCadastro.reset();
    document.getElementById('c-prod-categoria').value = ""; 
    renderizarTabela('Todas'); 
});

// 2. Função principal para renderizar a tabela
function renderizarTabela(categoriaFiltro) {
    tabelaCorpo.innerHTML = ''; // Limpa a tabela

    // Filtra o array de acordo com o botão clicado
    const produtosFiltrados = categoriaFiltro === 'Todas' 
        ? produtosEstoque 
        : produtosEstoque.filter(produto => produto.categoria === categoriaFiltro);

    // Cria as linhas da tabela
    produtosFiltrados.forEach(produto => {
        const linha = document.createElement('tr');
        
        // Formata os valores para moeda brasileira (R$)
        const custoFormatado = produto.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        const vendaFormatada = produto.venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

        // LÓGICA DO ALERTA DE ESTOQUE BAIXO:
        // Se a quantidade for menor que 5, aplica cor vermelha e negrito, e adiciona um ícone de atenção.
        const estiloEstoque = produto.qtd < 5 ? 'color: red; font-weight: bold;' : '';
        const iconeAlerta = produto.qtd < 5 ? ' ⚠️' : '';

        linha.innerHTML = `
            <td>${produto.categoria}</td>
            <td>${produto.nome}</td>
            <td style="${estiloEstoque}">${produto.qtd}${iconeAlerta}</td>
            <td>R$ ${custoFormatado}</td>
            <td>R$ ${vendaFormatada}</td>
            <td>
                <button onclick="removerProduto(${produto.id})" style="color: red; cursor: pointer; padding: 5px 10px; border: none; border-radius: 4px; background-color: #fee2e2;">Excluir</button>
            </td>
        `;
        
        tabelaCorpo.appendChild(linha);
    });
}

// 3. Função chamada pelos botões de filtro no HTML
function filtrarTabela(categoria) {
    renderizarTabela(categoria);
}

// 4. Função para remover um item
function removerProduto(idProduto) {
    // Pede uma confirmação antes de deletar para evitar cliques acidentais
    if(confirm("Tem certeza que deseja remover este produto do estoque?")) {
        produtosEstoque = produtosEstoque.filter(produto => produto.id !== idProduto);
        localStorage.setItem('meu_estoque', JSON.stringify(produtosEstoque));
        renderizarTabela('Todas'); 
    }
}

// Inicializa a tabela ao carregar a página
renderizarTabela('Todas');