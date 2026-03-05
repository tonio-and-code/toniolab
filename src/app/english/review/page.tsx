'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  type Phrase,
  type ReviewCard,
  type ReviewSession,
  type ReviewProgress,
  type ReviewSettings,
  type ReviewDifficulty,
  type QuizMode,
  type LeitnerBox,
  DEFAULT_SETTINGS,
} from '@/types/review';
import {
  loadCards,
  saveCards,
  loadSessions,
  saveSessions,
  loadSettings,
  saveSettings,
  getDueCards,
  getNewCards,
  processReview,
  createNewCard,
  calculateProgress,
  addSession,
  shuffleArray,
  checkTypedAnswer,
  generateChoices,
  getPhraseKey,
  getToday,
  formatInterval,
  getBoxLabel,
  getBoxColor,
} from '@/lib/srs-engine';

// Theme configuration (light only)
const theme = {
  bg: '#f5f5f5',
  bgSecondary: '#ffffff',
  bgTertiary: '#fafafa',
  text: '#1a1a1a',
  textSecondary: '#555',
  textMuted: '#666',
  border: '#e5e5e5',
  borderLight: '#d5d5d5',
  accent: '#B8960C',
  success: '#059669',
  error: '#dc2626',
  warning: '#ea580c',
};

// Curated phrases for memorization (same as /english/phrases)
const allPhrases: Phrase[] = [
  { original: "What have you been up to?", natural: "What have you been up to?", category: "Conversation", date: "2026-01-14" },
  { original: "I haven't done much today", natural: "I haven't done much today", category: "Daily", date: "2026-01-14" },
  { original: "You don't need to force yourself", natural: "You don't need to force yourself", category: "Advice", date: "2026-01-14" },
  { original: "Silence is also part of communication", natural: "Silence is also part of communication", category: "Philosophy", date: "2026-01-14" },
  { original: "Speaking of which...", natural: "Speaking of which...", category: "Transition", date: "2026-01-14" },
  { original: "Could you make it sound more natural?", natural: "Could you make it sound more natural?", category: "Request", date: "2026-01-14" },
  { original: "I'm thinking about switching careers", natural: "I'm thinking about switching careers", category: "Career", date: "2026-01-14" },
  { original: "That's a smart mindset", natural: "That's a smart mindset", category: "Affirmation", date: "2026-01-14" },
  { original: "I get more excited about...", natural: "I get more excited about...", category: "Preference", date: "2026-01-14" },
  { original: "Does it change that much?", natural: "Does it change that much?", category: "Question", date: "2026-01-14" },
  { original: "It fits in your palm", natural: "It fits in your palm", category: "Description", date: "2026-01-14" },
  { original: "From the ego's perspective", natural: "From the ego's perspective", category: "Philosophy", date: "2026-01-14" },
  { original: "It simply exists", natural: "It simply exists", category: "Philosophy", date: "2026-01-14" },
  { original: "We've talked enough about it", natural: "We've talked enough about it", category: "Transition", date: "2026-01-14" },
  { original: "Shall we switch to a different topic?", natural: "Shall we switch to a different topic?", category: "Transition", date: "2026-01-14" },
  { original: "What's on your mind?", natural: "What's on your mind?", category: "Question", date: "2026-01-14" },
  { original: "Can you start us off?", natural: "Can you start us off?", category: "Request", date: "2026-01-14" },
  { original: "I couldn't care less", natural: "I couldn't care less", category: "Opinion", date: "2026-01-14" },
  { original: "It's ridiculously cheap yet delicious", natural: "It's ridiculously cheap yet delicious", category: "Description", date: "2026-01-14" },
  { original: "The microorganisms do all the work", natural: "The microorganisms do all the work", category: "Science", date: "2026-01-14" },
];

