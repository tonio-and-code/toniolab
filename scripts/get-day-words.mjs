// Get words for a specific day
const DAY = 36; // Feb 5 = dayIndex 35 (0-indexed), Day 036 in scenario list
const START = (DAY - 1) * 50; // 1750
const END = START + 50; // 1800

const res = await fetch('http://localhost:3001/api/user-phrases');
const data = await res.json();
const phrases = data.phrases || [];

phrases.sort((a, b) => {
    const d = new Date(a.created_at) - new Date(b.created_at);
    if (d !== 0) return d;
    return a.id.localeCompare(b.id);
});

const dayWords = phrases.slice(START, END);
console.log(`Day ${DAY} words (${dayWords.length}):`);
dayWords.forEach((w, i) => {
    console.log(JSON.stringify({ i: i + 1, id: w.id, phrase: w.phrase, type: w.type, meaning: w.meaning }));
});
