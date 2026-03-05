import { NextResponse } from 'next/server';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '7efac1047fba804c1b7ea5a10868dbfc';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = 'f4801cde-0f1d-4bc9-beec-5d8709813798';

// POST: phrase_mastery テーブルを作成
export async function POST() {
    if (!CLOUDFLARE_API_TOKEN) {
        return NextResponse.json({ error: 'API token not set', success: false }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sql: `CREATE TABLE IF NOT EXISTS phrase_mastery (
                        phrase_id TEXT PRIMARY KEY,
                        mastery_level INTEGER DEFAULT 0,
                        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
                    )`,
                }),
            }
        );

        const data = await response.json();

        if (!data.success) {
            return NextResponse.json({ error: data.errors, success: false }, { status: 500 });
        }

        // Add last_leveled_at column if missing (migration for spaced-repetition gate)
        try {
            await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sql: `ALTER TABLE phrase_mastery ADD COLUMN last_leveled_at TEXT DEFAULT NULL`,
                    }),
                }
            );
        } catch {
            // column already exists
        }

        // Add card_points column if missing (migration for card rank system)
        try {
            await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sql: `ALTER TABLE phrase_mastery ADD COLUMN card_points INTEGER DEFAULT 0`,
                    }),
                }
            );
        } catch {
            // column already exists
        }

        // Add card_name column if missing (migration for card nicknames)
        try {
            await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sql: `ALTER TABLE phrase_mastery ADD COLUMN card_name TEXT DEFAULT NULL`,
                    }),
                }
            );
        } catch {
            // column already exists
        }

        return NextResponse.json({ message: 'Table created successfully', success: true });
    } catch (error) {
        console.error('Error creating table:', error);
        return NextResponse.json({ error: 'Failed to create table', success: false }, { status: 500 });
    }
}
