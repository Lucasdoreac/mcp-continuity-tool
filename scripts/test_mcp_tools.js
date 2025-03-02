/**
 * Script de teste para verificar a funcionalidade das ferramentas MCP
 * Este script pode ser usado para identificar problemas no ambiente MCP
 */

async function testMcpTools() {
  console.log('Iniciando testes das ferramentas MCP...');
  
  // Array para armazenar resultados dos testes
  const testResults = {
    fileSystem: { success: false, error: null },
    stateManagement: { success: false, error: null },
    instructionsCombine: { success: false, error: null }
  };
  
  try {
    // 1. Teste de leitura/escrita de arquivos
    console.log('\n--- Testando sistema de arquivos ---');
    try {
      const testContent = `Teste de escrita - ${new Date().toISOString()}`;
      
      // Cria um arquivo de teste
      await write_file({
        path: 'test-mcp-file.txt',
        content: testContent
      });
      console.log('✅ Escrita de arquivo bem-sucedida');
      
      // Lê o arquivo criado
      const readContent = await window.fs.readFile('test-mcp-file.txt', { encoding: 'utf8' });
      
      // Verifica se o conteúdo lido corresponde ao conteúdo escrito
      if (readContent === testContent) {
        console.log('✅ Leitura de arquivo bem-sucedida');
        testResults.fileSystem.success = true;
      } else {
        throw new Error('Conteúdo lido não corresponde ao conteúdo escrito');
      }
    } catch (error) {
      console.error('❌ Erro no teste do sistema de arquivos:', error);
      testResults.fileSystem.error = error.message;
    }
    
    // 2. Teste de gerenciamento de estado
    console.log('\n--- Testando gerenciamento de estado ---');
    try {
      // Verifica se o state_manager.js está disponível
      // Esta verificação é apenas uma simulação, já que não podemos importar diretamente
      
      // Cria um estado de teste
      const testState = {
        projectInfo: {
          name: "TestProject",
          repository: "test/repo",
          lastUpdated: new Date().toISOString()
        },
        development: {
          currentFile: "test-file.js",
          currentComponent: "TestComponent",
          inProgress: {
            type: "test",
            description: "Teste de continuidade",
            remainingTasks: ["Task 1", "Task 2"]
          }
        }
      };
      
      // Salva o estado de teste
      await write_file({
        path: 'test-state.json',
        content: JSON.stringify(testState, null, 2)
      });
      console.log('✅ Escrita de estado bem-sucedida');
      
      // Lê o estado salvo
      const readState = await window.fs.readFile('test-state.json', { encoding: 'utf8' });
      const parsedState = JSON.parse(readState);
      
      // Verifica se o estado lido corresponde ao estado original
      if (parsedState.projectInfo.name === testState.projectInfo.name) {
        console.log('✅ Leitura de estado bem-sucedida');
        testResults.stateManagement.success = true;
      } else {
        throw new Error('Estado lido não corresponde ao estado original');
      }
    } catch (error) {
      console.error('❌ Erro no teste de gerenciamento de estado:', error);
      testResults.stateManagement.error = error.message;
    }
    
    // 3. Teste de combinação de instruções
    console.log('\n--- Testando combinação de instruções ---');
    try {
      // Criando arquivos de instrução de teste
      await write_file({
        path: 'test-instructions-1.md',
        content: '# Parte 1\nEste é um teste de combinação de instruções.'
      });
      
      await write_file({
        path: 'test-instructions-2.md',
        content: '# Parte 2\nEsta é a segunda parte do teste.'
      });
      
      // Simula a função de combinação
      const part1 = await window.fs.readFile('test-instructions-1.md', { encoding: 'utf8' });
      const part2 = await window.fs.readFile('test-instructions-2.md', { encoding: 'utf8' });
      
      await write_file({
        path: 'test-instructions-combined.md',
        content: `${part1}\n\n${part2}\n\n---\n\nDocumento de teste combinado.`
      });
      
      const combinedContent = await window.fs.readFile('test-instructions-combined.md', { encoding: 'utf8' });
      if (combinedContent.includes('Parte 1') && combinedContent.includes('Parte 2')) {
        console.log('✅ Combinação de instruções bem-sucedida');
        testResults.instructionsCombine.success = true;
      } else {
        throw new Error('Combinação de instruções falhou');
      }
    } catch (error) {
      console.error('❌ Erro no teste de combinação de instruções:', error);
      testResults.instructionsCombine.error = error.message;
    }
    
    // Exibe resumo dos testes
    console.log('\n=== Resumo dos Testes ===');
    console.log(`Sistema de Arquivos: ${testResults.fileSystem.success ? '✅ Sucesso' : '❌ Falha'}`);
    if (testResults.fileSystem.error) console.log(`  - Erro: ${testResults.fileSystem.error}`);
    
    console.log(`Gerenciamento de Estado: ${testResults.stateManagement.success ? '✅ Sucesso' : '❌ Falha'}`);
    if (testResults.stateManagement.error) console.log(`  - Erro: ${testResults.stateManagement.error}`);
    
    console.log(`Combinação de Instruções: ${testResults.instructionsCombine.success ? '✅ Sucesso' : '❌ Falha'}`);
    if (testResults.instructionsCombine.error) console.log(`  - Erro: ${testResults.instructionsCombine.error}`);
    
    // Calcula resultado geral
    const overallSuccess = 
      testResults.fileSystem.success && 
      testResults.stateManagement.success && 
      testResults.instructionsCombine.success;
    
    console.log(`\nResultado Geral: ${overallSuccess ? '✅ Todos os testes passaram' : '❌ Alguns testes falharam'}`);
    
    // Limpa arquivos de teste
    try {
      // Lista todos os arquivos de teste criados
      const testFiles = [
        'test-mcp-file.txt', 
        'test-state.json', 
        'test-instructions-1.md', 
        'test-instructions-2.md', 
        'test-instructions-combined.md'
      ];
      
      // Remove cada arquivo de teste
      console.log('\nLimpando arquivos de teste...');
      for (const file of testFiles) {
        // Aqui seria necessário um método para excluir arquivos, mas o MCP pode não fornecer isso
        // Em um ambiente real, você removeria os arquivos de teste
        console.log(`Simulando remoção de: ${file}`);
      }
    } catch (error) {
      console.warn('Aviso: Falha ao limpar arquivos de teste:', error);
    }
    
    return { success: overallSuccess, results: testResults };
  } catch (error) {
    console.error('Erro fatal durante execução dos testes:', error);
    return { success: false, error: error.message };
  }
}

// Para executar no ambiente MCP:
// await testMcpTools();
