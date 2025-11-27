// --- 1. ADICIONAR ITEM (Usado na Home) ---
function adicionarAoCarrinho(nome, preco, imagem) {
    // Pega a lista salva ou cria uma nova
    let carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];

    // Verifica se já existe
    let itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
        alert(`+1 unidade de "${nome}" adicionada!`);
    } else {
        carrinho.push({ nome, preco, imagem, quantidade: 1 });
        alert(`"${nome}" foi para o carrinho!`);
    }

    // Salva e atualiza
    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
}

// --- 2. CARREGAR TELA DO CARRINHO (Usado no carrinho.html) ---
function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];
    let tabela = document.getElementById('tabela-carrinho');
    let totalElemento = document.getElementById('total-valor');
    let total = 0;

    // Se não estiver na página do carrinho, para o script pra não dar erro
    if (!tabela) return;

    tabela.innerHTML = ''; // Limpa antes de desenhar

    if (carrinho.length === 0) {
        tabela.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Carrinho vazio.</td></tr>';
        if(totalElemento) totalElemento.innerText = "0,00";
        return;
    }

    carrinho.forEach((item, index) => {
        let subtotal = item.preco * item.quantidade;
        total += subtotal;

        tabela.innerHTML += `
            <tr>
                <td style="display: flex; align-items: center; gap: 10px;">
                    <img src="${item.imagem}" alt="${item.nome}" style="width: 50px; border-radius: 5px;">
                    ${item.nome}
                </td>
                <td class="center">
                    <button class="btn-qtd" onclick="alterarQuantidade(${index}, -1)">-</button>
                    <span style="margin: 0 10px;">${item.quantidade}</span>
                    <button class="btn-qtd" onclick="alterarQuantidade(${index}, 1)">+</button>
                </td>
                <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
                <td class="center">
                    <button onclick="removerItem(${index})" style="color: red; background: none; border: none; cursor: pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    if (totalElemento) {
        totalElemento.innerText = total.toFixed(2).replace('.', ',');
    }
}

// --- 3. BOTÕES DE CONTROLE (+, -, Lixeira) ---
function alterarQuantidade(index, mudanca) {
    let carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];
    
    if(carrinho[index]) {
        carrinho[index].quantidade += mudanca;
        if (carrinho[index].quantidade <= 0) {
            let confirma = confirm("Quer remover este item?");
            if(confirma) carrinho.splice(index, 1);
            else carrinho[index].quantidade = 1;
        }
    }
    
    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
    carregarCarrinho(); // Recarrega a tela
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}

// Carrega automaticamente se estiver na página certa
if(document.getElementById('tabela-carrinho')) {
    window.onload = carregarCarrinho;
}