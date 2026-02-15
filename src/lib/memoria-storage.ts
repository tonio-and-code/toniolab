import { MemoriaEntry } from '@/types/memoria';

export class MemoriaStorage {
    static async getAll(): Promise<MemoriaEntry[]> {
        if (typeof window === 'undefined') return [];
        try {
            const res = await fetch('/api/memoria/entries');
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error('Failed to fetch entries:', error);
            return [];
        }
    }

    static async getById(id: string): Promise<MemoriaEntry | null> {
        try {
            const entries = await this.getAll();
            return entries.find(e => e.id === id) || null;
        } catch (error) {
            console.error('Failed to get entry:', error);
            return null;
        }
    }

    static async save(entry: MemoriaEntry): Promise<void> {
        try {
            await fetch('/api/memoria/entries', {
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
            await fetch(`/api/memoria/entries/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to delete entry:', error);
            throw error;
        }
    }
}

