# Recursos e Referências para MCP e Claude

Este documento reúne recursos úteis para trabalhar com Model Context Protocol (MCP) e Claude.

## Recursos Oficiais

### Anthropic - Documentação Oficial
- Introdução ao Model Context Protocol
- Explicações sobre conexão com fontes de dados e ferramentas
- Exemplos práticos de uso com Claude

### Especificação MCP
- Disponível em spec.modelcontextprotocol.io
- Seção "Prompts – Specification (Latest)"
- Definição detalhada dos prompts
- Modelo de interação
- Especificação das mensagens de instrução

## Prompts Otimizados para Automação

### Claude Projects
Claude Projects é um recurso avançado que oferece:
- Grande janela de contexto (até 200 mil tokens)
- Capacidade de manter entendimento profundo do ambiente
- Execução de tarefas complexas com instruções curtas
- Economia de tokens através de prompts concisos

### Exemplos de Prompts por Categoria

#### Gerenciamento de Processos
```
# Listar processos por uso
"Liste todos os processos consumindo mais de 80% da CPU, mostrando PID, nome e porcentagem de CPU."

# Encerrar processo específico
"Encerre o processo apache2 se ele estiver em execução e consumindo memória excessiva."

# Identificar processos zumbi
"Verifique se há processos zumbi no servidor e finalize-os de forma segura."
```

#### Reinicialização de Serviços
```
# Reinício simples
"Reinicie o serviço nginx agora."

# Reinício com verificação
"Reinicie o serviço mysql e confirme se ele foi iniciado corretamente em seguida."

# Agendamento de reinício
"Agende a reinicialização do serviço redis para 03:00 da manhã e notifique quando concluído."
```

#### Monitoramento de Desempenho
```
# Resumo de recursos
"Obtenha o uso atual de CPU, memória RAM e espaço em disco do servidor em um resumo curto."

# Top processos
"Quais são os 5 processos que mais consumiram CPU nos últimos 15 minutos?"

# Detecção de anomalias
"Analise os logs de desempenho das últimas 24h e destaque qualquer anomalia de alta latência ou erro."
```

#### Manipulação de Arquivos
```
# Busca e substituição
"No arquivo /etc/app/config.yaml, substitua todas as ocorrências de localhost por 0.0.0.0."

# Compressão de logs
"Compacte a pasta /var/logs/ do mês atual em um arquivo logs.zip."

# Limpeza de arquivos antigos
"Apague arquivos .log em /var/log/ com mais de 30 dias, preservando os mais recentes."
```

#### Execução de Comandos Remotos
```
# Comando via SSH
"No servidor remoto backup01 (via SSH), execute o comando df -h e retorne a saída formatada."

# Execução de script
"Conecte ao servidor web02 e rode o script /opt/scripts/backup.sh, depois informe se foi executado com sucesso."

# Configuração remota
"Via SSH no servidor db01, crie um usuário analyst com acesso somente leitura ao banco de dados."
```

### Melhores Práticas para Prompts
1. Use linguagem clara e imperativa
2. Foque no objetivo final
3. Omita detalhes supérfluos
4. Estruture comandos de forma lógica
5. Inclua apenas parâmetros essenciais

## Recursos da Comunidade

### GitHub
- Repositório "Awesome Claude Prompts"
- Coleção de exemplos de prompts
- Instruções para projetos usando MCP
- Exemplos de integração de ferramentas

### Reddit (r/ClaudeAI)
- Experiências da comunidade
- Guias de configuração
- Exemplos práticos de uso
- Dicas de integração de ferramentas

## Guias e Tutoriais

### Role Prompting
- Documentação "Giving Claude a role with system prompt"
- Como definir papéis específicos
- Uso do parâmetro system
- Otimização de performance

### Recursos em Vídeo
- "Anthropic's Model Context Protocol – Add YOUR App to Claude AI!"
- Demonstrações práticas
- Integração de aplicativos
- Exemplos de uso das ferramentas de servidor

## Links Úteis

- [Documentação Anthropic](https://docs.anthropic.com)
- [Especificação MCP](https://spec.modelcontextprotocol.io)
- [Comunidade Claude no Reddit](https://reddit.com/r/ClaudeAI)
- [Awesome Claude Prompts](https://github.com/topics/claude-prompts)

## Contribuindo

Se você conhece outros recursos úteis, sinta-se à vontade para:
1. Abrir uma issue sugerindo novos recursos
2. Criar um pull request adicionando conteúdo
3. Compartilhar suas experiências na seção de discussões

---

*Este documento é mantido pela comunidade e atualizado regularmente.*