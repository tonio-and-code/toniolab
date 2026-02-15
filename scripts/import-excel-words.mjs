// Import English words from Excel 2021 tab into user_phrases (Cloudflare D1)
// Usage: node scripts/import-excel-words.mjs

import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const { nanoid } = require('nanoid');

config({ path: '.env.local' });

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '7efac1047fba804c1b7ea5a10868dbfc';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = 'f4801cde-0f1d-4bc9-beec-5d8709813798';

if (!CLOUDFLARE_API_TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN not set in .env.local');
    process.exit(1);
}

const API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;

// Excel serial date -> YYYY-MM-DD
function excelDateToISO(serial) {
    if (!serial || typeof serial !== 'number') return null;
    const date = new Date((serial - 25569) * 86400000);
    return date.toISOString().split('T')[0];
}

async function executeSQL(sql, params = []) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`D1 API error ${res.status}: ${text}`);
    }

    const data = await res.json();
    if (!data.success) {
        throw new Error(`D1 query failed: ${data.errors?.map(e => e.message).join(', ')}`);
    }
    return data.result[0];
}

async function main() {
    console.log('Reading Excel file...');
    const wb = XLSX.readFile('C:/Users/thaat/Desktop/english.xlsx');
    const ws = wb.Sheets['2021'];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // Parse rows: [date?, phrase, meaning, ...]
    const words = [];
    const seen = new Set();

    for (const row of data) {
        if (!row || !row[1]) continue;

        const phrase = String(row[1]).trim();
        if (!phrase) continue;

        const key = phrase.toLowerCase();
        if (seen.has(key)) continue; // skip duplicates
        seen.add(key);

        const dateVal = excelDateToISO(row[0]);
        const meaning = row[2] ? String(row[2]).trim() : '';

        words.push({
            id: nanoid(8),
            phrase,
            type: phrase.includes(' ') ? 'expression' : 'word',
            meaning,
            source: 'Excel: 2021',
            created_at: dateVal ? `${dateVal}T12:00:00.000Z` : '2021-01-01T12:00:00.000Z',
        });
    }

    console.log(`Parsed ${words.length} unique words. Starting import...`);

    // Batch insert: 50 per batch (D1 has query limits)
    const BATCH_SIZE = 50;
    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < words.length; i += BATCH_SIZE) {
        const batch = words.slice(i, i + BATCH_SIZE);

        for (const w of batch) {
            try {
                await executeSQL(
                    `INSERT INTO user_phrases (id, phrase, type, meaning, note, example, source, mastery_level, times_used, created_at, last_reviewed_at, video_id, video_timestamp, video_text)
                     VALUES (?, ?, ?, ?, NULL, NULL, ?, 0, 0, ?, NULL, NULL, NULL, NULL)
                     ON CONFLICT(phrase) DO NOTHING`,
                    [w.id, w.phrase, w.type, w.meaning, w.source, w.created_at]
                );
                imported++;
            } catch (err) {
                // Rate limit or transient error - wait and retry once
                if (err.message.includes('429') || err.message.includes('rate')) {
                    await new Promise(r => setTimeout(r, 2000));
                    try {
                        await executeSQL(
                            `INSERT INTO user_phrases (id, phrase, type, meaning, note, example, source, mastery_level, times_used, created_at, last_reviewed_at, video_id, video_timestamp, video_text)
                             VALUES (?, ?, ?, ?, NULL, NULL, ?, 0, 0, ?, NULL, NULL, NULL, NULL)
                             ON CONFLICT(phrase) DO NOTHING`,
                            [w.id, w.phrase, w.type, w.meaning, w.source, w.created_at]
                        );
                        imported++;
                    } catch (retryErr) {
                        console.error(`  Failed (retry): "${w.phrase}" - ${retryErr.message}`);
                        errors++;
                    }
                } else {
                    console.error(`  Failed: "${w.phrase}" - ${err.message}`);
                    errors++;
                }
            }
        }

        const progress = Math.min(i + BATCH_SIZE, words.length);
        if (progress % 500 === 0 || progress === words.length) {
            console.log(`  Progress: ${progress}/${words.length} (imported: ${imported}, errors: ${errors})`);
        }

        // Small delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < words.length) {
            await new Promise(r => setTimeout(r, 100));
        }
    }

    console.log('\n=== Import Complete ===');
    console.log(`Total parsed: ${words.length}`);
    console.log(`Imported: ${imported}`);
    console.log(`Errors: ${errors}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
