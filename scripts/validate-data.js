const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function load(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function uniqueIds(name, rows) {
  const seen = new Set();
  for (const row of rows) {
    assert(row.id && typeof row.id === 'string', `${name}: missing id`);
    assert(!seen.has(row.id), `${name}: duplicate id ${row.id}`);
    seen.add(row.id);
  }
}

function validateLlms(rows) {
  uniqueIds('llms', rows);
  for (const row of rows) {
    assert(row.name, `llms/${row.id}: missing name`);
    assert(row.family, `llms/${row.id}: missing family`);
    assert(Number.isFinite(row.size_gb), `llms/${row.id}: invalid size_gb`);
    assert(Number.isFinite(row.min_ram_gb), `llms/${row.id}: invalid min_ram_gb`);
    assert(Array.isArray(row.tags), `llms/${row.id}: tags must be array`);
    assert(row.localclaw?.page_url?.includes('/models/'), `llms/${row.id}: missing LocalClaw URL`);
  }
}

function validateSpeech(rows) {
  uniqueIds('speech', rows);
  for (const row of rows) {
    assert(row.name, `tts/${row.id}: missing name`);
    assert(row.description, `tts/${row.id}: missing description`);
    assert(Array.isArray(row.languages), `tts/${row.id}: languages must be array`);
    assert(Array.isArray(row.features), `tts/${row.id}: features must be array`);
    assert(row.localclaw?.page_url?.includes('/tts/'), `tts/${row.id}: missing LocalClaw URL`);
  }
}

function validateMachines(rows) {
  uniqueIds('machines', rows);
  for (const row of rows) {
    assert(row.name, `machines/${row.id}: missing name`);
    assert(row.chip, `machines/${row.id}: missing chip`);
    assert(Number.isFinite(row.unified_memory_gb), `machines/${row.id}: invalid memory`);
    assert(row.platform, `machines/${row.id}: missing platform`);
  }
}

function main() {
  const llms = load('data/llms.json');
  const tts = load('data/tts.json');
  const machines = load('data/machines.json');
  const bundle = load('data/local-ai-database.json');

  validateLlms(llms);
  validateSpeech(tts);
  validateMachines(machines);
  assert(bundle.llms.length === llms.length, 'bundle LLM count mismatch');
  assert(bundle.speech_models.length === tts.length, 'bundle speech count mismatch');
  assert(bundle.machines.length === machines.length, 'bundle machine count mismatch');

  console.log(`Validated ${llms.length} LLMs, ${tts.length} speech models and ${machines.length} machines.`);
}

main();
