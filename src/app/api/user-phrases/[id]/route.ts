import { NextResponse } from 'next/server';
import { deleteUserPhrase, updateUserPhraseMastery, incrementPhraseUsage, updateUserPhrase } from '@/lib/d1';

// DELETE: Remove phrase from collection
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteUserPhrase(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting phrase:', error);
        return NextResponse.json(
            { error: 'Failed to delete phrase', success: false },
            { status: 500 }
        );
    }
}

// PATCH: Update mastery level, increment usage, or save video clip
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { mastery_level, increment_usage, video_id, video_timestamp, video_text, review_sentence, review_idiom, review_idiom_meaning, review_sentence_ja } = body;

        if (mastery_level !== undefined) {
            await updateUserPhraseMastery(id, mastery_level);
        }

        if (increment_usage) {
            await incrementPhraseUsage(id);
        }

        // Save video clip info
        if (video_id !== undefined) {
            const { updateUserPhraseVideo } = await import('@/lib/d1');
            await updateUserPhraseVideo(id, video_id, video_timestamp, video_text);
        }

        // Save review sentence with idiom
        if (review_sentence !== undefined) {
            const { updateUserPhraseReview } = await import('@/lib/d1');
            await updateUserPhraseReview(id, review_sentence, review_idiom, review_idiom_meaning, review_sentence_ja);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating phrase:', error);
        return NextResponse.json(
            { error: 'Failed to update phrase', success: false },
            { status: 500 }
        );
    }
}

// PUT: Update phrase content
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { phrase, type, meaning, note, example } = body;

        await updateUserPhrase(id, { phrase, type, meaning, note, example });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating phrase:', error);
        return NextResponse.json(
            { error: 'Failed to update phrase', success: false },
            { status: 500 }
        );
    }
}
