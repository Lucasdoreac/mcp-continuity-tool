# Scripts de Utilidade MCP

Esta pasta contém scripts utilizados para facilitar o trabalho com o ambiente MCP e manter a continuidade entre sessões.

## Scripts Disponíveis

### `combine_instructions.js`

Combina os arquivos de instruções separados em um único arquivo para facilitar a leitura.

**Uso no MCP:**
```javascript
await combineInstructions();
```

**Uso via Node.js:**
```bash
npm run combine
```

### `state_manager.js`

Fornece funções para gerenciar o estado do projeto entre sessões MCP.

**Funções disponíveis:**

- `loadProjectState(projectPath)`: Carrega o estado atual do projeto
- `saveProjectState(state, projectPath)`: Salva o estado atual do projeto
- `updateProjectState(updates, projectPath)`: Atualiza campos específicos no estado do projeto
- `generateContinuityPrompt(state)`: Gera um prompt de continuidade baseado no estado atual

**Exemplo de uso:**
```javascript
// Carregar estado
const state = await loadProjectState('seu-projeto/project-status.json');

// Atualizar informações
await updateProjectState({
  development: {
    currentFile: 'src/component.js',
    inProgress: {
      description: 'Implementando recurso X'
    }
  }
}, 'seu-projeto/project-status.json');

// Gerar prompt de continuidade
const prompt = generateContinuityPrompt(state);
console.log(prompt); // Copie este prompt para a próxima sessão
```

## Como Adicionar Novos Scripts

1. Crie um novo arquivo `.js` nesta pasta
2. Documente-o adequadamente com comentários JSDoc
3. Atualize este README com informações sobre o novo script
4. Se for um script para uso via Node.js, adicione um comando ao `package.json`
