import { NextResponse } from 'next/server';
import { getAllUserPhrases, addUserPhrase, getUserPhraseByPhrase, getUserPhraseStats } from '@/lib/d1';
import { nanoid } from 'nanoid';

// GET: Get all user phrases or stats
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get('stats');

    try {
        if (stats === 'true') {
            const phraseStats = await getUserPhraseStats();
            return NextResponse.json({ stats: phraseStats, success: true });
        }

        const phrases = await getAllUserPhrases();
        return NextResponse.json({ phrases, success: true });
    } catch (error) {
        console.error('Error fetching user phrases:', error);
        return NextResponse.json(
            { error: 'Failed to fetch phrases', success: false },
            { status: 500 }
        );
    }
}

// POST: Add a new phrase to collection
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phrase, type, meaning, note, example, source, video_id, video_timestamp, video_text, date } = body;

        if (!phrase || !type || !meaning) {
            return NextResponse.json(
                { error: 'Missing required fields (phrase, type, meaning)', success: false },
                { status: 400 }
            );
        }

        // Check if phrase already exists
        const existing = await getUserPhraseByPhrase(phrase);
        if (existing) {
            return NextResponse.json(
                { error: 'Phrase already in collection', existing, success: false },
                { status: 409 }
            );
        }

        const newPhrase = await addUserPhrase({
            id: nanoid(8),
            phrase,
            type,
            meaning,
            note,
            example,
            source,
            video_id,
            video_timestamp,
            video_text,
            date,
        });

        return NextResponse.json({ phrase: newPhrase, success: true }, { status: 201 });
    } catch (error) {
        console.error('Error adding user phrase:', error);
        return NextResponse.json(
            { error: 'Failed to add phrase', success: false },
            { status: 500 }
        );
    }
}
