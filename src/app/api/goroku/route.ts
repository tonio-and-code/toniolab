import { NextResponse } from 'next/server';
import { getAllGoroku, getGorokuByDaySlot, addGoroku, getGorokuDaySlotCounts } from '@/lib/d1';
import { nanoid } from 'nanoid';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const daySlot = searchParams.get('day_slot');
    const stats = searchParams.get('stats');

    try {
        if (stats === 'true') {
            const counts = await getGorokuDaySlotCounts();
            return NextResponse.json({ counts, success: true });
        }

        if (daySlot) {
            const entries = await getGorokuByDaySlot(parseInt(daySlot, 10));
            return NextResponse.json({ entries, success: true });
        }

        const entries = await getAllGoroku();
        return NextResponse.json({ entries, success: true });
    } catch (error) {
        console.error('Error fetching goroku:', error);
        return NextResponse.json(
            { error: 'Failed to fetch goroku', success: false },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { day_slot, japanese, english, literal, context, category } = body;
        // english can be string[] (4-level) or string (legacy single)

        if (!japanese || !english || !context || !category || !day_slot) {
            return NextResponse.json(
                { error: 'Missing required fields', success: false },
                { status: 400 }
            );
        }

        if (day_slot < 1 || day_slot > 31) {
            return NextResponse.json(
                { error: 'day_slot must be 1-31', success: false },
                { status: 400 }
            );
        }

        // Check slot capacity (max 10)
        const existing = await getGorokuByDaySlot(day_slot);
        if (existing.length >= 10) {
            return NextResponse.json(
                { error: `Day ${day_slot} is full (10/10)`, success: false },
                { status: 409 }
            );
        }

        const prefixMap: Record<string, string> = {
            reaction: 'r', request: 'q', opinion: 'o',
            suggestion: 's', filler: 'f', shutdown: 'x',
        };
        const prefix = prefixMap[category] || 'g';
        const id = `${prefix}${nanoid(6)}`;

        const entry = await addGoroku({
            id, day_slot, japanese, english, literal, context, category,
        });

        return NextResponse.json({ entry, success: true }, { status: 201 });
    } catch (error) {
        console.error('Error adding goroku:', error);
        return NextResponse.json(
            { error: 'Failed to add goroku', success: false },
            { status: 500 }
        );
    }
}
