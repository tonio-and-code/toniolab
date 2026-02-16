// Spaced Repetition System Engine
// Implements SM-2 algorithm with Leitner box modifications

import {
  type Phrase,
  type ReviewCard,
  type ReviewSession,
  type ReviewProgress,
  type ReviewSettings,
  type ReviewDifficulty,
  type LeitnerBox,
  LEITNER_INTERVALS,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
} from '@/types/review';

// Helper to get today's date in ISO format
export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// Parse ISO date string to Date object
function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

// Get days until next review
function getDaysUntil(dateStr: string): number {
  const today = parseDate(getToday());
  const targetDate = parseDate(dateStr);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Generate unique key for a phrase
export function getPhraseKey(phrase: Phrase): string {
  return phrase.natural;
}

// Initialize a new review card for a phrase
export function createNewCard(phrase: Phrase): ReviewCard {
  const today = getToday();
  return {
    phraseKey: getPhraseKey(phrase),
    box: 1,
    nextReviewDate: today, // Due immediately
    lastReviewDate: today,
    reviewCount: 0,
    correctStreak: 0,
    wrongCount: 0,
    easeFactor: 2.5,
  };
}

// Calculate next review date based on Leitner box and SM-2 ease factor
function calculateNextReviewDate(box: LeitnerBox, easeFactor: number): string {
  const baseInterval = LEITNER_INTERVALS[box];
  // Apply ease factor for more personalized intervals
  const adjustedInterval = Math.round(baseInterval * (easeFactor / 2.5));
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + adjustedInterval);
  return nextDate.toISOString().split('T')[0];
}

// Process a review answer and update the card
export function processReview(
  card: ReviewCard,
  difficulty: ReviewDifficulty
): ReviewCard {
  const today = getToday();
  let newBox = card.box;
  let newEaseFactor = card.easeFactor;
  let correctStreak = card.correctStreak;
  let wrongCount = card.wrongCount;

  // Adjust based on difficulty (SM-2 algorithm adaptation)
  switch (difficulty) {
    case 'again':
      // Reset to Box 1 - needs re-learning
      newBox = 1;
      correctStreak = 0;
      wrongCount++;
      newEaseFactor = Math.max(1.3, card.easeFactor - 0.2);
      break;
    case 'hard':
      // Stay in same box or demote one level
      newBox = Math.max(1, card.box - 1) as LeitnerBox;
      correctStreak = 0;
      newEaseFactor = Math.max(1.3, card.easeFactor - 0.15);
      break;
    case 'good':
      // Progress to next box
      newBox = Math.min(5, card.box + 1) as LeitnerBox;
      correctStreak++;
      newEaseFactor = card.easeFactor;
      break;
    case 'easy':
      // Skip a box for very easy cards
      newBox = Math.min(5, card.box + 2) as LeitnerBox;
      correctStreak++;
      newEaseFactor = card.easeFactor + 0.15;
      break;
  }

  return {
    ...card,
    box: newBox,
    nextReviewDate: calculateNextReviewDate(newBox, newEaseFactor),
    lastReviewDate: today,
    reviewCount: card.reviewCount + 1,
    correctStreak,
    wrongCount,
    easeFactor: newEaseFactor,
    lastDifficulty: difficulty,
  };
}

// Storage operations
export function loadCards(): Map<string, ReviewCard> {
  if (typeof window === 'undefined') return new Map();

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEW_CARDS);
    if (!stored) return new Map();

    const parsed = JSON.parse(stored);
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

export function saveCards(cards: Map<string, ReviewCard>): void {
  if (typeof window === 'undefined') return;

  const obj = Object.fromEntries(cards);
  localStorage.setItem(STORAGE_KEYS.REVIEW_CARDS, JSON.stringify(obj));
}

export function loadSessions(): ReviewSession[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEW_SESSIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ReviewSession[]): void {
  if (typeof window === 'undefined') return;

  // Keep only last 90 days of sessions
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const filtered = sessions.filter(s => parseDate(s.date) >= cutoff);

  localStorage.setItem(STORAGE_KEYS.REVIEW_SESSIONS, JSON.stringify(filtered));
}

export function loadSettings(): ReviewSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEW_SETTINGS);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ReviewSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.REVIEW_SETTINGS, JSON.stringify(settings));
}

// Get cards due for review today
export function getDueCards(
  cards: Map<string, ReviewCard>,
  settings: ReviewSettings
): ReviewCard[] {
  const today = getToday();
  const dueCards: ReviewCard[] = [];

  cards.forEach(card => {
    const daysUntil = getDaysUntil(card.nextReviewDate);
    if (daysUntil <= 0) {
      dueCards.push(card);
    }
  });

  // Sort by priority: Box 1 first, then by overdue days
  dueCards.sort((a, b) => {
    if (a.box !== b.box) return a.box - b.box;
    return getDaysUntil(a.nextReviewDate) - getDaysUntil(b.nextReviewDate);
  });

  // Limit to daily review count
  return dueCards.slice(0, settings.dailyReviewCards);
}

// Get new cards that haven't been reviewed yet
export function getNewCards(
  allPhrases: Phrase[],
  cards: Map<string, ReviewCard>,
  settings: ReviewSettings
): Phrase[] {
  const newPhrases = allPhrases.filter(
    phrase => !cards.has(getPhraseKey(phrase))
  );

  // Limit to daily new cards count
  return newPhrases.slice(0, settings.dailyNewCards);
}

