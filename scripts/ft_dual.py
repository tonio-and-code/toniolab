# -*- coding: utf-8 -*-
"""
2 Persona Fine-Tuning Script
- Takumi (Interior craftsman)
- Uchida Tatsuru (Philosopher/Martial artist)
"""
import os
import sys
import json
from openai import OpenAI

# Load .env.local
api_key = None
env_path = os.path.join(os.path.dirname(__file__), "..", ".env.local")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("OPENAI_API_KEY="):
                api_key = line.split("=", 1)[1].strip()
                break

if not api_key:
    print("ERROR: OPENAI_API_KEY not found in .env.local")
    sys.exit(1)

client = OpenAI(api_key=api_key)

# Persona definitions
PERSONAS = {
    "1": {
        "name": "Takumi (Interior craftsman)",
        "file": r"C:\Users\thaat\Desktop\iwasaki-naisou-website\scripts\takumi_dataset.jsonl",
        "suffix": "takumi-v1",
        "description": "30-year veteran craftsman. da/ze/sa tone."
    },
    "2": {
        "name": "Uchida Tatsuru (Philosopher)",
        "file": r"C:\Users\thaat\Desktop\iwasaki-naisou-website\scripts\uchida_dataset.jsonl",
        "suffix": "uchida-v1",
        "description": "Philosopher/martial artist. Boku wa...de aru. Aikido, gift theory."
    }
}

def validate_jsonl(file_path):
    """Validate JSONL file"""
    print(f"Validating: {file_path}")
    if not os.path.exists(file_path):
        print(f"  ERROR: File not found!")
        return False

    line_count = 0
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            for i, line in enumerate(f, 1):
                data = json.loads(line)
                # Check required fields
                if "messages" not in data:
                    print(f"  ERROR: Line {i} missing 'messages' field")
                    return False
                messages = data["messages"]
                if not isinstance(messages, list) or len(messages) < 2:
                    print(f"  ERROR: Line {i} invalid messages format")
                    return False
                line_count += 1
        print(f"  OK: Valid JSONL with {line_count} examples")
        return True
    except json.JSONDecodeError as e:
        print(f"  ERROR: JSON parse error at line {i}: {e}")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def upload_file(path):
    """Upload file to OpenAI"""
    print(f"Uploading: {path}")
    with open(path, "rb") as f:
        response = client.files.create(file=f, purpose="fine-tune")
    print(f"  File ID: {response.id}")
    return response.id

def start_finetune(file_id, suffix):
    """Start fine-tuning job"""
    print(f"Starting fine-tune job with suffix: {suffix}")
    response = client.fine_tuning.jobs.create(
        training_file=file_id,
        model="gpt-4o-mini-2024-07-18",
        suffix=suffix
    )
    print(f"  Job ID: {response.id}")
    print(f"  Status: {response.status}")
    return response.id

def check_status(job_id):
    """Check job status"""
    response = client.fine_tuning.jobs.retrieve(job_id)
    print(f"Job ID: {job_id}")
    print(f"  Status: {response.status}")
    if response.status == "succeeded":
        print(f"  Model: {response.fine_tuned_model}")
        return response.fine_tuned_model
    elif response.status == "failed":
        print(f"  ERROR: {response.error}")
    return None

def list_jobs():
    """List all fine-tuning jobs"""
    response = client.fine_tuning.jobs.list(limit=10)
    print("\n=== Fine-Tuning Jobs ===")
    for job in response.data:
        status_mark = "[OK]" if job.status == "succeeded" else "[RUN]" if job.status == "running" else "[ERR]"
        print(f"{status_mark} {job.id} | {job.status}")
        if job.fine_tuned_model:
            print(f"    Model: {job.fine_tuned_model}")

def main():
    print("=" * 50)
    print("2 Persona Fine-Tuning Tool")
    print("=" * 50)
    print("\n[Persona Selection]")
    for key, persona in PERSONAS.items():
        print(f"{key}. {persona['name']}")
        print(f"   {persona['description']}")
    print("3. List jobs")
    print("4. Check status")
    print("0. Exit")

    choice = input("\nSelect (0-4): ").strip()

    if choice == "0":
        print("Exiting...")
        sys.exit(0)
    elif choice == "3":
        list_jobs()
    elif choice == "4":
        job_id = input("Job ID: ").strip()
        check_status(job_id)
    elif choice in PERSONAS:
        persona = PERSONAS[choice]
        print(f"\n>>> Starting FT for {persona['name']}")

        # Validation
        if not validate_jsonl(persona["file"]):
            print("ERROR: Validation failed. Please fix the file.")
            sys.exit(1)

        # Upload
        file_id = upload_file(persona["file"])

        # Start FT
        job_id = start_finetune(file_id, persona["suffix"])

        print(f"\nSUCCESS: FT job started")
        print(f"Job ID: {job_id}")
        print(f"\nCheck progress: python ft_dual.py -> 4 -> {job_id}")
    else:
        print("ERROR: Invalid selection")

if __name__ == "__main__":
    main()
