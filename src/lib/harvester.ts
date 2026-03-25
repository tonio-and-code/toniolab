// ---------------------------------------------------------------------------
// Expression Harvester Engine
// Fetches spoken English from free sources, extracts conversational
// expressions via heuristics (no LLM, no API keys), deduplicates against
// existing expressions.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HarvestedExpression {
  expression: string;
  score: number;
  source_type: 'youtube' | 'reddit' | 'movie_script';
  source_title: string;
  source_url: string;
  context: string;
}

// ---------------------------------------------------------------------------
// Constants -- Source Lists
// ---------------------------------------------------------------------------

export const YOUTUBE_SEARCH_TERMS: string[] = [
  'joe rogan clips',
  'h3 podcast',
  'conan o\'brien needs a friend',
  'day in my life vlog',
  'couple vlog',
  'hot ones interview',
  'between two ferns',
  'standup comedy',
  'improv comedy',
  'pat mcafee show',
  'undisputed',
  'theo von podcast',
  'bill burr podcast',
  'mark normand comedy',
  'andrew schulz comedy',
  'first we feast',
  'jimmy fallon interview',
  'graham norton show',
  'late night seth meyers',
  'daily show',
  'college humor',
  'jubilee middle ground',
  'cut truth or drink',
  'sidemen',
  'good mythical morning',
  'philip defranco',
  'penguinz0 commentary',
  'casual friday podcast',
  'impaulsive podcast',
  'breakfast club interview',
];

export const REDDIT_SUBREDDITS: string[] = [
  'CasualConversation',
  'AskReddit',
  'tifu',
  'relationship_advice',
  'AmItheAsshole',
  'TrueOffMyChest',
  'unpopularopinion',
  'NoStupidQuestions',
  'TooAfraidToAsk',
  'offmychest',
];

