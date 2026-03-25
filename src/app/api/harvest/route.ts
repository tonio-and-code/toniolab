import { NextResponse } from 'next/server';
import { runHarvest } from '@/lib/harvester';

export const maxDuration = 60;

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '7efac1047fba804c1b7ea5a10868dbfc';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = 'f4801cde-0f1d-4bc9-beec-5d8709813798';

interface HarvestedExpression {
    id: string;
    expression: string;
    score: number;
    source_type: string;
    source_title: string | null;
    source_url: string | null;
    context: string | null;
    note: string | null;
    harvest_date: string | null;
    status: string;
    created_at: string;
}

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

// JST date string (YYYY-MM-DD)
function jstDateString(): string {
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return jst.toISOString().slice(0, 10);
}

// GET: List harvested expressions
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const date = searchParams.get('date'); // filter by harvest_date
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        // Build query
        let countSql = 'SELECT COUNT(*) as total FROM harvested_expressions';
        let listSql = 'SELECT * FROM harvested_expressions';
        const conditions: string[] = [];
        const countParams: (string | number | null)[] = [];
        const listParams: (string | number | null)[] = [];

        if (status) {
            conditions.push(`status = ?${conditions.length + 1}`);
            countParams.push(status);
            listParams.push(status);
        }
        if (date) {
            conditions.push(`harvest_date = ?${conditions.length + 1}`);
            countParams.push(date);
            listParams.push(date);
        }

        if (conditions.length > 0) {
            const where = ' WHERE ' + conditions.join(' AND ');
            countSql += where;
            listSql += where;
        }

        listSql += ` ORDER BY score DESC, created_at DESC LIMIT ?${listParams.length + 1} OFFSET ?${listParams.length + 2}`;
        listParams.push(limit, offset);

        const countResult = await executeQuery<{ total: number }>(countSql, countParams);
        const listResult = await executeQuery<HarvestedExpression>(listSql, listParams);

        return NextResponse.json({
            expressions: listResult.results,
            total: countResult.results[0]?.total ?? 0,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching harvested expressions:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch expressions', success: false },
            { status: 500 }
        );
    }
}

// POST: Trigger a harvest run
export async function POST() {
    try {
        const existingHarvested = await executeQuery<{ expression: string }>(
            'SELECT expression FROM harvested_expressions'
        );
        const existingPhrases = await executeQuery<{ phrase: string }>(
            'SELECT phrase FROM user_phrases'
        );

        const existingSet = new Set<string>();
        for (const row of existingHarvested.results) existingSet.add(row.expression.toLowerCase());
        for (const row of existingPhrases.results) existingSet.add(row.phrase.toLowerCase());

        const harvestResults = await runHarvest(existingSet);
        const timestamp = Date.now();
        const today = jstDateString();
        const inserted: HarvestedExpression[] = [];

        for (let i = 0; i < harvestResults.length; i++) {
            const result = harvestResults[i];
            const id = `h_${timestamp}_${i}`;
            const createdAt = new Date().toISOString();

            await executeQuery(
                `INSERT OR IGNORE INTO harvested_expressions (id, expression, score, source_type, source_title, source_url, context, note, harvest_date, status, created_at)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`,
                [
                    id,
                    result.expression,
                    result.score,
                    result.source_type,
                    result.source_title ?? null,
                    result.source_url ?? null,
                    result.context ?? null,
                    null,
                    today,
                    'new',
                    createdAt,
                ]
            );

            inserted.push({
                id, expression: result.expression, score: result.score,
                source_type: result.source_type, source_title: result.source_title ?? null,
                source_url: result.source_url ?? null, context: result.context ?? null,
                note: null, harvest_date: today, status: 'new', created_at: createdAt,
            });
        }

        return NextResponse.json({
            harvested: inserted.length,
            harvest_date: today,
            source: inserted[0]?.source_title || null,
            expressions: inserted,
            success: true,
        });
    } catch (error) {
        console.error('Error running harvest:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Harvest failed', success: false },
            { status: 500 }
        );
    }
}

// PATCH: Update expression (note, status)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, note, status } = body as { id: string; note?: string; status?: string };

        if (!id) {
            return NextResponse.json({ error: 'id is required', success: false }, { status: 400 });
        }

        const updates: string[] = [];
        const params: (string | number | null)[] = [];
        let paramIdx = 1;

        if (note !== undefined) {
            updates.push(`note = ?${paramIdx++}`);
            params.push(note);
        }
        if (status !== undefined) {
            updates.push(`status = ?${paramIdx++}`);
            params.push(status);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'Nothing to update', success: false }, { status: 400 });
        }

        params.push(id);
        await executeQuery(
            `UPDATE harvested_expressions SET ${updates.join(', ')} WHERE id = ?${paramIdx}`,
            params
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Update failed', success: false },
            { status: 500 }
        );
    }
}
