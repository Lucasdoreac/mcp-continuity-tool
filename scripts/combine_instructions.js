async function combineInstructions() {
  const part1 = await window.fs.readFile('docs/INSTRUCTIONS_PART1.md', { encoding: 'utf8' });
  const part2 = await window.fs.readFile('docs/INSTRUCTIONS_PART2.md', { encoding: 'utf8' });
  
  await write_file({
    path: 'docs/INSTRUCTIONS.md',
    content: `${part1}\n\n${part2}\n\n---\n\nEste documento é gerado automaticamente. Para contribuir, edite os arquivos em docs/INSTRUCTIONS_PART*.md`
  });
}

// Execute com:
// await combineInstructions();