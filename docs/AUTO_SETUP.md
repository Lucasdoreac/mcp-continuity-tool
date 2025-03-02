# Configuração Automática para Continuidade MCP

Este documento explica como utilizar o recurso de configuração automática para iniciar rapidamente o uso da ferramenta de continuidade MCP em um novo chat ou repositório.

## Prompt de Inicialização Rápida

Para iniciar um novo chat com Claude e automaticamente configurar a ferramenta para um repositório específico, use o seguinte prompt:

```
Use a ferramenta MCP de continuidade para desenvolvimento do repositório: [REPOSITÓRIO].

1. Carregue o gerenciador de estado e o script de auto-configuração:
```javascript
// Carrega o script de gerenciamento de estado
const stateManager = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/state_manager.js', { encoding: 'utf8' });
eval(stateManager);

// Carrega o script de configuração automática
const autoSetup = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/auto_setup.js', { encoding: 'utf8' });
eval(autoSetup);

// Inicializa o ambiente para o repositório específico
const repositoryUrl = "[REPOSITÓRIO]";
const setupResult = await initializeEnvironment(repositoryUrl);

// Acessa o estado do projeto para referência
const projectState = setupResult.projectState;
```

Continue o desenvolvimento a partir do ponto atual:
- Arquivo: ${projectState.development.currentFile}
- Tarefa: ${projectState.development.inProgress.description}
- Próximos passos: ${projectState.context.nextSteps.join(', ')}
```

Substitua `[REPOSITÓRIO]` pelo URL ou nome do seu repositório (por exemplo, `usuario/nome-do-repo` ou `https://github.com/usuario/nome-do-repo`).

## Como Funciona

O script de configuração automática realiza as seguintes ações:

1. **Detecta e analisa o repositório**:
   - Extrai o nome e dados básicos do repositório a partir da URL
   - Analisa a estrutura de arquivos e diretórios

2. **Cria ou carrega o project-status.json**:
   - Se o arquivo já existir, carrega o estado existente
   - Se não existir, cria automaticamente com valores inteligentes:
     - Detecta o arquivo principal do projeto
     - Cria uma estrutura inicial de tarefas e componentes
     - Preenche automaticamente metadados do projeto

3. **Fornece resumo e contexto**:
   - Mostra o estado atual do projeto
   - Gera um prompt de continuidade para sessões futuras
   - Apresenta estatísticas sobre o repositório

## Uso Avançado

### Atualizando o Estado

Para atualizar o estado do projeto durante ou ao final da sessão:

```javascript
await updateProjectState({
  development: {
    currentFile: "arquivo-atualizado.js",
    inProgress: {
      description: "Nova descrição do progresso"
    }
  },
  context: {
    lastThought: "Seu último pensamento sobre o projeto",
    nextSteps: ["Próximo passo 1", "Próximo passo 2"]
  }
});
```

### Analisando o Repositório

Para re-analisar o repositório a qualquer momento:

```javascript
const analysis = await analyzeRepository();
console.log(analysis);
```

### Gerando um Novo Prompt de Continuidade

Para gerar um prompt atualizado para a próxima sessão:

```javascript
const updatedState = await loadProjectState('project-status.json');
const newPrompt = generateContinuityPrompt(updatedState);
console.log(newPrompt);
```

## Benefícios da Configuração Automática

- **Velocidade**: Elimina a necessidade de configurar manualmente o ambiente
- **Consistência**: Mantém o formato e a estrutura padronizados
- **Descoberta automática**: Identifica características do projeto sem intervenção manual
- **Facilidade de uso**: Permite iniciar uma nova sessão com um único prompt

## Recomendações para Uso Eficiente

1. **Sempre atualize o estado ao concluir tarefas importantes**
2. **Mantenha o arquivo project-status.json no controle de versão**
3. **Use o mesmo prompt de inicialização em todas as novas sessões**
4. **Salve o prompt de continuidade gerado para uso rápido na próxima sessão**

## Resolução de Problemas

Se encontrar problemas com a configuração automática:

1. Verifique se o repositório está acessível e se tem permissões corretas
2. Execute o script de teste para diagnóstico:
   ```javascript
   const testScript = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/test_mcp_tools.js', { encoding: 'utf8' });
   eval(testScript);
   await testMcpTools();
   ```
3. Confirme se o arquivo project-status.json está em formato JSON válido
4. Limpe o cache do navegador e tente novamente em um novo chat

---

Para mais informações sobre a ferramenta de continuidade MCP, consulte a [documentação principal](INSTRUCTIONS.md).
