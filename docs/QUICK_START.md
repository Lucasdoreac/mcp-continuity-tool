# Início Rápido - MCP Continuity Tool

Este documento fornece um prompt pronto para usar que você pode copiar e colar diretamente para iniciar rapidamente com a ferramenta de continuidade MCP.

## Prompt para Copiar e Colar

Copie o texto abaixo e cole-o em um novo chat com Claude. Substitua apenas `seu-nome/seu-repositorio` pela identificação do seu repositório.

```
Use a ferramenta MCP de continuidade para desenvolvimento do repositório: seu-nome/seu-repositorio

1. Carregue e configure o ambiente de continuidade MCP:
```javascript
// Carrega os scripts necessários
const stateManager = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/state_manager.js', { encoding: 'utf8' });
eval(stateManager);
const autoSetup = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/auto_setup.js', { encoding: 'utf8' });
eval(autoSetup);

// Inicializa automaticamente o ambiente para o repositório
const repositoryUrl = "seu-nome/seu-repositorio";
const env = await initializeEnvironment(repositoryUrl);
const projectState = env.projectState;

// Mostra o status atual do projeto
console.log(`Trabalhando em: ${projectState.development.currentFile}`);
console.log(`Tarefa atual: ${projectState.development.inProgress.description}`);
```

Agora continue o desenvolvimento a partir do ponto atual:
- Arquivo: ${projectState.development.currentFile}
- Tarefa: ${projectState.development.inProgress.description}
- Próximos passos: ${projectState.context.nextSteps.join(', ')}
```

## O Que Acontece Quando Você Cola Este Prompt

1. Claude carrega os scripts de gerenciamento de estado e configuração automática
2. O script inicializa automaticamente o ambiente para seu repositório:
   - Cria (ou carrega) o arquivo project-status.json
   - Analisa a estrutura do repositório
   - Identifica arquivos importantes
   - Gera metadados do projeto
3. O status atual é exibido para você confirmar
4. Claude está pronto para continuar o desenvolvimento do ponto atual

## Para Finalizar a Sessão

Ao final da sessão, atualize o estado do projeto para uso na próxima sessão:

```javascript
// Atualiza o estado com o progresso atual
await updateProjectState({
  development: {
    currentFile: "nome-do-arquivo.js",  // Arquivo que você acabou de trabalhar
    inProgress: {
      description: "Descrição do que você fez e onde parou"
    }
  },
  context: {
    lastThought: "Seu pensamento final sobre o projeto",
    nextSteps: ["Próximo passo 1", "Próximo passo 2"]
  }
});

// Gera prompt para a próxima sessão
const updatedState = await loadProjectState('project-status.json');
const nextSessionPrompt = generateContinuityPrompt(updatedState);
console.log("Prompt para próxima sessão:");
console.log(nextSessionPrompt);
```

## Personalização

Você pode personalizar o prompt básico adicionando mais contexto ou instruções específicas:

```
Use a ferramenta MCP de continuidade para desenvolvimento do repositório: seu-nome/seu-repositorio

Contexto adicional:
- Estamos implementando a funcionalidade X que precisa interagir com o sistema Y
- Temos um prazo de entrega para o final da semana
- A prioridade é otimizar o desempenho da função Z

1. Carregue e configure o ambiente de continuidade MCP:
```javascript
...
```
```

Para instruções completas, consulte [AUTO_SETUP.md](AUTO_SETUP.md).
