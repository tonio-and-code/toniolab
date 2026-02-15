# TTS（音声合成）選択肢

AI小林秀雄実験用のTTSエンジン候補

---

## Option 1: pyttsx3（最速・ローカル）

### 特徴
- **完全ローカル実行**（インターネット不要）
- Windows標準の音声エンジン使用
- インストール: `pip install pyttsx3`
- **品質**: 低〜中（ロボット的）

### 実装例
```python
import pyttsx3

engine = pyttsx3.init()
engine.say("無常とは何か")
engine.runAndWait()
```

### 評価
- ✅ 即座に実験開始可能
- ❌ 声質の制御は困難
- ❌ 小林秀雄の声の再現は不可能

---

## Option 2: Coqui TTS（ローカル・高品質）

### 特徴
- **完全ローカル実行**
- オープンソース
- 声のクローニング機能あり
- インストール: `pip install TTS`

### 実装例
```python
from TTS.api import TTS

tts = TTS("tts_models/ja/kokoro/tacotron2-DDC")
tts.tts_to_file(text="無常とは何か", file_path="output.wav")
```

### 評価
- ✅ 高品質な日本語音声
- ✅ 将来的に声のクローニング可能
- ⚠️ モデルサイズ大（数GB）
- ⚠️ Snapdragonで動作するか要検証

---

## Option 3: Piper TTS（軽量・高速）

### 特徴
- **完全ローカル実行**
- 非常に軽量（10-50MB）
- 高速生成
- インストール: バイナリダウンロード

### 実装例
```bash
echo "無常とは何か" | piper --model ja_JP-kokoro-medium --output_file output.wav
```

### 評価
- ✅ 軽量でSnapdragonでも動作する可能性高
- ✅ 高速
- ❌ 声のカスタマイズは限定的

---

## Option 4: StyleTTS 2（研究レベル・最高品質）

### 特徴
- **最新の音声合成技術**
- 声のクローニング特化
- CD音源からのファインチューニング可能

### 実装
- 複雑（研究用コード）
- GPU必須（RTXマシン）
- Snapdragonでは不可

### 評価
- ✅ 小林秀雄の声の完全再現が可能
- ❌ 実験環境構築には不向き
- ⚠️ 将来の「本番」用

---

## Option 5: OpenAI TTS API（クラウド・簡単）

### 特徴
- 高品質
- 簡単に実装可能
- APIキー必要
- インターネット接続必須

### 実装例
```python
from openai import OpenAI
client = OpenAI()

response = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="無常とは何か"
)
response.stream_to_file("output.mp3")
```

### 評価
- ✅ 高品質
- ✅ 実装が簡単
- ❌ 完全ローカルではない
- ❌ コストがかかる

---

## 推奨アプローチ

### フェーズ1: 即座に実験開始（今日）
**pyttsx3** を使用

```python
# kobayashi_orchestrator.py に追加
import pyttsx3

def synthesize_speech(self, text: str):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()
```

**理由**: インストール不要、即座に「LLM→TTS」のループが体験できる

---

### フェーズ2: 品質向上（1週間後）
**Coqui TTS** または **Piper TTS** に移行

**理由**: 音質が向上し、実験の解像度が上がる

---

### フェーズ3: 声のクローニング（1ヶ月後）
**StyleTTS 2** でCD音源からファインチューニング

**理由**: これが最終目標

---

## 次のステップ

1. **今すぐ**: pyttsx3を`kobayashi_orchestrator.py`に統合
2. **実験**: Ollama + pyttsx3のループを体験
3. **評価**: 何が足りないか、何が必要か、実験から学ぶ
