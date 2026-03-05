import os
import sys
import time
from faster_whisper import WhisperModel

INPUT_DIR = r"C:\Users\thaat\Desktop\kaiwa"
OUTPUT_DIR = os.path.join(INPUT_DIR, "transcripts")
os.makedirs(OUTPUT_DIR, exist_ok=True)

model = WhisperModel("base", device="cpu", compute_type="int8")

files = sorted([f for f in os.listdir(INPUT_DIR) if f.endswith(".m4a")])
print(f"Found {len(files)} files to transcribe")

for i, fname in enumerate(files):
    fpath = os.path.join(INPUT_DIR, fname)
    out_path = os.path.join(OUTPUT_DIR, fname.replace(".m4a", ".txt"))

    if os.path.exists(out_path):
        print(f"[{i+1}/{len(files)}] SKIP (already done): {fname}")
        continue

    print(f"[{i+1}/{len(files)}] Processing: {fname} ...", flush=True)
    t0 = time.time()

    segments, info = model.transcribe(fpath, language="ja", beam_size=5)

    lines = []
    for seg in segments:
        lines.append(seg.text.strip())

    text = "\n".join(lines)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(text)

    elapsed = time.time() - t0
    print(f"    Done in {elapsed:.1f}s ({len(lines)} segments)", flush=True)

print("All done!")
