
import fs from 'fs';
import path from 'path';

const journalDir = path.join(process.cwd(), 'src/data/journal/2026');

async function main() {
    const files = fs.readdirSync(journalDir).filter(f => f.endsWith('.ts') && f !== '01-january.ts');

    console.log('Checking for text-heavy entries without images...');

    for (const file of files) {
        const content = fs.readFileSync(path.join(journalDir, file), 'utf-8');

        // Check if it has a conversation or englishSummary section which usually indicates a post
        if (!content.includes('conversation:') && !content.includes('englishSummary:')) {
            continue;
        }

        // Check for markdown images
        const hasImages = /!\[.*?\]\(.*?\)/.test(content);

        // approximate length check (very rough)
        const length = content.length;

        if (!hasImages && length > 5000) {
            console.log(`- [ ] ${file} (${Math.round(length / 1024)}KB) - No images found`);

            // Extract title if possible
            const titleMatch = content.match(/title:\s*['"`](.*?)['"`]/);
            if (titleMatch) {
                console.log(`      Title: ${titleMatch[1]}`);
            }
        }
    }
}

main();
