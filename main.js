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
 
       