'use client';

import EnglishSidebar from '@/components/EnglishSidebar';

// ── Data tables ──

const CHAKRA_STEPS = [
    { level: 0, name: 'SEED', ja: '種', xp: 0, color: '#B91C1C', border: '#F87171', label: '登録', how: '新しいフレーズを追加' },
    { level: 1, name: 'SPARK', ja: '芽', xp: 3, color: '#C2410C', border: '#FB923C', label: '1回目タップ', how: 'レビューでタップ' },
    { level: 2, name: 'FORGE', ja: '鍛', xp: 6, color: '#A16207', border: '#FACC15', label: '2回目タップ', how: '翌日にもう一度タップ' },
    { level: 3, name: 'OWN', ja: '得', xp: 9, color: '#166534', border: '#4ADE80', label: '3回目タップ', how: 'さらに翌日タップ' },
    { level: 4, name: 'VOICE', ja: '声', xp: 10, color: '#1E40AF', border: '#60A5FA', label: '録音', how: '声を録音する' },
    { level: 5, name: 'VISION', ja: '研', xp: 10, color: '#3730A3', border: '#818CF8', label: 'リンク追加', how: '解説リンクを追加' },
    { level: 6, name: 'CROWN', ja: '極', xp: 15, color: '#6B21A8', border: '#A855F7', label: 'マスター認定', how: 'VISIONから宣言' },
];

const TITLE_LADDER = [
    { range: 'Lv. 1-5', title: '見習い', en: 'Rookie', color: '#78716C', xpStart: 0 },
    { range: 'Lv. 6-10', title: '学徒', en: 'Student', color: '#2563EB', xpStart: 458 },
    { range: 'Lv. 11-20', title: '修行者', en: 'Grinder', color: '#16A34A', xpStart: 2594 },
    { range: 'Lv. 21-30', title: '実践者', en: 'Practitioner', color: '#CA8A04', xpStart: 14765 },
    { range: 'Lv. 31-40', title: '猛者', en: 'Veteran', color: '#EA580C', xpStart: 31564 },
    { range: 'Lv. 41-60', title: '達人', en: 'Master', color: '#DC2626', xpStart: 69872 },
    { range: 'Lv. 61-80', title: '賢者', en: 'Sage', color: '#7C3AED', xpStart: 163750 },
    { range: 'Lv. 81-99', title: '伝説', en: 'Legend', color: '#D4AF37', xpStart: 287625 },
    { range: 'Lv. 100', title: '英語の神', en: 'Godlike', color: '#D4AF37', xpStart: 517543 },
];

const GACHA_TIERS = [
    { tier: 'PHANTOM', ja: '幻', prob: '0.012%', odds: '1/8192', sp: 2000, color: '#FFFFFF', bg: '#1C1917', textColor: '#fff', desc: 'ポケモン第5世代の色違いと同じ確率。画面がホワイトアウトして逆転する。' },
    { tier: 'SHINY', ja: '色違い', prob: '0.024%', odds: '1/4096', sp: 500, color: '#06B6D4', bg: '#164E63', textColor: '#fff', desc: 'ポケモン第6世代の色違い確率。全回転リールで虹色に輝く。' },
    { tier: 'MYTHIC', ja: '神話', prob: '0.25%', odds: '1/400', sp: 100, color: '#EC4899', bg: '#831843', textColor: '#fff', desc: 'パチンコの大当たり確率。画面がピンクに染まり、ハートが降ってくる。' },
    { tier: 'LEGENDARY', ja: '伝説', prob: '0.5%', odds: '1/200', sp: 30, color: '#D4AF37', bg: '#FEF9C3', textColor: '#92400E', desc: '金7揃い。レジェンド演出はフルスクリーン占拠。' },
    { tier: 'MEGA', ja: '極', prob: '2%', odds: '1/50', sp: 10, color: '#8B5CF6', bg: '#EDE9FE', textColor: '#5B21B6', desc: '赤7揃い。虹色演出 + スローモーション。' },
    { tier: 'SUPER', ja: '煌', prob: '5%', odds: '1/20', sp: 5, color: '#EF4444', bg: '#FEF2F2', textColor: '#991B1B', desc: 'BAR揃い。フルスクリーン爆発。' },
    { tier: 'GREAT', ja: '輝', prob: '10%', odds: '1/10', sp: 3, color: '#F59E0B', bg: '#FFFBEB', textColor: '#92400E', desc: 'ベル揃い。画面揺れ + パーティクル。' },
    { tier: 'BONUS', ja: '光', prob: '22%', odds: '1/4.5', sp: 2, color: '#D4AF37', bg: '#FFFBEB', textColor: '#92400E', desc: 'グレープ揃い。金キラ。' },
    { tier: '凡', ja: '', prob: '~60.7%', odds: '-', sp: 0, color: '#78716C', bg: '#F5F5F4', textColor: '#57534E', desc: 'バラバラ。でも1SPはもらえる。' },
];