export const MOVIE_SCRIPTS: { title: string; slug: string }[] = [
  // imsdb.com format: https://imsdb.com/scripts/Slug.html
  // ~200 movies, conversation-heavy selections

  // --- Tarantino / Crime / Dialogue-driven ---
  { title: 'Pulp Fiction', slug: 'Pulp-Fiction' },
  { title: 'Reservoir Dogs', slug: 'Reservoir-Dogs' },
  { title: 'Kill Bill Volume 1', slug: 'Kill-Bill' },
  { title: 'Kill Bill Volume 2', slug: 'Kill-Bill-Volume-Two' },
  { title: 'Inglourious Basterds', slug: 'Inglourious-Basterds' },
  { title: 'Django Unchained', slug: 'Django-Unchained' },
  { title: 'The Hateful Eight', slug: 'Hateful-Eight,-The' },
  { title: 'Jackie Brown', slug: 'Jackie-Brown' },
  { title: 'Goodfellas', slug: 'Goodfellas' },
  { title: 'Casino', slug: 'Casino' },
  { title: 'The Departed', slug: 'Departed,-The' },
  { title: 'Scarface', slug: 'Scarface' },
  { title: 'The Godfather', slug: 'Godfather,-The' },
  { title: 'The Godfather Part II', slug: 'Godfather-Part-II,-The' },
  { title: 'Heat', slug: 'Heat' },
  { title: 'Snatch', slug: 'Snatch' },
  { title: 'Lock Stock and Two Smoking Barrels', slug: 'Lock,-Stock-and-Two-Smoking-Barrels' },
  { title: 'In Bruges', slug: 'In-Bruges' },
  { title: 'The Usual Suspects', slug: 'Usual-Suspects,-The' },
  { title: 'Fargo', slug: 'Fargo' },
  { title: 'No Country for Old Men', slug: 'No-Country-for-Old-Men' },
  { title: 'True Romance', slug: 'True-Romance' },

  // --- Comedy / Teen / Coming-of-age ---
  { title: 'Superbad', slug: 'Superbad' },
  { title: 'Juno', slug: 'Juno' },
  { title: 'Mean Girls', slug: 'Mean-Girls' },
  { title: 'Clueless', slug: 'Clueless' },
  { title: 'Napoleon Dynamite', slug: 'Napoleon-Dynamite' },
  { title: 'The Breakfast Club', slug: 'Breakfast-Club,-The' },
  { title: 'Ferris Buellers Day Off', slug: 'Ferris-Bueller%27s-Day-Off' },
  { title: 'Fast Times at Ridgemont High', slug: 'Fast-Times-at-Ridgemont-High' },
  { title: 'Dazed and Confused', slug: 'Dazed-and-Confused' },
  { title: 'The Hangover', slug: 'Hangover,-The' },
  { title: 'Knocked Up', slug: 'Knocked-Up' },
  { title: 'The 40-Year-Old Virgin', slug: '40-Year-Old-Virgin,-The' },
  { title: 'Anchorman', slug: 'Anchorman-The-Legend-of-Ron-Burgundy' },
  { title: 'Step Brothers', slug: 'Step-Brothers' },
  { title: 'Bridesmaids', slug: 'Bridesmaids' },
  { title: 'Wedding Crashers', slug: 'Wedding-Crashers' },
  { title: 'Zoolander', slug: 'Zoolander' },
  { title: 'Tropic Thunder', slug: 'Tropic-Thunder' },
  { title: 'Shaun of the Dead', slug: 'Shaun-of-the-Dead' },
  { title: 'Hot Fuzz', slug: 'Hot-Fuzz' },
  { title: 'This Is Spinal Tap', slug: 'This-Is-Spinal-Tap' },
  { title: 'The Big Lebowski', slug: 'Big-Lebowski,-The' },
  { title: 'Office Space', slug: 'Office-Space' },
  { title: 'Clerks', slug: 'Clerks' },
  { title: 'Clerks 2', slug: 'Clerks-2' },
  { title: 'Chasing Amy', slug: 'Chasing-Amy' },
  { title: 'Dogma', slug: 'Dogma' },
  { title: 'Rushmore', slug: 'Rushmore' },
  { title: 'The Royal Tenenbaums', slug: 'Royal-Tenenbaums,-The' },
  { title: 'Ghostbusters', slug: 'Ghostbusters' },
  { title: 'Groundhog Day', slug: 'Groundhog-Day' },
  { title: 'Liar Liar', slug: 'Liar-Liar' },
  { title: 'Bruce Almighty', slug: 'Bruce-Almighty' },
  { title: 'Mrs. Doubtfire', slug: 'Mrs.-Doubtfire' },
  { title: 'School of Rock', slug: 'School-of-Rock' },
  { title: 'Elf', slug: 'Elf' },
  { title: 'Austin Powers', slug: 'Austin-Powers' },
  { title: 'Legally Blonde', slug: 'Legally-Blonde' },
  { title: '10 Things I Hate About You', slug: '10-Things-I-Hate-About-You' },
  { title: 'Easy A', slug: 'Easy-A' },
  { title: 'Lady Bird', slug: 'Lady-Bird' },
  { title: 'Booksmart', slug: 'Booksmart' },
  { title: 'The Edge of Seventeen', slug: 'Edge-of-Seventeen,-The' },

  // --- Romance / Romantic Comedy ---
  { title: 'When Harry Met Sally', slug: 'When-Harry-Met-Sally' },
  { title: 'Annie Hall', slug: 'Annie-Hall' },
  { title: 'Notting Hill', slug: 'Notting-Hill' },
  { title: '500 Days of Summer', slug: '(500)-Days-of-Summer' },
  { title: 'Eternal Sunshine', slug: 'Eternal-Sunshine-of-the-Spotless-Mind' },
  { title: 'Lost in Translation', slug: 'Lost-in-Translation' },
  { title: 'Before Sunrise', slug: 'Before-Sunrise' },
  { title: 'Before Sunset', slug: 'Before-Sunset' },
  { title: 'High Fidelity', slug: 'High-Fidelity' },
  { title: 'Swingers', slug: 'Swingers' },
  { title: 'Jerry Maguire', slug: 'Jerry-Maguire' },
  { title: 'As Good as It Gets', slug: 'As-Good-As-It-Gets' },
  { title: 'Silver Linings Playbook', slug: 'Silver-Linings-Playbook' },
  { title: 'Crazy Stupid Love', slug: 'Crazy,-Stupid,-Love' },
  { title: 'The Notebook', slug: 'Notebook,-The' },
  { title: 'Pretty Woman', slug: 'Pretty-Woman' },
  { title: 'Sleepless in Seattle', slug: 'Sleepless-in-Seattle' },
  { title: 'Youve Got Mail', slug: 'You%27ve-Got-Mail' },
  { title: 'My Best Friends Wedding', slug: 'My-Best-Friend%27s-Wedding' },
  { title: 'Four Weddings and a Funeral', slug: 'Four-Weddings-and-a-Funeral' },

  // --- Drama / Character-driven ---
  { title: 'Good Will Hunting', slug: 'Good-Will-Hunting' },
  { title: 'The Shawshank Redemption', slug: 'Shawshank-Redemption,-The' },
  { title: 'Forrest Gump', slug: 'Forrest-Gump' },
  { title: 'Fight Club', slug: 'Fight-Club' },
  { title: 'American Beauty', slug: 'American-Beauty' },
  { title: 'The Social Network', slug: 'Social-Network,-The' },
  { title: 'Little Miss Sunshine', slug: 'Little-Miss-Sunshine' },
  { title: 'Almost Famous', slug: 'Almost-Famous' },
  { title: 'The Truman Show', slug: 'Truman-Show,-The' },
  { title: 'Being John Malkovich', slug: 'Being-John-Malkovich' },
  { title: 'Sideways', slug: 'Sideways' },
  { title: 'A Few Good Men', slug: 'Few-Good-Men,-A' },
  { title: 'The Princess Bride', slug: 'Princess-Bride,-The' },
  { title: 'There Will Be Blood', slug: 'There-Will-Be-Blood' },
  { title: 'The Matrix', slug: 'Matrix,-The' },
  { title: 'Moneyball', slug: 'Moneyball' },
  { title: 'The Big Short', slug: 'Big-Short,-The' },
  { title: 'Whiplash', slug: 'Whiplash' },
  { title: 'Birdman', slug: 'Birdman' },
  { title: 'Boyhood', slug: 'Boyhood' },
  { title: 'Manchester by the Sea', slug: 'Manchester-by-the-Sea' },
  { title: 'The Perks of Being a Wallflower', slug: 'Perks-of-Being-a-Wallflower,-The' },
  { title: 'Dead Poets Society', slug: 'Dead-Poets-Society' },
  { title: 'Rain Man', slug: 'Rain-Man' },
  { title: 'Thelma and Louise', slug: 'Thelma-and-Louise' },
  { title: 'Stand by Me', slug: 'Stand-by-Me' },
  { title: 'One Flew Over the Cuckoos Nest', slug: 'One-Flew-Over-the-Cuckoo%27s-Nest' },
  { title: 'Taxi Driver', slug: 'Taxi-Driver' },
  { title: 'Network', slug: 'Network' },
  { title: 'Dog Day Afternoon', slug: 'Dog-Day-Afternoon' },
  { title: 'Glengarry Glen Ross', slug: 'Glengarry-Glen-Ross' },
  { title: '12 Angry Men', slug: '12-Angry-Men' },
  { title: 'To Kill a Mockingbird', slug: 'To-Kill-a-Mockingbird' },
  { title: 'The Verdict', slug: 'Verdict,-The' },
  { title: 'Erin Brockovich', slug: 'Erin-Brockovich' },
  { title: 'Michael Clayton', slug: 'Michael-Clayton' },
  { title: 'Up in the Air', slug: 'Up-in-the-Air' },
  { title: 'Lost in America', slug: 'Lost-in-America' },
  { title: 'About Schmidt', slug: 'About-Schmidt' },
  { title: 'American Graffiti', slug: 'American-Graffiti' },

  // --- Thriller / Suspense (dialogue-heavy) ---
  { title: 'Se7en', slug: 'Se7en' },
  { title: 'Zodiac', slug: 'Zodiac' },
  { title: 'Gone Girl', slug: 'Gone-Girl' },
  { title: 'Silence of the Lambs', slug: 'Silence-of-the-Lambs,-The' },
  { title: 'Primal Fear', slug: 'Primal-Fear' },
  { title: 'The Sixth Sense', slug: 'Sixth-Sense,-The' },
  { title: 'Memento', slug: 'Memento' },
  { title: 'Donnie Darko', slug: 'Donnie-Darko' },
  { title: 'American Psycho', slug: 'American-Psycho' },
  { title: 'Collateral', slug: 'Collateral' },
  { title: 'Training Day', slug: 'Training-Day' },
  { title: 'Nightcrawler', slug: 'Nightcrawler' },
  { title: 'Prisoners', slug: 'Prisoners' },
  { title: 'Mystic River', slug: 'Mystic-River' },

  // --- Sci-Fi / Fantasy (conversation parts) ---
  { title: 'Blade Runner', slug: 'Blade-Runner' },
  { title: 'Back to the Future', slug: 'Back-to-the-Future' },
  { title: 'E.T.', slug: 'E.T.-the-Extra-Terrestrial' },
  { title: 'Aliens', slug: 'Aliens' },
  { title: 'The Terminator', slug: 'Terminator,-The' },
  { title: 'Inception', slug: 'Inception' },
  { title: 'Interstellar', slug: 'Interstellar' },
  { title: 'Ex Machina', slug: 'Ex-Machina' },
  { title: 'Her', slug: 'Her' },
  { title: 'Arrival', slug: 'Arrival' },
  { title: 'District 9', slug: 'District-9' },

  // --- Action / Adventure (strong dialogue scenes) ---
  { title: 'Die Hard', slug: 'Die-Hard' },
  { title: 'Lethal Weapon', slug: 'Lethal-Weapon' },
  { title: 'Indiana Jones Raiders', slug: 'Raiders-of-the-Lost-Ark' },
  { title: 'The Dark Knight', slug: 'Dark-Knight,-The' },
  { title: 'Batman Begins', slug: 'Batman-Begins' },
  { title: 'Iron Man', slug: 'Iron-Man' },
  { title: 'The Avengers', slug: 'Avengers,-The' },
  { title: 'Guardians of the Galaxy', slug: 'Guardians-of-the-Galaxy' },
  { title: 'Spider-Man', slug: 'Spider-Man' },
  { title: 'Deadpool', slug: 'Deadpool' },
  { title: 'The Incredibles', slug: 'Incredibles,-The' },
  { title: 'Pirates of the Caribbean', slug: 'Pirates-of-the-Caribbean' },

  // --- Horror / Dark Comedy ---
  { title: 'Get Out', slug: 'Get-Out' },
  { title: 'Scream', slug: 'Scream' },
  { title: 'The Shining', slug: 'Shining,-The' },
  { title: 'Psycho', slug: 'Psycho' },
  { title: 'Beetlejuice', slug: 'Beetlejuice' },
  { title: 'Heathers', slug: 'Heathers' },
  { title: 'Zombieland', slug: 'Zombieland' },

  // --- Family / Animation (natural dialogue) ---
  { title: 'Toy Story', slug: 'Toy-Story' },
  { title: 'Toy Story 2', slug: 'Toy-Story-2' },
  { title: 'Finding Nemo', slug: 'Finding-Nemo' },
  { title: 'Shrek', slug: 'Shrek' },
  { title: 'Monsters Inc', slug: 'Monsters,-Inc' },
  { title: 'The Lion King', slug: 'Lion-King,-The' },
  { title: 'Ratatouille', slug: 'Ratatouille' },
  { title: 'Up', slug: 'Up' },
  { title: 'Inside Out', slug: 'Inside-Out' },
  { title: 'WALL-E', slug: 'WALL-E' },

  // --- Classic / Quotable ---
  { title: 'Casablanca', slug: 'Casablanca' },
  { title: 'Some Like It Hot', slug: 'Some-Like-It-Hot' },
  { title: 'The Apartment', slug: 'Apartment,-The' },
  { title: 'Its a Wonderful Life', slug: 'It%27s-a-Wonderful-Life' },
  { title: 'The Wizard of Oz', slug: 'Wizard-of-Oz,-The' },
  { title: 'Chinatown', slug: 'Chinatown' },
  { title: 'Sunset Boulevard', slug: 'Sunset-Boulevard' },
  { title: 'All About Eve', slug: 'All-About-Eve' },
  { title: 'The Graduate', slug: 'Graduate,-The' },
  { title: 'Butch Cassidy and the Sundance Kid', slug: 'Butch-Cassidy-and-the-Sundance-Kid' },
  { title: 'Cool Hand Luke', slug: 'Cool-Hand-Luke' },
  { title: 'Airplane!', slug: 'Airplane!' },
  { title: 'Monty Python Holy Grail', slug: 'Monty-Python-and-the-Holy-Grail' },
  { title: 'Young Frankenstein', slug: 'Young-Frankenstein' },
  { title: 'Blazing Saddles', slug: 'Blazing-Saddles' },

  // --- 2000s-2020s Modern ---
  { title: 'Jojo Rabbit', slug: 'Jojo-Rabbit' },
  { title: 'Knives Out', slug: 'Knives-Out' },
  { title: 'Parasite', slug: 'Parasite' },
  { title: 'Once Upon a Time in Hollywood', slug: 'Once-Upon-a-Time-in-Hollywood' },
  { title: 'The Grand Budapest Hotel', slug: 'Grand-Budapest-Hotel,-The' },
  { title: 'Moonrise Kingdom', slug: 'Moonrise-Kingdom' },
  { title: 'The Favourite', slug: 'Favourite,-The' },
  { title: 'Three Billboards', slug: 'Three-Billboards-Outside-Ebbing,-Missouri' },
  { title: 'Get Shorty', slug: 'Get-Shorty' },
  { title: 'Thank You for Smoking', slug: 'Thank-You-for-Smoking' },
  { title: 'Little Children', slug: 'Little-Children' },
  { title: 'The Descendants', slug: 'Descendants,-The' },
  { title: 'Nebraska', slug: 'Nebraska' },
  { title: 'Her', slug: 'Her' },
  { title: 'Spotlight', slug: 'Spotlight' },
  { title: 'The Wolf of Wall Street', slug: 'Wolf-of-Wall-Street,-The' },
  { title: 'American Hustle', slug: 'American-Hustle' },
  { title: 'The Martian', slug: 'Martian,-The' },
  { title: 'La La Land', slug: 'La-La-Land' },
  { title: 'Marriage Story', slug: 'Marriage-Story' },
];

