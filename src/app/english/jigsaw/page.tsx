'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Trash2, Edit3, Check, List, Upload, RotateCcw } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type RegisteredWord = { word: string; meaning: string; date: string };
type EdgeType = 'flat' | 'tab' | 'blank';
type PieceEdges = { top: EdgeType; right: EdgeType; bottom: EdgeType; left: EdgeType };
type GridConfig = { cols: number; rows: number; label: string };

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'jigsaw-puzzle-words';
const BG_STORAGE_KEY = 'jigsaw-puzzle-bg';
const PAD = 12;
const GOLD = '#D4AF37';
const GOLD_DARK = '#B8960C';

const GRID_OPTIONS: GridConfig[] = [
    { cols: 8, rows: 6, label: '48' },
    { cols: 10, rows: 10, label: '100' },
    { cols: 25, rows: 20, label: '500' },
    { cols: 40, rows: 25, label: '1000' },
];

// ─── Utilities ───────────────────────────────────────────────────────────────

function seededRandom(seed: number): number {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

function generateEdgeTopology(cols: number, rows: number): PieceEdges[][] {
    const grid: PieceEdges[][] = [];
    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            grid[r][c] = {
                top: r === 0 ? 'flat' : (grid[r - 1][c].bottom === 'tab' ? 'blank' : 'tab'),
                left: c === 0 ? 'flat' : (grid[r][c - 1].right === 'tab' ? 'blank' : 'tab'),
                bottom: r === rows - 1 ? 'flat' : ((r + c) % 2 === 0 ? 'tab' : 'blank'),
                right: c === cols - 1 ? 'flat' : ((r + c) % 2 === 0 ? 'blank' : 'tab'),
            };
        }
    }
    return grid;
}

// ─── Canvas Path Tracing ─────────────────────────────────────────────────────

function traceEdge(
    ctx: CanvasRenderingContext2D,
    sx: number, sy: number, ex: number, ey: number,
    type: EdgeType, dir: 'top' | 'right' | 'bottom' | 'left',
    tw: number, th: number,
) {
    if (type === 'flat') { ctx.lineTo(ex, ey); return; }
    const mx = (sx + ex) / 2, my = (sy + ey) / 2;
    const sign = type === 'tab' ? -1 : 1;
    let nx = 0, ny = 0;
    if (dir === 'top') ny = sign * th;
    else if (dir === 'bottom') ny = -sign * th;
    else if (dir === 'left') nx = sign * tw;
    else nx = -sign * tw;
    const t1x = sx + (ex - sx) * 0.35, t1y = sy + (ey - sy) * 0.35;
    const t2x = sx + (ex - sx) * 0.65, t2y = sy + (ey - sy) * 0.65;
    ctx.lineTo(t1x, t1y);
    ctx.bezierCurveTo(t1x + nx * 0.4, t1y + ny * 0.4, mx + nx, my + ny, mx + nx, my + ny);
    ctx.bezierCurveTo(mx + nx, my + ny, t2x + nx * 0.4, t2y + ny * 0.4, t2x, t2y);
    ctx.lineTo(ex, ey);
}

function tracePiece(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, e: PieceEdges) {
    const tw = w * 0.15, th = h * 0.15;
    ctx.moveTo(x, y);
    traceEdge(ctx, x, y, x + w, y, e.top, 'top', tw, th);
    traceEdge(ctx, x + w, y, x + w, y + h, e.right, 'right', tw, th);
    traceEdge(ctx, x + w, y + h, x, y + h, e.bottom, 'bottom', tw, th);
    traceEdge(ctx, x, y + h, x, y, e.left, 'left', tw, th);
    ctx.closePath();
}

// ─── Procedural Background ──────────────────────────────────────────────────

