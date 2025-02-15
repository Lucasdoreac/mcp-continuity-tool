# MCP Continuity Tool - Parte 1: Configuração e Instalação

Esta primeira parte das instruções foca na configuração inicial e instalação do MCP Continuity Tool.

## 1. Requisitos

- Git instalado
- Acesso a GitHub
- Node.js (versão 14 ou superior)
- Editor de código

## 2. Instalação

### 2.1 Para Novo Projeto

1. **Fork do Repositório**
   ```bash
   git clone https://github.com/seu-usuario/mcp-continuity-tool.git
   cd mcp-continuity-tool
   ```

2. **Instalação de Dependências**
   ```bash
   npm install
   ```

3. **Configuração Inicial**
   - Copie o template de configuração:
     ```bash
     cp templates/project-status.json ./project-status.json
     ```
   - Edite conforme necessário

### 2.2 Para Projeto Existente

1. **Adicionar como Submódulo** (Opcional)
   ```bash
   git submodule add https://github.com/Lucasdoreac/mcp-continuity-tool.git tools/mcp-continuity
   ```

2. **Copiar Arquivos Necessários**
   ```bash
   cp tools/mcp-continuity/templates/project-status.json ./
   ```

## 3. Estrutura de Arquivos

```
/seu-projeto
├── /src
│   └── ... (arquivos do projeto)
├── /tools (opcional)
│   └── /mcp-continuity
├── project-status.json
└── README.md
```

## 4. Configuração do project-status.json

```json
{
  "projectInfo": {
    "name": "Nome do Projeto",
    "repository": "usuario/repo",
    "lastUpdated": "YYYY-MM-DDTHH:mm:ssZ"
  },
  "development": {
    "currentFile": "",
    "currentComponent": "",
    "inProgress": {
      "type": "feature",
      "description": "",
      "remainingTasks": []
    }
  }
}
```

## 5. Verificação da Instalação

1. **Teste Básico**
   ```javascript
   // No chat com Claude
   const status = await initSession(repoUrl);
   console.log('Estado:', status);
   ```

2. **Verificação de Arquivos**
   - project-status.json presente
   - Estrutura de diretórios correta
   - Permissões adequadas

## 6. Próximos Passos

- Continue para a Parte 2 das instruções
- Configure seu ambiente de desenvolvimento
- Familiarize-se com os comandos básicos

## 7. Solução de Problemas de Instalação

### 7.1 Problemas Comuns

1. **Erro de Permissão**
   - Verifique permissões de diretório
   - Use sudo se necessário (Linux/Mac)

2. **Conflitos de Git**
   - Reset do repositório local
   - Verificar .gitignore

3. **Erro no project-status.json**
   - Validar formato JSON
   - Verificar campos obrigatórios

### 7.2 Suporte

- Abra issues para problemas técnicos
- Consulte a documentação completa
- Verifique o FAQ no repositório

## 8. Customização Inicial

### 8.1 Configurações Recomendadas

1. **Editor Config**
   ```
   root = true

   [*]
   indent_style = space
   indent_size = 2
   end_of_line = lf
   charset = utf-8
   ```

2. **Git Hooks** (Opcional)
   - Pre-commit para validação
   - Post-commit para atualizações

### 8.2 Variáveis de Ambiente

Crie um arquivo `.env`:
```
MCP_PROJECT_NAME=seu-projeto
MCP_GITHUB_TOKEN=seu-token
```

## 9. Checklist de Instalação

- [ ] Repository forked/clonado
- [ ] Dependencies instaladas
- [ ] project-status.json configurado
- [ ] Estrutura de diretórios verificada
- [ ] Teste básico realizado
- [ ] Documentação revisada

---

Continue para a [Parte 2](INSTRUCTIONS_PART2.md) para aprender sobre o uso diário e operações avançadas.