// ---------------------------------------------------------------------------
// Constants -- Rejection & Pattern Lists
// ---------------------------------------------------------------------------

export const COMMON_REJECT_LIST: Set<string> = new Set([
  'thank you', 'thanks', 'thank you very much', 'thanks a lot',
  'excuse me', 'i am sorry', 'i\'m sorry', 'sorry',
  'how are you', 'how are you doing', 'i\'m fine', 'i am fine',
  'good morning', 'good afternoon', 'good evening', 'good night',
  'nice to meet you', 'pleased to meet you',
  'hello', 'hi', 'hey', 'goodbye', 'bye', 'see you later',
  'yes', 'no', 'maybe', 'please', 'of course', 'sure',
  'you are welcome', 'you\'re welcome', 'no problem',
  'what is your name', 'what\'s your name', 'my name is',
  'i don\'t know', 'i don\'t understand', 'i understand',
  'can you help me', 'can i help you',
  'where is the', 'where are you from', 'i am from',
  'what time is it', 'what do you do',
  'i love you', 'i miss you', 'i like it',
  'that is good', 'that\'s good', 'that is great', 'that\'s great',
  'that is nice', 'that\'s nice', 'that is bad', 'that\'s bad',
  'i think so', 'i don\'t think so',
  'it is okay', 'it\'s okay', 'it\'s ok',
  'i agree', 'i disagree',
  'what happened', 'what is this', 'what\'s this',
  'let me know', 'take care', 'have a nice day',
  'come on', 'let\'s go', 'go ahead',
  'i want to', 'i need to', 'i have to',
  'that is true', 'it is what it is',
  'yes i know', 'i know right',
  'oh my god', 'oh my gosh',
  'what the heck', 'what the hell',
  'wait a minute', 'hold on',
  'never mind', 'forget it',
  'congratulations', 'happy birthday',
  'i\'m tired', 'i\'m hungry', 'i\'m busy',
  'me too', 'same here',
  'long time no see', 'what\'s up', 'what is up',
  'how is it going', 'how\'s it going',
  'it depends', 'who knows',
  'why not', 'so what',
  'that makes sense', 'no worries',
  'just kidding', 'i was joking',
  'to be honest', 'in my opinion',
  'by the way', 'anyway',
  'for example', 'such as',
  'as soon as possible', 'right now',
  'a little bit', 'a lot of',
]);