function drawMountain(ctx: CanvasRenderingContext2D, w: number, h: number, base: number, color: string, amp: number, seed: number) {
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
        const px = (i / 50) * w;
        const n = seededRandom(seed + i) * amp + seededRandom(seed + i + 99) * amp * 0.4;
        const py = h * base - n * h;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.lineTo(w, h * 0.65);
    ctx.lineTo(0, h * 0.65);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    sky.addColorStop(0, '#0f0c29');
    sky.addColorStop(0.15, '#1a1a4e');
    sky.addColorStop(0.35, '#553c9a');
    sky.addColorStop(0.55, '#b74b8a');
    sky.addColorStop(0.75, '#ee6b4d');
    sky.addColorStop(0.9, '#f4a261');
    sky.addColorStop(1.0, '#e9c46a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Stars
    for (let i = 0; i < 100; i++) {
        const sx = seededRandom(i * 3 + 0.1) * w;
        const sy = seededRandom(i * 3 + 0.2) * h * 0.3;
        const sr = seededRandom(i * 3 + 0.3) * 1.5 + 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${seededRandom(i * 3 + 0.4) * 0.6 + 0.2})`;
        ctx.fill();
    }

    // Sun
    const sunX = w * 0.6, sunY = h * 0.43, sunR = Math.min(w, h) * 0.05;
    const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.5, sunX, sunY, sunR * 5);
    glow.addColorStop(0, 'rgba(255,220,130,0.6)');
    glow.addColorStop(0.3, 'rgba(255,200,100,0.2)');
    glow.addColorStop(1, 'rgba(255,200,100,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR * 5, 0, Math.PI * 2);
    ctx.fill();
    const disc = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
    disc.addColorStop(0, '#fff8e1');
    disc.addColorStop(0.5, '#ffe082');
    disc.addColorStop(1, '#ffca28');
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    ctx.fill();

    // Mountains
    drawMountain(ctx, w, h, 0.48, '#1a0a3e', 0.12, 100);
    drawMountain(ctx, w, h, 0.53, '#2a1a5e', 0.09, 200);
    drawMountain(ctx, w, h, 0.57, '#3a2a6e', 0.06, 300);

    // Water
    const water = ctx.createLinearGradient(0, h * 0.6, 0, h);
    water.addColorStop(0, '#e9c46a');
    water.addColorStop(0.1, '#ee6b4d');
    water.addColorStop(0.3, '#b74b8a');
    water.addColorStop(0.6, '#553c9a');
    water.addColorStop(1.0, '#1a1a4e');
    ctx.fillStyle = water;
    ctx.fillRect(0, h * 0.6, w, h * 0.4);

    // Reflection
    const refl = ctx.createLinearGradient(sunX, h * 0.6, sunX, h * 0.85);
    refl.addColorStop(0, 'rgba(255,220,130,0.3)');
    refl.addColorStop(1, 'rgba(255,220,130,0)');
    ctx.fillStyle = refl;
    ctx.fillRect(sunX - sunR * 3, h * 0.6, sunR * 6, h * 0.25);

    // Ripples
    for (let i = 0; i < 18; i++) {
        const ry = h * 0.63 + i * (h * 0.37 / 18);
        ctx.beginPath();
        ctx.moveTo(0, ry);
        for (let x = 0; x <= w; x += 12) ctx.lineTo(x, ry + Math.sin(x * 0.015 + i * 1.5) * 1.5);
        ctx.strokeStyle = `rgba(255,255,255,${0.02 + (1 - i / 18) * 0.04})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// ─── Image Resize ────────────────────────────────────────────────────────────

function resizeImg(dataUrl: string, maxDim: number): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            let { width: iw, height: ih } = img;
            if (iw > maxDim || ih > maxDim) {
                const r = Math.min(maxDim / iw, maxDim / ih);
                iw = Math.round(iw * r);
                ih = Math.round(ih * r);
            }
            const c = document.createElement('canvas');
            c.width = iw; c.height = ih;
            c.getContext('2d')!.drawImage(img, 0, 0, iw, ih);
            resolve(c.toDataURL('image/jpeg', 0.85));
        };
        img.src = dataUrl;
    });
}

// ─── Word List Modal ─────────────────────────────────────────────────────────

