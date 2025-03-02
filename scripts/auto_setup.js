/**
 * Script para configuração automática do ambiente de continuidade MCP
 * 
 * Este script automatiza a inicialização e configuração do project-status.json,
 * identificando automaticamente informações do repositório e configurando
 * o ambiente para desenvolvimento contínuo.
 */

/**
 * Configura e inicializa o project-status.json automaticamente
 * @param {string} repositoryUrl - URL ou identificador do repositório
 * @returns {Promise<Object>} - Estado do projeto configurado
 */
async function setupProjectState(repositoryUrl) {
  console.log(`🚀 Configurando ambiente para o repositório: ${repositoryUrl}`);
  
  // Extrai informações do repositório a partir da URL
  const repoPath = repositoryUrl.split('/').slice(-2).join('/').replace('.git', '');
  const repoName = repoPath.split('/')[1] || repositoryUrl.split('/').pop() || 'project';
  
  // Determina o caminho para o project-status.json
  const projectStatusPath = 'project-status.json';
  
  // Verifica se o state já existe
  let projectState;
  try {
    // Tenta carregar o estado existente
    projectState = await loadProjectState(projectStatusPath);
    console.log('✅ project-status.json encontrado para ' + repoName);
  } catch (error) {
    console.log('⚠️ project-status.json não encontrado. Criando um novo com dados do repositório...');
    
    // Coleta informações do repositório para preencher dinamicamente o template
    let mainFiles = [];
    try {
      // Lista os arquivos disponíveis para identificar arquivos principais
      const files = await window.fs.readdir('.');
      mainFiles = files.filter(f => 
        f.endsWith('.js') || f.endsWith('.py') || f.endsWith('.html') || 
        f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.tsx')
      );
    } catch (e) {
      console.log('Não foi possível listar arquivos:', e);
    }
    
    // Define arquivo inicial baseado em convenções comuns
    const defaultMainFile = mainFiles.find(f => 
      ['index.js', 'main.js', 'app.js', 'index.jsx', 'index.ts', 'app.py'].includes(f)
    ) || (mainFiles.length > 0 ? mainFiles[0] : 'main.js');
    
    // Cria um template preenchido com informações do repositório
    const template = {
      projectInfo: {
        name: repoName,
        repository: repositoryUrl,
        lastUpdated: new Date().toISOString()
      },
      development: {
        currentFile: defaultMainFile,
        currentComponent: repoName + "Component",
        inProgress: {
          type: "feature",
          description: "Configuração inicial do projeto " + repoName,
          remainingTasks: ["Análise de requisitos", "Planejamento da arquitetura", "Implementação de funcionalidades core"]
        }
      },
      components: {
        completed: [],
        inProgress: [{name: "Sistema de Configuração", priority: "high"}],
        pending: [{name: "Interface de Usuário", priority: "medium"}, {name: "Testes", priority: "high"}]
      },
      context: {
        lastThought: "Iniciar o desenvolvimento com foco na arquitetura principal do " + repoName,
        nextSteps: ["Estruturar diretórios", "Definir interfaces principais", "Configurar ferramentas de build"],
        dependencies: []
      },
      mcpTools: {
        lastUsed: {
          repl: null,
          artifacts: [],
          searchResults: []
        },
        cacheFiles: [],
        tempStorage: []
      }
    };
    
    // Salva o template com informações reais
    await write_file({
      path: projectStatusPath,
      content: JSON.stringify(template, null, 2)
    });
    
    projectState = template;
    console.log('✅ Novo project-status.json criado com dados do repositório ' + repoName);
  }
  
  return projectState;
}

/**
 * Analisa a estrutura do repositório
 * @returns {Promise<Object>} - Informações sobre a estrutura do repositório
 */
async function analyzeRepository() {
  try {
    // Lista arquivos e diretórios
    const files = await window.fs.readdir('.');
    console.log('📁 Estrutura do repositório:');
    
    // Identifica diretórios
    const dirs = [];
    for (const file of files) {
      try {
        const stat = await window.fs.stat(file);
        if (stat.isDirectory()) {
          dirs.push(file);
        }
      } catch (e) {
        // Ignora erros ao verificar diretórios
      }
    }
    
    // Categoriza arquivos para uma visão geral
    const categories = {
      code: files.filter(f => /\.(js|jsx|ts|tsx|py|java|cpp|c|go|rb|php)$/i.test(f)),
      config: files.filter(f => /(config|settings|\.json|\.yml|\.xml)$/i.test(f)),
      docs: files.filter(f => /\.(md|txt|pdf|doc)$/i.test(f)),
      web: files.filter(f => /\.(html|css|scss)$/i.test(f)),
      dirs: dirs
    };
    
    // Mostra categorias relevantes
    console.log(`- ${categories.dirs.length} diretórios`);
    console.log(`- ${categories.code.length} arquivos de código`);
    console.log(`- ${categories.config.length} arquivos de configuração`);
    console.log(`- ${categories.docs.length} arquivos de documentação`);
    
    return {
      fileCount: files.length,
      categories: categories
    };
  } catch (e) {
    console.log('Não foi possível analisar o repositório:', e);
    return { fileCount: 0, categories: {} };
  }
}

/**
 * Inicializa o ambiente completo para o repositório
 * @param {string} repositoryUrl - URL ou identificador do repositório
 * @returns {Promise<Object>} - Informações do ambiente inicializado
 */
async function initializeEnvironment(repositoryUrl) {
  try {
    console.log('🔄 Inicializando ambiente MCP...');
    
    // Configura o estado do projeto
    const projectState = await setupProjectState(repositoryUrl);
    
    // Analisa o repositório
    const repoAnalysis = await analyzeRepository();
    
    // Gera prompt de continuidade
    const continuityPrompt = generateContinuityPrompt(projectState);
    
    // Exibe informações de resumo
    console.log('\n📊 Resumo do Ambiente:');
    console.log(`- Projeto: ${projectState.projectInfo.name}`);
    console.log(`- Arquivo atual: ${projectState.development.currentFile}`);
    console.log(`- Tarefa em progresso: ${projectState.development.inProgress.description}`);
    console.log(`- Total de arquivos: ${repoAnalysis.fileCount}`);
    
    console.log('\n🔄 Prompt de continuidade para próximas sessões:');
    console.log(continuityPrompt);
    
    return {
      projectState,
      repoAnalysis,
      continuityPrompt
    };
  } catch (error) {
    console.error('❌ Erro ao inicializar ambiente:', error);
    throw error;
  }
}

// Exporta funções para uso direto
// Uso: await initializeEnvironment('usuario/repositorio');
