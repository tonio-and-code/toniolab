/**
 * Memoria - 会話生成API
 * 日記内容をNotebookLMスタイルの男女会話に変換
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { ConversationTone } from '@/types/memoria';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GenerateRequest {
    content: string;
    tone: ConversationTone;
    targetDuration: 'short' | 'medium' | 'long';
}

export async function POST(request: NextRequest) {
    try {
        const body: GenerateRequest = await request.json();
        const { content, tone, targetDuration } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // 会話の長さを決定
        const durationMap = {
            short: '1-2分（10-15往復）',
            medium: '3-5分（20-30往復）',
            long: '5-10分（40-60往復）',
        };

        // トーンの説明
        const toneMap: Record<string, string> = {
            casual: 'カジュアルで友達同士のような会話。自然で砕けた表現を使う。',
            formal: 'フォーマルでプロフェッショナルな会話。ビジネス英語を中心に。',
            philosophical: '哲学的で深い会話。抽象的な概念を扱い、考えさせる内容に。',
            humorous: 'ユーモアのある会話。軽妙な冗談やウィットを含む。',
        };

        const prompt = `あなたは自然な英語会話を生成するAIです。以下の日本語の日記内容を、NotebookLMのような男性と女性の自然な英語会話に変換してください。

日記内容:
${content}

要件:
1. 会話の長さ: ${durationMap[targetDuration]}
2. トーン: ${toneMap[tone]}
3. 男性（Male）と女性（Female）の2人の会話として構成
4. 自然なネイティブ英語を使用（fillers, colloquialisms含む）
5. 日記の内容を会話の中で自然に展開
6. 各発言は1-3文程度に
7. JSON形式で出力

出力フォーマット:
{
  "conversation": [
    {"speaker": "male", "text": "Hey, so I heard you..."},
    {"speaker": "female", "text": "Yeah! It was actually..."},
    ...
  ]
}

重要: 必ずJSONのみを返してください。他のテキストは含めないでください。`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // JSONを抽出（マークダウンのコードブロックの可能性があるため）
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
        }

        const parsed = JSON.parse(jsonText);

        return NextResponse.json({
            conversation: parsed.conversation,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Conversation generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate conversation', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
