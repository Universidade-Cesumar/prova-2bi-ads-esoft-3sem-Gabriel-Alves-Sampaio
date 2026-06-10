[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/B74p-HKt)

Sistema de Gestão de Insumos Hospitalares

SENAC | Sprint 1 — Fundação, API e Inventário


Visão Geral

Aplicação web de controle de almoxarifado hospitalar desenvolvida com HTML5, CSS3 e JavaScript ES6+ puro, sem frameworks. Os dados são persistidos em nuvem via MockAPI.io, que simula uma API RESTful completa substituindo planilhas e controles manuais em papel.

O que foi entregue no Sprint 1

Interface (HTML5 + CSS3)


Estrutura semântica com <section> e <main>
Formulário de cadastro com validação nativa (required, min="0")
Tabela de estoque preenchida dinamicamente pelo JavaScript
IDs do contrato técnico presentes: #input-nome, #input-quantidade, #btn-cadastrar, #lista-materiais


Lógica (JavaScript ES6+)


Estado dos produtos mantido em memória no array dadosProdutos
Comunicação assíncrona com a API via fetch + async/await
Erros de rede tratados com try...catch
Tabela re-renderizada via .map() sem recarregar a página