# MCP Continuity Tool - Instruções Detalhadas

## Índice
1. [Visão Geral](#visão-geral)
2. [Configuração Inicial](#configuração-inicial)
3. [Uso Diário](#uso-diário)
4. [Comandos e Funções](#comandos-e-funções)
5. [Melhores Práticas](#melhores-práticas)
6. [Solução de Problemas](#solução-de-problemas)

## Visão Geral

O MCP Continuity Tool é projetado para manter contexto e continuidade em desenvolvimento usando MCP (Multi-Context Programming) através de múltiplas sessões de chat. Esta documentação fornece instruções detalhadas sobre como utilizar a ferramenta efetivamente.

## Configuração Inicial

### Para Novo Projeto

1. **Fork do Repositório**
   ```bash
   # Clone o repositório após o fork
   git clone https://github.com/seu-usuario/mcp-continuity-tool.git
   cd mcp-continuity-tool
   ```

2. **Configuração do project-status.json**
   - Copie o template de `/templates/project-status.json`
   - Preencha as informações do seu projeto:
     ```json
     {
       "projectInfo": {
         "name": "Seu Projeto",
         "repository": "seu-usuario/seu-repo",
         "lastUpdated": "2025-02-15T10:00:00Z"
       }
     }
     ```

3. **Estrutura de Diretórios Recomendada**
   ```
   /seu-projeto
   ├── /src
   │   └── ... (seus arquivos de código)
   ├── project-status.json
   └── README.md
   ```

### Para Projeto Existente

1. **Adicionar Arquivo de Status**
   - Copie `project-status.json` para a raiz do seu projeto
   - Configure conforme necessário

2. **Integração com Workflow Existente**
   - Adicione o arquivo ao controle de versão
   - Atualize o README com instruções de uso

## Uso Diário

1. **Iniciando uma Nova Sessão**
   - Ao iniciar chat com Claude, use:
     ```
     Por favor, acesse https://github.com/Lucasdoreac/mcp-continuity-tool e use as instruções para continuidade de desenvolvimento.
     ```
   - Forneça o link do seu repositório quando solicitado

2. **Durante o Desenvolvimento**
   - O estado é mantido automaticamente
   - Use comandos específicos para operações especiais
   - Verifique o status atual quando necessário

3. **Finalizando uma Sessão**
   - O estado é salvo automaticamente
   - Commit das alterações no project-status.json

## Comandos e Funções

### Funções Principais

1. **Inicialização**
   ```javascript
   const status = await initSession(repoUrl);
   ```

2. **Gerenciamento de Estado**
   ```javascript
   // Salvar estado atual
   await saveState();
   
   // Carregar estado
   const state = await loadState();
   ```

3. **Operações com Arquivos**
   ```javascript
   // Carregar múltiplos arquivos
   const files = await read_multiple_files({
     paths: ['src/**/*.js']
   });
   ```

### Ferramentas MCP

1. **REPL**
   - Use para testes rápidos
   - Análise de código
   - Debugging

2. **Artifacts**
   - Criação de componentes
   - Visualizações
   - Documentação

## Melhores Práticas

1. **Organização de Código**
   - Mantenha componentes em diretórios separados
   - Use nomenclatura consistente
   - Documente alterações significativas

2. **Gerenciamento de Estado**
   - Atualize project-status.json regularmente
   - Mantenha descrições claras de tarefas
   - Use sistema de branches para features

3. **Otimização**
   - Cache de operações frequentes
   - Batch de operações similares
   - Limpeza regular de cache

## Solução de Problemas

### Problemas Comuns

1. **Perda de Contexto**
   - Verifique project-status.json
   - Recarregue estado manualmente
   - Verifique logs de erro

2. **Conflitos de Versão**
   - Resolva conflitos no project-status.json
   - Mantenha backup do estado

3. **Problemas de Performance**
   - Limpe cache quando necessário
   - Otimize operações em batch
   - Reduza tamanho de contexto

### Suporte

- Abra issues no GitHub para problemas
- Consulte a documentação atualizada
- Contribua com melhorias

## Notas Adicionais

1. **Segurança**
   - Não armazene credenciais no status
   - Use variáveis de ambiente
   - Mantenha tokens seguros

2. **Manutenção**
   - Atualize regularmente
   - Verifique por novas versões
   - Contribua com melhorias

3. **Comunidade**
   - Compartilhe templates úteis
   - Reporte bugs
   - Sugira melhorias

---

*Para mais informações ou suporte, abra uma issue no repositório principal.*