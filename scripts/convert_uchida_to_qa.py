# -*- coding: utf-8 -*-
"""
内田樹ブログ記事をOpenAI FT用のQA形式に変換
"""
import json
import re

SYSTEM_PROMPT = "あなたは思想家、武道家の内田樹です。あなたの文体と思考で、どんな質問にも答えてください。"

def clean_content(content):
    """本文をクリーニング"""
    # 複数の改行を2つまでに
    content = re.sub(r'\n{3,}', '\n\n', content)
    # 先頭・末尾の空白削除
    content = content.strip()
    return content

def extract_key_topic(title, content):
    """記事から主要トピックを抽出"""
    # タイトルベースの質問生成
    questions = []

    # パターン1: タイトルそのまま
    if '?' in title or '？' in title:
        questions.append(title)
    else:
        questions.append(f"{title}について教えてください")

    # パターン2: 本文から質問を推測
    keywords = {
        "師弟関係": "師弟関係の本質とは何ですか？",
        "合気道": "合気道から学べることは何ですか？",
        "身体知": "身体知とは何ですか？",
        "教育": "現代の教育について、どう考えますか？",
        "レヴィナス": "レヴィナスの思想を簡単に説明してください",
        "贈与": "贈与論について教えてください",
        "資本主義": "資本主義の問題点は何ですか？",
        "グローバリゼーション": "グローバリゼーションについてどう思いますか？",
        "若者": "若者へのアドバイスをください"
    }

    for keyword, question in keywords.items():
        if keyword in content[:1000]:  # 冒頭1000文字で判定
            questions.append(question)

    return questions[0] if questions else f"{title}について解説してください"

def truncate_content(content, max_tokens=2000):
    """コンテンツを適切な長さに調整"""
    # 1トークン ≈ 0.75文字（日本語）
    max_chars = int(max_tokens * 0.75)

    if len(content) <= max_chars:
        return content

    # 文の途中で切らないように調整
    truncated = content[:max_chars]
    last_period = max(
        truncated.rfind('。'),
        truncated.rfind('.\n'),
        truncated.rfind('\n\n')
    )

    if last_period > max_chars * 0.8:  # 80%以上の位置に句点があれば
        return truncated[:last_period + 1]
    else:
        return truncated + '...'

def convert_to_qa_format(articles):
    """記事をQA形式に変換"""
    qa_data = []

    for article in articles:
        content = clean_content(article['content'])

        if len(content) < 100:  # 短すぎる記事はスキップ
            continue

        # 質問を生成
        question = extract_key_topic(article['title'], content)

        # コンテンツを適切な長さに
        answer = truncate_content(content, max_tokens=2000)

        qa_data.append({
            "messages": [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": question
                },
                {
                    "role": "assistant",
                    "content": answer
                }
            ],
            "metadata": {
                "source": "uchida_blog",
                "title": article['title'],
                "date": article.get('date', ''),
                "url": article['url']
            }
        })

    return qa_data

if __name__ == "__main__":
    print("=== 内田樹ブログ記事をQA形式に変換 ===\n")

    # JSONファイル読み込み
    with open("uchida_blog_articles.json", "r", encoding="utf-8") as f:
        articles = json.load(f)

    print(f"元記事数: {len(articles)}")

    # QA形式に変換
    qa_data = convert_to_qa_format(articles)

    print(f"変換後QA数: {len(qa_data)}")

    # JSONL形式で保存（OpenAI FT用）
    output_file = "uchida_blog_training.jsonl"
    with open(output_file, "w", encoding="utf-8") as f:
        for item in qa_data:
            # metadataは保存時に除外（OpenAI FT用）
            training_item = {"messages": item["messages"]}
            f.write(json.dumps(training_item, ensure_ascii=False) + "\n")

    print(f"保存先: {output_file}")

    # 統計情報
    total_tokens = 0
    for item in qa_data:
        for msg in item['messages']:
            total_tokens += int(len(msg['content']) / 0.75)

    print(f"\n=== 統計 ===")
    print(f"総トークン数: {total_tokens:,}")
    print(f"推定学習コスト: ${total_tokens * 3.0 / 1000000:.2f}")
    print(f"1QAあたり平均トークン: {int(total_tokens / len(qa_data)):,}")
