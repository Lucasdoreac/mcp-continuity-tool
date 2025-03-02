# MCP Continuity Tool

Uma ferramenta abrangente para implementar recursos de servidor Model Context Protocol (MCP), otimizando o gerenciamento de contexto e contagem de tokens em aplicações de IA.

## 🚀 Recursos

- Gerenciamento de contexto contínuo
- Contagem de tokens otimizada
- Integração com servidor MCP
- Atualizações de contexto em tempo real
- Monitoramento de desempenho
- Persistência de estado
- Gerenciamento de artefatos

## 🛠️ Ferramentas do Servidor

### Ferramentas Disponíveis

1. **Artefatos**
   - Crie e gerencie partes de conteúdo independentes
   - Suporte para múltiplos tipos de conteúdo (código, markdown, SVG, etc.)
   - Controle de versão e atualizações

2. **REPL/Ferramenta de Análise**
   - Ambiente de execução JavaScript
   - Acesso ao sistema de arquivos
   - Recursos de análise de dados
   - Processamento de arquivos CSV e Excel

3. **Operações do Sistema de Arquivos**
   - Operações de leitura/escrita
   - Gerenciamento de diretórios
   - Busca e manipulação de arquivos
   - Operações com múltiplos arquivos

4. **GitHub Integration**
   - Sincronização com repositórios
   - Controle de versão
   - Automação de tarefas
   - Workflows de integração contínua

5. **State Management**
   - Persistência entre sessões
   - Restauração de contexto
   - Tracking de progresso
   - Templates JSON para estado do projeto

## 📋 Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Lucasdoreac/mcp-continuity-tool.git

# Entre no diretório
cd mcp-continuity-tool

# Instale as dependências
npm install
```

### Uso Básico

1. **Iniciar um novo projeto**

```bash
# Inicialize o project-status.json
cp templates/project-status.json seu-projeto/project-status.json
```

2. **Manter continuidade entre sessões**

Use o template de prompt fornecido em `docs/CONTINUITY_PROMPT.md` para
manter a continuidade entre diferentes sessões de chat com o Claude.

3. **Combinar arquivos de instruções**

```bash
# Via MCP
await combineInstructions();

# Via Node.js
npm run combine
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja `docs/INSTRUCTIONS.md` para informações detalhadas sobre como contribuir.

## 📚 Recursos Adicionais

- [Documentação Completa](docs/INSTRUCTIONS.md)
- [Templates de Prompt](docs/PROMPT_TEMPLATE.md)
- [Recursos e Referências](docs/RESOURCES.md)

## ⚙️ Automação

Este projeto utiliza GitHub Actions para automação de tarefas:

- Combinação automática de arquivos de instruções
- Verificação de sintaxe e formatação
- Testes automatizados

## 📄 Licença

MIT License
