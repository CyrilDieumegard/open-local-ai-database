const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SITE_ROOT = path.resolve(ROOT, '..', 'localclaw.io');
const LOCALCLAW_BASE = 'https://localclaw.io';
const GENERATED_AT = new Date().toISOString().slice(0, 10);

function read(file) {
  return fs.readFileSync(path.join(SITE_ROOT, file), 'utf8');
}

function ensureDir(dir) {
  fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
}

function writeJson(file, value) {
  fs.writeFileSync(path.join(ROOT, file), `${JSON.stringify(value, null, 2)}\n`);
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const str = Array.isArray(value) ? value.join('|') : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function writeCsv(file, rows, columns) {
  const out = [
    columns.join(','),
    ...rows.map(row => columns.map(col => csvEscape(row[col])).join(','))
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, file), `${out}\n`);
}

function loadLlms() {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`${read('js/data.js')};this.APP_DATA=APP_DATA;`, ctx);
  return ctx.APP_DATA.models;
}

function loadTts() {
  const html = read('tts-list.html');
  const match = html.match(/const TTS_MODELS = (\[[\s\S]*?\n\s*\]);/);
  if (!match) throw new Error('TTS_MODELS not found in tts-list.html');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`this.TTS_MODELS=${match[1]}`, ctx);
  return ctx.TTS_MODELS;
}

function loadMachines() {
  const html = read('computers.html');
  const match = html.match(/const COMPUTERS = (\[[\s\S]*?\n\s*\]);/);
  if (!match) throw new Error('COMPUTERS not found in computers.html');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`this.COMPUTERS=${match[1]}`, ctx);
  return ctx.COMPUTERS;
}

function fitTier(minRam) {
  if (minRam <= 8) return 'entry';
  if (minRam <= 16) return 'mainstream';
  if (minRam <= 32) return 'power-user';
  if (minRam <= 64) return 'workstation';
  if (minRam <= 128) return 'high-memory';
  return 'server-class';
}

function normalizeLlm(model) {
  return {
    id: model.id,
    source_id: model.id,
    name: model.name,
    type: model.hosted_only ? 'hosted_llm_reference' : 'local_llm',
    family: model.family,
    parameters: model.params,
    size_gb: Number(model.size_gb ?? 0),
    min_ram_gb: Number(model.min_ram ?? 0),
    recommended_quantization: model.recommended_quant || null,
    tags: model.tags || [],
    description: model.description,
    lm_studio_search_term: model.search_term || null,
    huggingface_repo: model.hf_repo || null,
    release_date: model.released || null,
    scores: {
      speed: model.benchmarks?.speed ?? null,
      quality: model.benchmarks?.quality ?? null,
      coding: model.benchmarks?.coding ?? null,
      reasoning: model.benchmarks?.reasoning ?? null
    },
    localclaw: {
      fit_tier: fitTier(Number(model.min_ram ?? 0)),
      page_url: `${LOCALCLAW_BASE}/models/${model.id}.html`
    }
  };
}

function uniquifyIds(rows) {
  const counts = new Map();
  const seen = new Map();
  for (const row of rows) counts.set(row.id, (counts.get(row.id) || 0) + 1);
  return rows.map(row => {
    const total = counts.get(row.id);
    if (total <= 1) return row;
    const next = (seen.get(row.id) || 0) + 1;
    seen.set(row.id, next);
    return {
      ...row,
      id: `${row.id}-record-${next}`,
      duplicate_group: row.id,
      duplicate_index: next
    };
  });
}

function normalizeTts(model) {
  return {
    id: model.id,
    name: model.name,
    type: model.features?.includes('asr') || model.family === 'asr' ? 'asr_or_speech' : 'tts',
    developer: model.developer || null,
    family: model.family || null,
    description: model.description,
    languages: model.languages || [],
    language_count: Number(model.languageCount ?? 0),
    features: model.features || [],
    hardware: model.hardware || [],
    size_gb: Number(model.sizeGB ?? 0),
    size_category: model.sizeCategory || null,
    quality_score: model.quality ?? null,
    speed_score: model.speed ?? null,
    latency: model.latency || null,
    release_date: model.releaseDate || null,
    is_new: Boolean(model.isNew),
    is_localclaw_pick: Boolean(model.isPick),
    huggingface_url: model.hfLink || null,
    install_command: model.installCommand || null,
    supported_formats: model.supportedFormats || [],
    voices: model.voices || null,
    context: model.context || null,
    license: model.license || null,
    localclaw: {
      page_url: `${LOCALCLAW_BASE}/tts/${model.id}.html`
    }
  };
}

