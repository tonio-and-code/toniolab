import { NextResponse } from 'next/server';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '7efac1047fba804c1b7ea5a10868dbfc';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = 'f4801cde-0f1d-4bc9-beec-5d8709813798';

async function executeQuery(sql: string) {
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
            body: JSON.stringify({ sql }),
        }
    );

    const data = await response.json();
    return data;
}

// GET: Initialize the user_phrases table
export async function GET() {
    try {
        // Create user_phrases table
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS user_phrases (
                id TEXT PRIMARY KEY,
                phrase TEXT NOT NULL UNIQUE,
                type TEXT NOT NULL,
                meaning TEXT NOT NULL,
                note TEXT,
                example TEXT,
                source TEXT,
                mastery_level INTEGER DEFAULT 0,
                times_used INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                last_reviewed_at TEXT
            )
        `;

        const result = await executeQuery(createTableSQL);

        if (!result.success) {
            return NextResponse.json({
                error: 'Failed to create table',
                details: result.errors,
                success: false,
            }, { status: 500 });
        }

        // Create index on phrase for faster lookups
        await executeQuery('CREATE INDEX IF NOT EXISTS idx_user_phrases_phrase ON user_phrases(phrase)');

        // Create index on mastery_level for filtering
        await executeQuery('CREATE INDEX IF NOT EXISTS idx_user_phrases_mastery ON user_phrases(mastery_level)');

        // Add video clip columns (for YouTube reference)
        try {
            await executeQuery('ALTER TABLE user_phrases ADD COLUMN video_id TEXT');
        } catch { /* column might already exist */ }

        try {
            await executeQuery('ALTER TABLE user_phrases ADD COLUMN video_timestamp INTEGER');
        } catch { /* column might already exist */ }

        try {
            await executeQuery('ALTER TABLE user_phrases ADD COLUMN video_text TEXT');
        } catch { /* column might already exist */ }

        // Add review sentence columns (word + idiom learning)
        try {
            await executeQuery('ALTER TABLE user_phrases ADD COLUMN review_sentence TEXT');
        } catch { /* column might already exist */ }

        try {
            await executeQuery('ALTER TABLE user_phrases ADD COLUMN review_idiom TEXT');
        } catch { /* column might already exist */ }

        try {
            await executeQuery('ALTER TABLE user_phrases ADD COLUMN review_idiom_meaning TEXT');
        } catch { /* column might already exist */ }

        try {
            await executeQuery('ALTER TABLE user_phrases ADD COLUMN review_sentence_ja TEXT');
        } catch { /* column might already exist */ }

        return NextResponse.json({
            message: 'user_phrases table initialized successfully (with review sentence columns)',
            success: true,
        });
    } catch (error) {
        console.error('Error initializing user_phrases table:', error);
        return NextResponse.json({
            error: 'Failed to initialize table',
            message: error instanceof Error ? error.message : 'Unknown error',
            success: false,
        }, { status: 500 });
    }
}
