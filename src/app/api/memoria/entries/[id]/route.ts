import { NextResponse } from 'next/server';
import { MemoriaServerStorage } from '@/lib/server/memoria';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        MemoriaServerStorage.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
    }
}
