# MCP Continuity Tool

Uma ferramenta abrangente para implementar recursos de servidor Model Context Protocol (MCP), otimizando o gerenciamento de contexto e contagem de tokens em aplicações de IA. Este projeto fornece um servidor Node.js que expõe uma API para gerenciar o estado do projeto e gerar prompts de continuidade.

## Installation

Instale o `mcp-continuity-tool` globalmente usando npm:

```bash
npm install -g mcp-continuity-tool
```
(Observação: Você pode precisar de `sudo` para instalações globais, dependendo da sua configuração do npm.)

## Running the MCP Server

Após a instalação, você pode iniciar o servidor MCP usando o seguinte comando:

```bash
mcp-server
```

Por padrão, o servidor é executado na porta 3000. Você pode especificar uma porta diferente usando a opção `--port` ou `-p`:

```bash
mcp-server --port 4000
```
Ou usando a variável de ambiente `PORT`:
```bash
PORT=4000 mcp-server
```

### Using with NPX

If you prefer not to install the package globally, you can run the server directly using `npx`:

```bash
npx mcp-continuity-tool
```

This will download the latest version of the package and run the server. You can also pass arguments like `--port`:

```bash
npx mcp-continuity-tool --port 4000
```

## Server API Endpoints

O servidor MCP expõe os seguintes endpoints HTTP:

### `GET /`
Retorna uma mensagem de boas-vindas indicando que o servidor está em execução.

*   **Example Request:**
    ```bash
    curl http://localhost:3000/
    ```
*   **Example Success Response (200 OK):**
    ```json
    {
      "message": "MCP Server is running. Use specific endpoints to interact."
    }
    ```

### `POST /initialize`
Inicializa um novo projeto ou configura um existente para continuidade MCP. Este endpoint chama a função `initializeEnvironment` dos scripts locais.

*   **Request Body (JSON):**
    *   `repositoryUrl` (string, required): A URL ou identificador do repositório.
    *   `workingDirectory` (string, optional): O subdiretório dentro do projeto para focar. Se não fornecido, o diretório atual onde o servidor foi iniciado será usado para algumas operações (como análise de repositório, se aplicável), e o `project-status.json` será salvo/lido a partir desse diretório.
