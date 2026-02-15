# -*- coding: utf-8 -*-
"""
内田樹のすべてのトレーニングデータをマージ
"""
import json
import os

def load_jsonl(filename):
    """JSONLファイルを読み込み"""
    if not os.path.exists(filename):
        print(f"[WARNING] {filename} not found, skipping")
        return []

    data = []
    with open(filename, "r", encoding="utf-8") as f:
        for line in f:
            data.append(json.loads(line))
    return data

def merge_datasets():
    """すべてのデータセットをマージ"""
    datasets = {
        "既存QAデータ": "uchida_dataset.jsonl",
        "ブログ記事": "uchida_blog_training.jsonl",
        "journal記事": "uchida_journal_training.jsonl"  # これは手動作成が必要
    }

    merged = []
    stats = {}

    for name, filename in datasets.items():
        data = load_jsonl(filename)
        if data:
            merged.extend(data)
            stats[name] = len(data)
            print(f"[OK] {name}: {len(data)} examples")
        else:
            stats[name] = 0

    return merged, stats

def calculate_tokens(data):
    """トークン数を推定"""
    total = 0
    for item in data:
        for msg in item['messages']:
            # 日本語: 1トークン ≈ 0.75文字
            total += int(len(msg['content']) / 0.75)
    return total

if __name__ == "__main__":
    print("=== 内田樹データセットのマージ ===\n")

    # マージ実行
    merged, stats = merge_datasets()

    if not merged:
        print("[ERROR] No data found")
        exit(1)

    # Stats
    print(f"\n=== Merge Results ===")
    for name, count in stats.items():
        print(f"{name}: {count} examples")
    print(f"Total: {len(merged)} examples")

    # Token calculation
    total_tokens = calculate_tokens(merged)
    learning_cost = total_tokens * 3.0 / 1000000

    print(f"\n=== Cost Estimation ===")
    print(f"Total tokens: {total_tokens:,}")
    print(f"Learning cost: ${learning_cost:.2f} (approx {int(learning_cost * 150)} JPY)")

    # Save final file
    output_file = "uchida_complete_dataset.jsonl"
    with open(output_file, "w", encoding="utf-8") as f:
        for item in merged:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print(f"\n[SAVED] {output_file}")
    print(f"\nNext step:")
    print(f"python scripts/run_uchida_ft_v2.py")
