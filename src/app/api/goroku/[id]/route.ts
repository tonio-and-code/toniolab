import { NextResponse } from 'next/server';
import { updateGoroku, deleteGoroku } from '@/lib/d1';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { japanese, english, literal, context, category, mastery_level } = body;

        await updateGoroku(id, { japanese, english, literal, context, category, mastery_level });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating goroku:', error);
        return NextResponse.json(
            { error: 'Failed to update goroku', success: false },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteGoroku(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting goroku:', error);
        return NextResponse.json(
            { error: 'Failed to delete goroku', success: false },
            { status: 500 }
        );
    }
}
