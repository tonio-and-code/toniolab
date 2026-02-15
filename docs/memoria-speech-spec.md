# Memoria Speech Spec -- Native English Deep Structure

This spec governs ALL Memoria dialogue: journal conversationData, scenario Memoria, and any future series.
Referenced from `english-journal-spec.md` and `word-review-spec.md`.

The surface rules (contractions, g-dropping, fillers) are necessary but NOT sufficient.
This spec defines the STRUCTURAL requirements that separate real speech from decorated writing.

---

## The Core Problem

AI-generated "casual English" typically fails at 6 structural levels even when surface features are applied correctly. Memorizing AI dialogue that violates these structures teaches wrong rhythm.

Based on analysis in Journals #110 (native speech structure), #111 (6-step method), #112 (Rojas non-native analysis).

---

## Rule 1: Information Density (70% Waste)

Native speech is 70% scaffolding. Only ~30% of words carry actual meaning.

### The Rule
Every utterance of 15+ words must have **at least 60% function words** (fillers, repetition, pronouns, articles, prepositions, hedges, reformulations). If an utterance is too efficient, it's not speech -- it's a written sentence with apostrophes.

### BAD (too efficient -- 50% meaning words):
> "Naylor's extension. No contest. They locked him up before the Winter Meetings even started."

### GOOD (70% scaffolding):
> "I mean, Naylor, right? The extension? Like, that was -- that was the move, honestly. They got that done super early, you know, before the Meetings even really kicked off, and I'm thinkin' like, man, if they'd waited? Way more expensive."

### How to fix:
- Restate the point before explaining it ("Naylor, right? The extension?")
- Add hedges before opinions ("honestly", "I think", "for me")
- Add reactions after facts ("which is crazy", "and I'm like wait what")
- Repeat key phrases ("that was -- that was the move")
- Add afterthought qualifiers ("...you know, before the Meetings even really kicked off")

---

## Rule 2: Cognitive Markers (um, uh, false starts)

Real humans think while speaking. Zero hesitation = zero thinking = robot.

### The Rule
Every 5-8 dialogue lines must include AT LEAST ONE of:
- "um" or "uh" (genuine hesitation)
- False start: "I was -- so basically what happened was --"
- Self-correction: "he hit like .280 -- well, actually more like .275"
- Abandoned thought: "and I think that's why -- anyway, point is..."
- Restart: "wait, let me back up"

### BAD (zero cognitive struggle in 8 lines):
> Marcus: "What about the pitching?"
> Kai: "Evans was supposed to be the sixth starter option, and now he's done for the year."
> Marcus: "Remember last year when Gilbert went down?"
> Kai: "They were rolling out KC Lawrence. Somehow they survived."

### GOOD (thinking is visible):
> Marcus: "What about the -- uh, pitching situation? 'Cause I know Evans went down."
> Kai: "Yeah, that's where I start gettin' -- I mean, look, Evans was supposed to be our six guy, right? And now he's just... done. For the year."
> Marcus: "I keep thinkin' about last year, um, when Gilbert and Kirby and Miller all went down at like the same -- was it the same time?"
> Kai: "Don't -- yeah, don't remind me. They were rollin' out -- who was it -- KC Lawrence? And some guy named Castillo, not THAT Castillo, and I'm sittin' there watchin' this goin'... we're done. Like, we're toast."

### Where to place cognitive markers:
- Before proper nouns the speaker has to recall ("um, was it -- KC Lawrence?")
- Before numbers or stats ("he hit like, uh, .275?")
- When switching from one argument to another ("so -- wait, actually, lemme back up")
- When the speaker is emotionally processing ("and I'm just... I dunno, man")

---

## Rule 3: Clause Chain Length (5+ Direction Changes)

Native speakers chain 5-8 clauses with adhesive connectors (and, but, so, I mean, because, and then, which) before stopping. This is the acoustic signature of fluent speech. Stopping every 2-3 clauses = ESL rhythm.

### The Rule
At least 30% of all utterances (especially from enthusiastic/passionate speakers) must contain 4+ clause adhesions. The speaker should make multiple direction changes WITHOUT STOPPING.

### Adhesive connectors (not transitions -- ADHESIVES):
- "and" -- the universal glue
- "but" -- disguised as negation, functions as continuation
- "so" -- disguised as causation, functions as continuation
- "I mean" -- explicit reboot without stopping
- "because" / "'cause" -- afterthought reasoning
- "and then" -- temporal bridge
- "which" -- relative clause extension
- "right?" / "you know?" -- mid-utterance check-in (does NOT end the turn)

### BAD (3 direction changes -- too clean):
> "The Rays had been interested in Williamson. And the key connection is that Neander was Chaim's colleague. They go way back."

