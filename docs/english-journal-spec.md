# English Journal System - Master Spec

## Overview

The English journal system (`/english/journal/[id]`) converts Japanese journal entries into English listening content. Each entry's `englishSummary` is divided into sections/paragraphs, with each paragraph becoming a TTS "track" for audio playback.

The goal: make English content that sounds like someone **talking**, not someone **writing**.

---

## A. Content Rules (Absolute)

### Podcast-style, not essay-style

All `englishSummary` paragraphs must sound like the author TALKING to a friend over coffee. Not reading an essay. Not giving a lecture. Not writing a blog post.

**The philosophical depth stays. The DELIVERY becomes spoken.**

### Spoken English Rules

Apply the same rules from `docs/word-review-spec.md`:

- **Contractions always**: I'm, don't, can't, wouldn't, gonna, wanna, gotta, kinda, sorta
- **Fillers naturally**: "like", "honestly", "I mean", "you know", "right?"
- **Fragment sentences OK**: "Such a pain." "No way." "Totally worth it."
- **Casual connectors**: "so", "and then", "but like", "anyway", "OK so here's the thing"
- **Real reactions**: "Dude," "Oh my god," "Wait, what?" "No joke,"
- **g-dropping**: "thinkin'", "runnin'", "workin'", "nothin'"
- **First-person**: "I", "we", direct address to listener ("you know?", "right?")
- **False starts OK**: "I was gonna-- well, actually I ended up just..."
- **Casual pronunciation**: "'cause" (because), "'em" (them), "lemme", "gimme"

### What to AVOID

- Formal/academic sentence structure
- Literary description ("Hope might be the cruelest trap of all")
- Passive voice ("It was discovered that...")
- Essay transitions ("Furthermore," "In conclusion," "It is worth noting that")
- Textbook-sounding English ("One might argue that...")
- Sentences nobody would actually say out loud

### Check: Would you actually say this to a friend?

If no, rewrite it until you would.

---

## B. Before/After Examples

### Example 1: Philosophical content

**BEFORE (essay - bad)**:
> "Hope might be the cruelest trap of all. Not despair. Despair at least has the honesty of having given up. Hope keeps you running on a treadmill, chasing a tomorrow that never comes."

**AFTER (podcast - good)**:
> "OK so here's the thing about hope. And I know this sounds backwards, but hear me out. Hope might actually be the cruelest trap. Like, not despair -- despair's at least honest, right? It's like, 'yeah I give up.' But hope? Hope keeps you runnin' on this treadmill, chasin' some tomorrow that never freakin' comes."

### Example 2: Technical explanation

**BEFORE (essay - bad)**:
> "The waveform and spectrogram displays appeared functional, but upon investigation, the SpeechSynthesis API does not return audio streams. Therefore, all visualized data was randomly generated noise with no connection to actual speech patterns."

**AFTER (podcast - good)**:
> "So get this -- the waveforms and spectrograms looked super legit, right? Like, really professional. But here's the thing. The browser's SpeechSynthesis API doesn't actually give you audio streams. So all that fancy visualization? Literally just random noise. The whole thing was fake. I was comparing my voice against... nothin'."

### Example 3: Data-heavy content

**BEFORE (essay - bad)**:
> "Duolingo serves 500 million users at an annual cost of 22,800 yen for the Max plan, while PROGRIT charges 687,500 yen for three months of coaching without conversation practice."

**AFTER (podcast - good)**:
> "Duolingo's got like 500 million users, right? And their Max plan is about 22,800 yen a year. Not bad. But then there's PROGRIT -- and I'm not kiddin' -- 687,500 yen for three months. And you know what you get? No conversation lessons. Just coaching. That's it. 680,000 yen for someone to tell you to study harder."

### Example 4: Emotional/reflective content

**BEFORE (essay - bad)**:
> "The realization that attachment and intimacy differ fundamentally in their structural composition -- specifically, the presence or absence of ego as a binding agent -- represents a significant philosophical insight."

**AFTER (podcast - good)**:
> "So I finally got it. Like, the difference between attachment and intimacy. And it's so simple once you see it. Attachment? There's always a 'me' in the middle. I'm holdin' on 'cause I'm scared of losin' something. But intimacy? There's no 'me' at all. You're just... there. With the thing. No glue needed."

