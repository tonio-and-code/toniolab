# -*- coding: utf-8 -*-
import os
from openai import OpenAI

# Load API key
api_key = None
env_path = os.path.join(os.path.dirname(__file__), "..", ".env.local")
with open(env_path, "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("OPENAI_API_KEY="):
            api_key = line.split("=", 1)[1].strip()
            break

client = OpenAI(api_key=api_key)

# Check recent jobs
jobs = client.fine_tuning.jobs.list(limit=5)

print("\n=== Fine-Tuning Jobs Status ===")
for job in jobs.data:
    status = job.status
    model = job.fine_tuned_model or "pending"
    print(f"\nJob ID: {job.id}")
    print(f"  Status: {status}")
    print(f"  Model: {model}")

    if status == "succeeded":
        print("  [OK] Completed!")
    elif status == "running":
        print("  [RUNNING] In progress...")
    elif status == "failed":
        print(f"  [ERROR] Failed: {job.error}")
