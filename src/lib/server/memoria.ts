import fs from 'fs';
import path from 'path';
import { MemoriaEntry } from '@/types/memoria';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'memoria.json');

export class MemoriaServerStorage {
    private static ensureFileExists() {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            const dir = path.dirname(DATA_FILE_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(DATA_FILE_PATH, '[]', 'utf-8');
        }
    }

    static getAll(): MemoriaEntry[] {
        this.ensureFileExists();
        try {
            const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to read memoria data:', error);
            return [];
        }
    }

    static save(entry: MemoriaEntry): void {
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
