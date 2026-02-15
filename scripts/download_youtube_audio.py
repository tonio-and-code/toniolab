"""
YouTube音声ダウンロードスクリプト
TTSトレーニング用の高品質音声を取得

使い方:
1. pip install yt-dlp
2. python download_youtube_audio.py
"""

import subprocess
import os

def download_audio(video_id, output_dir='audio_data'):
    """
    YouTubeから高品質音声をダウンロード

    Args:
        video_id: YouTube動画ID
        output_dir: 保存先ディレクトリ
    """
    # 出力ディレクトリを作成
    os.makedirs(output_dir, exist_ok=True)

    output_template = os.path.join(output_dir, f"kobayashi_hideo_{video_id}.%(ext)s")

    # yt-dlpコマンド
    # -x: 音声のみ抽出
    # --audio-format wav: WAV形式（TTSトレーニングに最適）
    # --audio-quality 0: 最高品質
    cmd = [
        'yt-dlp',
        '-x',
        '--audio-format', 'wav',
        '--audio-quality', '0',
        '-o', output_template,
        f'https://youtu.be/{video_id}'
    ]

    print("🎵 音声ダウンロード開始...")
    print(f"📁 保存先: {output_dir}")

    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print("✅ ダウンロード完了！")
        print(f"\n保存されたファイル: {output_template.replace('%(ext)s', 'wav')}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ エラー: {e}")
        print(f"出力: {e.output}")
        return False

if __name__ == "__main__":
    video_id = "bnZHnWLRaAQ"

    print("🎯 小林秀雄 YouTube音声ダウンロードツール")
    print("=" * 50)

    success = download_audio(video_id)

    if success:
        print("\n✅ 次のステップ:")
        print("1. audio_data/ フォルダに WAVファイルが保存されました")
        print("2. extract_youtube_subtitles.py で字幕を取得")
        print("3. 音声ファイルを10秒ごとに分割（次のスクリプトで自動化）")
