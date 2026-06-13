import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
models = json.loads((root / "data" / "tts.json").read_text())

picks = [
    model for model in models
    if model["is_localclaw_pick"]
    and (
        "voice-cloning" in model["features"]
        or "cloning" in " ".join(model["features"])
        or "voice cloning" in (model["voices"] or "").lower()
    )
]

for model in picks[:15]:
    print(f"{model['name']} | {model['license']} | {model['localclaw']['page_url']}")
