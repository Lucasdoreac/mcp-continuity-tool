# Prompt Mínimo

Use este prompt mínimo para iniciar rapidamente a ferramenta de continuidade MCP com um único comando. Copie, substitua seu repositório e cole em um novo chat com Claude.

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

## Por que usar o prompt mínimo?

- **Velocidade**: Em segundos você está pronto para trabalhar
- **Simplicidade**: Sem configurações complexas
- **Eficiência**: A ferramenta configura tudo automaticamente

## Opção com diretório de trabalho

Se você precisa trabalhar em um diretório específico do repositório, use:

```
Use a ferramenta MCP de continuidade para desenvolvimento do repositório: seu-nome/seu-repositorio (diretório: src/frontend)

```javascript
const stateManager = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/state_manager.js', { encoding: 'utf8' });
eval(stateManager);
const autoSetup = await window.fs.readFile('https://raw.githubusercontent.com/Lucasdoreac/mcp-continuity-tool/main/scripts/auto_setup.js', { encoding: 'utf8' });
eval(autoSetup);
const env = await initializeEnvironment("seu-nome/seu-repositorio", "src/frontend");
const projectState = env.projectState;
```

Continue o desenvolvimento a partir do ponto atual.
```

Para instruções mais detalhadas, consulte [QUICK_START.md](QUICK_START.md).
