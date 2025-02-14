# MCP Continuity Tool

Uma ferramenta para manter contexto e continuidade em desenvolvimento usando MCP através de múltiplas sessões de chat.

## Como Usar em Seus Projetos

1. No início de cada chat com Claude, diga:
   ```
   Por favor, acesse https://github.com/Lucasdoreac/mcp-continuity-tool e use as instruções para continuidade de desenvolvimento.
   ```

2. Claude irá carregar as instruções e perguntar:
   - Qual repositório você deseja continuar trabalhando?
   - Se deseja criar um novo projeto ou continuar um existente

3. Quando Claude perguntar pelo repositório, forneça o link do seu GitHub e ele irá:
   - Carregar o estado do projeto
   - Configurar o ambiente de desenvolvimento
   - Continuar exatamente de onde parou

## Benefícios

- **Manutenção de Contexto**: Mantenha o estado entre sessões
- **Otimização de Tokens**: Use cache e operações em lote
- **Padronização**: Mantenha consistência no desenvolvimento
- **Recuperação Eficiente**: Retome trabalho facilmente

## Estrutura

```
/mcp-continuity-tool
├── /docs
│   ├── INSTRUCTIONS.md         # Guia completo
│   ├── INSTRUCTIONS_PART1.md   # Parte 1 das instruções
│   └── INSTRUCTIONS_PART2.md   # Parte 2 das instruções
├── /scripts
│   └── combine_instructions.js # Script para combinar instruções
├── /templates
│   └── project-status.json    # Template de status
└── README.md                  # Este arquivo
```

## Começando

1. **Para Novo Projeto**
   - Fork este repositório
   - Configure project-status.json para seu projeto
   - Siga as instruções em docs/INSTRUCTIONS.md

2. **Para Projeto Existente**
   - Adicione project-status.json ao seu repositório
   - Use o template fornecido em templates/
   - Inicie nova sessão com Claude usando as instruções acima

## Contribuindo

Contribuições são bem-vindas! Especialmente para:
- Melhorar as instruções
- Adicionar novos templates
- Otimizar scripts
- Documentar casos de uso

## Exemplos de Uso

1. **Desenvolvimento Web**
   ```javascript
   // No início da sessão
   const status = await initSession(repoUrl);
   console.log('Estado atual:', status);
   ```

2. **Análise de Código**
   ```javascript
   // Carregar múltiplos arquivos
   const files = await read_multiple_files({
     paths: ['src/components/*.js']
   });
   ```

3. **Testes e Debug**
   ```javascript
   // Usar REPL para testes
   // Use exemplos do docs/INSTRUCTIONS.md
   ```

## Licença

MIT

---

**Nota**: Este é um projeto em desenvolvimento. Sugestões e contribuições são muito bem-vindas!