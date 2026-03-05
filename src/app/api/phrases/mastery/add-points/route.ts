import { NextResponse } from 'next/server';
import { addCardPoints } from '@/lib/d1';

export const runtime = 'edge';

// POST: Add bonus card_points (battle rewards, fever mode)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phraseId, points } = body;

        if (!phraseId || !points || points < 0 || points > 100) {
            return NextResponse.json(
                { error: 'Invalid phraseId or points', success: false },
                { status: 400 }
            );
        }

        const newTotal = await addCardPoints(phraseId, points);
        return NextResponse.json({ success: true, newTotal });
    } catch (error) {
        console.error('Error adding card points:', error);
        return NextResponse.json(
            { error: 'Failed to add points', success: false },
            { status: 500 }
        );
    }
}
