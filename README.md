[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/B74p-HKt)

# Sistema de Gestão de Insumos Hospitalares
> **SENAC** | Sprint 1 — Fundação, API e Inventário

Uma solução web robusta e performática voltada para o controle e monitoramento de almoxarifados hospitalares. O sistema substitui o uso de planilhas e registros manuais em papel por uma interface moderna, integrada a uma API em nuvem, garantindo maior confiabilidade e rastreabilidade dos insumos médicos.

---

## 📌 Visão Geral do Projeto

Este projeto consiste em uma aplicação web SPA (*Single Page Application*) desenvolvida estritamente com **tecnologias nativas (Vanilla Architecture)**, sem o auxílio de frameworks ou bibliotecas externas. A persistência de dados ocorre de forma assíncrona através da integração com o **MockAPI.io**, simulando o comportamento de uma API RESTful de nível de produção.

---

## 🚀 Entregas da Sprint 1

### 1. Interface Avançada (HTML5 & CSS3)
* **Estrutura Semântica:** Implementação baseada em boas práticas de acessibilidade e SEO utilizando as tags `<main>`, `<section>`, `<nav>` e `<table>`.
* **Formulários Inteligentes:** Validação nativa no client-side (`required`, `min="0"`, restrições de tipos de dados) para impedir a inserção de inconsistências no banco de dados.
* **Design Responsivo:** Interface limpa e adaptável às rotinas dinâmicas de um ambiente hospitalar.
* **Contrato Técnico Estrito:** Garantia de integridade dos seletores necessários para a manipulação do DOM e testes automatizados:
    * `#input-nome` (Nome do insumo)
    * `#input-quantidade` (Quantidade em estoque)
    * `#btn-cadastrar` (Gatilho de submissão)
    * `#lista-materiais` (Container/Corpo da tabela de dados)

### 2. Camada de Lógica e Estado (JavaScript ES6+)
* **Gerenciamento de Estado:** Sincronização dos dados em memória por meio do array reativo `dadosProdutos`.
* **Programação Assíncrona:** Operações de I/O gerenciadas via padrão `async/await` com a Fetch API.
* **Tratamento de Exceções:** Fluxos de erro de rede e indisponibilidade de servidor devidamente isolados com blocos `try...catch`.
* **Renderização Eficiente:** Atualização seletiva da UI utilizando o método immutável `.map()`, evitando *reloads* desnecessários da página e otimizando a performance.

---

## 🌐 Integração com a API (MockAPI.io)

A comunicação com o backend segue as convenções do protocolo HTTP/REST:

| Método | Endpoint | Gatilho de Execução | Descrição |
| :--- | :--- | :--- | :--- |
| <span style="color:green">**GET**</span> | `/produtos` | `DOMContentLoaded` | Disparado ao carregar a página para renderizar o inventário atualizado. |
| <span style="color:blue">**POST**</span> | `/produtos` | Evento `click` em `#btn-cadastrar` | Envia o payload do formulário para persistência na nuvem. |

### 📋 Modelo de Dados (Schema do Produto)

```json
{
  "id": "4",
  "produto": "Agulhas 25x7",
  "unidade_medida": "Unidade",
  "quantidade_estoque": 250,
  "categoria": "Consumo",
  "data_entrada": "2027-01-15"
}