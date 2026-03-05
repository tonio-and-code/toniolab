import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        if (!openai) {
            // Demo fallback
            return NextResponse.json({
                phrases: [
                    { phrase: 'tucked away', type: 'phrasal verb', meaning: '隠れた場所にある、人目につかない', context: 'Found in the input text' },
                    { phrase: 'hit different', type: 'slang', meaning: '特別に感じる、いつもと違う', context: 'Modern casual expression' },
                ],
                mode: 'demo'
            });
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are an English language expert. Analyze the given text and extract:
1. Phrasal verbs (e.g., "put off", "get along", "tucked away")
2. Idioms (e.g., "hit the road", "break the ice")
3. Slang expressions (e.g., "hit different", "no cap", "low-key")
4. Collocations that non-native speakers might not know

For each phrase found, provide:
- The exact phrase as it appears
- Type (phrasal verb, idiom, slang, collocation)
- Japanese meaning/explanation
- Why it's notable for learners

Return ONLY valid JSON array, no markdown, no explanation outside JSON:
[
  {
    "phrase": "tucked away",
    "type": "phrasal verb",
    "meaning": "隠れた場所にある、人目につかない所に位置する",
    "note": "カジュアルな表現で、隠れ家的なカフェやレストランの説明によく使われる"
  }
]

If no notable phrases found, return empty array: []`
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.3,
            max_tokens: 1000,
        });

        const content = completion.choices[0]?.message?.content || '[]';

        // Parse JSON response
        let phrases = [];
        try {
            // Remove markdown code blocks if present
            const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            phrases = JSON.parse(cleaned);
        } catch (e) {
            console.error('Failed to parse AI response:', content);
            phrases = [];
        }

        return NextResponse.json({
            phrases,
            mode: 'ai'
        });

    } catch (error: unknown) {
        console.error('Phrase extraction error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Extraction failed', message }, { status: 500 });
    }
}
