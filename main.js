'use strict';
 
const API_URL = 'https://6a2881a64e1e783349a59694.mockapi.io/api/v1';

let dadosProdutos = [];
 

const sincronizarBancoRemoto = async () => {
    try {
        const res = await fetch(`${API_URL}/produtos`);
        dadosProdutos = await res.json();
        if (!Array.isArray(dadosProdutos)) dadosProdutos = [];
        exibirProdutos();
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
            ? new Date(p.data_entrada).toLocaleDateString('pt-BR')
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
    <button class="btn-excluir" data-id="${p.id}">✕ Excluir</button>
</td>
            </tr>`;
    }).join('');
    tbody.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', () => executarExclusaoProduto(btn.dataset.id));
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
    } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Erro ao excluir o item. Tente novamente.');
    }
};

const executarCadastroProduto = async (e) => {
    e.preventDefault();
 
    const novoItem = {
        produto: document.getElementById('input-nome').value.trim(),
        unidade_medida: document.getElementById('novo-produto-unidade').value.trim(),
        categoria: document.getElementById('novo-produto-categoria').value,
        quantidade_estoque: Number(document.getElementById('input-quantidade').value),
        data_entrada: document.getElementById('novo-produto-data-entrada').value
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
        document.getElementById('form-cadastro-produto').reset();
        alert(`✅ "${salvo.produto}" adicionado ao estoque!`);
    } catch (erro) {
        console.error('Erro ao cadastrar:', erro);
        alert('Erro ao salvar o produto. Tente novamente.');
    }
};
document.getElementById('form-cadastro-produto')
    ?.addEventListener('submit', executarCadastroProduto);
 
window.addEventListener('DOMContentLoaded', sincronizarBancoRemoto);