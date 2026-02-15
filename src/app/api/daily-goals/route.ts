import { NextResponse } from 'next/server';
import { getDailyGoals, setDailyGoals, initDailyGoalsTable } from '@/lib/d1';

let tableInitialized = false;

async function ensureTable() {
    if (!tableInitialized) {
        try {
            await initDailyGoalsTable();
            tableInitialized = true;
        } catch (e) {
            console.log('Daily goals table init:', e);
            tableInitialized = true;
        }
    }
}

export async function GET() {
    try {
        await ensureTable();
        const goals = await getDailyGoals();
        return NextResponse.json({ goals, success: true });
    } catch (error) {
        console.error('Error fetching daily goals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch daily goals', success: false },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await ensureTable();
        const body = await request.json();
        const { minutes_goal, phrases_goal, vocab_goal } = body;

        const goals = await setDailyGoals({
            minutes_goal: minutes_goal !== undefined ? parseInt(minutes_goal) : undefined,
            phrases_goal: phrases_goal !== undefined ? parseInt(phrases_goal) : undefined,
            vocab_goal: vocab_goal !== undefined ? parseInt(vocab_goal) : undefined,
        });

        return NextResponse.json({ goals, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error saving daily goals:', error);
        return NextResponse.json(
            { error: 'Failed to save daily goals', success: false },
            { status: 500 }
        );
    }
}
