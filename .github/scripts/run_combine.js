const fs = require('fs-extra');
const path = require('path');

async function combineInstructions() {
  try {
    const part1Path = path.join(process.cwd(), 'docs/INSTRUCTIONS_PART1.md');
    const part2Path = path.join(process.cwd(), 'docs/INSTRUCTIONS_PART2.md');
    const outputPath = path.join(process.cwd(), 'docs/INSTRUCTIONS.md');
    
    console.log('Lendo arquivos de instruções...');
    const part1 = await fs.readFile(part1Path, 'utf8');
    const part2 = await fs.readFile(part2Path, 'utf8');
    
    console.log('Combinando conteúdo...');
    const combined = `${part1}\n\n${part2}\n\n---\n\nEste documento é gerado automaticamente. Para contribuir, edite os arquivos em docs/INSTRUCTIONS_PART*.md`;
    
    console.log('Escrevendo arquivo combinado...');
    await fs.writeFile(outputPath, combined);
    
    console.log('Instrucões combinadas com sucesso!');
  } catch (error) {
    console.error('Erro ao combinar instruções:', error);
    process.exit(1);
  }
}

combineInstructions();