function stripAffiliate(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete('tag');
    return parsed.toString();
  } catch {
    return url;
  }
}

function normalizeMachine(machine) {
  return {
    id: machine.id,
    name: machine.name,
    vendor: machine.type === 'apple' ? 'Apple' : machine.type === 'nvidia' ? 'NVIDIA partner' : machine.type,
    platform: machine.section,
    chip: machine.chip,
    unified_memory_gb: Number(machine.ram ?? 0),
    storage: machine.storage || null,
    price_text: machine.price || null,
    badge: machine.badge || null,
    official_url: machine.appleUrl || null,
    retail_search_url_no_affiliate: stripAffiliate(machine.amazonUrl),
    localclaw: {
      computers_url: `${LOCALCLAW_BASE}/computers.html`
    }
  };
}

function makeStats(llms, tts, machines) {
  const families = new Set(llms.map(m => m.family).filter(Boolean));
  const ttsFamilies = new Set(tts.map(m => m.family).filter(Boolean));
  return {
    generated_at: GENERATED_AT,
    source: 'LocalClaw.io curated local AI metadata',
    counts: {
      llms: llms.length,
      llm_families: families.size,
      speech_models: tts.length,
      speech_families: ttsFamilies.size,
      machines: machines.length
    },
    links: {
      localclaw: LOCALCLAW_BASE,
      llm_catalog: `${LOCALCLAW_BASE}/llm-list.html`,
      tts_catalog: `${LOCALCLAW_BASE}/tts-list.html`,
      computers: `${LOCALCLAW_BASE}/computers.html`
    }
  };
}

function main() {
  ensureDir('data');

  const llms = uniquifyIds(loadLlms().map(normalizeLlm)).sort((a, b) => a.id.localeCompare(b.id));
  const tts = loadTts().map(normalizeTts).sort((a, b) => a.id.localeCompare(b.id));
  const machines = loadMachines().map(normalizeMachine).sort((a, b) => a.id.localeCompare(b.id));
  const stats = makeStats(llms, tts, machines);

  writeJson('data/llms.json', llms);
  writeJson('data/tts.json', tts);
  writeJson('data/machines.json', machines);
  writeJson('data/stats.json', stats);
  writeJson('data/local-ai-database.json', { meta: stats, llms, speech_models: tts, machines });

  writeCsv('data/llms.csv', llms.map(m => ({
    id: m.id,
    source_id: m.source_id,
    duplicate_group: m.duplicate_group,
    duplicate_index: m.duplicate_index,
    name: m.name,
    type: m.type,
    family: m.family,
    parameters: m.parameters,
    size_gb: m.size_gb,
    min_ram_gb: m.min_ram_gb,
    recommended_quantization: m.recommended_quantization,
    tags: m.tags,
    release_date: m.release_date,
    speed_score: m.scores.speed,
    quality_score: m.scores.quality,
    coding_score: m.scores.coding,
    reasoning_score: m.scores.reasoning,
    lm_studio_search_term: m.lm_studio_search_term,
    huggingface_repo: m.huggingface_repo,
    localclaw_url: m.localclaw.page_url
  })), ['id','source_id','duplicate_group','duplicate_index','name','type','family','parameters','size_gb','min_ram_gb','recommended_quantization','tags','release_date','speed_score','quality_score','coding_score','reasoning_score','lm_studio_search_term','huggingface_repo','localclaw_url']);

  writeCsv('data/tts.csv', tts.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type,
    developer: m.developer,
    family: m.family,
    languages: m.languages,
    language_count: m.language_count,
    features: m.features,
    hardware: m.hardware,
    size_gb: m.size_gb,
    quality_score: m.quality_score,
    speed_score: m.speed_score,
    latency: m.latency,
    release_date: m.release_date,
    is_localclaw_pick: m.is_localclaw_pick,
    license: m.license,
    huggingface_url: m.huggingface_url,
    localclaw_url: m.localclaw.page_url
  })), ['id','name','type','developer','family','languages','language_count','features','hardware','size_gb','quality_score','speed_score','latency','release_date','is_localclaw_pick','license','huggingface_url','localclaw_url']);

  writeCsv('data/machines.csv', machines, ['id','name','vendor','platform','chip','unified_memory_gb','storage','price_text','badge','official_url','retail_search_url_no_affiliate']);

  console.log(`Generated ${llms.length} LLMs, ${tts.length} speech models and ${machines.length} machines.`);
}

main();
