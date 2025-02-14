# Instruções para Continuidade de Desenvolvimento MCP

## 1. Inicialização

```javascript
async function initSession(repoUrl) {
  const status = await window.fs.readFile('project-status.json', { encoding: 'utf8' });
  await create_directory({ path: 'temp' });
  return JSON.parse(status);
}
```

## 2. Ferramentas MCP

- `read_file`: Leitura individual
- `read_multiple_files`: Leitura em lote
- `write_file`: Cache local
- `list_directory`: Estrutura
- `repl`: Testes e análises
- `create_or_update_file`: Commits

## 3. Fluxo Básico

1. Fork do repositório
2. Configure project-status.json
3. Siga este guia
4. Mantenha estado atualizado