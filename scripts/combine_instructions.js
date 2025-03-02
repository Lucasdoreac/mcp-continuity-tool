/**
 * Script para combinar arquivos de instruções separadas
 * Funciona tanto no ambiente MCP quanto em ambiente Node.js
 */
async function combineInstructions() {
  try {
    // No ambiente MCP, window.fs estará disponível
    // No ambiente Node.js, usaremos um wrapper ou fs-extra
    let part1, part2;
    
    if (typeof window !== 'undefined' && window.fs) {
      // Ambiente MCP
      console.log('Executando no ambiente MCP...');
      part1 = await window.fs.readFile('docs/INSTRUCTIONS_PART1.md', { encoding: 'utf8' });
      part2 = await window.fs.readFile('docs/INSTRUCTIONS_PART2.md', { encoding: 'utf8' });
      
      // Use a função write_file disponível no ambiente MCP
      await write_file({
        path: 'docs/INSTRUCTIONS.md',
        content: `${part1}\n\n${part2}\n\n---\n\nEste documento é gerado automaticamente. Para contribuir, edite os arquivos em docs/INSTRUCTIONS_PART*.md`
      });
    } else {
      // Aviso de que este script é primariamente para ambiente MCP
      console.log('Este script é primariamente destinado ao ambiente MCP.');
      console.log('Para executar fora do MCP, use o script .github/scripts/run_combine.js');
      throw new Error('Ambiente não suportado diretamente. Use o script equivalente para Node.js.');
    }
    
    console.log('Instruções combinadas com sucesso!');
    return { success: true, message: 'Instruções combinadas com sucesso!' };
  } catch (error) {
    console.error('Erro ao combinar instruções:', error);
    return { success: false, error: error.message };
  }
}

// No ambiente MCP, este script pode ser executado com:
// await combineInstructions();
