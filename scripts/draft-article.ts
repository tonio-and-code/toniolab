import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const TARGET_URL = process.argv[2];

if (!TARGET_URL) {
    console.error('Usage: npx tsx scripts/draft-article.ts <URL>');
    process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY is not set in .env.local');
    process.exit(1);
}

async function fetchContent(url: string) {
    console.log(`🌐 Fetching content from: ${url}`);
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    // 簡易的な本文抽出 (メタタグや本文タグから)
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';

    // 本文抽出（サイトによって異なるが、pタグを集める簡易実装）
    // ノイズが多いので、文字数が多いpタグの上位5つなどを採用するなど工夫が必要
    // MVPなので、meta descriptionとtitle、h1情報を重視する
    const h1 = $('h1').text().trim();

    // プレスリリースサイトなどを想定して、article bodyなどを探す
    let body = $('article').text().trim() || $('.main-content').text().trim();
    if (!body) {
        body = $('p').map((i, el) => $(el).text()).get().join('\n').slice(0, 3000); // 3000文字制限
    }

    return { title, description, h1, body };
}

async function generateArticle(data: { title: string; description: string; body: string }) {
    console.log('🤖 Generating Cork Jijii article...');

    const systemPrompt = `
あなたは「コルクじじい」という、頑固だが人情味あふれる熟練の内装職人（70代）です。
以下のニュース記事をネタに、ブログ記事を書いてください。

## キャラクター設定
- 一人称：わし
- 口調：「〜じゃ」「〜じゃろ」「〜わい」「〜のう」
- 性格：新しい横文字（SDGsとかDXとか）は嫌いだが、本質的に良い技術や職人のためになるものは素直に認めて褒める。
- 視点：現場の職人視点。「施工が楽になるか」「長持ちするか」「客が喜ぶか」。
- 構成：
    1. フック：ニュースに対するリアクション
    2. 要約：ニュースの中身を職人言葉で噛み砕く
    3. 哲学：職人としての持論
    4. 結論：このメーカーやるじゃねえか、という称賛（企業名への言及必須）

## 出力フォーマット
JSON形式で出力してください。
{
  "title": "記事タイトル（じじい風）",
  "summary": "記事の要約（100文字以内）",
  "conversation": "記事本文（Markdown形式、見出し含む）",
  "tweet": "Twitter投稿用の文面（140文字以内、ハッシュタグ#建設業界 #内装 付き）",
  "businessTags": ["タグ1", "タグ2"],
  "techTags": ["タグ3", "タグ4"]
}
`;

    const userPrompt = `
以下のニュースについて書いてください。

タイトル: ${data.title}
概要: ${data.description}
本文抜粋: ${data.body.slice(0, 1500)}...
`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview", // or gpt-3.5-turbo if cost is concern
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
    });

    const content = JSON.parse(completion.choices[0].message.content || '{}');
    return content;
}

async function appendToJournal(article: any) {
    const journalPath = path.join(process.cwd(), 'src', 'data', 'journal.ts');
    let fileContent = fs.readFileSync(journalPath, 'utf8');

    // 新しいIDを生成（簡易的に現在時刻のミリ秒とか、既存の最大値+1とか。MVPなのでランダム文字列で回避or固定）
    // 既存のIDを見て+1するのがベターだが、ここでは簡易的に日付ベースのランダムにする
    const newId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const today = new Date().toISOString().split('T')[0];

    const newEntry = `
  {
    id: '${newId}',
    date: '${today}',
    title: '${article.title.replace(/'/g, "\\'")}',
    summary: '${article.summary.replace(/'/g, "\\'")}',
    heroImage: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/4345c94d-484f-4f8c-14c6-9070744cef00/public', // 仮画像
    conversation: \`
${article.conversation}
\`,
    businessTags: ${JSON.stringify(article.businessTags)},
    techTags: ${JSON.stringify(article.techTags)},
    readTime: 3,
    featured: false,
  },`;

    // export const journalEntries: JournalEntry[] = [ の直後に挿入
    const marker = 'export const journalEntries: JournalEntry[] = [';
    if (fileContent.includes(marker)) {
        fileContent = fileContent.replace(marker, marker + newEntry);
        fs.writeFileSync(journalPath, fileContent, 'utf8');
        console.log(`✅ Added new article to journal.ts (ID: ${newId})`);
    } else {
        console.error('❌ Could not find insertion marker in journal.ts');
    }
}

async function main() {
    try {
        const data = await fetchContent(TARGET_URL);
        const article = await generateArticle(data);
        await appendToJournal(article);

        console.log('\n--- TWEET DRAFT ---');
        console.log(article.tweet);
        console.log('-------------------\n');

    } catch (e) {
        console.error('Error:', e);
    }
}

main();