export const CONVERSATIONAL_PATTERNS: string[] = [
  'kind of',
  'sort of',
  'you know',
  'i mean',
  'no way',
  'for real',
  'big deal',
  'what if',
  'how come',
  'turns out',
  'the thing is',
  'at the end of the day',
  'the point is',
  'on top of that',
  'out of nowhere',
  'all of a sudden',
  'might as well',
  'ended up',
  'messed up',
  'fed up',
  'wound up',
  'came across',
  'pulled off',
  'let alone',
  'as far as',
  'when it comes to',
  'not gonna lie',
  'to be fair',
  'low key',
  'high key',
  'dead serious',
  'fair enough',
  'it hits different',
  'that tracks',
  'no cap',
  'on god',
  'straight up',
  'for what it\'s worth',
  'keep in mind',
  'get the hang of',
  'wrap my head around',
  'talk someone into',
  'catch up with',
  'get over it',
  'cut someone off',
  'bring it up',
  'figure it out',
  'look into it',
  'come up with',
  'put up with',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FETCH_TIMEOUT_MS = 8000;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const DEFAULT_HEADERS: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (compatible; ExpressionHarvester/1.0)',
  'Accept': 'text/html,application/xhtml+xml,application/json',
};

async function fetchWithTimeout(
  url: string,
  opts: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const headers = { ...DEFAULT_HEADERS, ...(opts.headers as Record<string, string> || {}) };
  try {
    const res = await fetch(url, { ...opts, headers, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[>-]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '');
}

// ---------------------------------------------------------------------------
// Source Fetchers
// ---------------------------------------------------------------------------

interface FetchedContent {
  lines: string[];
  source_title: string;
  source_url: string;
  source_type: 'youtube' | 'reddit' | 'movie_script';
}

// -- YouTube -----------------------------------------------------------------

function extractVideoIdsFromHtml(html: string): string[] {
  const ids: Set<string> = new Set();
  const pattern = /\/watch\?v=([a-zA-Z0-9_-]{11})/g;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(html)) !== null) {
    ids.add(m[1]);
  }
  return [...ids];
}

function extractCaptionTrackUrl(playerResponseJson: string): string | null {
  try {
    const data = JSON.parse(playerResponseJson);
    const tracks =
      data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!Array.isArray(tracks)) return null;
    // Prefer English auto-generated, fall back to any English track
    const en =
      tracks.find(
        (t: Record<string, string>) =>
          t.languageCode === 'en' && t.kind === 'asr',
      ) ??
      tracks.find((t: Record<string, string>) => t.languageCode === 'en');
    return en?.baseUrl ?? null;
  } catch {
    return null;
  }
}

function parseTranscriptXml(xml: string): string[] {
  const lines: string[] = [];
  const textPattern = /<text[^>]*>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = textPattern.exec(xml)) !== null) {
    const decoded = decodeHtmlEntities(stripHtmlTags(m[1].trim()));
    if (decoded.length > 0) {
      lines.push(decoded);
    }
  }
  return lines;
}