const CHAIN_MODES = [
    { chain: '0-2', mode: '通常', en: 'Normal', miss: '60.7%', boost: 'x1', spMult: 'x1', color: '#78716C', bg: '#F5F5F4' },
    { chain: '3-4', mode: '確変', en: 'Kakuhen', miss: '40%', boost: 'x2', spMult: 'x1.5', color: '#D4AF37', bg: '#FFFBEB' },
    { chain: '5-9', mode: '激熱', en: 'Gekiatsu', miss: '25%', boost: 'x5', spMult: 'x2', color: '#DC2626', bg: '#FEF2F2' },
    { chain: '10+', mode: '神', en: 'God', miss: '15%', boost: 'x10', spMult: 'x3', color: '#7C3AED', bg: '#FAF5FF' },
];

const MILESTONES = [
    { sp: 50, effect: '金色スパークル', dur: '1.5秒' },
    { sp: 100, effect: '大きいバースト + ランクアップ音', dur: '2秒' },
    { sp: 500, effect: '画面フラッシュ + ドラマチック音', dur: '3秒' },
    { sp: 1000, effect: '紙吹雪 + 特別サウンド + タイトル表示', dur: '5秒' },
    { sp: 5000, effect: 'エピック: 特殊画面エフェクト + バッジ解除', dur: '8秒' },
];

const CARD_RANKS = [
    { rank: 'NORMAL', threshold: 0, visual: '変化なし', color: '#78716C', bg: '#F5F5F4' },
    { rank: 'BRONZE', threshold: 5, visual: '銅メタリック枠', color: '#CD7F32', bg: '#FDF4EC' },
    { rank: 'SILVER', threshold: 20, visual: '銀枠 + 微光', color: '#94A3B8', bg: '#F1F5F9' },
    { rank: 'GOLD', threshold: 50, visual: '金枠 + 光沢グラデーション', color: '#F6C85F', bg: '#FFFBEB' },
    { rank: 'HOLOGRAPHIC', threshold: 100, visual: 'ポケモンカード風ホロ', color: '#A855F7', bg: '#FAF5FF' },
    { rank: 'LEGENDARY', threshold: 250, visual: '宇宙枠 + 伝説パーティクル', color: '#D4AF37', bg: '#FFFDE0' },
];

const BST_TIERS = [
    { tier: 'S', min: 600, label: '600族', ja: '伝説', poke: 'ガブリアス、カイリュー級', prob: '0.5%', expected: '~9枚', color: '#D4AF37', bg: '#FFFDE0' },
    { tier: 'A', min: 530, label: 'エース', ja: 'エース', poke: 'ギャラドス、ゲンガー級', prob: '10%', expected: '~173枚', color: '#A855F7', bg: '#FAF5FF' },
    { tier: 'B', min: 470, label: '主力', ja: '主力', poke: 'ヘラクロス、ドンファン級', prob: '30%', expected: '~501枚', color: '#3B82F6', bg: '#EFF6FF' },
    { tier: 'C', min: 400, label: '標準', ja: '標準', poke: 'ピカチュウ級', prob: '41%', expected: '~683枚', color: '#10B981', bg: '#ECFDF5' },
    { tier: 'D', min: 330, label: 'ルーキー', ja: 'ルーキー', poke: '序盤ポケ級', prob: '17%', expected: '~283枚', color: '#78716C', bg: '#F5F5F4' },
    { tier: 'F', min: 0, label: 'コイキング', ja: 'コイキング', poke: 'コイキング。逆にレア', prob: '2%', expected: '~34枚', color: '#EF4444', bg: '#FEF2F2' },
];

const DAILY_TITLES = [
    { lv: 1, title: '寝起き', color: '#78716C' },
    { lv: 2, title: '起動', color: '#78716C' },
    { lv: 3, title: '準備OK', color: '#2563EB' },
    { lv: 4, title: 'エンジン全開', color: '#16A34A' },
    { lv: 5, title: 'ゾーン', color: '#CA8A04' },
    { lv: 6, title: '無双', color: '#EA580C' },
    { lv: 7, title: '覚醒', color: '#DC2626' },
    { lv: 8, title: '鬼神', color: '#7C3AED' },
    { lv: 9, title: '本日の神', color: '#D4AF37' },
];

