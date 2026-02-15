"""
YouTube字幕抽出スクリプト
小林秀雄の音声データ用

使い方:
1. pip install youtube-transcript-api
2. python extract_youtube_subtitles.py
"""

from youtube_transcript_api import YouTubeTranscriptApi
import json
import csv

def extract_subtitles(video_id, output_format='json'):
    """
    YouTubeから字幕を抽出

    Args:
        video_id: YouTube動画ID (例: 'bnZHnWLRaAQ')
        output_format: 出力形式 ('json', 'csv', 'txt')
    """
    try:
        # 字幕を取得（日本語優先）
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # 利用可能な字幕言語を表示
        print("利用可能な字幕:")
        for transcript in transcript_list:
            print(f"- {transcript.language} ({'自動生成' if transcript.is_generated else '手動'})")

        # 日本語字幕を取得
        try:
            transcript = transcript_list.find_transcript(['ja'])
        except:
            print("日本語字幕が見つかりません。英語字幕を試します...")
            transcript = transcript_list.find_transcript(['en'])

        subtitle_data = transcript.fetch()

        # 出力ファイル名
        base_filename = f"kobayashi_hideo_{video_id}"

        if output_format == 'json':
            # JSON形式で保存
            with open(f"{base_filename}.json", 'w', encoding='utf-8') as f:
                json.dump(subtitle_data, f, ensure_ascii=False, indent=2)
            print(f"✅ JSON保存完了: {base_filename}.json")

        elif output_format == 'csv':
            # CSV形式で保存（TTSトレーニング用）
            with open(f"{base_filename}.csv", 'w', encoding='utf-8', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(['start_time', 'duration', 'text'])
                for entry in subtitle_data:
                    writer.writerow([
                        entry['start'],
                        entry['duration'],
                        entry['text'].replace('\n', ' ')
                    ])
            print(f"✅ CSV保存完了: {base_filename}.csv")

        elif output_format == 'txt':
            # テキスト形式で保存（タイムスタンプ付き）
            with open(f"{base_filename}.txt", 'w', encoding='utf-8') as f:
                for entry in subtitle_data:
                    timestamp = format_timestamp(entry['start'])
                    f.write(f"[{timestamp}] {entry['text']}\n")
            print(f"✅ テキスト保存完了: {base_filename}.txt")

        # 全形式で保存
        if output_format == 'all':
            extract_subtitles(video_id, 'json')
            extract_subtitles(video_id, 'csv')
            extract_subtitles(video_id, 'txt')

        return subtitle_data

    except Exception as e:
        print(f"❌ エラー: {e}")
        return None

def format_timestamp(seconds):
    """秒数を HH:MM:SS 形式に変換"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"

def analyze_subtitles(subtitle_data):
    """字幕データの統計情報を表示"""
    if not subtitle_data:
        return

    total_duration = subtitle_data[-1]['start'] + subtitle_data[-1]['duration']
    total_text = ' '.join([entry['text'] for entry in subtitle_data])

    print("\n📊 統計情報:")
    print(f"- 総再生時間: {format_timestamp(total_duration)}")
    print(f"- 字幕セグメント数: {len(subtitle_data)}")
    print(f"- 総文字数: {len(total_text)}")
    print(f"- 平均セグメント長: {len(total_text) / len(subtitle_data):.1f}文字")

    # 最初の3セグメントを表示
    print("\n📝 最初の3セグメント:")
    for i, entry in enumerate(subtitle_data[:3]):
        timestamp = format_timestamp(entry['start'])
        print(f"{i+1}. [{timestamp}] {entry['text']}")

if __name__ == "__main__":
    # 小林秀雄の動画ID
    video_id = "bnZHnWLRaAQ"

    print("🎯 小林秀雄 YouTube字幕抽出ツール")
    print("=" * 50)

    # 字幕を抽出（全形式で保存）
    subtitle_data = extract_subtitles(video_id, output_format='all')

    # 統計情報を表示
    analyze_subtitles(subtitle_data)

    print("\n✅ 完了！")
    print("\n次のステップ:")
    print("1. CSVファイルを開いて内容を確認")
    print("2. 手動で修正が必要な箇所をチェック")
    print("3. 音声ファイルをダウンロード（yt-dlp使用）")
