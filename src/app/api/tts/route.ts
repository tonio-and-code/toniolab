import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { text, voice = 'en-US-Neural2-J' } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Google Cloud TTSのAPIキーが設定されているか確認
        const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;

        if (!apiKey) {
            // APIキーがない場合はブラウザのTTSを使うようフォールバック
            return NextResponse.json({
                error: 'TTS API not configured',
                fallback: true
            }, { status: 503 });
        }

        // Google Cloud Text-to-Speech API呼び出し
        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode: 'en-US',
                        name: voice,
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate: 0.9,
                        pitch: 0,
                    },
                }),
            }
        );

        if (!response.ok) {
            throw new Error('TTS API request failed');
        }

        const data = await response.json();

        // Base64エンコードされた音声データを返す
        return NextResponse.json({
            audioContent: data.audioContent
        });

    } catch (error) {
        console.error('TTS Error:', error);
        return NextResponse.json({
            error: 'Failed to generate speech',
            fallback: true
        }, { status: 500 });
    }
}
