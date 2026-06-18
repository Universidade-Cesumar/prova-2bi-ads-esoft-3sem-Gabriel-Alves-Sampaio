'use strict';
 
const API_URL = 'https://6a2881a64e1e783349a59694.mockapi.io/api/v1';

let dadosProdutos = [];
 

const sincronizarBancoRemoto = async () => {
    try {
        const res = await fetch(`${API_URL}/produtos`);
   
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        dadosProdutos = await res.json();
        if (!Array.isArray(dadosProdutos)) dadosProdutos = [];
        exibirProdutos();
        preencherSelectSaida();
    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        alert('Não foi possível carregar os dados. Verifique sua conexão.');
    }
};

const exibirProdutos = () => {
    const tbody = document.getElementById('lista-materiais');
    if (!tbody) return;
 
    tbody.innerHTML = dadosProdutos.map(p => {
        const estoque  = Number(p.quantidade_estoque || 0);
        
        const validade = p.data_entrada
            ? new Date(p.data_entrada + 'T00:00:00').toLocaleDateString('pt-BR')
            : 'Uso Continuado';
        const badgeClass = p.categoria === 'Permanente' ? 'bg-info' : 'bg-secondary';
 
        return `
            <tr data-id="${p.id}">
                <td>${p.produto || 'Sem Nome'}</td>
                <td><span class="badge-tipo ${badgeClass}">${p.categoria || 'Consumo'}</span></td>
                <td>${p.unidade_medida || 'Unidade'}</td>
                <td>${validade}</td>
                <td><strong>${estoque}</strong></td>
                <td>
                    <input type="number" id="input-retirada" class="campo-input input-retirada-lista" data-id="${p.id}" placeholder="Qtd" min="1" style="width: 60px; display: inline-block; margin-right: 5px;">
                    <button class="btn-baixar" data-id="${p.id}">⬇ Baixar</button>
                    <button class="btn-excluir" data-id="${p.id}">✕ Excluir</button>
                </td>
            </tr>`;
    }).join('');
    tbody.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', () => executarExclusaoProduto(btn.dataset.id));
    });

  
    tbody.querySelectorAll('.btn-baixar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const input = tbody.querySelector(`.input-retirada-lista[data-id="${id}"]`);
            const quantidade = Number(input.value);
            
            executarBaixaEstoqueDireta(id, quantidade);
        });
    });
};

