'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';

// ============================================================
// TYPES
// ============================================================

interface Vocabulary {
    id: string;
    phrase: string;
    type: string;
    meaning: string;
    note: string | null;
    example: string | null;
    mastery_level: number;
    times_used: number;
    created_at: string;
}

type GamePhase = 'lobby' | 'countdown' | 'battle' | 'boss-intro' | 'result';
type QuestionKind = 'meaning' | 'reverse' | 'fill' | 'listen';
type Difficulty = 'easy' | 'normal' | 'hard';
type AnswerResult = 'correct' | 'wrong' | 'timeout' | null;
type BattleRank = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

interface Question {
    word: Vocabulary;
    kind: QuestionKind;
    prompt: string;
    options: string[];
    correctIndex: number;
    isBoss: boolean;
}

interface RoundResult {
    question: Question;
    answered: number | null;   // index chosen, null = timeout
    correct: boolean;
    timeMs: number;
    combo: number;
    points: number;
}

// ============================================================
// CONFIG
// ============================================================

const ROUND_SIZE = 10;

const DIFFICULTY_CONFIG: Record<Difficulty, {
    timeMs: number; bossTimeMs: number; hpLoss: number;
    optionCount: number; label: string; labelJa: string;
    color: string; bg: string;
}> = {
    easy:   { timeMs: 5000, bossTimeMs: 3500, hpLoss: 15, optionCount: 4, label: 'EASY',   labelJa: '初級', color: '#10B981', bg: '#ECFDF5' },
    normal: { timeMs: 3500, bossTimeMs: 2200, hpLoss: 20, optionCount: 4, label: 'NORMAL', labelJa: '中級', color: '#D97706', bg: '#FFFBEB' },
    hard:   { timeMs: 2500, bossTimeMs: 1500, hpLoss: 25, optionCount: 6, label: 'HARD',   labelJa: '上級', color: '#EF4444', bg: '#FEF2F2' },
};

const MAX_HP = 100;
const FEVER_THRESHOLD = 5;
const BASE_POINTS = 100;
const COMBO_BONUS = 50;
const SPEED_MULTIPLIER = 30;
const BOSS_MULTIPLIER = 2;
const FEVER_MULTIPLIER = 1.5;

