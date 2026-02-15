/**
 * テスト用エントリ - 子犬が可愛い (vocabulary機能テスト)
 */

import { JournalEntry } from '../types';

export const puppyTestEntry: JournalEntry = {
    id: '999',
    date: '2026-01-23',
    title: '子犬が可愛すぎる件について',
    summary: '散歩中に子犬に遭遇。あまりの可愛さに仕事が手につかない。',
    featured: false,
    readTime: 2,
    businessTags: ['日常', '癒し'],
    techTags: [],
    heroImage: '/images/journal/fluffy-shiba-puppy.png',
    englishSummary: {
        title: "I Met a Puppy and Now I Can't Focus on Anything",
        readTime: 2,
        sections: [
            {
                heading: "The Encounter",
                paragraphs: [
                    "So I was on my walk today, right? And I see this puppy. A Shiba Inu. Tiny little fluffy thing with the smallest paws you've ever seen.",
                    "I couldn't help myself. I just... started pettin' it. Like, no hesitation."
                ]
            },
            {
                heading: "Completely Gone",
                paragraphs: [
                    "The owner said he's a handful. Super mischievous, stubborn streak a mile long. But honestly? That's part of the charm.",
                    "I'm completely smitten. Can't focus on work. Might need to get one myself someday."
                ]
            }
        ]
    },
    conversationData: {
        english: [
            { speaker: 'male', text: "I saw the most adorable puppy on my walk today. I couldn't resist petting it." },
            { speaker: 'female', text: "Oh, what breed was it? I'm a sucker for golden retrievers." },
            { speaker: 'male', text: "It was a fluffy Shiba Inu. Those tiny paws were irresistible!" },
            { speaker: 'female', text: "Shibas are so mischievous though. They have such a stubborn streak." },
            { speaker: 'male', text: "True, but that's part of their charm. The owner said he's a handful." },
            { speaker: 'female', text: "Did you get your puppy fix for the day, or are you still craving more cuteness?" },
            { speaker: 'male', text: "I'm completely smitten. I might have to get one myself someday." },
        ],
        japanese: [
            { speaker: 'male', text: "今日散歩してたらめっちゃ可愛い子犬いてさ。つい撫でちゃった。" },
            { speaker: 'female', text: "え、何犬？私ゴールデンレトリバー見ると絶対やられるんだよね。" },
            { speaker: 'male', text: "もふもふの柴犬！あの小っちゃい肉球、反則だって！" },
            { speaker: 'female', text: "柴ってやんちゃだよね〜。頑固なとこあるし。" },
            { speaker: 'male', text: "まあね、でもそれも含めて可愛いじゃん。飼い主さんが手ぇ焼くって言ってたわ。" },
            { speaker: 'female', text: "今日の子犬成分は補給できた？まだ足りない？" },
            { speaker: 'male', text: "もう完全にメロメロ。いつか自分も飼いたいわ〜。" },
        ],
        tone: 'casual',
        generatedAt: new Date('2026-01-23'),
        vocabulary: [
            {
                word: "adorable",
                meaning: "めっちゃ可愛い",
                type: "word",
                level: "B1",
                example: "I saw the most adorable puppy",
                lineIndex: 0
            },
            {
                word: "couldn't resist",
                meaning: "我慢できなかった、つい〜しちゃった",
                type: "expression",
                level: "B2",
                example: "I couldn't resist petting it",
                lineIndex: 0
            },
            {
                word: "a sucker for",
                meaning: "〜にめっぽう弱い、〜見ると絶対やられる",
                type: "idiom",
                level: "C1",
                example: "I'm a sucker for golden retrievers",
                lineIndex: 1
            },
            {
                word: "fluffy",
                meaning: "もふもふの",
                type: "word",
                level: "B1",
                example: "a fluffy Shiba Inu",
                lineIndex: 2
            },
            {
                word: "irresistible",
                meaning: "たまらん、反則級",
                type: "word",
                level: "B2",
                example: "Those tiny paws were irresistible!",
                lineIndex: 2
            },
            {
                word: "mischievous",
                meaning: "いたずらっ子な、やんちゃな",
                type: "word",
                level: "B2",
                example: "Shibas are so mischievous",
                lineIndex: 3
            },
            {
                word: "stubborn streak",
                meaning: "頑固なとこある",
                type: "collocation",
                level: "C1",
                example: "They have such a stubborn streak",
                lineIndex: 3
            },
            {
                word: "part of their charm",
                meaning: "それも含めて魅力",
                type: "expression",
                level: "B2",
                example: "that's part of their charm",
                lineIndex: 4
            },
            {
                word: "a handful",
                meaning: "手ぇ焼く、世話が大変",
                type: "idiom",
                level: "B2",
                example: "he's a handful",
                lineIndex: 4
            },
            {
                word: "get your fix",
                meaning: "〜成分を補給する",
                type: "idiom",
                level: "C1",
                example: "Did you get your puppy fix for the day",
                lineIndex: 5
            },
            {
                word: "craving",
                meaning: "欲してる、もっと欲しい",
                type: "word",
                level: "B2",
                example: "are you still craving more cuteness",
                lineIndex: 5
            },
            {
                word: "smitten",
                meaning: "完全にやられた、メロメロ",
                type: "word",
                level: "C1",
                example: "I'm completely smitten",
                lineIndex: 6
            }
        ]
    },
    conversation: `
## 2026年1月23日

散歩中に子犬に遭遇した。

柴犬の子犬。フワフワ。小さい肉球。

**可愛すぎて仕事が手につかない。**

いつか飼いたい。
`
};
