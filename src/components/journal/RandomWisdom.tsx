'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Curated wisdom quotes from journal entries
const WISDOM_QUOTES = [
    {
        text: "気づきが、気づき自身を知る。",
        textEn: "Awareness aware of itself.",
        source: "Be Aware of Being Aware",
        entryId: "084"
    },
    {
        text: "集中＝夢中＝何かにINになっている＝夢の中",
        textEn: "Concentration = absorption = being IN something = dreaming",
        source: "Be Aware of Being Aware",
        entryId: "084"
    },
    {
        text: "やることがない。でもそれに気づくことはできる。",
        textEn: "There's nothing to do. But you can notice that.",
        source: "Be Aware of Being Aware",
        entryId: "084"
    },
    {
        text: "気づきゲーは、プレイした瞬間に勝利が確定する唯一のゲーム",
        textEn: "The awareness game is the only game where you win the moment you play",
        source: "Be Aware of Being Aware",
        entryId: "084"
    },
    {
        text: "意図を持った瞬間、気づきから離れる。",
        textEn: "The moment you have intention, you leave awareness.",
        source: "Be Aware of Being Aware",
        entryId: "084"
    },
    {
        text: "信じていることは、透明になる。水の中の魚が「水って何？」と聞くように。",
        textEn: "What you believe becomes invisible. Like a fish asking 'what is water?'",
        source: "Be Aware of Being Aware",
        entryId: "084"
    },
    {
        text: "感情は「身体の状態」＋「言語的ラベル」で構成される。",
        textEn: "Emotions are constructed from body states + linguistic labels.",
        source: "Be Aware of Being Aware",
        entryId: "084"
    },
    {
        text: "人間の不幸はすべて、部屋に一人で静かに座っていられないことから来る",
        textEn: "All of humanity's problems stem from our inability to sit quietly in a room alone",
        source: "Pascal / Be Aware of Being Aware",
        entryId: "084"
    },
    {
        text: "気づきに気づいていない人間は、AIと同じ状態。それが無明。",
        textEn: "Humans not aware of their awareness are in the same state as AI. That's avidya.",
        source: "AIには気づきがない",
        entryId: "085"
    },
    {
        text: "AIは、自分が何を見逃しているかすら分からない。",
        textEn: "AI can't even know what it's missing.",
        source: "AIには気づきがない",
        entryId: "085"
    },
    {
        text: "違いは知性じゃない。気づきが、気づき自身を知っているかどうか。",
        textEn: "The difference isn't intelligence. It's whether awareness knows itself.",
        source: "AIには気づきがない",
        entryId: "085"
    }
];

export default function RandomWisdom() {
    const [quote, setQuote] = useState(WISDOM_QUOTES[0]);
    const [isVisible, setIsVisible] = useState(true);

    const getRandomQuote = () => {
        setIsVisible(false);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * WISDOM_QUOTES.length);
            setQuote(WISDOM_QUOTES[randomIndex]);
            setIsVisible(true);
        }, 300);
    };

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * WISDOM_QUOTES.length);
        setQuote(WISDOM_QUOTES[randomIndex]);
    }, []);

    return (
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Random Wisdom
                </h3>
                <button
                    onClick={getRandomQuote}
                    className="text-stone-400 hover:text-white transition-colors p-2"
                    aria-label="Get new quote"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <blockquote className="text-xl font-medium leading-relaxed mb-4">
                    "{quote.text}"
                </blockquote>

                <p className="text-stone-400 text-sm italic mb-6">
                    "{quote.textEn}"
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-stone-500 text-sm">
                        — {quote.source}
                    </span>
                    <Link
                        href={`/journal/${quote.entryId}`}
                        className="text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors"
                    >
                        Read entry
                    </Link>
                </div>
            </div>
        </div>
    );
}
