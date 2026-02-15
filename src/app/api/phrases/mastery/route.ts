import { NextResponse } from 'next/server';
import { getAllMastery, setMastery } from '@/lib/d1';

// GET: 全てのマスター状態を取得
export async function GET() {
    try {
        const mastery = await getAllMastery();
        return NextResponse.json({ mastery, success: true });
    } catch (error) {
        console.error('Error fetching mastery:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mastery', mastery: {}, success: false },
            { status: 500 }
        );
    }
}

// POST: マスター状態を更新
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phraseId, level } = body;

        if (!phraseId || level === undefined) {
            return NextResponse.json(
                { error: 'Missing phraseId or level', success: false },
                { status: 400 }
            );
        }

        if (level < 0 || level > 3) {
            return NextResponse.json(
                { error: 'Invalid level (must be 0, 1, 2, or 3)', success: false },
                { status: 400 }
            );
        }

        await setMastery(phraseId, level);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error setting mastery:', error);
        return NextResponse.json(
            { error: 'Failed to set mastery', success: false },
            { status: 500 }
        );
    }
}
