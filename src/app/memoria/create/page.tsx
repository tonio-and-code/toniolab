'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MemoriaStorage } from '@/lib/memoria-storage';
import { MemoriaEntry, ConversationTone } from '@/types/memoria';

type ThemeMode = 'dark' | 'light';

const themes = {
    dark: {
        bg: '#0a0a0a',
        bgSecondary: '#1a1a1a',
        text: '#fff',
        textMuted: '#666',
        border: '#1a1a1a',
        borderLight: '#333',
        accent: '#D4AF37',
    },
    light: {
        bg: '#f5f5f5',
        bgSecondary: '#ffffff',
        text: '#1a1a1a',
        textMuted: '#666',
        border: '#e5e5e5',
        borderLight: '#d5d5d5',
        accent: '#B8960C',
    },
};

export default function CreateMemoriaPage() {
    const router = useRouter();
    const [theme] = useState<ThemeMode>('light');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tone, setTone] = useState<ConversationTone>('casual');
    const [generating, setGenerating] = useState(false);

    const t = themes[theme];

    const handleCreate = async () => {
        if (!title.trim() || !content.trim()) {
            alert('タイトルと内容を入力してください');
            return;
        }

        setGenerating(true);

        try {
            // エントリーを作成
            const newEntry: MemoriaEntry = {
                id: Date.now().toString(),
                date: new Date().toISOString().split('T')[0],
                title: title.trim(),
                content: content.trim(),
                tone,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // 保存
            await MemoriaStorage.save(newEntry);

            // 会話を生成（バックグラウンドで）
            fetch('/api/memoria/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content.trim(),
                    tone,
                    targetDuration: 'short',
                }),
            })
                .then(res => res.json())
                .then(async data => {
                    if (data.conversation) {
                        newEntry.conversation = {
                            english: data.conversation,
                            japanese: [],
                            generatedAt: new Date(data.generatedAt),
                            tone,
                        };
                        await MemoriaStorage.save(newEntry);
                    }
                })
                .catch(console.error);

            // 詳細ページへ遷移
            router.push(`/memoria/${newEntry.id}`);
        } catch (error) {
            console.error('Failed to create entry:', error);
            alert('日記の作成に失敗しました');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: t.bg, color: t.text }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/memoria" style={{ color: t.textMuted, textDecoration: 'none', fontSize: '13px' }}>
                    &#8249; Back
                </Link>
            </div>

            <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>新しい日記</h1>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: t.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        タイトル
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="今日の出来事"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: t.bgSecondary,
                            border: `1px solid ${t.borderLight}`,
                            borderRadius: '8px',
                            color: t.text,
                            fontSize: '15px',
                            outline: 'none',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: t.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        内容（日本語）
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="今日はカメラを選んでいた。散歩道を記録するために..."
                        rows={10}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: t.bgSecondary,
                            border: `1px solid ${t.borderLight}`,
                            borderRadius: '8px',
                            color: t.text,
                            fontSize: '15px',
                            outline: 'none',
                            resize: 'vertical',
                            lineHeight: '1.6',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: t.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        会話のトーン
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {(['casual', 'formal', 'philosophical', 'humorous'] as ConversationTone[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTone(t)}
                                style={{
                                    padding: '12px',
                                    backgroundColor: tone === t ? themes[theme].accent : themes[theme].bgSecondary,
                                    color: tone === t ? '#000' : themes[theme].text,
                                    border: `1px solid ${tone === t ? themes[theme].accent : themes[theme].borderLight}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: tone === t ? '600' : '400',
                                }}
                            >
                                {t === 'casual' && 'カジュアル'}
                                {t === 'formal' && 'フォーマル'}
                                {t === 'philosophical' && '哲学的'}
                                {t === 'humorous' && 'ユーモア'}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    disabled={generating || !title.trim() || !content.trim()}
                    style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: generating ? t.textMuted : t.accent,
                        color: '#000',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: generating ? 'not-allowed' : 'pointer',
                        fontSize: '15px',
                        fontWeight: '600',
                    }}
                >
                    {generating ? '作成中...' : '日記を作成'}
                </button>

                <p style={{ fontSize: '13px', color: t.textMuted, marginTop: '16px', textAlign: 'center' }}>
                    日記を作成すると、AIが自動的に英語会話を生成します
                </p>
            </div>
        </div>
    );
}
