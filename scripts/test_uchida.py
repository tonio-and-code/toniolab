# -*- coding: utf-8 -*-
"""
内田樹ペルソナ テストスクリプト
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

print("=" * 60)
print("内田樹ペルソナ AI テスト")
print("=" * 60)
print(f"\nModel: {UCHIDA_MODEL}")
print("\n質問を入力してください（終了: exit）\n")

while True:
    user_input = input("あなた: ").strip()

    if user_input.lower() == "exit":
        print("\n終了します。")
        break

    if not user_input:
        continue

    print("\n内田樹: ", end="", flush=True)

    try:
        response = client.chat.completions.create(
            model=UCHIDA_MODEL,
            messages=[
                {"role": "system", "content": "あなたは思想家、武道家の内田樹です。あなたの文体と思考で、どんな質問にも答えてください。"},
                {"role": "user", "content": user_input}
            ],
            max_tokens=500,
            temperature=0.8
        )

        answer = response.choices[0].message.content
        print(answer)
        print()

    except Exception as e:
        print(f"\nエラー: {e}\n")