---

## C. When to Create English Versions

### Rule: ALL entries get `englishSummary`

This is a core feature. No exceptions. Every journal entry should have an English listening version.

### Priority order for quality review:
1. Entries about English learning topics (meta-relevant)
2. Featured entries (`featured: true`)
3. Philosophical/reflective entries (high engagement)
4. Technical entries
5. Short/casual entries

### Rule: ALL entries get `conversationData`

Every journal entry MUST have `conversationData` (male/female dialogue for Memoria page). No exceptions.

- **Male** = the author's voice: casual, philosophical, data-heavy, occasional dark humor
- **Female** = thoughtful listener: pushes back, asks good questions, calls out BS
- Even short/personal entries can be turned into natural dialogue
- Even stream-of-consciousness entries benefit from a conversation partner reacting

---

## D. EnglishSummary Format Guidelines

### TypeScript Structure

```typescript
englishSummary: {
    title: string,              // Casual, punchy English title
    readTime: number,           // Minutes (match Japanese readTime roughly)
    sections: [
        {
            heading: string,    // Casual section heading
            paragraphs: string[], // 1-3 sentences each (TTS tracks)
            image?: string      // Optional
        }
    ]
}
```

### Sections
- **5-15 sections** per entry, roughly matching the Japanese chapter structure
- Don't need to be 1:1 with Japanese sections -- combine or split as needed for natural flow

### Paragraphs (TTS Tracks)
- **1-3 sentences each** -- short for TTS playback
- Each paragraph = one "track" the listener hears
- Avoid walls of text -- break up long thoughts
- End paragraphs on a punch or a pause point

### Section Headings
- Casual and memorable, not academic
- Good: "The Fake Waveform Thing", "Wait, It Gets Worse", "So Here's What Happened"
- Bad: "Technical Analysis of Audio Visualization", "Philosophical Implications", "Conclusion"

### Title
- Keep it conversational
- Can use em-dash for subtitle: "The Day I Broke Everything -- And Why That Was Fine"
- Should make someone want to listen

---

## E. ConversationData Guidelines

### CRITICAL: Read `docs/memoria-speech-spec.md` FIRST

The surface rules below (contractions, fillers, g-dropping) are NECESSARY but NOT SUFFICIENT.
All conversationData MUST also pass the 7 structural rules in `docs/memoria-speech-spec.md`:

1. **Information density**: 60%+ function words per utterance
2. **Cognitive markers**: um/uh/false starts every 5-8 lines
3. **Clause chains**: 30%+ of utterances with 4+ adhesive connectors
4. **g-dropping variability**: 70-80%, not 100%
5. **Turn length variation**: 20%+ short (1-5 words), 20%+ long (50+ words)
6. **Repetition**: Key points stated 2-3 times with variation
7. **Cross-turn building**: 20%+ turns reference previous speaker

If dialogue reads like a Q&A interview with decorated grammar, it FAILS. Rewrite.