*   **Example Request:**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{
      "repositoryUrl": "seu-nome/seu-repositorio",
      "workingDirectory": "src"
    }' http://localhost:3000/initialize
    ```
*   **Example Success Response (200 OK):**
    ```json
    {
      "projectState": {
        "projectInfo": {
          "name": "seu-repositorio",
          "repository": "seu-nome/seu-repositorio",
          "workingDirectory": "src",
          "lastUpdated": "2023-10-28T12:00:00.000Z"
        },
        "development": {
          "currentFile": "main.js",
          "currentComponent": "seu-repositorioComponent",
          "inProgress": {
            "type": "feature",
            "description": "Configuração inicial do projeto seu-repositorio",
            "remainingTasks": ["Análise de requisitos", "Planejamento da arquitetura"]
          }
        },
        "components": { /* ... */ },
        "context": { /* ... */ },
        "mcpTools": { /* ... */ }
      },
      "repoAnalysis": {
        "fileCount": 10,
        "categories": {
          "code": ["main.js", "utils.js"],
          "config": ["package.json"],
          "docs": ["README.md"],
          "web": [],
          "dirs": ["utils"]
        },
        "analyzedDirectory": "/path/to/your/project/src"
      },
      "continuityPrompt": "Use MCP toolset from https://github.com/Lucasdoreac/mcp-continuity-tool for development continuity:\n\nWorking on: seu-nome/seu-repositorio\nContext: Iniciar o desenvolvimento com foco na arquitetura principal do seu-repositorio\nStatus from project-status.json:\n{\n  \"projectInfo\": {\n    \"name\": \"seu-repositorio\",\n    \"currentTask\": \"Configuração inicial do projeto seu-repositorio\",\n    \"lastState\": \"Iniciar o desenvolvimento com foco na arquitetura principal do seu-repositorio\"\n  },\n  \"development\": {\n    \"currentFile\": \"main.js\",\n    \"inProgress\": \"feature: Configuração inicial do projeto seu-repositorio\"\n  }\n}\n\nContinue development from this state using MCP server tools for context preservation."
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Se `repositoryUrl` estiver faltando no corpo da requisição ou se o JSON for inválido.
    *   `500 Internal Server Error`: Se ocorrer um erro durante o processo de inicialização.

### `GET /state`
Carrega e retorna o estado atual do projeto a partir de um arquivo `project-status.json`.

*   **Query Parameters:**
    *   `projectPath` (string, optional): O caminho para o arquivo `project-status.json`. Padrão: `project-status.json` no diretório de trabalho do servidor.
*   **Example Request:**
    ```bash
    curl "http://localhost:3000/state?projectPath=src/my-project-status.json"
    ```
*   **Example Success Response (200 OK):**
    ```json
    {
      "projectInfo": {
        "name": "seu-repositorio",
        "repository": "seu-nome/seu-repositorio",
        /* ... mais campos ... */
      },
      "development": { /* ... */ }
      /* ... mais seções do estado ... */
    }
    ```
*   **Error Responses:**
    *   `500 Internal Server Error`: Se o arquivo de estado não puder ser lido ou se ocorrer outro erro. (Nota: se o arquivo não existir, um estado padrão é retornado com status 200).

### `POST /state`
Atualiza campos específicos no estado do projeto e salva o arquivo `project-status.json`.

*   **Request Body (JSON):**
    *   `updates` (object, required): Objeto contendo os campos a serem atualizados no estado.
    *   `projectPath` (string, optional): O caminho para o arquivo `project-status.json`. Padrão: `project-status.json` no diretório de trabalho do servidor.
*   **Example Request:**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{
      "updates": {
        "development": {
          "currentFile": "new-file.js",
          "inProgress": { "description": "Trabalhando na nova funcionalidade" }
        },
        "context": { "lastThought": "Isso está quase pronto." }
      },
      "projectPath": "src/my-project-status.json"
    }' http://localhost:3000/state
    ```
*   **Example Success Response (200 OK):**
    ```json
    {
      "projectInfo": { /* ... */ },
      "development": {
        "currentFile": "new-file.js",
        "inProgress": { "description": "Trabalhando na nova funcionalidade" }
        /* ... outros campos preservados ou mesclados ... */
      },
      "context": { "lastThought": "Isso está quase pronto." },
      /* ... mais seções do estado ... */
    }
    ```
    (A resposta é o objeto de estado completamente atualizado.)
*   **Error Responses:**
    *   `400 Bad Request`: Se `updates` estiver faltando ou se o JSON for inválido.
    *   `500 Internal Server Error`: Se ocorrer um erro durante a atualização ou salvamento.

### `GET /continuity-prompt`
Gera um prompt de continuidade com base no estado atual do projeto.

*   **Query Parameters:**
    *   `projectPath` (string, optional): O caminho para o arquivo `project-status.json` para carregar o estado. Padrão: `project-status.json`.
*   **Example Request:**
    ```bash
    curl "http://localhost:3000/continuity-prompt?projectPath=src/my-project-status.json"
    ```
*   **Example Success Response (200 OK):**
    ```json
    {
      "prompt": "Use MCP toolset from https://github.com/Lucasdoreac/mcp-continuity-tool for development continuity:\n\nWorking on: seu-nome/seu-repositorio\nContext: Isso está quase pronto.\nStatus from project-status.json:\n{\n  \"projectInfo\": {\n    \"name\": \"seu-repositorio\",\n    \"currentTask\": \"Trabalhando na nova funcionalidade\",\n    \"lastState\": \"Isso está quase pronto.\"\n  },\n  \"development\": {\n    \"currentFile\": \"new-file.js\",\n    \"inProgress\": \"feature: Trabalhando na nova funcionalidade\"\n  }\n}\n\nContinue development from this state using MCP server tools for context preservation."
    }
    ```
*   **Error Responses:**
    *   `500 Internal Server Error`: Se o estado não puder ser carregado ou se ocorrer um erro na geração do prompt.

## 🚀 Visão Geral dos Recursos (Expostos via API)

- **Gerenciamento de Estado do Projeto:** Carregue, salve e atualize um arquivo `project-status.json` que rastreia o progresso do desenvolvimento, contexto e metadados do projeto.
- **Configuração Automática:** Inicialize projetos rapidamente, detectando informações do repositório e configurando um estado inicial.
- **Geração de Prompt de Continuidade:** Crie prompts formatados para ajudar a manter o contexto entre sessões de desenvolvimento com modelos de IA.
- **Análise de Repositório:** Obtenha uma visão geral da estrutura de arquivos de um diretório de projeto.

## 📋 Como Funciona (Modelo Servidor-Cliente)

1.  **Inicie o Servidor MCP:** Execute `mcp-server` no seu terminal.
2.  **Use um Cliente HTTP (como `curl` ou Postman) ou integre com outras ferramentas:**
    *   Para iniciar um novo projeto ou registrar um existente, envie uma requisição `POST /initialize`. Isso criará um arquivo `project-status.json` (se não existir) e retornará o estado inicial, análise do repositório e um prompt de continuidade.
    *   Para obter o estado atual de um projeto, envie `GET /state` (especificando `projectPath` se não for o padrão).
    *   À medida que você trabalha, atualize o estado enviando `POST /state` com as alterações.
    *   Para gerar um prompt para a próxima sessão ou para resumir o estado atual, use `GET /continuity-prompt`.
3.  **Integração com Modelos de IA:** Use os prompts gerados e as informações de estado para manter o contexto ao interagir com modelos de linguagem grandes como Claude, ChatGPT, etc.

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja `docs/INSTRUCTIONS.md` (a ser atualizado para o novo fluxo) para informações detalhadas sobre como contribuir. Por favor, foque em melhorar a funcionalidade do servidor e dos scripts Node.js.

## 📚 Recursos Adicionais (Podem precisar de atualização)

- [Prompt Mínimo](docs/MINIMAL_PROMPT.md)
- [Início Rápido](docs/QUICK_START.md)
- [Configuração Automática](docs/AUTO_SETUP.md)
- [Documentação Completa](docs/INSTRUCTIONS.md)
- [Templates de Prompt](docs/PROMPT_TEMPLATE.md)
- [Recursos e Referências](docs/RESOURCES.md)

## ⚙️ Automação

Este projeto utiliza GitHub Actions para automação de tarefas:

- Combinação automática de arquivos de instruções
- Verificação de sintaxe e formatação
- Testes automatizados (Jest)

## Publishing to NPM (For Maintainers)

To publish this package to NPM or update an existing version:

1.  Ensure you are logged in to NPM with appropriate permissions:
    ```bash
    npm login
    ```
2.  Increment the `version` in `package.json` as per Semantic Versioning (e.g., `1.0.1`, `1.1.0`, `2.0.0`).
3.  Commit your changes to Git.
4.  Run the publish command:
    ```bash
    npm publish
    ```

This process requires you to be the owner or a collaborator on the `mcp-continuity-tool` package on npmjs.com.

## 📄 Licença

MIT License