const RANK_THRESHOLDS: { rank: BattleRank; minAccuracy: number; minCombo: number; color: string; bg: string; glow: string }[] = [
    { rank: 'S', minAccuracy: 90, minCombo: 5, color: '#D4AF37', bg: 'linear-gradient(135deg, #1C1917 0%, #2D2438 50%, #1c1813 100%)', glow: '0 0 40px #D4AF3780, 0 0 80px #D4AF3740' },
    { rank: 'A', minAccuracy: 80, minCombo: 3, color: '#A855F7', bg: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)', glow: '0 0 30px #A855F760' },
    { rank: 'B', minAccuracy: 70, minCombo: 0, color: '#3B82F6', bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', glow: '0 0 20px #3B82F640' },
    { rank: 'C', minAccuracy: 60, minCombo: 0, color: '#10B981', bg: '#ECFDF5', glow: '0 0 10px #10B98130' },
    { rank: 'D', minAccuracy: 50, minCombo: 0, color: '#F59E0B', bg: '#FFFBEB', glow: 'none' },
    { rank: 'F', minAccuracy: 0,  minCombo: 0, color: '#EF4444', bg: '#FEF2F2', glow: 'none' },
];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'word':          { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
    'phrasal verb':  { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    'idiom':         { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    'slang':         { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' },
    'collocation':   { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
    'expression':    { bg: '#ECFEFF', text: '#0891B2', border: '#A5F3FC' },
};

const BOSS_TYPES = ['idiom', 'collocation', 'phrasal verb', 'expression', 'slang'];

// ============================================================
// SOUND SYSTEM (Web Audio synthesis, same pattern as training)
// ============================================================

let audioCtx: AudioContext | null = null;
function getCtx(): AudioContext {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function playTone(freq: number, type: OscillatorType, duration: number, vol = 0.15, delay = 0) {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration + 0.05);
    } catch { /* audio not available */ }
}

function playCorrectSound(combo: number) {
    const base = 440 + Math.min(combo, 10) * 30;
    playTone(base, 'triangle', 0.15, 0.12);
    playTone(base * 1.25, 'triangle', 0.15, 0.1, 0.05);
    playTone(base * 1.5, 'sine', 0.2, 0.08, 0.1);
}

function playWrongSound() {
    playTone(150, 'sawtooth', 0.15, 0.1);
    playTone(120, 'sawtooth', 0.2, 0.08, 0.05);
}

function playComboMilestone(level: number) {
    const freqs = [523, 659, 784, 988, 1175, 1319, 1568];
    const count = Math.min(level, 7);
    for (let i = 0; i < count; i++) {
        playTone(freqs[i], 'sine', 0.3, 0.08, i * 0.06);
    }
}

function playFeverEnter() {
    // Sweep up + chord
    playTone(80, 'sawtooth', 0.4, 0.1);
    playTone(160, 'sawtooth', 0.3, 0.08, 0.1);
    [523, 659, 784, 1047, 1319].forEach((f, i) => {
        playTone(f, 'triangle', 0.4, 0.07, 0.3 + i * 0.08);
    });
}

function playFeverExit() {
    playTone(800, 'sawtooth', 0.3, 0.08);
    playTone(400, 'sawtooth', 0.3, 0.06, 0.1);
    playTone(100, 'triangle', 0.4, 0.05, 0.2);
}

function playBossEntrance() {
    playTone(60, 'sawtooth', 0.6, 0.12);
    playTone(80, 'square', 0.4, 0.06, 0.15);
    playTone(120, 'sawtooth', 0.3, 0.08, 0.3);
    [220, 277, 330, 440].forEach((f, i) => {
        playTone(f, 'triangle', 0.5, 0.06, 0.5 + i * 0.1);
    });
}

function playCountdownTick() {
    playTone(880, 'triangle', 0.08, 0.1);
}

function playCountdownGo() {
    playTone(1047, 'sine', 0.2, 0.12);
    playTone(1319, 'sine', 0.2, 0.1, 0.08);
    playTone(1568, 'sine', 0.3, 0.08, 0.16);
}

function playTimerWarning() {
    playTone(660, 'square', 0.06, 0.04);
}

function playRankReveal(rank: BattleRank) {
    const rankFreqs: Record<BattleRank, number[]> = {
        S: [440, 554, 659, 880, 1109, 1319, 1760],
        A: [440, 554, 659, 880, 1109],
        B: [440, 554, 659, 880],
        C: [440, 554, 659],
        D: [440, 554],
        F: [220],
    };
    rankFreqs[rank].forEach((f, i) => {
        playTone(f, rank === 'S' ? 'sine' : 'triangle', 0.4, 0.07, i * 0.08);
    });
}

function playGameOver() {
    [440, 370, 311, 261, 220].forEach((f, i) => {
        playTone(f, 'triangle', 0.3, 0.08, i * 0.12);
    });
}

// ============================================================
// GAME LOGIC
// ============================================================

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function weightedPick(words: Vocabulary[], count: number): Vocabulary[] {
    // Lower mastery = higher weight
    const weighted = words.map(w => ({
        word: w,
        weight: Math.max(1, 5 - w.mastery_level) + (w.times_used < 3 ? 2 : 0),
    }));
    const totalWeight = weighted.reduce((s, w) => s + w.weight, 0);
    const picked: Vocabulary[] = [];
    const used = new Set<string>();

    while (picked.length < count && picked.length < words.length) {
        let r = Math.random() * totalWeight;
        for (const item of weighted) {
            if (used.has(item.word.id)) continue;
            r -= item.weight;
            if (r <= 0) {
                picked.push(item.word);
                used.add(item.word.id);
                break;
            }
        }
        // Safety: if random didn't pick (rounding), just grab next unused
        if (picked.length < count) {
            const remaining = words.filter(w => !used.has(w.id));
            if (remaining.length > 0 && picked.length < count) {
                const next = remaining[Math.floor(Math.random() * remaining.length)];
                if (!used.has(next.id)) {
                    picked.push(next);
                    used.add(next.id);
                }
            }
        }
    }
    return picked;
}

function getDistractors(target: Vocabulary, pool: Vocabulary[], count: number, field: 'phrase' | 'meaning'): string[] {
    const sameType = pool.filter(w => w.type === target.type && w.id !== target.id);
    const others = pool.filter(w => w.type !== target.type && w.id !== target.id);
    const candidates = [...shuffle(sameType), ...shuffle(others)];
    return candidates.slice(0, count).map(w => w[field]);
}

function pickQuestionKind(word: Vocabulary, difficulty: Difficulty): QuestionKind {
    if (difficulty === 'easy') return 'meaning';
    const kinds: QuestionKind[] = ['meaning', 'reverse'];
    if (word.example && word.example.toLowerCase().includes(word.phrase.toLowerCase())) {
        kinds.push('fill');
    }
    kinds.push('listen');
    return kinds[Math.floor(Math.random() * kinds.length)];
}

function generateQuestion(word: Vocabulary, pool: Vocabulary[], difficulty: Difficulty, isBoss: boolean): Question {
    const cfg = DIFFICULTY_CONFIG[difficulty];
    const kind = pickQuestionKind(word, difficulty);
    const distractorCount = cfg.optionCount - 1;
    let prompt = '';
    let correctAnswer = '';
    let distractors: string[] = [];

    switch (kind) {
        case 'meaning':
            prompt = word.phrase;
            correctAnswer = word.meaning;
            distractors = getDistractors(word, pool, distractorCount, 'meaning');
            break;
        case 'reverse':
            prompt = word.meaning;
            correctAnswer = word.phrase;
            distractors = getDistractors(word, pool, distractorCount, 'phrase');
            break;
        case 'fill': {
            const ex = word.example || '';
            const regex = new RegExp(word.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            prompt = ex.replace(regex, '________');
            correctAnswer = word.phrase;
            distractors = getDistractors(word, pool, distractorCount, 'phrase');
            break;
        }
        case 'listen':
            prompt = 'LISTEN';
            correctAnswer = word.phrase;
            distractors = getDistractors(word, pool, distractorCount, 'phrase');
            break;
    }

    // Build options array with correct answer inserted at random position
    const allOptions = shuffle([correctAnswer, ...distractors.slice(0, distractorCount)]);
    // Ensure we have exactly optionCount options (pad with "---" if pool too small)
    while (allOptions.length < cfg.optionCount) allOptions.push('---');
    const correctIndex = allOptions.indexOf(correctAnswer);

    return { word, kind, prompt, options: allOptions, correctIndex, isBoss };
}

function generateRound(words: Vocabulary[], difficulty: Difficulty): Question[] {
    if (words.length < 4) return [];
    const count = Math.min(ROUND_SIZE, words.length);
    const picked = weightedPick(words, count);

    // Last question is boss if we have a boss-eligible word
    const bossCandidate = picked.find(w => BOSS_TYPES.includes(w.type));
    if (bossCandidate && picked.length > 1) {
        // Move boss to last position
        const idx = picked.indexOf(bossCandidate);
        picked.splice(idx, 1);
        picked.push(bossCandidate);
    }

    return picked.map((word, i) => {
        const isBoss = i === picked.length - 1 && BOSS_TYPES.includes(word.type);
        return generateQuestion(word, words, difficulty, isBoss);
    });
}

function calculateRank(results: RoundResult[]): BattleRank {
    const total = results.length;
    if (total === 0) return 'F';
    const correct = results.filter(r => r.correct).length;
    const accuracy = (correct / total) * 100;
    const maxCombo = Math.max(...results.map(r => r.combo), 0);
    for (const t of RANK_THRESHOLDS) {
        if (accuracy >= t.minAccuracy && maxCombo >= t.minCombo) return t.rank;
    }
    return 'F';
}

function getRankConfig(rank: BattleRank) {
    return RANK_THRESHOLDS.find(t => t.rank === rank) || RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
}

// ============================================================
// TTS
// ============================================================

function speakWord(text: string): Promise<void> {
    return new Promise(resolve => {
        if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.85;
        const voices = window.speechSynthesis.getVoices();
        const pref = voices.find(v => v.name.includes('Samantha')) || voices.find(v => v.lang === 'en-US' && v.localService);
        if (pref) u.voice = pref;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        window.speechSynthesis.speak(u);
    });
}

// ============================================================
// COMPONENT
// ============================================================

export default function ArenaPage() {
    // --- Core state ---
    const [phase, setPhase] = useState<GamePhase>('lobby');
    const [words, setWords] = useState<Vocabulary[]>([]);
    const [loading, setLoading] = useState(true);
    const [difficulty, setDifficulty] = useState<Difficulty>('normal');
    const [isMobile, setIsMobile] = useState(false);

    // --- Battle state ---
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [hp, setHp] = useState(MAX_HP);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [fever, setFever] = useState(false);
    const [feverKey, setFeverKey] = useState(0);
    const [results, setResults] = useState<RoundResult[]>([]);
    const [answerResult, setAnswerResult] = useState<AnswerResult>(null);
    const [chosenIndex, setChosenIndex] = useState<number | null>(null);
    const [timerLeft, setTimerLeft] = useState(1);
    const [totalScore, setTotalScore] = useState(0);
    const [totalXpEarned, setTotalXpEarned] = useState(0);
    const [shakeKey, setShakeKey] = useState(0);
    const [comboPopKey, setComboPopKey] = useState(0);
    const [xpFloats, setXpFloats] = useState<{ id: number; text: string; color: string }[]>([]);
    const [countdownNum, setCountdownNum] = useState(3);
    const [bossIntroKey, setBossIntroKey] = useState(0);
    const [feverExitKey, setFeverExitKey] = useState(0);

    // --- History (persisted in localStorage) ---
    const [battleHistory, setBattleHistory] = useState<{ rank: BattleRank; score: number; accuracy: number; date: string }[]>([]);
    const [bestScore, setBestScore] = useState(0);
    const [totalBattles, setTotalBattles] = useState(0);

    // --- Refs ---
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timerStartRef = useRef(0);
    const timerDurationRef = useRef(0);
    const answerLockedRef = useRef(false);
    const comboRef = useRef(0);
    const feverRef = useRef(false);
    const hpRef = useRef(MAX_HP);
    const xpFloatIdRef = useRef(0);

    // --- Load data ---
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/user-phrases');
                const data = await res.json();
                if (data.phrases) setWords(data.phrases);
            } catch (e) {
                console.error('Failed to load vocabulary:', e);
            }
            setLoading(false);
        })();
        // Load history
        try {
            const h = localStorage.getItem('arena-history');
            if (h) {
                const parsed = JSON.parse(h);
                setBattleHistory(parsed.history || []);
                setBestScore(parsed.bestScore || 0);
                setTotalBattles(parsed.totalBattles || 0);
            }
        } catch { /* ignore */ }
    }, []);

    // --- Timer management ---
    const clearTimer = useCallback(() => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }, []);

    const startTimer = useCallback((durationMs: number, onTimeout: () => void) => {
        clearTimer();
        timerStartRef.current = Date.now();
        timerDurationRef.current = durationMs;
        setTimerLeft(1);
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - timerStartRef.current;
            const remaining = Math.max(0, 1 - elapsed / durationMs);
            setTimerLeft(remaining);
            // Warning tick at 25%
            if (remaining < 0.25 && remaining > 0.2) playTimerWarning();
            if (remaining <= 0) {
                clearTimer();
                onTimeout();
            }
        }, 50);
    }, [clearTimer]);

    // --- XP float ---
    const addXpFloat = useCallback((text: string, color: string) => {
        const id = ++xpFloatIdRef.current;
        setXpFloats(prev => [...prev, { id, text, color }]);
        setTimeout(() => setXpFloats(prev => prev.filter(f => f.id !== id)), 1200);
    }, []);

    // --- Process answer ---
    const processAnswer = useCallback((chosenIdx: number | null) => {
        if (answerLockedRef.current) return;
        answerLockedRef.current = true;
        clearTimer();

        const q = questions[currentQ];
        if (!q) return;
        const timeMs = Date.now() - timerStartRef.current;
        const isCorrect = chosenIdx === q.correctIndex;

        setChosenIndex(chosenIdx);

        if (isCorrect) {
            const newCombo = comboRef.current + 1;
            comboRef.current = newCombo;
            setCombo(newCombo);
            if (newCombo > maxCombo) setMaxCombo(newCombo);
            setComboPopKey(Date.now());

            // Points
            const timeBonus = Math.max(0, Math.floor(timerLeft * SPEED_MULTIPLIER));
            let pts = BASE_POINTS + (newCombo - 1) * COMBO_BONUS + timeBonus;
            if (q.isBoss) pts *= BOSS_MULTIPLIER;
            if (feverRef.current) pts = Math.floor(pts * FEVER_MULTIPLIER);

            setTotalScore(prev => prev + pts);
            const xp = Math.max(1, Math.floor(pts / 50));
            setTotalXpEarned(prev => prev + xp);

            playCorrectSound(newCombo);
            addXpFloat(`+${pts}`, '#D4AF37');
            setAnswerResult('correct');

            // Fever check
            if (newCombo >= FEVER_THRESHOLD && !feverRef.current) {
                feverRef.current = true;
                setFever(true);
                setFeverKey(Date.now());
                playFeverEnter();
            }
            if (newCombo % 5 === 0 && newCombo > 0) {
                playComboMilestone(Math.floor(newCombo / 5));
            }

            setResults(prev => [...prev, { question: q, answered: chosenIdx, correct: true, timeMs, combo: newCombo, points: pts }]);
        } else {
            // Wrong or timeout
            comboRef.current = 0;
            setCombo(0);

            // Fever exit
            if (feverRef.current) {
                feverRef.current = false;
                setFever(false);
                setFeverExitKey(Date.now());
                playFeverExit();
            }

            const cfg = DIFFICULTY_CONFIG[difficulty];
            const damage = cfg.hpLoss;
            const newHp = Math.max(0, hpRef.current - damage);
            hpRef.current = newHp;
            setHp(newHp);

            playWrongSound();
            setShakeKey(Date.now());
            addXpFloat(`-${damage} HP`, '#EF4444');
            setAnswerResult(chosenIdx === null ? 'timeout' : 'wrong');

            setResults(prev => [...prev, { question: q, answered: chosenIdx, correct: false, timeMs, combo: 0, points: 0 }]);
        }

        // Next question or end
        setTimeout(() => {
            setAnswerResult(null);
            setChosenIndex(null);
            answerLockedRef.current = false;

            if (hpRef.current <= 0) {
                // Game over
                playGameOver();
                setPhase('result');
                return;
            }

            const nextQ = currentQ + 1;
            if (nextQ >= questions.length) {
                setPhase('result');
                return;
            }

            // Check if next is boss
            if (questions[nextQ].isBoss && !questions[currentQ].isBoss) {
                setCurrentQ(nextQ);
                setBossIntroKey(Date.now());
                setPhase('boss-intro');
                return;
            }

            setCurrentQ(nextQ);
        }, 800);
    }, [questions, currentQ, maxCombo, timerLeft, difficulty, clearTimer, addXpFloat]);

    // --- Start question timer ---
    const startQuestion = useCallback((qIndex: number) => {
        const q = questions[qIndex];
        if (!q) return;
        const cfg = DIFFICULTY_CONFIG[difficulty];
        const duration = q.isBoss ? cfg.bossTimeMs : cfg.timeMs;

        // TTS for listen questions
        if (q.kind === 'listen') {
            speakWord(q.word.phrase);
        }

        startTimer(duration, () => processAnswer(null));
    }, [questions, difficulty, startTimer, processAnswer]);

    // --- Start battle ---
    const startBattle = useCallback(() => {
        const round = generateRound(words, difficulty);
        if (round.length === 0) return;

        setQuestions(round);
        setCurrentQ(0);
        setHp(MAX_HP);
        hpRef.current = MAX_HP;
        setCombo(0);
        comboRef.current = 0;
        setMaxCombo(0);
        setFever(false);
        feverRef.current = false;
        setResults([]);
        setTotalScore(0);
        setTotalXpEarned(0);
        setAnswerResult(null);
        setChosenIndex(null);
        answerLockedRef.current = false;
        setTimerLeft(1);

        // Countdown
        setPhase('countdown');
        setCountdownNum(3);
    }, [words, difficulty]);

    // Countdown effect
    useEffect(() => {
        if (phase !== 'countdown') return;
        if (countdownNum <= 0) {
            playCountdownGo();
            setPhase('battle');
            return;
        }
        playCountdownTick();
        const t = setTimeout(() => setCountdownNum(prev => prev - 1), 700);
        return () => clearTimeout(t);
    }, [phase, countdownNum]);

    // Start timer when entering battle or advancing question
    useEffect(() => {
        if (phase === 'battle' && questions.length > 0) {
            startQuestion(currentQ);
        }
        return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, currentQ]);

    // Boss intro auto-advance
    useEffect(() => {
        if (phase !== 'boss-intro') return;
        playBossEntrance();
        const t = setTimeout(() => {
            setPhase('battle');
        }, 2000);
        return () => clearTimeout(t);
    }, [phase, bossIntroKey]);

    // Save results when reaching result phase
    useEffect(() => {
        if (phase !== 'result') return;
        const rank = calculateRank(results);
        const accuracy = results.length > 0 ? Math.round((results.filter(r => r.correct).length / results.length) * 100) : 0;
        playRankReveal(rank);

        // Post XP
        if (totalXpEarned > 0) {
            const today = new Date().toISOString().split('T')[0];
            fetch('/api/review-count', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: today, xp: totalXpEarned }),
            }).catch(() => {});
        }

        // Save to localStorage
        const entry = { rank, score: totalScore, accuracy, date: new Date().toISOString().split('T')[0] };
        const newHistory = [entry, ...battleHistory].slice(0, 10);
        const newBest = Math.max(bestScore, totalScore);
        const newTotal = totalBattles + 1;
        setBattleHistory(newHistory);
        setBestScore(newBest);
        setTotalBattles(newTotal);
        try {
            localStorage.setItem('arena-history', JSON.stringify({
                history: newHistory,
                bestScore: newBest,
                totalBattles: newTotal,
            }));
        } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    // Cleanup on unmount
    useEffect(() => () => clearTimer(), [clearTimer]);

    // --- Derived ---
    const currentQuestion = questions[currentQ] || null;
    const cfg = DIFFICULTY_CONFIG[difficulty];
    const hpPercent = (hp / MAX_HP) * 100;
    const hpColor = hpPercent > 60 ? '#10B981' : hpPercent > 30 ? '#F59E0B' : '#EF4444';
    const timerColor = timerLeft > 0.5 ? '#10B981' : timerLeft > 0.25 ? '#F59E0B' : '#EF4444';
    const resultRank = phase === 'result' ? calculateRank(results) : 'F';
    const resultRankCfg = getRankConfig(resultRank);
    const resultAccuracy = results.length > 0 ? Math.round((results.filter(r => r.correct).length / results.length) * 100) : 0;

    const masteryDistribution = useMemo(() => {
        const dist = [0, 0, 0, 0, 0];
        words.forEach(w => { if (w.mastery_level >= 0 && w.mastery_level <= 4) dist[w.mastery_level]++; });
        return dist;
    }, [words]);

    // ============================================================
    // RENDER
    // ============================================================

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0C0A09' }}>
                <span style={{ color: '#78716C', fontSize: '13px', letterSpacing: '1px' }}>LOADING ARENA...</span>
            </div>
        );
    }

    // --- LOBBY ---
    if (phase === 'lobby') {
        const canStart = words.length >= 4;
        return (
            <div style={{
                minHeight: '100vh', backgroundColor: '#0C0A09',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '24px', position: 'relative',
            }}>
                {/* Back link */}
                <Link href="/english/vocabulary" style={{
                    position: 'absolute', top: '20px', left: '20px',
                    color: '#57534E', fontSize: '12px', textDecoration: 'none',
                    letterSpacing: '0.5px',
                }}>
                    &larr; VOCABULARY
                </Link>

                {/* Title */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: isMobile ? '36px' : '52px', fontWeight: '900',
                        letterSpacing: '-2px', lineHeight: 1,
                        background: 'linear-gradient(180deg, #FFFDE0 0%, #D4AF37 60%, #8B6914 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        margin: 0,
                    }}>
                        WORD ARENA
                    </h1>
                    <p style={{
                        color: '#57534E', fontSize: '12px', letterSpacing: '2px',
                        marginTop: '8px', fontWeight: '600',
                    }}>
                        VOCABULARY BATTLE MODE
                    </p>
                </div>

                {/* Stats cards */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px', width: '100%', maxWidth: '400px', marginBottom: '32px',
                }}>
                    <div style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #292524' }}>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: '#D4AF37' }}>{words.length}</div>
                        <div style={{ fontSize: '9px', color: '#78716C', letterSpacing: '1px', marginTop: '2px' }}>WORDS</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #292524' }}>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: '#A855F7' }}>{totalBattles}</div>
                        <div style={{ fontSize: '9px', color: '#78716C', letterSpacing: '1px', marginTop: '2px' }}>BATTLES</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #292524' }}>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: '#F59E0B' }}>{bestScore.toLocaleString()}</div>
                        <div style={{ fontSize: '9px', color: '#78716C', letterSpacing: '1px', marginTop: '2px' }}>BEST</div>
                    </div>
                </div>

                {/* Mastery distribution */}
                <div style={{
                    width: '100%', maxWidth: '400px', marginBottom: '28px',
                    display: 'flex', gap: '2px', height: '6px', borderRadius: '3px', overflow: 'hidden',
                }}>
                    {['#EF4444', '#F59E0B', '#D4AF37', '#10B981', '#3B82F6'].map((color, i) => (
                        <div key={i} style={{
                            flex: masteryDistribution[i] || 0.1,
                            backgroundColor: color,
                            opacity: masteryDistribution[i] > 0 ? 1 : 0.15,
                            transition: 'flex 0.3s',
                        }} />
                    ))}
                </div>

                {/* Difficulty selector */}
                <div style={{
                    display: 'flex', gap: '8px', marginBottom: '32px',
                    width: '100%', maxWidth: '400px',
                }}>
                    {(['easy', 'normal', 'hard'] as Difficulty[]).map(d => {
                        const dc = DIFFICULTY_CONFIG[d];
                        const active = difficulty === d;
                        return (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                style={{
                                    flex: 1, padding: '12px 8px', borderRadius: '8px',
                                    border: active ? `2px solid ${dc.color}` : '2px solid #292524',
                                    backgroundColor: active ? dc.color + '15' : '#1C1917',
                                    color: active ? dc.color : '#57534E',
                                    fontSize: '12px', fontWeight: '800', letterSpacing: '1px',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                }}
                            >
                                <div>{dc.label}</div>
                                <div style={{ fontSize: '9px', fontWeight: '600', marginTop: '4px', opacity: 0.7 }}>
                                    {dc.labelJa} / {(dc.timeMs / 1000).toFixed(1)}s
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Start button */}
                <button
                    onClick={canStart ? startBattle : undefined}
                    disabled={!canStart}
                    style={{
                        width: '100%', maxWidth: '400px', height: '56px',
                        borderRadius: '12px', border: 'none',
                        background: canStart
                            ? 'linear-gradient(135deg, #D4AF37 0%, #F6C85F 50%, #D4AF37 100%)'
                            : '#292524',
                        color: canStart ? '#1C1917' : '#57534E',
                        fontSize: '18px', fontWeight: '900', letterSpacing: '2px',
                        cursor: canStart ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        boxShadow: canStart ? '0 4px 20px rgba(212,175,55,0.3)' : 'none',
                    }}
                >
                    {canStart ? 'START BATTLE' : `${words.length}/4 WORDS NEEDED`}
                </button>

                {/* Recent battles */}
                {battleHistory.length > 0 && (
                    <div style={{ marginTop: '28px', width: '100%', maxWidth: '400px' }}>
                        <div style={{ fontSize: '10px', color: '#57534E', letterSpacing: '1px', marginBottom: '8px' }}>
                            RECENT BATTLES
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {battleHistory.slice(0, 5).map((b, i) => {
                                const rc = getRankConfig(b.rank);
                                return (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '8px 12px', borderRadius: '6px',
                                        backgroundColor: '#1C1917', border: '1px solid #292524',
                                    }}>
                                        <span style={{ fontSize: '16px', fontWeight: '900', color: rc.color, minWidth: '24px' }}>{b.rank}</span>
                                        <span style={{ fontSize: '12px', color: '#A8A29E', flex: 1 }}>{b.score.toLocaleString()} pts</span>
                                        <span style={{ fontSize: '11px', color: '#57534E' }}>{b.accuracy}%</span>
                                        <span style={{ fontSize: '10px', color: '#44403C' }}>{b.date}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <style>{ANIMATIONS_CSS}</style>
            </div>
        );
    }

    // --- COUNTDOWN ---
    if (phase === 'countdown') {
        return (
            <div style={{
                minHeight: '100vh', backgroundColor: '#0C0A09',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
            }}>
                <div key={countdownNum} style={{
                    fontSize: countdownNum > 0 ? (isMobile ? '120px' : '180px') : (isMobile ? '48px' : '72px'),
                    fontWeight: '900',
                    color: countdownNum > 0 ? '#D4AF37' : '#10B981',
                    animation: 'countdown-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                    textShadow: countdownNum > 0
                        ? '0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.3)'
                        : '0 0 40px rgba(16,185,129,0.5)',
                    letterSpacing: countdownNum > 0 ? '-4px' : '8px',
                }}>
                    {countdownNum > 0 ? countdownNum : 'GO'}
                </div>
                <style>{ANIMATIONS_CSS}</style>
            </div>
        );
    }

    // --- BOSS INTRO ---
    if (phase === 'boss-intro' && currentQuestion) {
        const tc = TYPE_COLORS[currentQuestion.word.type] || { bg: '#F5F5F4', text: '#78716C', border: '#E7E5E4' };
        return (
            <div style={{
                minHeight: '100vh', backgroundColor: '#0C0A09',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
            }}>
                {/* Shockwave */}
                <div key={bossIntroKey} style={{
                    position: 'absolute', width: '200px', height: '200px',
                    borderRadius: '50%', border: `4px solid ${tc.text}`,
                    animation: 'boss-shockwave 1.5s ease-out forwards',
                    opacity: 0.6,
                }} />

                {/* BOSS text */}
                <div key={`boss-${bossIntroKey}`} style={{
                    fontSize: isMobile ? '64px' : '96px', fontWeight: '900',
                    color: '#EF4444', letterSpacing: '8px',
                    animation: 'boss-slam 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                    textShadow: '0 0 40px rgba(239,68,68,0.6), 0 0 80px rgba(239,68,68,0.3)',
                    marginBottom: '16px',
                }}>
                    BOSS
                </div>

                {/* Type badge */}
                <div style={{
                    padding: '6px 20px', borderRadius: '20px',
                    backgroundColor: tc.bg, color: tc.text, border: `2px solid ${tc.border}`,
                    fontSize: '14px', fontWeight: '800', letterSpacing: '1px',
                    animation: 'boss-type-enter 0.5s ease-out 0.5s both',
                }}>
                    {currentQuestion.word.type.toUpperCase()}
                </div>

                {/* Screen shake overlay */}
                <div key={`shake-${bossIntroKey}`} style={{
                    position: 'fixed', inset: 0, pointerEvents: 'none',
                    animation: 'arena-shake 0.5s ease-out',
                }} />

                <style>{ANIMATIONS_CSS}</style>
            </div>
        );
    }

    // --- BATTLE ---
    if (phase === 'battle' && currentQuestion) {
        const q = currentQuestion;
        const tc = TYPE_COLORS[q.word.type] || { bg: '#F5F5F4', text: '#78716C', border: '#E7E5E4' };
        const kindLabel = q.kind === 'meaning' ? 'MEANING' : q.kind === 'reverse' ? 'REVERSE' : q.kind === 'fill' ? 'FILL IN' : 'LISTEN';
        const optCols = q.options.length <= 4 ? 2 : 3;

        return (
            <div
                key={shakeKey}
                style={{
                    minHeight: '100vh', backgroundColor: '#0C0A09',
                    display: 'flex', flexDirection: 'column',
                    padding: isMobile ? '12px' : '20px',
                    position: 'relative', overflow: 'hidden',
                    animation: answerResult === 'wrong' || answerResult === 'timeout' ? 'arena-shake 0.4s ease-out' : undefined,
                }}
            >
                {/* FEVER overlay */}
                {fever && (
                    <>
                        <div style={{
                            position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
                            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(220,38,38,0.15) 100%)',
                            animation: 'fever-pulse 1.5s ease-in-out infinite',
                        }} />
                        <div style={{
                            position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
                            boxShadow: 'inset 0 0 60px rgba(220,38,38,0.2), inset 0 0 120px rgba(249,115,22,0.1)',
                            animation: 'fever-border-glow 1.5s ease-in-out infinite',
                        }} />
                    </>
                )}

                {/* FEVER badge */}
                {fever && (
                    <div style={{
                        position: 'fixed', top: isMobile ? '8px' : '16px', left: '50%', transform: 'translateX(-50%)',
                        zIndex: 100, display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '6px 16px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, #DC2626, #F97316)',
                        boxShadow: '0 0 20px rgba(220,38,38,0.4)',
                        animation: 'fever-badge-pulse 1.5s ease-in-out infinite',
                    }}>
                        <span style={{ color: '#fff', fontSize: '14px', fontWeight: '900', letterSpacing: '2px' }}>FEVER</span>
                        <span style={{
                            color: combo >= 8 ? '#FCD34D' : '#fff',
                            fontSize: '16px', fontWeight: '900',
                            animation: combo >= 8 ? 'combo-shake 0.3s ease-in-out infinite' : undefined,
                        }}>
                            x{combo}
                        </span>
                    </div>
                )}

                {/* FEVER enter flash */}
                {feverKey > 0 && (
                    <div key={feverKey} style={{
                        position: 'fixed', inset: 0, zIndex: 200, pointerEvents: 'none',
                        backgroundColor: 'rgba(239,68,68,0.4)',
                        animation: 'fever-flash 0.6s ease-out forwards',
                    }} />
                )}

                {/* FEVER exit flash */}
                {feverExitKey > 0 && (
                    <div key={feverExitKey} style={{
                        position: 'fixed', inset: 0, zIndex: 200, pointerEvents: 'none',
                        backgroundColor: 'rgba(59,130,246,0.3)',
                        animation: 'fever-flash 0.4s ease-out forwards',
                    }} />
                )}

                {/* HUD: HP + Round + Combo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', zIndex: 10 }}>
                    {/* HP bar */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '10px', color: '#78716C', fontWeight: '700', letterSpacing: '1px' }}>HP</span>
                            <span style={{ fontSize: '10px', color: hpColor, fontWeight: '800' }}>{hp}/{MAX_HP}</span>
                        </div>
                        <div style={{
                            height: '8px', backgroundColor: '#292524', borderRadius: '4px', overflow: 'hidden',
                            position: 'relative',
                        }}>
                            <div style={{
                                width: `${hpPercent}%`, height: '100%',
                                backgroundColor: hpColor, borderRadius: '4px',
                                transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s',
                                boxShadow: hpPercent < 30 ? `0 0 8px ${hpColor}60` : 'none',
                            }} />
                            {answerResult === 'wrong' && (
                                <div style={{
                                    position: 'absolute', inset: 0, backgroundColor: '#EF4444',
                                    animation: 'hp-damage-flash 0.3s ease-out forwards',
                                    borderRadius: '4px',
                                }} />
                            )}
                        </div>
                    </div>

                    {/* Round counter */}
                    <div style={{ textAlign: 'center', minWidth: '48px' }}>
                        <div style={{ fontSize: '9px', color: '#57534E', letterSpacing: '0.5px' }}>ROUND</div>
                        <div style={{ fontSize: '14px', fontWeight: '900', color: '#D4AF37' }}>
                            {currentQ + 1}<span style={{ color: '#57534E', fontWeight: '600' }}>/{questions.length}</span>
                        </div>
                    </div>

                    {/* Combo counter */}
                    <div style={{ textAlign: 'center', minWidth: '48px' }}>
                        <div style={{ fontSize: '9px', color: '#57534E', letterSpacing: '0.5px' }}>COMBO</div>
                        <div
                            key={comboPopKey}
                            style={{
                                fontSize: '14px', fontWeight: '900',
                                color: combo >= FEVER_THRESHOLD ? '#EF4444' : combo >= 3 ? '#F59E0B' : '#A8A29E',
                                animation: combo > 0 ? 'combo-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : undefined,
                            }}
                        >
                            {combo > 0 ? `x${combo}` : '--'}
                        </div>
                    </div>
                </div>

                {/* Question card */}
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', zIndex: 10,
                }}>
                    {/* Kind + type badge */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                        <span style={{
                            fontSize: '11px', fontWeight: '800', color: '#57534E',
                            letterSpacing: '2px',
                        }}>
                            {kindLabel}
                        </span>
                        <span style={{
                            fontSize: '9px', fontWeight: '700', padding: '2px 10px',
                            borderRadius: '10px', backgroundColor: tc.bg, color: tc.text,
                            border: `1px solid ${tc.border}`,
                        }}>
                            {q.word.type}
                        </span>
                        {q.isBoss && (
                            <span style={{
                                fontSize: '9px', fontWeight: '900', padding: '2px 10px',
                                borderRadius: '10px', backgroundColor: '#EF444420',
                                color: '#EF4444', border: '1px solid #EF444440',
                                letterSpacing: '1px',
                            }}>
                                BOSS
                            </span>
                        )}
                    </div>

                    {/* Prompt */}
                    <div style={{
                        padding: isMobile ? '24px 20px' : '32px 40px',
                        borderRadius: '16px',
                        backgroundColor: '#1C1917',
                        border: q.isBoss ? '2px solid #EF444440' : '1px solid #292524',
                        boxShadow: q.isBoss
                            ? '0 0 30px rgba(239,68,68,0.15), 0 4px 20px rgba(0,0,0,0.3)'
                            : '0 4px 20px rgba(0,0,0,0.3)',
                        textAlign: 'center', maxWidth: '500px', width: '100%',
                        marginBottom: '16px',
                        animation: 'question-enter 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}>
                        {q.kind === 'listen' ? (
                            <div>
                                <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}>?</div>
                                <button
                                    onClick={() => speakWord(q.word.phrase)}
                                    style={{
                                        border: '2px solid #D4AF37', backgroundColor: '#D4AF3715',
                                        color: '#D4AF37', padding: '8px 24px', borderRadius: '8px',
                                        fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    PLAY AGAIN
                                </button>
                            </div>
                        ) : (
                            <div style={{
                                fontSize: q.kind === 'fill' ? (isMobile ? '16px' : '18px') : (isMobile ? '24px' : '32px'),
                                fontWeight: q.kind === 'fill' ? '500' : '800',
                                color: '#FAFAF9',
                                lineHeight: 1.4,
                                letterSpacing: q.kind === 'fill' ? '0px' : '-0.5px',
                            }}>
                                {q.prompt}
                            </div>
                        )}
                    </div>

                    {/* Timer bar */}
                    <div style={{
                        width: '100%', maxWidth: '500px', height: '4px',
                        backgroundColor: '#292524', borderRadius: '2px',
                        overflow: 'hidden', marginBottom: '20px',
                    }}>
                        <div style={{
                            width: `${timerLeft * 100}%`, height: '100%',
                            backgroundColor: timerColor, borderRadius: '2px',
                            transition: 'background-color 0.3s',
                            boxShadow: timerLeft < 0.25 ? `0 0 8px ${timerColor}` : 'none',
                        }} />
                    </div>

                    {/* Answer options */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${optCols}, 1fr)`,
                        gap: '8px', width: '100%', maxWidth: '500px',
                    }}>
                        {q.options.map((opt, i) => {
                            const isChosen = chosenIndex === i;
                            const isCorrectOpt = i === q.correctIndex;
                            const showResult = answerResult !== null;
                            let optBg = '#1C1917';
                            let optBorder = '#292524';
                            let optColor = '#FAFAF9';
                            if (showResult) {
                                if (isCorrectOpt) {
                                    optBg = '#10B98120';
                                    optBorder = '#10B981';
                                    optColor = '#10B981';
                                } else if (isChosen && !isCorrectOpt) {
                                    optBg = '#EF444420';
                                    optBorder = '#EF4444';
                                    optColor = '#EF4444';
                                } else {
                                    optColor = '#57534E';
                                }
                            }
                            return (
                                <button
                                    key={i}
                                    onClick={() => processAnswer(i)}
                                    disabled={answerResult !== null}
                                    style={{
                                        padding: isMobile ? '12px 10px' : '14px 16px',
                                        borderRadius: '10px',
                                        border: `2px solid ${optBorder}`,
                                        backgroundColor: optBg,
                                        color: optColor,
                                        fontSize: isMobile ? '13px' : '14px',
                                        fontWeight: '600',
                                        cursor: answerResult !== null ? 'default' : 'pointer',
                                        transition: 'all 0.15s',
                                        textAlign: 'center',
                                        lineHeight: 1.3,
                                        minHeight: '48px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Correct/Wrong overlay flash */}
                {answerResult === 'correct' && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none',
                        backgroundColor: 'rgba(16,185,129,0.12)',
                        animation: 'answer-flash 0.4s ease-out forwards',
                    }} />
                )}

                {/* XP floats */}
                {xpFloats.map(f => (
                    <div key={f.id} style={{
                        position: 'fixed', top: '45%', left: '50%',
                        zIndex: 100, pointerEvents: 'none',
                        fontSize: '18px', fontWeight: '900', color: f.color,
                        textShadow: `0 0 10px ${f.color}60`,
                        animation: 'xp-float 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                    }}>
                        {f.text}
                    </div>
                ))}

                <style>{ANIMATIONS_CSS}</style>
            </div>
        );
    }

    // --- RESULT ---
    if (phase === 'result') {
        const isGameOver = hp <= 0;
        const correct = results.filter(r => r.correct).length;
        const total = results.length;

        return (
            <div style={{
                minHeight: '100vh', backgroundColor: '#0C0A09',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '40px 24px', position: 'relative', overflow: 'hidden',
            }}>
                {/* Rank display */}
                <div style={{
                    marginBottom: '32px', textAlign: 'center',
                    animation: 'rank-reveal 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                }}>
                    {isGameOver && (
                        <div style={{
                            fontSize: '14px', color: '#EF4444', fontWeight: '700',
                            letterSpacing: '2px', marginBottom: '8px',
                        }}>
                            GAME OVER
                        </div>
                    )}
                    <div style={{
                        fontSize: isMobile ? '80px' : '120px',
                        fontWeight: '900', lineHeight: 1,
                        color: resultRankCfg.color,
                        textShadow: resultRankCfg.glow !== 'none'
                            ? `0 0 40px ${resultRankCfg.color}80, 0 0 80px ${resultRankCfg.color}40`
                            : 'none',
                        letterSpacing: '-4px',
                    }}>
                        {resultRank}
                    </div>
                    <div style={{
                        fontSize: '12px', color: '#57534E', letterSpacing: '2px',
                        marginTop: '4px', fontWeight: '600',
                    }}>
                        RANK
                    </div>
                </div>

                {/* Score + Stats */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px', width: '100%', maxWidth: '380px', marginBottom: '24px',
                }}>
                    <div style={{
                        textAlign: 'center', padding: '16px', borderRadius: '10px',
                        backgroundColor: '#1C1917', border: '1px solid #292524',
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: '#D4AF37' }}>
                            {totalScore.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '9px', color: '#78716C', letterSpacing: '1px', marginTop: '2px' }}>SCORE</div>
                    </div>
                    <div style={{
                        textAlign: 'center', padding: '16px', borderRadius: '10px',
                        backgroundColor: '#1C1917', border: '1px solid #292524',
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: resultAccuracy >= 80 ? '#10B981' : resultAccuracy >= 50 ? '#F59E0B' : '#EF4444' }}>
                            {resultAccuracy}%
                        </div>
                        <div style={{ fontSize: '9px', color: '#78716C', letterSpacing: '1px', marginTop: '2px' }}>ACCURACY</div>
                    </div>
                    <div style={{
                        textAlign: 'center', padding: '16px', borderRadius: '10px',
                        backgroundColor: '#1C1917', border: '1px solid #292524',
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: '#F59E0B' }}>
                            x{maxCombo}
                        </div>
                        <div style={{ fontSize: '9px', color: '#78716C', letterSpacing: '1px', marginTop: '2px' }}>MAX COMBO</div>
                    </div>
                    <div style={{
                        textAlign: 'center', padding: '16px', borderRadius: '10px',
                        backgroundColor: '#1C1917', border: '1px solid #292524',
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: '#A855F7' }}>
                            +{totalXpEarned}
                        </div>
                        <div style={{ fontSize: '9px', color: '#78716C', letterSpacing: '1px', marginTop: '2px' }}>XP EARNED</div>
                    </div>
                </div>

                {/* Word breakdown */}
                <div style={{
                    width: '100%', maxWidth: '380px', marginBottom: '24px',
                }}>
                    <div style={{ fontSize: '10px', color: '#57534E', letterSpacing: '1px', marginBottom: '8px' }}>
                        BREAKDOWN ({correct}/{total})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {results.map((r, i) => {
                            const tc2 = TYPE_COLORS[r.question.word.type] || { text: '#78716C' };
                            return (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '6px 10px', borderRadius: '6px',
                                    backgroundColor: '#1C1917', border: '1px solid #292524',
                                    animation: `result-item-enter 0.3s ease-out ${i * 0.05}s both`,
                                }}>
                                    <span style={{
                                        fontSize: '12px', fontWeight: '900',
                                        color: r.correct ? '#10B981' : '#EF4444',
                                        minWidth: '16px',
                                    }}>
                                        {r.correct ? '+' : 'x'}
                                    </span>
                                    <span style={{
                                        fontSize: '12px', fontWeight: '600', color: '#FAFAF9',
                                        flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>
                                        {r.question.word.phrase}
                                    </span>
                                    <span style={{
                                        fontSize: '9px', fontWeight: '700', color: tc2.text,
                                        opacity: 0.6,
                                    }}>
                                        {r.question.word.type}
                                    </span>
                                    {r.combo > 0 && (
                                        <span style={{ fontSize: '10px', color: '#F59E0B', fontWeight: '700' }}>
                                            x{r.combo}
                                        </span>
                                    )}
                                    {r.points > 0 && (
                                        <span style={{ fontSize: '10px', color: '#D4AF37', fontWeight: '700' }}>
                                            +{r.points}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Buttons */}
                <div style={{
                    display: 'flex', gap: '12px', width: '100%', maxWidth: '380px',
                }}>
                    <button
                        onClick={startBattle}
                        style={{
                            flex: 1, height: '48px', borderRadius: '10px', border: 'none',
                            background: 'linear-gradient(135deg, #D4AF37, #F6C85F)',
                            color: '#1C1917', fontSize: '14px', fontWeight: '900',
                            letterSpacing: '1px', cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
                        }}
                    >
                        PLAY AGAIN
                    </button>
                    <Link
                        href="/english/vocabulary"
                        style={{
                            flex: 1, height: '48px', borderRadius: '10px',
                            border: '2px solid #292524', backgroundColor: '#1C1917',
                            color: '#A8A29E', fontSize: '14px', fontWeight: '700',
                            letterSpacing: '1px', textDecoration: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        BACK
                    </Link>
                </div>

                <style>{ANIMATIONS_CSS}</style>
            </div>
        );
    }

    return null;
}

// ============================================================
// CSS ANIMATIONS
// ============================================================

const ANIMATIONS_CSS = `
@keyframes countdown-pop {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes question-enter {
    0% { transform: translateY(20px) scale(0.95); opacity: 0; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes arena-shake {
    0%, 100% { transform: translateX(0); }
    8% { transform: translateX(-6px) rotate(-0.3deg); }
    16% { transform: translateX(6px) rotate(0.25deg); }
    24% { transform: translateX(-5px) rotate(-0.2deg); }
    32% { transform: translateX(4px) rotate(0.15deg); }
    40% { transform: translateX(-3px); }
    50% { transform: translateX(2px); }
    60% { transform: translateX(-1px); }
    70% { transform: translateX(0); }
}

@keyframes combo-pop {
    0% { transform: scale(0.5); }
    50% { transform: scale(1.4); }
    100% { transform: scale(1); }
}

@keyframes combo-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    50% { transform: translateX(2px); }
    75% { transform: translateX(-1px); }
}

@keyframes xp-float {
    0% { opacity: 0; transform: translateX(-50%) translateY(0) scale(0.7); }
    15% { opacity: 1; transform: translateX(-50%) translateY(-18px) scale(1.15); }
    35% { opacity: 1; transform: translateX(-50%) translateY(-30px) scale(1); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-54px) scale(0.85); }
}

@keyframes answer-flash {
    0% { opacity: 1; }
    100% { opacity: 0; }
}

@keyframes hp-damage-flash {
    0% { opacity: 0.6; }
    100% { opacity: 0; }
}

@keyframes fever-pulse {
    0%, 100% { opacity: 0.08; }
    50% { opacity: 0.18; }
}

@keyframes fever-border-glow {
    0%, 100% { box-shadow: inset 0 0 60px rgba(220,38,38,0.2), inset 0 0 120px rgba(249,115,22,0.1); }
    50% { box-shadow: inset 0 0 80px rgba(220,38,38,0.3), inset 0 0 150px rgba(249,115,22,0.18); }
}

@keyframes fever-badge-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.12); }
}

@keyframes fever-flash {
    0% { opacity: 1; }
    100% { opacity: 0; }
}

@keyframes boss-slam {
    0% { transform: scale(3); opacity: 0; }
    30% { transform: scale(0.9); opacity: 1; }
    50% { transform: scale(1.1); opacity: 1; }
    70% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes boss-shockwave {
    0% { transform: scale(0); opacity: 0.8; }
    100% { transform: scale(6); opacity: 0; }
}

@keyframes boss-type-enter {
    0% { transform: translateY(10px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}

@keyframes rank-reveal {
    0% { transform: scale(0.3); opacity: 0; }
    30% { transform: scale(1.15); opacity: 1; }
    50% { transform: scale(0.95); }
    70% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes result-item-enter {
    0% { transform: translateX(-10px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
}
`;
