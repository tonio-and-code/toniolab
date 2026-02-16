export interface PodcastSegment {
    id: string;
    title: string;
    titleEn: string;
    audioUrl: string;
    duration: string;
}

export interface PodcastEpisode {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    audioUrl: string;
    duration: string; // "25:30" format
    publishDate: string; // ISO 8601 format
    topics: string[]; // ["Business", "Spirituality", "AI"]
    transcript?: string; // Optional full transcript
    segments?: PodcastSegment[]; // Optional chapter segments
}

export const podcastEpisodes: PodcastEpisode[] = [
    {
        id: "114",
        title: "自己紹介を英語で練習",
        titleEn: "Practicing Self-Introduction in English",
        description: "英語で自己紹介する練習。複数のバージョンを試して、最後にClaudeと一緒に振り返る。",
        descriptionEn: "Practice introducing myself in English. Trying multiple versions and reflecting on it with Claude at the end.",
        audioUrl: "https://pub-628af24ae7da43ac93bbfb202b34b73e.r2.dev/114intro1.m4a",
        duration: "15:00",
        publishDate: "2026-01-14",
        topics: ["Speaking", "Self-Introduction"],
        segments: [
            {
                id: "114-1",
                title: "自己紹介 Take 1",
                titleEn: "Self-Introduction Take 1",
                audioUrl: "https://pub-628af24ae7da43ac93bbfb202b34b73e.r2.dev/114intro1.m4a",
                duration: "4:30",
            },
            {
                id: "114-2",
                title: "自己紹介 Take 2",
                titleEn: "Self-Introduction Take 2",
                audioUrl: "https://pub-628af24ae7da43ac93bbfb202b34b73e.r2.dev/114intro2.m4a",
                duration: "2:40",
            },
            {
                id: "114-3",
                title: "自己紹介 Summary",
                titleEn: "Self-Introduction Summary",
                audioUrl: "https://pub-628af24ae7da43ac93bbfb202b34b73e.r2.dev/114intros1.m4a",
                duration: "3:30",
            },
            {
                id: "114-4",
                title: "Claudeと振り返り",
                titleEn: "Reflection with Claude",
                audioUrl: "https://pub-628af24ae7da43ac93bbfb202b34b73e.r2.dev/114claude.m4a",
                duration: "4:20",
            },
        ],
    },
    {
        id: "001",
        title: "第一回テスト配信",
        titleEn: "First Test Episode",
        description: "一人英会話ポッドキャストの最初のテスト配信です。",
        descriptionEn: "The first test episode of the solo English conversation podcast.",
        audioUrl: "https://pub-628af24ae7da43ac93bbfb202b34b73e.r2.dev/%E7%84%A1%E9%A1%8C.mp3",
        duration: "0:30",
        publishDate: "2026-01-13",
        topics: ["Test"],
    },
];

export function getEpisodeById(id: string): PodcastEpisode | undefined {
    return podcastEpisodes.find(ep => ep.id === id);
}

export function getEpisodesByTopic(topic: string): PodcastEpisode[] {
    return podcastEpisodes.filter(ep => ep.topics.includes(topic));
}

export function getLatestEpisodes(count: number = 5): PodcastEpisode[] {
    return [...podcastEpisodes]
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, count);
}
