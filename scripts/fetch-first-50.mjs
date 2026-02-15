// Fetch first 50 words (sorted by created_at/id) to see what we're working with
const res = await fetch('http://localhost:3001/api/user-phrases');
const data = await res.json();
if (!data.success) { console.error('API error'); process.exit(1); }

const sorted = data.phrases.sort((a, b) => {
    const dateCompare = (a.created_at || '').localeCompare(b.created_at || '');
    if (dateCompare !== 0) return dateCompare;
    return a.id.localeCompare(b.id);
});

console.log(`Total words: ${sorted.length}`);
console.log(`\n--- First 50 words (Day 1: 2025-01-01) ---\n`);

const first50 = sorted.slice(0, 50);
first50.forEach((w, i) => {
    console.log(`${String(i+1).padStart(2)}. [${w.id}] ${w.phrase} (${w.type}) - ${w.meaning}`);
});
