# Prompts de Continuidade

## Para Novo Chat (Continuação)

Quando atingir o limite de contexto, use este prompt conciso no novo chat:

```
Use MCP servers. Project: [URL_DO_REPOSITÓRIO]
Status: [COLE_AQUI_O_STATUS_ATUAL]
Branch: [BRANCH_ATUAL]
Task: [TAREFA_ATUAL]
```

### Por que é eficiente:
- Instrução direta para usar MCP
- Apenas informações essenciais
- Sem redundâncias
- Economia máxima de tokens

### Exemplo:
```
Use MCP servers. Project: https://github.com/user/project
Status: Implementing user authentication
Branch: feature/auth
Task: Add password reset functionality
```

## Para Desenvolvimento Contínuo

Para manter contexto entre sessões longas:

```
Continue MCP development.
Project: [URL_DO_REPOSITÓRIO]
Last: [ÚLTIMA_AÇÃO]
Next: [PRÓXIMO_PASSO]
```

### Exemplo:
```
Continue MCP development.
Project: https://github.com/user/project
Last: Implemented user model
Next: Create authentication middleware
```

## Dicas de Uso

1. **Mantenha Conciso**
   - Evite descrições longas
   - Foque no estado atual
   - Use palavras-chave

2. **Informações Críticas**
   - URL do projeto
   - Estado atual
   - Próxima ação

3. **Economia de Tokens**
   - Omita explicações óbvias
   - Use formato consistente
   - Mantenha apenas o essencial

---

*Mantenha este documento atualizado com suas melhores práticas de continuidade.*