'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EcosystemThread } from '@/data/ecosystem'
import Link from 'next/link'

// キャラクター定義
const CHARACTERS = {
    jijii: {
        name: 'コルクじじい',
        avatar: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/32c616ad-8c26-4945-1e8e-35040d65a100/public',
        color: '#D4AF37',
        voice: { rate: 0.85, pitch: 0.7 },
    },
    takumi: {
        name: 'AIタクミ',
        avatar: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/c3e01106-43b4-4d9c-b3af-f799f32e3300/public',
        color: '#10B981',
        voice: { rate: 1.0, pitch: 1.0 },
    },
    anya: {
        name: 'アーニャ',
        avatar: '/images/anya-avatar.png',
        color: '#EC4899',
        voice: { rate: 1.1, pitch: 1.3 },
    },
}

type CharacterKey = keyof typeof CHARACTERS

// セグメント種別
type SegmentType = 'opening' | 'weather' | 'news' | 'talk' | 'journal' | 'tips' | 'video'

interface Segment {
    type: SegmentType
    speaker: CharacterKey
    text: string
    label: string
    link?: string
    heroImage?: string
    videoId?: string
}

// Cloudflare Stream動画（ジャーナル記事IDまたはセグメントタイプと紐付け）
const VIDEOS: { id: string; title: string; description: string; journalId?: string; segmentType?: SegmentType }[] = [
    {
        id: '314973f61eccb467bdd3675145d2f2be',
        title: '職人の宇宙的ツールキット',
        description: 'NotebookLMで作成したポッドキャスト風動画。職人の道具について語る。',
        journalId: '046'
    },
    {
        id: 'e7ef8504173c6e0f14a347b46d46a021',
        title: '動画生成の依頼と完了',
        description: 'ピラミッドの「上」をハックする——$1Mの動画と、誰にも頼まれていない仕事。',
        journalId: '044'
    },
    {
        id: '22db52ea352b29e5872b8450550d7a2b',
        title: '横長動画生成の依頼',
        description: '3人のキャラクターが会議しているシーン。',
        segmentType: 'talk'
    }
]

// TALKセグメント用の動画ID
const TALK_VIDEO_ID = '22db52ea352b29e5872b8450550d7a2b'

interface JournalHighlight {
    id: string
    title: string
    summary: string
    excerpt: string
    heroImage?: string
    date: string
    readTime: number
    tags: string[]
}

interface NewsHighlight {
    title: string
    source: string
    link: string
    comment: string
}

interface TVData {
    weather: { temperature: number; humidity: number; description: string; code: number } | null
    journalHighlights?: JournalHighlight[]
    newsHighlights?: NewsHighlight[]
    content: {
        weatherComment: { speaker: CharacterKey; text: string } | null
        newsComment: { speaker: CharacterKey; text: string; link?: string } | null
        journalInsight: { speaker: CharacterKey; text: string; entryId: string; heroImage?: string } | null
        businessTip: { speaker: CharacterKey; text: string } | null
    }
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
}

// 時間帯別挨拶
const TIME_GREETINGS: Record<string, string> = {
    morning: 'おはようさん。コルクじじいTVの時間じゃ。今日も現場で使える情報を届けるぞい。',
    afternoon: 'どうもどうも。昼のコルクじじいTVじゃ。休憩中のみなさん、ゆっくり見ていってくれい。',
    evening: 'こんばんは。夕方のコルクじじいTVじゃ。今日一日お疲れさん。',
    night: 'まだ起きとるんか。夜更かしのお供にコルクじじいTVじゃ。',
}

// セグメントラベル
const SEGMENT_LABELS: Record<SegmentType, string> = {
    opening: 'OPENING',
    weather: 'WEATHER',
    news: 'NEWS',
    talk: 'TALK',
    journal: 'JOURNAL',
    tips: 'TIPS',
    video: 'VIDEO',
}

// セグメント別背景画像
const SEGMENT_BACKGROUNDS: Record<SegmentType, string> = {
    opening: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/60767741-d372-465e-a3d8-e47d6b55ff00/public',
    weather: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&q=80',
    news: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    talk: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/60767741-d372-465e-a3d8-e47d6b55ff00/public',
    journal: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    tips: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    video: '',
}

