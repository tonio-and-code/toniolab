'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SavedPhrasesStorage } from '@/lib/saved-phrases';

type ThemeMode = 'dark' | 'light';
type LineMode = 'sequential' | 'shuffle' | 'repeat-one';

const themes = {
    dark: {
        bg: '#0a0a0a',
        bgSecondary: '#1a1a1a',
        bgTertiary: '#141414',
        text: '#fff',
        textSecondary: '#888',
        textMuted: '#666',
        border: '#1a1a1a',
        borderLight: '#333',
        accent: '#D4AF37',
        success: '#10b981',
    },
    light: {
        bg: '#f5f5f5',
        bgSecondary: '#ffffff',
        bgTertiary: '#fafafa',
        text: '#1a1a1a',
        textSecondary: '#555',
        textMuted: '#666',
        border: '#e5e5e5',
        borderLight: '#d5d5d5',
        accent: '#B8960C',
        success: '#059669',
    },
};

// R2 Storage Base URL
const R2_BASE = 'https://pub-c5e9775f390c4da2a8c4a6ba2086ebc6.r2.dev/full';

interface Line {
    speaker: 'iwasaki' | 'kuma';
    text: string;
    japanese: string;
    audio: string;
}

interface Section {
    id: string;
    title: string;
    titleJa: string;
    lines: Line[];
}