function WordListModal({ words, onClose, onDelete }: {
    words: Record<string, RegisteredWord>;
    onClose: () => void;
    onDelete: (key: string) => void;
}) {
    const entries = Object.entries(words).sort((a, b) => new Date(b[1].date).getTime() - new Date(a[1].date).getTime());
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
            onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 520, maxHeight: '70vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#292524' }}>Registered Words ({entries.length})</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#78716c' }}><X size={20} /></button>
                </div>
                {entries.length === 0 ? (
                    <p style={{ color: '#a8a29e', textAlign: 'center', padding: '32px 0' }}>No words registered yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {entries.map(([key, w]) => (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#fafaf9', borderRadius: 10, border: '1px solid #e7e5e4' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 15, color: '#292524' }}>{w.word}</div>
                                    <div style={{ fontSize: 13, color: '#78716c', marginTop: 2 }}>{w.meaning}</div>
                                </div>
                                <button onClick={() => onDelete(key)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#d6d3d1', transition: 'color 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#d6d3d1')}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

// ─── Word Modal ──────────────────────────────────────────────────────────────

function WordModal({ pieceKey, existing, onSave, onDelete, onClose }: {
    pieceKey: string;
    existing: RegisteredWord | null;
    onSave: (key: string, w: RegisteredWord) => void;
    onDelete: (key: string) => void;
    onClose: () => void;
}) {
    const [word, setWord] = useState(existing?.word || '');
    const [meaning, setMeaning] = useState(existing?.meaning || '');
    const [editing, setEditing] = useState(!existing);
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

    const save = () => {
        if (!word.trim()) return;
        onSave(pieceKey, { word: word.trim(), meaning: meaning.trim(), date: new Date().toISOString() });
        onClose();
    };
    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); }
        if (e.key === 'Escape') onClose();
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e7e5e4',
        fontSize: 15, color: '#292524', outline: 'none', boxSizing: 'border-box',
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
            onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 400, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#292524', letterSpacing: 0.5 }}>
                        {existing && !editing ? 'WORD DETAIL' : existing ? 'EDIT WORD' : 'ADD WORD'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#78716c' }}><X size={18} /></button>
                </div>

                {existing && !editing ? (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, color: '#a8a29e', fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>WORD</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#292524' }}>{existing.word}</div>
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontSize: 12, color: '#a8a29e', fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>MEANING</div>
                            <div style={{ fontSize: 15, color: '#57534e' }}>{existing.meaning || '-'}</div>
                        </div>
                        <div style={{ fontSize: 11, color: '#d6d3d1', marginBottom: 20 }}>Added {new Date(existing.date).toLocaleDateString()}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setEditing(true)}
                                style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #e7e5e4', backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#57534e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <Edit3 size={14} /> Edit
                            </button>
                            <button onClick={() => { onDelete(pieceKey); onClose(); }}
                                style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #fecaca', backgroundColor: '#fef2f2', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ display: 'block', fontSize: 12, color: '#a8a29e', fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>WORD</label>
                            <input ref={ref} value={word} onChange={e => setWord(e.target.value)} onKeyDown={onKey} placeholder="e.g. serendipity"
                                style={inputStyle}
                                onFocus={e => (e.target.style.borderColor = GOLD)} onBlur={e => (e.target.style.borderColor = '#e7e5e4')} />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', fontSize: 12, color: '#a8a29e', fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>MEANING</label>
                            <input value={meaning} onChange={e => setMeaning(e.target.value)} onKeyDown={onKey} placeholder="e.g. a happy accident"
                                style={inputStyle}
                                onFocus={e => (e.target.style.borderColor = GOLD)} onBlur={e => (e.target.style.borderColor = '#e7e5e4')} />
                        </div>
                        <button onClick={save} disabled={!word.trim()}
                            style={{
                                width: '100%', padding: 12, borderRadius: 10, border: 'none',
                                background: word.trim() ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})` : '#e7e5e4',
                                color: word.trim() ? '#fff' : '#a8a29e', fontSize: 14, fontWeight: 700,
                                cursor: word.trim() ? 'pointer' : 'not-allowed', letterSpacing: 0.5,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            }}>
                            <Check size={16} /> {existing ? 'Update' : 'Register'}
                        </button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

// ─── Progress Bar ────────────────────────────────────────────────────────────

function ProgressBar({ filled, total }: { filled: number; total: number }) {
    const pct = total === 0 ? 0 : (filled / total) * 100;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 180 }}>
            <div style={{ flex: 1, height: 5, backgroundColor: '#e7e5e4', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${GOLD}, #10B981)`, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#57534e', whiteSpace: 'nowrap' }}>{filled}/{total}</span>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function JigsawPuzzlePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [grid, setGrid] = useState<GridConfig>(GRID_OPTIONS[0]);
    const [words, setWords] = useState<Record<string, RegisteredWord>>({});
    const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [showList, setShowList] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [cSize, setCSize] = useState({ w: 800, h: 600 });

    // Load data
    useEffect(() => {
        try { const s = localStorage.getItem(STORAGE_KEY); if (s) setWords(JSON.parse(s)); } catch { /* */ }
        try {
            const b = localStorage.getItem(BG_STORAGE_KEY);
            if (b) { const i = new Image(); i.onload = () => setBgImg(i); i.src = b; }
        } catch { /* */ }
    }, []);

    const saveWords = useCallback((u: Record<string, RegisteredWord>) => {
        setWords(u);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); } catch { /* */ }
    }, []);

    // Resize
    useEffect(() => {
        const fn = () => {
            setIsMobile(window.innerWidth < 768);
            if (containerRef.current) {
                setCSize({ w: containerRef.current.clientWidth, h: Math.max(400, window.innerHeight - 130) });
            }
        };
        fn();
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    const edges = useMemo(() => generateEdgeTopology(grid.cols, grid.rows), [grid.cols, grid.rows]);

    const MIN_P = isMobile ? 44 : 28;
    const dw = Math.max(cSize.w, grid.cols * MIN_P + PAD * 2);
    const dh = Math.max(cSize.h, grid.rows * MIN_P + PAD * 2);
    const pw = (dw - PAD * 2) / grid.cols;
    const ph = (dh - PAD * 2) / grid.rows;

    const filledCount = useMemo(() => {
        let n = 0;
        for (const k of Object.keys(words)) {
            const [r, c] = k.split('-').map(Number);
            if (r < grid.rows && c < grid.cols) n++;
        }
        return n;
    }, [words, grid]);

    // ─── Canvas Draw ─────────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = dw * dpr;
        canvas.height = dh * dpr;
        canvas.style.width = `${dw}px`;
        canvas.style.height = `${dh}px`;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Background
        if (bgImg) {
            ctx.drawImage(bgImg, 0, 0, dw, dh);
        } else {
            drawBackground(ctx, dw, dh);
        }

        // Pieces
        const showTxt = pw > 45;
        for (let r = 0; r < grid.rows; r++) {
            for (let c = 0; c < grid.cols; c++) {
                const key = `${r}-${c}`;
                const x = PAD + c * pw, y = PAD + r * ph;
                const e = edges[r]?.[c];
                if (!e) continue;
                const wd = words[key];
                const empty = !wd;
                const hov = hovered === key;

                // Empty pieces: opaque cover
                if (empty) {
                    ctx.beginPath();
                    tracePiece(ctx, x, y, pw, ph, e);
                    ctx.fillStyle = hov ? '#FDF6E3' : '#F0EBE3';
                    ctx.fill();
                }

                // Outline
                ctx.beginPath();
                tracePiece(ctx, x, y, pw, ph, e);
                if (hov) {
                    ctx.strokeStyle = GOLD;
                    ctx.lineWidth = 2.5;
                } else if (empty) {
                    ctx.strokeStyle = '#C8C3BB';
                    ctx.lineWidth = 0.8;
                } else {
                    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                    ctx.lineWidth = 0.5;
                }
                ctx.stroke();

                // Text
                const cx = x + pw / 2, cy = y + ph / 2;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                if (empty && pw > 22) {
                    ctx.font = `300 ${Math.min(pw * 0.28, 22)}px system-ui, sans-serif`;
                    ctx.fillStyle = hov ? GOLD : '#B8B3AA';
                    ctx.fillText('+', cx, cy);
                } else if (!empty && showTxt) {
                    // Overlay for readability
                    ctx.beginPath();
                    tracePiece(ctx, x, y, pw, ph, e);
                    ctx.fillStyle = 'rgba(0,0,0,0.22)';
                    ctx.fill();

                    const ml = Math.max(3, Math.floor(pw / 8));
                    const tr = (s: string, n: number) => s.length > n ? s.slice(0, n - 1) + '..' : s;

                    ctx.fillStyle = '#fff';
                    ctx.font = `bold ${Math.min(pw * 0.15, 13)}px system-ui, sans-serif`;
                    ctx.fillText(tr(wd.word, ml), cx, cy - ph * 0.04);

                    if (wd.meaning) {
                        ctx.fillStyle = 'rgba(255,255,255,0.7)';
                        ctx.font = `${Math.min(pw * 0.10, 10)}px system-ui, sans-serif`;
                        ctx.fillText(tr(wd.meaning, ml + 3), cx, cy + ph * 0.14);
                    }
                }
            }
        }
    }, [dw, dh, bgImg, words, hovered, edges, grid, pw, ph]);

    // ─── Mouse / Touch ───────────────────────────────────────────────────────
    const pieceFromEvent = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const col = Math.floor((mx - PAD) / pw);
        const row = Math.floor((my - PAD) / ph);
        if (col >= 0 && col < grid.cols && row >= 0 && row < grid.rows) return `${row}-${col}`;
        return null;
    }, [grid, pw, ph]);

    const onMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isMobile) return;
        const k = pieceFromEvent(e);
        setHovered(prev => prev === k ? prev : k);
    }, [isMobile, pieceFromEvent]);

    const onClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const k = pieceFromEvent(e);
        if (k) setSelected(k);
    }, [pieceFromEvent]);

    // ─── Image Upload ────────────────────────────────────────────────────────
    const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            const resized = await resizeImg(reader.result as string, 1600);
            const img = new Image();
            img.onload = () => {
                setBgImg(img);
                try { localStorage.setItem(BG_STORAGE_KEY, resized); } catch { /* */ }
            };
            img.src = resized;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }, []);

    const resetBg = useCallback(() => {
        setBgImg(null);
        try { localStorage.removeItem(BG_STORAGE_KEY); } catch { /* */ }
    }, []);

    const handleSave = (k: string, w: RegisteredWord) => saveWords({ ...words, [k]: w });
    const handleDelete = (k: string) => { const u = { ...words }; delete u[k]; saveWords(u); };

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1c1917', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #292524', backgroundColor: '#1c1917', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/english" style={{ textDecoration: 'none', color: '#a8a29e', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={18} />
                </Link>
                <h1 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#e7e5e4', letterSpacing: 1 }}>VOCABULARY PUZZLE</h1>
                <ProgressBar filled={filledCount} total={grid.cols * grid.rows} />
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 3 }}>
                        {GRID_OPTIONS.map(o => (
                            <button key={o.label} onClick={() => setGrid(o)}
                                style={{
                                    padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                                    border: grid.label === o.label ? `2px solid ${GOLD}` : '1px solid #44403c',
                                    backgroundColor: grid.label === o.label ? 'rgba(212,175,55,0.15)' : 'transparent',
                                    color: grid.label === o.label ? GOLD : '#a8a29e',
                                }}>
                                {o.label}
                            </button>
                        ))}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} />
                    <button onClick={() => fileRef.current?.click()}
                        style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #44403c', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#a8a29e', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Upload size={12} /> Image
                    </button>
                    {bgImg && (
                        <button onClick={resetBg}
                            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #44403c', backgroundColor: 'transparent', cursor: 'pointer', color: '#78716c', display: 'flex', alignItems: 'center' }}>
                            <RotateCcw size={12} />
                        </button>
                    )}
                    <button onClick={() => setShowList(true)}
                        style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #44403c', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#a8a29e', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <List size={12} /> List
                    </button>
                </div>
            </div>

            {/* Canvas Container */}
            <div ref={containerRef} style={{ flex: 1, overflow: 'auto', padding: 8 }}>
                <canvas ref={canvasRef} onClick={onClick} onMouseMove={onMove} onMouseLeave={() => setHovered(null)}
                    style={{ display: 'block', margin: '0 auto', cursor: 'pointer', borderRadius: 6 }} />
            </div>

            {/* Modals */}
            <AnimatePresence>
                {selected && (
                    <WordModal key={`m-${selected}`} pieceKey={selected} existing={words[selected] || null}
                        onSave={handleSave} onDelete={handleDelete} onClose={() => setSelected(null)} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showList && <WordListModal words={words} onClose={() => setShowList(false)} onDelete={handleDelete} />}
            </AnimatePresence>
        </div>
    );
}
