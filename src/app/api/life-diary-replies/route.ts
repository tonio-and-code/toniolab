import { NextResponse } from 'next/server';

const CLOUDFLARE_ACCOUNT_ID = '7efac1047fba804c1b7ea5a10868dbfc';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = 'f4801cde-0f1d-4bc9-beec-5d8709813798';

interface LifeDiaryReply {
    id: number;
    diary_date: string;
    content: string;
    member_slug: string | null;
    member_name: string | null;
    created_at: string;
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

function jstNowIso(): string {
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return jst.toISOString().replace('Z', '+09:00');
}

// GET /api/life-diary-replies?date=YYYY-MM-DD
// GET /api/life-diary-replies?counts=true
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);

        if (url.searchParams.get('counts') === 'true') {
            const result = await queryD1<{ diary_date: string; n: number }>(
                'SELECT diary_date, COUNT(*) as n FROM life_diary_replies GROUP BY diary_date'
            );
            const counts: Record<string, number> = {};
            result.results.forEach(r => { counts[r.diary_date] = r.n; });
            return NextResponse.json({ success: true, counts });
        }

        const date = url.searchParams.get('date');
        if (!date) {
            return NextResponse.json({ success: false, error: 'date required' }, { status: 400 });
        }
        const result = await queryD1<LifeDiaryReply>(
            'SELECT * FROM life_diary_replies WHERE diary_date = ? ORDER BY created_at ASC',
            [date]
        );
        return NextResponse.json({ success: true, replies: result.results });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}

// POST /api/life-diary-replies
// body: { date, content, member_slug?, member_name? }
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, content, member_slug, member_name } = body;
        if (!date || !content || !String(content).trim()) {
            return NextResponse.json({ success: false, error: 'date and content required' }, { status: 400 });
        }
        const now = jstNowIso();
        const result = await queryD1<{ id: number }>(
            'INSERT INTO life_diary_replies (diary_date, content, member_slug, member_name, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id',
            [date, String(content).trim(), member_slug || null, member_name || null, now]
        );
        const id = result.results[0]?.id ?? 0;
        return NextResponse.json({
            success: true,
            reply: {
                id,
                diary_date: date,
                content: String(content).trim(),
                member_slug: member_slug || null,
                member_name: member_name || null,
                created_at: now,
            },
        });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}

// DELETE /api/life-diary-replies
// body: { id, member_slug? }  (null slug = admin, can delete any)
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { id, member_slug } = body;
        if (!id) {
            return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
        }
        if (member_slug) {
            await queryD1('DELETE FROM life_diary_replies WHERE id = ? AND member_slug = ?', [Number(id), member_slug]);
        } else {
            await queryD1('DELETE FROM life_diary_replies WHERE id = ?', [Number(id)]);
        }
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
