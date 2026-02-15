# AI小林秀雄プロジェクト - セットアップ手順

## 前提条件
- Python 3.8以上がインストールされていること
- インターネット接続があること

## ステップ1: 必要なライブラリをインストール

PowerShellまたはコマンドプロンプトで以下を実行：

```bash
pip install youtube-transcript-api yt-dlp
```

## ステップ2: 字幕データを取得

```bash
cd C:\Users\thaat\Desktop\iwasaki-naisou-website\scripts
python extract_youtube_subtitles.py
```

### 期待される出力
- `kobayashi_hideo_bnZHnWLRaAQ.json` - 字幕データ（JSON形式）
- `kobayashi_hideo_bnZHnWLRaAQ.csv` - 字幕データ（CSV形式、TTSトレーニング用）
- `kobayashi_hideo_bnZHnWLRaAQ.txt` - 字幕データ（テキスト形式、タイムスタンプ付き）

### 確認すべきこと
1. CSVファイルを開いて、字幕の品質を確認
2. 自動生成字幕の場合、誤認識がある可能性
3. 「間（ま）」や「えー」は含まれていない可能性が高い

## ステップ3: 音声データをダウンロード

```bash
python download_youtube_audio.py
```

### 期待される出力
- `audio_data/kobayashi_hideo_bnZHnWLRaAQ.wav` - 高品質WAVファイル

## ステップ4: データの品質確認

### 字幕の品質チェック
1. `kobayashi_hideo_bnZHnWLRaAQ.txt` を開く
2. 最初の5分間を音声と照らし合わせて聞く
3. 以下をチェック：
   - 文字起こしの正確性
   - 句読点の位置
   - 「えー」「あー」などのフィラーが含まれているか
   - 沈黙（間）の情報はあるか

### 判断基準
| 字幕の品質 | 次のステップ |
|-----------|------------|
| 90%以上正確 | そのまま使用可能 |
| 70-90%正確 | 部分的に手動修正が必要 |
| 70%未満 | 手動文字起こしを検討 |

## ステップ5: 次のフェーズへ

字幕データの品質が確認できたら、次のステップは：

1. **音声を10秒ごとに分割**（次のスクリプトで自動化予定）
2. **字幕と音声のアライメント**（タイムスタンプの精度確認）
3. **TTSトレーニングデータセットの作成**

---

## トラブルシューティング

### エラー: `youtube-transcript-api が見つかりません`
```bash
pip install --upgrade youtube-transcript-api
```

### エラー: `yt-dlp が見つかりません`
```bash
pip install --upgrade yt-dlp
```

### エラー: `字幕が見つかりません`
この動画には字幕がない可能性があります。その場合：
1. 別の小林秀雄の動画で字幕付きのものを探す
2. CDからの手動文字起こしを検討
3. WhisperなどのAI文字起こしツールを使用

---

## 重要な発見

もしこの方法で**タイムスタンプ付きの完璧なテキスト**が手に入れば、
「5時間の手作業」が「5分のスクリプト実行」になります。

これは**プロジェクトの成否を分ける**決定的な分岐点です。
