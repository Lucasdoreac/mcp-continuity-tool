# Início Rápido - MCP Continuity Tool

Este documento fornece o prompt padrão para usar a ferramenta de continuidade MCP. Simplesmente copie, cole e comece a trabalhar!

## Prompt Padrão (Copiar e Colar)

Copie o texto abaixo e cole-o em um novo chat com Claude. **Apenas substitua `seu-nome/seu-repositorio` pelo identificador do seu repositório.**

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

## Fluxo de Trabalho Padrão

A ferramenta de continuidade MCP foi projetada para ser extremamente simples de usar:

### 1. Iniciar (Primeira Vez)
- Cole o prompt acima em um novo chat com Claude
- Substitua `seu-nome/seu-repositorio` pelo seu repositório
- O sistema detectará automaticamente que é a primeira vez e criará o arquivo de estado
- A estrutura de diretórios e arquivos será analisada
- Um estado inicial será criado baseado na detecção automática

### 2. Trabalhar no Projeto
- Desenvolva normalmente seu projeto com Claude
- O contexto é mantido durante toda a sessão
- Use as ferramentas MCP conforme necessário

### 3. Finalizar a Sessão
- Antes de encerrar, atualize o estado:

```javascript
// Atualize o estado com as mudanças da sessão
await updateProjectState({
  development: {
    currentFile: "arquivo-que-está-trabalhando.js",
    inProgress: {
      description: "Descrição do que estava fazendo e onde parou"
    }
  },
  context: {
    lastThought: "Seus pensamentos finais sobre o projeto",
    nextSteps: ["Próximo passo 1", "Próximo passo 2"]
  }
});

// Obtenha o prompt para a próxima sessão
const nextSessionPrompt = generateContinuityPrompt(await loadProjectState('project-status.json'));
console.log("Prompt para a próxima sessão:");
console.log(nextSessionPrompt);
```

### 4. Próxima Sessão
- Use o prompt gerado na etapa anterior, OU
- Use o prompt padrão do início deste documento (o sistema carregará automaticamente o estado anterior)

## Por Que Este Método é o Padrão

O método de configuração automática se tornou o padrão porque:

1. **Simplicidade** - Um único prompt resolve tudo
2. **Eficiência** - Não requer configuração manual
3. **Inteligência** - Detecta automaticamente a estrutura do projeto
4. **Consistência** - Mantém o formato do estado padronizado
5. **Velocidade** - Permite começar imediatamente em um novo chat

## Personalizações

Você pode personalizar o prompt padrão de várias maneiras:

### Adicionar Contexto

```
Use a ferramenta MCP de continuidade para desenvolvimento do repositório: seu-nome/seu-repositorio

Contexto específico:
- Objetivo principal: Implementar sistema de autenticação
- Tecnologias utilizadas: React, Node.js, MongoDB
- Prazo: Finalizar até sexta-feira

1. Carregue e configure o ambiente de continuidade MCP:
```javascript
...
```
```

### Especificar Diretório de Trabalho

Se seu projeto usa um diretório específico:

```javascript
// Inicializa automaticamente o ambiente para o repositório
const repositoryUrl = "seu-nome/seu-repositorio";
// Define o diretório de trabalho 
const workingDirectory = "frontend/src";
const env = await initializeEnvironment(repositoryUrl, workingDirectory);
const projectState = env.projectState;
```

Para instruções completas e opções avançadas, consulte [AUTO_SETUP.md](AUTO_SETUP.md).