// Calculate progress metrics
export function calculateProgress(
  allPhrases: Phrase[],
  cards: Map<string, ReviewCard>,
  sessions: ReviewSession[]
): ReviewProgress {
  const today = getToday();
  const cardsByBox: Record<LeitnerBox, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalReviews = 0;
  let totalCorrect = 0;
  let totalEaseFactor = 0;
  let dueToday = 0;

  cards.forEach(card => {
    cardsByBox[card.box]++;
    totalReviews += card.reviewCount;
    totalCorrect += card.reviewCount - card.wrongCount;
    totalEaseFactor += card.easeFactor;

    if (getDaysUntil(card.nextReviewDate) <= 0) {
      dueToday++;
    }
  });

  // Calculate streak
  let streakDays = 0;
  if (sessions.length > 0) {
    const sortedSessions = [...sessions].sort(
      (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
    );

    let checkDate = new Date();
    for (const session of sortedSessions) {
      const sessionDate = parseDate(session.date);
      const daysDiff = Math.floor(
        (checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff <= 1) {
        streakDays++;
        checkDate = sessionDate;
      } else {
        break;
      }
    }
  }

  const cardsCount = cards.size;

  return {
    totalCards: allPhrases.length,
    cardsByBox,
    dueToday,
    masteredCount: cardsByBox[5],
    learningCount: cardsByBox[1] + cardsByBox[2],
    reviewingCount: cardsByBox[3] + cardsByBox[4],
    averageEaseFactor: cardsCount > 0 ? totalEaseFactor / cardsCount : 2.5,
    totalReviews,
    accuracy: totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0,
    streakDays,
    lastReviewDate: sessions.length > 0 ? sessions[sessions.length - 1].date : null,
  };
}

// Add a new session
export function addSession(
  sessions: ReviewSession[],
  cardsReviewed: number,
  correctCount: number,
  wrongCount: number,
  averageTime: number,
  newCardsLearned: number,
  cardsGraduated: number
): ReviewSession[] {
  const today = getToday();

  // Check if we already have a session for today
  const existingIndex = sessions.findIndex(s => s.date === today);

  const newSession: ReviewSession = {
    date: today,
    cardsReviewed,
    correctCount,
    wrongCount,
    averageTime,
    newCardsLearned,
    cardsGraduated,
  };

  if (existingIndex >= 0) {
    // Merge with existing session
    const existing = sessions[existingIndex];
    newSession.cardsReviewed += existing.cardsReviewed;
    newSession.correctCount += existing.correctCount;
    newSession.wrongCount += existing.wrongCount;
    newSession.averageTime = (newSession.averageTime + existing.averageTime) / 2;
    newSession.newCardsLearned += existing.newCardsLearned;
    newSession.cardsGraduated += existing.cardsGraduated;
    sessions[existingIndex] = newSession;
  } else {
    sessions.push(newSession);
  }

  return sessions;
}

// Shuffle array (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Normalize text for comparison (typing mode)
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"]/g, '')
    .replace(/\s+/g, ' ');
}

// Check if typed answer is correct (with fuzzy matching)
export function checkTypedAnswer(
  userInput: string,
  correctAnswer: string,
  threshold: number = 0.8
): { isCorrect: boolean; similarity: number } {
  const normalizedInput = normalizeText(userInput);
  const normalizedAnswer = normalizeText(correctAnswer);

  // Exact match
  if (normalizedInput === normalizedAnswer) {
    return { isCorrect: true, similarity: 1 };
  }

  // Calculate Levenshtein distance for fuzzy matching
  const similarity = calculateSimilarity(normalizedInput, normalizedAnswer);

  return {
    isCorrect: similarity >= threshold,
    similarity,
  };
}

// Levenshtein distance-based similarity
function calculateSimilarity(a: string, b: string): number {
  if (a.length === 0) return b.length === 0 ? 1 : 0;
  if (b.length === 0) return 0;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const distance = matrix[b.length][a.length];
  const maxLength = Math.max(a.length, b.length);
  return 1 - distance / maxLength;
}

// Generate multiple choice options
export function generateChoices(
  correctPhrase: Phrase,
  allPhrases: Phrase[],
  count: number = 4
): string[] {
  // Filter out the correct answer and get candidates from same category if possible
  const candidates = allPhrases
    .filter(p => p.natural !== correctPhrase.natural)
    .sort(() => Math.random() - 0.5);

  // Prioritize same category for harder choices
  const sameCategory = candidates.filter(p => p.category === correctPhrase.category);
  const differentCategory = candidates.filter(p => p.category !== correctPhrase.category);

  // Mix 1-2 same category with others
  const distractors: string[] = [];
  const sameCategoryCount = Math.min(Math.floor(count / 2), sameCategory.length);

  for (let i = 0; i < sameCategoryCount && distractors.length < count - 1; i++) {
    distractors.push(sameCategory[i].natural);
  }

  for (let i = 0; i < differentCategory.length && distractors.length < count - 1; i++) {
    distractors.push(differentCategory[i].natural);
  }

  // Add correct answer and shuffle
  const choices = [...distractors.slice(0, count - 1), correctPhrase.natural];
  return shuffleArray(choices);
}

// Format interval for display
export function formatInterval(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  return `${Math.round(days / 30)} months`;
}

// Get box label
export function getBoxLabel(box: LeitnerBox): string {
  const labels: Record<LeitnerBox, string> = {
    1: 'Learning',
    2: 'Reviewing',
    3: 'Familiar',
    4: 'Known',
    5: 'Mastered',
  };
  return labels[box];
}

// Get box color
export function getBoxColor(box: LeitnerBox): string {
  const colors: Record<LeitnerBox, string> = {
    1: '#ef4444', // Red
    2: '#f97316', // Orange
    3: '#eab308', // Yellow
    4: '#22c55e', // Green
    5: '#10b981', // Emerald
  };
  return colors[box];
}
