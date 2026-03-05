import { NextResponse } from 'next/server';
import { getReviewCount, incrementReviewCount, getMonthlyReviewCounts, addPlayerXP, rollGachaAndUpdate } from '@/lib/d1';

// GET: review counts + xp
//   ?date=YYYY-MM-DD  → single day { count, xp }
//   ?month=YYYY-MM    → all days in month as { counts: { "2026-02-25": { count: 5, xp: 12 }, ... } }
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        if (month) {
            const counts = await getMonthlyReviewCounts(month);
            return NextResponse.json({ counts, success: true });
        }
        const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
        const data = await getReviewCount(date);
        return NextResponse.json({ ...data, success: true });
    } catch (error) {
        console.error('Error fetching review count:', error);
        return NextResponse.json({ count: 0, xp: 0, success: false }, { status: 500 });
    }
}

// POST: increment today's count + add XP + roll gacha
// Body: { date, xp, phrase_id? }
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const date = body.date || new Date().toISOString().split('T')[0];
        const xp = body.xp || 0;
        const phraseId = body.phrase_id || undefined;
        const fever = body.fever || false;
        const data = await incrementReviewCount(date, xp);

        let totalXP = 0;
        let gacha = null;

        if (xp > 0) {
            try {
                const result = await rollGachaAndUpdate(xp, phraseId, fever);
                totalXP = result.total_xp;
                gacha = {
                    tier: result.tier,
                    sparks_won: result.sparks_won,
                    total_sparks: result.total_sparks,
                    card_points_earned: result.card_points_earned,
                    card_total_points: result.card_total_points,
                };
            } catch {
                // Fallback: if gacha columns don't exist yet
                try {
                    const stats = await addPlayerXP(xp);
                    totalXP = stats.total_xp;
                } catch { /* non-blocking */ }
            }
        }

        return NextResponse.json({ ...data, total_xp: totalXP, gacha, success: true });
    } catch (error) {
        console.error('Error incrementing review count:', error);
        return NextResponse.json({ count: 0, xp: 0, success: false }, { status: 500 });
    }
}
