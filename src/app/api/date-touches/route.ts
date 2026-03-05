import { NextResponse } from 'next/server';
import { initDateTouchesTable, incrementDateTouch, getMonthlyDateTouches } from '@/lib/d1';

// GET: ?month=2026-02 → { "2026-02-01": 5, "2026-02-19": 3 }
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        if (!month) {
            return NextResponse.json({ error: 'month param required' }, { status: 400 });
        }
        const touches = await getMonthlyDateTouches(month);
        return NextResponse.json({ touches, success: true });
    } catch (error) {
        console.error('Error fetching date touches:', error);
        return NextResponse.json({ touches: {}, success: false }, { status: 500 });
    }
}

// POST: { phrase_date: "2026-02-01" } → increment +1, return new count
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const phraseDate = body.phrase_date;
        if (!phraseDate) {
            return NextResponse.json({ error: 'phrase_date required' }, { status: 400 });
        }
        try {
            const count = await incrementDateTouch(phraseDate);
            return NextResponse.json({ phrase_date: phraseDate, count, success: true });
        } catch {
            // Table might not exist yet
            await initDateTouchesTable();
            const count = await incrementDateTouch(phraseDate);
            return NextResponse.json({ phrase_date: phraseDate, count, success: true });
        }
    } catch (error) {
        console.error('Error incrementing date touch:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
