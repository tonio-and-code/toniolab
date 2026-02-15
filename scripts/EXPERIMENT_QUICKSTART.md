# AI小林秀雄 実験環境 - クイックスタート

## 前提条件
- Ollamaがインストール済み
- Python 3.8以上

---

## 5分で実験開始

### 1. TTSライブラリのインストール（オプション）

```bash
pip install pyttsx3
```

音声出力が不要な場合はスキップ可能（テキストのみで実験できます）

---

### 2. Ollamaの確認

```bash
cd C:\Users\thaat\Desktop\iwasaki-naisou-website\scripts
python check_ollama.py
```

---

### 3. 実験開始

```bash
python kobayashi_orchestrator.py
```

---

## 実験モード

### モード1: テスト質問セット
```
選択 (1/2/3): 1
```

以下の質問で自動実験:
- 無常とは何ですか？
- 美とは何でしょうか？
- 批評とは何か？

---

### モード2: 対話モード（推奨）
```
選択 (1/2/3): 2
質問 > 無常とは何ですか？
```

自由に質問を入力できます。`exit`で終了。

---

### モード3: 単発実験
```
選択 (1/2/3): 3
質問を入力: あなたの考える美とは？
```

---

## 実験ループの流れ

```
質問入力
    ↓
🧠 Ollama (llama3.1) が回答生成
    ↓
📖 回答テキスト表示
    ↓
🎤 TTS (pyttsx3) で音声化
    ↓
💾 experiments/ に保存
    ↓
📊 実験ログ記録 (experiment_log.jsonl)
```

---

## 出力ファイル

### experiments/response_XXXXX.wav
生成された音声ファイル（pyttsx3使用時）

### experiments/response_XXXXX.txt
生成されたテキスト（TTS未使用時）

### experiments/experiment_log.jsonl
全実験の記録（JSON Lines形式）

```json
{
  "timestamp": 1234567890,
  "question": "無常とは何ですか？",
  "response": "無常とは...",
  "model": "llama3.1",
  "output_file": "experiments/response_1234567890.wav"
}
```

---

## カスタマイズ

### モデルの変更

```python
# kobayashi_orchestrator.py の __init__ を編集
def __init__(self, model_name="llama3.1"):  # ← ここを変更
```

### TTS速度の調整

```python
# synthesize_speech() 内
engine.setProperty('rate', 150)  # ← この数値を変更（100-200推奨）
```

---

## トラブルシューティング

### Ollamaが見つからない
```bash
# Ollamaがインストールされているか確認
ollama list
```

### pyttsx3エラー
```bash
# 再インストール
pip uninstall pyttsx3
pip install pyttsx3
```

音声なしで実験する場合、`use_tts=False`をデフォルトに設定可能

---

## 次の実験ステップ

### 1. プロンプトの改善
Ollamaに「小林秀雄風に答えよ」という指示を追加

### 2. TTSの高品質化
pyttsx3 → Coqui TTS または Piper TTS

### 3. ファインチューニング
小林秀雄の著作・音源からトレーニングデータ作成

---

## 実験開始コマンド

```bash
cd C:\Users\thaat\Desktop\iwasaki-naisou-website\scripts
python kobayashi_orchestrator.py
```

**これだけです。実験を始めてください。**
