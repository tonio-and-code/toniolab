'use client';

import Link from 'next/link';

const LEVELS = [
    {
        level: 1,
        name: 'SEED',
        ja: '種',
        subtitle: 'Root Chakra',
        meaning: '種を蒔いた段階。まだ触れただけ。',
        howTo: '登録した時点で自動的にここからスタート。',
        gradFrom: '#F87171',
        gradTo: '#FECACA',
        color: '#B91C1C',
    },
    {
        level: 2,
        name: 'SPARK',
        ja: '芽',
        subtitle: 'Sacral Chakra',
        meaning: '火がついた。意識し始めた。',
        howTo: 'カードをクリックしてLv.2に上げる。',
        gradFrom: '#FB923C',
        gradTo: '#FED7AA',
        color: '#C2410C',
    },
    {
        level: 3,
        name: 'FORGE',
        ja: '鍛',
        subtitle: 'Solar Plexus',
        meaning: '鍛錬中。繰り返し使って定着させてる。',
        howTo: 'クリックでLv.3へ。復習モードで繰り返す。',
        gradFrom: '#FACC15',
        gradTo: '#FEF08A',
        color: '#A16207',
    },
    {
        level: 4,
        name: 'OWN',
        ja: '得',
        subtitle: 'Heart Chakra',
        meaning: '自分のものにした。考えなくても出てくる。',
        howTo: 'クリックでLv.4へ。ここからが「使える」ライン。',
        gradFrom: '#4ADE80',
        gradTo: '#BBF7D0',
        color: '#166534',
    },
    {
        level: 5,
        name: 'VOICE',
        ja: '声',
        subtitle: 'Throat Chakra',
        meaning: '声に出した。口が覚えてる。',
        howTo: 'Lv.4 + 録音がある状態で自動昇格。',
        gradFrom: '#60A5FA',
        gradTo: '#BFDBFE',
        color: '#1E40AF',
    },
    {
        level: 6,
        name: 'VISION',
        ja: '研',
        subtitle: 'Third Eye',
        meaning: '実際の使われ方を見た。文脈を理解してる。',
        howTo: 'Lv.4 + 録音 + リンクがある状態で自動昇格。',
        gradFrom: '#818CF8',
        gradTo: '#C7D2FE',
        color: '#3730A3',
    },
    {
        level: 7,
        name: 'CROWN',
        ja: '極',
        subtitle: 'Crown Chakra',
        meaning: '完全に自分の一部。もう「学んだ」ではなく「持ってる」。',
        howTo: 'Lv.6から手動で宣言。確認ダイアログで覚悟を決める。',
        gradFrom: '#A855F7',
        gradTo: '#DDD6FE',
        color: '#6B21A8',
    },
];

