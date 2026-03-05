import { NextResponse } from 'next/server';
import { initGorokuTable, addGoroku } from '@/lib/d1';
import { GOROKU_SEEDS } from '@/data/english/goroku-seed';

export async function POST() {
    try {
        await initGorokuTable();

        let seeded = 0;
        for (let i = 0; i < GOROKU_SEEDS.length; i++) {
            const s = GOROKU_SEEDS[i];
            const idx = i % 10;
            const id = `d${String(s.daySlot).padStart(2, '0')}_${idx}`;

            await addGoroku({
                id,
                day_slot: s.daySlot,
                japanese: s.japanese,
                english: s.english,
                literal: s.literal,
                context: s.context,
                category: s.category,
                slot: s.slot,
                slotHints: s.slotHints,
            });
            seeded++;
        }

        return NextResponse.json({
            message: `Goroku table initialized with ${seeded} expressions across 31 days`,
            count: seeded,
            success: true,
        });
    } catch (error) {
        console.error('Error initializing goroku:', error);
        return NextResponse.json({
            error: 'Failed to initialize goroku table',
            message: error instanceof Error ? error.message : 'Unknown error',
            success: false,
        }, { status: 500 });
    }
}
