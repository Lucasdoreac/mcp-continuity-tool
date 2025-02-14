# MCP Continuity Tool

Uma ferramenta para manter contexto e continuidade em desenvolvimento usando MCP através de múltiplas sessões de chat.

## Como Usar

1. No início de cada chat com Claude, diga:
   ```
   Por favor, acesse https://github.com/Lucasdoreac/mcp-continuity-tool e use as instruções para continuidade de desenvolvimento.
   ```

2. Claude irá carregar as instruções e perguntar qual projeto você deseja continuar.

3. Forneça o link do seu repositório e Claude irá:
   - Carregar o estado do projeto
   - Configurar o ambiente
   - Continuar o desenvolvimento

## Estrutura

- `/templates`: Templates para project-status.json e outros arquivos de configuração
- `/docs`: Documentação detalhada
- `/scripts`: Scripts de utilidade para o MCP
- `/examples`: Exemplos de implementação

## Benefícios

- Manutenção de contexto entre sessões
- Otimização de uso de tokens
- Padronização de desenvolvimento
- Recuperação eficiente de estado

## Contribuindo

Contribuições são bem-vindas! Por favor, leia o CONTRIBUTING.md para detalhes.