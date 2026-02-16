'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { FitnessReport } from '@/types/fitness-report';

const theme = {
    bg: '#f5f5f5',
    bgSecondary: '#ffffff',
    text: '#1a1a1a',
    textMuted: '#666',
    border: '#e5e5e5',
    borderLight: '#d5d5d5',
    accent: '#B8960C',
};

export default function FitnessReportPage() {
    const [reports, setReports] = useState<FitnessReport[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [japaneseInput, setJapaneseInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    useEffect(() => {

        // Force set demo data
        const didNothingReport: FitnessReport = {
            id: (Date.now() + 1).toString(),
            date: new Date('2026-01-13').toISOString(),
            japaneseReport: '今日は何もしてない（笑）。英語のノートも作らなかったし、特に運動もしてない。ジャーナル書いて終わり。これも報告として記録しておく。',
            conversation: {
                english: [
                    { speaker: 'male' as const, text: "Hey coach, today's report is... well, there's nothing to report." },
                    { speaker: 'female' as const, text: "Nothing? What do you mean?" },
                    { speaker: 'male' as const, text: "I just didn't do anything. Didn't make English notes, didn't exercise. Just wrote in my journal." },
                    { speaker: 'female' as const, text: "You know rest days are important too, right?" },
                    { speaker: 'male' as const, text: "Yeah, but this wasn't a planned rest day. I just... didn't feel like it." },
                    { speaker: 'female' as const, text: "Being honest about it is actually progress. Most people would just skip reporting entirely." },
                    { speaker: 'male' as const, text: "True. Transparency, you know. Showing the days where nothing happens." },
                    { speaker: 'female' as const, text: "Exactly. Consistency isn't about being perfect. It's about showing up, even just to say 'I didn't show up today.'" },
                ],
                japanese: [
                    { speaker: 'male' as const, text: "トレーナー、今日の報告は…まあ、報告することがないんですけど。" },
                    { speaker: 'female' as const, text: "何もない？どういうこと？" },
                    { speaker: 'male' as const, text: "何もしてないです。英語のノートも作らなかったし、運動もしてない。ジャーナル書いただけ。" },
                    { speaker: 'female' as const, text: "休息日も大事なんだよ、知ってる？" },
                    { speaker: 'male' as const, text: "そうですけど、これは計画的な休息じゃなくて。ただ…やる気が出なかっただけで。" },
                    { speaker: 'female' as const, text: "正直に言えること自体が進歩だよ。大抵の人は報告すらしないからね。" },
                    { speaker: 'male' as const, text: "確かに。透明性ですよ。何もしなかった日も見せる。" },
                    { speaker: 'female' as const, text: "そう。継続って完璧であることじゃない。『今日はサボった』って報告するために現れることなんだ。" },
                ],
                generatedAt: new Date('2026-01-13'),
            },
            healthInfo: {
                topic: '休息と正直さの価値',
                englishTopic: 'The Value of Rest and Honesty',
                summary: '完璧を求めず、「何もしなかった」と認めることも継続の一部。自分に正直であることが、長期的な習慣形成につながります。',
                englishSummary: 'Not seeking perfection and admitting "I did nothing" is part of consistency. Being honest with yourself leads to long-term habit formation.',
                tips: [
                    '完璧主義は継続の敵',
                    '「何もしない日」を記録することも大事',
                    '透明性が長期的なモチベーションになる',
                    '休息も戦略の一部',
                ],
                englishTips: [
                    'Perfectionism is the enemy of consistency',
                    'Recording "nothing days" is also important',
                    'Transparency becomes long-term motivation',
                    'Rest is part of the strategy',
                ],
                researchedAt: new Date('2026-01-13'),
            },
            createdAt: new Date('2026-01-13'),
            updatedAt: new Date('2026-01-13'),
        };

        const demoReport: FitnessReport = {
            id: Date.now().toString(),
            date: new Date('2026-01-12').toISOString(),
            japaneseReport: '今日は朝ぬか漬け食べた。きゅうりと大根が入ってて、めっちゃ美味しかった。その後、散歩に行って1時間以上歩いちゃった。足がめっちゃ痛い（笑）でもいい運動になった。腸内環境大事だと思って発酵食品を意識してる。',
            conversation: {
                english: [
                    { speaker: 'male' as const, text: "Hey coach, got my report for today." },
                    { speaker: 'female' as const, text: "Nice! How'd it go?" },
                    { speaker: 'male' as const, text: "So I had some nukazuke for breakfast. You know, those fermented pickles." },
                    { speaker: 'female' as const, text: "Oh yeah, the Japanese pickles! Those are actually super healthy." },
                    { speaker: 'male' as const, text: "Yeah, and then I went for a walk. Ended up walking for over an hour." },
                    { speaker: 'female' as const, text: "Wow, that's a long walk! How do you feel?" },
                    { speaker: 'male' as const, text: "Honestly? My feet are killing me. (laughs)" },
                    { speaker: 'female' as const, text: "(laughs) That's what happens! But hey, good for you getting that movement in." },
                    { speaker: 'male' as const, text: "Is it normal to feel this sore after just walking?" },
                    { speaker: 'female' as const, text: "If you're not used to it, yeah. You probably overdid it a bit. Start with 30-40 minutes next time." },
                    { speaker: 'male' as const, text: "Got it. And the pickles, are they actually good for me?" },
                    { speaker: 'female' as const, text: "Absolutely! Fermented foods are great for gut health. The probiotics help with digestion." },
                ],
                japanese: [
                    { speaker: 'male' as const, text: "トレーナー、今日の報告です。" },
                    { speaker: 'female' as const, text: "いいね！どうだった？" },
                    { speaker: 'male' as const, text: "朝、ぬか漬け食べたんですよ。発酵食品のやつ。" },
                    { speaker: 'female' as const, text: "お、日本の漬物ね！あれ実はめっちゃ健康にいいよ。" },
                    { speaker: 'male' as const, text: "そうなんですよ。で、散歩行ったんですけど、1時間以上歩いちゃって。" },
                    { speaker: 'female' as const, text: "わお、長いね！で、体調は？" },
                    { speaker: 'male' as const, text: "正直、足めっちゃ痛いです（笑）" },
                    { speaker: 'female' as const, text: "（笑）そりゃそうだよ！でもいい運動したね。" },
                    { speaker: 'male' as const, text: "散歩だけでこんな痛くなるもんですか？" },
                    { speaker: 'female' as const, text: "慣れてないとね。ちょっとやりすぎたかも。次は30〜40分から始めよう。" },
                    { speaker: 'male' as const, text: "わかりました。あと、漬物って本当に体にいいんですか？" },
                    { speaker: 'female' as const, text: "めっちゃいいよ！発酵食品は腸内環境にいい。プロバイオティクスが消化を助けるんだ。" },
                ],
                generatedAt: new Date('2026-01-12'),
            },
            healthInfo: {
                topic: 'ぬか漬けと適度な運動',
                englishTopic: 'Nukazuke and Moderate Exercise',
                summary: 'ぬか漬けは乳酸菌が豊富で腸内環境を改善します。散歩は有酸素運動として効果的ですが、やりすぎは逆効果。最初は30分程度から始めるのがベストです。',
                englishSummary: 'Nukazuke is rich in lactobacilli and improves gut health. Walking is effective aerobic exercise, but overdoing it can backfire. Starting with about 30 minutes is best.',
                tips: [
                    'ぬか漬けには乳酸菌が1億個以上含まれている',
                    'ビタミンB1が生野菜の5〜10倍に増加',
                    '塩分も含まれるので食べ過ぎ注意',
                    '散歩は1日30〜60分が理想',
                    '歩きすぎは足底筋膜炎のリスク',
                    '最初は20分から始めて徐々に増やす'
                ],
                englishTips: [
                    'Nukazuke contains over 100 million lactobacilli',
                    'Vitamin B1 increases 5-10 times compared to raw vegetables',
                    'Contains salt, so don\'t overeat',
                    'Ideal walking time is 30-60 minutes per day',
                    'Excessive walking risks plantar fasciitis',
                    'Start with 20 minutes and gradually increase'
                ],
                researchedAt: new Date('2026-01-12'),
            },
            createdAt: new Date('2026-01-12'),
            updatedAt: new Date('2026-01-12'),
        };

        setReports([didNothingReport, demoReport]);
        localStorage.setItem('fitness_reports', JSON.stringify([didNothingReport, demoReport]));
    }, []);

    const saveReports = (newReports: FitnessReport[]) => {
        setReports(newReports);
        localStorage.setItem('fitness_reports', JSON.stringify(newReports));
    };

    const generateConversationAndHealthInfo = async (japaneseReport: string) => {
        // Parse report content to extract health topics
        const hasNukazuke = japaneseReport.includes('ぬか漬け') || japaneseReport.includes('漬物') || japaneseReport.includes('発酵');
        const hasWalking = japaneseReport.includes('散歩') || japaneseReport.includes('歩') || japaneseReport.includes('ウォーキング');
        const hasPain = japaneseReport.includes('痛い') || japaneseReport.includes('疲れ') || japaneseReport.includes('足');
        const hasProtein = japaneseReport.includes('プロテイン') || japaneseReport.includes('たんぱく質') || japaneseReport.includes('鶏肉');

        // Generate conversation based on content
        let conversation;
        let healthInfo;

        if (hasNukazuke && hasWalking) {
            // Nukazuke + Walking conversation
            conversation = {
                english: [
                    { speaker: 'male' as const, text: "Hey coach, got my report for today." },
                    { speaker: 'female' as const, text: "Nice! How'd it go?" },
                    { speaker: 'male' as const, text: "So I had some nukazuke for breakfast. You know, those fermented pickles." },
                    { speaker: 'female' as const, text: "Oh yeah, the Japanese pickles! Those are actually super healthy." },
                    { speaker: 'male' as const, text: "Yeah, and then I went for a walk. Ended up walking for over an hour." },
                    { speaker: 'female' as const, text: "Wow, that's a long walk! How do you feel?" },
                    { speaker: 'male' as const, text: "Honestly? My feet are killing me. (laughs)" },
                    { speaker: 'female' as const, text: "(laughs) That's what happens! But hey, good for you getting that movement in." },
                    { speaker: 'male' as const, text: "Is it normal to feel this sore after just walking?" },
                    { speaker: 'female' as const, text: "If you're not used to it, yeah. You probably overdid it a bit. Start with 30-40 minutes next time." },
                    { speaker: 'male' as const, text: "Got it. And the pickles, are they actually good for me?" },
                    { speaker: 'female' as const, text: "Absolutely! Fermented foods are great for gut health. The probiotics help with digestion." },
                ],
                japanese: [
                    { speaker: 'male' as const, text: "トレーナー、今日の報告です。" },
                    { speaker: 'female' as const, text: "いいね！どうだった？" },
                    { speaker: 'male' as const, text: "朝、ぬか漬け食べたんですよ。発酵食品のやつ。" },
                    { speaker: 'female' as const, text: "お、日本の漬物ね！あれ実はめっちゃ健康にいいよ。" },
                    { speaker: 'male' as const, text: "そうなんですよ。で、散歩行ったんですけど、1時間以上歩いちゃって。" },
                    { speaker: 'female' as const, text: "わお、長いね！で、体調は？" },
                    { speaker: 'male' as const, text: "正直、足めっちゃ痛いです（笑）" },
                    { speaker: 'female' as const, text: "（笑）そりゃそうだよ！でもいい運動したね。" },
                    { speaker: 'male' as const, text: "散歩だけでこんな痛くなるもんですか？" },
                    { speaker: 'female' as const, text: "慣れてないとね。ちょっとやりすぎたかも。次は30〜40分から始めよう。" },
                    { speaker: 'male' as const, text: "わかりました。あと、漬物って本当に体にいいんですか？" },
                    { speaker: 'female' as const, text: "めっちゃいいよ！発酵食品は腸内環境にいい。プロバイオティクスが消化を助けるんだ。" },
                ],
                generatedAt: new Date(),
            };

            healthInfo = {
                topic: 'ぬか漬けと適度な運動',
                englishTopic: 'Nukazuke and Moderate Exercise',
                summary: 'ぬか漬けは乳酸菌が豊富で腸内環境を改善します。散歩は有酸素運動として効果的ですが、やりすぎは逆効果。最初は30分程度から始めるのがベストです。',
                englishSummary: 'Nukazuke is rich in lactobacilli and improves gut health. Walking is effective aerobic exercise, but overdoing it can backfire. Starting with about 30 minutes is best.',
                tips: [
                    'ぬか漬けには乳酸菌が1億個以上含まれている',
                    'ビタミンB1が生野菜の5〜10倍に増加',
                    '塩分も含まれるので食べ過ぎ注意',
                    '散歩は1日30〜60分が理想',
                    '歩きすぎは足底筋膜炎のリスク',
                    '最初は20分から始めて徐々に増やす'
                ],
                englishTips: [
                    'Nukazuke contains over 100 million lactobacilli',
                    'Vitamin B1 increases 5-10 times compared to raw vegetables',
                    'Contains salt, so don\'t overeat',
                    'Ideal walking time is 30-60 minutes per day',
                    'Excessive walking risks plantar fasciitis',
                    'Start with 20 minutes and gradually increase'
                ],
                researchedAt: new Date(),
            };
        } else if (hasProtein) {
            // Protein-focused conversation
            conversation = {
                english: [
                    { speaker: 'male' as const, text: "Hey, here's today's update." },
                    { speaker: 'female' as const, text: "Go ahead!" },
                    { speaker: 'male' as const, text: japaneseReport },
                    { speaker: 'female' as const, text: "Good protein intake! That's important for muscle recovery." },
                ],
                japanese: [
                    { speaker: 'male' as const, text: "今日の報告です。" },
                    { speaker: 'female' as const, text: "どうぞ！" },
                    { speaker: 'male' as const, text: japaneseReport },
                    { speaker: 'female' as const, text: "タンパク質しっかり取れてるね！筋肉の回復に大事だよ。" },
                ],
                generatedAt: new Date(),
            };

            healthInfo = {
                topic: 'タンパク質の重要性',
                englishTopic: 'The Importance of Protein',
                summary: 'タンパク質は筋肉の修復と成長に不可欠です。体重1kgあたり1.6〜2.2gが推奨されます。',
                englishSummary: 'Protein is essential for muscle repair and growth. 1.6-2.2g per kg of body weight is recommended.',
                tips: [
                    '運動後30分以内に摂取が効果的',
                    '鶏胸肉100gで約23gのタンパク質',
                    'プロテインパウダーは補助的に使用',
                ],
                englishTips: [
                    'Most effective within 30 minutes after exercise',
                    '100g chicken breast contains about 23g protein',
                    'Use protein powder as a supplement',
                ],
                researchedAt: new Date(),
            };
        } else {
            // Generic conversation
            conversation = {
                english: [
                    { speaker: 'male' as const, text: "Hey coach, here's my report for today." },
                    { speaker: 'female' as const, text: "Sure! How'd it go?" },
                    { speaker: 'male' as const, text: japaneseReport },
                    { speaker: 'female' as const, text: "Good work! Keep it up." },
                ],
                japanese: [
                    { speaker: 'male' as const, text: "トレーナー、今日の報告です。" },
                    { speaker: 'female' as const, text: "いいよ！どうだった？" },
                    { speaker: 'male' as const, text: japaneseReport },
                    { speaker: 'female' as const, text: "いいね！その調子で！" },
                ],
                generatedAt: new Date(),
            };

            healthInfo = {
                topic: '健康的な生活習慣',
                englishTopic: 'Healthy Lifestyle',
                summary: 'バランスの取れた食事と適度な運動が健康の基本です。',
                englishSummary: 'Balanced diet and moderate exercise are the foundation of health.',
                tips: [
                    '毎日の記録が継続のコツ',
                    '無理せず自分のペースで',
                ],
                englishTips: [
                    'Daily tracking is the key to consistency',
                    'Don\'t push too hard, go at your own pace',
                ],
                researchedAt: new Date(),
            };
        }

        return { conversation, healthInfo };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!japaneseInput.trim()) return;

        setIsGenerating(true);

        try {
            const { conversation, healthInfo } = await generateConversationAndHealthInfo(japaneseInput);

            const newReport: FitnessReport = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                japaneseReport: japaneseInput,
                conversation,
                healthInfo,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            saveReports([newReport, ...reports]);
            setJapaneseInput('');
            setIsCreating(false);
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const t = theme;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            month: date.getMonth() + 1,
            day: date.getDate(),
            year: date.getFullYear(),
        };
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: t.bg, color: t.text }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/english" style={{ color: t.textMuted, textDecoration: 'none', fontSize: '13px' }}>
                    &#8249; Back to English
                </Link>
            </div>

            <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
                {/* Title */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px' }}>Fitness Report</h1>
                    <p style={{ fontSize: '14px', color: t.textMuted, margin: 0 }}>
                        トレーナーへの報告 • {reports.length} reports
                    </p>
                </div>

                {/* Create Report Button */}
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: t.accent,
                            color: '#000',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginBottom: '32px',
                        }}
                    >
                        + New Report
                    </button>
                )}

                {/* Create Report Form */}
                {isCreating && (
                    <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
                        <div style={{ backgroundColor: t.bgSecondary, borderRadius: '12px', padding: '24px', border: `1px solid ${t.border}` }}>
                            <label style={{ fontSize: '14px', color: t.text, marginBottom: '12px', display: 'block', fontWeight: '600' }}>
                                今日の報告（日本語で自由に書く）
                            </label>
                            <textarea
                                value={japaneseInput}
                                onChange={(e) => setJapaneseInput(e.target.value)}
                                placeholder="例：今日は朝プロテイン飲んで、昼に鶏胸肉とブロッコリー食べた。ジムで胸と背中のトレーニング。調子良かった。"
                                style={{
                                    width: '100%',
                                    minHeight: '150px',
                                    padding: '16px',
                                    backgroundColor: t.bg,
                                    border: `1px solid ${t.borderLight}`,
                                    borderRadius: '8px',
                                    color: t.text,
                                    fontSize: '15px',
                                    fontFamily: 'inherit',
                                    lineHeight: '1.6',
                                    resize: 'vertical',
                                }}
                            />
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button
                                    type="submit"
                                    disabled={!japaneseInput.trim() || isGenerating}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: japaneseInput.trim() ? t.accent : t.borderLight,
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: japaneseInput.trim() ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    {isGenerating ? 'Generating...' : 'Submit Report'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsCreating(false); setJapaneseInput(''); }}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: 'transparent',
                                        color: t.textMuted,
                                        border: `1px solid ${t.borderLight}`,
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Reports List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reports.map((report) => {
                        const { month, day, year } = formatDate(report.date);
                        const expanded = expandedIds.has(report.id);
                        const toggleExpanded = () => {
                            const newSet = new Set(expandedIds);
                            if (expanded) {
                                newSet.delete(report.id);
                            } else {
                                newSet.add(report.id);
                            }
                            setExpandedIds(newSet);
                        };

                        return (
                            <div
                                key={report.id}
                                style={{
                                    backgroundColor: t.bgSecondary,
                                    borderRadius: '12px',
                                    padding: '20px',
                                    border: `1px solid ${t.border}`,
                                }}
                            >
                                {/* Header */}
                                <div onClick={toggleExpanded} style={{ cursor: 'pointer' }}>
                                    <div style={{ fontSize: '11px', color: t.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                                        {year}/{month}/{day}
                                    </div>
                                    <div style={{ fontSize: '15px', color: t.text, lineHeight: '1.6', marginBottom: '12px' }}>
                                        {report.japaneseReport.substring(0, 100)}
                                        {report.japaneseReport.length > 100 && '...'}
                                    </div>
                                    {report.healthInfo && (
                                        <div style={{ fontSize: '13px', color: t.textMuted, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span>💡</span>
                                            <span>{report.healthInfo.topic}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Expanded View */}
                                {expanded && report.conversation && (
                                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${t.border}` }}>
                                        {/* Conversation */}
                                        <div style={{ marginBottom: '24px' }}>
                                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '16px' }}>
                                                English Conversation
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {report.conversation.english.map((line, i) => (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            display: 'flex',
                                                            gap: '12px',
                                                            alignItems: 'flex-start',
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            backgroundColor: line.speaker === 'male' ? '#4A90E2' : '#10b981',
                                                            flexShrink: 0,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            color: '#fff',
                                                        }}>
                                                            {line.speaker === 'male' ? 'T' : 'A'}
                                                        </div>
                                                        <div style={{
                                                            flex: 1,
                                                            backgroundColor: t.bg,
                                                            padding: '12px 16px',
                                                            borderRadius: '12px',
                                                            fontSize: '14px',
                                                            lineHeight: '1.6',
                                                            color: t.text,
                                                        }}>
                                                            {line.text}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Health Info */}
                                        {report.healthInfo && (
                                            <div>
                                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '12px' }}>
                                                    Health Information
                                                </h3>
                                                <div style={{ backgroundColor: t.bg, padding: '16px', borderRadius: '12px' }}>
                                                    <div style={{ fontSize: '13px', fontWeight: '600', color: t.accent, marginBottom: '8px' }}>
                                                        {report.healthInfo.englishTopic}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: t.text, lineHeight: '1.6', marginBottom: '12px' }}>
                                                        {report.healthInfo.englishSummary}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: t.textMuted }}>
                                                        <strong>Tips:</strong>
                                                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                                                            {report.healthInfo.englishTips.map((tip, i) => (
                                                                <li key={i} style={{ marginBottom: '4px' }}>{tip}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {reports.length === 0 && !isCreating && (
                        <div style={{ textAlign: 'center', padding: '60px 24px', color: t.textMuted }}>
                            <p>No reports yet</p>
                            <p style={{ fontSize: '13px', marginTop: '8px' }}>
                                Click "New Report" to get started
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
