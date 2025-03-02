## Prompt Ultra Minimalista

```
Use a ferramenta MCP de continuidade para o repositório: seu-nome/seu-repositorio

```javascript
const s=await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/state_manager.js',{encoding:'utf8'});eval(s);
const a=await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/auto_setup.js',{encoding:'utf8'});eval(a);
await initializeEnvironment("seu-nome/seu-repositorio");
```
```

*Substitua seu-nome/seu-repositorio pelo seu repositório*
