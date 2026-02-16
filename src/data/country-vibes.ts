export const COUNTRY_VIBES: Record<string, { vibe: string; description: string; words: string[] }> = {
    "Japan": {
        vibe: "Harmony, Tradition, & Future",
        description: "An island nation where ancient traditions merge seamlessly with futuristic technology. Famous for cherry blossoms, samurai heritage, and a deep cultural emphasis on respect and craftsmanship.",
        words: ["Serenity", "Precision", "Hospitality", "Innovation", "Zen"]
    },
    "United States of America": {
        vibe: "Liberty, Ambition, & Diversity",
        description: "A vast landscape of diverse cultures and endless opportunity. From the skyscrapers of New York to the tech hubs of Silicon Valley, it embodies the spirit of ambition and personal freedom.",
        words: ["Liberty", "Diversity", "Ambition", "Frontier", "Enterprise"]
    },
    "United Kingdom": {
        vibe: "Royalty, History, & Wit",
        description: "A land of historic monarchies, rolling green hills, and dry wit. It has shaped modern history through literature, science, and the industrial revolution.",
        words: ["Sovereignty", "Heritage", "Sarcasm", "Etiquette", "Resilience"]
    },
    "France": {
        vibe: "Art, Romance, & Revolution",
        description: "The heart of European culture, known for its exquisite cuisine, revolutionary history, and unrivaled fashion. It celebrates the 'art of living' (l'art de vivre).",
        words: ["Esthetic", "Avant-garde", "Cuisine", "Chic", "Revolution"]
    },
    "Italy": {
        vibe: "Passion, History, & Flavor",
        description: "A peninsula defined by the Renaissance, Roman history, and a passionate love for food and family. Every stone tells a story of art and empire.",
        words: ["Renaissance", "Passion", "Craftsmanship", "Heritage", "Vibrant"]
    },
    "Germany": {
        vibe: "Efficiency, Logic, & Engineering",
        description: "A powerhouse of engineering and philosophy. Known for its precise craftsmanship, classical music history, and a culture that values order and efficiency.",
        words: ["Efficiency", "Structure", "Engineering", "Philosophy", "Zeitgeist"]
    },
    "China": {
        vibe: "Dynasty, Scale, & Balance",
        description: "One of the world's oldest civilizations, characterized by immense scale, deep philosophical roots, and a rapid modernization that balances the past and future.",
        words: ["Dynasty", "Prosperity", "Scale", "Harmony", "Longevity"]
    },
    "India": {
        vibe: "Spirituality, Chaos, & Color",
        description: "A vibrant tapestry of religions, languages, and landscapes. It acts as a sensory explosion where profound spirituality coexists with chaotic energy.",
        words: ["Diversity", "Spirituality", "Vibrant", "Karma", "Resilience"]
    },
    "Brazil": {
        vibe: "Rhythm, Nature, & Joy",
        description: "Home to the Amazon rainforest and the Carnival. A land pulsating with samba rhythms, biodiversity, and a warm, energetic approach to life.",
        words: ["Carnival", "Vibrant", "Passion", "Ecosystem", "Rhythm"]
    },
    "Australia": {
        vibe: "Outback, Nature, & Ease",
        description: "A continent of unique wildlife and vast, reddish outbacks. Its people are known for a laid-back attitude and a rugged resilience against harsh nature.",
        words: ["Laid-back", "Vastness", "Resilience", "Unique", "Adventure"]
    },
    "Canada": {
        vibe: "Nature, Kindness, & Space",
        description: "The second-largest country in the world, defined by its breathtaking wilderness, multicultural cities, and a reputation for extreme politeness and peace.",
        words: ["Wilderness", "Diversity", "Politeness", "Vast", "Northern"]
    },
    "Russia": {
        vibe: "Endurance, Cold, & Literature",
        description: "A massive transcontinental power with a history of endurance against harsh winters. Known for its deep, often melancholic, literary and artistic soul.",
        words: ["Endurance", "Melancholy", "Vastness", "Power", "Resillience"]
    },
    "Egypt": {
        vibe: "Ancient, Mystery, & Sand",
        description: "The cradle of civilization, dominated by the Nile and the Pyramids. A land where ancient mysteries still loom large over modern life.",
        words: ["Civilization", "Legacy", "Monumental", "Mystery", "Eternal"]
    },
    "South Africa": {
        vibe: "Diversity, Struggle, & Safari",
        description: "The 'Rainbow Nation', marked by a history of struggle against apartheid and famed for its breathtaking wildlife and diverse cultures.",
        words: ["Reconciliation", "Diversity", "Vibrant", "Wild", "Heritage"]
    },
    "Mexico": {
        vibe: "Color, Ancestry, & Flavor",
        description: "A vibrant fusion of indigenous Aztec/Mayan heritage and Spanish influence. Known for colorful festivals, deep family bonds, and spicy cuisine.",
        words: ["Fiesta", "Heritage", "Spice", "Vibrant", "Warmth"]
    },
    "Spain": {
        vibe: "Sun, Passion, & Siesta",
        description: "A land of sunshine, flamenco, and relaxed living. It balances a fiery passion for life with the leisurely pace of Mediterranean culture.",
        words: ["Passion", "Fiesta", "Relaxed", "Vibrant", "Heritage"]
    },
    "Argentina": {
        vibe: "Tango, Steak, & Passion",
        description: "The land of Tango and vast pampas. It carries a certain romantic melancholy and a fierce pride, especially in football and culture.",
        words: ["Passion", "Rhythm", "Melancholy", "Vast", "Pride"]
    },
    "Saudi Arabia": {
        vibe: "Desert, Oil, & Faith",
        description: "The birthplace of Islam, dominated by vast deserts. It is a land of deep religious tradition rapidly transforming through immense oil wealth.",
        words: ["Faith", "Wealth", "Tradition", "Hospitality", "Desert"]
    },
    "Turkey": {
        vibe: "East meets West",
        description: "The bridge between Europe and Asia. A historic melting pot of cultures, empires, and bazaars where two worlds collide.",
        words: ["Bridge", "Heritage", "Hospitality", "Bazaar", "Tasty"]
    },
    "South Korea": {
        vibe: "Technology, Pop, & Speed",
        description: "A hyper-modern dynamo known for its rapid technological rise, K-Pop culture, and a 'pali-pali' (hurry-hurry) lifestyle.",
        words: ["Dynamic", "Trend", "Respect", "Innovation", "Spicy"]
    },
    // Default fallback
    "Default": {
        vibe: "Discovering the Unknown",
        description: "A territory waiting to be explored. What secrets does this land hold? Research it briefly and define your own impression.",
        words: ["Exploration", "Journey", "Perspective", "Horizon", "Culture"]
    }
};

export const getCountryVibe = (countryName: string) => {
    return COUNTRY_VIBES[countryName] || COUNTRY_VIBES["Default"];
};
