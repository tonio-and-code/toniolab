import { NextResponse } from 'next/server';
import { getAllMasteryWithDates } from '@/lib/d1';

export const runtime = 'edge';

export async function GET() {
    try {
        const { mastery, cardPoints } = await getAllMasteryWithDates();
        return NextResponse.json({ mastery, cardPoints });
    } catch (error) {
        console.error('Failed to fetch phrase mastery:', error);
        return NextResponse.json({ mastery: {}, cardPoints: {} }, { status: 500 });
    }
}
