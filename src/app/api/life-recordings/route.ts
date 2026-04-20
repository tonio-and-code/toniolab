import { NextResponse } from 'next/server';

const CLOUDFLARE_ACCOUNT_ID = '7efac1047fba804c1b7ea5a10868dbfc';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = 'f4801cde-0f1d-4bc9-beec-5d8709813798';

interface LifeRecording {
    id: string;
    japanese: string;
    english_short: string | null;
    english_attitude: string | null;
    english_full: string | null;
    english_monologue: string | null;
    context: string | null;
    literal: string | null;
    category: string | null;
    status: string;
    created_at: string;
    converted_at: string | null;
    member_slug: string | null;
    member_name: string | null;
    is_public: number | null;
}

async function queryD1<T = unknown>(sql: string, params: (string | number | null)[] = []): Promise<{ results: T[] }> {
    if (!CLOUDFLARE_API_TOKEN) throw new Error('No CLOUDFLARE_API_TOKEN');
    const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
        {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ sql, params }),
            cache: 'no-store',
        }
    );
    const data = await res.json();
    if (!data.success) throw new Error(data.errors?.[0]?.message || 'D1 error');
    return data.result[0];
}

function nanoid(len: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < len; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

function jstNowIso(): string {
    const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    return jst.toISOString();
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const pending = url.searchParams.get('pending') === 'true';
        const member = url.searchParams.get('member');
        // Admin view (?all=true) sees everything including private author recordings.
        // Default view hides author's private recordings (is_public=0). Member recordings always visible.
        const all = url.searchParams.get('all') === 'true';
        const where: string[] = [];
        const params: (string | number | null)[] = [];
        if (pending) where.push("status = 'pending'");
        if (member) { where.push('member_slug = ?'); params.push(member); }
        if (!all) where.push('(member_slug IS NOT NULL OR is_public = 1)');
        const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const order = pending ? 'created_at ASC' : 'created_at DESC';
        const result = await queryD1<LifeRecording>(
            `SELECT * FROM life_recordings ${whereClause} ORDER BY ${order}`,
            params
        );
        return NextResponse.json({ success: true, recordings: result.results });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { japanese, member_slug, member_name } = body;
        if (!japanese?.trim()) {
            return NextResponse.json({ success: false, error: 'japanese is required' }, { status: 400 });
        }
        const id = nanoid(10);
        const now = jstNowIso();
        await queryD1(
            'INSERT INTO life_recordings (id, japanese, status, created_at, member_slug, member_name) VALUES (?, ?, ?, ?, ?, ?)',
            [id, japanese.trim(), 'pending', now, member_slug || null, member_name || null]
        );
        const recording: LifeRecording = {
            id, japanese: japanese.trim(),
            english_short: null, english_attitude: null, english_full: null, english_monologue: null,
            context: null, literal: null, category: null,
            status: 'pending', created_at: now, converted_at: null,
            member_slug: member_slug || null, member_name: member_name || null,
            is_public: 0,
        };
        return NextResponse.json({ success: true, recording }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, english_short, english_attitude, english_full, english_monologue, context } = body;
        if (!id || !english_attitude || !context) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }
        const now = jstNowIso();
        await queryD1(
            `UPDATE life_recordings SET
                english_short = ?, english_attitude = ?, english_full = ?, english_monologue = ?,
                context = ?, literal = ?, category = ?, status = 'converted', converted_at = ?
             WHERE id = ?`,
            [
                english_short || '', english_attitude, english_full || '', english_monologue || '',
                context, body.literal || null, body.category || null, now, id,
            ]
        );
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        if (!body.id) {
            return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
        }
        await queryD1('DELETE FROM life_recordings WHERE id = ?', [body.id]);
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
