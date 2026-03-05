import { NextResponse } from 'next/server';
import { ELEMENTS } from '@/data/english/elements';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '7efac1047fba804c1b7ea5a10868dbfc';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = 'f4801cde-0f1d-4bc9-beec-5d8709813798';

async function executeQuery(sql: string, params: (string | number)[] = []) {
    if (!CLOUDFLARE_API_TOKEN) {
        throw new Error('CLOUDFLARE_API_TOKEN is not set');
    }

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql, params }),
        }
    );

    const data = await response.json();
    return data;
}

// GET: Run migrations on phrases table
export async function GET() {
    try {
        // phrase_links: lightweight text linked to a phrase (not a separate card)
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS phrase_links (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phrase_id TEXT NOT NULL,
                text TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        `);
        await executeQuery('CREATE INDEX IF NOT EXISTS idx_phrase_links_phrase_id ON phrase_links(phrase_id)');

        // Migrate old categories to random elements (phrases table)
        const validElements = ELEMENTS as readonly string[];
        const placeholders = validElements.map(() => '?').join(', ');
        const oldRes = await executeQuery(
            `SELECT id FROM phrases WHERE category NOT IN (${placeholders})`,
            [...validElements]
        );

        // D1 REST API returns { result: [{ results: [...] }] }
        const rawResult = oldRes as Record<string, unknown>;
        const resultArray = (rawResult.result as { results: { id: string }[] }[]) || [];
        const oldIds: { id: string }[] = resultArray[0]?.results || [];
        let migrated = 0;

        for (const row of oldIds) {
            const el = validElements[Math.floor(Math.random() * validElements.length)];
            await executeQuery('UPDATE phrases SET category = ? WHERE id = ?', [el, row.id]);
            migrated++;
        }

        return NextResponse.json({
            message: `Migrated ${migrated} phrases to elements.`,
            migrated,
            total_found: oldIds.length,
            success: true,
        });
    } catch (error) {
        console.error('Error running phrases migrations:', error);
        return NextResponse.json({
            error: 'Failed to run migrations',
            message: error instanceof Error ? error.message : 'Unknown error',
            success: false,
        }, { status: 500 });
    }
}
