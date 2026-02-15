"""
施工品質スコアリングAI
写真から職人技術を定量化

使い方:
ollama pull llava
python quality_scorer.py --before before.jpg --after after.jpg
"""
import subprocess
import json
import argparse
from pathlib import Path

def score_quality(before_path: str, after_path: str):
    """施工品質をスコアリング"""

    prompt = f"""以下の施工写真を分析し、品質を0-100でスコアリングしてください。

評価観点:
1. 直角・水平の精度
2. 継ぎ目の美しさ
3. 色ムラ・汚れ
4. 全体的な仕上がり

JSON形式で出力:
{{
  "precision_score": 0-100,
  "aesthetics_score": 0-100,
  "defect_count": 数値,
  "overall_score": 0-100,
  "comments": "短い評価コメント"
}}
"""

    cmd = [
        'ollama', 'run', 'llava',
        f'{prompt}\n施工前: {before_path}\n施工後: {after_path}'
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    print("=== 施工品質スコア ===")
    print(result.stdout)

    return result.stdout

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--before', required=True)
    parser.add_argument('--after', required=True)
    args = parser.parse_args()

    score_quality(args.before, args.after)
