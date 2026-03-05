'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

// ===== Types =====
interface Phrase { id: string; english: string; japanese: string; category: string; date: string; }
interface PhraseLink { phrase_id: string; text: string; created_at: string; }
interface VoiceRecording { id: number; phrase_id: string; url: string; created_at: string; }
type ChakraLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface PlayerStats { total_xp: number; sparks: number; legendary_count: number; pity_counter: number; total_touches: number; }

// ===== Design Tokens =====
const T = {
    bg: '#FAFAF9',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F5F4',
    text: '#1C1917',
    textSub: '#57534E',
    textMuted: '#A8A29E',
    border: '#E7E5E4',
    borderLight: '#F5F5F4',
    green: '#10B981',
    greenSoft: '#ECFDF5',
    gold: '#D4AF37',
    goldSoft: '#FFFBEB',
    red: '#EF4444',
    blue: '#3B82F6',
    purple: '#8B5CF6',
    orange: '#F97316',
    orangeSoft: '#FFF7ED',
    shadow: '0 1px 2px rgba(0,0,0,0.04)',
    shadowMd: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    radius: '12px',
    radiusSm: '8px',
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

const CHAKRA: Record<ChakraLevel, { name: string; ja: string; lv: number; color: string; bg: string }> = {
    0: { name: 'SEED',   ja: '種', lv: 1, color: '#DC2626', bg: '#FEF2F2' },
    1: { name: 'SPARK',  ja: '芽', lv: 2, color: '#EA580C', bg: '#FFF7ED' },
    2: { name: 'FORGE',  ja: '鍛', lv: 3, color: '#CA8A04', bg: '#FEFCE8' },
    3: { name: 'OWN',    ja: '得', lv: 4, color: '#16A34A', bg: '#F0FDF4' },
    4: { name: 'VOICE',  ja: '声', lv: 5, color: '#2563EB', bg: '#EFF6FF' },
    5: { name: 'VISION', ja: '研', lv: 6, color: '#4F46E5', bg: '#EEF2FF' },
    6: { name: 'CROWN',  ja: '極', lv: 7, color: '#7C3AED', bg: '#FAF5FF' },
};

function getLv(bm: number, rec: boolean, link: boolean): ChakraLevel {
    if (bm === 6) return 6;
    if (bm >= 3 && rec && link) return 5;
    if (bm >= 3 && rec) return 4;
    return Math.min(bm, 3) as ChakraLevel;
}

function xpForLevel(lv: number): number {
    if (lv <= 1) return 0;
    return Math.floor(13 * Math.pow(lv, 2.3));
}

function getPlayerLevel(totalXp: number): number {
    let lv = 1;
    while (xpForLevel(lv + 1) <= totalXp) lv++;
    return lv;
}

function getLevelTitle(lv: number): { title: string; color: string } {
    if (lv >= 100) return { title: '英語の神', color: '#D4AF37' };
    if (lv >= 81) return { title: '伝説', color: '#D4AF37' };
    if (lv >= 61) return { title: '賢者', color: '#7C3AED' };
    if (lv >= 41) return { title: '達人', color: '#DC2626' };
    if (lv >= 31) return { title: '猛者', color: '#EA580C' };
    if (lv >= 21) return { title: '実践者', color: '#CA8A04' };
    if (lv >= 11) return { title: '修行者', color: '#16A34A' };
    if (lv >= 6) return { title: '学徒', color: '#2563EB' };
    return { title: '見習い', color: '#78716C' };
}

function niceMax(v: number) {
    if (v <= 0) return 5;
    if (v <= 5) return 5;
    if (v <= 10) return 10;
    const mag = Math.pow(10, Math.floor(Math.log10(v)));
    const r = v / mag;
    if (r <= 1.5) return 1.5 * mag;
    if (r <= 2) return 2 * mag;
    if (r <= 3) return 3 * mag;
    if (r <= 5) return 5 * mag;
    return 10 * mag;
}

function smoothPath(points: [number, number][], tension = 0.3, yMin = -Infinity, yMax = Infinity): string {
    if (points.length < 2) return '';
    if (points.length === 2) return `M${points[0][0]},${points[0][1]}L${points[1][0]},${points[1][1]}`;
    const clampY = (y: number) => Math.max(yMin, Math.min(yMax, y));
    let d = `M${points[0][0]},${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
        const cp1y = clampY(p1[1] + (p2[1] - p0[1]) * tension);
        const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
        const cp2y = clampY(p2[1] - (p3[1] - p1[1]) * tension);
        d += `C${cp1x},${cp1y},${cp2x},${cp2y},${p2[0]},${p2[1]}`;
    }
    return d;
}

// ===== Main =====
export default function AnalyticsPage() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [mast, setMast] = useState<Record<string, number>>({});
    const [recs, setRecs] = useState<Record<string, VoiceRecording[]>>({});
    const [lnks, setLnks] = useState<Record<string, PhraseLink[]>>({});
    const [rc, setRc] = useState<Record<string, { count: number; xp: number }>>({});
    const [dt, setDt] = useState<Record<string, number>>({});
    const [ps, setPs] = useState<PlayerStats | null>(null);
    const [cm, setCm] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [today, setToday] = useState('');
    const [hoverDay, setHoverDay] = useState<number | null>(null);
    const [hoverBarDay, setHoverBarDay] = useState<number | null>(null);

    useEffect(() => {
        const n = new Date();
        setToday(`${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`);
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const [a, b, c, d, e] = await Promise.all([
                    fetch('/api/phrases'), fetch('/api/phrases/mastery'),
                    fetch('/api/voice-recordings'), fetch('/api/phrases/links'),
                    fetch('/api/player-stats'),
                ]);
                const [ad, bd, cd, dd, ed] = await Promise.all([a.json(), b.json(), c.json(), d.json(), e.json()]);
                if (ad.success) setPhrases(ad.phrases);
                if (bd.success) setMast(bd.mastery || {});
                if (cd.success) setRecs(cd.recordings || {});
                if (dd.success) {
                    const m: Record<string, PhraseLink[]> = {};
                    for (const l of (dd.links || [])) { if (!m[l.phrase_id]) m[l.phrase_id] = []; m[l.phrase_id].push(l); }
                    setLnks(m);
                }
                if (ed.success) setPs({ total_xp: ed.total_xp ?? 0, sparks: ed.sparks ?? 0, legendary_count: ed.legendary_count ?? 0, pity_counter: ed.pity_counter ?? 0, total_touches: ed.total_touches ?? 0 });
            } finally { setLoading(false); }
        })();
    }, []);

    useEffect(() => {
        const ym = `${cm.getFullYear()}-${String(cm.getMonth() + 1).padStart(2, '0')}`;
        fetch(`/api/review-count?month=${ym}`).then(r => r.json()).then(d => { if (d.success) setRc(d.counts || {}); }).catch(() => {});
        fetch(`/api/date-touches?month=${ym}`).then(r => r.json()).then(d => { if (d.success) setDt(d.touches || {}); }).catch(() => {});
    }, [cm]);

    const lvMap = useMemo(() => {
        const m: Record<string, ChakraLevel> = {};
        for (const p of phrases) m[p.id] = getLv(mast[p.id] ?? 0, !!(recs[p.id]?.length), !!(lnks[p.id]?.length));
        return m;
    }, [phrases, mast, recs, lnks]);

    const byDate = useMemo(() => {
        const m: Record<string, Phrase[]> = {};
        for (const p of phrases) { const k = p.date.split('T')[0]; if (!m[k]) m[k] = []; m[k].push(p); }
        return m;
    }, [phrases]);

    const yr = cm.getFullYear(), mo = cm.getMonth();
    const dim = new Date(yr, mo + 1, 0).getDate();
    const fdow = new Date(yr, mo, 1).getDay();
    const fmtD = useCallback((d: number) => `${yr}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, [yr, mo]);

    // Player level
    const playerLevel = useMemo(() => ps ? getPlayerLevel(ps.total_xp) : 1, [ps]);
    const levelInfo = useMemo(() => getLevelTitle(playerLevel), [playerLevel]);
    const xpCurrent = ps?.total_xp ?? 0;
    const xpThisLevel = xpForLevel(playerLevel);
    const xpNextLevel = xpForLevel(playerLevel + 1);
    const levelProgress = xpNextLevel > xpThisLevel ? (xpCurrent - xpThisLevel) / (xpNextLevel - xpThisLevel) : 1;

    const dayData = useMemo(() => {
        return Array.from({ length: dim }, (_, i) => {
            const dk = fmtD(i + 1);
            const dp = byDate[dk] || [];
            let pts = 0;
            for (const p of dp) pts += CHAKRA[lvMap[p.id] ?? 0].lv;
            const reps = rc[dk]?.count || 0;
            const xp = rc[dk]?.xp || 0;
            return { dk, dn: i + 1, count: dp.length, reps, xp, pts };
        });
    }, [dim, byDate, lvMap, rc, fmtD]);

    // Global stats
    const g = useMemo(() => {
        const total = phrases.length;
        let pts = 0;
        const dist = [0, 0, 0, 0, 0, 0, 0];
        for (const p of phrases) { const lv = lvMap[p.id] ?? 0; pts += CHAKRA[lv].lv; dist[lv]++; }
        const avg = total > 0 ? pts / total : 0;
        return { total, pts, dist, avg };
    }, [phrases, lvMap]);

    // Monthly summary
    const ms = useMemo(() => {
        let reps = 0, xp = 0, pts = 0, maxR = 0, maxD = '', activeDays = 0;
        for (const d of dayData) {
            reps += d.reps; xp += d.xp; pts += d.pts;
            if (d.reps > 0) activeDays++;
            if (d.reps > maxR) { maxR = d.reps; maxD = d.dk; }
        }
        return { reps, xp, pts, maxR, maxD, activeDays, avgRDay: activeDays > 0 ? reps / activeDays : 0 };
    }, [dayData]);

    // ===== REPS BAR CHART =====
    const BCW = 980, BCH = 260, BPL = 48, BPR = 20, BPT = 24, BPB = 36;
    const bW = BCW - BPL - BPR, bH = BCH - BPT - BPB;
    const maxReps = useMemo(() => Math.max(...dayData.map(d => d.reps), 1), [dayData]);
    const repsMax = niceMax(maxReps);
    const repsTicks = Array.from({ length: 6 }, (_, i) => Math.round((repsMax / 5) * i));

    // ===== POWER + XP LINE CHART =====
    const LCW = 980, LCH = 280, LPL = 56, LPR = 56, LPT = 32, LPB = 40;
    const lW = LCW - LPL - LPR, lH = LCH - LPT - LPB;
    const maxPts = useMemo(() => Math.max(...dayData.map(d => d.pts), 1), [dayData]);
    const maxXp = useMemo(() => Math.max(...dayData.map(d => d.xp), 1), [dayData]);
    const ptsMax = niceMax(maxPts);
    const xpMax = niceMax(maxXp);
    const ptsTicks = Array.from({ length: 6 }, (_, i) => Math.round((ptsMax / 5) * i));
    const xpTicks = Array.from({ length: 6 }, (_, i) => Math.round((xpMax / 5) * i));

    const powerPts = useMemo<[number, number][]>(() =>
        dayData.map((d, i) => [LPL + (i / Math.max(dim - 1, 1)) * lW, LPT + lH - (d.pts / ptsMax) * lH]),
    [dayData, dim, lW, lH, ptsMax]);
    const xpPts = useMemo<[number, number][]>(() =>
        dayData.map((d, i) => [LPL + (i / Math.max(dim - 1, 1)) * lW, LPT + lH - (d.xp / xpMax) * lH]),
    [dayData, dim, lW, lH, xpMax]);

    // ===== HEATMAP =====
    const calDays: (number | null)[] = [];
    for (let i = 0; i < fdow; i++) calDays.push(null);
    for (let d = 1; d <= dim; d++) calDays.push(d);
    const rows = Math.ceil(calDays.length / 7);
    const calMaxReps = Math.max(...dayData.map(x => x.reps), 1);

    // ===== WEEKS =====
    const weeks = useMemo(() => {
        const ws: { label: string; days: number; reps: number; xp: number; pts: number; avgLv: number }[] = [];
        let s = 0;
        while (s < dayData.length) {
            const e = Math.min(s + 7, dayData.length);
            const sl = dayData.slice(s, e);
            let r = 0, x = 0, pt = 0, pCount = 0;
            for (const d of sl) { r += d.reps; x += d.xp; pt += d.pts; pCount += d.count; }
            ws.push({ label: `${s + 1}-${e}`, days: e - s, reps: r, xp: x, pts: pt, avgLv: pCount > 0 ? pt / pCount : 0 });
            s = e;
        }
        return ws;
    }, [dayData]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: T.bg }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', border: `3px solid ${T.border}`, borderTopColor: T.green, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ color: T.textMuted, fontSize: '13px', fontWeight: 500 }}>Loading analytics...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        </div>
    );

    const ml = `${yr}年 ${mo + 1}月`;
    const barGap = 3;
    const barW = Math.max((bW / dim) - barGap, 4);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: T.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            {/* ===== HEADER ===== */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                backgroundColor: 'rgba(246,246,243,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${T.border}`, padding: '12px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h1 style={{ fontSize: '17px', fontWeight: 700, color: T.text, margin: 0, letterSpacing: '-0.4px' }}>Analytics</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: T.surface, borderRadius: '10px', border: `1px solid ${T.border}`, padding: '3px 4px', boxShadow: T.shadow }}>
                        <NavBtn onClick={() => setCm(new Date(yr, mo - 1, 1))}>{'<'}</NavBtn>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: T.text, minWidth: '100px', textAlign: 'center', letterSpacing: '-0.2px', padding: '0 4px' }}>{ml}</span>
                        <NavBtn onClick={() => setCm(new Date(yr, mo + 1, 1))}>{'>'}</NavBtn>
                    </div>
                </div>
                <Link href="/english/training" style={{
                    textDecoration: 'none', fontSize: '12px', fontWeight: 600, color: T.textSub,
                    padding: '6px 16px', borderRadius: '8px', border: `1px solid ${T.border}`,
                    backgroundColor: T.surface, boxShadow: T.shadow, transition: `all 200ms ${T.ease}`,
                }}>
                    Dashboard
                </Link>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 24px 60px' }}>

                {/* ===== 1. HERO KPI ROW (4 cards) ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '14px' }}>
                    <KpiCard
                        label="Total Power (戦力)"
                        value={g.pts.toLocaleString()}
                        sub={`${g.total} phrases / Avg Lv.${g.avg.toFixed(1)}`}
                        color={T.gold}
                        bg="linear-gradient(135deg, #FFFBEB, #FEF3C7)"
                    />
                    <KpiCard
                        label="SP (Sparks)"
                        value={(ps?.sparks ?? 0).toLocaleString()}
                        sub={`${ps?.legendary_count ?? 0} legendary`}
                        color={T.purple}
                        bg="linear-gradient(135deg, #FAF5FF, #F3E8FF)"
                    />
                    <div style={{
                        borderRadius: T.radius, padding: '18px 20px', position: 'relative', overflow: 'hidden',
                        background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: `1px solid ${T.borderLight}`, boxShadow: T.shadow,
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Player Level</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '28px', fontWeight: 800, color: levelInfo.color, lineHeight: 1.1, letterSpacing: '-0.5px' }}>Lv.{playerLevel}</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: levelInfo.color }}>{levelInfo.title}</span>
                        </div>
                        <div style={{ marginTop: '8px', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(levelProgress * 100, 100)}%`, borderRadius: '2px', backgroundColor: levelInfo.color, transition: `width 500ms ${T.ease}` }} />
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: 500, color: T.textMuted, marginTop: '4px' }}>{xpCurrent.toLocaleString()} / {xpNextLevel.toLocaleString()} XP</div>
                    </div>
                    <KpiCard
                        label={`${mo + 1}月 XP (経験値)`}
                        value={ms.xp.toLocaleString()}
                        sub={`${ms.activeDays} active days / ${ms.avgRDay.toFixed(1)} reps avg`}
                        color={T.orange}
                        bg="linear-gradient(135deg, #FFF7ED, #FED7AA)"
                    />
                </div>

                {/* ===== 2. CHAKRA DISTRIBUTION BAR ===== */}
                <div style={{ ...cardStyle, padding: '20px 24px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: T.text, letterSpacing: '-0.3px', marginBottom: '14px' }}>Chakra Distribution</div>
                    <div style={{ height: '32px', borderRadius: '8px', overflow: 'hidden', display: 'flex', backgroundColor: T.borderLight }}>
                        {([0, 1, 2, 3, 4, 5, 6] as ChakraLevel[]).map(lv => {
                            const pct = g.total > 0 ? (g.dist[lv] / g.total) * 100 : 0;
                            if (pct <= 0) return null;
                            return (
                                <div key={lv} style={{
                                    width: `${pct}%`, backgroundColor: CHAKRA[lv].color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: `width 400ms ${T.ease}`, minWidth: pct > 3 ? '0' : '2px',
                                }}>
                                    {pct >= 6 && <span style={{ fontSize: '10px', fontWeight: 700, color: '#FFF', letterSpacing: '-0.3px' }}>{CHAKRA[lv].ja}</span>}
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {([0, 1, 2, 3, 4, 5, 6] as ChakraLevel[]).map(lv => (
                            <div key={lv} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: CHAKRA[lv].color }} />
                                <span style={{ fontSize: '11px', fontWeight: 600, color: T.textSub }}>
                                    {CHAKRA[lv].ja} {g.dist[lv]}
                                </span>
                                <span style={{ fontSize: '10px', color: T.textMuted }}>
                                    {g.total > 0 ? `${((g.dist[lv] / g.total) * 100).toFixed(0)}%` : '0%'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== 3. REPS BAR CHART ===== */}
                <div style={{ ...cardStyle, padding: '24px', marginBottom: '14px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: T.text, letterSpacing: '-0.3px' }}>Reps (回数)</div>
                        <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '3px' }}>Daily review count</div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <svg width={BCW} height={BCH} viewBox={`0 0 ${BCW} ${BCH}`} style={{ display: 'block' }}>
                            {repsTicks.map((v, i) => {
                                const y = BPT + bH - (v / repsMax) * bH;
                                return <g key={`rg${i}`}>
                                    <line x1={BPL} y1={y} x2={BCW - BPR} y2={y} stroke={T.borderLight} strokeWidth={0.5} />
                                    <text x={BPL - 8} y={y + 4} textAnchor="end" fontSize={10} fill={T.green} fontWeight={500} opacity={0.8}>{v}</text>
                                </g>;
                            })}
                            <line x1={BPL} y1={BPT + bH} x2={BCW - BPR} y2={BPT + bH} stroke={T.border} strokeWidth={1} />

                            {dayData.map((d, i) => {
                                const x = BPL + i * (barW + barGap) + barGap / 2;
                                const h = d.reps > 0 ? Math.max((d.reps / repsMax) * bH, 2) : 0;
                                const y = BPT + bH - h;
                                const isT = d.dk === today;
                                const isH = d.dn === hoverBarDay;
                                const showLabel = dim <= 15 || d.dn % 2 === 1 || d.dn === dim || isT;

                                return <g key={d.dk} onMouseEnter={() => setHoverBarDay(d.dn)} onMouseLeave={() => setHoverBarDay(null)}>
                                    {isH && <rect x={x - 2} y={BPT} width={barW + 4} height={bH} fill="rgba(16,185,129,0.04)" rx={4} />}

                                    {d.reps > 0 && (
                                        <rect x={x} y={y} width={barW} height={h} rx={Math.min(3, barW / 4)}
                                            fill={isT ? T.gold : T.green}
                                            opacity={isH ? 1 : 0.75}
                                            style={{ transition: `all 150ms ${T.ease}` }}
                                        />
                                    )}

                                    {isH && d.reps > 0 && (
                                        <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={11} fill={T.text} fontWeight={700}>{d.reps}</text>
                                    )}

                                    {showLabel && (
                                        <text x={x + barW / 2} y={BPT + bH + 18} textAnchor="middle" fontSize={10}
                                            fill={isT ? T.gold : T.textMuted} fontWeight={isT ? 700 : 400}>{d.dn}</text>
                                    )}
                                </g>;
                            })}
                        </svg>
                    </div>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
                        borderTop: `1px solid ${T.borderLight}`, paddingTop: '14px', marginTop: '8px',
                    }}>
                        <FooterStat label="Total Reps" value={ms.reps.toLocaleString()} color={T.green} />
                        <FooterStat label="Avg / Day" value={ms.avgRDay.toFixed(1)} color={T.green} />
                        <FooterStat label="Peak Day" value={`${ms.maxR}`} color={T.red} sub={ms.maxD ? `${mo + 1}/${ms.maxD.slice(8)}` : '-'} />
                        <FooterStat label="Active Days" value={`${ms.activeDays}`} color={T.text} sub={`/ ${dim}`} />
                    </div>
                </div>

                {/* ===== 4. POWER & XP LINE CHART ===== */}
                <div style={{ ...cardStyle, padding: '24px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: T.text, letterSpacing: '-0.3px' }}>Power & XP (成長)</div>
                            <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '3px' }}>
                                <span style={{ color: T.gold, fontWeight: 600 }}>Gold</span> = Power (sum of chakra levels) /
                                <span style={{ color: T.orange, fontWeight: 600 }}> Orange</span> = XP earned
                            </div>
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <svg width={LCW} height={LCH} viewBox={`0 0 ${LCW} ${LCH}`} style={{ display: 'block' }}>
                            <defs>
                                <linearGradient id="areaPower" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={T.gold} stopOpacity={0.15} />
                                    <stop offset="100%" stopColor={T.gold} stopOpacity={0.01} />
                                </linearGradient>
                                <linearGradient id="areaXp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={T.orange} stopOpacity={0.15} />
                                    <stop offset="100%" stopColor={T.orange} stopOpacity={0.01} />
                                </linearGradient>
                                <clipPath id="lineChartClip">
                                    <rect x={LPL} y={LPT} width={lW} height={lH} />
                                </clipPath>
                            </defs>

                            {/* Left axis: Power */}
                            {ptsTicks.map((v, i) => {
                                const y = LPT + lH - (v / ptsMax) * lH;
                                return <g key={`pg${i}`}>
                                    <line x1={LPL} y1={y} x2={LCW - LPR} y2={y} stroke={T.borderLight} strokeWidth={0.5} />
                                    <text x={LPL - 8} y={y + 4} textAnchor="end" fontSize={10} fill={T.gold} fontWeight={500} opacity={0.8}>{v}</text>
                                </g>;
                            })}
                            {/* Right axis: XP */}
                            {xpTicks.map((v, i) => {
                                const y = LPT + lH - (v / xpMax) * lH;
                                return <text key={`xg${i}`} x={LCW - LPR + 10} y={y + 4} textAnchor="start" fontSize={10} fill={T.orange} fontWeight={500} opacity={0.8}>{v}</text>;
                            })}

                            <text x={LPL - 8} y={LPT - 8} textAnchor="end" fontSize={10} fill={T.gold} fontWeight={700}>POWER</text>
                            <text x={LCW - LPR + 10} y={LPT - 8} textAnchor="start" fontSize={10} fill={T.orange} fontWeight={700}>XP</text>
                            <line x1={LPL} y1={LPT + lH} x2={LCW - LPR} y2={LPT + lH} stroke={T.border} strokeWidth={1} />

                            {/* Clipped chart area */}
                            <g clipPath="url(#lineChartClip)">
                                {/* Area fills */}
                                {powerPts.length > 1 && (
                                    <path d={`${smoothPath(powerPts, 0.3, LPT, LPT + lH)}L${powerPts[powerPts.length - 1][0]},${LPT + lH}L${powerPts[0][0]},${LPT + lH}Z`} fill="url(#areaPower)" />
                                )}
                                {xpPts.length > 1 && (
                                    <path d={`${smoothPath(xpPts, 0.3, LPT, LPT + lH)}L${xpPts[xpPts.length - 1][0]},${LPT + lH}L${xpPts[0][0]},${LPT + lH}Z`} fill="url(#areaXp)" />
                                )}

                                {/* Lines */}
                                {powerPts.length > 1 && (
                                    <path d={smoothPath(powerPts, 0.3, LPT, LPT + lH)} fill="none" stroke={T.gold} strokeWidth={2} strokeLinecap="round" />
                                )}
                                {xpPts.length > 1 && (
                                    <path d={smoothPath(xpPts, 0.3, LPT, LPT + lH)} fill="none" stroke={T.orange} strokeWidth={2} strokeLinecap="round" />
                                )}
                            </g>

                            {/* Data points + X labels (outside clip so dots/labels always visible) */}
                            {dayData.map((d, i) => {
                                const x = LPL + (i / Math.max(dim - 1, 1)) * lW;
                                const isT = d.dk === today;
                                const isH = d.dn === hoverDay;
                                const showLabel = dim <= 15 || d.dn % 2 === 1 || d.dn === dim || isT;

                                return <g key={d.dk} onMouseEnter={() => setHoverDay(d.dn)} onMouseLeave={() => setHoverDay(null)}>
                                    {isH && <line x1={x} y1={LPT} x2={x} y2={LPT + lH} stroke={T.border} strokeWidth={1} strokeDasharray="3,3" />}

                                    {d.pts > 0 && <circle cx={powerPts[i][0]} cy={powerPts[i][1]} r={isH ? 5 : 3.5} fill={T.gold} stroke={T.surface} strokeWidth={2} />}
                                    {d.xp > 0 && <circle cx={xpPts[i][0]} cy={xpPts[i][1]} r={isH ? 5 : 3.5} fill={T.orange} stroke={T.surface} strokeWidth={2} />}

                                    {showLabel && (
                                        <text x={x} y={LPT + lH + 18} textAnchor="middle" fontSize={10} fill={isT ? T.gold : T.textMuted} fontWeight={isT ? 700 : 400}>{d.dn}</text>
                                    )}

                                    {/* Tooltip */}
                                    {isH && (d.pts > 0 || d.xp > 0) && (() => {
                                        const tw = 110, th = 50;
                                        let tx = x - tw / 2;
                                        if (tx < LPL) tx = LPL;
                                        if (tx + tw > LCW - LPR) tx = LCW - LPR - tw;
                                        return <g>
                                            <rect x={tx} y={LPT - th - 8} width={tw} height={th} rx={8} fill={T.text} opacity={0.95} />
                                            <text x={tx + tw / 2} y={LPT - th - 8 + 16} textAnchor="middle" fontSize={10} fill="#D6D3D1" fontWeight={500}>{mo + 1}/{d.dn}</text>
                                            <text x={tx + 12} y={LPT - th - 8 + 32} fontSize={11} fill={T.gold} fontWeight={700}>{d.pts}</text>
                                            <text x={tx + tw - 12} y={LPT - th - 8 + 32} textAnchor="end" fontSize={9} fill="#A8A29E">power</text>
                                            <text x={tx + 12} y={LPT - th - 8 + 45} fontSize={11} fill={T.orange} fontWeight={700}>{d.xp}</text>
                                            <text x={tx + tw - 12} y={LPT - th - 8 + 45} textAnchor="end" fontSize={9} fill="#A8A29E">xp</text>
                                        </g>;
                                    })()}
                                </g>;
                            })}
                        </svg>
                    </div>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
                        borderTop: `1px solid ${T.borderLight}`, paddingTop: '14px', marginTop: '8px',
                    }}>
                        <FooterStat label="Total Power" value={ms.pts.toLocaleString()} color={T.gold} />
                        <FooterStat label="Total XP" value={ms.xp.toLocaleString()} color={T.orange} />
                        <FooterStat label="Avg Level" value={`Lv.${g.avg.toFixed(2)}`} color={T.purple} />
                        <FooterStat label="Total Phrases" value={g.total.toLocaleString()} color={T.text} />
                    </div>
                </div>

                {/* ===== 5. SP SUMMARY CARD ===== */}
                <div style={{ ...cardStyle, padding: '24px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: T.text, letterSpacing: '-0.3px', marginBottom: '16px' }}>SP & Gacha</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        {/* Left: SP display */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                                <span style={{ fontSize: '40px', fontWeight: 900, color: T.purple, letterSpacing: '-1px', lineHeight: 1 }}>{(ps?.sparks ?? 0).toLocaleString()}</span>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: T.purple, opacity: 0.7 }}>SP</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                <MiniStat label="Legendary" value={ps?.legendary_count ?? 0} color="#D4AF37" />
                                <MiniStat label="Total Reps" value={ps?.total_touches ?? 0} color={T.green} />
                                <MiniStat label="SP / Rep" value={ps && ps.total_touches > 0 ? (ps.sparks / ps.total_touches).toFixed(1) : '0'} color={T.purple} />
                            </div>
                        </div>
                        {/* Right: Pity counter */}
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: T.textMuted, marginBottom: '10px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Pity Counter</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '10px' }}>
                                <span style={{ fontSize: '28px', fontWeight: 800, color: T.text, letterSpacing: '-0.5px' }}>{ps?.pity_counter ?? 0}</span>
                                <span style={{ fontSize: '14px', fontWeight: 500, color: T.textMuted }}>/ 200</span>
                            </div>
                            <div style={{ height: '10px', borderRadius: '5px', backgroundColor: T.borderLight, overflow: 'hidden', marginBottom: '8px' }}>
                                <div style={{
                                    height: '100%', borderRadius: '5px',
                                    width: `${Math.min(((ps?.pity_counter ?? 0) / 200) * 100, 100)}%`,
                                    background: (ps?.pity_counter ?? 0) >= 180 ? `linear-gradient(90deg, ${T.orange}, ${T.red})` : (ps?.pity_counter ?? 0) >= 100 ? `linear-gradient(90deg, ${T.gold}, ${T.orange})` : `linear-gradient(90deg, ${T.purple}, #A78BFA)`,
                                    transition: `width 500ms ${T.ease}`,
                                }} />
                            </div>
                            <div style={{ fontSize: '11px', color: T.textMuted }}>
                                {(ps?.pity_counter ?? 0) >= 180 ? 'Almost guaranteed MEGA+!' : (ps?.pity_counter ?? 0) >= 100 ? 'Halfway to pity guarantee' : 'Misses until MEGA+ guarantee'}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                {[
                                    { tier: 'LEGENDARY', rate: '0.5%', color: T.gold, sp: 777 },
                                    { tier: 'MEGA', rate: '1.5%', color: T.purple, sp: 77 },
                                    { tier: 'SUPER', rate: '3%', color: T.red, sp: 30 },
                                    { tier: 'GREAT', rate: '5%', color: T.orange, sp: 15 },
                                    { tier: 'BONUS', rate: '12%', color: T.green, sp: 5 },
                                ].map(g => (
                                    <div key={g.tier} style={{
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        padding: '3px 8px', borderRadius: '6px', backgroundColor: `${g.color}10`, border: `1px solid ${g.color}22`,
                                    }}>
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: g.color }}>{g.tier}</span>
                                        <span style={{ fontSize: '9px', color: T.textMuted }}>{g.rate} / {g.sp}SP</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== 6. ACTIVITY HEATMAP ===== */}
                <div style={{ ...cardStyle, padding: '24px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: T.text, letterSpacing: '-0.3px' }}>Activity Heatmap</div>
                            <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '3px' }}>Green intensity = review count</div>
                        </div>
                        <HeatScale color={T.green} label="Reps" max={calMaxReps} />
                    </div>
                    {/* Day headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                            <div key={d} style={{
                                textAlign: 'center', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
                                color: i === 0 ? '#DC2626' : i === 6 ? T.blue : T.textMuted, padding: '6px 0',
                            }}>{d}</div>
                        ))}
                    </div>
                    {/* Calendar grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: `repeat(${rows}, 1fr)`, gap: '4px' }}>
                        {calDays.map((day, idx) => {
                            if (day === null) return <div key={`e${idx}`} style={{ aspectRatio: '1', borderRadius: '10px', backgroundColor: T.borderLight }} />;
                            const dd = dayData[day - 1];
                            const isT = dd.dk === today;
                            const isFuture = dd.dk > today;
                            const dow = (fdow + day - 1) % 7;
                            const ratio = calMaxReps > 0 ? dd.reps / calMaxReps : 0;
                            const greenAlpha = ratio <= 0 ? 0 : Math.min(0.08 + ratio * 0.5, 0.6);

                            return (
                                <div key={day} style={{
                                    aspectRatio: '1', borderRadius: '10px', padding: '5px',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                    position: 'relative', overflow: 'hidden',
                                    backgroundColor: isFuture ? '#F5F5F4' : dd.reps > 0 ? `rgba(16,185,129,${greenAlpha})` : '#F5F5F4',
                                    border: isT ? '2px solid #D4AF37' : `1px solid ${dd.reps > 0 ? 'rgba(16,185,129,0.2)' : T.borderLight}`,
                                    boxShadow: isT ? '0 0 0 3px rgba(212,175,55,0.12)' : 'none',
                                    transition: `all 250ms ${T.ease}`,
                                    opacity: isFuture ? 0.4 : 1,
                                }}>
                                    <span style={{
                                        fontSize: '11px', fontWeight: 700, lineHeight: 1, position: 'relative', zIndex: 1,
                                        color: dow === 0 ? '#DC2626' : dow === 6 ? T.blue : isT ? T.gold : ratio > 0.5 ? '#FFF' : T.text,
                                    }}>{day}</span>
                                    {dd.reps > 0 && !isFuture && (
                                        <span style={{
                                            fontSize: ratio > 0.7 ? '15px' : ratio > 0.3 ? '13px' : '11px',
                                            fontWeight: 700, color: ratio > 0.5 ? '#FFF' : '#059669',
                                            textAlign: 'center', lineHeight: 1, position: 'relative', zIndex: 1,
                                        }}>{dd.reps}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===== 7. WEEKLY BREAKDOWN TABLE ===== */}
                <div style={{ ...cardStyle, padding: '24px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: T.text, letterSpacing: '-0.3px', marginBottom: '16px' }}>Weekly Breakdown</div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                            <thead>
                                <tr>
                                    {['Week', 'Days', 'Reps', 'XP', 'Power', 'Avg Lv'].map((h, i) => (
                                        <th key={h} style={{
                                            padding: '10px 8px', textAlign: i === 0 ? 'left' : 'right',
                                            fontWeight: 700, color: T.textMuted, fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase',
                                            borderBottom: `2px solid ${T.border}`,
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {weeks.map((w, i) => (
                                    <tr key={i} style={{ borderBottom: `1px solid ${T.borderLight}` }}>
                                        <td style={{ padding: '10px 8px', color: T.text, fontWeight: 600, fontSize: '13px' }}>{mo + 1}/{w.label}</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'right', color: T.textSub, fontWeight: 500, fontSize: '13px' }}>{w.days}d</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'right', color: T.green, fontWeight: 700, fontSize: '13px' }}>{w.reps}</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'right', color: T.orange, fontWeight: 700, fontSize: '13px' }}>{w.xp}</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'right', color: T.gold, fontWeight: 700, fontSize: '13px' }}>{w.pts}</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'right', color: T.purple, fontWeight: 500, fontSize: '13px' }}>{w.avgLv.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr style={{ borderTop: `2px solid ${T.border}` }}>
                                    <td style={{ padding: '10px 8px', color: T.text, fontWeight: 800, fontSize: '13px' }}>Total</td>
                                    <td style={{ padding: '10px 8px', textAlign: 'right', color: T.text, fontWeight: 700, fontSize: '13px' }}>{ms.activeDays}d</td>
                                    <td style={{ padding: '10px 8px', textAlign: 'right', color: T.green, fontWeight: 800, fontSize: '13px' }}>{ms.reps}</td>
                                    <td style={{ padding: '10px 8px', textAlign: 'right', color: T.orange, fontWeight: 800, fontSize: '13px' }}>{ms.xp}</td>
                                    <td style={{ padding: '10px 8px', textAlign: 'right', color: T.gold, fontWeight: 800, fontSize: '13px' }}>{ms.pts}</td>
                                    <td style={{ padding: '10px 8px', textAlign: 'right', color: T.purple, fontWeight: 700, fontSize: '13px' }}>{g.avg.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ===== RESPONSIVE STYLES ===== */}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg) } }
                @media (max-width: 768px) {
                    /* KPI grid: 2 columns on mobile */
                    div[style*="gridTemplateColumns: repeat(4"] {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
            `}</style>
        </div>
    );
}

// ===== Sub-components =====

const cardStyle: React.CSSProperties = {
    backgroundColor: T.surface,
    borderRadius: T.radius,
    boxShadow: T.shadowMd,
    border: `1px solid ${T.border}`,
};

function NavBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            background: 'transparent', border: 'none', borderRadius: '6px',
            padding: '4px 8px', cursor: 'pointer', fontSize: '13px', color: T.textSub,
            transition: `all 150ms ${T.ease}`, fontWeight: 600, lineHeight: 1,
        }}>{children}</button>
    );
}

function KpiCard({ label, value, sub, color, bg }: { label: string; value: string; sub: string; color: string; bg: string }) {
    return (
        <div style={{
            borderRadius: T.radius, padding: '18px 20px', position: 'relative', overflow: 'hidden',
            background: bg, border: `1px solid ${T.borderLight}`, boxShadow: T.shadow,
        }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1.1, letterSpacing: '-0.5px' }}>{value}</div>
            <div style={{ fontSize: '11px', fontWeight: 500, color: T.textMuted, marginTop: '6px' }}>{sub}</div>
        </div>
    );
}

function FooterStat({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
    return (
        <div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '4px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color, letterSpacing: '-0.3px' }}>{value}</span>
                {sub && <span style={{ fontSize: '10px', color: T.textMuted }}>{sub}</span>}
            </div>
        </div>
    );
}

function MiniStat({ label, value, color }: { label: string; value: number | string; color: string }) {
    return (
        <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: `${color}08`, border: `1px solid ${color}15` }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '4px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color, letterSpacing: '-0.3px' }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
        </div>
    );
}

function HeatScale({ label, max }: { color?: string; label: string; max: number }) {
    const steps = [0, 0.15, 0.3, 0.45, 0.6, 0.75];
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: T.textMuted, fontWeight: 500 }}>0</span>
            <div style={{ display: 'flex', gap: '2px' }}>
                {steps.map((s, i) => (
                    <div key={i} style={{
                        width: '14px', height: '14px', borderRadius: '3px',
                        backgroundColor: s === 0 ? T.borderLight : `rgba(16,185,129,${0.08 + s * 0.7})`,
                        border: `1px solid ${T.borderLight}`,
                    }} />
                ))}
            </div>
            <span style={{ fontSize: '10px', color: T.textMuted, fontWeight: 500 }}>{max} {label}</span>
        </div>
    );
}
