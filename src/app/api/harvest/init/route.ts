import { NextResponse } from 'next/server';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '7efac1047fba804c1b7ea5a10868dbfc';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = 'f4801cde-0f1d-4bc9-beec-5d8709813798';

async function executeQuery<T>(sql: string, params: (string | number | null)[] = []) {
    if (!CLOUDFLARE_API_TOKEN) throw new Error('CLOUDFLARE_API_TOKEN is not set');

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql, params }),
            cache: 'no-store',
        }
    );

    if (!response.ok) throw new Error(`D1 API error: ${await response.text()}`);

    const data = await response.json() as {
        result: { results: T[]; success: boolean }[];
        success: boolean;
        errors: { message: string }[];
    };

    if (!data.success) throw new Error(`D1 query failed: ${data.errors.map(e => e.message).join(', ')}`);

    return data.result[0];
}

// POST: Initialize or migrate the harvested_expressions table
// ?action=migrate  -- add new columns without dropping data
// ?action=reset    -- DROP + CREATE (destroys data)
export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'migrate';

        if (action === 'reset') {
            await executeQuery('DROP TABLE IF EXISTS harvested_expressions');
        }

        // Create table if not exists
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS harvested_expressions (
                id TEXT PRIMARY KEY,
                expression TEXT NOT NULL UNIQUE,
                score REAL NOT NULL DEFAULT 0,
                source_type TEXT NOT NULL,
                source_title TEXT,
                source_url TEXT,
                context TEXT,
                note TEXT,
                harvest_date TEXT,
                status TEXT NOT NULL DEFAULT 'new',
                created_at TEXT NOT NULL
            )
        `);

        // Migrate: add columns if missing (SQLite ignores if already exists)
        const migrations = [
            "ALTER TABLE harvested_expressions ADD COLUMN note TEXT",
            "ALTER TABLE harvested_expressions ADD COLUMN harvest_date TEXT",
        ];
        for (const sql of migrations) {
            try { await executeQuery(sql); } catch { /* column already exists */ }
        }

        // Create indexes
        await executeQuery('CREATE INDEX IF NOT EXISTS idx_harvested_status ON harvested_expressions(status)');
        await executeQuery('CREATE INDEX IF NOT EXISTS idx_harvested_score ON harvested_expressions(score DESC)');
        await executeQuery('CREATE INDEX IF NOT EXISTS idx_harvested_expression ON harvested_expressions(expression)');
        await executeQuery('CREATE INDEX IF NOT EXISTS idx_harvested_date ON harvested_expressions(harvest_date)');

        return NextResponse.json({
            success: true,
            message: action === 'reset' ? 'Harvest table reset' : 'Harvest table migrated',
        });
    } catch (error) {
        console.error('Error initializing harvest table:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to initialize table', success: false },
            { status: 500 }
        );
    }
}
