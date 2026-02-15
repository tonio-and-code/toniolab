const res = await fetch('http://localhost:3001/api/user-phrases');
const j = await res.json();
const phrases = j.phrases || [];
const sorted = [...phrases].sort((a, b) => {
    const dc = (a.created_at || '').localeCompare(b.created_at || '');
    if (dc !== 0) return dc;
    return a.id.localeCompare(b.id);
});
console.log('Total:', sorted.length);
const slice = sorted.slice(350, 400);
slice.forEach((w, i) => {
    console.log(JSON.stringify({ idx: 350 + i, id: w.id, phrase: w.phrase, meaning: w.meaning || '', type: w.type }));
});
