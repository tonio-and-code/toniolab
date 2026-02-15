/**
 * 2026年2月のジャーナルエントリ
 */

import { JournalEntry } from '../types';
import { electionRitualEntry } from './election-ritual-entry';
import { mlbEnglishPhilosophyEntry } from './mlb-english-philosophy-entry';
import { languageLoveLetterEntry } from './language-love-letter-entry';
import { worldMapDebuggingEntry } from './world-map-debugging-entry';
import { marginPhilosophyEntry } from './margin-philosophy-entry';
import { intimacyAttachmentEntry } from './intimacy-attachment-entry';
import { boiledInEvilEntry } from './boiled-in-evil-entry';
import { wbcInsuranceChaosEntry } from './wbc-insurance-chaos-entry';
import { curryWarsEntry } from './curry-wars-entry';
import { aiElectionGuideEntry } from './ai-election-guide-entry';
import theSessionEntry from './the-session-entry';
// Individual entries are merged into theSessionEntry but imported here for concatenation
import whatAreWeDoingEntry from './what-are-we-doing-entry';
import professionalismEntry from './professionalism-entry';
import internalServerErrorEntry from './internal-server-error-entry';
import highSchoolEntry from './high-school-level-entry';
import middleSchoolEntry from './middle-school-level-entry';
import { electionDebateEntry } from './election-debate-entry';
import elementaryLevelEntry from './elementary-level-entry';
import { sufferingRightHereEntry } from './suffering-right-here-entry';
import { dodgersSpeechAnalysisEntry } from './dodgers-speech-analysis-entry';
import { speakingMethodEntry } from './speaking-method-entry';
import { writingDeflationEntry } from './writing-deflation-entry';
import { quonChocolateEntry } from './quon-chocolate-entry';
import { miguelRojasEnglishEntry } from './miguel-rojas-english-entry';
import { voiceSkeletonEntry } from './voice-skeleton-entry';
import { adyashantiEmptyNicheEntry } from './adyashanti-empty-niche-entry';
import { awarenessOfAwarenessEntry } from './awareness-of-awareness-entry';
import { noteLaunchEntry } from './note-launch-entry';

export const february2026Entries: JournalEntry[] = [
    noteLaunchEntry,
    awarenessOfAwarenessEntry,
    adyashantiEmptyNicheEntry,
    voiceSkeletonEntry,
    quonChocolateEntry,
    writingDeflationEntry,
    miguelRojasEnglishEntry,
    speakingMethodEntry,
    dodgersSpeechAnalysisEntry,
    sufferingRightHereEntry,
    electionDebateEntry,
    theSessionEntry,
    // whatAreWeDoingEntry,
    // professionalismEntry,
    // internalServerErrorEntry,
    // highSchoolEntry,
    // middleSchoolEntry,
    // elementaryLevelEntry,
    electionRitualEntry,
    aiElectionGuideEntry,
    curryWarsEntry,
    mlbEnglishPhilosophyEntry,
    languageLoveLetterEntry,
    worldMapDebuggingEntry,
    wbcInsuranceChaosEntry,
    marginPhilosophyEntry,
    intimacyAttachmentEntry,
    boiledInEvilEntry
];
