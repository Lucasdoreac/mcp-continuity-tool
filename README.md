# MCP Continuity Tool

Uma ferramenta abrangente para implementar recursos de servidor Model Context Protocol (MCP), otimizando o gerenciamento de contexto e contagem de tokens em aplicações de IA.

## Uso Rápido

Copie e cole este prompt em um novo chat com Claude para começar imediatamente:

```
Use a ferramenta MCP de continuidade para desenvolvimento do repositório: seu-nome/seu-repositorio

```javascript
const stateManager = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/state_manager.js', { encoding: 'utf8' });
eval(stateManager);
const autoSetup = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/auto_setup.js', { encoding: 'utf8' });
eval(autoSetup);
const env = await initializeEnvironment("seu-nome/seu-repositorio");
const projectState = env.projectState;
```

Continue o desenvolvimento a partir do ponto atual.
```

*Substitua `seu-nome/seu-repositorio` nas duas ocorrências pelo seu repositório.*

## 🚀 Recursos

- Gerenciamento de contexto contínuo
- Contagem de tokens otimizada
- Integração com servidor MCP
- Atualizações de contexto em tempo real
- Monitoramento de desempenho
- Persistência de estado
- Gerenciamento de artefatos
- Configuração automática de repositórios

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

## 📋 Como Funciona

### Processo de Uso Padrão

1. **Iniciar uma nova sessão**
   - Cole o [prompt mínimo](docs/MINIMAL_PROMPT.md) em um novo chat
   - Substitua o nome do repositório
   - O ambiente será configurado automaticamente

2. **Durante a sessão**
   - Trabalhe normalmente no desenvolvimento
   - O contexto é mantido automaticamente
   - Use as ferramentas MCP conforme necessário

3. **Finalizar a sessão**
   - Atualize o estado com o progresso
   ```javascript
   await updateProjectState({
     development: {
       currentFile: "arquivo-atual.js",
       inProgress: {
         description: "O que você está fazendo agora"
       }
     },
     context: {
       lastThought: "Seus pensamentos finais",
       nextSteps: ["Próximo passo 1", "Próximo passo 2"]
     }
   });
   ```
   - Gere o prompt para a próxima sessão
   ```javascript
   const nextSessionPrompt = generateContinuityPrompt(await loadProjectState('project-status.json'));
   console.log(nextSessionPrompt);
   ```

4. **Próxima sessão**
   - Use o prompt gerado ou o prompt mínimo

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja `docs/INSTRUCTIONS.md` para informações detalhadas sobre como contribuir.

## 📚 Recursos Adicionais

- [Prompt Mínimo](docs/MINIMAL_PROMPT.md) - A forma mais rápida e simples de começar
- [Início Rápido](docs/QUICK_START.md) - Instruções detalhadas para iniciantes
- [Configuração Automática](docs/AUTO_SETUP.md) - Detalhes técnicos da configuração automática
- [Documentação Completa](docs/INSTRUCTIONS.md) - Guia completo de todas as funcionalidades
- [Templates de Prompt](docs/PROMPT_TEMPLATE.md) - Prompts para diferentes situações
- [Recursos e Referências](docs/RESOURCES.md) - Materiais adicionais

## ⚙️ Automação

Este projeto utiliza GitHub Actions para automação de tarefas:

- Combinação automática de arquivos de instruções
- Verificação de sintaxe e formatação
- Testes automatizados

## 📄 Licença

MIT License
