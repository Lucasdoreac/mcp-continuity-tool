# Prompt de Continuidade MCP

## Prompt Otimizado

```
Use MCP toolset from https://github.com/Lucasdoreac/mcp-continuity-tool for development continuity:

Working on: [REPOSITÓRIO]
Context: [CONTEXTO_ATUAL]
Status from project-status.json:
{
  "projectInfo": {
    "name": "[NOME_PROJETO]",
    "currentTask": "[TAREFA_ATUAL]",
    "lastState": "[ÚLTIMO_ESTADO]"
  },
  "development": {
    "currentFile": "[ARQUIVO_ATUAL]",
    "inProgress": "[PROGRESSO]"
  }
}

Continue development from this state using MCP server tools for context preservation.
```

## Por que é eficiente:
1. Indica a fonte das ferramentas MCP
2. Fornece o estado via project-status.json
3. Mantém apenas informações essenciais
4. Instrui explicitamente o uso das ferramentas de servidor

## Exemplo de Uso:

```
Use MCP toolset from https://github.com/Lucasdoreac/mcp-continuity-tool for development continuity:

Working on: https://github.com/user/my-project
Context: Implementing user authentication system
Status from project-status.json:
{
  "projectInfo": {
    "name": "MyProject",
    "currentTask": "Add password reset",
    "lastState": "Email verification complete"
  },
  "development": {
    "currentFile": "src/auth/resetPassword.js",
    "inProgress": "Implementing token validation"
  }
}

Continue development from this state using MCP server tools for context preservation.
```

## Antes de Trocar de Chat:

1. Salve o estado atual no project-status.json
2. Copie o prompt acima
3. Preencha com informações atualizadas
4. Use no novo chat

## Dicas de Uso:

1. **Mantenha Status Atualizado**
   - Atualize project-status.json antes de mudar de chat
   - Inclua pontos de checkpoint importantes
   - Mantenha histórico de decisões chave

2. **Contexto Essencial**
   - Arquivo atual sendo trabalhado
   - Estado do desenvolvimento
   - Próximos passos planejados

3. **Economia de Tokens**
   - Remova informações redundantes
   - Mantenha apenas contexto relevante
   - Use formato consistente

---

*Atualize este template conforme sua experiência de uso.*