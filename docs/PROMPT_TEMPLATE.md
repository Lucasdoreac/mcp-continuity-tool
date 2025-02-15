# Prompt Template para Inicialização

Use o seguinte prompt ao iniciar uma nova sessão com Claude:

```
Por favor, use as ferramentas do servidor MCP para:

1. Buscar o repositório no GitHub:
search_repositories com query="Lucasdoreac/mcp-continuity-tool"

2. Ler os arquivos principais:
- get_file_contents para README.md
- get_file_contents para docs/INSTRUCTIONS.md
- get_file_contents para docs/INSTRUCTIONS_PART1.md
- get_file_contents para docs/INSTRUCTIONS_PART2.md
- get_file_contents para docs/RESOURCES.md
- get_file_contents para templates/project-status.json

Após carregar esses arquivos, configure o ambiente para continuidade de desenvolvimento.

Estou trabalhando no repositório: [INSIRA_SEU_REPOSITÓRIO_AQUI]
```

## Por que este prompt é eficiente:

1. **Uso Direto das Ferramentas**: Indica explicitamente que o Claude deve usar as ferramentas MCP disponíveis
2. **Instruções Específicas**: Lista exatamente quais funções usar e em qual ordem
3. **Economia de Tokens**: Evita explicações desnecessárias
4. **Carregamento Otimizado**: Obtém apenas os arquivos essenciais

## Como Usar:

1. Copie o prompt acima
2. Substitua [INSIRA_SEU_REPOSITÓRIO_AQUI] pelo link do seu repositório
3. Cole no início de uma nova sessão com Claude

## Exemplos de Uso:

### Para Novo Projeto:
```
Por favor, use as ferramentas do servidor MCP para:
[prompt como acima]
Estou trabalhando no repositório: https://github.com/seu-usuario/seu-novo-projeto
```

### Para Projeto Existente:
```
Por favor, use as ferramentas do servidor MCP para:
[prompt como acima]
Estou trabalhando no repositório: https://github.com/seu-usuario/projeto-existente
Branch: feature/nova-funcionalidade
```

---

*Mantenha este template atualizado com as melhores práticas da comunidade.*