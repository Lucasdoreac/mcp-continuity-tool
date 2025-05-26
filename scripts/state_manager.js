/**
 * Gerenciador de estado para manter continuidade entre sessões MCP
 * 
 * @fileoverview
 * Este script fornece funções para carregar, salvar e atualizar o estado
 * do projeto entre sessões, auxiliando na continuidade do desenvolvimento.
 */

const fs = require('fs');
const path = require('path');

/**
 * Loads the current project state from a JSON file.
 *
 * Attempts to read and parse the specified project state file. If the file cannot be loaded or parsed, returns a default project state object with predefined structure.
 *
 * @param {string} [projectPath='project-status.json'] - Path to the project state JSON file.
 * @returns {Object} The loaded project state, or a default state object if loading fails.
 */
function loadProjectState(projectPath = 'project-status.json') {
  try {
    // Resolve o caminho para ser absoluto, caso seja relativo
    const absolutePath = path.resolve(projectPath);
    const state = fs.readFileSync(absolutePath, { encoding: 'utf8' });
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
 * Saves the current project state to a JSON file at the specified path.
 *
 * Updates the `lastUpdated` property with the current ISO date before saving.
 *
 * @param {Object} state - The project state object to be saved.
 * @param {string} [projectPath='project-status.json'] - Path to the JSON file where the state will be saved.
 * @returns {Object} An object indicating success or failure, with a message or error details.
 */
function saveProjectState(state, projectPath = 'project-status.json') {
  try {
    // Atualiza a data da última modificação
    state.projectInfo.lastUpdated = new Date().toISOString();
    
    // Converte o objeto em JSON formatado para legibilidade
    const content = JSON.stringify(state, null, 2);
    
    // Resolve o caminho para ser absoluto
    const absolutePath = path.resolve(projectPath);
    
    // Salva o arquivo
    fs.writeFileSync(absolutePath, content);
    
    return { success: true, message: 'Estado do projeto salvo com sucesso!' };
  } catch (error) {
    console.error('Erro ao salvar o estado do projeto:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates specific fields in the project state by merging the provided updates and saving the result.
 *
 * @param {Object} updates - Fields and values to merge into the current project state.
 * @param {string} [projectPath='project-status.json'] - Path to the project state JSON file.
 * @returns {Object} The updated project state object, or an error object if the update fails.
 */
function updateProjectState(updates, projectPath = 'project-status.json') {
  try {
    // Carrega o estado atual
    const currentState = loadProjectState(projectPath);
    
    // Função auxiliar para mesclar objetos de forma profunda
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] instanceof Object && key in target) {
          // Verifica se target[key] é null ou não é um objeto antes de recorrer
          if (typeof target[key] !== 'object' || target[key] === null) {
            target[key] = {}; // Inicializa se não for um objeto mesclável
          }
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
    saveProjectState(updatedState, projectPath);
    
    return updatedState;
  } catch (error) {
    console.error('Erro ao atualizar o estado do projeto:', error);
    // Retorna o erro ou um objeto indicando falha, mas não o estado padrão de loadProjectState
    return { success: false, error: error.message, details: "Failed during update operation" };
  }
}

/**
 * Generates a formatted development continuity prompt based on the current project state.
 *
 * Returns a string containing repository information, current context, and a simplified project state summary for use with MCP server tools.
 *
 * @param {Object} state - The current project state object.
 * @returns {string} A formatted prompt for development continuity, or a message if the state is unavailable.
 */
function generateContinuityPrompt(state) {
  if (!state || !state.projectInfo) {
    return 'Estado do projeto não disponível. Carregue o estado primeiro.';
  }
  
  // Extrai informações relevantes do estado
  const { projectInfo, development, context } = state;
  
  // Cria o prompt no formato otimizado
  const repositoryUrl = projectInfo.repository || '[REPOSITÓRIO]';
  const currentContext = context.lastThought || (development.inProgress && development.inProgress.description) || '[CONTEXTO_ATUAL]';
  
  // Simplifica o estado para o prompt (apenas o necessário)
  const simplifiedState = {
    projectInfo: {
      name: projectInfo.name,
      currentTask: (development.inProgress && development.inProgress.description),
      lastState: context.lastThought
    },
    development: {
      currentFile: development.currentFile,
      inProgress: (development.inProgress && (development.inProgress.type + ': ' + development.inProgress.description))
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

module.exports = {
  loadProjectState,
  saveProjectState,
  updateProjectState,
  generateContinuityPrompt
};

// Exemplo de uso em um ambiente Node.js:
//
// const stateManager = require('./state_manager');
// 
// 1. Carregar o estado atual
// const state = stateManager.loadProjectState('seu-projeto/project-status.json');
// console.log('Estado carregado:', state);
// 
// 2. Atualizar informações
// const updates = {
//   development: {
//     currentFile: 'src/another_component.js',
//     inProgress: {
//       description: 'Refatorando módulo de estado'
//     }
//   },
//   context: {
//     lastThought: "O refatoramento está progredindo bem."
//   }
// };
// const updated = stateManager.updateProjectState(updates, 'seu-projeto/project-status.json');
// console.log('Estado atualizado:', updated);
// 
// 3. Gerar prompt de continuidade
// const reloadedState = stateManager.loadProjectState('seu-projeto/project-status.json'); // Recarrega para pegar as atualizações
// const prompt = stateManager.generateContinuityPrompt(reloadedState);
// console.log(prompt);
//
// Para testar, você pode criar um arquivo 'seu-projeto/project-status.json'
// ou deixar que o loadProjectState crie um estado padrão.
// Exemplo de 'seu-projeto/project-status.json':
// {
//   "projectInfo": {
//     "name": "Meu Projeto Teste",
//     "repository": "https://github.com/user/meu-projeto-teste.git",
//     "lastUpdated": "2023-10-27T10:00:00.000Z"
//   },
//   "development": {
//     "currentFile": "src/main.js",
//     "currentComponent": "MainModule",
//     "inProgress": {
//       "type": "feature",
//       "description": "Desenvolvendo funcionalidade principal",
//       "remainingTasks": ["Task1", "Task2"]
//     }
//   },
//   "components": {
//     "completed": ["AuthModule"],
//     "inProgress": ["PaymentModule"],
//     "pending": ["UserDashboard"]
//   },
//   "context": {
//     "lastThought": "Preciso focar na integração do módulo de pagamento.",
//     "nextSteps": ["Testar API de pagamento", "Criar UI do dashboard"],
//     "dependencies": ["stripe-node", "axios"]
//   },
//   "mcpTools": {
//     "lastUsed": {
//       "repl": "node",
//       "artifacts": ["build/app.zip"],
//       "searchResults": ["stripe api docs"]
//     },
//     "cacheFiles": ["temp/stripe_response.json"],
//     "tempStorage": ["user_session_token_xyz"]
//   }
// }
