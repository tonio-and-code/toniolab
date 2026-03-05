/**
 * 2026年3月のジャーナルエントリ
 */

import { JournalEntry } from '../types';
import { gameManualEntry } from './game-manual-entry';
import { vercelSurrenderEntry } from './vercel-surrender-entry';
import { convenienceStorePanicEntry } from './convenience-store-panic-entry';
import { ikasamaBlackjackEntry } from './ikasama-blackjack-entry';

export const march2026Entries: JournalEntry[] = [
    gameManualEntry,
    vercelSurrenderEntry,
    convenienceStorePanicEntry,
    ikasamaBlackjackEntry,
];