// Full session data organized by sections - MUST MATCH generate_full_session.py exactly
const sessionData: Section[] = [
    {
        id: '01_opening',
        title: 'The Opening',
        titleJa: 'オープニング - 久しぶりの再会',
        lines: [
            { speaker: 'iwasaki', text: "One, two... okay, we're good. Man, it's freezing today.", japanese: "1、2...よし、大丈夫だ。いやー、今日めっちゃ寒いな。", audio: `${R2_BASE}/01_opening_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "It's been ages! How've you been?", japanese: "久しぶり！元気だった？", audio: `${R2_BASE}/01_opening_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "Hey! Long time - what is it, two months now? Maybe more.", japanese: "おー！久しぶり - 何ヶ月ぶり？2ヶ月？もっとかな。", audio: `${R2_BASE}/01_opening_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "Something like that, yeah.", japanese: "そのくらいだね、うん。", audio: `${R2_BASE}/01_opening_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "Thanks for making time for this. Hey, is my screen showing up? Did I actually share it?", japanese: "時間作ってくれてありがとう。あ、俺の画面見える？共有できてる？", audio: `${R2_BASE}/01_opening_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "No no, thank YOU. Yeah, I can see everything. Things have been... interesting lately.", japanese: "いやいや、こちらこそ。うん、全部見えてるよ。最近...いろいろあってさ。", audio: `${R2_BASE}/01_opening_05_kuma.mp3` },
            { speaker: 'iwasaki', text: "Oh yeah? Well, nothing specific on my agenda - just wanted to check in, you know? See how life's treating you. What's the word?", japanese: "へー？まあ、特に決まった議題があるわけじゃないけど - ただ近況聞きたくてさ。どんな感じ？", audio: `${R2_BASE}/01_opening_06_iwasaki.mp3` },
            { speaker: 'kuma', text: "Actually - that Note app you told me about...", japanese: "実は - 教えてもらったNoteのアプリなんだけど...", audio: `${R2_BASE}/01_opening_07_kuma.mp3` },
            { speaker: 'iwasaki', text: "Oh man, yes! I've been reading your stuff. Genuinely - it makes my day. You're posting every couple days, right?", japanese: "あー、そうそう！読んでるよ。マジで - 毎回楽しみにしてる。2日に1回くらいで投稿してるよね？", audio: `${R2_BASE}/01_opening_08_iwasaki.mp3` },
            { speaker: 'kuma', text: "Yeah, trying to stay consistent. Every two days or so.", japanese: "うん、続けるようにしてて。2日に1回くらいで。", audio: `${R2_BASE}/01_opening_09_kuma.mp3` },
            { speaker: 'iwasaki', text: "That's the sweet spot, honestly. Every two days is chef's kiss.", japanese: "それがベストだよ、正直。2日に1回は最高。", audio: `${R2_BASE}/01_opening_10_iwasaki.mp3` },
        ],
    },
    {
        id: '02_posting',
        title: 'The Art of Not Trying Too Hard',
        titleJa: '投稿頻度の極意',
        lines: [
            { speaker: 'iwasaki', text: "Here's the thing about posting frequency - daily feels... desperate? Like you're grinding and everyone can tell. But then if you disappear for a week, people forget you exist. Every two days though? Perfect rhythm.", japanese: "投稿頻度についてなんだけどさ - 毎日だと必死に見えるんだよね。でも週1だと忘れられる。2日に1回は完璧なリズム。", audio: `${R2_BASE}/02_posting_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "And I've been keeping them short too...", japanese: "あと、短くするようにもしてて...", audio: `${R2_BASE}/02_posting_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "Smart! I've been thinking about that. Like, sure, you CAN have AI pump out these massive essays - I do it all the time, guilty as charged - but honestly?", japanese: "賢い！俺もそれ考えてた。AIって長文をいくらでも生成できるじゃん - 俺もやるけど - でも正直...", audio: `${R2_BASE}/02_posting_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "Yeah...", japanese: "うん...", audio: `${R2_BASE}/02_posting_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "Nobody reads that stuff. Writing these narcissistic novels about yourself... who has time? Short and punchy beats long and boring every time. People scroll past walls of text.", japanese: "誰も読まないよあんなの。自分語りの小説みたいなの書いても...誰が読む時間あるの？短くてパンチのある方が絶対いい。長文は飛ばされる。", audio: `${R2_BASE}/02_posting_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "That's exactly my philosophy.", japanese: "まさに俺の考え方と同じだ。", audio: `${R2_BASE}/02_posting_05_kuma.mp3` },
            { speaker: 'iwasaki', text: "Great minds, right?", japanese: "やっぱ考えること一緒だね？", audio: `${R2_BASE}/02_posting_06_iwasaki.mp3` },
        ],
    },
    {
        id: '03_big_news',
        title: 'The Big News',
        titleJa: '大きなニュース - 独立宣言',
        lines: [
            { speaker: 'kuma', text: "So... there's something I need to tell you.", japanese: "あのさ...話があるんだけど。", audio: `${R2_BASE}/03_big_news_00_kuma.mp3` },
            { speaker: 'iwasaki', text: "I'm all ears.", japanese: "聞いてるよ。", audio: `${R2_BASE}/03_big_news_01_iwasaki.mp3` },
            { speaker: 'kuma', text: "This is kind of huge, actually. I quit my job. Went all in on this coaching thing.", japanese: "これ結構大きいんだけど、実は仕事辞めたんだ。コーチングに全振りした。", audio: `${R2_BASE}/03_big_news_02_kuma.mp3` },
            { speaker: 'iwasaki', text: "Whoa!", japanese: "えー！", audio: `${R2_BASE}/03_big_news_03_iwasaki.mp3` },
            { speaker: 'kuma', text: "And I was planning to learn everything from you, follow your playbook. But then this startup reached out through my blog. They said what I'm doing stands out, wanted to collaborate. They're building their portfolio, I'm building mine...", japanese: "で、岩崎さんから全部学ぼうと思ってたんだけど、ブログ経由でスタートアップから連絡来て。俺のやってることが目立ってて、一緒にやりたいって。向こうはポートフォリオ作ってて、俺も自分のを作ってて...", audio: `${R2_BASE}/03_big_news_04_kuma.mp3` },
            { speaker: 'iwasaki', text: "Wait, that's incredible!", japanese: "ちょっと待って、それすごいじゃん！", audio: `${R2_BASE}/03_big_news_05_iwasaki.mp3` },
            { speaker: 'kuma', text: "We ended up making a whole website together.", japanese: "結局一緒にウェブサイト作ったんだ。", audio: `${R2_BASE}/03_big_news_06_kuma.mp3` },
            { speaker: 'iwasaki', text: "Hold up. You actually BUILT it? That's fantastic! But - I should clarify - I hope you didn't feel weird about my offer back in December? That wasn't about money or anything. I just build stuff. It's what I do.", japanese: "ちょっと待って。本当に作ったの？すごい！でも - 一応確認だけど - 12月の俺のオファー、変に思わなかった？お金のことじゃないよ。俺はただ作るのが好きなだけ。それが俺のやること。", audio: `${R2_BASE}/03_big_news_07_iwasaki.mp3` },
            { speaker: 'kuma', text: "No, I wanted to be upfront about it.", japanese: "いや、ちゃんと話しておきたくて。", audio: `${R2_BASE}/03_big_news_08_kuma.mp3` },
            { speaker: 'iwasaki', text: "Listen - you do YOU. If you've got partners who specialize in this, even better! Honestly, a website was the main thing I wanted to mention today anyway. The fact that you already handled it? Chef's kiss again.", japanese: "いいよ全然。専門のパートナーがいるなら、むしろいいことだよ！正直、今日話そうと思ってたのもウェブサイトのことだったし。もう自分でやったって？最高。", audio: `${R2_BASE}/03_big_news_09_iwasaki.mp3` },
        ],
    },
    {
        id: '04_reveal',
        title: 'The Reveal',
        titleJa: 'ウェブサイト公開',
        lines: [
            { speaker: 'iwasaki', text: "Okay, show me. I'm dying here.", japanese: "よし、見せて。気になりすぎる。", audio: `${R2_BASE}/04_reveal_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "Let me send it over LINE...", japanese: "LINEで送るね...", audio: `${R2_BASE}/04_reveal_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "Oh. OH. You got your own domain! And - wait, is that favicon a bear? That's adorable. This is... this is actually gorgeous.", japanese: "おお。おおー！独自ドメイン取ったんだ！あ、ファビコンクマ？かわいい。これ...めっちゃいいじゃん。", audio: `${R2_BASE}/04_reveal_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "Still working on the trainer profile section...", japanese: "まだトレーナープロフィールのセクションは作業中で...", audio: `${R2_BASE}/04_reveal_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "Forget that! Nobody launches with everything done. This is SOLID. But here's the key thing - you should be publishing your Note articles here too. As blog posts. Because here's the reality: Note is rented real estate. Nice apartment, sure, but it's not YOUR house.", japanese: "そんなの後でいい！完璧な状態でローンチする人なんていないよ。これで十分。でも重要なのは - Noteの記事もここに載せるべき。ブログ記事として。現実はさ、Noteは借り物の不動産。いいアパートだけど、自分の家じゃない。", audio: `${R2_BASE}/04_reveal_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "Actually, I already started doing that.", japanese: "実は、もうやり始めてて。", audio: `${R2_BASE}/04_reveal_05_kuma.mp3` },
            { speaker: 'iwasaki', text: "Wait, seriously?!", japanese: "え、マジで？！", audio: `${R2_BASE}/04_reveal_06_iwasaki.mp3` },
            { speaker: 'kuma', text: "Yeah, but I'm doing it differently. Note gets the short, punchy versions - wide exposure, easy to digest. But my own blog? That's where I go DEEP. All the emotions, the full story.", japanese: "うん、でもやり方変えてて。Noteには短くてパンチのあるやつ - 広く届く、読みやすいやつ。でも自分のブログ？そっちは深く掘り下げる。感情も全部、フルストーリー。", audio: `${R2_BASE}/04_reveal_07_kuma.mp3` },
            { speaker: 'iwasaki', text: "THAT'S what I was hoping to see! Two separate strategies, intentional, thought-out... that's not obvious stuff. Most people just copy-paste. The fact that you figured this out yourself? That's the whole ballgame right there.", japanese: "それだよ！2つの戦略、意図的で、考え抜かれてる...これは誰でもできることじゃない。普通はコピペで終わり。自分でそれに気づいたって？それが全てだよ。", audio: `${R2_BASE}/04_reveal_08_iwasaki.mp3` },
        ],
    },
    {
        id: '05_business',
        title: 'Breaking Down the Business',
        titleJa: 'ビジネスの現状',
        lines: [
            { speaker: 'iwasaki', text: "So tell me about clients. What's the landscape looking like?", japanese: "で、クライアントはどう？どんな状況？", audio: `${R2_BASE}/05_business_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "Besides you? Mostly local people. In-person training plus coaching. You're actually my first fully remote client.", japanese: "岩崎さん以外？ほとんど地元の人。対面トレーニングとコーチング。岩崎さんが実は初めての完全リモートのクライアント。", audio: `${R2_BASE}/05_business_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "No kidding! I assumed you'd been doing online forever. Turns out I'm the experiment.", japanese: "マジで！ずっとオンラインやってると思ってた。俺が実験台か。", audio: `${R2_BASE}/05_business_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "Something like that. I WANT to go nationwide eventually, but for now I'm building credibility with people nearby.", japanese: "まあそんな感じ。いずれは全国展開したいけど、今は地元で信頼を築いてる。", audio: `${R2_BASE}/05_business_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "Smart. And you're using Coconala?", japanese: "賢いね。ココナラ使ってる？", audio: `${R2_BASE}/05_business_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "Yeah, but honestly... I'm not getting much traction. I message people, barely anyone responds.", japanese: "うん、でも正直...あんまりうまくいってなくて。メッセージ送っても、ほとんど返事ない。", audio: `${R2_BASE}/05_business_05_kuma.mp3` },
            { speaker: 'iwasaki', text: "Hmm. That's weird. When I was looking for a trainer, I definitely talked to a few before choosing you. Let me think...", japanese: "うーん、おかしいな。俺がトレーナー探してた時は、君を選ぶ前に何人かと話したよ。考えさせて...", audio: `${R2_BASE}/05_business_06_iwasaki.mp3` },
        ],
    },
    {
        id: '06_coconala',
        title: 'The Coconala Deep Dive',
        titleJa: 'ココナラ徹底分析',
        lines: [
            { speaker: 'iwasaki', text: "So my approach with interior work is different - I'm hunting whales, not minnows. Projects north of a million yen. I filter aggressively and only pursue the juicy ones. For coaching though...", japanese: "俺の内装の仕事のアプローチは違うんだけど - 小魚じゃなくてクジラを狙ってる。100万円以上の案件。厳選して、おいしいやつだけ追いかける。でもコーチングは...", audio: `${R2_BASE}/06_coconala_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "Everyone's reachable.", japanese: "誰でもリーチできる。", audio: `${R2_BASE}/06_coconala_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "Exactly! Anyone who can pay 30-50K a month is a potential client. So why aren't they biting?", japanese: "そう！月3〜5万払える人は誰でも潜在顧客。なのになんで食いつかないんだろ？", audio: `${R2_BASE}/06_coconala_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "That's what I can't figure out.", japanese: "それがわからないんだよね。", audio: `${R2_BASE}/06_coconala_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "Walk me through this. You're messaging... 20 people a week?", japanese: "詳しく聞かせて。週に何人くらいにメッセージ送ってる？20人？", audio: `${R2_BASE}/06_coconala_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "About that.", japanese: "そのくらい。", audio: `${R2_BASE}/06_coconala_05_kuma.mp3` },
            { speaker: 'iwasaki', text: "And almost nobody even gets to a trial session?", japanese: "で、トライアルまで行く人がほとんどいない？", audio: `${R2_BASE}/06_coconala_06_iwasaki.mp3` },
            { speaker: 'kuma', text: "Right. The ones who reach out TO me first - those convert. But outbound? Ghost city.", japanese: "そう。向こうから連絡来た人は成約する。でもこっちから？全然反応ない。", audio: `${R2_BASE}/06_coconala_07_kuma.mp3` },
            { speaker: 'iwasaki', text: "Okay, this is fixable. Let me think... First question: have you actually SEEN what your competitors are sending?", japanese: "これは直せるよ。考えさせて...まず質問：競合が何を送ってるか、実際に見たことある？", audio: `${R2_BASE}/06_coconala_08_iwasaki.mp3` },
            { speaker: 'kuma', text: "...No.", japanese: "...ない。", audio: `${R2_BASE}/06_coconala_09_kuma.mp3` },
            { speaker: 'iwasaki', text: "That's problem number one right there! Make a burner account, post a fake request, and see what lands in your inbox. What messages do the other trainers send? What do their profiles look like? You need intelligence before you can compete.", japanese: "それが問題その1だよ！捨てアカ作って、ダミーの依頼投稿して、どんなメッセージが来るか見てみな。他のトレーナーは何を送ってる？プロフィールはどんな感じ？競争する前に情報が必要。", audio: `${R2_BASE}/06_coconala_10_iwasaki.mp3` },
        ],
    },
    {
        id: '07_profile',
        title: 'The Profile Roast',
        titleJa: 'プロフィール改善',
        lines: [
            { speaker: 'iwasaki', text: "Let me look at your current profile... Okay. Okay. So this photo...", japanese: "今のプロフィール見せて...なるほど。なるほど。この写真さ...", audio: `${R2_BASE}/07_profile_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "What about it?", japanese: "何か問題？", audio: `${R2_BASE}/07_profile_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "It's very... DIY? Like, taken on your rooftop maybe? Look, you've got this GORGEOUS professional shot on your website - why isn't THAT your profile picture? When I see your current photo, I think 'nice guy, probably good.' When I see the website version? I think 'this person is a PROFESSIONAL.'", japanese: "なんか...自作感？屋上で撮った感じ？ウェブサイトにはすごくいいプロの写真あるじゃん - なんでそれをプロフィール写真にしないの？今の写真見ると「いい人そう、たぶん良い」。ウェブサイトの方？「この人はプロだ」って思う。", audio: `${R2_BASE}/07_profile_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "Oh.", japanese: "あー。", audio: `${R2_BASE}/07_profile_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "And reviews - you have exactly one. Mine. You need more. Those other clients you mentioned - the in-person ones? Get them to leave Coconala reviews. Even if they didn't book through the platform, there's a way.", japanese: "あとレビュー - 1件だけ。俺のやつ。もっと必要。さっき言ってた対面のクライアント？ココナラにレビュー書いてもらいな。プラットフォーム経由で予約してなくても、方法はある。", audio: `${R2_BASE}/07_profile_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "I didn't know that.", japanese: "知らなかった。", audio: `${R2_BASE}/07_profile_05_kuma.mp3` },
            { speaker: 'iwasaki', text: "Four or five reviews, mostly five stars, maybe one four - suddenly you look established. Psychology, my friend. People trust numbers.", japanese: "4〜5件のレビュー、ほとんど5つ星、1個くらい4つ星 - 急に信頼感出るよ。心理学だよ。人は数字を信じる。", audio: `${R2_BASE}/07_profile_06_iwasaki.mp3` },
        ],
    },
    {
        id: '08_chocozap',
        title: 'The Choco-Zap Strategy',
        titleJa: 'チョコザップ戦略',
        lines: [
            { speaker: 'iwasaki', text: "Here's another thought - and this might be uncomfortable.", japanese: "もう一つ思ったんだけど - ちょっと言いにくいかも。", audio: `${R2_BASE}/08_chocozap_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "Hit me.", japanese: "言って。", audio: `${R2_BASE}/08_chocozap_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "Your offer might be too intense. Six months, serious commitment, real money... that's intimidating. Remember Rizap? 'Transform your body!' - hardcore approach. Know what happened?", japanese: "オファーがハードすぎるかも。6ヶ月、本気のコミット、結構なお金...ハードル高い。ライザップ覚えてる？「結果にコミット！」- ガチのアプローチ。どうなったか知ってる？", audio: `${R2_BASE}/08_chocozap_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "They struggled.", japanese: "苦しんでた。", audio: `${R2_BASE}/08_chocozap_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "And then Choco-Zap exploded. Casual vibes. Three thousand yen a month. Drop in whenever. That model probably has 100x Rizap's customer base.", japanese: "で、チョコザップが爆発した。カジュアルな雰囲気。月3000円。いつでも来ていい。たぶんライザップの100倍の顧客がいる。", audio: `${R2_BASE}/08_chocozap_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "So you're saying...", japanese: "つまり...", audio: `${R2_BASE}/08_chocozap_05_kuma.mp3` },
            { speaker: 'iwasaki', text: "Create an entry point. Something low-stakes. 'Three thousand yen, once a month, let's chat' kind of thing. Let people dip their toes in. THEN, after you've built that relationship, after they trust you... THAT'S when you pitch the intensive six-month transformation.", japanese: "入り口を作れってこと。ハードル低いやつ。「月3000円、月1回、話しましょう」みたいな。まずは足を踏み入れてもらう。そして信頼関係ができてから...そこで6ヶ月の本格プログラムを提案する。", audio: `${R2_BASE}/08_chocozap_06_iwasaki.mp3` },
            { speaker: 'kuma', text: "A funnel.", japanese: "ファネルか。", audio: `${R2_BASE}/08_chocozap_07_kuma.mp3` },
            { speaker: 'iwasaki', text: "Exactly! The serious stuff scares people away cold. But warm them up first? Whole different ballgame.", japanese: "そう！いきなりガチなのは引かれる。でも最初にウォームアップすれば？全然違うゲームになる。", audio: `${R2_BASE}/08_chocozap_08_iwasaki.mp3` },
        ],
    },
    {
        id: '09_note_hack',
        title: 'The Note Growth Hack',
        titleJa: 'Note フォロワー戦略',
        lines: [
            { speaker: 'iwasaki', text: "Oh, quick thing about Note - I noticed you're using the same bear image every post instead of AI-generated stuff.", japanese: "あ、Noteのことで気づいたんだけど - AI画像じゃなくて毎回同じクマの画像使ってるよね。", audio: `${R2_BASE}/09_note_hack_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "Yeah, intentionally.", japanese: "うん、意図的に。", audio: `${R2_BASE}/09_note_hack_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "SMART. Everyone can spot AI images now - they all look the same. But that consistent bear? That's YOUR brand. People recognize it. That's actually brilliant.", japanese: "賢い。みんなもうAI画像わかるじゃん - 全部同じに見える。でも一貫したクマ？それが君のブランド。認識される。実際、天才的。", audio: `${R2_BASE}/09_note_hack_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "Should I be following back everyone who follows me?", japanese: "フォローしてくれた人、全員フォロバすべき？", audio: `${R2_BASE}/09_note_hack_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "Absolutely. But here's the real move - you should be following people FIRST. Waiting for followers is too passive.", japanese: "もちろん。でも本当のムーブは - 先にフォローすること。フォロワー待ちは受け身すぎる。", audio: `${R2_BASE}/09_note_hack_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "Really?", japanese: "本当に？", audio: `${R2_BASE}/09_note_hack_05_kuma.mp3` },
            { speaker: 'iwasaki', text: "Same playbook as Twitter. Find fifteen people who look like potential clients - fitness goals, weight loss journeys, that vibe. Follow them. Wait three days. Some will follow back. The ones who don't? Unfollow. Your ratio stays healthy, your follower count climbs. Rinse and repeat.", japanese: "Twitterと同じ戦略。潜在顧客っぽい15人を見つける - フィットネス目標、ダイエット中、そういう人。フォローする。3日待つ。フォロバする人もいる。しない人？フォロー外す。比率は健全に保たれ、フォロワーは増える。繰り返す。", audio: `${R2_BASE}/09_note_hack_06_iwasaki.mp3` },
            { speaker: 'kuma', text: "That feels... aggressive?", japanese: "それって...攻めすぎ？", audio: `${R2_BASE}/09_note_hack_07_kuma.mp3` },
            { speaker: 'iwasaki', text: "Welcome to business. Everyone does this. It's not cheating - it's playing the game.", japanese: "ビジネスへようこそ。みんなやってる。ズルじゃない - ゲームのルール。", audio: `${R2_BASE}/09_note_hack_08_iwasaki.mp3` },
        ],
    },
    {
        id: '10_money',
        title: 'The Money Talk',
        titleJa: 'お金と契約の話',
        lines: [
            { speaker: 'iwasaki', text: "Now, something awkward but necessary. How are you handling payments?", japanese: "さて、ちょっと聞きにくいけど大事なこと。支払いどうしてる？", audio: `${R2_BASE}/10_money_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "Bank transfers.", japanese: "銀行振込。", audio: `${R2_BASE}/10_money_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "With... invoices? Receipts?", japanese: "請求書は？領収書は？", audio: `${R2_BASE}/10_money_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "...", japanese: "...", audio: `${R2_BASE}/10_money_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "Thought so. Look, right now I'm just sending you random money transfers. There's no documentation. If a tax auditor shows up, these are literally 'mysterious transfers to some guy named Kuma.' That's NOT a business transaction.", japanese: "だと思った。今の状態だと、俺はただ謎の送金をしてるだけ。記録がない。税務調査来たら、「クマって人への謎の送金」になっちゃうよ。それはビジネス取引じゃない。", audio: `${R2_BASE}/10_money_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "Oh.", japanese: "あー。", audio: `${R2_BASE}/10_money_05_kuma.mp3` },
            { speaker: 'iwasaki', text: "You need to send me an invoice. I'll send you a receipt. For your bigger clients - the six-month programs - you need contracts. What happens if someone bails at month three? What's the refund policy? Without this stuff written down, you'll get burned eventually.", japanese: "請求書送って。俺は領収書送る。大きいクライアント - 6ヶ月プログラムとか - には契約書が必要。3ヶ月で辞めたらどうする？返金ポリシーは？書面にしておかないと、いつか痛い目見るよ。", audio: `${R2_BASE}/10_money_06_iwasaki.mp3` },
            { speaker: 'kuma', text: "I hadn't thought about it that way.", japanese: "そこまで考えてなかった。", audio: `${R2_BASE}/10_money_07_kuma.mp3` },
            { speaker: 'iwasaki', text: "Here's the flip side though - contracts CREATE commitment. When someone signs an actual document, puts their seal on it, hands over the deposit... psychologically, they're locked in. 'I signed for six months, I better show up.' The formality itself drives motivation.", japanese: "でも逆に言えば - 契約はコミットメントを生む。実際の書類にサインして、ハンコ押して、前金払って...心理的に、逃げられなくなる。「6ヶ月で契約したんだから、ちゃんとやらなきゃ」。形式そのものがモチベーションを生む。", audio: `${R2_BASE}/10_money_08_iwasaki.mp3` },
        ],
    },
    {
        id: '11_english',
        title: 'The English Dream',
        titleJa: '英語学習の夢',
        lines: [
            { speaker: 'iwasaki', text: "Alright, shifting gears. You mentioned wanting to learn English?", japanese: "よし、話題変えよう。英語学びたいって言ってたよね？", audio: `${R2_BASE}/11_english_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "Definitely. Speaking, reading, the works.", japanese: "うん、絶対。スピーキング、リーディング、全部。", audio: `${R2_BASE}/11_english_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "What's the goal? 'Fluent' is too vague.", japanese: "目標は？「流暢に」だと曖昧すぎる。", audio: `${R2_BASE}/11_english_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "Honestly? Just... being able to handle it. Tourist asks for directions, someone at a bar starts chatting - I want to respond without freezing up.", japanese: "正直？ただ...対応できるようになりたい。観光客に道聞かれたり、バーで話しかけられたり - 固まらずに返したい。", audio: `${R2_BASE}/11_english_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "Conversational basics. That's totally achievable. Let me show you something I've been building...", japanese: "日常会話の基本か。それは全然できる。俺が作ってるもの見せるよ...", audio: `${R2_BASE}/11_english_04_iwasaki.mp3` },
            { speaker: 'iwasaki', text: "This is a learning dashboard. Made it with AI in like three hours at a coffee shop. Nothing fancy yet, but the concept is solid. See, my approach is '100 Hours of English' - not because 100 hours makes you fluent, but because it builds the HABIT.", japanese: "これは学習ダッシュボード。カフェでAI使って3時間くらいで作った。まだシンプルだけど、コンセプトは固まってる。俺のアプローチは「100時間の英語」- 100時間で流暢になるからじゃなくて、習慣を作るから。", audio: `${R2_BASE}/11_english_05_iwasaki.mp3` },
            { speaker: 'kuma', text: "Interesting...", japanese: "面白い...", audio: `${R2_BASE}/11_english_06_kuma.mp3` },
            { speaker: 'iwasaki', text: "And here's the key insight - 'studying' feels like punishment. So don't study. Consume stuff you actually enjoy. I love MLB, so I watch Japanese baseball commentary, then review the same content in English the next day. Never feels like work.", japanese: "で、重要なポイント - 「勉強」は罰ゲームみたいに感じる。だから勉強しない。好きなコンテンツを消費する。俺はMLB好きだから、日本語の野球解説見て、次の日に同じ内容を英語で見る。勉強って感じがしない。", audio: `${R2_BASE}/11_english_07_iwasaki.mp3` },
            { speaker: 'kuma', text: "Oh wow.", japanese: "なるほど。", audio: `${R2_BASE}/11_english_08_kuma.mp3` },
            { speaker: 'iwasaki', text: "There's even a daily journal feature. I write about my day - 'Had coffee at Hidakaya, showed a friend some AI stuff' - and it auto-converts to English. Now I'm learning from MY OWN LIFE, not some boring textbook sentences.", japanese: "毎日の日記機能もある。その日あったこと書く - 「日高屋でコーヒー飲んだ、友達にAI見せた」- 自動で英語に変換される。自分の人生から学んでる、つまらない教科書の文章じゃなくて。", audio: `${R2_BASE}/11_english_09_iwasaki.mp3` },
        ],
    },
    {
        id: '12_value',
        title: 'The Real Value',
        titleJa: '価値の交換',
        lines: [
            { speaker: 'iwasaki', text: "What would make this useful for YOU, though? That's what I'm trying to figure out. Beginners are the biggest market, and you're a beginner. Your frustrations are data.", japanese: "でも、君にとって何が役立つ？それを知りたい。初心者が一番大きい市場で、君は初心者。君の悩みがデータになる。", audio: `${R2_BASE}/12_value_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "This dashboard thing... I want to build something similar for MY clients. Track their fitness journey, visualize progress, that kind of thing.", japanese: "このダッシュボード...俺もクライアント用に似たようなの作りたい。フィットネスの進捗追跡、可視化、そういうの。", audio: `${R2_BASE}/12_value_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "THAT I can help with. The tools are learnable. Six months ago, I knew nothing about coding - literally nothing. Now I build apps daily. It's not magic. It's just... talking to AI the right way.", japanese: "それなら手伝える。ツールは学べる。6ヶ月前、俺はコーディング何も知らなかった - マジで何も。今は毎日アプリ作ってる。魔法じゃない。ただ...AIとの正しい話し方。", audio: `${R2_BASE}/12_value_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "Show me everything.", japanese: "全部教えて。", audio: `${R2_BASE}/12_value_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "Deal. But here's my ask in return - test my English stuff. Tell me what sucks, what confuses you, what's missing. Your honest feedback makes my product better.", japanese: "了解。でも代わりに頼みたいのは - 俺の英語ツールをテストして。ダメなとこ、わかりにくいとこ、足りないとこ教えて。正直なフィードバックが製品を良くする。", audio: `${R2_BASE}/12_value_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "Absolutely.", japanese: "もちろん。", audio: `${R2_BASE}/12_value_05_kuma.mp3` },
        ],
    },
    {
        id: '13_wrapup',
        title: 'The Wrap-Up',
        titleJa: 'まとめ - 次のステップ',
        lines: [
            { speaker: 'iwasaki', text: "Alright, we should probably land this plane. Quick recap - Coconala needs work. Competitors need research. Photos need upgrading. Reviews need collecting. And PLEASE send me an invoice next month so we're doing this properly.", japanese: "よし、そろそろまとめよう。振り返り - ココナラは要改善。競合リサーチが必要。写真をアップグレード。レビューを集める。あと来月は請求書送って、ちゃんとやろう。", audio: `${R2_BASE}/13_wrapup_00_iwasaki.mp3` },
            { speaker: 'kuma', text: "Got it. All of it.", japanese: "わかった。全部。", audio: `${R2_BASE}/13_wrapup_01_kuma.mp3` },
            { speaker: 'iwasaki', text: "And keep that bear image. Keep the Note rhythm. Keep differentiating your blog content. You're doing way more right than wrong.", japanese: "あとクマの画像は続けて。Noteのリズムも。ブログの差別化も。君は間違いより正解の方がずっと多い。", audio: `${R2_BASE}/13_wrapup_02_iwasaki.mp3` },
            { speaker: 'kuma', text: "Thanks. Really.", japanese: "ありがとう。本当に。", audio: `${R2_BASE}/13_wrapup_03_kuma.mp3` },
            { speaker: 'iwasaki', text: "Line me whenever. I might be slow to respond sometimes, but I'll get there. We're in this together.", japanese: "いつでもLINEして。返信遅いこともあるけど、必ず返す。一緒にやってこう。", audio: `${R2_BASE}/13_wrapup_04_iwasaki.mp3` },
            { speaker: 'kuma', text: "Same time next month?", japanese: "来月も同じ時間？", audio: `${R2_BASE}/13_wrapup_05_kuma.mp3` },
            { speaker: 'iwasaki', text: "Lock it in. Good luck with Coconala - let me know what you find when you scout the competition. I'm genuinely curious.", japanese: "予定入れとく。ココナラ頑張って - 競合調査したら教えて。マジで気になる。", audio: `${R2_BASE}/13_wrapup_06_iwasaki.mp3` },
            { speaker: 'kuma', text: "Will do.", japanese: "わかった。", audio: `${R2_BASE}/13_wrapup_07_kuma.mp3` },
            { speaker: 'iwasaki', text: "Later! Stay warm out there.", japanese: "じゃあね！暖かくしてね。", audio: `${R2_BASE}/13_wrapup_08_iwasaki.mp3` },
        ],
    },
];

