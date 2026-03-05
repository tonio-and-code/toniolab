import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { phrase } = await request.json();

        if (!phrase) {
            return NextResponse.json({ error: 'No phrase provided' }, { status: 400 });
        }

        const { YoutubeTranscript } = await import('youtube-transcript-plus');
        const ytSearch = await import('youtube-search-api');

        // Search YouTube for videos likely to contain the phrase
        // Search for English content related to the phrase
        const searchQueries = [
            `"${phrase}" english speaking`,
            `"${phrase}" conversation`,
            `${phrase} meaning english`,
        ];

        const allVideoIds: string[] = [];

        // Search with multiple queries to find videos
        for (const query of searchQueries) {
            try {
                const searchResults = await ytSearch.GetListByKeyword(query, false, 5);
                if (searchResults?.items) {
                    for (const item of searchResults.items) {
                        if (item.id && !allVideoIds.includes(item.id)) {
                            allVideoIds.push(item.id);
                        }
                    }
                }
            } catch (searchErr) {
                console.log('Search error for query:', query, searchErr);
            }

            // Limit total videos to check
            if (allVideoIds.length >= 10) break;
        }

        console.log(`Found ${allVideoIds.length} videos to check for "${phrase}"`);

        const results: {
            videoId: string;
            title: string;
            matches: { text: string; timestamp: number; duration: number }[];
        }[] = [];

        // Check each video's transcript
        const phraseLC = phrase.toLowerCase();

        for (const videoId of allVideoIds.slice(0, 10)) {
            try {
                const transcript = await YoutubeTranscript.fetchTranscript(videoId);

                if (!transcript || transcript.length === 0) continue;

                const matches: { text: string; timestamp: number; duration: number }[] = [];

                for (let i = 0; i < transcript.length; i++) {
                    const segment = transcript[i];
                    const text = segment.text?.toLowerCase() || '';

                    // Check single segment
                    if (text.includes(phraseLC)) {
                        matches.push({
                            text: segment.text,
                            timestamp: Math.floor((segment.offset || 0) / 1000),
                            duration: (segment.duration || 2000) / 1000,
                        });
                    }

                    // Check combined with next segment (phrases might span)
                    if (i < transcript.length - 1) {
                        const nextText = transcript[i + 1].text?.toLowerCase() || '';
                        const combined = text + ' ' + nextText;

                        if (combined.includes(phraseLC) && !text.includes(phraseLC)) {
                            matches.push({
                                text: segment.text + ' ' + transcript[i + 1].text,
                                timestamp: Math.floor((segment.offset || 0) / 1000),
                                duration: ((segment.duration || 2000) + (transcript[i + 1].duration || 2000)) / 1000,
                            });
                        }
                    }
                }

                if (matches.length > 0) {
                    results.push({
                        videoId,
                        title: `Video ${videoId.slice(0, 6)}`,
                        matches: matches.slice(0, 5), // Max 5 matches per video
                    });

                    console.log(`Found ${matches.length} matches in ${videoId}`);
                }

                // Stop if we have enough results
                if (results.length >= 5) break;

            } catch (transcriptErr) {
                // Skip videos without transcripts
                console.log(`No transcript for ${videoId}`);
            }
        }

        console.log(`Total: ${results.length} videos with matches for "${phrase}"`);

        return NextResponse.json({
            phrase,
            results,
            totalMatches: results.reduce((sum, r) => sum + r.matches.length, 0),
            videosChecked: allVideoIds.length,
        });

    } catch (error: unknown) {
        console.error('Phrase video search error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Search failed', message }, { status: 500 });
    }
}
