# -*- coding: utf-8 -*-
"""
タクミペルソナ 簡易チャット
使い方: python chat_takumi.py "質問内容"
"""
import os
import sys
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

# タクミモデル
TAKUMI_MODEL = "ft:gpt-4o-mini-2024-07-18:personal:takumi-v1:CazSCGxX"

# コマンドライン引数から質問を取得
if len(sys.argv) < 2:
    print("使い方: python chat_takumi.py \"質問内容\"")
    sys.exit(1)

question = " ".join(sys.argv[1:])

print(f"\n質問: {question}\n")

try:
    response = client.chat.completions.create(
        model=TAKUMI_MODEL,
        messages=[
            {"role": "system", "content": "あなたは内装職人のタクミです。30年のキャリアを持つベテラン職人で、クロス貼り、床材施工、バリアフリー改修が専門です。だ・ぜ・さ口調で、現場の知恵と経験を分かりやすく伝えます。"},
            {"role": "user", "content": question}
        ],
        max_tokens=500,
        temperature=0.8
    )

    answer = response.choices[0].message.content
    print(f"タクミ: {answer}\n")

except Exception as e:
    print(f"エラー: {e}")