export async function fetchYouTubeContent(): Promise<FetchedContent | null> {
  // Store debug info for diagnosis
  const _debug: string[] = [];
  try {
    const term = pickRandom(YOUTUBE_SEARCH_TERMS);
    _debug.push(`term=${term}`);
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}&sp=EgIQAQ%3D%3D`;
    const searchRes = await fetchWithTimeout(searchUrl);
    _debug.push(`search=${searchRes.status}`);
    if (!searchRes.ok) { console.log('[yt-debug]', _debug.join('|')); return null; }
    const searchHtml = await searchRes.text();
    _debug.push(`searchLen=${searchHtml.length}`);

    const videoIds = extractVideoIdsFromHtml(searchHtml);
    _debug.push(`videoIds=${videoIds.length}`);
    if (videoIds.length === 0) { console.log('[yt-debug]', _debug.join('|')); return null; }

    // Try up to 3 videos to find one with captions
    const candidates = shuffled(videoIds).slice(0, 5);
    for (const videoId of candidates) {
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const watchRes = await fetchWithTimeout(watchUrl);
      if (!watchRes.ok) continue;
      const watchHtml = await watchRes.text();

      // Extract ytInitialPlayerResponse
      const marker = 'var ytInitialPlayerResponse = ';
      const startIdx = watchHtml.indexOf(marker);
      if (startIdx === -1) continue;

      const jsonStart = startIdx + marker.length;
      // Find the closing semicolon for the JSON assignment
      let depth = 0;
      let jsonEnd = jsonStart;
      for (let i = jsonStart; i < watchHtml.length; i++) {
        if (watchHtml[i] === '{') depth++;
        else if (watchHtml[i] === '}') {
          depth--;
          if (depth === 0) {
            jsonEnd = i + 1;
            break;
          }
        }
      }
      if (jsonEnd <= jsonStart) continue;

      const playerJson = watchHtml.slice(jsonStart, jsonEnd);
      const captionUrl = extractCaptionTrackUrl(playerJson);
      if (!captionUrl) continue;

      const captionRes = await fetchWithTimeout(captionUrl);
      if (!captionRes.ok) continue;
      const captionXml = await captionRes.text();
      const lines = parseTranscriptXml(captionXml);
      if (lines.length === 0) continue;

      // Extract video title
      const titleMatch = watchHtml.match(
        /<meta\s+name="title"\s+content="([^"]*?)"/,
      );
      const title = titleMatch
        ? decodeHtmlEntities(titleMatch[1])
        : `YouTube: ${term}`;

      return {
        lines,
        source_title: title,
        source_url: watchUrl,
        source_type: 'youtube',
      };
    }

    return null;
  } catch {
    return null;
  }
}

// -- Reddit ------------------------------------------------------------------

async function fetchRedditContent(): Promise<FetchedContent | null> {
  try {
    const sub = pickRandom(REDDIT_SUBREDDITS);
    // First get hot posts to find a thread
    const listUrl = `https://www.reddit.com/r/${sub}/hot.json?limit=10`;
    const listRes = await fetchWithTimeout(listUrl, {
      headers: { 'User-Agent': 'script:expression-harvester:v1.0' },
    });
    if (listRes.status === 429 || !listRes.ok) return null;
    const listJson = await listRes.json();
    const posts = listJson?.data?.children;
    if (!Array.isArray(posts) || posts.length === 0) return null;

    // Pick a random post and fetch its COMMENTS (much more conversational)
    const post = pickRandom(posts.filter((p: { data?: { num_comments?: number } }) =>
      p?.data?.num_comments && p.data.num_comments > 10
    ) || posts);
    const permalink = post?.data?.permalink;
    const postTitle = post?.data?.title || `r/${sub}`;
    if (!permalink) return null;

    const commentUrl = `https://www.reddit.com${permalink}.json?limit=100&sort=top`;
    const commentRes = await fetchWithTimeout(commentUrl, {
      headers: { 'User-Agent': 'script:expression-harvester:v1.0' },
    });
    if (!commentRes.ok) return null;
    const commentJson = await commentRes.json();

    const lines: string[] = [];

    // Extract comments recursively (top-level + first reply)
    function extractComments(children: Array<{ data?: { body?: string }; kind?: string }>) {
      if (!Array.isArray(children)) return;
      for (const child of children) {
        if (child?.kind !== 't1') continue;
        const body = child?.data?.body;
        if (!body || body.length < 10 || body === '[deleted]' || body === '[removed]') continue;
        const cleaned = stripMarkdown(body);
        const sentences = cleaned
          .split(/[.!?\n]+/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 5 && s.length < 200);
        lines.push(...sentences);
      }
    }

    // commentJson[1] contains the comments
    if (Array.isArray(commentJson) && commentJson[1]?.data?.children) {
      extractComments(commentJson[1].data.children);
    }

    if (lines.length === 0) return null;

    return {
      lines,
      source_title: `r/${sub}: ${postTitle}`,
      source_url: `https://www.reddit.com${permalink}`,
      source_type: 'reddit',
    };
  } catch {
    return null;
  }
}

// -- Movie Script ------------------------------------------------------------