### GOOD (7 direction changes -- real chain):
> "So the Rays had been -- 'cause they'd been lookin' at Williamson for a while, like way before any of this was even on the table, and I think the thing people don't realize is Neander and Chaim go way back, right? Like they were both in Tampa together, so when you think about it, Neander's basically actin' as this go-between, which -- I mean nobody's gonna SAY that publicly but that's clearly what's happenin'."

### The acoustic logic:
In real conversation, a 0.5-second pause invites interruption. Speakers maintain their turn through continuous clause adhesion. The moment they stop, the other person jumps in. This creates the characteristic "endless sentence" of podcast speech.

---

## Rule 4: g-dropping Variability (70-80%, Not 100%)

g-dropping is a PROSODIC phenomenon, not a phonetic one. Real speakers vary.

### The Rule
Drop the g on approximately 70-80% of -ing words. Keep full form on:
- Emphasized words: "I'm not KIDDING" (not "kiddin'")
- Formal-register moments: "the organization has been building" (not "buildin'")
- Sentence-final position with emphasis: "that's what I'm SAYING" (not "sayin'")
- After a pause or restart: "...thinking about it" (not "thinkin'")

### BAD (100% uniform dropping):
> "I'm sittin' here thinkin' about Donovan goin' to Seattle and I'm feelin' pretty good about how things are goin'."

### GOOD (natural variation):
> "I'm sittin' here thinking about Donovan goin' to Seattle and honestly I'm feelin' pretty good about how things are going."

The variation is unconscious. Don't overthink it -- just make sure it's not 100%.

---

## Rule 5: Turn Length Variation (Wild Swings)

Real podcast conversations have wildly uneven turns. One person monologues for 45 seconds, the other says "yeah" or "right, right."

### The Rule
- At least 20% of all turns must be SHORT (1-5 words): "Yeah." "Right, right." "No way." "That's fair." "Ha!" "Exactly." "Dude."
- At least 20% of turns must be LONG (4+ sentences / 50+ words)
- No more than 3 consecutive turns of similar length
- The passionate speaker (guest/fan) should have longer average turns
- The host should have more short reactive turns

### BAD (balanced tennis rally):
> Marcus: [30 words]
> Kai: [35 words]
> Marcus: [28 words]
> Kai: [32 words]

### GOOD (natural asymmetry):
> Marcus: "And the Angels?"
> Kai: "Actually, they're doin' somethin' interesting for once. Instead of the usual 'spend money, try to win now' thing, they're takin' these lottery tickets -- Grayson Rodriguez, Alex Manoah -- guys who could be elite if they bounce back, and the idea is, if those guys hit, you flip 'em at the deadline for real prospects. It's the first time I've seen Moreno's team actually rebuild smart. Like, genuinely smart. And that scares me a little bit, 'cause if they get it right --"
> Marcus: "That's actually terrifying."
> Kai: "Right?"
> Marcus: "In two, three years."
> Kai: "Exactly. So the window's now."

### Short turn types:
- Agreement: "Yeah." / "Exactly." / "Right, right."
- Surprise: "No way." / "Wait, what?" / "You're kiddin' me."
- Encouragement: "Tell me." / "Keep goin'." / "Hit me."
- Echo: "The Angels?" / "Kirby?" / "Twenty YEARS?"
- Laughter: "Ha!" / "That's hilarious." / "I love that."
- Bridge: "Interesting." / "Huh." / "OK, OK."

---

## Rule 6: Repetition and Reformulation

Real speakers say the same thing 2-3 times with slight variation. This is how humans process thoughts -- they state, then refine, then land.

### The Rule
Key opinions and emotional reactions must be expressed at least twice using different words within the same turn or across adjacent turns. Single-statement-and-move-on = written text, not speech.

### BAD (state once and move on):
> "Williamson was a real prospect."

### GOOD (state, refine, land):
> "Williamson was a real prospect. Like, he wasn't just some guy in the system -- he was THE guy. The one you build around."

### BAD:
> "I was excited when they got Donovan."

### GOOD:
> "I was -- honestly, when they got Donovan, I just -- I couldn't believe it. Like, this is actually happening? This is real? After twenty years of, you know, NOTHING, and now we're out here makin' trades like a real team."

### The pattern:
1. First statement (raw/incomplete)
2. Elaboration (context/reasoning)
3. Landing (emotional punch or summary)

Not every point needs this treatment. Save it for the 5-6 moments per day that carry emotional weight.

---

## Rule 7: Cross-Turn Building

Speakers don't operate in isolation. They echo, finish, rephrase, and build on each other.

