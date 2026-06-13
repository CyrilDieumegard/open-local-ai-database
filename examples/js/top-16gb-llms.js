const models = require('../../data/llms.json');

const picks = models
  .filter(model => model.type === 'local_llm')
  .filter(model => model.min_ram_gb <= 16)
  .sort((a, b) => {
    const scoreA = (a.scores.quality * 2) + a.scores.coding + a.scores.reasoning + a.scores.speed;
    const scoreB = (b.scores.quality * 2) + b.scores.coding + b.scores.reasoning + b.scores.speed;
    return scoreB - scoreA;
  })
  .slice(0, 12)
  .map(model => ({
    name: model.name,
    ram: `${model.min_ram_gb} GB`,
    quant: model.recommended_quantization,
    quality: model.scores.quality,
    coding: model.scores.coding,
    url: model.localclaw.page_url
  }));

console.table(picks);