export default function ReviewPage() {
  // Theme (light only)
  const t = theme;

  // Core state
  const [isLoaded, setIsLoaded] = useState(false);
  const [cards, setCards] = useState<Map<string, ReviewCard>>(new Map());
  const [sessions, setSessions] = useState<ReviewSession[]>([]);
  const [settings, setSettings] = useState<ReviewSettings>(DEFAULT_SETTINGS);
  const [progress, setProgress] = useState<ReviewProgress | null>(null);

  // Quiz state
  const [quizMode, setQuizMode] = useState<QuizMode>('flashcard');
  const [quizCards, setQuizCards] = useState<ReviewCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [similarity, setSimilarity] = useState(0);
  const [sessionStart, setSessionStart] = useState<number>(0);
  const [cardStart, setCardStart] = useState<number>(0);

  // Session stats
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionWrong, setSessionWrong] = useState(0);
  const [sessionTimes, setSessionTimes] = useState<number[]>([]);
  const [newCardsThisSession, setNewCardsThisSession] = useState(0);
  const [graduatedThisSession, setGraduatedThisSession] = useState(0);

  // UI state
  const [view, setView] = useState<'home' | 'quiz' | 'complete'>('home');
  const inputRef = useRef<HTMLInputElement>(null);

  // Phrase lookup
  const phraseMap = new Map<string, Phrase>();
  allPhrases.forEach(p => phraseMap.set(getPhraseKey(p), p));

  // Load data on mount
  useEffect(() => {
    const loadedCards = loadCards();
    const loadedSessions = loadSessions();
    const loadedSettings = loadSettings();

    setCards(loadedCards);
    setSessions(loadedSessions);
    setSettings(loadedSettings);
    setProgress(calculateProgress(allPhrases, loadedCards, loadedSessions));
    setIsLoaded(true);
  }, []);

  // Get current phrase
  const getCurrentPhrase = useCallback((): Phrase | null => {
    if (quizCards.length === 0 || currentIndex >= quizCards.length) return null;
    const card = quizCards[currentIndex];
    return phraseMap.get(card.phraseKey) || null;
  }, [quizCards, currentIndex, phraseMap]);

  // Play TTS
  const playTTS = useCallback((text: string) => {
    if (!settings.playAudio || typeof window === 'undefined') return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Samantha') || v.name.includes('Google US English')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  }, [settings.playAudio]);

  // Start quiz
  const startQuiz = useCallback((mode: QuizMode) => {
    const dueCards = getDueCards(cards, settings);
    const newPhrases = getNewCards(allPhrases, cards, settings);

    // Create cards for new phrases
    const updatedCards = new Map(cards);
    let newCount = 0;

    newPhrases.forEach(phrase => {
      const key = getPhraseKey(phrase);
      if (!updatedCards.has(key)) {
        updatedCards.set(key, createNewCard(phrase));
        newCount++;
      }
    });

    // Get newly created cards
    const newCards = newPhrases.map(p => updatedCards.get(getPhraseKey(p))!).filter(Boolean);

    // Combine due cards and new cards
    let allQuizCards = [...dueCards, ...newCards];

    // Shuffle for variety
    allQuizCards = shuffleArray(allQuizCards);

    if (allQuizCards.length === 0) {
      alert('No cards due for review! Check back later.');
      return;
    }

    setCards(updatedCards);
    saveCards(updatedCards);
    setQuizMode(mode);
    setQuizCards(allQuizCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setUserInput('');
    setSelectedChoice(null);
    setShowResult(false);
    setSessionCorrect(0);
    setSessionWrong(0);
    setSessionTimes([]);
    setNewCardsThisSession(newCount);
    setGraduatedThisSession(0);
    setSessionStart(Date.now());
    setCardStart(Date.now());
    setView('quiz');

    // Generate choices for first card if in choice mode
    if (mode === 'choice' && allQuizCards.length > 0) {
      const firstPhrase = phraseMap.get(allQuizCards[0].phraseKey);
      if (firstPhrase) {
        setChoices(generateChoices(firstPhrase, allPhrases));
      }
    }
  }, [cards, settings, phraseMap]);

  // Handle flashcard flip
  const handleFlip = useCallback(() => {
    if (showResult) return;

    setIsFlipped(true);
    const phrase = getCurrentPhrase();
    if (phrase && settings.playAudio) {
      playTTS(phrase.natural);
    }
  }, [showResult, getCurrentPhrase, settings.playAudio, playTTS]);

  // Handle difficulty rating (flashcard mode)
  const handleDifficultyRating = useCallback((difficulty: ReviewDifficulty) => {
    const card = quizCards[currentIndex];
    const timeTaken = (Date.now() - cardStart) / 1000;

    // Process the review
    const updatedCard = processReview(card, difficulty);
    const wasCorrect = difficulty === 'good' || difficulty === 'easy';

    // Update stats
    if (wasCorrect) {
      setSessionCorrect(prev => prev + 1);
    } else {
      setSessionWrong(prev => prev + 1);
    }
    setSessionTimes(prev => [...prev, timeTaken]);

    // Check if graduated
    if (updatedCard.box === 5 && card.box < 5) {
      setGraduatedThisSession(prev => prev + 1);
    }

    // Save updated card
    const updatedCards = new Map(cards);
    updatedCards.set(card.phraseKey, updatedCard);
    setCards(updatedCards);
    saveCards(updatedCards);

    // Move to next card or end quiz
    if (currentIndex < quizCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setShowResult(false);
      setCardStart(Date.now());

      // Generate choices for next card if in choice mode
      if (quizMode === 'choice') {
        const nextPhrase = phraseMap.get(quizCards[currentIndex + 1].phraseKey);
        if (nextPhrase) {
          setChoices(generateChoices(nextPhrase, allPhrases));
          setSelectedChoice(null);
        }
      }
    } else {
      finishQuiz();
    }
  }, [quizCards, currentIndex, cardStart, cards, quizMode, phraseMap]);

  // Handle typing submission
  const handleTypingSubmit = useCallback(() => {
    if (showResult) return;

    const phrase = getCurrentPhrase();
    if (!phrase) return;

    const { isCorrect: correct, similarity: sim } = checkTypedAnswer(userInput, phrase.natural);
    setIsCorrect(correct);
    setSimilarity(sim);
    setShowResult(true);

    if (settings.playAudio) {
      playTTS(phrase.natural);
    }
  }, [showResult, getCurrentPhrase, userInput, settings.playAudio, playTTS]);

  // Handle choice selection
  const handleChoiceSelect = useCallback((index: number) => {
    if (showResult) return;

    const phrase = getCurrentPhrase();
    if (!phrase) return;

    setSelectedChoice(index);
    const correct = choices[index] === phrase.natural;
    setIsCorrect(correct);
    setShowResult(true);

    if (settings.playAudio) {
      playTTS(phrase.natural);
    }
  }, [showResult, getCurrentPhrase, choices, settings.playAudio, playTTS]);

  // Finish quiz and save session
  const finishQuiz = useCallback(() => {
    const avgTime = sessionTimes.length > 0
      ? sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length
      : 0;

    const updatedSessions = addSession(
      sessions,
      sessionCorrect + sessionWrong,
      sessionCorrect,
      sessionWrong,
      avgTime,
      newCardsThisSession,
      graduatedThisSession
    );

    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    setProgress(calculateProgress(allPhrases, cards, updatedSessions));
    setView('complete');
  }, [sessions, sessionCorrect, sessionWrong, sessionTimes, newCardsThisSession, graduatedThisSession, cards]);

  // Continue after showing result (typing/choice modes)
  const handleContinue = useCallback((difficulty: ReviewDifficulty) => {
    handleDifficultyRating(difficulty);
  }, [handleDifficultyRating]);

  // Focus input when quiz starts
  useEffect(() => {
    if (view === 'quiz' && quizMode === 'typing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [view, quizMode, currentIndex]);

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: t.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: t.textSecondary }}>Loading...</div>
      </div>
    );
  }

  const currentPhrase = getCurrentPhrase();
  const currentCard = quizCards[currentIndex];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: t.bg,
      color: t.text,
      fontFamily: 'Georgia, "Yu Mincho", serif',
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: `1px solid ${t.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link
          href="/english"
          style={{
            color: t.textSecondary,
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          Back to English
        </Link>
        <h1 style={{
          fontSize: '18px',
          fontWeight: 400,
          letterSpacing: '0.1em',
          color: t.accent,
        }}>
          SPACED REPETITION
        </h1>
        <div />
      </header>

      {/* Home View */}
      {view === 'home' && progress && (
        <div style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto' }}>
          {/* Progress Overview */}
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              color: t.textMuted,
              marginBottom: '24px',
              textTransform: 'uppercase',
            }}>
              YOUR PROGRESS
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}>
              {/* Due Today */}
              <div style={{
                backgroundColor: t.bgSecondary,
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 600,
                  color: progress.dueToday > 0 ? t.warning : t.success,
                }}>
                  {progress.dueToday}
                </div>
                <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                  Due Today
                </div>
              </div>

              {/* Streak */}
              <div style={{
                backgroundColor: t.bgSecondary,
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '32px', fontWeight: 600, color: t.accent }}>
                  {progress.streakDays}
                </div>
                <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                  Day Streak
                </div>
              </div>

              {/* Accuracy */}
              <div style={{
                backgroundColor: t.bgSecondary,
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '32px', fontWeight: 600, color: t.success }}>
                  {progress.accuracy}%
                </div>
                <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                  Accuracy
                </div>
              </div>

              {/* Mastered */}
              <div style={{
                backgroundColor: t.bgSecondary,
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '32px', fontWeight: 600, color: t.success }}>
                  {progress.masteredCount}
                </div>
                <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                  Mastered
                </div>
              </div>
            </div>

            {/* Leitner Box Distribution */}
            <div style={{
              backgroundColor: t.bgSecondary,
              padding: '24px',
              borderRadius: '12px',
            }}>
              <div style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: t.textMuted,
                marginBottom: '16px',
              }}>
                LEITNER BOX DISTRIBUTION
              </div>
              <div style={{ display: 'flex', gap: '8px', height: '60px', alignItems: 'flex-end' }}>
                {([1, 2, 3, 4, 5] as LeitnerBox[]).map(box => {
                  const count = progress.cardsByBox[box];
                  const maxCount = Math.max(...Object.values(progress.cardsByBox), 1);
                  const height = (count / maxCount) * 100;

                  return (
                    <div key={box} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '100%',
                        height: `${Math.max(height, 5)}%`,
                        backgroundColor: getBoxColor(box),
                        borderRadius: '4px 4px 0 0',
                        minHeight: '4px',
                      }} />
                      <div style={{ fontSize: '10px', color: t.textMuted, marginTop: '8px' }}>
                        {getBoxLabel(box)}
                      </div>
                      <div style={{ fontSize: '14px', color: t.text, fontWeight: 500 }}>
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Quiz Mode Selection */}
          <section>
            <h2 style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              color: t.textMuted,
              marginBottom: '24px',
              textTransform: 'uppercase',
            }}>
              START REVIEW
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Flashcard Mode */}
              <button
                onClick={() => startQuiz('flashcard')}
                style={{
                  backgroundColor: t.bgSecondary,
                  border: `1px solid ${t.borderLight}`,
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = t.accent;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = t.borderLight;
                }}
              >
                <div style={{ fontSize: '16px', color: t.text, marginBottom: '4px' }}>
                  Flashcard Mode
                </div>
                <div style={{ fontSize: '13px', color: t.textMuted }}>
                  Flip cards and rate your recall. Best for quick review sessions.
                </div>
              </button>

              {/* Multiple Choice Mode */}
              <button
                onClick={() => startQuiz('choice')}
                style={{
                  backgroundColor: t.bgSecondary,
                  border: `1px solid ${t.borderLight}`,
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = t.accent;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = t.borderLight;
                }}
              >
                <div style={{ fontSize: '16px', color: t.text, marginBottom: '4px' }}>
                  Multiple Choice
                </div>
                <div style={{ fontSize: '13px', color: t.textMuted }}>
                  Select the correct answer from options. Good for recognition practice.
                </div>
              </button>

              {/* Typing Mode */}
              <button
                onClick={() => startQuiz('typing')}
                style={{
                  backgroundColor: t.bgSecondary,
                  border: `1px solid ${t.borderLight}`,
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = t.accent;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = t.borderLight;
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px', color: t.text }}>Typing Mode</span>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: t.success,
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    letterSpacing: '0.05em',
                  }}>
                    BEST RETENTION
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: t.textMuted }}>
                  Type the phrase from memory. Most effective for long-term retention.
                </div>
              </button>
            </div>

            {/* Stats summary */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: t.bgTertiary,
              borderRadius: '8px',
              fontSize: '13px',
              color: t.textMuted,
            }}>
              Total phrases: {progress.totalCards} |
              Learning: {progress.learningCount} |
              Reviewing: {progress.reviewingCount} |
              Reviews: {progress.totalReviews}
            </div>
          </section>
        </div>
      )}

      {/* Quiz View */}
      {view === 'quiz' && currentPhrase && currentCard && (
        <div style={{ padding: '32px 24px', maxWidth: '600px', margin: '0 auto' }}>
          {/* Progress bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '12px',
              color: t.textMuted,
            }}>
              <span>{currentIndex + 1} / {quizCards.length}</span>
              <span style={{ color: getBoxColor(currentCard.box) }}>
                {getBoxLabel(currentCard.box)}
              </span>
            </div>
            <div style={{
              height: '4px',
              backgroundColor: t.border,
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${((currentIndex + 1) / quizCards.length) * 100}%`,
                backgroundColor: t.accent,
                transition: 'width 0.3s',
              }} />
            </div>
          </div>

          {/* Category hint */}
          {settings.showHint && (
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: t.textMuted,
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}>
              {currentPhrase.category}
            </div>
          )}

          {/* Card */}
          <div style={{
            backgroundColor: t.bgSecondary,
            borderRadius: '16px',
            padding: '32px',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: '24px',
          }}>
            {/* Flashcard Mode */}
            {quizMode === 'flashcard' && (
              <>
                {!isFlipped ? (
                  <div
                    onClick={handleFlip}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontSize: '18px',
                      lineHeight: 1.6,
                      color: t.text,
                    }}>
                      {currentPhrase.original}
                    </div>
                    <div style={{
                      marginTop: '24px',
                      fontSize: '13px',
                      color: t.textMuted,
                    }}>
                      Tap to reveal
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '14px',
                      color: t.textMuted,
                      marginBottom: '16px',
                    }}>
                      {currentPhrase.original}
                    </div>
                    <div style={{
                      fontSize: '20px',
                      lineHeight: 1.6,
                      color: t.accent,
                    }}>
                      {currentPhrase.natural}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Typing Mode */}
            {quizMode === 'typing' && (
              <>
                <div style={{
                  fontSize: '18px',
                  lineHeight: 1.6,
                  color: t.text,
                  marginBottom: '24px',
                  textAlign: 'center',
                }}>
                  {currentPhrase.original}
                </div>

                {!showResult ? (
                  <div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleTypingSubmit()}
                      placeholder="Type the natural phrase..."
                      style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '16px',
                        backgroundColor: t.bgTertiary,
                        border: `1px solid ${t.borderLight}`,
                        borderRadius: '8px',
                        color: t.text,
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleTypingSubmit}
                      style={{
                        width: '100%',
                        marginTop: '16px',
                        padding: '14px',
                        backgroundColor: t.accent,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      Check Answer
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      padding: '16px',
                      backgroundColor: isCorrect ? `${t.success}20` : `${t.error}20`,
                      borderRadius: '8px',
                      marginBottom: '16px',
                    }}>
                      <div style={{
                        fontSize: '14px',
                        color: isCorrect ? t.success : t.error,
                        marginBottom: '8px',
                      }}>
                        {isCorrect ? 'Correct!' : `Incorrect (${Math.round(similarity * 100)}% match)`}
                      </div>
                      <div style={{ fontSize: '16px', color: t.accent }}>
                        {currentPhrase.natural}
                      </div>
                      {!isCorrect && userInput && (
                        <div style={{
                          fontSize: '14px',
                          color: t.textMuted,
                          marginTop: '8px',
                          textDecoration: 'line-through',
                        }}>
                          Your answer: {userInput}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Multiple Choice Mode */}
            {quizMode === 'choice' && (
              <>
                <div style={{
                  fontSize: '18px',
                  lineHeight: 1.6,
                  color: t.text,
                  marginBottom: '24px',
                  textAlign: 'center',
                }}>
                  {currentPhrase.original}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {choices.map((choice, index) => {
                    const isSelected = selectedChoice === index;
                    const isCorrectChoice = choice === currentPhrase.natural;
                    let bgColor = t.bgTertiary;
                    let borderColor = t.borderLight;

                    if (showResult) {
                      if (isCorrectChoice) {
                        bgColor = `${t.success}20`;
                        borderColor = t.success;
                      } else if (isSelected && !isCorrect) {
                        bgColor = `${t.error}20`;
                        borderColor = t.error;
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleChoiceSelect(index)}
                        disabled={showResult}
                        style={{
                          padding: '14px 16px',
                          backgroundColor: bgColor,
                          border: `1px solid ${borderColor}`,
                          borderRadius: '8px',
                          textAlign: 'left',
                          fontSize: '14px',
                          color: t.text,
                          cursor: showResult ? 'default' : 'pointer',
                          opacity: showResult && !isCorrectChoice && !isSelected ? 0.5 : 1,
                        }}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Difficulty buttons */}
          {(quizMode === 'flashcard' && isFlipped) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
            }}>
              {[
                { key: 'again', label: 'Again', color: t.error, interval: '1d' },
                { key: 'hard', label: 'Hard', color: t.warning, interval: '3d' },
                { key: 'good', label: 'Good', color: t.success, interval: '7d' },
                { key: 'easy', label: 'Easy', color: '#22c55e', interval: '14d' },
              ].map(btn => (
                <button
                  key={btn.key}
                  onClick={() => handleDifficultyRating(btn.key as ReviewDifficulty)}
                  style={{
                    padding: '16px 8px',
                    backgroundColor: t.bgSecondary,
                    border: `1px solid ${btn.color}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ color: btn.color, fontSize: '14px' }}>{btn.label}</span>
                  <span style={{ color: t.textMuted, fontSize: '11px' }}>{btn.interval}</span>
                </button>
              ))}
            </div>
          )}

          {/* Continue button for typing/choice modes */}
          {(quizMode !== 'flashcard' && showResult) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isCorrect ? '1fr 1fr' : '1fr',
              gap: '8px',
            }}>
              {isCorrect ? (
                <>
                  <button
                    onClick={() => handleContinue('good')}
                    style={{
                      padding: '16px',
                      backgroundColor: t.success,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Good
                  </button>
                  <button
                    onClick={() => handleContinue('easy')}
                    style={{
                      padding: '16px',
                      backgroundColor: '#22c55e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Easy
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleContinue('again')}
                  style={{
                    padding: '16px',
                    backgroundColor: t.error,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {/* Session stats */}
          <div style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            fontSize: '12px',
            color: t.textMuted,
          }}>
            <span style={{ color: t.success }}>{sessionCorrect} correct</span>
            <span style={{ color: t.error }}>{sessionWrong} wrong</span>
          </div>
        </div>
      )}

      {/* Complete View */}
      {view === 'complete' && (
        <div style={{
          padding: '48px 24px',
          maxWidth: '500px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '24px',
            marginBottom: '16px',
            color: t.accent,
            letterSpacing: '0.1em',
          }}>
            {sessionCorrect > sessionWrong ? 'EXCELLENT' : 'KEEP GOING'}
          </div>

          <h2 style={{
            fontSize: '24px',
            color: t.text,
            marginBottom: '32px',
          }}>
            Session Complete!
          </h2>

          <div style={{
            backgroundColor: t.bgSecondary,
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
            }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 600, color: t.success }}>
                  {sessionCorrect}
                </div>
                <div style={{ fontSize: '12px', color: t.textMuted }}>Correct</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 600, color: t.error }}>
                  {sessionWrong}
                </div>
                <div style={{ fontSize: '12px', color: t.textMuted }}>Wrong</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 600, color: t.accent }}>
                  {sessionCorrect + sessionWrong > 0
                    ? Math.round((sessionCorrect / (sessionCorrect + sessionWrong)) * 100)
                    : 0}%
                </div>
                <div style={{ fontSize: '12px', color: t.textMuted }}>Accuracy</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 600, color: t.text }}>
                  {sessionTimes.length > 0
                    ? Math.round(sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length)
                    : 0}s
                </div>
                <div style={{ fontSize: '12px', color: t.textMuted }}>Avg Time</div>
              </div>
            </div>

            {(newCardsThisSession > 0 || graduatedThisSession > 0) && (
              <div style={{
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: `1px solid ${t.border}`,
                fontSize: '13px',
                color: t.textSecondary,
              }}>
                {newCardsThisSession > 0 && (
                  <div>+{newCardsThisSession} new cards started</div>
                )}
                {graduatedThisSession > 0 && (
                  <div style={{ color: t.success }}>
                    {graduatedThisSession} cards mastered!
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => setView('home')}
              style={{
                padding: '14px 32px',
                backgroundColor: t.bgSecondary,
                border: `1px solid ${t.borderLight}`,
                borderRadius: '8px',
                color: t.text,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
            <button
              onClick={() => startQuiz(quizMode)}
              style={{
                padding: '14px 32px',
                backgroundColor: t.accent,
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Continue Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
