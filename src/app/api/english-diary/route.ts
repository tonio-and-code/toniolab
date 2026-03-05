import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export async function POST(request: NextRequest) {
    try {
        const { imageUrl, mood } = await request.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
        }

        if (!openai) {
            return NextResponse.json({ error: 'OpenAI API not configured' }, { status: 500 });
        }

        const moodPrompt = mood ? `The mood/vibe is: ${mood}. ` : '';

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are a casual, relatable person writing Instagram-style diary entries in English.

Your job:
1. Look at the image
2. Write a short, casual English diary entry (2-4 sentences) as if posting to Instagram
3. Keep it natural, not try-hard
4. Use simple, everyday English that sounds native
5. Can include light emotions, observations, or thoughts
6. NO hashtags, NO emojis

Style examples:
- "Finally tried that new ramen place everyone's been talking about. The broth was insanely rich. Might become a regular."
- "Sunday morning vibes. Nothing beats coffee and a good book when it's raining outside."
- "Work was brutal today but managed to squeeze in a quick workout. Small wins."

Be genuine, not cringe. Write like a real person, not a textbook.`
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `${moodPrompt}Write a casual English diary entry for this image. Then provide a natural Japanese translation.

Format your response EXACTLY like this:
ENGLISH:
[your English diary entry here]

JAPANESE:
[Japanese translation here]`
                        },
                        {
                            type: 'image_url',
                            image_url: { url: imageUrl }
                        }
                    ]
                }
            ],
            max_tokens: 500,
            temperature: 0.8,
        });

        const content = completion.choices[0]?.message?.content || '';

        // Parse the response
        const englishMatch = content.match(/ENGLISH:\s*([\s\S]*?)(?=JAPANESE:|$)/i);
        const japaneseMatch = content.match(/JAPANESE:\s*([\s\S]*?)$/i);

        const english = englishMatch ? englishMatch[1].trim() : content;
        const japanese = japaneseMatch ? japaneseMatch[1].trim() : '';

        return NextResponse.json({
            english,
            japanese,
            raw: content
        });

    } catch (error: unknown) {
        console.error('English diary generation error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Generation failed', message }, { status: 500 });
    }
}
