'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  type Phrase,
  type ReviewCard,
  type ReviewSession,
  type ReviewDifficulty,
  type LeitnerBox,
  LEITNER_INTERVALS,
  DEFAULT_SETTINGS,
} from '@/types/review';
import {
  getToday,
  getPhraseKey,
  createNewCard,
  processReview,
  getDueCards,
  getNewCards,
  calculateProgress,
  addSession,
  shuffleArray,
  formatInterval,
  getBoxLabel,
  getBoxColor,
} from '@/lib/srs-engine';

// Separate localStorage keys to avoid conflicts with existing review page
const ANKI_KEYS = {
  CARDS: 'anki_cards',
  SESSIONS: 'anki_sessions',
  SETTINGS: 'anki_settings',
} as const;

// Local storage helpers with anki-specific keys
function ankiLoadCards(): Map<string, ReviewCard> {
  if (typeof window === 'undefined') return new Map();
  try {
    const stored = localStorage.getItem(ANKI_KEYS.CARDS);
    if (!stored) return new Map();
    return new Map(Object.entries(JSON.parse(stored)));
  } catch {
    return new Map();
  }
}

function ankiSaveCards(cards: Map<string, ReviewCard>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ANKI_KEYS.CARDS, JSON.stringify(Object.fromEntries(cards)));
}

function ankiLoadSessions(): ReviewSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ANKI_KEYS.SESSIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function ankiSaveSessions(sessions: ReviewSession[]): void {
  if (typeof window === 'undefined') return;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const filtered = sessions.filter(s => new Date(s.date + 'T00:00:00') >= cutoff);
  localStorage.setItem(ANKI_KEYS.SESSIONS, JSON.stringify(filtered));
}

type ViewState = 'dashboard' | 'review' | 'summary';

interface SessionResult {
  total: number;
  correct: number;
  newLearned: number;
  graduated: number;
}