### Voice Distinction
- **Male** = the author's voice: casual, philosophical, data-heavy, occasional dark humor
  - Longer turns with more clause chains (he's telling the story)
  - More cognitive markers when tackling complex ideas
- **Female** = thoughtful listener: pushes back, asks good questions, calls out BS
  - More short turns: "Wait, what?", "No way.", "That's actually smart."
  - Echoes and rephrases the male's points before adding her own
  - Should NOT just ask questions -- she reacts, challenges, extends

### Apply Spoken English Rules
Same casual English rules as englishSummary:
- Contractions, fillers, g-dropping (variable, not uniform)
- Fragment sentences, real reactions
- Each line should sound like actual dialogue, not scripted

### Japanese Side
- Should match the English conversation in meaning (not literal translation)
- Use natural Japanese, not translation-ese
- Match the tone (if English is playful, Japanese should be too)

---

## F. Generation Workflow

### Step-by-step:

1. **Read the Japanese journal entry** (`conversation` field)
   - Identify the key ideas, story beats, and emotional arc
   - Note any data points, quotes, or technical details to preserve

2. **Identify the voice**
   - What's the mood? Frustrated? Amused? Philosophical? All three?
   - What would this person sound like telling this story at a bar?

3. **Draft sections**
   - Map Japanese chapters to English sections
   - Write headings that are casual and catchy
   - Don't translate -- re-express. "How would I TELL this story?"

4. **Write paragraphs (TTS tracks)**
   - Keep each paragraph short (1-3 sentences)
   - Start with hooks: "OK so...", "Here's the thing...", "You know what's funny?"
   - End with punches: landing a joke, dropping a data point, or a beat of silence

5. **Apply spoken English rules**
   - Add contractions, fillers, g-dropping
   - Break up formal sentences into fragments
   - Add reactions and direct address ("right?", "you know?")

6. **Quality check** (see Section G)

7. **Set metadata**
   - `title`: casual English title
   - `readTime`: estimate based on section count (roughly 1 min per 2-3 sections)

---

## G. Quality Checklist

Before marking an `englishSummary` as done, check:

- [ ] Does each paragraph sound like someone TALKING?
- [ ] Would you actually say this sentence to a friend?
- [ ] Are there enough contractions to sound natural? (I'm, don't, can't, etc.)
- [ ] Are there fillers where a real speaker would pause? (like, honestly, you know)
- [ ] Is the section heading casual, not academic?
- [ ] Does the content preserve the original's depth and data?
- [ ] Are paragraphs short enough for TTS tracks? (1-3 sentences max)
- [ ] Is the title something that makes you want to listen?
- [ ] Does the overall piece have a narrative arc (not just disconnected thoughts)?
- [ ] Would a native English speaker find the phrasing natural?

### Red Flags (rewrite if you see these):
- "Furthermore," "Moreover," "In conclusion"
- Passive voice ("It was discovered that...")
- No contractions in a 3+ sentence paragraph
- Paragraphs longer than 4 sentences
- Headings with colons ("Analysis: The Problem of X")
- Zero fillers or reactions in an entire section
- Sentences that read like Wikipedia

### ConversationData Red Flags (see `docs/memoria-speech-spec.md`):
- 8+ consecutive dialogue lines with zero "um", "uh", or false starts
- Every turn is 20-40 words (uniform length = written, not spoken)
- Every -ing word has the g dropped (should be 70-80%)
- Speaker states key opinion once and moves on (should restate 2-3x)
- Both speakers have equal total word counts (host should be shorter)
- Dialogue reads like a Q&A interview, not overlapping conversation

---

## H. File Locations

| File | Purpose |
|------|---------|
| `docs/english-journal-spec.md` | This file (master spec) |
| `src/data/journal/types.ts` | TypeScript types (EnglishSummary, SummarySection) |
| `src/data/journal/2026/*.ts` | Individual journal entries |
| `src/data/journal/2026/01-january.ts` | January month file (imports/exports) |
| `src/data/journal/2026/02-february.ts` | February month file (imports/exports) |
| `src/app/english/journal/[id]/page.tsx` | English journal player page |

---

## I. Progress Tracker

### Entries without `englishSummary` (to be completed):

All entries now have `englishSummary`. The following 12 were added on 2026-02-07 (podcast-style):

| ID | File | Title | Status |
|----|------|-------|--------|
| 065 | tts-analysis-entry.ts | English System Revamp | Done |
| 066 | belx-pickles-entry.ts | Belx Pickles Science | Done |
| 067 | ai-english-learning-entry.ts | AI English + Adyashanti | Done |
| 068 | meta-english-practice-entry.ts | Meta English Practice | Done |
| 071 | critical-thinking-hiroyuki-entry.ts | Ego Mirror / Hiroyuki | Done |
| 092 | just-notice-entry.ts | Just Notice / Ouroboros | Done |
| 093 | lucid-dream-youtubers-entry.ts | Lucid Dream YouTubers | Done |
| 095 | intimacy-attachment-entry.ts | Intimacy vs Attachment | Done |
| 096 | margin-philosophy-entry.ts | Margin Philosophy | Done |
| 097 | boiled-in-evil-entry.ts | Boiled in Evil | Done |
| 098 | wbc-insurance-chaos-entry.ts | WBC Insurance Chaos | Done |
| 999 | puppy-test-entry.ts | Puppy Test Entry | Done |

Note: `deep-critique-remainder.ts` is a content fragment (not a standalone entry), so it does not need its own `englishSummary`.

### Existing 29 entries:

Current englishSummary content is essay-style. Upgrading to podcast-style is a separate future task.
