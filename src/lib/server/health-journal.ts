import fs from 'fs';
import path from 'path';
import { HealthJournalEntry } from '@/types/health-journal';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'health-journal.json');

export class HealthJournalServerStorage {
    private static ensureFileExists() {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            const dir = path.dirname(DATA_FILE_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(DATA_FILE_PATH, '[]', 'utf-8');
        }
    }

    static getAll(): HealthJournalEntry[] {
        this.ensureFileExists();
        try {
            const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to read health journal data:', error);
            return [];
        }
    }

    static getById(id: string): HealthJournalEntry | null {
        const entries = this.getAll();
        return entries.find(e => e.id === id) || null;
    }

    static save(entry: HealthJournalEntry): void {
        const entries = this.getAll();
        const index = entries.findIndex(e => e.id === entry.id);

        if (index >= 0) {
            entries[index] = entry;
        } else {
            entries.push(entry);
        }

        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(entries, null, 2), 'utf-8');
    }

    static delete(id: string): void {
        const entries = this.getAll();
        const filtered = entries.filter(e => e.id !== id);
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    }
}
