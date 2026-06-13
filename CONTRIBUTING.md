# Contributing

Thanks for helping improve the Open Local AI Database.

The goal is simple: make it easier for people to choose and run local AI responsibly.

## Good contributions

- Add a missing open local LLM.
- Add a missing local TTS, ASR or speech model.
- Fix RAM, quantization, license or install metadata.
- Add a source link for a release, model card or hardware spec.
- Improve examples or docs.
- Report duplicate or stale records.

## What to include

For a model correction, include:

- model name
- model id if it already exists
- source URL
- what should change
- why it matters

For a new LLM, useful fields include:

- family
- parameter count
- approximate size in GB
- recommended quantization
- minimum practical RAM
- Hugging Face repo or install source
- release date
- tags such as `chat`, `code`, `reasoning`, `vision`, `speed`

For a new speech model, useful fields include:

- developer
- supported languages
- model type: TTS, ASR, voice cloning, speech pipeline
- local runtime / install command
- hardware fit
- license

## Data quality rules

- Prefer primary sources: official model cards, vendor docs, release notes or GitHub repos.
- Do not add closed/proprietary cloud-only models as local install models.
- Mark cloud-only or hosted models clearly when they are useful comparison references.
- Avoid hype-only descriptions.
- Keep descriptions short, practical and verifiable.

## Local validation

```bash
npm run build
npm run validate
```

The generated data in `data/` must stay valid.
