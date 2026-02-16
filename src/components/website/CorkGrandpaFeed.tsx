'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function CorkGrandpaFeed() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [mounted, setMounted] = useState(false);

    // 初期状態をlocalStorageから読み込み
    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem('cork_grandpa_visible');
            if (saved === 'false') setIsVisible(false);
        } catch {
            // silent
        }
    }, []);

    // 状態変更時にlocalStorageに保存
    useEffect(() => {
        if (!mounted) return;
        try {
            localStorage.setItem('cork_grandpa_visible', String(isVisible));
        } catch {
            // silent
        }
    }, [isVisible, mounted]);

    useEffect(() => {
        if (!isLoaded) {
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            script.charset = 'utf-8';
            script.onload = () => setIsLoaded(true);
            document.body.appendChild(script);
        }
    }, [isLoaded]);

    if (!mounted) return null;

    // 閉じた場合は控えめなバーを表示
    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 left-0 z-40 hidden lg:block group"
            >
                <div className="w-1 h-16 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60 hover:w-2 transition-all duration-300 rounded-r-full" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 z-40 w-72 hidden lg:block">
            <div className="bg-gradient-to-b from-[#1a1612] to-[#0d0a08] border border-[#D4AF37]/40 shadow-2xl overflow-hidden">
                {/* ゴールドアクセントライン */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

                {/* ヘッダー */}
                <div className="px-4 py-3 flex items-center justify-between">
                    <div>
                        <span className="text-sm font-bold text-[#D4AF37] tracking-wide">コルクじじい</span>
                        <span className="text-xs text-[#D4AF37]/60 ml-2">@korku_jijii</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="https://twitter.com/korku_jijii"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors"
                        >
                            X
                        </a>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors p-1"
                            title="閉じる"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* 区切り線 */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mx-4" />

                {/* Twitter埋め込み */}
                <div className="max-h-72 overflow-y-auto bg-white/95">
                    <a
                        className="twitter-timeline"
                        data-height="280"
                        data-theme="light"
                        data-chrome="noheader nofooter noborders transparent"
                        href="https://twitter.com/korku_jijii"
                    >
                        <span className="text-xs text-slate-400 p-4 block">読み込み中...</span>
                    </a>
                </div>

                {/* 下部アクセント */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
            </div>
        </div>
    );
}
