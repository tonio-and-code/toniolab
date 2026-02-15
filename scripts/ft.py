# -*- coding: utf-8 -*-
import os
import sys
import json
from openai import OpenAI

# .env.local読み込み
api_key = None
env_path = os.path.join(os.path.dirname(__file__), "..", ".env.local")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("OPENAI_API_KEY="):
                api_key = line.split("=", 1)[1].strip()
                break

if not api_key:
    print("ERROR: OPENAI_API_KEY not found")
    sys.exit(1)

client = OpenAI(api_key=api_key)

def upload_file(path):
    print(f"Uploading: {path}")
    with open(path, "rb") as f:
        response = client.files.create(file=f, purpose="fine-tune")
    print(f"File ID: {response.id}")
    return response.id

def start_finetune(file_id):
    print("Starting fine-tune job...")
    response = client.fine_tuning.jobs.create(
        training_file=file_id,
        model="gpt-4o-mini-2024-07-18",
        suffix="takumi-v1"
    )
    print(f"Job ID: {response.id}")
    print(f"Status: {response.status}")
    return response.id

def check_status(job_id):
    response = client.fine_tuning.jobs.retrieve(job_id)
    print(f"Status: {response.status}")
    if response.status == "succeeded":
        print(f"Model: {response.fine_tuned_model}")
        return response.fine_tuned_model
    return None

def list_jobs():
    response = client.fine_tuning.jobs.list(limit=10)
    for job in response.data:
        print(f"{job.id} | {job.status}")
        if job.fine_tuned_model:
            print(f"  -> {job.fine_tuned_model}")

if __name__ == "__main__":
    training_file = r"C:\Users\thaat\Desktop\takumi_philosophy_training.jsonl"

    print("=== Fine-Tuning Tool ===")
    print("1. Start new fine-tune")
    print("2. List jobs")
    print("3. Check status")

    mode = input("Select (1-3): ").strip()

    if mode == "1":
        file_id = upload_file(training_file)
        job_id = start_finetune(file_id)
        print(f"\nJob started: {job_id}")
    elif mode == "2":
        list_jobs()
    elif mode == "3":
        job_id = input("Job ID: ").strip()
        check_status(job_id)
