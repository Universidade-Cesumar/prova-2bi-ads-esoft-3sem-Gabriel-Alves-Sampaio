[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/B74p-HKt)

# Sistema de Gestão de Insumos Hospitalares
> **SENAC** | Sprint 1 — Fundação, API e Inventário

Uma solução web robusta e performática voltada para o controle e monitoramento de almoxarifados hospitalares. O sistema substitui o uso de planilhas e registros manuais em papel por uma interface moderna, integrada a uma API em nuvem, garantindo maior confiabilidade e rastreabilidade dos insumos médicos.

---

## 📌 Visão Geral do Projeto

Este projeto consiste em uma aplicação web SPA (*Single Page Application*) desenvolvida estritamente com **tecnologias nativas (Vanilla Architecture)**, sem o auxílio de frameworks ou bibliotecas externas. A persistência de dados ocorre de forma assíncrona através da integração com o **MockAPI.io**, simulando o comportamento de uma API RESTful de nível de produção.

---

🛠️ Tecnologias Utilizadas
HTML5 (Estruturação semântica)

CSS3 (Estilização e layout)

JavaScript (ES6+) (Lógica de negócios e consumo de API)

MockAPI.io (Serviço de Mock de API REST)

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

# Sistema de Gestão de Insumos Hospitalares
> **SENAC** | Sprint 2 — Regras de Negócio e Saídas
 
Evolução do sistema iniciado no Sprint 1. Esta entrega implementa o módulo completo de retirada de estoque com validação matemática, exclusão de materiais e rastreabilidade de movimentações persistidas na nuvem.
 
---
 
## 📌 Visão Geral da Sprint
 
Com a base de inventário consolidada, o Sprint 2 introduz as **regras de negócio críticas** do almoxarifado: nenhuma operação de saída pode resultar em estoque negativo ou ser registrada com quantidade inválida. Toda baixa aprovada é persistida no servidor como um registro imutável de auditoria.
 
---
 
## 🛠️ Tecnologias Utilizadas
 
- HTML5 (Estruturação semântica)
- CSS3 (Estilização e layout)
- JavaScript (ES6+) (Lógica de negócios e consumo de API)
- MockAPI.io (Serviço de Mock de API REST)
---
 
## 🚀 Entregas da Sprint 2
 
### 1. Módulo de Saída / Baixa de Estoque
 
* **Formulário de Retirada:** Nova seção com seletor de material, campo de quantidade, instrutor solicitante, destino e motivo da saída.
* **Contrato Técnico Estrito:** Garantia de integridade dos seletores para testes automatizados:
    * `#input-retirada` — campo de quantidade a retirar
    * `.btn-baixar` — botão de confirmação da baixa (PUT)
    * `.btn-excluir` — botão de exclusão por linha (DELETE)
### 2. Validação Matemática (Motor de Retirada)
 
Função obrigatória de contrato implementada para blindar o banco de dados contra inconsistências:
 
```javascript
function validarRetirada(estoqueAtual, qtdRetirada) {
    if (qtdRetirada <= 0)           return false;
    if (qtdRetirada > estoqueAtual) return false;
    return true;
}
```
 
| Cenário | Resultado |
|---|---|
| Quantidade `<= 0` | `false` — operação bloqueada |
| Quantidade `>` estoque | `false` — operação bloqueada |
| Quantidade válida | `true` — operação liberada |
 
### 3. Exclusão de Materiais (DELETE)
 
Botão `.btn-excluir` injetado dinamicamente em cada linha da tabela. Ao clicar, o sistema exibe uma confirmação de segurança e dispara `DELETE /produtos/:id`, removendo o registro do servidor e do estado local simultaneamente.
 
---
 
## 🌐 Integração com a API (MockAPI.io)
 
| Método | Endpoint | Gatilho | Descrição |
| :--- | :--- | :--- | :--- |
| **GET** | `/produtos` | `DOMContentLoaded` | Carrega o inventário e preenche o select de saída |
| **POST** | `/produtos` | `#btn-cadastrar` | Cadastra novo insumo na nuvem |
| **POST** | `/movimentacoes` | `.btn-baixar` | Registra a saída como log imutável de auditoria |
| **PUT** | `/produtos/:id` | `.btn-baixar` | Deduz a quantidade e atualiza o saldo no servidor |
| **DELETE** | `/produtos/:id` | `.btn-excluir` | Remove o insumo do banco de dados remoto |
 
---
 
## 📋 Modelos de Dados
 
### Produto (`/produtos`)
```json
{
  "id": "4",
  "produto": "Agulhas 25x7",
  "unidade_medida": "Unidade",
  "quantidade_estoque": 250,
  "categoria": "Consumo",
  "data_entrada": "2027-01-15"
}
```
 
### Movimentação (`/movimentacoes`)
```json
{
  "id": "101",
  "produtoId": "4",
  "quantidade": 30,
  "responsavel": "Camilla Sambati",
  "destino": "Laboratório de Práticas Básicas",
  "motivo": "Aula Prática de Enfermagem",
  "data_movimentacao": "2026-06-09T18:30:00.000Z"
}
```
 
---
 
## 📁 Arquivos
 
