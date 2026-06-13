import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
models = json.loads((root / "data" / "llms.json").read_text())

coding_models = [
    model for model in models
    if model["type"] == "local_llm"
    and "code" in model["tags"]
    and model["min_ram_gb"] <= 32
]

coding_models.sort(
    key=lambda model: (
        model["scores"]["coding"] or 0,
        model["scores"]["quality"] or 0,
        model["scores"]["speed"] or 0,
    ),
    reverse=True,
)

for model in coding_models[:20]:
    print(
        f"{model['name']} | {model['min_ram_gb']}GB RAM | "
        f"{model['recommended_quantization']} | coding {model['scores']['coding']}"
    )