// Section component
function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <section id={id} style={{ marginBottom: '56px' }}>
            <h2 style={{
                fontSize: '22px', fontWeight: '800', color: '#1C1917',
                letterSpacing: '1px', marginBottom: subtitle ? '4px' : '20px',
                borderBottom: '2px solid #D4AF37', paddingBottom: '8px',
                display: 'inline-block',
            }}>
                {title}
            </h2>
            {subtitle && <p style={{ fontSize: '13px', color: '#78716C', marginBottom: '20px' }}>{subtitle}</p>}
            {children}
        </section>
    );
}

function Callout({ children, color = '#D4AF37' }: { children: React.ReactNode; color?: string }) {
    return (
        <div style={{
            background: `${color}10`, borderLeft: `3px solid ${color}`,
            padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: '16px',
            fontSize: '13px', color: '#44403C', lineHeight: '1.7',
        }}>
            {children}
        </div>
    );
}

export default function XpGuidePage() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFAF9' }}>
            <EnglishSidebar />
            <main style={{
                flex: 1,
                marginLeft: '240px',
                padding: '48px 40px 80px',
                maxWidth: '880px',
            }}>
                {/* ━━━ Header ━━━ */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: '#FFFBEB',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#D4AF37',
                        letterSpacing: '2px',
                        marginBottom: '12px',
                    }}>
                        GAME MANUAL
                    </div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        color: '#1C1917',
                        letterSpacing: '2px',
                        marginBottom: '12px',
                    }}>
                        ようこそ、英語魂の世界へ
                    </h1>
                    <p style={{ fontSize: '15px', color: '#57534E', lineHeight: '1.8' }}>
                        英語のフレーズを覚えるたびにXPが貯まり、スロットが回り、SPが降ってくる。
                        やり込めばやり込むほど運が良くなる。パチンコの確変みたいなもん。
                        このページは、その仕組みの全部を解説する「説明書」だ。
                    </p>
                </div>

                {/* Table of Contents */}
                <div style={{
                    background: '#fff', border: '1px solid #E7E5E4', borderRadius: '12px',
                    padding: '20px 24px', marginBottom: '48px',
                }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#D4AF37', letterSpacing: '2px', marginBottom: '12px' }}>CONTENTS</div>
                    {[
                        ['currency', '3つの通貨 — XP / SP / Card Points'],
                        ['chakra', 'チャクラシステム — 7段階の成長'],
                        ['level', 'プレイヤーレベル — 見習いから英語の神へ'],
                        ['slot', 'スロットマシン — 3リール9ティア'],
                        ['chain', '連荘システム — 通常 / 確変 / 激熱 / 神'],
                        ['ultrarare', '激レアティア — 神話 / 色違い / 幻'],
                        ['luck', '運気システム — SPで運が上がる'],
                        ['milestone', 'マイルストーン — SP記念お祝い'],
                        ['cards', 'カードコレクション — 6つのランク'],
                        ['bst', '種族値 — カードの個体値ガチャ'],
                        ['pace', '日課ペース — 自分に合ったスタイル'],
                    ].map(([id, label], i) => (
                        <a key={id} href={`#${id}`} style={{
                            display: 'block', padding: '6px 0', fontSize: '13px', fontWeight: '500',
                            color: '#57534E', textDecoration: 'none', borderBottom: i < 10 ? '1px solid #F5F5F4' : 'none',
                        }}>
                            <span style={{ color: '#D4AF37', fontWeight: '700', marginRight: '8px' }}>{i + 1}.</span>
                            {label}
                        </a>
                    ))}
                </div>

                {/* ━━━ 1. Currency ━━━ */}
                <Section id="currency" title="3つの通貨" subtitle="全部連動してるけど、役割は別。">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                        {[
                            { name: 'XP', ja: '経験値', desc: 'フレーズを育てると貯まる。プレイヤーレベルの燃料。', color: '#16A34A', bg: '#F0FDF4' },
                            { name: 'SP', ja: 'スパーク', desc: 'スロットで稼ぐ。たくさん持ってると運が良くなる。', color: '#D4AF37', bg: '#FFFBEB' },
                            { name: 'Card Pts', ja: 'カードポイント', desc: '各フレーズに個別に貯まる。カードのランクが上がる。', color: '#8B5CF6', bg: '#FAF5FF' },
                        ].map(c => (
                            <div key={c.name} style={{
                                background: c.bg, borderRadius: '12px', padding: '20px',
                                border: `1px solid ${c.color}30`,
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: '900', color: c.color, marginBottom: '4px' }}>{c.name}</div>
                                <div style={{ fontSize: '11px', fontWeight: '600', color: c.color, marginBottom: '8px', opacity: 0.7 }}>{c.ja}</div>
                                <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6' }}>{c.desc}</div>
                            </div>
                        ))}
                    </div>
                    <Callout>
                        スロットを回すたびに3つとも動く。XPでレベルが上がり、SPが貯まって運が良くなり、カードが育つ。全部が連鎖する仕組み。
                    </Callout>
                </Section>

                {/* ━━━ 2. Chakra ━━━ */}
                <Section id="chakra" title="チャクラシステム" subtitle="1つのフレーズが成長する7つの段階。">
                    <div style={{
                        background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4',
                        overflow: 'hidden',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: '#FAFAF9' }}>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px', letterSpacing: '1px' }}>LV</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px', letterSpacing: '1px' }}>NAME</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px', letterSpacing: '1px' }}>XP</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px', letterSpacing: '1px' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CHAKRA_STEPS.map((s, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid #F5F5F4' }}>
                                        <td style={{ padding: '10px 16px' }}>
                                            <span style={{
                                                display: 'inline-block', width: '28px', height: '28px',
                                                borderRadius: '50%', backgroundColor: s.color,
                                                color: '#fff', fontWeight: '800', fontSize: '12px',
                                                lineHeight: '28px', textAlign: 'center',
                                            }}>{s.ja}</span>
                                        </td>
                                        <td style={{ padding: '10px 16px', fontWeight: '600' }}>{s.name}</td>
                                        <td style={{ padding: '10px 16px', color: '#78716C', fontVariantNumeric: 'tabular-nums' }}>+{s.xp}</td>
                                        <td style={{ padding: '10px 16px', color: '#57534E' }}>{s.how}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Callout>
                        CROWNまで育てると1フレーズだけで合計53XP。100フレーズ完走で5,300XP。
                        地味にデカい。
                    </Callout>
                </Section>

                {/* ━━━ 3. Player Level ━━━ */}
                <Section id="level" title="プレイヤーレベル" subtitle="XPが貯まると称号が変わる。式: floor(13 * Lv^2.3)">
                    <div style={{
                        background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4',
                        overflow: 'hidden', marginBottom: '16px',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: '#FAFAF9' }}>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>RANGE</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>TITLE</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>XP FROM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TITLE_LADDER.map((t, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid #F5F5F4' }}>
                                        <td style={{ padding: '10px 16px', fontWeight: '600', color: '#44403C' }}>{t.range}</td>
                                        <td style={{ padding: '10px 16px' }}>
                                            <span style={{ color: t.color, fontWeight: '700' }}>{t.title}</span>
                                            <span style={{ color: '#A8A29E', marginLeft: '8px', fontSize: '11px' }}>{t.en}</span>
                                        </td>
                                        <td style={{ padding: '10px 16px', textAlign: 'right', color: '#78716C', fontVariantNumeric: 'tabular-nums' }}>{t.xpStart.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.7', marginBottom: '16px' }}>
                        毎日のプレイにも「日レベル」がある。その日の頑張りを9段階で評価。寝起き→本日の神まで。
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        {DAILY_TITLES.map(d => (
                            <span key={d.lv} style={{
                                padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                                color: d.color, backgroundColor: `${d.color}15`, border: `1px solid ${d.color}30`,
                            }}>
                                Lv.{d.lv} {d.title}
                            </span>
                        ))}
                    </div>
                </Section>

                {/* ━━━ 4. Slot Machine ━━━ */}
                <Section id="slot" title="スロットマシン" subtitle="レビューするたびに回る3リール。9つのティアで運試し。">
                    <p style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.7', marginBottom: '16px' }}>
                        フレーズをタップするとXPが入り、同時にスロットが自動で回る。
                        3つのリールが順番に止まって、揃い方で当たりが決まる。パチスロと同じ仕組み。
                    </p>
                    <div style={{
                        background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4',
                        overflow: 'hidden', marginBottom: '16px',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                                <tr style={{ background: '#FAFAF9' }}>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '10px', letterSpacing: '1px' }}>TIER</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '700', color: '#78716C', fontSize: '10px', letterSpacing: '1px' }}>PROB</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '700', color: '#78716C', fontSize: '10px', letterSpacing: '1px' }}>ODDS</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700', color: '#78716C', fontSize: '10px', letterSpacing: '1px' }}>SP</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '10px', letterSpacing: '1px' }}>VISUAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {GACHA_TIERS.map((t, i) => (
                                    <tr key={i} style={{
                                        borderTop: '1px solid #F5F5F4',
                                        backgroundColor: t.bg,
                                    }}>
                                        <td style={{ padding: '10px 12px', color: t.textColor }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                                <span style={{
                                                    fontSize: t.ja ? '18px' : '16px',
                                                    fontWeight: '900',
                                                    letterSpacing: '2px',
                                                }}>{t.ja || '凡'}</span>
                                                <span style={{
                                                    fontSize: '10px',
                                                    fontWeight: '600',
                                                    letterSpacing: '1.5px',
                                                    opacity: 0.6,
                                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                                }}>{t.tier === '凡' ? 'MISS' : t.tier}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '10px 12px', textAlign: 'center', color: t.textColor, fontVariantNumeric: 'tabular-nums' }}>{t.prob}</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'center', color: t.textColor, fontVariantNumeric: 'tabular-nums', fontSize: '11px' }}>{t.odds}</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700', color: t.textColor }}>{t.sp > 0 ? `+${t.sp}` : '0'}</td>
                                        <td style={{ padding: '10px 12px', color: t.textColor, fontSize: '11px', maxWidth: '200px' }}>{t.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Callout>
                        ハズレでも1SPはもらえる。0はない。回せば回すほどSPは増える。
                    </Callout>
                </Section>

                {/* ━━━ 5. Chain System ━━━ */}
                <Section id="chain" title="連荘(れんちゃん)システム" subtitle="パチンコの確変・激熱がそのまま入ってる。">
                    <p style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.7', marginBottom: '16px' }}>
                        ハズレ以外が出るたびにチェーンカウンターが+1。3連でパチンコの確変に突入し、
                        ハズレ確率が激減。5連で激熱、10連で神モード。ハズレを引いた瞬間、チェーンは0にリセット。
                    </p>
                    <div style={{
                        background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4',
                        overflow: 'hidden', marginBottom: '16px',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: '#FAFAF9' }}>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>CHAIN</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>MODE</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>MISS RATE</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>ULTRA BOOST</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>SP MULT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CHAIN_MODES.map((m, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid #F5F5F4', backgroundColor: m.bg }}>
                                        <td style={{ padding: '10px 16px', fontWeight: '600', color: '#44403C', fontVariantNumeric: 'tabular-nums' }}>{m.chain}</td>
                                        <td style={{ padding: '10px 16px' }}>
                                            <span style={{ color: m.color, fontWeight: '800' }}>{m.mode}</span>
                                            <span style={{ color: '#A8A29E', marginLeft: '6px', fontSize: '11px' }}>{m.en}</span>
                                        </td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{m.miss}</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: m.color }}>{m.boost}</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: m.color }}>{m.spMult}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: '#FFFBEB', borderRadius: '10px', padding: '16px', border: '1px solid #D4AF3730' }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#D4AF37', marginBottom: '6px' }}>確変突入!</div>
                            <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6' }}>
                                3連目で突入。ハズレ確率が60%→40%に。金色のオーラが画面を包む。
                                パチンコの確率変動モードそのもの。
                            </div>
                        </div>
                        <div style={{ background: '#FEF2F2', borderRadius: '10px', padding: '16px', border: '1px solid #DC262630' }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#DC2626', marginBottom: '6px' }}>激熱突入!</div>
                            <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6' }}>
                                5連目で突入。ハズレ25%。赤い炎が画面を覆い、揺れる。SPも2倍。
                                ここまで来たら一気に稼ぎたい。
                            </div>
                        </div>
                    </div>
                    <div style={{ background: '#FAF5FF', borderRadius: '10px', padding: '16px', border: '1px solid #7C3AED30', marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#7C3AED', marginBottom: '6px' }}>神 降 臨 !</div>
                        <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6' }}>
                            10連以上。ハズレ15%。激レアティアの確率がなんと10倍。SP3倍。
                            虹色のオーラに包まれ、全てが光り輝く。
                            ここに入ると、普段1/8192のPHANTOMが1/819になる。
                            正直、入ったらスクショ撮っておきたいレベル。
                        </div>
                    </div>
                    <Callout color="#DC2626">
                        チェーンはセッション限り(ページ再読み込みでリセット)。
                        集中してレビューし続ければ、確変→激熱→神と一気に駆け上がれる。
                    </Callout>
                </Section>

                {/* ━━━ 6. Ultra-Rare Tiers ━━━ */}
                <Section id="ultrarare" title="激レアティア" subtitle="LEGENDARY超えの3つの異次元。引いたら自慢していい。">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
                        {[
                            {
                                tier: 'MYTHIC', ja: '神話', sp: 100, odds: '1/400', color: '#EC4899', bg: '#FDF2F8',
                                emoji: '*', desc: 'パチンコの大当たりと同じ確率。画面がピンクに染まり、ハートが雨のように降ってくる。',
                                compare: 'パチンコの海物語シリーズの大当たり確率(1/399.6)とほぼ同じ。打ったことあるなら分かるあの感覚。',
                            },
                            {
                                tier: 'SHINY', ja: '色違い', sp: 500, odds: '1/4096', color: '#06B6D4', bg: '#ECFEFF',
                                emoji: '*', desc: 'ポケモン第6世代の色違い確率。全リールが虹色にシンクロ回転(全回転)。プリズマティック演出。',
                                compare: 'ポケモンXYの色違い遭遇率と完全一致。ひかるおまもり無しで草むらを歩き回るあの確率。',
                            },
                            {
                                tier: 'PHANTOM', ja: '幻', sp: 2000, odds: '1/8192', color: '#1C1917', bg: '#FAFAF9',
                                emoji: '*', desc: 'ポケモン第5世代の色違い確率。画面がホワイトアウトし、全ての色が反転する。ゴースト7が浮かび上がる。',
                                compare: 'ポケモンBWの色違い確率。引いたら宝くじ当たったようなもん。2000SPは激レアカード一枚分。',
                            },
                        ].map(t => (
                            <div key={t.tier} style={{
                                background: t.bg, borderRadius: '14px', padding: '24px',
                                border: `2px solid ${t.color}40`,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: '900', color: t.color }}>{t.tier}</span>
                                    <span style={{ fontSize: '16px', fontWeight: '700', color: t.color, opacity: 0.7 }}>{t.ja}</span>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#78716C', marginLeft: 'auto' }}>{t.odds}</span>
                                </div>
                                <div style={{ fontSize: '22px', fontWeight: '900', color: t.color, marginBottom: '8px' }}>+{t.sp} SP</div>
                                <div style={{ fontSize: '13px', color: '#44403C', lineHeight: '1.7', marginBottom: '12px' }}>{t.desc}</div>
                                <div style={{
                                    fontSize: '12px', color: '#78716C', lineHeight: '1.6',
                                    background: `${t.color}08`, padding: '10px 14px', borderRadius: '8px',
                                    borderLeft: `3px solid ${t.color}40`,
                                }}>
                                    {t.compare}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Callout color="#7C3AED">
                        神モード(10連+)中だと、PHANTOM確率が1/8192→1/819に。
                        運気MAXなら1/4096→1/409。引ける可能性は、ある。
                    </Callout>
                </Section>

                {/* ━━━ 7. Luck System ━━━ */}
                <Section id="luck" title="運気(LUCK)システム" subtitle="SPが貯まると激レアの出やすさが上がる。やればやるほど強くなる。">
                    <div style={{
                        background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4',
                        padding: '24px', marginBottom: '16px',
                    }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1C1917', marginBottom: '12px' }}>計算式</div>
                        <div style={{
                            background: '#FAFAF9', borderRadius: '8px', padding: '16px', fontFamily: 'monospace',
                            fontSize: '14px', color: '#44403C', marginBottom: '16px',
                        }}>
                            LUCK = 1.0 + min(totalSP / 10000, 1.0)
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                            {[
                                { sp: '0 SP', luck: 'x1.00', desc: '基本確率' },
                                { sp: '5,000 SP', luck: 'x1.50', desc: '50%ブースト' },
                                { sp: '10,000+ SP', luck: 'x2.00', desc: '最大(確率2倍)' },
                            ].map(l => (
                                <div key={l.sp} style={{
                                    background: '#FFFBEB', borderRadius: '8px', padding: '14px', textAlign: 'center',
                                    border: '1px solid #D4AF3720',
                                }}>
                                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#78716C', marginBottom: '4px' }}>{l.sp}</div>
                                    <div style={{ fontSize: '20px', fontWeight: '900', color: '#D4AF37' }}>{l.luck}</div>
                                    <div style={{ fontSize: '10px', color: '#A8A29E', marginTop: '2px' }}>{l.desc}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.7' }}>
                            <strong>効果はMYTHIC/SHINY/PHANTOMの3ティアのみ</strong>に適用される。
                            BONUSやGREATの確率は変わらない。超レアだけが出やすくなる仕組み。
                        </div>
                    </div>

                    <div style={{
                        background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4',
                        overflow: 'hidden', marginBottom: '16px',
                    }}>
                        <div style={{ padding: '14px 16px', background: '#FAFAF9', fontSize: '12px', fontWeight: '700', color: '#78716C' }}>
                            LUCK MAXでの確率変化
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderTop: '1px solid #F5F5F4' }}>
                                    <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: '600', color: '#78716C', fontSize: '11px' }}>TIER</th>
                                    <th style={{ padding: '8px 16px', textAlign: 'center', fontWeight: '600', color: '#78716C', fontSize: '11px' }}>BASE</th>
                                    <th style={{ padding: '8px 16px', textAlign: 'center', fontWeight: '600', color: '#78716C', fontSize: '11px' }}>LUCK x2.0</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { tier: 'MYTHIC', base: '1/400', boosted: '1/200', color: '#EC4899' },
                                    { tier: 'SHINY', base: '1/4096', boosted: '1/2048', color: '#06B6D4' },
                                    { tier: 'PHANTOM', base: '1/8192', boosted: '1/4096', color: '#1C1917' },
                                ].map((r, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid #F5F5F4' }}>
                                        <td style={{ padding: '8px 16px', fontWeight: '700', color: r.color }}>{r.tier}</td>
                                        <td style={{ padding: '8px 16px', textAlign: 'center', color: '#78716C' }}>{r.base}</td>
                                        <td style={{ padding: '8px 16px', textAlign: 'center', fontWeight: '700', color: r.color }}>{r.boosted}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Callout color="#D4AF37">
                        LUCK倍率はレビュー画面のレベル表示の下に小さく表示される。
                        x1.00から始まって、少しずつ上がっていくのを見届けてほしい。
                    </Callout>
                </Section>

                {/* ━━━ 8. Milestones ━━━ */}
                <Section id="milestone" title="SPマイルストーン" subtitle="節目のSPに到達するとお祝い演出が入る。">
                    <div style={{
                        background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4',
                        overflow: 'hidden', marginBottom: '16px',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: '#FAFAF9' }}>
                                    <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>SP</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>EFFECT</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>DUR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MILESTONES.map((m, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid #F5F5F4' }}>
                                        <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: '700', color: '#D4AF37', fontVariantNumeric: 'tabular-nums' }}>{m.sp.toLocaleString()}</td>
                                        <td style={{ padding: '10px 16px', color: '#44403C' }}>{m.effect}</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center', color: '#78716C' }}>{m.dur}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Callout>
                        マイルストーンは50, 100, 500, 1000, 5000ごと。
                        つまり5000SPに到達すると、50+100+500+1000+5000の合計5回お祝いされることになる。
                    </Callout>
                </Section>

                {/* ━━━ 9. Cards ━━━ */}
                <Section id="cards" title="カードコレクション" subtitle="フレーズごとにカードが育つ。レアカードは光る。">
                    <p style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.7', marginBottom: '16px' }}>
                        スロットで稼いだSPは、レビュー中のフレーズのカードポイントにもなる。
                        ポイントが貯まるとカードのランクが上がり、見た目が豪華になる。
                        HOLOGRAPHICはポケカのホロ風、LEGENDARYは宇宙枠。
                    </p>
                    <div style={{
                        background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4',
                        overflow: 'hidden', marginBottom: '16px',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: '#FAFAF9' }}>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>RANK</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>PTS</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>VISUAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CARD_RANKS.map((r, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid #F5F5F4', backgroundColor: r.bg }}>
                                        <td style={{ padding: '10px 16px', fontWeight: '700', color: r.color }}>{r.rank}</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center', fontVariantNumeric: 'tabular-nums', color: '#78716C' }}>{r.threshold}</td>
                                        <td style={{ padding: '10px 16px', color: '#57534E' }}>{r.visual}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Callout color="#8B5CF6">
                        LEGENDARYカードを作るには250ポイント。MYTHICが1回出れば100SP=100pt。
                        つまりMYTHICを3回引けばLEGENDARYカードが完成する計算。
                    </Callout>
                </Section>

                {/* ━━━ 10. BST ━━━ */}
                <Section id="bst" title="種族値(BST)" subtitle="フレーズ登録 = 個体値ガチャ。IDで運命が決まる。">
                    <p style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.7', marginBottom: '16px' }}>
                        フレーズを登録した瞬間、ランダムなID(8文字)が割り振られる。
                        このIDの先頭6文字が、ポケモンの個体値のようにカードの6つのステータスを決定する。
                        合計値(種族値)でカードのティアが決まる。同じ英語フレーズでもIDが違えばステータスが違う。
                    </p>

                    <div style={{
                        background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4',
                        padding: '20px', marginBottom: '16px',
                    }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1C1917', marginBottom: '12px' }}>6つのステータス</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            {['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE'].map(stat => (
                                <span key={stat} style={{
                                    padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                                    color: '#3B82F6', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE',
                                    fontFamily: 'monospace',
                                }}>
                                    {stat}
                                </span>
                            ))}
                        </div>
                        <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.7' }}>
                            各文字がID内の文字コードから30-115の範囲に変換される。<br />
                            英字(a-z)は数値が高く、数字(0-9)は低め。合計で180-690の範囲。
                        </div>
                    </div>

                    <div style={{
                        background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4',
                        overflow: 'hidden', marginBottom: '16px',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: '#FAFAF9' }}>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>TIER</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>BST</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>PROB</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>1683枚中</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#78716C', fontSize: '11px' }}>COMPARE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {BST_TIERS.map((t, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid #F5F5F4', backgroundColor: t.bg }}>
                                        <td style={{ padding: '10px 16px' }}>
                                            <span style={{ fontWeight: '900', color: t.color, fontSize: '16px' }}>{t.tier}</span>
                                            <span style={{ fontWeight: '600', color: t.color, fontSize: '11px', marginLeft: '6px' }}>{t.label}</span>
                                        </td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>{t.min}+</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '600', color: t.color }}>{t.prob}</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', color: t.color }}>{t.expected}</td>
                                        <td style={{ padding: '10px 16px', color: '#57534E', fontSize: '12px' }}>{t.poke}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: '#FFFDE0', borderRadius: '10px', padding: '16px', border: '1px solid #D4AF3730' }}>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#D4AF37', marginBottom: '6px' }}>600族 (S Tier)</div>
                            <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6' }}>
                                1683枚中たった9枚の期待値。フレーズを登録するたびに「600族来い...!」ってなる。
                                見つけたらスクショ案件。
                            </div>
                        </div>
                        <div style={{ background: '#FEF2F2', borderRadius: '10px', padding: '16px', border: '1px solid #EF444430' }}>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#EF4444', marginBottom: '6px' }}>コイキング (F Tier)</div>
                            <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6' }}>
                                種族値330未満。弱い。でも2%しか出ないから逆にレア。
                                愛着を持って育てれば、いつかギャラドスになる...かも。
                            </div>
                        </div>
                    </div>

                    <Callout color="#D4AF37">
                        種族値はIDが生成された瞬間に確定する。後から変えられない。
                        フレーズを登録すること自体がガチャ。カードプレビューで確認できる。
                    </Callout>
                </Section>

                {/* ━━━ 11. Pace ━━━ */}
                <Section id="pace" title="日課ペース" subtitle="自分に合ったスタイルで。毎日少しでも続けるのが最強。">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                        {[
                            {
                                style: 'Light', ja: 'ゆるく派',
                                time: '5-10分', reviews: '15-30回', xp: '~45-90', sp: '~30-60',
                                color: '#16A34A', bg: '#F0FDF4',
                                desc: '通勤中にサクッと。確変入ったらラッキー。',
                            },
                            {
                                style: 'Regular', ja: 'しっかり派',
                                time: '15-30分', reviews: '50-100回', xp: '~150-300', sp: '~100-200',
                                color: '#D4AF37', bg: '#FFFBEB',
                                desc: '毎日これくらいやれば着実にレベルが上がる。確変→激熱も狙える。',
                            },
                            {
                                style: 'Heavy', ja: 'ガチ勢',
                                time: '30分+', reviews: '100回+', xp: '~300+', sp: '~200+',
                                color: '#DC2626', bg: '#FEF2F2',
                                desc: '神モードまで突っ走る。PHANTOMを見たいならこのペース。',
                            },
                        ].map(p => (
                            <div key={p.style} style={{
                                background: p.bg, borderRadius: '12px', padding: '20px',
                                border: `1px solid ${p.color}30`,
                            }}>
                                <div style={{ fontSize: '18px', fontWeight: '900', color: p.color, marginBottom: '2px' }}>{p.style}</div>
                                <div style={{ fontSize: '11px', fontWeight: '600', color: p.color, opacity: 0.7, marginBottom: '12px' }}>{p.ja}</div>
                                <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.8', marginBottom: '12px' }}>
                                    <div>Time: <strong>{p.time}</strong></div>
                                    <div>Reviews: <strong>{p.reviews}</strong></div>
                                    <div>XP/day: <strong>{p.xp}</strong></div>
                                    <div>SP/day: <strong>{p.sp}</strong></div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#78716C', lineHeight: '1.5' }}>{p.desc}</div>
                            </div>
                        ))}
                    </div>
                    <Callout>
                        大事なのは毎日やること。10回でも0回より100倍いい。
                        チャクラの成長は翌日タップが前提だから、1日でも開くと進まない。
                        逆に言えば、毎日触れば勝手にレベルが上がる。
                    </Callout>
                </Section>

                {/* ━━━ Footer ━━━ */}
                <div style={{
                    borderTop: '2px solid #E7E5E4', paddingTop: '24px', marginTop: '32px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '12px', color: '#A8A29E', lineHeight: '1.6' }}>
                        このマニュアルは英語魂トレーニングシステムの仕組みを全て公開するものです。
                    </div>
                    <div style={{ fontSize: '11px', color: '#D4D4D4', marginTop: '4px' }}>
                        v3.0 -- 3リールスロット / 9ティア / 連荘 / 運気 / 属性 / 種族値
                    </div>
                </div>
            </main>
        </div>
    );
}
