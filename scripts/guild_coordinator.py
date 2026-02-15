"""
私設ギルド調整システム（ローカル版）
n8n不要・LINE API使用

構成:
1. 職人名簿（CSV）
2. 案件入力（CLI）
3. 自動打診（LINE Messaging API）
4. 回答集計（Webhook受信）
"""
import csv
import json
from pathlib import Path
from datetime import datetime
import requests

class GuildCoordinator:
    """職人ギルドの自動調整"""

    def __init__(self, roster_path="guild_roster.csv"):
        self.roster_path = Path(roster_path)
        self.line_token = None  # LINE Messaging API token
        self.jobs_dir = Path("jobs")
        self.jobs_dir.mkdir(exist_ok=True)

    def load_roster(self):
        """名簿読み込み"""
        if not self.roster_path.exists():
            self._create_sample_roster()

        roster = []
        with open(self.roster_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            roster = list(reader)

        return roster

    def _create_sample_roster(self):
        """サンプル名簿作成"""
        sample = [
            {"name": "田中", "line_id": "tanaka123", "skill": "壁紙", "rank": "A", "region": "墨田区"},
            {"name": "佐藤", "line_id": "sato456", "skill": "塗装", "rank": "B", "region": "江東区"},
        ]

        with open(self.roster_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=["name", "line_id", "skill", "rank", "region"])
            writer.writeheader()
            writer.writerows(sample)

        print(f"✅ サンプル名簿作成: {self.roster_path}")

    def create_job(self, date_range: str, location: str, people_needed: int, skill: str = None):
        """案件作成"""
        job_id = f"job_{int(datetime.now().timestamp())}"
        job = {
            "id": job_id,
            "date_range": date_range,
            "location": location,
            "people_needed": people_needed,
            "skill": skill,
            "status": "募集中",
            "responses": {}
        }

        job_file = self.jobs_dir / f"{job_id}.json"
        with open(job_file, 'w', encoding='utf-8') as f:
            json.dump(job, f, ensure_ascii=False, indent=2)

        print(f"\n✅ 案件作成: {job_id}")
        print(f"期間: {date_range}")
        print(f"場所: {location}")
        print(f"必要人数: {people_needed}名")

        return job

    def send_offers(self, job):
        """自動打診（優先順位順）"""
        roster = self.load_roster()

        # フィルタリング＆ソート
        candidates = [
            p for p in roster
            if (not job["skill"] or p["skill"] == job["skill"])
        ]
        candidates.sort(key=lambda x: x["rank"])

        print(f"\n📢 打診開始（候補: {len(candidates)}名）")

        for person in candidates:
            message = self._create_offer_message(person, job)
            print(f"\n--- {person['name']} への打診 ---")
            print(message)

            # LINE送信（実装時）
            # self._send_line_message(person['line_id'], message)

        return candidates

    def _create_offer_message(self, person, job):
        """打診メッセージ生成"""
        return f"""お疲れ様です。イワサキです。

【案件】
期間: {job['date_range']}
場所: {job['location']}
人数: {job['people_needed']}名

{person['name']}さん、空いてますか？

回答: {job['id']}/空いてる または {job['id']}/NG"""

    def record_response(self, job_id: str, person_name: str, available: bool):
        """回答記録"""
        job_file = self.jobs_dir / f"{job_id}.json"

        with open(job_file, 'r', encoding='utf-8') as f:
            job = json.load(f)

        job["responses"][person_name] = "空いてる" if available else "NG"

        # 必要人数確保チェック
        available_count = sum(1 for v in job["responses"].values() if v == "空いてる")

        if available_count >= job["people_needed"]:
            job["status"] = "確定"
            print(f"\n✅ 案件確定！ {available_count}名確保")

        with open(job_file, 'w', encoding='utf-8') as f:
            json.dump(job, f, ensure_ascii=False, indent=2)

        return job

    def show_status(self, job_id: str):
        """案件状況表示"""
        job_file = self.jobs_dir / f"{job_id}.json"

        with open(job_file, 'r', encoding='utf-8') as f:
            job = json.load(f)

        print(f"\n{'='*50}")
        print(f"案件ID: {job['id']}")
        print(f"状態: {job['status']}")
        print(f"期間: {job['date_range']}")
        print(f"場所: {job['location']}")
        print(f"必要: {job['people_needed']}名")
        print(f"\n【回答状況】")

        for name, status in job["responses"].items():
            emoji = "✅" if status == "空いてる" else "❌"
            print(f"{emoji} {name}: {status}")

        available = [n for n, s in job["responses"].items() if s == "空いてる"]
        print(f"\n確保: {len(available)}/{job['people_needed']}名")

        return job


def main():
    """CLI実行"""
    coordinator = GuildCoordinator()

    print("🏗️ 私設ギルド調整システム")
    print("\n1. 名簿確認")
    print("2. 案件作成")
    print("3. 案件状況確認")
    print("4. 回答記録（テスト）")

    choice = input("\n選択: ").strip()

    if choice == "1":
        roster = coordinator.load_roster()
        print(f"\n📋 登録職人: {len(roster)}名")
        for p in roster:
            print(f"- {p['name']} ({p['skill']}, ランク{p['rank']}, {p['region']})")

    elif choice == "2":
        date_range = input("期間: ")
        location = input("場所: ")
        people = int(input("人数: "))
        skill = input("職種（任意）: ").strip() or None

        job = coordinator.create_job(date_range, location, people, skill)
        coordinator.send_offers(job)

    elif choice == "3":
        job_id = input("案件ID: ")
        coordinator.show_status(job_id)

    elif choice == "4":
        job_id = input("案件ID: ")
        name = input("職人名: ")
        available = input("空いてる? (y/n): ").lower() == "y"
        coordinator.record_response(job_id, name, available)
        coordinator.show_status(job_id)


if __name__ == "__main__":
    main()
