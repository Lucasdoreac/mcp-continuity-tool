# MCP Continuity Tool

Uma ferramenta abrangente para implementar recursos de servidor Model Context Protocol (MCP), otimizando o gerenciamento de contexto e contagem de tokens em aplicações de IA.

## 🚀 Recursos

- Gerenciamento de contexto contínuo
- Contagem de tokens otimizada
- Integração com servidor MCP
- Atualizações de contexto em tempo real
- Monitoramento de desempenho
- Persistência de estado
- Gerenciamento de artefatos
- **NOVO:** Configuração automática de repositórios

## 🛠️ Ferramentas do Servidor

### Ferramentas Disponíveis

1. **Artefatos**
   - Crie e gerencie partes de conteúdo independentes
   - Suporte para múltiplos tipos de conteúdo (código, markdown, SVG, etc.)
   - Controle de versão e atualizações

2. **REPL/Ferramenta de Análise**
   - Ambiente de execução JavaScript
   - Acesso ao sistema de arquivos
   - Recursos de análise de dados
   - Processamento de arquivos CSV e Excel

3. **Operações do Sistema de Arquivos**
   - Operações de leitura/escrita
   - Gerenciamento de diretórios
   - Busca e manipulação de arquivos
   - Operações com múltiplos arquivos

4. **GitHub Integration**
   - Sincronização com repositórios
   - Controle de versão
   - Automação de tarefas
   - Workflows de integração contínua

5. **State Management**
   - Persistência entre sessões
   - Restauração de contexto
   - Tracking de progresso
   - Templates JSON para estado do projeto

6. **Configuração Automática**
   - Detecção automática de arquivos e estrutura
   - Preenchimento inteligente de metadados
   - Inicialização com um único prompt
   - Análise automática de repositórios

## 📋 Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Lucasdoreac/mcp-continuity-tool.git

# Entre no diretório
cd mcp-continuity-tool

# Instale as dependências
npm install
```

### Uso Básico

1. **Iniciar um novo projeto**

```bash
# Inicialize o project-status.json
cp templates/project-status.json seu-projeto/project-status.json
```

2. **Configuração Automática (NOVO!)**

Inicie um novo chat com Claude e use o prompt de configuração automática:

```
Use a ferramenta MCP de continuidade para desenvolvimento do repositório: [REPOSITÓRIO].

1. Carregue o gerenciador de estado e o script de auto-configuração:
```javascript
// Carrega o gerenciador de estado e script de auto-setup
const stateManager = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/state_manager.js', { encoding: 'utf8' });
eval(stateManager);
const autoSetup = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/auto_setup.js', { encoding: 'utf8' });
eval(autoSetup);

// Inicializa o ambiente para o repositório específico
const repositoryUrl = "[REPOSITÓRIO]";
const setupResult = await initializeEnvironment(repositoryUrl);
const projectState = setupResult.projectState;
```
```

3. **Manter continuidade entre sessões**

Use o prompt de continuidade gerado ao final da sessão, ou regenere com:

```javascript
const updatedState = await loadProjectState('project-status.json');
const newPrompt = generateContinuityPrompt(updatedState);
console.log(newPrompt);
```

4. **Combinar arquivos de instruções**

```bash
# Via MCP
await combineInstructions();

# Via Node.js
npm run combine
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja `docs/INSTRUCTIONS.md` para informações detalhadas sobre como contribuir.

## 📚 Recursos Adicionais

- [Documentação Completa](docs/INSTRUCTIONS.md)
- [Templates de Prompt](docs/PROMPT_TEMPLATE.md)
- [Recursos e Referências](docs/RESOURCES.md)
- [Configuração Automática](docs/AUTO_SETUP.md) **NOVO!**

## ⚙️ Automação

Este projeto utiliza GitHub Actions para automação de tarefas:

- Combinação automática de arquivos de instruções
- Verificação de sintaxe e formatação
- Testes automatizados

## 📄 Licença

MIT License
