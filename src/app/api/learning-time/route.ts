import { NextResponse } from 'next/server';
import {
    getLearningTimeByDate,
    getAllLearningTime,
    addLearningTime,
    setLearningTime,
    getLearningTimeStats,
    initLearningTimeTable
} from '@/lib/d1';

let tableInitialized = false;

async function ensureTable() {
    if (!tableInitialized) {
        try {
            await initLearningTimeTable();
            tableInitialized = true;
        } catch (e) {
            // Table might already exist, that's fine
            console.log('Table init:', e);
            tableInitialized = true;
        }
    }
}

export async function GET(request: Request) {
    try {
        await ensureTable();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const stats = searchParams.get('stats');

        if (stats === 'true') {
            const statsData = await getLearningTimeStats();
            return NextResponse.json({ stats: statsData, success: true });
        }

        if (date) {
            const record = await getLearningTimeByDate(date);
            return NextResponse.json({ record, success: true });
        }

        const records = await getAllLearningTime();
        return NextResponse.json({ records, success: true });
    } catch (error) {
        console.error('Error fetching learning time:', error);
        return NextResponse.json(
            { error: 'Failed to fetch learning time', success: false },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await ensureTable();
        const body = await request.json();
        const { date, minutes, mode } = body;

        if (!date || minutes === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: date, minutes', success: false },
                { status: 400 }
            );
        }

        // mode: 'add' (default) adds to existing, 'set' replaces
        const record = mode === 'set'
            ? await setLearningTime(date, parseInt(minutes))
            : await addLearningTime(date, parseInt(minutes));

        // Get updated stats
        const stats = await getLearningTimeStats();

        return NextResponse.json({ record, stats, success: true }, { status: 201 });
    } catch (error) {
        console.error('Error saving learning time:', error);
        return NextResponse.json(
            { error: 'Failed to save learning time', success: false },
            { status: 500 }
        );
    }
}
