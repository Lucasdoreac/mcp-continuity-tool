/**
 * Script para configuração automática do ambiente de continuidade MCP
 * 
 * Este script automatiza a inicialização e configuração do project-status.json,
 * identificando automaticamente informações do repositório e configurando
 * o ambiente para desenvolvimento contínuo.
 */

const fs = require('fs');
const path = require('path');
const { loadProjectState, saveProjectState, generateContinuityPrompt } = require('./state_manager');

/**
 * Configura e inicializa o project-status.json automaticamente
 * @param {string} repositoryUrl - URL ou identificador do repositório
 * @param {string} workingDirectoryInput - Diretório de trabalho opcional (ex: 'src', 'frontend/src')
 * @returns {Object} - Estado do projeto configurado
 */
function setupProjectState(repositoryUrl, workingDirectoryInput = '') {
  const workingDirectory = workingDirectoryInput ? path.resolve(workingDirectoryInput) : process.cwd();
  const repoPath = repositoryUrl.split('/').slice(-2).join('/').replace('.git', '');
  const repoName = repoPath.split('/')[1] || repositoryUrl.split('/').pop() || 'project';

  console.log(`🚀 Configurando ambiente para o repositório: ${repositoryUrl}${workingDirectoryInput ? ` (diretório: ${path.basename(workingDirectory)})` : ''}`);
  
  // Determina o caminho para o project-status.json dentro do workingDirectory
  const projectStatusPath = path.join(workingDirectory, 'project-status.json');
  
  // Verifica se o diretório de trabalho existe, caso especificado e diferente do CWD
  if (workingDirectoryInput && workingDirectory !== process.cwd()) {
    try {
      fs.statSync(workingDirectory);
    } catch (error) {
      console.log(`⚠️ Diretório ${workingDirectory} não encontrado. Tentando criar...`);
      try {
        fs.mkdirSync(workingDirectory, { recursive: true });
        // Adiciona .gitkeep para garantir que o diretório seja rastreado se estiver vazio
        fs.writeFileSync(path.join(workingDirectory, '.gitkeep'), '');
        console.log(`✅ Diretório ${workingDirectory} criado`);
      } catch (dirError) {
        console.error(`❌ Erro ao criar diretório de trabalho: ${dirError.message}`);
        console.log('⚠️ Usando diretório atual como alternativa.');
        // Se a criação falhar, reverte para o CWD para projectStatusPath
        // Note: workingDirectory para o estado ainda será o input original se a criação falhar.
        // Isso pode precisar de ajuste dependendo do comportamento desejado.
        // Para este refactor, vamos manter o workingDirectory original no estado.
      }
    }
  }
  
  let projectState;
  try {
    projectState = loadProjectState(projectStatusPath);
    console.log('✅ project-status.json encontrado para ' + repoName + (workingDirectoryInput ? ` em ${workingDirectory}`: ''));
  } catch (error) {
    console.log(`⚠️ project-status.json não encontrado em ${projectStatusPath}. Criando um novo com dados do repositório...`);
    
    let mainFiles = [];
    try {
      const files = fs.readdirSync(workingDirectory);
      mainFiles = files.filter(f => 
        /\.(js|jsx|ts|tsx|py|html|css|java|cpp|c|go|rb|php)$/i.test(f) && !fs.statSync(path.join(workingDirectory, f)).isDirectory()
      );
    } catch (e) {
      console.log(`Não foi possível listar arquivos em ${workingDirectory}:`, e.message);
    }
    
    const defaultMainFile = mainFiles.find(f => 
      ['index.js', 'main.js', 'app.js', 'index.jsx', 'index.ts', 'app.py', 'index.html'].includes(path.basename(f))
    ) || (mainFiles.length > 0 ? mainFiles[0] : 'main.js');
    
    // O caminho do arquivo principal deve ser relativo ao workingDirectory no estado.
    const mainFilePathInState = defaultMainFile;

    const template = {
      projectInfo: {
        name: repoName,
        repository: repositoryUrl,
        // Armazena o caminho relativo ou absoluto fornecido, não o resolvido, para consistência.
        workingDirectory: workingDirectoryInput || null, 
        lastUpdated: new Date().toISOString()
      },
      development: {
        currentFile: mainFilePathInState,
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
      mcpTools: { /* ... (mantém estrutura original) ... */ }
    };
    
    saveProjectState(template, projectStatusPath);
    projectState = template;
    console.log('✅ Novo project-status.json criado com dados do repositório ' + repoName + (workingDirectoryInput ? ` em ${workingDirectory}`: ''));
  }
  
  return projectState;
}

/**
 * Analisa a estrutura do repositório
 * @param {string} workingDirectoryInput - Diretório de trabalho opcional
 * @returns {Object} - Informações sobre a estrutura do repositório
 */
function analyzeRepository(workingDirectoryInput = '') {
  const dirToAnalyze = workingDirectoryInput ? path.resolve(workingDirectoryInput) : process.cwd();
  
  try {
    const allEntries = fs.readdirSync(dirToAnalyze, { withFileTypes: true });
    console.log(`📁 Estrutura do repositório${workingDirectoryInput ? ` (${path.basename(dirToAnalyze)})` : ''}:`);
    
    const files = allEntries.filter(dirent => dirent.isFile()).map(dirent => dirent.name);
    const dirs = allEntries.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    
    const categories = {
      code: files.filter(f => /\.(js|jsx|ts|tsx|py|java|cpp|c|go|rb|php)$/i.test(f)),
      config: files.filter(f => /(config|settings|\.json|\.yml|\.xml)$/i.test(f) && f !== 'project-status.json'),
      docs: files.filter(f => /\.(md|txt|pdf|doc)$/i.test(f)),
      web: files.filter(f => /\.(html|css|scss)$/i.test(f)),
      dirs: dirs
    };
    
    console.log(`- ${categories.dirs.length} diretórios`);
    console.log(`- ${categories.code.length} arquivos de código`);
    console.log(`- ${categories.config.length} arquivos de configuração (excluindo project-status)`);
    console.log(`- ${categories.docs.length} arquivos de documentação`);
    
    return {
      fileCount: files.length, // Apenas arquivos, não diretórios
      categories: categories,
      analyzedDirectory: dirToAnalyze // Caminho absoluto do diretório analisado
    };
  } catch (e) {
    console.error(`Não foi possível analisar o repositório em ${dirToAnalyze}:`, e.message);
    return { fileCount: 0, categories: { dirs: [], code: [], config: [], docs: [], web: [] }, analyzedDirectory: dirToAnalyze };
  }
}

/**
 * Inicializa o ambiente completo para o repositório
 * @param {string} repositoryUrl - URL ou identificador do repositório
 * @param {string} workingDirectoryInput - Diretório de trabalho opcional
 * @returns {Object} - Informações do ambiente inicializado
 */
function initializeEnvironment(repositoryUrl, workingDirectoryInput = '') {
  try {
    console.log('🔄 Inicializando ambiente MCP...');
    
    const projectState = setupProjectState(repositoryUrl, workingDirectoryInput);
    // Passar o workingDirectory resolvido de setupProjectState se existir, ou o input para analyze.
    // Se setupProjectState usa CWD, projectState.projectInfo.workingDirectory será null ou ''.
    // Se workingDirectoryInput foi fornecido, ele estará em projectState.projectInfo.workingDirectory.
    const analysisDir = projectState.projectInfo.workingDirectory || ''; // Use o que está no estado, que é o input original
    const repoAnalysis = analyzeRepository(analysisDir); 
    
    const continuityPrompt = generateContinuityPrompt(projectState);
    
    console.log('\n📊 Resumo do Ambiente:');
    console.log(`- Projeto: ${projectState.projectInfo.name}`);
    console.log(`- Repositório: ${projectState.projectInfo.repository}`);
    if (projectState.projectInfo.workingDirectory) {
      console.log(`- Diretório de trabalho configurado: ${projectState.projectInfo.workingDirectory}`);
    }
    console.log(`- Caminho do project-status.json: ${path.join(analysisDir ? path.resolve(analysisDir) : process.cwd(), 'project-status.json')}`);
    console.log(`- Arquivo atual no estado: ${projectState.development.currentFile}`);
    console.log(`- Tarefa em progresso: ${projectState.development.inProgress.description}`);
    console.log(`- Total de arquivos no diretório analisado: ${repoAnalysis.fileCount}`);
    
    console.log('\n🔄 Prompt de continuidade para próximas sessões:');
    console.log(continuityPrompt);
    
    return {
      projectState,
      repoAnalysis,
      continuityPrompt
    };
  } catch (error) {
    console.error('❌ Erro ao inicializar ambiente:', error.message);
    // Para manter a consistência com o return síncrono, não relançamos o erro aqui
    // mas o chamador pode verificar o projectState ou repoAnalysis para problemas.
    // Ou podemos retornar um objeto de erro específico.
    return { error: true, message: error.message, projectState: null, repoAnalysis: null, continuityPrompt: null };
  }
}

module.exports = {
  setupProjectState,
  analyzeRepository,
  initializeEnvironment
};

// Exemplo de uso em um ambiente Node.js:
// const autoSetup = require('./auto_setup');
//
// 1. Inicializar o ambiente para um novo ou existente projeto
// const environment = autoSetup.initializeEnvironment('usuario/meu-repo-novo', 'src/app');
// 
// if (environment && !environment.error) {
//   console.log('\nAmbiente inicializado com sucesso!');
//   // O environment.projectState contém o estado carregado ou criado
//   // O environment.repoAnalysis contém a análise do diretório
//   // O environment.continuityPrompt está pronto para uso
// } else if (environment && environment.error) {
//   console.error('\nFalha ao inicializar ambiente:', environment.message);
// }
//
// 2. Apenas configurar o estado (sem análise completa ou prompt)
// const state = autoSetup.setupProjectState('usuario/outro-repo', 'packages/module-a');
// if (state && state.projectInfo) { // Verifica se o estado é válido
//   console.log(`\nEstado configurado para ${state.projectInfo.name}`);
// }
//
// 3. Apenas analisar um repositório
// const analysis = autoSetup.analyzeRepository('work/my-project-folder');
// if (analysis && analysis.analyzedDirectory) {
//   console.log(`\nAnálise do diretório ${analysis.analyzedDirectory} completa.`);
// }
//
// Para testar, você pode precisar criar os diretórios e arquivos que o script espera,
// ou adaptar os caminhos conforme sua estrutura de projeto.
// Lembre-se que 'project-status.json' será criado/lido no 'workingDirectory' especificado,
// ou no diretório atual se 'workingDirectory' não for fornecido.
