/**
 * Gerenciador de estado para manter continuidade entre sessões MCP
 * 
 * @fileoverview
 * Este script fornece funções para carregar, salvar e atualizar o estado
 * do projeto entre sessões, auxiliando na continuidade do desenvolvimento.
 */

/**
 * Carrega o estado atual do projeto
 * @param {string} projectPath - Caminho para o arquivo project-status.json
 * @returns {Promise<Object>} - Objeto com o estado do projeto
 */
async function loadProjectState(projectPath = 'project-status.json') {
  try {
    const state = await window.fs.readFile(projectPath, { encoding: 'utf8' });
    return JSON.parse(state);
  } catch (error) {
    console.error('Erro ao carregar o estado do projeto:', error);
    // Retorna um modelo padrão se falhar ao carregar o arquivo
    return {
      projectInfo: {
        name: "Project",
        repository: "",
        lastUpdated: new Date().toISOString()
      },
      development: {
        currentFile: "",
        currentComponent: "",
        inProgress: {
          type: "feature",
          description: "",
          remainingTasks: []
        }
      },
      components: {
        completed: [],
        inProgress: [],
        pending: []
      },
      context: {
        lastThought: "",
        nextSteps: [],
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
  }
}

/**
 * Salva o estado atual do projeto
 * @param {Object} state - Objeto de estado a ser salvo
 * @param {string} projectPath - Caminho para o arquivo project-status.json
 * @returns {Promise<Object>} - Resultado da operação
 */
async function saveProjectState(state, projectPath = 'project-status.json') {
  try {
    // Atualiza a data da última modificação
    state.projectInfo.lastUpdated = new Date().toISOString();
    
    // Converte o objeto em JSON formatado para legibilidade
    const content = JSON.stringify(state, null, 2);
    
    // Salva o arquivo usando a função write_file disponível no MCP
    await write_file({
      path: projectPath,
      content
    });
    
    return { success: true, message: 'Estado do projeto salvo com sucesso!' };
  } catch (error) {
    console.error('Erro ao salvar o estado do projeto:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza campos específicos no estado do projeto
 * @param {Object} updates - Objeto com os campos a serem atualizados
 * @param {string} projectPath - Caminho para o arquivo project-status.json
 * @returns {Promise<Object>} - Objeto atualizado de estado
 */
async function updateProjectState(updates, projectPath = 'project-status.json') {
  try {
    // Carrega o estado atual
    const currentState = await loadProjectState(projectPath);
    
    // Função auxiliar para mesclar objetos de forma profunda
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] instanceof Object && key in target) {
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };
    
    // Mescla as atualizações com o estado atual
    const updatedState = deepMerge(currentState, updates);
    
    // Salva o estado atualizado
    await saveProjectState(updatedState, projectPath);
    
    return updatedState;
  } catch (error) {
    console.error('Erro ao atualizar o estado do projeto:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Gera um prompt de continuidade baseado no estado atual
 * @param {Object} state - Estado atual do projeto
 * @returns {string} - Prompt formatado para continuidade
 */
function generateContinuityPrompt(state) {
  if (!state || !state.projectInfo) {
    return 'Estado do projeto não disponível. Carregue o estado primeiro.';
  }
  
  // Extrai informações relevantes do estado
  const { projectInfo, development, context } = state;
  
  // Cria o prompt no formato otimizado
  const repositoryUrl = projectInfo.repository || '[REPOSITÓRIO]';
  const currentContext = context.lastThought || development.inProgress.description || '[CONTEXTO_ATUAL]';
  
  // Simplifica o estado para o prompt (apenas o necessário)
  const simplifiedState = {
    projectInfo: {
      name: projectInfo.name,
      currentTask: development.inProgress.description,
      lastState: context.lastThought
    },
    development: {
      currentFile: development.currentFile,
      inProgress: development.inProgress.type + ': ' + development.inProgress.description
    }
  };
  
  // Formata o prompt
  return `Use MCP toolset from https://github.com/Lucasdoreac/mcp-continuity-tool for development continuity:

Working on: ${repositoryUrl}
Context: ${currentContext}
Status from project-status.json:
${JSON.stringify(simplifiedState, null, 2)}

Continue development from this state using MCP server tools for context preservation.`;
}

// Exemplo de uso no ambiente MCP:
// 
// 1. Carregar o estado atual
// const state = await loadProjectState('seu-projeto/project-status.json');
// 
// 2. Atualizar informações
// await updateProjectState({
//   development: {
//     currentFile: 'src/component.js',
//     inProgress: {
//       description: 'Implementando recurso X'
//     }
//   }
// }, 'seu-projeto/project-status.json');
// 
// 3. Gerar prompt de continuidade
// const prompt = generateContinuityPrompt(state);
// console.log(prompt); // Copie este prompt para a próxima sessão
