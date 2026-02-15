"""
Ollama環境チェックスクリプト
"""
import subprocess
import json

def check_ollama():
    """Ollamaの動作確認"""
    try:
        # Ollamaが起動しているか確認
        result = subprocess.run(['ollama', 'list'], capture_output=True, text=True)
        print("=== Ollama Models ===")
        print(result.stdout)
        return True
    except FileNotFoundError:
        print("❌ Ollamaがインストールされていません")
        return False

def test_generation():
    """簡単な生成テスト"""
    try:
        result = subprocess.run(
            ['ollama', 'run', 'llama3.1', '無常とは何ですか？'],
            capture_output=True,
            text=True,
            timeout=30
        )
        print("\n=== Test Generation ===")
        print(result.stdout)
        return True
    except Exception as e:
        print(f"❌ 生成テスト失敗: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Ollama環境チェック\n")

    if check_ollama():
        print("\n✅ Ollama動作確認OK")
        print("\n次: 生成テスト実行中...")
        test_generation()
    else:
        print("\n❌ Ollamaのセットアップが必要です")
