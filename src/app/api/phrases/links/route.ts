import { NextResponse } from 'next/server';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '7efac1047fba804c1b7ea5a10868dbfc';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = 'f4801cde-0f1d-4bc9-beec-5d8709813798';

interface D1Response {
    result: { results: Record<string, unknown>[]; success: boolean }[];
    success: boolean;
    errors: { message: string }[];
}

async function executeQuery(sql: string, params: (string | null)[] = []) {
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
        }
    );
    const data: D1Response = await response.json();
    if (!data.success) throw new Error(data.errors.map(e => e.message).join(', '));
    return data.result[0];
}

// GET: all phrase_links
export async function GET() {
    try {
        const result = await executeQuery('SELECT * FROM phrase_links ORDER BY created_at ASC');
        return NextResponse.json({ links: result.results, success: true });
    } catch (error) {
        console.error('Error fetching phrase_links:', error);
        return NextResponse.json({ error: 'Failed to fetch', success: false }, { status: 500 });
    }
}

// POST: add a link
export async function POST(request: Request) {
    try {
        const { phrase_id, text } = await request.json();
        if (!phrase_id || !text?.trim()) {
            return NextResponse.json({ error: 'Missing phrase_id or text', success: false }, { status: 400 });
        }
        const now = new Date().toISOString();
        await executeQuery(
            'INSERT INTO phrase_links (phrase_id, text, created_at) VALUES (?, ?, ?)',
            [phrase_id, text.trim(), now]
        );
        return NextResponse.json({ link: { phrase_id, text: text.trim(), created_at: now }, success: true }, { status: 201 });
    } catch (error) {
        console.error('Error adding phrase_link:', error);
        return NextResponse.json({ error: 'Failed to add', success: false }, { status: 500 });
    }
}
