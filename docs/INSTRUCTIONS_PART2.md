# Parte 2: Desenvolvimento e Manutenção

## 4. Cache e Estado

```javascript
// Salvar estado
await write_file({
  path: 'temp/checkpoint.json',
  content: JSON.stringify({
    timestamp: new Date().toISOString(),
    state: currentState
  })
});

// Carregar estado
const checkpoint = await window.fs.readFile('temp/checkpoint.json', { encoding: 'utf8' });
```

## 5. Análise e Testes

```javascript
// Carregar múltiplos arquivos
const files = await read_multiple_files({
  paths: ['src/config.js', 'src/utils.js']
});

// Usar REPL para testes
// Use o REPL para testar código antes de commits
```

## 6. Resolução de Problemas

### 6.1 Perda de Contexto
1. Verificar checkpoint
2. Consultar cache
3. Revisar histórico

### 6.2 Erros
1. Testar no REPL
2. Verificar logs
3. Consultar exemplos