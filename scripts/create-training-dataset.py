#!/usr/bin/env python3
"""
岩﨑和男AI - 訓練データセット生成スクリプト

使い方:
  python create-training-dataset.py

入力: claudedocs/iwasaki-ai-training-data/*.md
出力: training_data/iwasaki_dataset.jsonl
"""

import os
import json
import re
from pathlib import Path

def extract_qa_pairs(md_content):
    """
    マークダウンから質問-回答ペアを抽出
    """
    pairs = []

    # パターン1: 引用ブロック → 解説
    pattern1 = r'> \*\*「(.+?）」\*\*\n\n\*\*解説\*\*:\n(.+?)(?=\n\n|$)'
    matches1 = re.findall(pattern1, md_content, re.DOTALL)
    for question, answer in matches1:
        pairs.append({
            "instruction": question.strip(),
            "output": answer.strip()
        })

    # パターン2: ### 見出し → 内容
    pattern2 = r'### (.+?)\n(.+?)(?=\n###|$)'
    matches2 = re.findall(pattern2, md_content, re.DOTALL)
    for title, content in matches2:
        # 長すぎる内容は最初の段落だけ
        content_clean = content.split('\n\n')[0].strip()
        if len(content_clean) > 50 and len(content_clean) < 500:
            pairs.append({
                "instruction": f"{title}について教えて",
                "output": content_clean
            })

    # パターン3: 【質問】→【回答】形式
    pattern3 = r'\*\*質問\*\*:\s*(.+?)\n\*\*回答\*\*:\s*(.+?)(?=\n\n|$)'
    matches3 = re.findall(pattern3, md_content, re.DOTALL)
    for question, answer in matches3:
        pairs.append({
            "instruction": question.strip(),
            "output": answer.strip()
        })

    return pairs

def create_alpaca_format(pairs):
    """
    Alpaca形式に変換（ファインチューニング標準形式）
    """
    alpaca_data = []
    for pair in pairs:
        alpaca_data.append({
            "instruction": pair["instruction"],
            "input": "",
            "output": pair["output"]
        })
    return alpaca_data

def main():
    # パス設定
    input_dir = Path("claudedocs/iwasaki-ai-training-data")
    output_dir = Path("training_data")
    output_dir.mkdir(exist_ok=True)

    all_pairs = []

    # 全MDファイルを処理
    for md_file in input_dir.glob("*.md"):
        print(f"処理中: {md_file.name}")

        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        pairs = extract_qa_pairs(content)
        all_pairs.extend(pairs)
        print(f"  → {len(pairs)}件のQAペアを抽出")

    # Alpaca形式に変換
    alpaca_data = create_alpaca_format(all_pairs)

    # JSONL形式で保存（1行1JSON）
    output_file = output_dir / "iwasaki_dataset.jsonl"
    with open(output_file, 'w', encoding='utf-8') as f:
        for item in alpaca_data:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')

    print(f"\n✅ 完成: {output_file}")
    print(f"📊 合計 {len(alpaca_data)}件のトレーニングデータ")

    # サンプル表示
    print("\n【サンプル】")
    for i, item in enumerate(alpaca_data[:3], 1):
        print(f"\n{i}. 質問: {item['instruction'][:50]}...")
        print(f"   回答: {item['output'][:100]}...")

if __name__ == "__main__":
    main()
