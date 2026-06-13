# Methodology

Open Local AI Database is a practical compatibility dataset, not a single benchmark leaderboard.

The project is built around the real questions people ask when running AI locally:

- Does this model fit my RAM?
- Is the model available in a local-friendly format?
- Which quantization should I start with?
- Is the model useful for chat, coding, reasoning, speed, voice or speech pipelines?
- Which Apple Silicon or NVIDIA machine tier is realistic?

## Scoring philosophy

Scores are LocalClaw practical scores on a relative scale.

They are intended for filtering and comparison, not as universal scientific benchmark claims.

For LLMs, the current score dimensions are:

- `speed`
- `quality`
- `coding`
- `reasoning`

For speech models, the current score dimensions are:

- `quality_score`
- `speed_score`

## RAM and hardware fit

`min_ram_gb` is a practical LocalClaw tier. It includes a conservative estimate for loading and running the model locally, but it is not a guarantee for every runtime, context length, quantization or operating system state.

Always leave memory headroom for:

- the operating system
- the runtime
- context length
- other apps
- GPU/Metal/CUDA overhead

## Hosted model references

Some records are marked as `hosted_llm_reference`. They are tracked because people search for them, compare against them, or need local alternatives.

They should not be interpreted as open local install records.

## Update process

Data is generated from the LocalClaw website metadata:

```bash
npm run build
npm run validate
```

Generated outputs live in `data/`.

## Corrections

If you spot an error:

1. Open an issue.
2. Include the model or machine id.
3. Add a source link when possible.
4. Explain the correction in one or two sentences.

See [`CONTRIBUTING.md`](../CONTRIBUTING.md).