export default function ChakraGuidePage() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#FAFAF9',
        }}>
            {/* Hero */}
            <div style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
                padding: '60px 24px 80px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Subtle chakra glow in background */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    height: '400px',
                    background: 'linear-gradient(180deg, #A855F7 0%, #818CF8 15%, #60A5FA 30%, #4ADE80 45%, #FACC15 60%, #FB923C 75%, #F87171 90%)',
                    opacity: 0.08,
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#D4AF37',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                    }}>
                        Mastery System
                    </div>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '800',
                        color: '#fff',
                        margin: '0 0 12px',
                        letterSpacing: '-0.5px',
                    }}>
                        Chakra Dashboard
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#999',
                        maxWidth: '480px',
                        margin: '0 auto 24px',
                        lineHeight: 1.6,
                    }}>
                        Lv.1〜7 の7段階で言葉の「定着度」を可視化する。
                        <br />
                        種を蒔いて、鍛えて、声に出して、最後は自分の一部にする。
                    </p>
                    <Link
                        href="/english/training"
                        style={{
                            display: 'inline-block',
                            padding: '10px 24px',
                            background: '#D4AF37',
                            color: '#000',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: '600',
                        }}
                    >
                        ← Dashboard
                    </Link>
                </div>
            </div>

            {/* Chakra spine */}
            <div style={{
                maxWidth: '640px',
                margin: '0 auto',
                padding: '0 24px 80px',
                position: 'relative',
            }}>
                {/* Vertical line connecting all levels */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '-40px',
                    bottom: '80px',
                    width: '2px',
                    background: 'linear-gradient(180deg, #A855F7, #818CF8, #60A5FA, #4ADE80, #FACC15, #FB923C, #F87171)',
                    opacity: 0.2,
                    transform: 'translateX(-50%)',
                }} />

                {/* Level cards - CROWN at top, SEED at bottom */}
                {[...LEVELS].reverse().map((lv, i) => (
                    <div
                        key={lv.level}
                        style={{
                            position: 'relative',
                            marginTop: i === 0 ? '-40px' : '0px',
                            marginBottom: '16px',
                            zIndex: 1,
                        }}
                    >
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                            border: '1px solid #e5e5e5',
                        }}>
                            {/* Gradient top bar */}
                            <div style={{
                                height: '4px',
                                background: `linear-gradient(90deg, ${lv.gradFrom}, ${lv.gradTo})`,
                            }} />

                            <div style={{ padding: '20px 24px' }}>
                                {/* Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '12px',
                                }}>
                                    {/* Level circle */}
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${lv.gradFrom}, ${lv.gradTo})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: '800',
                                        color: '#fff',
                                        flexShrink: 0,
                                    }}>
                                        {lv.ja}
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            color: lv.color,
                                            letterSpacing: '1px',
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            gap: '6px',
                                        }}>
                                            <span style={{ fontSize: '13px', fontWeight: '600', opacity: 0.6 }}>Lv.{lv.level}</span>
                                            {lv.ja} {lv.name}
                                        </div>
                                        <div style={{
                                            fontSize: '11px',
                                            color: '#aaa',
                                            fontWeight: '500',
                                        }}>
                                            {lv.subtitle}
                                        </div>
                                    </div>
                                    {/* Auto badge for VOICE/VISION */}
                                    {(lv.level === 4 || lv.level === 5) && (
                                        <span style={{
                                            marginLeft: 'auto',
                                            fontSize: '9px',
                                            fontWeight: '700',
                                            color: lv.color,
                                            background: `${lv.gradTo}`,
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            letterSpacing: '0.5px',
                                        }}>
                                            AUTO
                                        </span>
                                    )}
                                    {lv.level === 6 && (
                                        <span style={{
                                            marginLeft: 'auto',
                                            fontSize: '9px',
                                            fontWeight: '700',
                                            color: '#6B21A8',
                                            background: '#EDE9FE',
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            letterSpacing: '0.5px',
                                        }}>
                                            MANUAL
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <p style={{
                                    fontSize: '14px',
                                    color: '#444',
                                    margin: '0 0 8px',
                                    lineHeight: 1.6,
                                }}>
                                    {lv.meaning}
                                </p>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#888',
                                    background: '#FAFAF9',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    lineHeight: 1.5,
                                }}>
                                    {lv.howTo}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* How the calendar works */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    marginTop: '32px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    border: '1px solid #e5e5e5',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <h2 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#333',
                        margin: '0 0 16px',
                    }}>
                        Calendar Bars
                    </h2>
                    <p style={{
                        fontSize: '13px',
                        color: '#666',
                        lineHeight: 1.7,
                        margin: '0 0 16px',
                    }}>
                        カレンダーの各日に表示される7本のバーは、上がCROWN、下がSEED。
                        各バーは<strong>累計方式</strong>：「そのレベル以上に到達したフレーズ数」を表す。
                    </p>

                    {/* Visual example */}
                    <div style={{
                        background: '#FAFAF9',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '16px',
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#999', marginBottom: '10px' }}>
                            Example: 10 phrases
                        </div>
                        {[
                            { name: 'CROWN', reached: 0, color: '#A855F7', gradFrom: '#A855F7', gradTo: '#DDD6FE' },
                            { name: 'VISION', reached: 0, color: '#818CF8', gradFrom: '#818CF8', gradTo: '#C7D2FE' },
                            { name: 'VOICE', reached: 0, color: '#60A5FA', gradFrom: '#60A5FA', gradTo: '#BFDBFE' },
                            { name: 'OWN', reached: 2, color: '#4ADE80', gradFrom: '#4ADE80', gradTo: '#BBF7D0' },
                            { name: 'FORGE', reached: 5, color: '#FACC15', gradFrom: '#FACC15', gradTo: '#FEF08A' },
                            { name: 'SPARK', reached: 8, color: '#FB923C', gradFrom: '#FB923C', gradTo: '#FED7AA' },
                            { name: 'SEED', reached: 10, color: '#F87171', gradFrom: '#F87171', gradTo: '#FECACA' },
                        ].map(row => (
                            <div key={row.name} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '4px',
                            }}>
                                <span style={{ fontSize: '9px', fontWeight: '700', color: '#aaa', width: '44px', textAlign: 'right' }}>
                                    {row.name}
                                </span>
                                <div style={{
                                    flex: 1,
                                    height: '10px',
                                    borderRadius: '5px',
                                    backgroundColor: '#E8E5DE',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${(row.reached / 10) * 100}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, ${row.gradFrom}, ${row.gradTo})`,
                                        borderRadius: '5px',
                                        transition: 'width 0.5s ease-out',
                                    }} />
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: '600', color: '#888', width: '30px' }}>
                                    {row.reached}/10
                                </span>
                            </div>
                        ))}
                    </div>

                    <p style={{
                        fontSize: '12px',
                        color: '#999',
                        lineHeight: 1.6,
                        margin: 0,
                    }}>
                        SEEDは常に100%（全フレーズがSEEDは通過済み）。
                        上のレベルほど少なくなり、CROWNまで到達したフレーズが多いほど
                        バーが上まで伸びる。バーをクリックするとそのレベルだけ絞り込める。
                    </p>
                </div>

                {/* Key rules */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    marginTop: '16px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    border: '1px solid #e5e5e5',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <h2 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#333',
                        margin: '0 0 16px',
                    }}>
                        Rules
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { label: '手動', desc: 'Lv.1 → 2 → 3 → 4 はクリックで進む', color: '#D4AF37' },
                            { label: '自動', desc: 'Lv.5 VOICE / Lv.6 VISION は条件を満たすと勝手に上がる', color: '#60A5FA' },
                            { label: '宣言', desc: 'Lv.7 CROWN は自分で決める。ボタンを押して確認する', color: '#A855F7' },
                            { label: '不可逆', desc: 'CROWNからリセットするとLv.1に戻る（確認あり）', color: '#EF4444' },
                        ].map(rule => (
                            <div key={rule.label} style={{
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'flex-start',
                            }}>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    color: rule.color,
                                    background: `${rule.color}15`,
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    flexShrink: 0,
                                    marginTop: '1px',
                                }}>
                                    {rule.label}
                                </span>
                                <span style={{ fontSize: '13px', color: '#555', lineHeight: 1.5 }}>
                                    {rule.desc}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
