# -*- coding: utf-8 -*-
"""
内田樹ペルソナ v2 - ファインチューニング実行
ブログ記事 + 既存QA + journal記事の統合版
"""
import os
import sys
from openai import OpenAI

def load_api_key():
    """APIキーを読み込み"""
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env.local")
    if not os.path.exists(env_path):
        print("[ERROR] .env.local not found")
        sys.exit(1)

    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("OPENAI_API_KEY="):
                return line.split("=", 1)[1].strip()

    print("[ERROR] OPENAI_API_KEY not found in .env.local")
    sys.exit(1)

def main():
    print("=== Uchida Tatsuru Persona v2 Fine-Tuning ===\n")

    # APIキー取得
    api_key = load_api_key()
    client = OpenAI(api_key=api_key)

    # データファイル確認
    training_file = "uchida_complete_dataset.jsonl"
    if not os.path.exists(training_file):
        print(f"[ERROR] {training_file} not found")
        print("Please run merge_uchida_datasets.py first")
        sys.exit(1)

    # File size check
    file_size = os.path.getsize(training_file)
    print(f"[FILE] Training file: {training_file}")
    print(f"[SIZE] File size: {file_size / 1024:.1f} KB\n")

    # Upload
    print("[UPLOAD] Uploading to OpenAI...")
    with open(training_file, "rb") as f:
        file_response = client.files.create(
            file=f,
            purpose="fine-tune"
        )

    print(f"[OK] Upload complete")
    print(f"   File ID: {file_response.id}\n")

    # Fine-tuning start
    print("[START] Fine-tuning job...")
    job_response = client.fine_tuning.jobs.create(
        training_file=file_response.id,
        model="gpt-4o-mini-2024-07-18",
        suffix="uchida-v2-complete"
    )

    print(f"[OK] Job created\n")
    print(f"=== Job Info ===")
    print(f"Job ID: {job_response.id}")
    print(f"Status: {job_response.status}")
    print(f"Model: {job_response.model}")
    print(f"Created: {job_response.created_at}")

    print(f"\n=== Next Steps ===")
    print(f"1. Check progress:")
    print(f"   python scripts/check_ft_status.py")
    print(f"\n2. After completion (1-2 hours), note model name:")
    print(f"   gpt-4o-mini:ft-personal:uchida-v2-complete-XXXX")
    print(f"\n3. Implement in website:")
    print(f"   Create src/app/philosophy/page.tsx")

    # Save job ID
    with open("uchida_ft_job_id.txt", "w") as f:
        f.write(job_response.id)

    print(f"\n[SAVED] Job ID saved: uchida_ft_job_id.txt")

if __name__ == "__main__":
    main()
