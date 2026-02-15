
import { journalEntries } from '../src/data/journal/index';
import { february2026Entries } from '../src/data/journal/2026/02-february';

console.log('Checking February entries directly...');
console.log('Feb Entries:', february2026Entries);

console.log('Checking journal entries...');
const ids = journalEntries.map(e => e.id);
console.log('Total entries:', ids.length);
console.log('Latest 5 IDs:', ids.slice(0, 5));

const targetId = '095';
if (ids.includes(targetId)) {
    console.log(`SUCCESS: ID ${targetId} found!`);
} else {
    console.error(`ERROR: ID ${targetId} NOT found.`);
}
