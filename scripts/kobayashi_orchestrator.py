"""
AI小林秀雄 実験環境
最小限のオーケストレーター

実行: python kobayashi_orchestrator.py
"""
import subprocess
import json
import time
from pathlib import Path

class KobayashiOrchestrator:
    """AI小林秀雄の指揮スクリプト"""

    def __init__(self, model_name="llama3.1"):
        self.model_name = model_name
        self.output_dir = Path("experiments")
        self.output_dir.mkdir(exist_ok=True)

    def generate_response(self, question: str) -> str:
        """
        Ollamaで回答生成

        Args:
            question: ユーザーの質問

        Returns:
            生成されたテキスト
        """
        print(f"\n🧠 LLM思考中... ({self.model_name})")

        try:
            result = subprocess.run(
                ['ollama', 'run', self.model_name, question],
                capture_output=True,
                text=True,
                timeout=60
            )

            response = result.stdout.strip()
            print(f"\n📝 生成完了 ({len(response)}文字)")
            return response

        except subprocess.TimeoutExpired:
            return "❌ タイムアウト（60秒超過）"
        except Exception as e:
            return f"❌ エラー: {e}"

    def synthesize_speech(self, text: str, use_tts=True) -> Path:
        """
        音声合成（TTS）

        Args:
            text: 音声化するテキスト
            use_tts: TTS使用（False=テキスト保存のみ）

        Returns:
            音声ファイルのパス
        """
        print("\n🎤 音声合成...")

        timestamp = int(time.time())

        if use_tts:
            try:
                import pyttsx3

                engine = pyttsx3.init()

                # 日本語音声設定（可能であれば）
                voices = engine.getProperty('voices')
                # for voice in voices:
                #     if 'japanese' in voice.name.lower():
                #         engine.setProperty('voice', voice.id)

                # 速度調整（小林秀雄は比較的ゆっくり話す）
                engine.setProperty('rate', 150)  # デフォルト200

                # 音声出力
                print("🔊 音声再生中...")
                engine.say(text)
                engine.runAndWait()

                # WAVファイルとして保存（オプション）
                output_path = self.output_dir / f"response_{timestamp}.wav"
                engine.save_to_file(text, str(output_path))
                engine.runAndWait()

                print(f"💾 音声保存: {output_path}")
                return output_path

            except ImportError:
                print("⚠️  pyttsx3未インストール（pip install pyttsx3）")
                print("📝 テキストのみ保存します")
                use_tts = False
            except Exception as e:
                print(f"⚠️  TTS実行エラー: {e}")
                print("📝 テキストのみ保存します")
                use_tts = False

        if not use_tts:
            # テキストファイルのみ保存
            output_path = self.output_dir / f"response_{timestamp}.txt"
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(text)
            print(f"💾 保存: {output_path}")

        return output_path

    def run_experiment(self, question: str):
        """
        実験ループの実行

        フロー:
        1. 質問を受け取る
        2. Ollamaで回答生成
        3. TTS（未実装）
        4. 結果を保存

        Args:
            question: 実験用の質問
        """
        print("=" * 60)
        print("🎯 AI小林秀雄 実験環境")
        print("=" * 60)
        print(f"\n❓ 質問: {question}")

        # ステップ1: LLMで生成
        response = self.generate_response(question)

        # ステップ2: 結果表示
        print("\n" + "=" * 60)
        print("📖 回答:")
        print("=" * 60)
        print(response)
        print("=" * 60)

        # ステップ3: TTS（現状はテキスト保存のみ）
        output_file = self.synthesize_speech(response)

        # 実験記録
        self._save_experiment_log(question, response, output_file)

        return response

    def _save_experiment_log(self, question: str, response: str, output_file: Path):
        """実験ログをJSON形式で保存"""
        log_path = self.output_dir / "experiment_log.jsonl"

        log_entry = {
            "timestamp": time.time(),
            "question": question,
            "response": response,
            "model": self.model_name,
            "output_file": str(output_file)
        }

        with open(log_path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')

        print(f"\n📊 実験ログ更新: {log_path}")

    def interactive_mode(self):
        """対話モード"""
        print("\n🎭 対話モード開始（exit で終了）\n")

        while True:
            question = input("質問 > ")

            if question.lower() in ['exit', 'quit', 'q']:
                print("\n👋 実験終了")
                break

            if not question.strip():
                continue

            self.run_experiment(question)
            print("\n")


def main():
    """メイン実行"""

    # 実験用の質問セット
    test_questions = [
        "無常とは何ですか？",
        "美とは何でしょうか？",
        "批評とは何か？"
    ]

    orchestrator = KobayashiOrchestrator()

    print("🔬 AI小林秀雄 実験環境")
    print("\n選択してください:")
    print("1. テスト質問で実験")
    print("2. 対話モード")
    print("3. 単発実験")

    choice = input("\n選択 (1/2/3): ").strip()

    if choice == "1":
        print("\n📋 テスト質問セットで実験開始\n")
        for i, q in enumerate(test_questions, 1):
            print(f"\n--- 実験 {i}/{len(test_questions)} ---")
            orchestrator.run_experiment(q)
            if i < len(test_questions):
                time.sleep(2)  # 連続実行の間隔

    elif choice == "2":
        orchestrator.interactive_mode()

    elif choice == "3":
        question = input("質問を入力: ")
        orchestrator.run_experiment(question)

    else:
        print("❌ 無効な選択")


if __name__ == "__main__":
    main()
