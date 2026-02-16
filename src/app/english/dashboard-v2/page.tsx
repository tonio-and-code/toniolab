'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface DailyPhrase {
    id: string;
    english: string;
    japanese: string;
    category: string;
    date: string;
}

interface Vocabulary {
    id: string;
    phrase: string;
    meaning: string;
    type: string;
    mastery_level: number;
    created_at: string;
}

// Precise Sparkline with anti-aliasing optimization
function Sparkline({ data, color = '#3B82F6', width = 80, height = 28 }: {
    data: number[]; color?: string; width?: number; height?: number
}) {
    if (data.length < 2) return <div style={{ width, height }} />;

    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const padX = 2, padY = 3;

    const points = data.map((v, i) => {
        const x = Math.round((padX + (i / (data.length - 1)) * (width - padX * 2)) * 10) / 10;
        const y = Math.round((padY + (height - padY * 2) - ((v - min) / range) * (height - padY * 2)) * 10) / 10;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padX},${height - padY} ${points} ${width - padX},${height - padY}`;
    const gradientId = `spark-${color.replace('#', '')}`;

    return (
        <svg width={width} height={height} style={{ display: 'block', flexShrink: 0 }} shapeRendering="geometricPrecision">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill={`url(#${gradientId})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// Donut Chart with precise rendering
function DonutChart({ data, colors, size = 100 }: {
    data: { label: string; value: number }[]; colors: string[]; size?: number
}) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const cx = size / 2, cy = size / 2, r = size * 0.4, inner = size * 0.26;
    let angle = -90;

    return (
        <svg width={size} height={size} style={{ display: 'block', flexShrink: 0 }} shapeRendering="geometricPrecision">
            {data.map((d, i) => {
                const sweep = (d.value / total) * 360;
                const start = angle;
                angle += sweep;

                const s1 = (start * Math.PI) / 180;
                const s2 = ((start + sweep) * Math.PI) / 180;
                const large = sweep > 180 ? 1 : 0;

                const path = `M ${cx + r * Math.cos(s1)} ${cy + r * Math.sin(s1)}
                              A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(s2)} ${cy + r * Math.sin(s2)}
                              L ${cx + inner * Math.cos(s2)} ${cy + inner * Math.sin(s2)}
                              A ${inner} ${inner} 0 ${large} 0 ${cx + inner * Math.cos(s1)} ${cy + inner * Math.sin(s1)} Z`;

                return <path key={i} d={path} fill={colors[i % colors.length]} />;
            })}
        </svg>
    );
}

export default function DashboardV2Page() {
    const [phrases, setPhrases] = useState<DailyPhrase[]>([]);
    const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/phrases').then(r => r.json()),
            fetch('/api/user-phrases').then(r => r.json()),
        ]).then(([p, v]) => {
            if (p.success) setPhrases(p.phrases || []);
            if (v.success) setVocabulary(v.phrases || []);
        }).finally(() => setIsLoading(false));
    }, []);

    const todayStr = new Date().toISOString().split('T')[0];

    // Data Processing (Memoized)
    const dailyData = useMemo(() => {
        const data: { date: string; p: number; v: number; t: number; c: number }[] = [];
        let cum = 0;
        const d30 = new Date(); d30.setDate(d30.getDate() - 30);
        const d30s = d30.toISOString().split('T')[0];
        cum = phrases.filter(x => x.date < d30s).length + vocabulary.filter(x => x.created_at.split('T')[0] < d30s).length;

        for (let i = 29; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const ds = d.toISOString().split('T')[0];
            const dp = phrases.filter(x => x.date === ds).length;
            const dv = vocabulary.filter(x => x.created_at.split('T')[0] === ds).length;
            cum += dp + dv;
            data.push({ date: ds, p: dp, v: dv, t: dp + dv, c: cum });
        }
        return data;
    }, [phrases, vocabulary]);

    const m = useMemo(() => {
        const total = phrases.length + vocabulary.length;
        const w1 = dailyData.slice(-7), w2 = dailyData.slice(-14, -7);
        const w1t = w1.reduce((s, d) => s + d.t, 0);
        const w2t = w2.reduce((s, d) => s + d.t, 0);
        const wg = w2t > 0 ? ((w1t - w2t) / w2t) * 100 : w1t > 0 ? 100 : 0;
        const vel = w1t - w2t;
        const avg = dailyData.reduce((s, d) => s + d.t, 0) / 30;

        let streak = 0;
        for (let i = dailyData.length - 1; i >= 0 && dailyData[i].t > 0; i--) streak++;
        if (streak === 0 && dailyData.length > 1 && dailyData[dailyData.length - 1].t === 0) {
            for (let i = dailyData.length - 2; i >= 0 && dailyData[i].t > 0; i--) streak++;
        }

        const peak = dailyData.reduce((m, d) => d.t > m.t ? d : m, dailyData[0]);

        const types: Record<string, number> = {};
        vocabulary.forEach(x => { types[x.type] = (types[x.type] || 0) + 1; });
        const cats: Record<string, number> = {};
        phrases.forEach(x => { cats[x.category] = (cats[x.category] || 0) + 1; });

        return { total, w1t, w2t, wg, vel, avg, streak, peak, types, cats, pc: phrases.length, vc: vocabulary.length };
    }, [phrases, vocabulary, dailyData]);

    const cumData = dailyData.map(d => d.c);
    const dayData = dailyData.map(d => d.t);
    const pData = dailyData.map(d => d.p);
    const vData = dailyData.map(d => d.v);

    const pieData = Object.entries(m.types).sort((a, b) => b[1] - a[1]).map(([l, v]) => ({ label: l, value: v }));
    const pieColors = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777'];

    const fmt = (n: number, d = 1) => n.toFixed(d);
    const fmtDate = () => { const d = new Date(); return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`; };

    if (isLoading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="h-11 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-30">
                <div className="flex items-center gap-5">
                    <Link href="/english" className="text-slate-500 hover:text-blue-600 no-underline text-xs font-medium transition-colors">Back</Link>
                    <div className="w-[1px] h-4 bg-slate-200" />
                    <span className="text-[13px] font-semibold text-slate-900 tracking-wide">Learning Analytics</span>
                </div>
                <div className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-sm font-medium">{fmtDate()}</div>
            </header>

            <main className="p-4 md:p-5 max-w-6xl mx-auto">
                {/* KPI Section */}
                <section className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-3.5 shadow-sm">
                    <div className="h-[34px] bg-slate-50 border-b border-slate-200 flex items-center px-3.5">
                        <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">Key Performance Indicators</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0 divide-slate-200">
                        {[
                            { label: 'Total Items', value: m.total.toLocaleString(), sub: `${m.pc} / ${m.vc}`, spark: cumData, color: '#2563EB' },
                            { label: 'This Week', value: m.w1t, sub: 'vs last week', change: m.wg, spark: dayData.slice(-7), color: m.wg >= 0 ? '#059669' : '#DC2626' },
                            { label: 'Velocity', value: `${m.vel >= 0 ? '+' : ''}${m.vel}`, sub: 'accel', spark: dayData, color: m.vel >= 0 ? '#059669' : '#DC2626' },
                            { label: 'Daily Avg', value: fmt(m.avg), sub: 'items/day', spark: dayData, color: '#7C3AED' },
                            { label: 'Streak', value: m.streak, sub: 'days', spark: null, color: '#D97706' },
                            { label: 'Peak', value: m.peak.t, sub: new Date(m.peak.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }), spark: dayData, color: '#DB2777' },
                        ].map((item, i) => (
                            <div key={i} className="p-3.5 flex flex-col justify-between min-h-[88px] border-slate-200">
                                <div className="text-[10px] text-slate-400 tracking-wide uppercase mb-1.5">{item.label}</div>
                                <div className="flex justify-between items-end gap-2">
                                    <div>
                                        <div className="text-xl md:text-2xl font-bold text-slate-900 leading-none">{item.value}</div>
                                        <div className={`text-[10px] mt-1 font-medium ${item.change !== undefined ? (item.change >= 0 ? 'text-emerald-600' : 'text-red-600') : 'text-slate-400'}`}>
                                            {item.change !== undefined ? `${item.change >= 0 ? '+' : ''}${fmt(item.change)}%` : item.sub}
                                        </div>
                                    </div>
                                    {item.spark ? (
                                        <Sparkline data={item.spark} color={item.color} width={64} height={24} />
                                    ) : (
                                        <div className="flex gap-0.5 items-end h-6">
                                            {dayData.slice(-8).map((v, j) => {
                                                const maxV = Math.max(...dayData.slice(-8), 1);
                                                return <div key={j} style={{ width: 5, height: Math.max(3, (v / maxV) * 20), background: v > 0 ? item.color : '#E2E8F0', borderRadius: 1, opacity: v > 0 ? 0.4 + (v / maxV) * 0.6 : 0.25 }} />;
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Charts Row */}
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_260px_220px] gap-3.5 mb-3.5">
                    {/* Trend */}
                    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <div className="h-[34px] bg-slate-50 border-b border-slate-200 flex items-center justify-between px-3.5">
                            <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">30-Day Trend</span>
                            <div className="flex gap-3.5">
                                <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                    <span className="w-3 h-0.5 bg-blue-600 rounded-full" />Phrases
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                    <span className="w-3 h-0.5 bg-emerald-600 rounded-full" />Vocab
                                </span>
                            </div>
                        </div>
                        <div className="p-3.5 pt-3">
                            <svg width="100%" height="80" viewBox="0 0 400 80" preserveAspectRatio="none" className="block w-full">
                                {(() => {
                                    const all = [...pData, ...vData];
                                    const max = Math.max(...all, 1);
                                    const getY = (v: number) => 75 - (v / max) * 68;
                                    const pPts = pData.map((v, i) => `${(i / 29) * 394 + 3},${getY(v)}`).join(' ');
                                    const vPts = vData.map((v, i) => `${(i / 29) * 394 + 3},${getY(v)}`).join(' ');
                                    return (
                                        <>
                                            <polyline points={pPts} fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <polyline points={vPts} fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </>
                                    );
                                })()}
                            </svg>
                            <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 font-medium">
                                <span>30d ago</span><span>Today</span>
                            </div>
                        </div>
                    </section>

                    {/* Portfolio */}
                    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <div className="h-[34px] bg-slate-50 border-b border-slate-200 flex items-center px-3.5">
                            <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">Vocab Portfolio</span>
                        </div>
                        <div className="p-3 flex gap-3.5 items-center h-full">
                            {pieData.length > 0 ? (
                                <>
                                    <DonutChart data={pieData} colors={pieColors} size={80} />
                                    <div className="flex-1">
                                        {pieData.slice(0, 4).map((d, i) => (
                                            <div key={d.label} className="flex items-center justify-between mb-1.5">
                                                <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                                    <span style={{ background: pieColors[i] }} className="w-1.5 h-1.5 rounded-[1.5px]" />{d.label}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">{((d.value / m.vc) * 100).toFixed(0)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 text-center text-slate-400 text-[11px] p-4">No data</div>
                            )}
                        </div>
                    </section>

                    {/* Categories */}
                    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <div className="h-[34px] bg-slate-50 border-b border-slate-200 flex items-center px-3.5">
                            <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">Categories</span>
                        </div>
                        <div className="p-3">
                            {Object.entries(m.cats).length > 0 ? Object.entries(m.cats).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([cat, cnt], i) => (
                                <div key={cat} className="mb-2 last:mb-0">
                                    <div className="flex justify-between text-[10px] mb-1">
                                        <span className="text-slate-600 truncate max-w-[120px]">{cat}</span>
                                        <span className="text-slate-400 font-medium">{cnt}</span>
                                    </div>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div style={{ width: `${(cnt / m.pc) * 100}%`, background: pieColors[i] }} className="h-full rounded-full" />
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-slate-400 text-[11px] p-4">No data</div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Daily Activity */}
                <section className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-3.5 shadow-sm">
                    <div className="h-[34px] bg-slate-50 border-b border-slate-200 flex items-center px-3.5">
                        <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">Daily Activity</span>
                    </div>
                    <div className="p-3.5 pt-2.5">
                        <div className="flex gap-0.5 items-end h-[52px]">
                            {dailyData.map((d) => {
                                const maxV = Math.max(...dayData, 1);
                                const h = d.t > 0 ? Math.max(4, (d.t / maxV) * 46) : 2;
                                const isToday = d.date === todayStr;
                                const opacity = d.t > 0 ? 0.35 + (d.t / maxV) * 0.65 : 0.15;
                                return (
                                    <div key={d.date} className="flex-1 flex items-end justify-center">
                                        <div style={{
                                            width: '75%',
                                            height: h,
                                            background: isToday ? '#2563EB' : d.t > 0 ? '#64748B' : '#E2E8F0',
                                            opacity: isToday ? 1 : opacity
                                        }} className="rounded-[2px]" />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex mt-1.5">
                            {dailyData.map((d, i) => {
                                const isToday = d.date === todayStr;
                                const showLabel = i === 0 || i === 14 || isToday || i === dailyData.length - 1;
                                return (
                                    <div key={d.date} className={`flex-1 text-center text-[8px] ${isToday ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                                        {showLabel ? new Date(d.date).getDate() : ''}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {[
                        { href: '/english/phrases', label: 'Phrases', value: m.pc, color: 'text-blue-600', spark: pData },
                        { href: '/english/vocabulary', label: 'Vocabulary', value: m.vc, color: 'text-emerald-600', spark: vData },
                        { href: '/english/listening', label: 'Listening', value: 'YouTube', color: 'text-violet-600', spark: null },
                        { href: '/english/saved', label: 'Saved', value: 'Bookmarks', color: 'text-amber-600', spark: null },
                    ].map((item, i) => (
                        <Link key={i} href={item.href} className="no-underline">
                            <div className="bg-white rounded-lg border border-slate-200 p-3.5 flex justify-between items-center transition-colors hover:border-slate-300 shadow-sm">
                                <div>
                                    <div className="text-[9px] text-slate-400 mb-1 tracking-wide uppercase">{item.label}</div>
                                    <div className={`text-base md:text-[17px] font-semibold ${item.color} leading-none`}>{item.value}</div>
                                </div>
                                {item.spark && <Sparkline data={item.spark} color={item.color === 'text-blue-600' ? '#2563EB' : '#059669'} width={52} height={20} />}
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
