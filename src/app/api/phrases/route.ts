import { NextResponse } from 'next/server';
import { getAllPhrases, addPhrase } from '@/lib/d1';
import { nanoid } from 'nanoid';

export async function GET() {
    try {
        const phrases = await getAllPhrases();
        return NextResponse.json({ phrases, success: true });
    } catch (error) {
        console.error('Error fetching phrases:', error);
        return NextResponse.json(
            { error: 'Failed to fetch phrases', success: false },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { english, japanese, category, date } = body;

        if (!english || !category || !date) {
            return NextResponse.json(
                { error: 'Missing required fields', success: false },
                { status: 400 }
            );
        }

        const phrase = await addPhrase({
            id: nanoid(8),
            english,
            japanese: japanese || '',
            category,
            date,
        });

        return NextResponse.json({ phrase, success: true }, { status: 201 });
    } catch (error) {
        console.error('Error adding phrase:', error);
        return NextResponse.json(
            { error: 'Failed to add phrase', success: false },
            { status: 500 }
        );
    }
}