export default function CorkJijiiTV() {
    const [tvData, setTvData] = useState<TVData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [segments, setSegments] = useState<Segment[]>([])
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    // データ取得
    const fetchAllData = useCallback(async () => {
        setIsLoading(true)
        try {
            const [tvRes, ecoRes] = await Promise.all([
                fetch('/api/tv-data'),
                fetch('/api/ecosystem?limit=5')
            ])

            const tvJson = await tvRes.json()
            const ecoJson = await ecoRes.json()

            if (tvJson.success) setTvData(tvJson)

            buildSegments(tvJson, ecoJson.data || [])
        } catch {
            buildSegments(null, [])
        } finally {
            setIsLoading(false)
        }
    }, [])

    // セグメント構築
    const buildSegments = (tv: TVData | null, eco: EcosystemThread[]) => {
        const newSegments: Segment[] = []

        // 1. オープニング
        const timeOfDay = tv?.timeOfDay || 'afternoon'
        newSegments.push({
            type: 'opening',
            speaker: 'jijii',
            text: TIME_GREETINGS[timeOfDay],
            label: 'OPENING'
        })

        // 2. 天気予報
        if (tv?.content.weatherComment) {
            newSegments.push({
                type: 'weather',
                speaker: 'jijii',
                text: tv.content.weatherComment.text,
                label: tv.weather ? `${tv.weather.temperature}° ${tv.weather.description}` : 'WEATHER'
            })
        }

        // 3. 建設業ニュース（複数のRSSニュースを表示）
        if (tv?.newsHighlights && tv.newsHighlights.length > 0) {
            tv.newsHighlights.slice(0, 3).forEach((news, i) => {
                newSegments.push({
                    type: 'news',
                    speaker: i % 2 === 0 ? 'jijii' : 'takumi',
                    text: `【${news.source}】${news.title}...${news.comment}`,
                    label: news.source,
                    link: news.link || undefined
                })
            })
        } else if (tv?.content.newsComment) {
            // フォールバック
            newSegments.push({
                type: 'news',
                speaker: 'jijii',
                text: tv.content.newsComment.text,
                label: 'NEWS',
                link: tv.content.newsComment.link
            })
        }

        // 4. エコシステムトーク（動画付き）
        if (eco.length > 0) {
            const thread = eco[0]
            thread.messages.forEach((msg, i) => {
                newSegments.push({
                    type: 'talk',
                    speaker: msg.character as CharacterKey,
                    text: msg.message,
                    label: i === 0 && msg.trigger ? msg.trigger : 'TALK',
                    videoId: TALK_VIDEO_ID
                })
            })
        }

        // 5. ジャーナルハイライト（動画があれば紐付け）
        const getVideoIdForJournal = (journalId: string) => {
            const video = VIDEOS.find(v => v.journalId === journalId)
            return video?.id
        }

        if (tv?.journalHighlights && tv.journalHighlights.length > 0) {
            tv.journalHighlights.slice(0, 3).forEach((article, i) => {
                newSegments.push({
                    type: 'journal',
                    speaker: i % 2 === 0 ? 'jijii' : 'takumi',
                    text: i === 0
                        ? `ジャーナル紹介じゃ。「${article.title}」...${article.summary}`
                        : `おすすめ記事じゃ。「${article.title}」...${article.summary}`,
                    label: article.title.substring(0, 20),
                    link: `/journal/${article.id}`,
                    heroImage: article.heroImage,
                    videoId: getVideoIdForJournal(article.id)
                })
            })
        } else if (tv?.content.journalInsight) {
            newSegments.push({
                type: 'journal',
                speaker: 'jijii',
                text: tv.content.journalInsight.text,
                label: 'JOURNAL',
                link: `/journal/${tv.content.journalInsight.entryId}`,
                heroImage: tv.content.journalInsight.heroImage,
                videoId: getVideoIdForJournal(tv.content.journalInsight.entryId)
            })
        }

        // 6. 豆知識
        if (tv?.content.businessTip) {
            newSegments.push({
                type: 'tips',
                speaker: tv.content.businessTip.speaker,
                text: tv.content.businessTip.text,
                label: 'TIPS'
            })
        }

        // 7. 動画コーナー
        VIDEOS.forEach(video => {
            newSegments.push({
                type: 'video',
                speaker: 'jijii',
                text: `今日の動画コーナーじゃ。「${video.title}」を見てくれい。${video.description}`,
                label: video.title,
                videoId: video.id,
                link: video.journalId ? `/journal/${video.journalId}` : undefined
            })
        })

        // フォールバック
        if (newSegments.length === 0) {
            newSegments.push({
                type: 'opening',
                speaker: 'jijii',
                text: 'おう、コルクじじいTVじゃ。今日もコルクの素晴らしさを語っていくぞい。',
                label: 'Cork Jijii TV'
            })
        }

        setSegments(newSegments)
        setCurrentSegmentIndex(0)
        setDisplayedText('')
    }

    // 初回ロード + ポーリング
    useEffect(() => {
        fetchAllData()
        const interval = setInterval(fetchAllData, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [fetchAllData])

    // TTS
    const speakText = useCallback((text: string, speaker: CharacterKey) => {
        if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return

        window.speechSynthesis.cancel()
        const char = CHARACTERS[speaker]
        const cleanText = text.replace(/【.*?】/g, '')
        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.lang = 'ja-JP'
        utterance.rate = char.voice.rate
        utterance.pitch = char.voice.pitch

        const voices = window.speechSynthesis.getVoices()
        const japaneseVoice = voices.find(v => v.lang.includes('ja'))
        if (japaneseVoice) utterance.voice = japaneseVoice

        window.speechSynthesis.speak(utterance)
    }, [isMuted])

    // タイピングエフェクト
    useEffect(() => {
        if (segments.length === 0 || isLoading) return

        const currentSegment = segments[currentSegmentIndex]
        if (!currentSegment) return

        const fullText = currentSegment.text

        if (displayedText === '' && !isTyping) {
            setIsTyping(true)
            speakText(fullText, currentSegment.speaker)
        }

        if (isTyping && displayedText.length < fullText.length) {
            const timer = setTimeout(() => {
                setDisplayedText(fullText.slice(0, displayedText.length + 1))
            }, 40 + Math.random() * 20)
            return () => clearTimeout(timer)
        }

        if (displayedText.length >= fullText.length) {
            setIsTyping(false)
        }
    }, [segments, currentSegmentIndex, displayedText, isTyping, isLoading, speakText])

    // セグメント進行
    useEffect(() => {
        if (segments.length === 0 || isTyping || isLoading) return

        const timer = setTimeout(() => {
            const nextIndex = (currentSegmentIndex + 1) % segments.length
            setCurrentSegmentIndex(nextIndex)
            setDisplayedText('')
        }, 5000)

        return () => clearTimeout(timer)
    }, [segments, currentSegmentIndex, isTyping, isLoading])

    const currentSegment = segments[currentSegmentIndex]
    const currentChar = currentSegment ? CHARACTERS[currentSegment.speaker] : CHARACTERS.jijii

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-lg">
            {/* ヘッダー */}
            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 px-6 py-4 border-b border-stone-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-emerald-700 text-sm font-medium tracking-wider">LIVE</span>
                        </div>
                        <h2 className="text-stone-800 font-semibold text-lg tracking-wide">Cork Jijii TV</h2>
                    </div>
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isMuted
                                ? 'bg-stone-200 text-stone-500'
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                    >
                        {isMuted ? 'MUTED' : 'SOUND ON'}
                    </button>
                </div>
            </div>

            {/* セグメントナビ */}
            <div className="bg-stone-50 px-6 py-3 border-b border-stone-100">
                <div className="flex gap-2 overflow-x-auto">
                    {segments.map((seg, i) => (
                        <button
                            key={i}
                            onClick={() => { setCurrentSegmentIndex(i); setDisplayedText(''); }}
                            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                                i === currentSegmentIndex
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : i < currentSegmentIndex
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-white text-stone-500 border border-stone-200 hover:border-amber-300'
                            }`}
                        >
                            {SEGMENT_LABELS[seg.type]}
                        </button>
                    ))}
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="p-6">
                {/* ビデオエリア */}
                <div className="relative aspect-video bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
                    {/* 動画再生（JOURNALやVIDEOセグメントでvideoIdがあれば再生） */}
                    {currentSegment?.videoId ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`video-${currentSegmentIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 z-30"
                            >
                                <iframe
                                    src={`https://customer-g3tngdysgdne3fza.cloudflarestream.com/${currentSegment.videoId}/iframe?muted=true&autoplay=true&loop=true&controls=false&preload=auto`}
                                    className="w-full h-full"
                                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                    allowFullScreen
                                />
                                {/* 動画オーバーレイ: タイトル + CTA */}
                                {currentSegment.link && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        {/* 下部グラデーション */}
                                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
                                        {/* タイトルとCTA */}
                                        <div className="absolute bottom-4 left-4 right-20 pointer-events-auto">
                                            <p className="text-white text-sm font-medium drop-shadow-lg line-clamp-2 mb-2">
                                                {currentSegment.label}
                                            </p>
                                            <Link
                                                href={currentSegment.link}
                                                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-lg hover:scale-105"
                                            >
                                                <span>記事を読む</span>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        /* 背景画像 */
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSegmentIndex}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={currentSegment?.heroImage || SEGMENT_BACKGROUNDS[currentSegment?.type || 'opening']}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                                {/* グラデーションオーバーレイ */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-white/20" />
                                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {/* ローディング */}
                    {isLoading && (
                        <div className="absolute inset-0 z-40 bg-white/90 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-stone-500 text-sm">Loading...</p>
                            </div>
                        </div>
                    )}

                    {/* セグメントラベル */}
                    <div className="absolute top-4 left-4 z-20">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-stone-200 shadow-sm">
                            <span className="text-amber-600 text-xs font-semibold tracking-wider">
                                {SEGMENT_LABELS[currentSegment?.type || 'opening']}
                            </span>
                        </div>
                    </div>

                    {/* 天気情報 */}
                    {currentSegment?.type === 'weather' && tvData?.weather && (
                        <div className="absolute top-4 right-4 z-20">
                            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-stone-200 shadow-sm text-right">
                                <div className="text-2xl font-light text-stone-800">{tvData.weather.temperature}°C</div>
                                <div className="text-xs text-stone-500">{tvData.weather.description}</div>
                            </div>
                        </div>
                    )}

                    {/* キャラクター */}
                    <div className="absolute bottom-4 right-4 z-20">
                        <motion.div
                            animate={isTyping ? { scale: [1, 1.02, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 0.4 }}
                        >
                            <div
                                className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-3 shadow-lg bg-white"
                                style={{ borderColor: currentChar.color }}
                            >
                                <img src={currentChar.avatar} alt={currentChar.name} className="w-full h-full object-cover" />
                            </div>
                            {isTyping && (
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: currentChar.color }}
                                            animate={{ scale: [1, 1.4, 1] }}
                                            transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.1 }}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* 進捗 */}
                    <div className="absolute bottom-4 left-4 z-20">
                        <span className="text-stone-400 text-xs font-mono">
                            {currentSegmentIndex + 1} / {segments.length}
                        </span>
                    </div>

                    {/* 進捗バー */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-stone-200">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${((currentSegmentIndex + 1) / segments.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* 発言内容 */}
                <div className="mt-4 bg-stone-50 rounded-xl p-4 min-h-[80px] border border-stone-100">
                    <div className="flex items-start gap-3">
                        <div
                            className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0"
                            style={{ backgroundColor: currentChar.color }}
                        />
                        <div className="flex-1">
                            <div className="text-xs font-medium mb-2" style={{ color: currentChar.color }}>
                                {currentChar.name}
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSegmentIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <p className="text-stone-700 text-sm leading-relaxed">
                                        {displayedText}
                                        {isTyping && <span className="inline-block w-0.5 h-4 bg-amber-500 ml-1 animate-pulse" />}
                                    </p>
                                    {currentSegment?.link && !isTyping && (
                                        <Link
                                            href={currentSegment.link}
                                            className="inline-block mt-3 text-amber-600 text-xs font-medium hover:text-amber-700 transition-colors"
                                        >
                                            Read more
                                        </Link>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* フッター */}
            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 px-6 py-3 border-t border-stone-200">
                <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>有限会社イワサキ内装</span>
                    <span className="tracking-wider">TOKYO / KANAGAWA</span>
                </div>
            </div>
        </div>
    )
}
