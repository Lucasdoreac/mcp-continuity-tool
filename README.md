# MCP Continuity Tool

Uma ferramenta para manter contexto e continuidade em desenvolvimento usando MCP através de múltiplas sessões de chat.

## Como Usar em Seus Projetos

### Para Novos Usuários (via GitHub)
1. Fork este repositório
2. Configure `project-status.json` para seu projeto
3. Siga as instruções em `docs/INSTRUCTIONS.md`

### Para Continuidade (Entre Chats)
```
Use MCP servers. Project: [URL_DO_REPOSITÓRIO]
Status: [STATUS_ATUAL]
Branch: [BRANCH_ATUAL]
Task: [TAREFA_ATUAL]
```

## Benefícios

- **Manutenção de Contexto**: Estado entre sessões
- **Otimização de Tokens**: Cache e operações em lote
- **Padronização**: Consistência no desenvolvimento
- **Recuperação Eficiente**: Retome trabalho facilmente

## Estrutura

```
/mcp-continuity-tool
├── /docs
│   ├── INSTRUCTIONS.md       # Guia completo
│   ├── CONTINUITY_PROMPT.md  # Prompts otimizados
│   └── RESOURCES.md         # Links e recursos
├── /templates
│   └── project-status.json  # Template de status
└── README.md               # Este arquivo
```

## Começando

1. **Para Novo Projeto**
   - Fork este repositório
   - Configure project-status.json
   - Use prompt de continuidade

2. **Para Projeto Existente**
   - Adicione project-status.json
   - Use prompt de continuidade
   - Mantenha contexto entre chats

## Contribuindo

Contribuições são bem-vindas! Especialmente para:
- Melhorar prompts
- Otimizar uso de tokens
- Documentar casos de uso

## Licença

MIT

---

**Nota**: Para máxima eficiência, use os prompts otimizados em `docs/CONTINUITY_PROMPT.md`.