// Flatten all lines for playback
const allLines = sessionData.flatMap((section, sectionIndex) =>
    section.lines.map((line, lineIndex) => ({
        ...line,
        sectionId: section.id,
        sectionTitle: section.title,
        sectionTitleJa: section.titleJa,
        globalIndex: sessionData.slice(0, sectionIndex).reduce((acc, s) => acc + s.lines.length, 0) + lineIndex,
    }))
);

export default function SessionsPage() {
    const router = useRouter();

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(0.9);

    // Mode state
    const [lineMode, setLineMode] = useState<LineMode>('sequential');

    // UI state
    const [theme, setTheme] = useState<ThemeMode>('light');
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['01_opening']));

    // Phrase saving
    const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveExample, setSaveExample] = useState('');
    const [saveWord, setSaveWord] = useState('');
    const [saveMeaning, setSaveMeaning] = useState('');
    const [saveType, setSaveType] = useState('word');
    const [isSavingPhrase, setIsSavingPhrase] = useState(false);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lineModeRef = useRef<LineMode>('sequential');

    const t = themes[theme];

    // Keep refs in sync
    useEffect(() => {
        lineModeRef.current = lineMode;
    }, [lineMode]);

    // Load settings
    useEffect(() => {
        const savedLineMode = localStorage.getItem('session_lineMode') as LineMode | null;
        const savedSpeed = localStorage.getItem('session_speed');
        const savedTheme = localStorage.getItem('english_theme') as ThemeMode | null;

        if (savedLineMode && ['sequential', 'shuffle', 'repeat-one'].includes(savedLineMode)) {
            setLineMode(savedLineMode);
            lineModeRef.current = savedLineMode;
        }
        if (savedSpeed) setSpeed(parseFloat(savedSpeed));
        if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);

        setSettingsLoaded(true);
    }, []);

    // Save settings
    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('session_lineMode', lineMode);
    }, [lineMode, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('session_speed', speed.toString());
    }, [speed, settingsLoaded]);

    // Load saved phrases
    useEffect(() => {
        const saved = SavedPhrasesStorage.getAll();
        setSavedPhrases(new Set(saved.map(p => p.english)));
    }, []);

    // Get next index based on mode
    const getNextIndex = useCallback((current: number): number => {
        const total = allLines.length;
        const mode = lineModeRef.current;

        if (mode === 'repeat-one') return current;
        if (mode === 'shuffle') return Math.floor(Math.random() * total);

        const next = current + 1;
        return next >= total ? -1 : next;
    }, []);

    // Play a specific line
    const playLine = useCallback((index: number) => {
        if (index < 0 || index >= allLines.length) {
            setIsPlaying(false);
            setProgress(0);
            return;
        }

        const line = allLines[index];

        // Expand the section containing this line
        setExpandedSections(prev => new Set(prev).add(line.sectionId));

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(line.audio);
        audio.playbackRate = speed;
        audioRef.current = audio;

        setCurrentIndex(index);
        setIsPlaying(true);
        setProgress(0);

        audio.ontimeupdate = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        audio.onended = () => {
            setProgress(100);
            setTimeout(() => {
                const nextIndex = getNextIndex(index);
                if (nextIndex >= 0) {
                    playLine(nextIndex);
                } else {
                    setIsPlaying(false);
                    setProgress(0);
                }
            }, 300);
        };

        audio.onerror = () => {
            setIsPlaying(false);
            console.error('Audio failed to load:', line.audio);
        };

        audio.play().catch(console.error);
    }, [speed, getNextIndex]);

    const togglePlay = () => {
        if (isPlaying) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setIsPlaying(false);
        } else {
            playLine(currentIndex);
        }
    };

    const playNext = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const next = (currentIndex + 1) % allLines.length;
        playLine(next);
    };

    const playPrevious = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const prev = currentIndex <= 0 ? allLines.length - 1 : currentIndex - 1;
        playLine(prev);
    };

    const cycleLineMode = () => {
        const modes: LineMode[] = ['sequential', 'shuffle', 'repeat-one'];
        const currentIdx = modes.indexOf(lineMode);
        const nextMode = modes[(currentIdx + 1) % modes.length];
        setLineMode(nextMode);
        lineModeRef.current = nextMode;
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    };

    const toggleSavePhrase = (text: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (savedPhrases.has(text)) {
            const all = SavedPhrasesStorage.getAll();
            const found = all.find(p => p.english === text);
            if (found) SavedPhrasesStorage.remove(found.id);
            setSavedPhrases(prev => {
                const next = new Set(prev);
                next.delete(text);
                return next;
            });
        } else {
            SavedPhrasesStorage.save({
                english: text,
                source: 'Session: Iwasaki x Kuma',
            });
            setSavedPhrases(prev => new Set(prev).add(text));
        }
    };

    const openVocabModal = (text: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSaveExample(text);
        setSaveWord('');
        setSaveMeaning('');
        setSaveType('word');
        setShowSaveModal(true);
    };

    const saveToVocabulary = async () => {
        if (!saveWord.trim() || !saveMeaning.trim()) return;
        setIsSavingPhrase(true);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: saveWord.trim(),
                    type: saveType,
                    meaning: saveMeaning,
                    example: saveExample,
                    source: 'Session: Iwasaki x Kuma',
                }),
            });
            if (res.ok || res.status === 409) {
                setShowSaveModal(false);
            }
        } finally {
            setIsSavingPhrase(false);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('english_theme', newTheme);
    };

    const currentLine = allLines[currentIndex];

    return (
        <div style={{
            height: '100%',
            backgroundColor: t.bg,
            color: t.text,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 20px',
                borderBottom: `1px solid ${t.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <button
                    onClick={() => router.push('/english')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: t.textMuted,
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <span style={{ fontSize: '18px' }}>&#8249;</span> English
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {savedPhrases.size > 0 && (
                        <button
                            onClick={() => router.push('/english/saved')}
                            style={{
                                background: 'none',
                                border: `1px solid ${t.accent}`,
                                color: t.accent,
                                cursor: 'pointer',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            <span>Saved</span>
                            <span>{savedPhrases.size}</span>
                        </button>
                    )}
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'none',
                            border: `1px solid ${t.borderLight}`,
                            color: t.textMuted,
                            cursor: 'pointer',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '11px'
                        }}
                    >
                        {theme === 'dark' ? 'Light' : 'Dark'}
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                WebkitOverflowScrolling: 'touch'
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {/* Title */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '12px', color: t.accent, fontWeight: '500', marginBottom: '6px' }}>
                            Session Audio
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.3', margin: 0 }}>
                            Iwasaki x Kuma Session
                        </h1>
                        <div style={{ fontSize: '13px', color: t.textMuted, marginTop: '8px' }}>
                            {sessionData.length} sections / {allLines.length} lines
                        </div>
                    </div>

                    {/* Current Line Display */}
                    <div style={{ backgroundColor: t.bgTertiary, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '11px',
                            color: currentLine?.speaker === 'iwasaki' ? '#D4AF37' : '#10b981',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '8px'
                        }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: currentLine?.speaker === 'iwasaki' ? '#D4AF37' : '#10b981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#fff'
                            }}>
                                {currentLine?.speaker === 'iwasaki' ? 'I' : 'K'}
                            </div>
                            {currentLine?.speaker === 'iwasaki' ? 'Iwasaki' : 'Kuma'}
                        </div>
                        <div style={{ fontSize: '15px', color: t.text, lineHeight: '1.6', minHeight: '48px' }}>
                            {currentLine?.text || 'Select a line to play'}
                        </div>
                        {currentLine?.japanese && (
                            <div style={{
                                fontSize: '14px',
                                color: t.textMuted,
                                lineHeight: '1.6',
                                marginTop: '12px',
                                paddingTop: '12px',
                                borderTop: `1px solid ${t.borderLight}`
                            }}>
                                {currentLine.japanese}
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ height: '4px', backgroundColor: t.borderLight, borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: t.accent, transition: 'width 0.1s linear' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: t.textMuted }}>
                            <span>{currentIndex + 1} / {allLines.length}</span>
                            <span>{speed.toFixed(2)}x</span>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
                        {/* Shuffle Button */}
                        <button
                            onClick={cycleLineMode}
                            style={{ background: 'none', border: 'none', color: lineMode === 'shuffle' ? t.accent : t.textMuted, cursor: 'pointer', padding: '8px' }}
                            title={lineMode === 'sequential' ? 'Sequential' : lineMode === 'shuffle' ? 'Shuffle' : 'Repeat One'}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                            </svg>
                        </button>

                        <button onClick={playPrevious} style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', padding: '8px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                            </svg>
                        </button>

                        <button
                            onClick={togglePlay}
                            style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: t.accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {isPlaying ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="#000">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="#000" style={{ marginLeft: '3px' }}>
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        <button onClick={playNext} style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', padding: '8px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                            </svg>
                        </button>

                        {/* Repeat Button */}
                        <button
                            onClick={cycleLineMode}
                            style={{ background: 'none', border: 'none', color: lineMode === 'repeat-one' ? t.accent : t.textMuted, cursor: 'pointer', padding: '8px', position: 'relative' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                            </svg>
                            {lineMode === 'repeat-one' && <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 'bold', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: t.accent }}>1</span>}
                        </button>
                    </div>

                    {/* Speed Control */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
                        <span style={{ fontSize: '12px', color: t.textMuted, minWidth: '32px' }}>0.5x</span>
                        <input
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.05"
                            value={speed}
                            onChange={(e) => {
                                const newSpeed = parseFloat(e.target.value);
                                setSpeed(newSpeed);
                                if (audioRef.current) {
                                    audioRef.current.playbackRate = newSpeed;
                                }
                            }}
                            style={{ width: '150px', accentColor: t.accent }}
                        />
                        <span style={{ fontSize: '12px', color: t.textMuted, minWidth: '32px' }}>1.5x</span>
                        <span style={{ fontSize: '14px', color: t.accent, fontWeight: '600', minWidth: '45px', textAlign: 'center' }}>{speed.toFixed(2)}x</span>
                    </div>

                    {/* Sections */}
                    <h3 style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                        Sections ({sessionData.length})
                    </h3>

                    {sessionData.map((section) => {
                        const isExpanded = expandedSections.has(section.id);
                        const sectionStartIndex = allLines.findIndex(l => l.sectionId === section.id);

                        return (
                            <div key={section.id} style={{ marginBottom: '8px' }}>
                                {/* Section Header */}
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        backgroundColor: t.bgSecondary,
                                        border: `1px solid ${t.borderLight}`,
                                        borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: t.text }}>{section.title}</div>
                                        <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '2px' }}>{section.titleJa}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '11px', color: t.textMuted }}>{section.lines.length} lines</span>
                                        <span style={{ color: t.textMuted, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                            </svg>
                                        </span>
                                    </div>
                                </button>

                                {/* Section Lines */}
                                {isExpanded && (
                                    <div style={{
                                        backgroundColor: t.bgSecondary,
                                        border: `1px solid ${t.borderLight}`,
                                        borderTop: 'none',
                                        borderRadius: '0 0 12px 12px',
                                    }}>
                                        {section.lines.map((line, i) => {
                                            const globalIdx = sectionStartIndex + i;
                                            const isActive = globalIdx === currentIndex;
                                            const speakerColor = line.speaker === 'iwasaki' ? '#D4AF37' : '#10b981';

                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        if (audioRef.current) {
                                                            audioRef.current.pause();
                                                        }
                                                        playLine(globalIdx);
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '12px',
                                                        padding: '12px 16px',
                                                        backgroundColor: isActive ? t.bgTertiary : 'transparent',
                                                        borderBottom: i < section.lines.length - 1 ? `1px solid ${t.border}` : 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <div style={{ width: '24px', textAlign: 'center', fontSize: '12px', color: isActive ? t.accent : t.textMuted, paddingTop: '2px' }}>
                                                        {isActive && isPlaying ? '>' : i + 1}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                                            <div style={{
                                                                width: '18px',
                                                                height: '18px',
                                                                borderRadius: '50%',
                                                                backgroundColor: speakerColor,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '10px',
                                                                fontWeight: '700',
                                                                color: '#fff'
                                                            }}>
                                                                {line.speaker === 'iwasaki' ? 'I' : 'K'}
                                                            </div>
                                                            <span style={{ fontSize: '11px', color: speakerColor, textTransform: 'uppercase' }}>
                                                                {line.speaker === 'iwasaki' ? 'Iwasaki' : 'Kuma'}
                                                            </span>
                                                        </div>
                                                        <div style={{ fontSize: '14px', color: isActive ? t.accent : t.text, lineHeight: '1.5' }}>
                                                            {line.text}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '13px',
                                                            color: t.textMuted,
                                                            lineHeight: '1.5',
                                                            marginTop: '4px',
                                                            paddingLeft: '8px',
                                                            borderLeft: `2px solid ${t.borderLight}`
                                                        }}>
                                                            {line.japanese}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <button
                                                            onClick={(e) => openVocabModal(line.text, e)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                padding: '4px',
                                                                fontSize: '10px',
                                                                color: t.accent,
                                                            }}
                                                            title="Save to Vocabulary"
                                                        >
                                                            +Vocab
                                                        </button>
                                                        <button
                                                            onClick={(e) => toggleSavePhrase(line.text, e)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                padding: '4px',
                                                                fontSize: '16px',
                                                                color: savedPhrases.has(line.text) ? '#FFD700' : t.textMuted,
                                                            }}
                                                            title={savedPhrases.has(line.text) ? 'Remove from saved' : 'Save phrase'}
                                                        >
                                                            {savedPhrases.has(line.text) ? 'S' : 'B'}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Save Modal */}
            {showSaveModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px',
                    }}
                    onClick={() => setShowSaveModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '16px',
                            padding: '24px',
                            width: '100%',
                            maxWidth: '450px',
                            border: `1px solid ${t.borderLight}`,
                        }}
                    >
                        <div style={{ fontSize: '11px', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                            Save to My Vocabulary
                        </div>

                        <div style={{
                            fontSize: '13px',
                            color: t.textSecondary,
                            marginBottom: '20px',
                            padding: '12px',
                            backgroundColor: t.bg,
                            borderRadius: '8px',
                            lineHeight: '1.5',
                            borderLeft: `3px solid ${t.accent}`,
                        }}>
                            {saveExample}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>
                                Word / Phrase to save *
                            </label>
                            <input
                                type="text"
                                value={saveWord}
                                onChange={(e) => setSaveWord(e.target.value)}
                                placeholder="e.g. chef's kiss"
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${t.borderLight}`,
                                    backgroundColor: t.bg,
                                    color: t.text,
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>
                                Type
                            </label>
                            <select
                                value={saveType}
                                onChange={(e) => setSaveType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: `1px solid ${t.borderLight}`,
                                    backgroundColor: t.bg,
                                    color: t.text,
                                    fontSize: '14px',
                                }}
                            >
                                <option value="word">word</option>
                                <option value="phrasal verb">phrasal verb</option>
                                <option value="idiom">idiom</option>
                                <option value="slang">slang</option>
                                <option value="collocation">collocation</option>
                                <option value="expression">expression</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>
                                Meaning (Japanese) *
                            </label>
                            <input
                                type="text"
                                value={saveMeaning}
                                onChange={(e) => setSaveMeaning(e.target.value)}
                                placeholder="Enter meaning..."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${t.borderLight}`,
                                    backgroundColor: t.bg,
                                    color: t.text,
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowSaveModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${t.borderLight}`,
                                    backgroundColor: 'transparent',
                                    color: t.textMuted,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveToVocabulary}
                                disabled={isSavingPhrase || !saveWord.trim() || !saveMeaning.trim()}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: (saveWord.trim() && saveMeaning.trim()) ? '#10B981' : t.borderLight,
                                    color: (saveWord.trim() && saveMeaning.trim()) ? '#fff' : t.textMuted,
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: (saveWord.trim() && saveMeaning.trim() && !isSavingPhrase) ? 'pointer' : 'default',
                                }}
                            >
                                {isSavingPhrase ? '...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