function extractDialogueLines(fullScriptHtml: string): string[] {
  const text = stripHtmlTags(fullScriptHtml);
  const raw = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const lines: string[] = [];

  // Stage direction / scene description indicators
  const STAGE_DIRECTION_PATTERNS = [
    /^\(.*\)$/,                        // (parenthetical)
    /^\[.*\]$/,                        // [bracketed]
    /^[A-Z\s]{2,}:?$/,                // ALL CAPS character names
    /^(INT\.|EXT\.|FADE|CUT TO|DISSOLVE|ANGLE|CLOSE|WIDE|PAN|CONTINUED)/i, // scene headers
    /^(The |A |An |He |She |They |It |His |Her |Their )[a-z].*\b(is|are|was|were|goes|walks|turns|looks|sits|stands|enters|exits|opens|closes|picks|puts|pulls|pushes|moves|runs|falls|gets|starts|stops|begins|continues|crosses|reaches|takes|grabs|holds|drops|places|sets|lights|stares|gazes|glances|watches|nods|shakes|smiles|frowns|laughs|cries|sighs|pauses|hesitates|steps|leans|rises|lifts|throws|catches|hands|points|heads|drives|arrives|leaves|returns|appears|disappears)\b/,
    /\b(walks|enters|exits|turns to|looks at|sits down|stands up|picks up|puts down|pulls out|opens the|closes the|crosses to|reaches for|leans against|stares at|gazes at)\b/i,
    /^\w+\s+(is sitting|is standing|is walking|is looking|is holding|is wearing|is lying|is leaning|is staring)\b/,
    /^(BEAT|PAUSE|SILENCE|CONT'D|CONTINUED|V\.O\.|O\.S\.|O\.C\.)/i,
  ];

  for (const line of raw) {
    // Skip lines matching stage direction patterns
    let isStageDirection = false;
    for (const pat of STAGE_DIRECTION_PATTERNS) {
      if (pat.test(line)) { isStageDirection = true; break; }
    }
    if (isStageDirection) continue;

    // Remove leading character name if followed by colon
    const cleaned = line.replace(/^[A-Z][A-Z\s]*:\s*/, '');
    if (cleaned.length > 5) {
      lines.push(cleaned);
    }
  }

  return lines;
}

export async function fetchMovieScriptContent(): Promise<FetchedContent | null> {
  try {
    const movie = pickRandom(MOVIE_SCRIPTS);
    const url = `https://imsdb.com/scripts/${movie.slug}.html`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const html = await res.text();

    // imsdb.com wraps scripts in <pre> tags (the second <pre> has the content)
    const preMatches = [...html.matchAll(/<pre>([\s\S]*?)<\/pre>/gi)];
    // Usually the script content is in the last/largest <pre> block
    let scriptText = '';
    for (const m of preMatches) {
      if (m[1].length > scriptText.length) {
        scriptText = m[1];
      }
    }
    if (scriptText.length < 500) return null;

    // Strip HTML tags (bold, etc) from the pre content
    const cleaned = scriptText.replace(/<[^>]*>/g, '');
    const lines = extractDialogueLines(cleaned);
    if (lines.length === 0) return null;

    return {
      lines,
      source_title: movie.title,
      source_url: url,
      source_type: 'movie_script',
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Expression Extraction Engine (v2 -- quality-focused)
// ---------------------------------------------------------------------------
// Strategy: NO blind n-gram extraction. Instead:
// 1. Extract complete short utterances (3-8 words) that sound like real speech
// 2. Pattern-match known expression templates (phrasal verbs, idioms, reactions)
// 3. Very high rejection bar -- only keep genuinely useful expressions

const PHRASAL_VERB_PARTICLES = new Set([
  'up', 'out', 'off', 'down', 'over', 'through', 'away', 'back', 'around',
  'along', 'in', 'on', 'into', 'onto',
]);

const COMMON_VERBS = new Set([
  'get', 'go', 'come', 'take', 'put', 'give', 'make', 'turn', 'bring',
  'pull', 'push', 'run', 'break', 'cut', 'call', 'check', 'pick', 'look',
  'work', 'figure', 'hang', 'end', 'set', 'show', 'blow', 'freak', 'mess',
  'wind', 'wrap', 'keep', 'hold', 'throw', 'knock', 'shut', 'let', 'pass',
  'stand', 'hand', 'point', 'lay', 'settle', 'live', 'play', 'act', 'fill',
  'fall', 'catch', 'deal', 'drop', 'hit', 'kick', 'lock', 'move', 'pay',
  'rip', 'rule', 'sell', 'sign', 'sit', 'step', 'stick', 'tear', 'tip',
  'bail', 'back', 'burn', 'chill', 'crack', 'dig', 'flip', 'jack', 'max',
  'opt', 'phase', 'psych', 'rack', 'snap', 'space', 'zone', 'vibe',
]);

const INFORMAL_MARKERS = new Set([
  'gonna', 'wanna', 'gotta', 'kinda', 'sorta', 'totally', 'literally',
  'basically', 'honestly', 'actually', 'obviously', 'legit', 'lowkey',
  'highkey', 'ngl', 'tbh', 'imo', 'nah', 'yeah', 'yep', 'dude', 'bro',
]);

const EMOTION_WORDS = new Set([
  'crazy', 'awesome', 'insane', 'hilarious', 'ridiculous', 'amazing',
  'terrible', 'horrible', 'sick', 'wild', 'nuts', 'unreal', 'brutal',
  'sketchy', 'shady', 'clutch', 'fire', 'trash', 'iconic', 'cringe',
  'savage', 'petty', 'salty', 'stoked', 'bummed', 'gutted', 'hyped',
]);

// Dead fragments: pronoun+verb, prep+pronoun, conj+pronoun combos that are
// never useful as standalone expressions. This kills the "i feel", "he would" noise.
const DEAD_FRAGMENTS = new Set([
  // pronoun + common verb (both directions)
  'i feel', 'i felt', 'i told', 'i said', 'i was', 'i am', 'i had', 'i have',
  'i got', 'i went', 'i did', 'i do', 'i can', 'i will', 'i would', 'i could',
  'i should', 'i might', 'i may', 'i must', 'i need', 'i want', 'i like',
  'i think', 'i know', 'i see', 'i saw', 'i make', 'i made', 'i take', 'i took',
  'he was', 'he is', 'he had', 'he has', 'he did', 'he does', 'he would',
  'he could', 'he should', 'he said', 'he told', 'he went', 'he got',
  'she was', 'she is', 'she had', 'she has', 'she did', 'she does', 'she would',
  'she could', 'she should', 'she said', 'she told', 'she went', 'she got',
  'we were', 'we are', 'we had', 'we have', 'we did', 'we do', 'we would',
  'we could', 'we should', 'we said', 'we went', 'we got',
  'they were', 'they are', 'they had', 'they have', 'they did', 'they do',
  'they would', 'they could', 'they should', 'they said', 'they went', 'they got',
  'it was', 'it is', 'it had', 'it has', 'it did', 'it does', 'it would',
  'you are', 'you were', 'you had', 'you have', 'you did', 'you do', 'you would',
  'you could', 'you should', 'you said', 'you got',
  // prep/conj + pronoun
  'with him', 'with her', 'with them', 'with me', 'with us', 'with my', 'with his',
  'for him', 'for her', 'for them', 'for me', 'for us',
  'to him', 'to her', 'to them', 'to me', 'to us',
  'and he', 'and she', 'and they', 'and we', 'and i', 'and my', 'and his',
  'and her', 'and the', 'and that', 'and then', 'and it',
  'but he', 'but she', 'but they', 'but we', 'but i', 'but it', 'but the',
  'so i', 'so he', 'so she', 'so they', 'so we', 'so it',
  'when he', 'when she', 'when they', 'when we', 'when i', 'when it',
  'that he', 'that she', 'that they', 'that we', 'that i', 'that it',
  'if he', 'if she', 'if they', 'if we', 'if i', 'if it',
  'because i', 'because he', 'because she', 'because they', 'because we',
  // other dead combos
  'him and', 'her and', 'him to', 'her to', 'them to', 'me to', 'us to',
  'told him', 'told her', 'told them', 'told me', 'told us',
  'tried to', 'wanted to', 'needed to', 'had to', 'used to',
  'feel like', 'felt like', 'looks like', 'seems like', 'sounds like',
  'it was a', 'there was a', 'there were', 'there is a',
  'in the', 'on the', 'at the', 'of the', 'from the', 'by the',
  'is that', 'was that', 'or the', 'and the',
  'my mom', 'my dad', 'my friend', 'my boyfriend', 'my girlfriend', 'my husband', 'my wife',
  'try to', 'able to', 'going to', 'have to', 'want to', 'need to',
]);

// Expression templates that we WANT to find. These are the gold.
const EXPRESSION_TEMPLATES: RegExp[] = [
  // Phrasal verb patterns: verb + (pronoun/article) + particle
  /\b(get|go|come|take|put|give|make|turn|bring|pull|run|break|cut|call|check|pick|look|work|figure|hang|end|set|show|blow|freak|mess|keep|hold|throw|knock|shut|pass|stand|fall|catch|deal|drop|hit|kick|lock|move|pay|rip|sell|sign|sit|step|stick|tear|bail|burn|chill|crack|dig|flip|snap|space|zone|vibe)\s+(it\s+)?(up|out|off|down|over|through|away|back|around|along|in|on)\b/,
  // "X is/are Y" opinion patterns
  /\bthat's\s+(so|pretty|really|super|kind of|kinda)\s+\w+/,
  // Reaction patterns
  /\b(no\s+way|holy\s+cow|for\s+real|you\s+bet|my\s+bad|get\s+out|shut\s+up|come\s+on|give\s+me\s+a\s+break)\b/,
  // "I can't even" / "I don't even" patterns
  /\bi\s+(can't|don't|couldn't|wouldn't)\s+even\b/,
  // "What/How + adjective" exclamations
  /\b(what|how)\s+the\s+(heck|hell|actual)\b/,
  // Gonna/wanna/gotta patterns
  /\b(gonna|wanna|gotta)\s+\w+/,
  // "Let's + verb" suggestions
  /\blet's\s+(just\s+)?\w+/,
  // "Don't + verb" warnings
  /\bdon't\s+(even|just|ever)\s+\w+/,
  // Tag questions and confirmations
  /\bright\s*\?|you\s+know\s+what\s+i\s+mean|am\s+i\s+right/,
];

function splitIntoSentences(text: string): string[] {
  return text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function normalizeExpression(text: string): string {
  return text
    .toLowerCase()
    .replace(/[,;:]+\s*/g, ' ')  // remove punctuation noise
    .replace(/^['"]+|['"]+$/g, '') // strip surrounding quotes
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function containsUrl(text: string): boolean {
  return /https?:\/\/|www\./i.test(text);
}

function containsSpecialChars(text: string): boolean {
  return /[{}|\\<>@#$%^&*=+~()[\]]/.test(text);
}

function containsNumber(text: string): boolean {
  return /\d/.test(text);
}

function stripArticles(text: string): string {
  return text.replace(/\b(a|an|the)\b/g, '').replace(/\s+/g, ' ').trim();
}

function containsPhrasalVerb(text: string): boolean {
  const words = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < words.length - 1; i++) {
    const verb = words[i].replace(/[^a-z']/g, '');
    // Allow verb + (it/me/him/her/them/us) + particle
    let particleIdx = i + 1;
    const mid = words[i + 1]?.replace(/[^a-z]/g, '');
    if (['it', 'me', 'him', 'her', 'them', 'us'].includes(mid) && i + 2 < words.length) {
      particleIdx = i + 2;
    }
    const particle = words[particleIdx]?.replace(/[^a-z]/g, '');
    if (COMMON_VERBS.has(verb) && PHRASAL_VERB_PARTICLES.has(particle)) {
      return true;
    }
  }
  return false;
}

function matchesConversationalPattern(text: string): boolean {
  const lower = text.toLowerCase();
  return CONVERSATIONAL_PATTERNS.some((p) => lower.includes(p));
}

function matchesExpressionTemplate(text: string): boolean {
  return EXPRESSION_TEMPLATES.some((re) => re.test(text));
}

function containsInformalMarker(text: string): boolean {
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => INFORMAL_MARKERS.has(w.replace(/[^a-z]/g, '')));
}

function containsEmotionWord(text: string): boolean {
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => EMOTION_WORDS.has(w.replace(/[^a-z]/g, '')));
}

// ---------------------------------------------------------------------------
// Scoring (v2)
// ---------------------------------------------------------------------------

function scoreCandidate(candidate: string): number {
  let score = 0;
  const wc = wordCount(candidate);

  // Core signals
  if (containsPhrasalVerb(candidate)) score += 5;
  if (matchesConversationalPattern(candidate)) score += 5;
  if (matchesExpressionTemplate(candidate)) score += 4;
  if (containsInformalMarker(candidate)) score += 3;
  if (containsEmotionWord(candidate)) score += 2;

  // Completeness bonus: 4-7 word expressions that feel self-contained
  if (wc >= 4 && wc <= 7) score += 2;
  if (wc >= 3 && wc <= 5) score += 1;

  // Contraction bonus (sounds natural)
  if (/\b\w+'\w+\b/.test(candidate)) score += 1;

  // Penalize very short (likely incomplete)
  if (wc <= 2) score -= 3;

  // Penalize if it starts with a conjunction (probably a fragment)
  if (/^(and|but|or|so|because|if|when|that|which|who)\b/.test(candidate)) score -= 2;

  // Penalize stage direction / descriptive language that slipped through
  if (/^the\s+(lights?|door|room|car|phone|camera|screen|table|chair|window|curtain|music|scene)\b/i.test(candidate)) score -= 5;
  if (/\b(walks|enters|exits|sits|stands|turns|looks at|stares|gazes|pauses|nods|shakes|smiles|frowns|leans|reaches|crosses|picks up|puts down)\b/i.test(candidate)) score -= 4;
  if (/^(he|she|they|it)\s+(is|are|was|were|goes|walks|turns|looks|sits|stands|gets|starts)\b/i.test(candidate)) score -= 4;
  // Penalize proper nouns (character names, places) -- less useful as general expressions
  if (/\b[A-Z][a-z]+\b/.test(candidate) && !/\b(I|I'm|I'll|I've|I'd)\b/.test(candidate)) score -= 1;

  // Penalize if it ends with a preposition/article (incomplete thought)
  if (/\b(the|a|an|of|in|on|at|to|for|with|and|but|or|so)$/.test(candidate)) score -= 2;

  return score;
}

function shouldReject(candidate: string): boolean {
  if (containsUrl(candidate)) return true;
  if (containsSpecialChars(candidate)) return true;
  if (COMMON_REJECT_LIST.has(candidate)) return true;
  if (DEAD_FRAGMENTS.has(candidate)) return true;
  // Reject non-ASCII (except apostrophes)
  if (/[^\x20-\x7E']/.test(candidate)) return true;
  // Reject single words
  if (wordCount(candidate) < 2) return true;
  // Reject if ALL words are stop words (the, a, is, are, was, were, etc.)
  const STOP = new Set(['the','a','an','is','are','was','were','be','been','being',
    'have','has','had','do','does','did','will','would','could','should','may',
    'might','shall','can','must','i','you','he','she','it','we','they','me',
    'him','her','us','them','my','your','his','its','our','their','this','that',
    'these','those','am','not','no','so','if','or','and','but','at','in','on',
    'to','of','for','with','by','from','as','into','about','than']);
  const words = candidate.split(/\s+/);
  if (words.every(w => STOP.has(w.replace(/[^a-z']/g, '')))) return true;
  // Reject if contains number
  if (containsNumber(candidate)) return true;
  // Reject if starts or ends with punctuation remnants
  if (/^[,;:\-]|[,;:\-]$/.test(candidate)) return true;
  // Reject if starts with preposition (usually a fragment)
  if (/^(with|from|at|in|on|of|by|about|into|onto)\s/.test(candidate)) return true;
  // Reject if ends with article/preposition (incomplete thought)
  if (/\s(the|a|an|of|in|on|at|to|for|with|and|but|or|so|my|his|her|their|our|your)$/.test(candidate)) return true;
  // Note: candidates are already lowercased, so proper noun detection
  // happens via context (specific names are caught by the specificity check below)
  return false;
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------

function isDuplicate(candidate: string, existing: Set<string>): boolean {
  if (existing.has(candidate)) return true;
  const stripped = stripArticles(candidate);
  if (stripped.length > 3) {
    for (const expr of existing) {
      if (stripArticles(expr) === stripped) return true;
      // Only check substring if the candidate is long enough to be meaningful
      if (candidate.length > 15 && expr.length > 15) {
        if (candidate.includes(expr) || expr.includes(candidate)) return true;
      }
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Core extraction pipeline (v2 -- quality over quantity)
// ---------------------------------------------------------------------------

interface ExtractionContext {
  candidate: string;
  context: string;
}

function extractCandidates(lines: string[]): ExtractionContext[] {
  const results: ExtractionContext[] = [];
  const seen = new Set<string>();

  const allSentences: string[] = [];
  for (const line of lines) {
    allSentences.push(...splitIntoSentences(line));
  }

  for (const sentence of allSentences) {
    const normalized = normalizeExpression(sentence);
    const wc = wordCount(normalized);

    // Strategy 1: Complete short utterances (3-7 words)
    // Only keep if it sounds like a reusable expression, not a narrative fragment
    if (wc >= 3 && wc <= 7 && !seen.has(normalized)) {
      // Reject boring narrative fragments (subject + past simple telling a story)
      // But keep expressions like "i can't even", "don't even get me started"
      const boringNarrative = /^(i|he|she|we|they)\s+(was|were|went|got|did|said|told|made|took|came|saw|found|started|began|asked|called)\s/;
      // Reject relative clause fragments
      const relativeStart = /^(which|whom|whose)\s/;
      if (!boringNarrative.test(normalized) && !relativeStart.test(normalized)) {
        seen.add(normalized);
        results.push({ candidate: normalized, context: sentence });
      }
    }

    // Strategy 2: Extract COMPACT phrasal verb cores from longer sentences
    // Only the verb+(pronoun)+particle, max 4 words. "figure it out", "cut back", "get over it"
    if (wc > 4) {
      const words = normalized.split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const verb = words[i].replace(/[^a-z']/g, '');
        // Skip if preceded by "to" (infinitive fragment, not expression)
        if (i > 0 && words[i - 1].replace(/[^a-z]/g, '') === 'to') continue;
        let particleIdx = i + 1;
        const mid = words[i + 1]?.replace(/[^a-z]/g, '');
        if (['it', 'me', 'him', 'her', 'them', 'us'].includes(mid) && i + 2 < words.length) {
          particleIdx = i + 2;
        }
        const particle = words[particleIdx]?.replace(/[^a-z]/g, '');
        if (COMMON_VERBS.has(verb) && PHRASAL_VERB_PARTICLES.has(particle)) {
          // Core only: verb (+ pronoun) + particle (2-3 words)
          const core = words.slice(i, particleIdx + 1).join(' ');
          if (!seen.has(core) && wordCount(core) >= 2 && wordCount(core) <= 4) {
            seen.add(core);
            results.push({ candidate: core, context: sentence });
          }
        }
      }
    }

    // Strategy 3: Match conversational patterns in longer sentences
    if (wc > 6) {
      for (const pattern of CONVERSATIONAL_PATTERNS) {
        const idx = normalized.indexOf(pattern);
        if (idx !== -1) {
          // Extract the pattern with 1 word of context on each side (keep it tight)
          const before = normalized.slice(0, idx).trim().split(/\s+/);
          const after = normalized.slice(idx + pattern.length).trim().split(/\s+/);
          const contextBefore = before.slice(-1).join(' ');
          const contextAfter = after.slice(0, 1).join(' ');
          const chunk = [contextBefore, pattern, contextAfter].filter(Boolean).join(' ').trim();
          if (!seen.has(chunk) && wordCount(chunk) >= 3 && wordCount(chunk) <= 6) {
            seen.add(chunk);
            results.push({ candidate: chunk, context: sentence });
          }
          // Also extract just the pattern if it's long enough
          if (!seen.has(pattern) && wordCount(pattern) >= 3) {
            seen.add(pattern);
            results.push({ candidate: pattern, context: sentence });
          }
        }
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main Harvest Function
// ---------------------------------------------------------------------------

export async function runHarvest(
  existingExpressions: Set<string>,
  debug = false,
): Promise<HarvestedExpression[]> {
  const logs: string[] = [];
  try {
    // Pick source type (weighted: movie 40%, reddit 35%, youtube 25%)
    // Movies are pure dialogue = best quality
    const roll = Math.random();
    let content: FetchedContent | null = null;

    // Movie scripts are most reliable (imsdb.com SSR), weight heavily
    if (roll < 0.6) {
      logs.push(`primary: movie (roll=${roll.toFixed(2)})`);
      content = await fetchMovieScriptContent();
      logs.push(`movie result: ${content ? content.lines.length + ' lines' : 'null'}`);
    } else if (roll < 0.8) {
      logs.push(`primary: youtube (roll=${roll.toFixed(2)})`);
      content = await fetchYouTubeContent();
      logs.push(`youtube result: ${content ? content.lines.length + ' lines' : 'null'}`);
    } else {
      logs.push(`primary: reddit (roll=${roll.toFixed(2)})`);
      content = await fetchRedditContent();
      logs.push(`reddit result: ${content ? content.lines.length + ' lines' : 'null'}`);
    }

    // Fallback: movie first (most reliable), then youtube, reddit last (403 on Vercel)
    if (!content) {
      logs.push('fallback: movie');
      content = await fetchMovieScriptContent();
      logs.push(`movie fallback: ${content ? content.lines.length + ' lines' : 'null'}`);
    }
    if (!content) {
      logs.push('fallback: youtube');
      content = await fetchYouTubeContent();
      logs.push(`youtube fallback: ${content ? content.lines.length + ' lines' : 'null'}`);
    }
    if (!content) {
      logs.push('fallback: reddit');
      content = await fetchRedditContent();
      logs.push(`reddit fallback: ${content ? content.lines.length + ' lines' : 'null'}`);
    }
    if (!content) {
      if (debug) console.log('[harvest-debug]', logs.join(' | '));
      return [];
    }

    // Build normalized existing set for dedup
    const normalizedExisting = new Set<string>();
    for (const expr of existingExpressions) {
      normalizedExisting.add(normalizeExpression(expr));
    }

    // Extract candidates
    const raw = extractCandidates(content.lines);

    // Score, filter, deduplicate
    const seen = new Set<string>();
    const scored: HarvestedExpression[] = [];

    for (const item of raw) {
      const { candidate, context } = item;

      // Basic rejection
      if (shouldReject(candidate)) continue;

      // Word count filter
      const wc = wordCount(candidate);
      if (wc < 2 || wc > 8) continue;

      // Dedup against existing
      if (isDuplicate(candidate, normalizedExisting)) continue;

      // Dedup against already-accepted in this batch
      if (seen.has(candidate)) continue;
      if (isDuplicate(candidate, seen)) continue;

      const score = scoreCandidate(candidate);
      if (score < 4) continue; // quality threshold

      seen.add(candidate);
      normalizedExisting.add(candidate);

      scored.push({
        expression: candidate,
        score,
        source_type: content.source_type,
        source_title: content.source_title,
        source_url: content.source_url,
        context,
      });
    }

    // Sort by score DESC, take top 20
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 20);
  } catch {
    return [];
  }
}
