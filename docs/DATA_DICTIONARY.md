# Data Dictionary

This document describes the generated files in `data/`.

## `data/llms.json`

Each record describes one LocalClaw LLM entry.

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Unique open-database record id. Duplicate source IDs are suffixed with `record-N`. |
| `source_id` | string | Original LocalClaw model id. |
| `duplicate_group` | string | Present only when several source records share the same LocalClaw id. |
| `duplicate_index` | number | Stable index inside a duplicate group. |
| `name` | string | Human-readable model name. |
| `type` | string | `local_llm` or `hosted_llm_reference`. |
| `family` | string | Model family, such as `qwen`, `llama`, `gemma`, `mistral`. |
| `parameters` | string | Parameter count or MoE description. |
| `size_gb` | number | Approximate local model file size in GB. |
| `min_ram_gb` | number | Practical minimum RAM tier used by LocalClaw. |
| `recommended_quantization` | string | Suggested quantization when available. |
| `tags` | string[] | Workload and category tags. |
| `description` | string | Short practical description. |
| `lm_studio_search_term` | string | Search term for LM Studio or compatible catalogues when available. |
| `huggingface_repo` | string | Hugging Face repo reference when available. |
| `release_date` | string | Release month/date as tracked by LocalClaw. |
| `scores` | object | LocalClaw practical scores for speed, quality, coding and reasoning. |
| `localclaw.fit_tier` | string | RAM/hardware tier grouping. |
| `localclaw.page_url` | string | Human-readable LocalClaw model page. |

## `data/tts.json`

Each record describes a local speech model, TTS model, ASR model or speech app layer.

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Unique speech model id. |
| `name` | string | Human-readable model name. |
| `type` | string | `tts` or `asr_or_speech`. |
| `developer` | string | Developer or lab name when known. |
| `family` | string | Model family or grouping. |
| `description` | string | Practical summary. |
| `languages` | string[] | Language tags or `multilingual`. |
| `language_count` | number | Approximate supported language count. |
| `features` | string[] | Capabilities such as voice cloning, streaming, realtime or multilingual. |
| `hardware` | string[] | Practical hardware tags such as `cpu`, `gpu`, `apple`. |
| `size_gb` | number | Approximate model size in GB. |
| `quality_score` | number | LocalClaw quality score. |
| `speed_score` | number | LocalClaw speed score. |
| `latency` | string | Latency tier when known. |
| `release_date` | string | Release date tracked by LocalClaw. |
| `is_localclaw_pick` | boolean | Whether LocalClaw highlights the model as a pick. |
| `license` | string | License string when available. |
| `localclaw.page_url` | string | Human-readable LocalClaw speech page. |

## `data/machines.json`

Each record describes a machine class used by the LocalClaw local AI computer guide.

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Machine id. |
| `name` | string | Human-readable machine name. |
| `vendor` | string | Vendor or vendor class. |
| `platform` | string | `apple` or `nvidia`. |
| `chip` | string | Main chip or system-on-chip. |
| `unified_memory_gb` | number | Unified memory tier in GB. |
| `storage` | string | Storage configuration text. |
| `price_text` | string | Public-facing price text from LocalClaw. |
| `badge` | string | LocalClaw recommendation badge. |
| `official_url` | string | Official vendor URL when available. |
| `retail_search_url_no_affiliate` | string | Retail search URL with affiliate parameters removed. |
| `localclaw.computers_url` | string | LocalClaw computers guide. |
