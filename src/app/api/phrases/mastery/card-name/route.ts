import { NextResponse } from 'next/server';
import { setCardName } from '@/lib/d1';

export const runtime = 'edge';

// PATCH: Set or clear a card's nickname
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { phraseId, name } = body;

        if (!phraseId) {
            return NextResponse.json(
                { error: 'Missing phraseId', success: false },
                { status: 400 }
            );
        }

        if (name && typeof name === 'string' && name.length > 16) {
            return NextResponse.json(
                { error: 'Name too long (max 16)', success: false },
                { status: 400 }
            );
        }

        await setCardName(phraseId, name?.trim() || null);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error setting card name:', error);
        return NextResponse.json(
            { error: 'Failed to set card name', success: false },
            { status: 500 }
        );
    }
}
