// English Phrase Review System Types
// Based on Spaced Repetition System (SRS) research

export interface Phrase {
  original: string;
  natural: string;
  category: string;
  date: string;
}

// Leitner Box System (1-5 boxes with increasing intervals)
export type LeitnerBox = 1 | 2 | 3 | 4 | 5;

// SM-2 Algorithm intervals in days
export const LEITNER_INTERVALS: Record<LeitnerBox, number> = {
  1: 1,    // Daily
  2: 3,    // Every 3 days
  3: 7,    // Weekly
  4: 14,   // Bi-weekly
  5: 30,   // Monthly
};

// Review difficulty ratings
export type ReviewDifficulty = 'again' | 'hard' | 'good' | 'easy';

// Card state in the SRS system
export interface ReviewCard {
  phraseKey: string;         // Unique key (phrase.natural)
  box: LeitnerBox;           // Current Leitner box (1-5)
  nextReviewDate: string;    // ISO date string
  lastReviewDate: string;    // ISO date string
  reviewCount: number;       // Total times reviewed
  correctStreak: number;     // Consecutive correct answers
  wrongCount: number;        // Total wrong answers
  easeFactor: number;        // SM-2 ease factor (default 2.5)
  lastDifficulty?: ReviewDifficulty;
}

// Session statistics
export interface ReviewSession {
  date: string;
  cardsReviewed: number;
  correctCount: number;
  wrongCount: number;
  averageTime: number;       // Average time per card in seconds
  newCardsLearned: number;
  cardsGraduated: number;    // Cards that moved to Box 5
}

// Quiz modes based on research findings
export type QuizMode =
  | 'flashcard'      // Recognition - flip card, self-rate (lowest difficulty)
  | 'choice'         // Multiple choice - select correct answer (medium)
  | 'typing';        // Production - type the answer (highest difficulty, best retention)

// Quiz state
export interface QuizState {
  mode: QuizMode;
  currentCardIndex: number;
  cards: ReviewCard[];
  phrases: Map<string, Phrase>;
  sessionStart: number;
  answers: Array<{
    phraseKey: string;
    correct: boolean;
    timeTaken: number;
    difficulty?: ReviewDifficulty;
  }>;
  isFlipped: boolean;        // For flashcard mode
  userInput: string;         // For typing mode
  selectedChoice?: number;   // For choice mode
}

// Progress metrics
export interface ReviewProgress {
  totalCards: number;
  cardsByBox: Record<LeitnerBox, number>;
  dueToday: number;
  masteredCount: number;     // Cards in Box 5
  learningCount: number;     // Cards in Box 1-2
  reviewingCount: number;    // Cards in Box 3-4
  averageEaseFactor: number;
  totalReviews: number;
  accuracy: number;          // Percentage
  streakDays: number;
  lastReviewDate: string | null;
}

// Storage keys
export const STORAGE_KEYS = {
  REVIEW_CARDS: 'english_review_cards',
  REVIEW_SESSIONS: 'english_review_sessions',
  REVIEW_SETTINGS: 'english_review_settings',
} as const;

// Default settings
export interface ReviewSettings {
  dailyNewCards: number;     // Max new cards per day
  dailyReviewCards: number;  // Max review cards per day
  preferredMode: QuizMode;
  autoAdvance: boolean;      // Auto-advance after answer
  showHint: boolean;         // Show category as hint
  playAudio: boolean;        // Play TTS on flip
}

export const DEFAULT_SETTINGS: ReviewSettings = {
  dailyNewCards: 10,
  dailyReviewCards: 50,
  preferredMode: 'flashcard',
  autoAdvance: false,
  showHint: true,
  playAudio: true,
};
