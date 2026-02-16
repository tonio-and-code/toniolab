import { NextRequest, NextResponse } from 'next/server';
import { addVoiceRecording, getAllVoiceRecordings, deleteVoiceRecording, getVoiceRecordings } from '@/lib/d1';

// R2 configuration using Cloudflare API
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '7efac1047fba804c1b7ea5a10868dbfc';
const R2_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const R2_BUCKET = process.env.R2_BUCKET || 'podcast-audio';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-628af24ae7da43ac93bbfb202b34b73e.r2.dev';

// Upload to R2 using Cloudflare API
async function uploadToR2(key: string, buffer: ArrayBuffer, contentType: string): Promise<void> {
    if (!R2_API_TOKEN) {
        throw new Error('CLOUDFLARE_API_TOKEN is not configured');
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${encodeURIComponent(key)}`;
    console.log('Uploading to R2:', url);

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${R2_API_TOKEN}`,
            'Content-Type': contentType,
        },
        body: buffer,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('R2 upload error:', response.status, errorText);
        throw new Error(`R2 upload failed: ${response.status} ${errorText}`);
    }
    console.log('R2 upload success');
}

// Delete from R2 using Cloudflare API
async function deleteFromR2(key: string): Promise<void> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${encodeURIComponent(key)}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${R2_API_TOKEN}`,
        },
    });

    if (!response.ok && response.status !== 404) {
        const errorText = await response.text();
        throw new Error(`R2 delete failed: ${response.status} ${errorText}`);
    }
}

// POST: Upload a voice recording (1 recording per phrase - overwrites existing)
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;
        const phraseId = formData.get('phraseId') as string;

        if (!audioFile || !phraseId) {
            return NextResponse.json(
                { error: 'Missing audio file or phraseId', success: false },
                { status: 400 }
            );
        }

        // Delete existing recordings for this phrase first (1 recording per phrase)
        const existingRecordings = await getVoiceRecordings(phraseId);
        for (const existing of existingRecordings) {
            try {
                const key = existing.url.replace(`${R2_PUBLIC_URL}/`, '');
                await deleteFromR2(key);
                await deleteVoiceRecording(existing.id);
            } catch (e) {
                console.error('Error deleting old recording:', e);
            }
        }

        // Convert File to ArrayBuffer
        const buffer = await audioFile.arrayBuffer();

        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `voice-recordings/${phraseId}/${timestamp}.webm`;

        // Upload to R2 using Cloudflare API
        await uploadToR2(fileName, buffer, 'audio/webm');

        const publicUrl = `${R2_PUBLIC_URL}/${fileName}`;

        // Save to D1 database
        const recording = await addVoiceRecording(phraseId, publicUrl);

        return NextResponse.json({
            success: true,
            url: publicUrl,
            phraseId,
            timestamp,
            recording,
        });
    } catch (error) {
        console.error('Error uploading voice recording:', error);
        return NextResponse.json(
            { error: 'Failed to upload recording', success: false },
            { status: 500 }
        );
    }
}

// GET: Fetch voice recordings
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const phraseId = searchParams.get('phraseId');

        if (phraseId) {
            // Get recordings for a specific phrase
            const recordings = await getVoiceRecordings(phraseId);
            return NextResponse.json({ success: true, recordings });
        } else {
            // Get all recordings grouped by phrase
            const recordings = await getAllVoiceRecordings();
            return NextResponse.json({ success: true, recordings });
        }
    } catch (error) {
        console.error('Error fetching voice recordings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recordings', success: false },
            { status: 500 }
        );
    }
}

// DELETE: Remove a voice recording
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const url = searchParams.get('url');

        if (!id || !url) {
            return NextResponse.json(
                { error: 'Missing id or url parameter', success: false },
                { status: 400 }
            );
        }

        // Delete from R2 using Cloudflare API
        const key = url.replace(`${R2_PUBLIC_URL}/`, '');
        try {
            await deleteFromR2(key);
        } catch (r2Error) {
            console.error('R2 delete error (continuing):', r2Error);
        }

        // Delete from D1
        await deleteVoiceRecording(parseInt(id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting voice recording:', error);
        return NextResponse.json(
            { error: 'Failed to delete recording', success: false },
            { status: 500 }
        );
    }
}
