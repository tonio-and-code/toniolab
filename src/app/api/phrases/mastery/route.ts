import { NextResponse } from 'next/server';
import { getAllMastery, getAllMasteryWithDates, setMastery } from '@/lib/d1';

// GET: 全てのマスター状態を取得 (with last_leveled_at dates)
export async function GET() {
    try {
        // Try with dates first; fall back to basic mastery if column doesn't exist yet
        try {
            const { mastery, lastLeveled, cardPoints, cardNames } = await getAllMasteryWithDates();
            return NextResponse.json({ mastery, lastLeveled, cardPoints, cardNames, success: true });
        } catch {
            const mastery = await getAllMastery();
            return NextResponse.json({ mastery, lastLeveled: {}, cardPoints: {}, cardNames: {}, success: true });
        }
    } catch (error) {
        console.error('Error fetching mastery:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mastery', mastery: {}, lastLeveled: {}, success: false },
            { status: 500 }
        );
    }
}

// POST: マスター状態を更新 (with same-day gate)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phraseId, level, today } = body;

        if (!phraseId || level === undefined) {
            return NextResponse.json(
                { error: 'Missing phraseId or level', success: false },
                { status: 400 }
            );
        }

        if (level < 0 || level > 6 || (level > 3 && level < 6)) {
            return NextResponse.json(
                { error: 'Invalid level (must be 0-3 or 6)', success: false },
                { status: 400 }
            );
        }

        // Server-side same-day gate: reject level-ups if already leveled today
        if (today && level > 0) {
            const { lastLeveled } = await getAllMasteryWithDates();
            if (lastLeveled[phraseId] === today) {
                return NextResponse.json(
                    { error: 'Already leveled up today', success: false },
                    { status: 409 }
                );
            }
        }

        await setMastery(phraseId, level, level > 0 ? today : undefined);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error setting mastery:', error);
        return NextResponse.json(
            { error: 'Failed to set mastery', success: false },
            { status: 500 }
        );
    }
}
