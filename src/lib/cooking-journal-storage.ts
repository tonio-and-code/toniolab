/**
 * Cooking Journal Storage
 * 料理ジャーナルのデータ管理
 */

import { CookingJournalEntry, CookingJournalInput } from '@/types/cooking-journal';

const DATA_FILE = '/data/cooking-journal.json';

export class CookingJournalStorage {
    /**
     * 全エントリー取得
     */
    static async getAll(): Promise<CookingJournalEntry[]> {
        try {
            const response = await fetch(DATA_FILE);
            if (!response.ok) return [];
            return await response.json();
        } catch {
            return [];
        }
    }

    /**
     * ID指定で取得
     */
    static async getById(id: string): Promise<CookingJournalEntry | null> {
        const entries = await this.getAll();
        return entries.find(e => e.id === id) || null;
    }

    /**
     * 新規作成（API経由）
     */
    static async create(input: CookingJournalInput): Promise<CookingJournalEntry | null> {
        try {
            const response = await fetch('/api/cooking-journal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input }),
            });
            if (!response.ok) return null;
            return await response.json();
        } catch {
            return null;
        }
    }

    /**
     * 更新（API経由）
     */
    static async update(id: string, updates: Partial<CookingJournalEntry>): Promise<boolean> {
        try {
            const response = await fetch('/api/cooking-journal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, updates }),
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * 削除（API経由）
     */
    static async delete(id: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/cooking-journal?id=${id}`, {
                method: 'DELETE',
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}
