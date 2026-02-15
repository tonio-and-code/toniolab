# -*- coding: utf-8 -*-
"""
Uchida Tatsuru Persona Fine-Tuning
"""
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

# Upload file
print("Uploading uchida_dataset.jsonl...")
with open("uchida_dataset.jsonl", "rb") as f:
    file_response = client.files.create(file=f, purpose="fine-tune")
print(f"File ID: {file_response.id}")

# Start fine-tuning
print("\nStarting fine-tune job...")
job_response = client.fine_tuning.jobs.create(
    training_file=file_response.id,
    model="gpt-4o-mini-2024-07-18",
    suffix="uchida-v1"
)

print(f"\n[SUCCESS] Fine-tuning job started!")
print(f"Job ID: {job_response.id}")
print(f"Status: {job_response.status}")
print(f"\nCheck progress: python check_ft_status.py")
