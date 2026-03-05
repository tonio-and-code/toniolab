import { NextResponse } from 'next/server';
import { getPlayerStats, initPlayerStatsTable } from '@/lib/d1';

// GET: player stats (total_xp, total_touches)
export async function GET() {
    try {
        const stats = await getPlayerStats();
        return NextResponse.json({ ...stats, success: true });
    } catch {
        // Table might not exist yet - init and retry
        try {
            await initPlayerStatsTable();
            const stats = await getPlayerStats();
            return NextResponse.json({ ...stats, success: true });
        } catch (error) {
            console.error('Error fetching player stats:', error);
            return NextResponse.json({ total_xp: 0, total_touches: 0, success: false }, { status: 500 });
        }
    }
}