const executarExclusaoProduto = async (produtoId) => {
    const prod = dadosProdutos.find(p => String(p.id) === String(produtoId));
    if (!prod) return;

    if (!confirm(`Confirmar exclusão de "${prod.produto}"?`)) return;

    try {
        const res = await fetch(`${API_URL}/produtos/${produtoId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        dadosProdutos = dadosProdutos.filter(p => String(p.id) !== String(produtoId));
        exibirProdutos();
        preencherSelectSaida();
    } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Erro ao excluir o item. Tente novamente.');
    }
};

const executarCadastroProduto = async (e) => {
    e.preventDefault();
 
   
    const dataDigitada = document.getElementById('novo-produto-data-entrada').value;

    const novoItem = {
        produto: document.getElementById('input-nome').value.trim(),
        unidade_medida: document.getElementById('novo-produto-unidade').value.trim(),
        categoria: document.getElementById('novo-produto-categoria').value,
        quantidade_estoque: Number(document.getElementById('input-quantidade').value),
        data_entrada: dataDigitada || new Date().toISOString().split('T')[0]
    };
     try {
        const res = await fetch(`${API_URL}/produtos`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(novoItem)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
 
     const salvo = await res.json();
        dadosProdutos.push(salvo);
        exibirProdutos();
        preencherSelectSaida();
        document.getElementById('form-cadastro-produto').reset();
        alert(`✅ "${salvo.produto}" adicionado ao estoque!`);
    } catch (erro) {
        console.error('Erro ao cadastrar:', erro);
        alert('Erro ao salvar o produto. Tente novamente.');
    }
};

const preencherSelectSaida = () => {
    const select = document.getElementById('select-produto-saida');
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Selecione um material</option>' +
        dadosProdutos.map(p =>
            `<option value="${p.id}">${p.produto} (Saldo: ${p.quantidade_estoque || 0})</option>`
        ).join('');
};


function validarRetirada(estoqueAtual, qtdRetirada) {
    if (qtdRetirada <= 0)           return false;
    if (qtdRetirada > estoqueAtual) return false;
    return true;
}


const executarBaixaEstoqueDireta = async (produtoId, quantidade) => {
    if (!quantidade || quantidade <= 0) {
        alert('Digite uma quantidade válida para retirada.');
        return;
    }

    const produto = dadosProdutos.find(p => String(p.id) === String(produtoId));
    if (!produto) return;

    const estoqueAtual = Number(produto.quantidade_estoque || 0);

    if (!validarRetirada(estoqueAtual, quantidade)) {
        alert(`⚠️ Operação negada!\nEstoque atual: ${estoqueAtual}\nQuantidade solicitada: ${quantidade}`);
        return;
    }

    const novoEstoque = estoqueAtual - quantidade;

    try {
        const resPut = await fetch(`${API_URL}/produtos/${produtoId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ quantidade_estoque: novoEstoque })
        });
        if (!resPut.ok) throw new Error(`HTTP ${resPut.status}`);
 
        produto.quantidade_estoque = novoEstoque;
        exibirProdutos();
        preencherSelectSaida();
        alert(`✅ Saída registrada! Novo saldo de "${produto.produto}": ${novoEstoque}`);
    } catch (erro) {
        console.error('Erro ao registrar baixa:', erro);
        alert('Erro ao registrar a saída. Tente novamente.');
    }
};


const executarBaixaEstoque = async (e) => {
    e.preventDefault();
 
    const produtoId   = document.getElementById('select-produto-saida').value;
    const quantidade  = Number(document.getElementById('input-retirada').value);
    const responsavel = document.getElementById('responsavel').value.trim();
    const destino     = document.getElementById('destino').value.trim();
    const motivo      = document.getElementById('motivo').value;
 
    const produto = dadosProdutos.find(p => String(p.id) === String(produtoId));
    if (!produto) { alert('Selecione um material válido.'); return; }

     const estoqueAtual = Number(produto.quantidade_estoque || 0);
 
    if (!validarRetirada(estoqueAtual, quantidade)) {
        alert(`⚠️ Operação negada!\nEstoque atual: ${estoqueAtual}\nQuantidade solicitada: ${quantidade}`);
        return;
    }
     const novoEstoque = estoqueAtual - quantidade;
 
    try {
            const resMov = await fetch(`${API_URL}/movimentacoes`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                produtoId,
                quantidade,
                responsavel,
                destino,
                motivo,
                data_movimentacao: new Date().toISOString()
            })
        });
        
        if (!resMov.ok) throw new Error(`HTTP ${resMov.status}`);
        const resPut = await fetch(`${API_URL}/produtos/${produtoId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ quantidade_estoque: novoEstoque })
        });
        if (!resPut.ok) throw new Error(`HTTP ${resPut.status}`);
 
        produto.quantidade_estoque = novoEstoque;
        exibirProdutos();
        preencherSelectSaida();
        document.getElementById('form-movimentacao').reset();
        alert(`✅ Saída registrada! Novo saldo de "${produto.produto}": ${novoEstoque}`);
    } catch (erro) {
        console.error('Erro ao registrar baixa:', erro);
        alert('Erro ao registrar a saída. Tente novamente.');
    }
};

document.getElementById('form-movimentacao')
    ?.addEventListener('submit', executarBaixaEstoque);

document.getElementById('form-cadastro-produto')
    ?.addEventListener('submit', executarCadastroProduto);
 
window.addEventListener('DOMContentLoaded', sincronizarBancoRemoto);