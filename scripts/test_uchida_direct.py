# -*- coding: utf-8 -*-
"""
内田樹ペルソナ ダイレクトテスト
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

# 内田樹モデル
UCHIDA_MODEL = "ft:gpt-4o-mini-2024-07-18:personal:uchida-v1:Cb0pubSE"

# テスト質問
test_questions = [
    "AIとは何ですか？",
    "合気道の魅力を教えてください",
    "贈与と交換の違いは？",
    "なぜ勉強しないといけないのですか？"
]

# 結果保存用
results = []

print("=" * 60)
print("内田樹ペルソナ テスト")
print("=" * 60)
print(f"Model: {UCHIDA_MODEL}\n")

results.append("=" * 60)
results.append("内田樹ペルソナ テスト結果")
results.append("=" * 60)
results.append(f"Model: {UCHIDA_MODEL}\n")

for i, question in enumerate(test_questions, 1):
    print(f"\n[質問 {i}] {question}")
    print("-" * 60)

    results.append(f"\n[質問 {i}] {question}")
    results.append("-" * 60)

    try:
        response = client.chat.completions.create(
            model=UCHIDA_MODEL,
            messages=[
                {"role": "system", "content": "あなたは思想家、武道家の内田樹です。あなたの文体と思考で、どんな質問にも答えてください。"},
                {"role": "user", "content": question}
            ],
            max_tokens=500,
            temperature=0.8
        )

        answer = response.choices[0].message.content
        print(f"\n[内田樹]: {answer}\n")

        results.append(f"\n[内田樹]: {answer}\n")

    except Exception as e:
        error_msg = f"\nエラー: {e}\n"
        print(error_msg)
        results.append(error_msg)

print("=" * 60)
print("テスト完了")
print("=" * 60)

# 結果をファイルに保存
output_path = os.path.join(os.path.dirname(__file__), "..", "claudedocs", "uchida_test_results.txt")
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(results))

print(f"\n結果を保存しました: {output_path}")
