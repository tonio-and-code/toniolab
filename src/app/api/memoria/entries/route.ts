import { NextResponse } from 'next/server';
import { MemoriaServerStorage } from '@/lib/server/memoria';

export async function GET() {
    try {
        const entries = MemoriaServerStorage.getAll();
        return NextResponse.json(entries);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const entry = await request.json();
        MemoriaServerStorage.save(entry);
        return NextResponse.json({ success: true, entry });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
    }
}
