# Calculador de Esforço

Este projeto é uma aplicação Electron construída com Vite e React para cálculo de esforço.

## Como rodar localmente

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão recomendada: LTS).
- Gerenciador de pacotes `npm` (geralmente vem com o Node.js).

### Passo a passo

1.  **Clone o repositório** (se ainda não o fez):
    ```bash
    git clone <url-do-repositorio>
    cd calculador-esforco
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Rodar em modo de desenvolvimento**:
    Para rodar a interface no navegador (modo rápido para desenvolvimento web):
    ```bash
    npm run dev
    ```

    Para rodar a aplicação Electron (modo desktop):
    Primeiro, é necessário construir o projeto e depois iniciar o Electron.
    ```bash
    npm run build
    npm run electron
    ```

### Comandos Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento Vite.
- `npm run build`: Compila o TypeScript e constrói o projeto com Vite.
- `npm run electron`: Inicia a aplicação Electron (requer build prévio).
- `npm run lint`: Executa o linter para verificar o código.
- `npm run generate`: Gera o executável/instalador da aplicação.
