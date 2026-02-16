/**
 * フレーズ生成API
 * 日本語 → 自然な英語表現を3パターン生成
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GenerateRequest {
    japanese: string;
    context?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: GenerateRequest = await request.json();
        const { japanese, context } = body;

        if (!japanese) {
            return NextResponse.json({ error: 'Japanese text is required' }, { status: 400 });
        }

        const prompt = `あなたは英語ネイティブスピーカーです。以下の日本語表現を、感情が込もった自然な英語に変換してください。

日本語: ${japanese}
${context ? `文脈: ${context}` : ''}

要件:
1. 3つの異なる自然な英語表現を生成
2. 各表現は実際にネイティブが日常会話で使う表現
3. フォーマルすぎない、カジュアルで感情が伝わる表現
4. 文法的に完璧でなくても自然さを優先
5. スラング、フィラー、省略形も適宜使用OK

重要: 感情を込めて話すときに実際に使える表現にすること。
教科書的な表現ではなく、映画やドラマで聞くような生きた英語。

出力フォーマット (JSON):
{
  "expressions": [
    {
      "english": "I can't be bothered",
      "nuance": "めんどくさい感じ",
      "emotion": "frustration"
    },
    {
      "english": "I'm not feeling it",
      "nuance": "やる気が出ない",
      "emotion": "apathy"
    },
    {
      "english": "Ugh, I just don't wanna",
      "nuance": "カジュアルな拒否",
      "emotion": "reluctance"
    }
  ],
  "category": "Feeling"
}

JSONのみを返してください。`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // JSON抽出
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
        }

        const parsed = JSON.parse(jsonText);

        return NextResponse.json({
            japanese,
            expressions: parsed.expressions,
            category: parsed.category || 'General',
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Phrase generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate phrases', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