### The Rule
At least 20% of turns must directly reference the previous speaker's words or ideas through:
- Echo/repeat: "Twenty years?" / "Built DIFFERENT?"
- Rephrase: "So basically you're sayin' the depth just isn't there."
- Extend: "Right, and that's exactly why the Naylor deal --"
- Challenge: "OK but here's the thing about that --"
- Validate then add: "No totally, and on top of that --"

### BAD (parallel monologues):
> Marcus: "The pitching depth worries me."
> Kai: "The outfield has too many players for two spots."

### GOOD (interlocking):
> Marcus: "The pitching depth thing genuinely worries me."
> Kai: "Yeah, and -- so on top of that, right, you've also got this outfield situation where there's literally four guys for two spots, and it's like, OK, so the depth is thin AND the roster's clogged? That's a weird combination."

---

## Quality Checklist (Structural)

Before marking ANY Memoria content as done:

- [ ] Pick 3 random utterances of 15+ words. Count function vs. content words. Is it at least 60% function words?
- [ ] In any block of 8 consecutive lines, is there at least 1 cognitive marker (um, uh, false start, self-correction)?
- [ ] Are at least 30% of utterances 4+ clauses chained with adhesives?
- [ ] Is g-dropping varied (70-80%), not uniform (100%)?
- [ ] Are at least 20% of turns short (1-5 words)?
- [ ] Are at least 20% of turns long (50+ words)?
- [ ] Do key emotional moments get stated 2-3 times with variation?
- [ ] Do at least 20% of turns reference the previous speaker's words?

### Red Flags (rewrite if you see these):
- 8+ consecutive lines with zero "um", "uh", or false starts
- Every turn is 20-40 words (uniform length)
- Every -ing word has the g dropped
- Speaker states a key opinion once and moves to the next topic
- Both speakers have equal word counts across the whole day
- Dialogue reads like a Q&A interview, not a conversation

---

## Before/After: Full Day 1 Opening (5 lines)

### BEFORE (current -- decorated writing):
> Marcus: "Alright, so we're finally doin' this. Donovan to the Mariners. It's official, and I got a very special guest tonight -- Kai, who's been watchin' this team since, like, the Ichiro days, right?"
> Kai: "Yeah, hey, thanks for havin' me on, man. This is actually my first time doin' anythin' like this, so I might be a little rough around the edges, but I'm just -- I'm so pumped about this team right now, I gotta talk about it."
> Marcus: "No, you're good, you're good. So tell me -- how'd you even get into baseball? 'Cause for me it was literally a video game, which is, you know, kinda embarrassing to admit."

### AFTER (deep structure applied):
> Marcus: "Alright, so we're finally doin' this. Donovan to the Mariners. Um, it's official, and tonight I got -- so I got a buddy on with me, Kai, who's been -- man, how long you been watchin' this team? Since like the Ichiro days?"
> Kai: "Yeah, uh -- thanks for havin' me on, man. I'm -- so this is literally my first time doin' anything like this, so I might be a little, you know, rough around the edges? But I'm just -- I'm so pumped right now. Like, I can't NOT talk about this team. I physically cannot stop talkin' about this team."
> Marcus: "Ha!"
> Kai: "I'm serious."
> Marcus: "No, you're good, you're good. So tell me, um -- how'd you even get into baseball? 'Cause for me it was -- and this is kinda embarrassing to admit -- it was literally a video game. Like, not even watchin' a game. A video game."
> Kai: "A video game?"
> Marcus: "Yeah."
> Kai: "That's -- OK no, that's actually pretty common, I think. Mine's kind of a different story though."

### What changed:
- Marcus's opener has "um" and a false start ("I got -- so I got")
- Kai's response has "uh", a self-correction, and says "pumped" twice with escalation
- Added 3 short turns: "Ha!", "I'm serious.", "A video game?", "Yeah."
- Marcus restates the embarrassment ("kinda embarrassing" then "not even watchin' a game")
- Kai echoes ("A video game?") before launching his own story
- Turn count went from 3 to 8, but the INFORMATION is identical

---

## Applying This to Journal ConversationData

Journal Memoria has male/female dialogue. Same rules apply:

- Female (listener) should have MORE short turns: "Wait, what?", "No way.", "That's actually smart."
- Male (author) should have LONGER turns with more clause chains (he's telling the story)
- Female should echo/challenge/rephrase, not just ask questions
- Both should have cognitive markers proportional to topic difficulty
- Information density should be LOW -- the listener already has the englishSummary for dense content

The purpose of conversationData is RHYTHM TRAINING, not information delivery.
If someone memorizes these patterns, their spoken English should sound like real conversation.
That's the entire point. If the dialogue is too clean to memorize as-is, it fails.