// Type colors matching the phrases page
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  word: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  'phrasal verb': { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  idiom: { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' },
  slang: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  collocation: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  expression: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
};

function getTypeStyle(type: string) {
  return TYPE_COLORS[type] || { bg: '#F5F5F4', text: '#57534E', border: '#D6D3D1' };
}

export default function AnkiPage() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [allPhrases, setAllPhrases] = useState<Phrase[]>([]);
  const [phraseMap, setPhraseMap] = useState<Map<string, Phrase>>(new Map());
  const [cards, setCards] = useState<Map<string, ReviewCard>>(new Map());
  const [sessions, setSessions] = useState<ReviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Review state
  const [reviewQueue, setReviewQueue] = useState<ReviewCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult>({ total: 0, correct: 0, newLearned: 0, graduated: 0 });
  const [sessionAnswers, setSessionAnswers] = useState<Array<{ key: string; difficulty: ReviewDifficulty }>>([]);

  // Fetch phrases from API
  useEffect(() => {
    async function fetchPhrases() {
      try {
        const res = await fetch('/api/user-phrases');
        const data = await res.json();
        if (data.success && data.phrases) {
          const mapped: Phrase[] = data.phrases.map((p: { phrase: string; meaning: string; type: string; created_at: string }) => ({
            natural: p.phrase,
            original: p.meaning,
            category: p.type,
            date: p.created_at?.split('T')[0] || getToday(),
          }));
          setAllPhrases(mapped);
          const map = new Map<string, Phrase>();
          mapped.forEach(p => map.set(getPhraseKey(p), p));
          setPhraseMap(map);
        }
      } catch (e) {
        console.error('Failed to fetch phrases:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchPhrases();
  }, []);

  // Load SRS state from localStorage
  useEffect(() => {
    setCards(ankiLoadCards());
    setSessions(ankiLoadSessions());
  }, []);

  const settings = DEFAULT_SETTINGS;
  const progress = calculateProgress(allPhrases, cards, sessions);
  const dueCards = getDueCards(cards, settings);
  const newPhrases = getNewCards(allPhrases, cards, settings);

  // Start review session
  const startReview = useCallback(() => {
    const queue: ReviewCard[] = [...dueCards];

    // Add new cards
    newPhrases.forEach(phrase => {
      const card = createNewCard(phrase);
      queue.push(card);
    });

    if (queue.length === 0) return;

    setReviewQueue(shuffleArray(queue));
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionResult({ total: 0, correct: 0, newLearned: 0, graduated: 0 });
    setSessionAnswers([]);
    setView('review');
  }, [dueCards, newPhrases]);

  // Handle card rating
  const rateCard = useCallback((difficulty: ReviewDifficulty) => {
    const currentCard = reviewQueue[currentIndex];
    if (!currentCard) return;

    const updatedCard = processReview(currentCard, difficulty);
    const newCards = new Map(cards);
    newCards.set(currentCard.phraseKey, updatedCard);
    setCards(newCards);
    ankiSaveCards(newCards);

    const isCorrect = difficulty === 'good' || difficulty === 'easy';
    const isNew = currentCard.reviewCount === 0;
    const graduated = updatedCard.box === 5 && currentCard.box !== 5;

    setSessionAnswers(prev => [...prev, { key: currentCard.phraseKey, difficulty }]);
    setSessionResult(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      newLearned: prev.newLearned + (isNew ? 1 : 0),
      graduated: prev.graduated + (graduated ? 1 : 0),
    }));

    // Next card or finish
    if (currentIndex + 1 < reviewQueue.length) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Session complete
      const finalResult = {
        total: sessionResult.total + 1,
        correct: sessionResult.correct + (isCorrect ? 1 : 0),
        newLearned: sessionResult.newLearned + (isNew ? 1 : 0),
        graduated: sessionResult.graduated + (graduated ? 1 : 0),
      };
      setSessionResult(finalResult);

      const updatedSessions = addSession(
        [...sessions],
        finalResult.total,
        finalResult.correct,
        finalResult.total - finalResult.correct,
        0,
        finalResult.newLearned,
        finalResult.graduated,
      );
      setSessions(updatedSessions);
      ankiSaveSessions(updatedSessions);
      setView('summary');
    }
  }, [reviewQueue, currentIndex, cards, sessions, sessionResult]);

  // Keyboard shortcuts
  useEffect(() => {
    if (view !== 'review') return;
    const handler = (e: KeyboardEvent) => {
      if (!isFlipped) {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          setIsFlipped(true);
        }
      } else {
        if (e.key === '1') rateCard('again');
        if (e.key === '2') rateCard('hard');
        if (e.key === '3') rateCard('good');
        if (e.key === '4') rateCard('easy');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [view, isFlipped, rateCard]);

  const currentCard = reviewQueue[currentIndex];
  const currentPhrase = currentCard ? phraseMap.get(currentCard.phraseKey) : null;

  // Interval hints for buttons
  const getIntervalHint = (difficulty: ReviewDifficulty): string => {
    if (!currentCard) return '';
    const simulated = processReview(currentCard, difficulty);
    return formatInterval(LEITNER_INTERVALS[simulated.box]);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: '#78716C', fontSize: '16px' }}>Loading phrases...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '900px' }}>

        {/* === DASHBOARD === */}
        {view === 'dashboard' && (
          <>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1C1917', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Anki
            </h1>
            <p style={{ fontSize: '14px', color: '#78716C', marginBottom: '32px' }}>
              Spaced repetition for {allPhrases.length.toLocaleString()} phrases
            </p>

            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{
                backgroundColor: '#FEF3C7', borderRadius: '16px', padding: '24px',
                border: '1px solid #FDE68A',
              }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#92400E' }}>
                  {dueCards.length + newPhrases.length}
                </div>
                <div style={{ fontSize: '13px', color: '#A16207', marginTop: '4px' }}>Due today</div>
              </div>
              <div style={{
                backgroundColor: '#ECFDF5', borderRadius: '16px', padding: '24px',
                border: '1px solid #A7F3D0',
              }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#065F46' }}>
                  {newPhrases.length}
                </div>
                <div style={{ fontSize: '13px', color: '#047857', marginTop: '4px' }}>New cards</div>
              </div>
              <div style={{
                backgroundColor: '#F5F3FF', borderRadius: '16px', padding: '24px',
                border: '1px solid #DDD6FE',
              }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#5B21B6' }}>
                  {progress.masteredCount}
                </div>
                <div style={{ fontSize: '13px', color: '#6D28D9', marginTop: '4px' }}>Mastered</div>
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={startReview}
              disabled={dueCards.length + newPhrases.length === 0}
              style={{
                width: '100%',
                padding: '18px',
                backgroundColor: dueCards.length + newPhrases.length > 0 ? '#D4AF37' : '#D6D3D1',
                color: dueCards.length + newPhrases.length > 0 ? '#fff' : '#A8A29E',
                border: 'none',
                borderRadius: '14px',
                fontSize: '17px',
                fontWeight: '700',
                cursor: dueCards.length + newPhrases.length > 0 ? 'pointer' : 'default',
                marginBottom: '32px',
                letterSpacing: '0.5px',
                transition: 'opacity 0.15s ease',
              }}
            >
              {dueCards.length + newPhrases.length > 0
                ? `Start Review (${dueCards.length + newPhrases.length} cards)`
                : 'All caught up!'}
            </button>

            {/* Box distribution */}
            {cards.size > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '12px' }}>
                  Box Distribution
                </div>
                <div style={{ display: 'flex', gap: '3px', height: '28px', borderRadius: '8px', overflow: 'hidden' }}>
                  {([1, 2, 3, 4, 5] as LeitnerBox[]).map(box => {
                    const count = progress.cardsByBox[box];
                    const pct = cards.size > 0 ? (count / cards.size) * 100 : 0;
                    if (pct === 0) return null;
                    return (
                      <div
                        key={box}
                        title={`${getBoxLabel(box)}: ${count}`}
                        style={{
                          width: `${pct}%`,
                          backgroundColor: getBoxColor(box),
                          minWidth: count > 0 ? '20px' : '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#fff',
                        }}
                      >
                        {count > 0 ? count : ''}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {([1, 2, 3, 4, 5] as LeitnerBox[]).map(box => (
                    <div key={box} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#78716C' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: getBoxColor(box) }} />
                      {getBoxLabel(box)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px',
            }}>
              <div style={{
                backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px',
                border: '1px solid #E7E5E4',
              }}>
                <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  STREAK
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1C1917' }}>
                  {progress.streakDays} <span style={{ fontSize: '14px', color: '#78716C', fontWeight: '400' }}>days</span>
                </div>
              </div>
              <div style={{
                backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px',
                border: '1px solid #E7E5E4',
              }}>
                <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  ACCURACY
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1C1917' }}>
                  {progress.accuracy}<span style={{ fontSize: '14px', color: '#78716C', fontWeight: '400' }}>%</span>
                </div>
              </div>
              <div style={{
                backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px',
                border: '1px solid #E7E5E4',
              }}>
                <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  TOTAL REVIEWS
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1C1917' }}>
                  {progress.totalReviews.toLocaleString()}
                </div>
              </div>
              <div style={{
                backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px',
                border: '1px solid #E7E5E4',
              }}>
                <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  IN SRS
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1C1917' }}>
                  {cards.size} <span style={{ fontSize: '14px', color: '#78716C', fontWeight: '400' }}>/ {allPhrases.length}</span>
                </div>
              </div>
            </div>

            {/* === 設計ノート === */}
            <div style={{
              marginTop: '48px', padding: '28px', backgroundColor: '#fff', borderRadius: '16px',
              border: '1px solid #E7E5E4', fontSize: '13px', lineHeight: '1.8',
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1C1917', marginBottom: '4px' }}>
                設計・イテレーションログ
              </h2>
              <div style={{ fontSize: '11px', color: '#A8A29E', marginBottom: '24px' }}>
                docs/anki-page.md | 2026-02-24
              </div>

              {/* 根本問題 */}
              <div style={{
                padding: '16px 20px', backgroundColor: '#FEF2F2', borderRadius: '10px',
                border: '1px solid #FECACA', marginBottom: '20px',
              }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#DC2626', marginBottom: '8px' }}>
                  根本問題: SRS エンジンが本家 Anki と違う
                </div>
                <div style={{ fontSize: '12px', color: '#7F1D1D', lineHeight: '1.7' }}>
                  現在の実装は Leitner Box (固定5段階) を使用。本家 Anki は SM-2 改良版で、
                  カードごとに連続的なインターバルを計算する。Learning/Relearning 状態、
                  学習ステップ (1分→10分)、遅延ボーナス、全部ない。
                </div>
              </div>

              {/* 本家 vs 現在 */}
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#57534E', marginBottom: '10px' }}>
                本家 Anki vs 現在の実装
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px',
              }}>
                <div style={{
                  padding: '12px 16px', backgroundColor: '#F0FDF4', borderRadius: '8px',
                  border: '1px solid #BBF7D0',
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#059669', marginBottom: '6px' }}>
                    本家 Anki (SM-2改)
                  </div>
                  <div style={{ fontSize: '11px', color: '#065F46', lineHeight: '1.6' }}>
                    4状態 (New/Learning/Review/Relearning)<br/>
                    学習ステップ 1分→10分→卒業<br/>
                    カードごとに ease factor<br/>
                    インターバル = ease * interval (指数的)<br/>
                    遅延ボーナスあり
                  </div>
                </div>
                <div style={{
                  padding: '12px 16px', backgroundColor: '#FEF3C7', borderRadius: '8px',
                  border: '1px solid #FDE68A',
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#92400E', marginBottom: '6px' }}>
                    現在の実装 (Leitner Box)
                  </div>
                  <div style={{ fontSize: '11px', color: '#78350F', lineHeight: '1.6' }}>
                    2状態のみ (New/Review)<br/>
                    学習ステップなし (即日1日後)<br/>
                    ease factor あるが Box に上書きされる<br/>
                    インターバル = Box固定 (1,3,7,14,30日)<br/>
                    遅延ボーナスなし
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#E7E5E4', margin: '20px 0' }} />

              {/* UI問題 */}
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#57534E', marginBottom: '10px' }}>
                UI の問題
              </div>
              <div style={{ marginBottom: '20px' }}>
                {[
                  'カレンダー形式ではない (他ページは全部カレンダー)',
                  '初回 dailyNewCards=10 で体験が壊れてる (1,044枚中10枚/日)',
                  '表裏が逆？ 日本語→英語 (recall) の方が効果的',
                  '設定変更 UI がない',
                  'モバイルで4ボタンが潰れる',
                ].map((text, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', marginBottom: '4px', backgroundColor: '#FAFAF9',
                    borderRadius: '6px', fontSize: '12px', color: '#57534E',
                    borderLeft: '3px solid #D4AF37',
                  }}>
                    {text}
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', backgroundColor: '#E7E5E4', margin: '20px 0' }} />

              {/* フェーズ */}
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#57534E', marginBottom: '12px' }}>
                イテレーション計画
              </div>
              {[
                { phase: 'Phase 1', title: 'SRS エンジンを本家準拠に', color: '#DC2626', items: [
                  'Learning / Relearning 状態の追加',
                  '学習ステップ (1分, 10分) の実装',
                  'インターバル計算を SM-2 準拠に',
                  '遅延ボーナス / ラプス処理',
                  '→ 新規 anki-engine.ts を作る (既存 srs-engine は触らない)',
                ]},
                { phase: 'Phase 2', title: 'カレンダー UI', color: '#D4AF37', items: [
                  'カレンダーグリッド (goroku パターン踏襲)',
                  'セルに due数 / reviewed数 表示',
                  '右パネル: 選択日の詳細 + レビュー開始',
                  'モバイル: 縦スタック',
                ]},
                { phase: 'Phase 3', title: 'レビュー画面改善', color: '#3B82F6', items: [
                  '表裏切り替えオプション',
                  'TTS / Undo / フリップアニメ',
                  'タイプ別フィルター',
                ]},
                { phase: 'Phase 4', title: '統計・可視化', color: '#8B5CF6', items: [
                  '学習ヒートマップ',
                  'accuracy 推移グラフ',
                  'リーチカード検出',
                ]},
              ].map((p, i) => (
                <div key={i} style={{
                  marginBottom: '12px', padding: '12px 16px',
                  borderRadius: '8px', border: `1px solid ${p.color}30`,
                  backgroundColor: `${p.color}08`,
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: p.color, marginBottom: '6px' }}>
                    {p.phase}: {p.title}
                  </div>
                  {p.items.map((item, j) => (
                    <div key={j} style={{ fontSize: '11px', color: '#78716C', marginBottom: '2px' }}>
                      {item.startsWith('→') ? item : `[ ] ${item}`}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {/* === REVIEW === */}
        {view === 'review' && currentPhrase && currentCard && (
          <>
            {/* Progress bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <button
                  onClick={() => setView('dashboard')}
                  style={{
                    background: 'none', border: 'none', color: '#78716C', fontSize: '14px',
                    cursor: 'pointer', padding: '4px 0',
                  }}
                >
                  ← Back
                </button>
                <div style={{ fontSize: '14px', color: '#78716C', fontWeight: '500' }}>
                  {currentIndex + 1} / {reviewQueue.length}
                </div>
              </div>
              <div style={{ height: '4px', backgroundColor: '#E7E5E4', borderRadius: '2px' }}>
                <div style={{
                  height: '100%',
                  width: `${((currentIndex + 1) / reviewQueue.length) * 100}%`,
                  backgroundColor: '#D4AF37',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>

            {/* Card */}
            <div
              onClick={() => !isFlipped && setIsFlipped(true)}
              style={{
                backgroundColor: '#fff',
                borderRadius: '20px',
                border: '1px solid #E7E5E4',
                padding: '48px 40px',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isFlipped ? 'default' : 'pointer',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                marginBottom: '24px',
                transition: 'box-shadow 0.2s ease',
                userSelect: 'none',
              }}
            >
              {/* Phrase (front) */}
              <div style={{
                fontSize: '26px', fontWeight: '600', color: '#1C1917',
                textAlign: 'center', lineHeight: '1.5', marginBottom: isFlipped ? '24px' : '16px',
              }}>
                {currentPhrase.natural}
              </div>

              {/* Box badge */}
              <div style={{
                fontSize: '11px', fontWeight: '600',
                color: getBoxColor(currentCard.box),
                backgroundColor: getBoxColor(currentCard.box) + '18',
                padding: '3px 10px',
                borderRadius: '6px',
                marginBottom: isFlipped ? '24px' : '0',
              }}>
                {getBoxLabel(currentCard.box)}
              </div>

              {!isFlipped && (
                <div style={{
                  marginTop: '24px', fontSize: '13px', color: '#A8A29E',
                }}>
                  tap to flip
                </div>
              )}

              {/* Back (meaning + type) */}
              {isFlipped && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '60px', height: '1px', backgroundColor: '#E7E5E4',
                    margin: '0 auto 24px',
                  }} />
                  <div style={{
                    fontSize: '20px', color: '#44403C', lineHeight: '1.6',
                    marginBottom: '16px',
                  }}>
                    {currentPhrase.original}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: getTypeStyle(currentPhrase.category).bg,
                    color: getTypeStyle(currentPhrase.category).text,
                    border: `1px solid ${getTypeStyle(currentPhrase.category).border}`,
                  }}>
                    {currentPhrase.category}
                  </div>
                </div>
              )}
            </div>

            {/* Rating buttons */}
            {isFlipped && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {([
                  { key: 'again' as ReviewDifficulty, label: 'Again', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', shortcut: '1' },
                  { key: 'hard' as ReviewDifficulty, label: 'Hard', color: '#F97316', bg: '#FFF7ED', border: '#FED7AA', shortcut: '2' },
                  { key: 'good' as ReviewDifficulty, label: 'Good', color: '#22C55E', bg: '#F0FDF4', border: '#BBF7D0', shortcut: '3' },
                  { key: 'easy' as ReviewDifficulty, label: 'Easy', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', shortcut: '4' },
                ]).map(btn => (
                  <button
                    key={btn.key}
                    onClick={() => rateCard(btn.key)}
                    style={{
                      padding: '16px 8px 12px',
                      backgroundColor: btn.bg,
                      border: `1px solid ${btn.border}`,
                      borderRadius: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'transform 0.1s ease',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: '700', color: btn.color }}>
                      {btn.label}
                    </div>
                    <div style={{ fontSize: '11px', color: '#A8A29E' }}>
                      {getIntervalHint(btn.key)}
                    </div>
                    <div style={{
                      fontSize: '10px', color: '#D6D3D1', fontWeight: '600',
                      marginTop: '2px',
                    }}>
                      {btn.shortcut}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Keyboard hint */}
            {!isFlipped && (
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#D6D3D1', marginTop: '16px' }}>
                Space or Enter to flip
              </div>
            )}
          </>
        )}

        {/* === SUMMARY === */}
        {view === 'summary' && (
          <>
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {sessionResult.correct / sessionResult.total >= 0.8 ? '' : ''}
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1C1917', marginBottom: '8px' }}>
                Session Complete
              </h1>
              <p style={{ fontSize: '14px', color: '#78716C', marginBottom: '40px' }}>
                {getToday()}
              </p>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px',
              marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px',
            }}>
              <div style={{
                backgroundColor: '#fff', borderRadius: '14px', padding: '20px',
                border: '1px solid #E7E5E4', textAlign: 'center',
              }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#1C1917' }}>
                  {sessionResult.total}
                </div>
                <div style={{ fontSize: '12px', color: '#78716C', marginTop: '4px' }}>Reviewed</div>
              </div>
              <div style={{
                backgroundColor: '#fff', borderRadius: '14px', padding: '20px',
                border: '1px solid #E7E5E4', textAlign: 'center',
              }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: sessionResult.total > 0 && sessionResult.correct / sessionResult.total >= 0.8 ? '#059669' : '#D97706' }}>
                  {sessionResult.total > 0 ? Math.round((sessionResult.correct / sessionResult.total) * 100) : 0}%
                </div>
                <div style={{ fontSize: '12px', color: '#78716C', marginTop: '4px' }}>Accuracy</div>
              </div>
              <div style={{
                backgroundColor: '#fff', borderRadius: '14px', padding: '20px',
                border: '1px solid #E7E5E4', textAlign: 'center',
              }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#2563EB' }}>
                  {sessionResult.newLearned}
                </div>
                <div style={{ fontSize: '12px', color: '#78716C', marginTop: '4px' }}>New learned</div>
              </div>
              <div style={{
                backgroundColor: '#fff', borderRadius: '14px', padding: '20px',
                border: '1px solid #E7E5E4', textAlign: 'center',
              }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981' }}>
                  {sessionResult.graduated}
                </div>
                <div style={{ fontSize: '12px', color: '#78716C', marginTop: '4px' }}>Graduated</div>
              </div>
            </div>

            {/* Answer breakdown */}
            {sessionAnswers.length > 0 && (
              <div style={{ maxWidth: '500px', margin: '0 auto 32px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '12px' }}>
                  Breakdown
                </div>
                <div style={{ display: 'flex', gap: '3px', height: '24px', borderRadius: '8px', overflow: 'hidden' }}>
                  {(['again', 'hard', 'good', 'easy'] as ReviewDifficulty[]).map(d => {
                    const count = sessionAnswers.filter(a => a.difficulty === d).length;
                    const pct = (count / sessionAnswers.length) * 100;
                    if (pct === 0) return null;
                    const colors: Record<ReviewDifficulty, string> = {
                      again: '#EF4444', hard: '#F97316', good: '#22C55E', easy: '#3B82F6',
                    };
                    return (
                      <div
                        key={d}
                        style={{
                          width: `${pct}%`,
                          backgroundColor: colors[d],
                          minWidth: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: '600',
                          color: '#fff',
                        }}
                      >
                        {count}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  {[
                    { label: 'Again', color: '#EF4444' },
                    { label: 'Hard', color: '#F97316' },
                    { label: 'Good', color: '#22C55E' },
                    { label: 'Easy', color: '#3B82F6' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#78716C' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: item.color }} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <button
                onClick={() => setView('dashboard')}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#D4AF37',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </>
        )}
    </div>
  );
}
