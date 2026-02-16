import { HealthJournalEntry } from '@/types/health-journal';

export class HealthJournalStorage {
    static async getAll(): Promise<HealthJournalEntry[]> {
        if (typeof window === 'undefined') return [];
        try {
            const res = await fetch('/api/health-journal/entries');
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error('Failed to fetch entries:', error);
            return [];
        }
    }

    static async getById(id: string): Promise<HealthJournalEntry | null> {
        try {
            const res = await fetch(`/api/health-journal/entries/${id}`);
            if (!res.ok) return null;
            return await res.json();
        } catch (error) {
            console.error('Failed to get entry:', error);
            return null;
        }
    }

    static async save(entry: HealthJournalEntry): Promise<void> {
        try {
            await fetch('/api/health-journal/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            });
        } catch (error) {
            console.error('Failed to save entry:', error);
            throw error;
        }
    }

    static async delete(id: string): Promise<void> {
        try {
            await fetch(`/api/health-journal/entries/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to delete entry:', error);
            throw error;
        }
    }
}