```
index.html   → estrutura da página, seção de saída e IDs do contrato
style.css    → estilização visual incluindo .oculto, .btn-baixar e .btn-excluir
main.js      → validarRetirada, executarBaixaEstoque (PUT + POST), executarExclusaoProduto (DELETE)
```
# Sistema de Gestão de Insumos Hospitalares
> **SENAC** | Sprint 3 — Dashboard e Publicação

Evolução final do sistema iniciado nas Sprints 1 e 2. Esta entrega adiciona recursos de pesquisa, monitoramento de estoque, tratamento de falhas de comunicação com a API e disponibilização do sistema em ambiente de produção.

---

## 📌 Visão Geral da Sprint

Com o ciclo principal de inventário e movimentações concluído, a Sprint 3 foca em **monitoramento operacional, experiência do usuário e publicação da aplicação**. O sistema passa a contar com filtros dinâmicos, indicadores de estoque crítico e maior robustez diante de falhas de conexão.

---

## 🛠️ Tecnologias Utilizadas

- HTML5 (Estruturação semântica)
- CSS3 (Estilização e layout)
- JavaScript (ES6+) (Manipulação de DOM, filtros e consumo de API)
- MockAPI.io (Serviço de Mock de API REST)
- GitHub Pages / Vercel (Hospedagem da aplicação)

---

## 🚀 Entregas da Sprint 3

### 1. Dashboard e Indicadores

Implementação de um painel de monitoramento responsável por exibir informações consolidadas do inventário.

**Contrato Técnico Obrigatório:**

* `#total-itens` — elemento responsável por exibir o número total de itens cadastrados.
* `#input-busca` — campo de pesquisa dinâmica dos materiais.
* `.estoque-critico` — classe aplicada via JavaScript aos itens com estoque inferior a 10 unidades.

---

### 2. Pesquisa Dinâmica de Insumos

O sistema realiza filtragem em tempo real dos materiais cadastrados conforme o usuário digita no campo de busca.

**Funcionalidades implementadas:**

* Pesquisa por nome do produto.
* Atualização instantânea da tabela.
* Filtragem sem recarregamento da página.
* Integração com o estado local da aplicação.

---

### 3. Alerta Visual de Estoque Crítico

Itens com quantidade inferior a 10 unidades recebem destaque visual para facilitar a identificação de possíveis riscos de desabastecimento.

**Regra de negócio:**

| Quantidade em Estoque | Ação |
|---|---|
| Menor que 10 | Adiciona a classe `.estoque-critico` |
| Igual ou maior que 10 | Exibição padrão |

Exemplo de implementação:

```javascript
if (produto.quantidade_estoque < 10) {
    linha.classList.add("estoque-critico");
}
```

---

### 4. Dashboard de Total de Itens

O sistema atualiza automaticamente a quantidade total de registros exibidos no inventário.

Exemplo:

```javascript
document.getElementById("total-itens").textContent =
    dadosProdutos.length;
```

---

### 5. Tratamento de Erros

Todas as operações assíncronas de comunicação com a API utilizam blocos `try...catch` para evitar falhas silenciosas e garantir maior estabilidade da aplicação.

Exemplo:

```javascript
async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);
        const dados = await resposta.json();

        dadosProdutos = dados;
        renderizarProdutos();
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        alert("Não foi possível carregar os dados. Verifique sua conexão.");
    }
}
```

**Benefícios:**

* Maior robustez da aplicação.
* Tratamento adequado para falhas de rede.
* Melhor experiência do usuário.

---

## 🌐 Publicação em Produção

A aplicação foi disponibilizada em ambiente de produção por meio de uma plataforma de hospedagem estática.

### 🔗 Link do Projeto

> **Deploy:** https://universidade-cesumar.github.io/prova-2bi-ads-esoft-3sem-Gabriel-Alves-Sampaio/

---

## 🌐 Integração com a API (MockAPI.io)

| Método | Endpoint | Gatilho | Descrição |
| :--- | :--- | :--- | :--- |
| **GET** | `/produtos` | `DOMContentLoaded` | Carrega o inventário atualizado |
| **POST** | `/produtos` | `#btn-cadastrar` | Cadastra novo insumo |
| **POST** | `/movimentacoes` | `.btn-baixar` | Registra movimentações de saída |
| **PUT** | `/produtos/:id` | `.btn-baixar` | Atualiza saldo de estoque |
| **DELETE** | `/produtos/:id` | `.btn-excluir` | Remove um produto do sistema |

---

## 📋 Critérios Atendidos

| Critério de Avaliação | Status |
|---|---|
| Campo de pesquisa (`#input-busca`) | ✅ |
| Dashboard (`#total-itens`) | ✅ |
| Classe `.estoque-critico` para estoque baixo | ✅ |
| Uso de `try...catch` nas requisições | ✅ |
| README documentado | ✅ |
| Deploy em produção | ✅ |

---

## 📁 Arquivos

```text
index.html   → dashboard, pesquisa e estrutura da interface
style.css    → estilização visual e classe .estoque-critico
main.js      → filtros, dashboard, tratamento de erros e integração API
README.md    → documentação completa do projeto
```