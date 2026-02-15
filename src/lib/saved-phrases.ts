// Saved Phrases - localStorage management for favorite phrases

export interface SavedPhrase {
    id: string;
    english: string;
    japanese?: string;
    source?: string;  // e.g., "Memoria: タイトル", "Journal #071"
    date: string;     // YYYY-MM-DD format for grouping
    savedAt: string;  // Full ISO timestamp
    syncedToDb?: boolean;
}

const STORAGE_KEY = 'saved_phrases';

export const SavedPhrasesStorage = {
    getAll(): SavedPhrase[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    save(phrase: Omit<SavedPhrase, 'id' | 'savedAt' | 'date'>): SavedPhrase {
        const phrases = this.getAll();

        // Check if already saved (by english text)
        const existing = phrases.find(p => p.english === phrase.english);
        if (existing) return existing;

        const now = new Date();
        const newPhrase: SavedPhrase = {
            ...phrase,
            id: Date.now().toString(),
            date: now.toISOString().split('T')[0], // YYYY-MM-DD
            savedAt: now.toISOString(),
        };

        phrases.unshift(newPhrase);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases));
        return newPhrase;
    },

    remove(id: string): void {
        const phrases = this.getAll().filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases));
    },

    isSaved(english: string): boolean {
        return this.getAll().some(p => p.english === english);
    },

    clear(): void {
        localStorage.removeItem(STORAGE_KEY);
    },

    count(): number {
        return this.getAll().length;
    },

    // Group by date
    getGroupedByDate(): { date: string; phrases: SavedPhrase[] }[] {
        const phrases = this.getAll();
        const grouped: { [date: string]: SavedPhrase[] } = {};

        phrases.forEach(p => {
            const date = p.date || p.savedAt.split('T')[0];
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(p);
        });

        return Object.keys(grouped)
            .sort((a, b) => b.localeCompare(a)) // newest first
            .map(date => ({ date, phrases: grouped[date] }));
    },

    // Mark as synced
    markSynced(ids: string[]): void {
        const phrases = this.getAll();
        phrases.forEach(p => {
            if (ids.includes(p.id)) p.syncedToDb = true;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases));
    },

    // Get unsynced
    getUnsynced(): SavedPhrase[] {
        return this.getAll().filter(p => !p.syncedToDb);
    }
};
