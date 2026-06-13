const models = require('../../data/llms.json');
const machines = require('../../data/machines.json');

function compatibleModels(machine, limit = 8) {
  return models
    .filter(model => model.type === 'local_llm')
    .filter(model => model.min_ram_gb <= machine.unified_memory_gb)
    .sort((a, b) => b.scores.quality - a.scores.quality)
    .slice(0, limit);
}

for (const machine of machines.slice(0, 5)) {
  console.log(`\n${machine.name} (${machine.unified_memory_gb} GB)`);
  for (const model of compatibleModels(machine, 5)) {
    console.log(`- ${model.name} | ${model.parameters} | ${model.recommended_quantization}`);
  }
}
