'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// =============================================================================
// TYPES
// =============================================================================

type SectionId =
  | 'hero'
  | 'part1' | 'part1-1' | 'part1-2' | 'part1-3'
  | 'part2' | 'part2-1' | 'part2-2' | 'part2-3' | 'part2-4'
  | 'part3' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6'
  | 'part4'
  | 'part5'
  | 'closing'
  | 'omake'

type TocItem = {
  id: SectionId
  label: string
  indent: number
}

// =============================================================================
// TABLE OF CONTENTS DATA
// =============================================================================

const TOC_ITEMS: TocItem[] = [
  { id: 'part1', label: 'Part 1: なぜ話せないのか', indent: 0 },
  { id: 'part1-1', label: '1.1 翻訳ボトルネック', indent: 1 },
  { id: 'part1-2', label: '1.2 脳内データベース問題', indent: 1 },
  { id: 'part1-3', label: '1.3 フィードバックループ', indent: 1 },
  { id: 'part2', label: 'Part 2: 目標を変えろ', indent: 0 },
  { id: 'part2-1', label: '2.1 ネイティブは目標じゃない', indent: 1 },
  { id: 'part2-2', label: '2.2 長谷川モデル', indent: 1 },
  { id: 'part2-3', label: '2.3 ロハスモデル', indent: 1 },
  { id: 'part2-4', label: '2.4 3つのレベル', indent: 1 },
  { id: 'part3', label: 'Part 3: 6ステップメソッド', indent: 0 },
  { id: 'step1', label: 'Step 1: チャンク武装', indent: 1 },
  { id: 'step2', label: 'Step 2: 2語発射', indent: 1 },
  { id: 'step3', label: 'Step 3: 母音を殺せ', indent: 1 },
  { id: 'step4', label: 'Step 4: リズムをコピー', indent: 1 },
  { id: 'step5', label: 'Step 5: 沈黙を埋めろ', indent: 1 },
  { id: 'step6', label: 'Step 6: 1分間スピーチ', indent: 1 },
  { id: 'part4', label: 'Part 4: 会話サバイバル', indent: 0 },
  { id: 'part5', label: 'Part 5: 理論的背景', indent: 0 },
  { id: 'closing', label: '最後に: 最も大事なこと', indent: 0 },
  { id: 'omake', label: 'おまけ: 覚者と言語学', indent: 0 },
]

// =============================================================================
// DATA: CHUNK TABLES
// =============================================================================

const OPINION_CHUNKS = [
  { en: 'I think...', ja: '思うんだけど...' },
  { en: 'I feel like...', ja: 'なんか...って感じ' },
  { en: 'I mean...', ja: 'いや、つまり...' },
  { en: 'The thing is...', ja: '問題はさ...' },
  { en: "Here's the thing...", ja: 'ポイントはね...' },
  { en: 'Honestly...', ja: '正直...' },
  { en: 'To be honest...', ja: '本音を言うと...' },
  { en: 'In my opinion...', ja: '俺的には...' },
  { en: 'Personally...', ja: '個人的には...' },
  { en: "If you ask me...", ja: '聞かれたら...' },
]

const EXPLAIN_CHUNKS = [
  { en: 'So basically...', ja: 'つまり要は...' },
  { en: "It's like...", ja: '例えるなら...' },
  { en: 'What happened was...', ja: '何があったかっていうと...' },
  { en: 'The reason is...', ja: '理由はね...' },
  { en: 'What I mean is...', ja: '言いたいのは...' },
  { en: "It's kind of like...", ja: 'なんていうか...' },
  { en: 'The way I see it...', ja: '俺の見方だと...' },
  { en: 'Think of it this way...', ja: 'こう考えてみて...' },
]

const REACTION_CHUNKS = [
  { en: "That's a good point, but...", ja: 'いいポイントだけど...' },
  { en: 'I see what you mean, but...', ja: '言いたいことはわかるけど...' },
  { en: 'Wait, really?', ja: 'え、マジで？' },
  { en: 'No way.', ja: 'ウソでしょ。' },
  { en: 'That makes sense.', ja: 'なるほどね。' },
  { en: 'Right, right.', ja: 'うんうん。' },
  { en: 'Exactly.', ja: 'まさにそう。' },
  { en: 'Oh, for sure.', ja: 'あー、確かに。' },
  { en: "I didn't know that.", ja: 'それ知らなかった。' },
  { en: 'Same here.', ja: '俺もそう。' },
]

const CONNECTOR_CHUNKS = [
  { en: 'And then...', ja: 'で、それから...' },
  { en: 'But the thing is...', ja: 'でもさ...' },
  { en: 'So what happened was...', ja: 'で、何が起きたかっていうと...' },
  { en: 'Which is why...', ja: 'だからこそ...' },
  { en: 'Not gonna lie...', ja: 'ぶっちゃけ...' },
  { en: 'On top of that...', ja: 'しかもさ...' },
  { en: 'The crazy thing is...', ja: 'ヤバいのが...' },
  { en: 'Speaking of which...', ja: 'それで思い出したけど...' },
]

const FILLER_CHUNKS = [
  { en: 'Let me think...', ja: 'ちょっと考えさせて...' },
  { en: 'How do I put this...', ja: 'なんて言えばいいかな...' },
  { en: 'You know what...', ja: 'あのさ...' },
  { en: 'I mean, like...', ja: 'いや、なんか...' },
  { en: "It's hard to explain, but...", ja: '説明しにくいけど...' },
  { en: 'What was I saying...', ja: '何の話だっけ...' },
]

// =============================================================================
// DATA: CONTRACTION TABLE
// =============================================================================

const CONTRACTIONS = [
  { full: 'going to', short: 'gonna', kana: 'ゴナ' },
  { full: 'want to', short: 'wanna', kana: 'ワナ' },
  { full: 'have to', short: 'hafta', kana: 'ハフタ' },
  { full: 'got to', short: 'gotta', kana: 'ガタ' },
  { full: 'kind of', short: 'kinda', kana: 'カインダ' },
  { full: 'sort of', short: 'sorta', kana: 'ソータ' },
  { full: 'a lot of', short: 'alotta', kana: 'アラタ' },
  { full: "don't know", short: 'dunno', kana: 'ダノ' },
  { full: 'let me', short: 'lemme', kana: 'レミ' },
  { full: 'give me', short: 'gimme', kana: 'ギミ' },
  { full: 'because', short: "'cause", kana: 'コズ' },
  { full: 'them', short: "'em", kana: 'エム' },
  { full: 'about', short: "'bout", kana: 'バウト' },
  { full: 'probably', short: 'prolly', kana: 'プロリ' },
  { full: 'actually', short: 'akshully', kana: 'アクシュリ' },
]

// =============================================================================
// DATA: EMERGENCY PHRASES
// =============================================================================

const EMERGENCY_CANT_UNDERSTAND = [
  { en: 'Sorry, could you say that again?', ja: 'もう一回言ってもらえますか？' },
  { en: 'Wait, what do you mean by...?', ja: 'え、...ってどういう意味？' },
  { en: 'I got the first part, but...', ja: '最初はわかったけど...' },
  { en: "You lost me at...", ja: '...のところからわからなくなった' },
  { en: "Can you say that slower?", ja: 'もうちょっとゆっくり言える？' },
  { en: "I'm not following.", ja: 'ついていけてない。' },
]

const EMERGENCY_TOPIC_CHANGE = [
  { en: 'Oh, that reminds me...', ja: 'あ、それで思い出したけど...' },
  { en: 'Speaking of which...', ja: 'そういえば...' },
  { en: 'By the way...', ja: 'ところで...' },
  { en: 'Totally different topic, but...', ja: '全然違う話だけど...' },
  { en: 'Oh wait, I wanted to ask you...', ja: 'あ、聞きたかったんだけど...' },
]

const EMERGENCY_ENDING = [
  { en: "I should get going.", ja: 'そろそろ行かないと。' },
  { en: "Anyway, it was great talking to you.", ja: 'とにかく、話せてよかった。' },
  { en: "I'll catch you later.", ja: 'また後で。' },
  { en: "Let me know if you need anything.", ja: '何かあったら言って。' },
  { en: "We should do this again sometime.", ja: 'またやろうよ。' },
]

// =============================================================================
// DATA: 1-MINUTE SPEECH TOPICS
// =============================================================================

const SPEECH_TOPICS = [
  { en: 'What I did last weekend', ja: '先週末にしたこと' },
  { en: 'My favorite food and why', ja: '好きな食べ物とその理由' },
  { en: 'Something that annoyed me recently', ja: '最近イラッとしたこと' },
  { en: 'A place I want to visit', ja: '行きたい場所' },
  { en: 'My morning routine', ja: '朝のルーティン' },
  { en: 'Something I learned recently', ja: '最近学んだこと' },
]

// =============================================================================
// DATA: PELLEGRINO TABLE
// =============================================================================

const PELLEGRINO_DATA = [
  { lang: 'Japanese', langJa: '日本語', syllPerSec: '7.84', bitsPerSyll: '~5', totalBits: '~39' },
  { lang: 'English', langJa: '英語', syllPerSec: '6.19', bitsPerSyll: '~7', totalBits: '~39' },
  { lang: 'Mandarin', langJa: '中国語', syllPerSec: '5.18', bitsPerSyll: '~9', totalBits: '~39' },
  { lang: 'Spanish', langJa: 'スペイン語', syllPerSec: '7.82', bitsPerSyll: '~5', totalBits: '~39' },
  { lang: 'French', langJa: 'フランス語', syllPerSec: '7.18', bitsPerSyll: '~6', totalBits: '~39' },
]

// =============================================================================
// COMPONENTS
// =============================================================================

function ChunkTable({ title, chunks, color }: { title: string; chunks: { en: string; ja: string }[]; color: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const previewCount = 3

  return (
    <div style={{ marginBottom: '16px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '12px 16px',
          backgroundColor: isOpen ? color : '#fafaf9',
          color: isOpen ? '#fff' : '#44403c',
          border: `1px solid ${isOpen ? color : '#e7e5e4'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <span>{title} ({chunks.length})</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          &#9660;
        </span>
      </button>
      {/* Preview when closed */}
      {!isOpen && (
        <div style={{ padding: '8px 16px', fontSize: '13px', color: '#78716c' }}>
          {chunks.slice(0, previewCount).map((c, i) => (
            <span key={i}>{c.en}{i < previewCount - 1 ? ' / ' : '...'}</span>
          ))}
        </div>
      )}
      {/* Full table when open */}
      {isOpen && (
        <div style={{ border: '1px solid #e7e5e4', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {chunks.map((chunk, i) => (
                <tr key={i} style={{ borderBottom: i < chunks.length - 1 ? '1px solid #f5f5f4' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 500, color: '#1c1917', width: '50%' }}>
                    {chunk.en}
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: '13px', color: '#78716c' }}>
                    {chunk.ja}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function EmergencyTable({ title, phrases }: { title: string; phrases: { en: string; ja: string }[] }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1c1917', marginBottom: '8px' }}>{title}</h4>
      <div style={{ border: '1px solid #e7e5e4', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {phrases.map((p, i) => (
              <tr key={i} style={{ borderBottom: i < phrases.length - 1 ? '1px solid #f5f5f4' : 'none' }}>
                <td style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 500, color: '#1c1917' }}>
                  {p.en}
                </td>
                <td style={{ padding: '10px 16px', fontSize: '13px', color: '#78716c' }}>
                  {p.ja}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KeyPoint({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '16px 20px',
      backgroundColor: '#fffbeb',
      borderLeft: '4px solid #D4AF37',
      borderRadius: '0 8px 8px 0',
      marginBottom: '20px',
      fontSize: '14px',
      lineHeight: '1.8',
      color: '#44403c',
    }}>
      {children}
    </div>
  )
}

function PracticeBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '16px 20px',
      backgroundColor: '#ecfdf5',
      borderLeft: '4px solid #10B981',
      borderRadius: '0 8px 8px 0',
      marginBottom: '20px',
      fontSize: '14px',
      lineHeight: '1.8',
      color: '#44403c',
    }}>
      {children}
    </div>
  )
}

function CompareBox({ wrong, right }: { wrong: string; right: string }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <div style={{
        flex: '1 1 200px',
        padding: '12px 16px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#991b1b',
      }}>
        <span style={{ fontWeight: 700, marginRight: '8px' }}>NG:</span>{wrong}
      </div>
      <div style={{
        flex: '1 1 200px',
        padding: '12px 16px',
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#166534',
      }}>
        <span style={{ fontWeight: 700, marginRight: '8px' }}>OK:</span>{right}
      </div>
    </div>
  )
}

function SectionHeading({ id, number, title }: { id: string; number: string; title: string }) {
  return (
    <h2
      id={id}
      style={{
        fontSize: '24px',
        fontWeight: 800,
        color: '#1c1917',
        marginBottom: '8px',
        paddingTop: '48px',
        scrollMarginTop: '80px',
      }}
    >
      <span style={{ color: '#D4AF37', marginRight: '8px' }}>{number}</span>
      {title}
    </h2>
  )
}

function SubSectionHeading({ id, number, title }: { id: string; number: string; title: string }) {
  return (
    <h3
      id={id}
      style={{
        fontSize: '18px',
        fontWeight: 700,
        color: '#44403c',
        marginBottom: '8px',
        paddingTop: '32px',
        scrollMarginTop: '80px',
      }}
    >
      <span style={{ color: '#a8a29e', marginRight: '6px' }}>{number}</span>
      {title}
    </h3>
  )
}

function StepHeading({ id, step, title }: { id: string; step: number; title: string }) {
  return (
    <h3
      id={id}
      style={{
        fontSize: '18px',
        fontWeight: 700,
        color: '#44403c',
        marginBottom: '8px',
        paddingTop: '32px',
        scrollMarginTop: '80px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: '#10B981',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 800,
        flexShrink: 0,
      }}>
        {step}
      </span>
      {title}
    </h3>
  )
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '15px',
      lineHeight: '1.9',
      color: '#57534e',
      marginBottom: '16px',
    }}>
      {children}
    </p>
  )
}

// =============================================================================
// COLLAPSIBLE SECTION (for Part 5)
// =============================================================================

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div style={{ marginBottom: '16px', border: '1px solid #e7e5e4', borderRadius: '8px', overflow: 'hidden' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '14px 20px',
          backgroundColor: '#fafaf9',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '15px',
          color: '#44403c',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{title}</span>
        <span style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
          fontSize: '12px',
          color: '#a8a29e',
        }}>
          &#9660;
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e7e5e4' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// TABLE OF CONTENTS SIDEBAR
// =============================================================================

function TocSidebar({ activeSection, onNavigate }: { activeSection: string; onNavigate: (id: string) => void }) {
  return (
    <nav style={{
      width: '220px',
      position: 'sticky',
      top: '80px',
      alignSelf: 'flex-start',
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto',
      paddingRight: '16px',
      flexShrink: 0,
    }}>
      <p style={{
        fontSize: '10px',
        fontWeight: 700,
        color: '#a8a29e',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '12px',
      }}>
        Contents
      </p>
      {TOC_ITEMS.map((item) => {
        const isActive = activeSection === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: `4px 0 4px ${item.indent * 16}px`,
              fontSize: item.indent === 0 ? '13px' : '12px',
              fontWeight: item.indent === 0 ? 600 : 400,
              color: isActive ? '#D4AF37' : item.indent === 0 ? '#44403c' : '#78716c',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              lineHeight: '1.8',
              transition: 'color 0.15s ease',
              borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
              paddingLeft: `${item.indent * 16 + 8}px`,
            }}
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

// =============================================================================
// MOBILE TOC
// =============================================================================

function MobileToc({ activeSection, onNavigate }: { activeSection: string; onNavigate: (id: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNav = useCallback((id: string) => {
    onNavigate(id)
    setIsOpen(false)
  }, [onNavigate])

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 100,
    }}>
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 99,
            }}
          />
          <div style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            left: '20px',
            maxHeight: '60vh',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            overflowY: 'auto',
            padding: '16px',
            zIndex: 100,
          }}>
            <p style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#a8a29e',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '8px',
            }}>
              Contents
            </p>
            {TOC_ITEMS.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: `6px ${item.indent * 16 + 8}px`,
                    fontSize: item.indent === 0 ? '14px' : '13px',
                    fontWeight: item.indent === 0 ? 600 : 400,
                    color: isActive ? '#D4AF37' : item.indent === 0 ? '#44403c' : '#78716c',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#D4AF37',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(212,175,55,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          position: 'relative',
          zIndex: 101,
        }}
        aria-label="Table of contents"
      >
        {isOpen ? '\u2715' : '\u2630'}
      </button>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function SpeakingGuidePage() {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [isMobile, setIsMobile] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Check mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // IntersectionObserver for scroll tracking
  useEffect(() => {
    const ids = TOC_ITEMS.map((item) => item.id)
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e7e5e4',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/english" style={{
            fontSize: '12px',
            color: '#a8a29e',
            textDecoration: 'none',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            English Learning
          </Link>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#44403c' }}>
            Speaking Guide
          </span>
          <Link href="/" style={{
            fontSize: '12px',
            color: '#a8a29e',
            textDecoration: 'none',
          }}>
            Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        id="hero"
        style={{
          paddingTop: '100px',
          paddingBottom: '48px',
          textAlign: 'center',
          borderBottom: '1px solid #e7e5e4',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#D4AF37',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '16px',
          }}>
            Complete Guide
          </p>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#1c1917',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}>
            スピーキング完全ガイド
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#78716c',
            lineHeight: 1.8,
            marginBottom: '24px',
          }}>
            なぜ日本人は英語が話せないのか。何を目指すべきか。<br />
            具体的に何をすればいいのか。このガイド1冊で完結する。
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#a8a29e',
          }}>
            <span>リスニング → スピーキング → 会話</span>
          </div>
        </div>
      </section>

      {/* Main Layout: TOC + Content */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        gap: '40px',
        padding: '0 24px',
      }}>
        {/* Desktop TOC */}
        {!isMobile && (
          <TocSidebar activeSection={activeSection} onNavigate={handleNavigate} />
        )}

        {/* Content */}
        <div ref={contentRef} style={{
          flex: 1,
          minWidth: 0,
          paddingBottom: '80px',
          maxWidth: isMobile ? '100%' : '760px',
        }}>

          {/* ============================================================= */}
          {/* PART 1: WHY YOU CAN'T SPEAK */}
          {/* ============================================================= */}

          <SectionHeading id="part1" number="Part 1" title="なぜ話せないのか" />
          <Paragraph>
            あなたは英語を「知っている」。文法も単語も中学・高校で6年間やった。TOEICのスコアもそこそこある。
            なのに、いざ話すとなると口から何も出てこない。なぜか。
          </Paragraph>
          <Paragraph>
            原因は3つある。どれもあなたの「努力不足」ではなく、日本語と英語の構造的な違いから来ている。
          </Paragraph>

          <KeyPoint>
            <strong>大前提: リスニングが先。</strong><br />
            聞けない音は発音できない。聞き取れない単語は会話で使えない。<br /><br />
            長谷川滋利 (元エンジェルス)がアメリカのテレビで自然に受け答えできるのは、
            相手の英語が<strong>完全に聞こえている</strong>から。
            質問を理解し、ジョークを拾い、会話のリズムに乗れている。
            スピーキングはリスニングの上に建つ。土台なしに話す練習をしても砂上の楼閣。<br /><br />
            このガイドはスピーキングに特化している。
            もし英語がほとんど聞き取れない状態なら、<strong>まずリスニングに時間を使え</strong>。
            聞こえるようになってから、ここに戻ってこい。
          </KeyPoint>

          <SubSectionHeading id="part1-1" number="1.1" title="翻訳ボトルネック -- SOV vs SVO" />
          <Paragraph>
            日本語は「主語 → 目的語 → 動詞」(SOV)。英語は「主語 → 動詞 → 目的語」(SVO)。
            この語順の違いが、あなたの脳に3秒の遅延を生んでいる。
          </Paragraph>
          <KeyPoint>
            <strong>日本語の脳:</strong> 「私は / 昨日 / 友達と / レストランで / 寿司を / 食べた」<br />
            動詞は最後に来るから、全部考えてから話し始める。<br /><br />
            <strong>英語の脳:</strong> 「I ate / sushi / at a restaurant / with my friend / yesterday」<br />
            動詞が2番目に来るから、最初の2語で文が始まる。
          </KeyPoint>
          <Paragraph>
            会話は200ミリ秒のスポーツだ。相手の発言が終わった瞬間に返さないと、会話のリズムが崩れる。
            3秒の翻訳時間は致命的。だから「頭の中で日本語から英語に変換する」アプローチは根本的に間違っている。
          </Paragraph>
          <CompareBox
            wrong="日本語で考えてから英語に翻訳する（3秒遅延）"
            right="英語のチャンクを反射的に発射する（0.5秒）"
          />

          <SubSectionHeading id="part1-2" number="1.2" title="脳内データベース問題 -- 教科書 vs リアル" />
          <Paragraph>
            あなたの脳に保存されている英語は「教科書版」だ。
            でも、実際のネイティブが話す英語は教科書とまったく違う。
          </Paragraph>
          <KeyPoint>
            <strong>教科書版:</strong> &quot;I am going to go to the store&quot; (12ビート)<br />
            <strong>ネイティブ版:</strong> &quot;I&apos;m gonna go da store&quot; (5ビート)<br /><br />
            教科書版の &quot;water&quot; は「ウォーター」。<br />
            ネイティブ版は「ワラー」(wah-der)。<br /><br />
            あなたの脳は「ワラー」を聞いても「water」にマッチングできない。
            データベースに登録されているのは「ウォーター」だから。
          </KeyPoint>
          <Paragraph>
            これはリスニングだけの問題じゃない。自分が話すときも「教科書版の発音」で話すから、ネイティブには
            「丁寧すぎて逆に聞き取りにくい」英語になる。
          </Paragraph>

          <SubSectionHeading id="part1-3" number="1.3" title="フィードバックループが始まらない" />
          <Paragraph>
            言語習得の核心はフィードバックループだ。聞ける → 話せる → 通じる → 修正される → 上手くなる。
            でも日本語話者はこのループのスタート地点に立てない。
          </Paragraph>
          <div style={{
            padding: '20px',
            backgroundColor: '#fafaf9',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e7e5e4',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#44403c', marginBottom: '12px' }}>
              スペイン語話者 (ロハスのケース):
            </p>
            <p style={{ fontSize: '13px', color: '#78716c', lineHeight: 1.8 }}>
              聞ける (音素が近い) → 話せる (語順が同じSVO) → 通じる → フィードバック → 成長
            </p>
            <div style={{ height: '16px' }} />
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#44403c', marginBottom: '12px' }}>
              日本語話者:
            </p>
            <p style={{ fontSize: '13px', color: '#991b1b', lineHeight: 1.8 }}>
              聞けない (音素が違う) → 話せない (語順が逆) → 通じない → フィードバックなし → 成長なし
            </p>
          </div>
          <Paragraph>
            同じアメリカに住んでいても、スペイン語話者と日本語話者では吸収速度がまったく違う。
            努力の問題ではなく、スタート地点の問題。だからこそ、戦略が必要だ。
          </Paragraph>

          {/* ============================================================= */}
          {/* PART 2: CHANGE YOUR GOAL */}
          {/* ============================================================= */}

          <SectionHeading id="part2" number="Part 2" title="目標を変えろ" />
          <Paragraph>
            「ネイティブみたいに話したい」。これが日本人英語学習者の最大の間違いだ。
            なぜなら、ネイティブの英語は「わかりやすい」のではなく「速い」だけだから。
          </Paragraph>

          <SubSectionHeading id="part2-1" number="2.1" title="ネイティブは目標じゃない -- 速さと明瞭さのトレードオフ" />
          <Paragraph>
            ネイティブの英語を構造的に分析すると、驚くべき事実がわかる。
            彼らは<strong>明瞭さを犠牲にして速度を得ている</strong>。
          </Paragraph>
          <KeyPoint>
            <strong>ネイティブがやっていること:</strong><br />
            -- 母音を潰す (schwa化): &quot;banana&quot; → /buh-NAN-uh/<br />
            -- 機能語を飲み込む: &quot;I mean we&apos;re blessed from a standpoint&quot; → 情報密度ほぼゼロ<br />
            -- g-dropping: &quot;thinking&quot; → &quot;thinkin&apos;&quot;<br />
            -- 無限チェイニング: and/but/so/I mean/because で文が終わらない<br />
            -- フィラー大量投下: 発話の15-20%がフィラー<br /><br />
            <strong>結果:</strong> 流暢に聞こえるけど、内容は薄い。
          </KeyPoint>
          <Paragraph>
            例えば、アメリカのスポーツポッドキャストを聞いてみるといい。
            司会者は26秒間で13の発話ユニットを生成する。
            でもその中身は「Welcome to...」「Great to have you...」「Please rate us...」
            というテンプレートの連続。思考ゼロ、オートパイロット。
          </Paragraph>
          <Paragraph>
            一方、コーチや監督は「um...」「you know...」を多用して流暢さは低い。
            でも、言っている内容は深い。
          </Paragraph>
          <KeyPoint>
            <strong>核心:</strong> 流暢さと思考は同じ認知資源を奪い合う。<br />
            流暢に話すほど浅くなり、深く考えるほど詰まる。<br />
            あなたが目指すべきは「流暢に浅く」ではなく「明瞭に伝える」。
          </KeyPoint>

          <SubSectionHeading id="part2-2" number="2.2" title="長谷川モデル -- これが目標" />
          <Paragraph>
            長谷川滋利。元エンジェルス、元マリナーズの投手。日本人初のエンジェルス選手。
            引退後はアメリカのMLB中継で解説者として活躍している。
            彼の英語を見てみよう。
          </Paragraph>

          <div style={{
            border: '1px solid #e7e5e4',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '20px',
          }}>
            <div style={{ padding: '12px 16px', backgroundColor: '#fafaf9', borderBottom: '1px solid #e7e5e4' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Angels Japanese Heritage Night -- インタビュー抜粋
              </p>
            </div>
            {[
              { q: 'How do you feel having an impact in that department?', a: "\"I mean it's so good I mean you know number one coming back to the Angel Stadium it's always good to me you know it's this is my home home you know\"" },
              { q: '(On Southern California)', a: "\"I play for the Seattle too of course I love Seattle too but this is look at this weather you know you can play golf all day\"" },
              { q: '(On his golf game)', a: "\"I'm a pro now I mean professional golfer I'm I'm serious... I can't make money that's why I'm doing this you know TV job and those kind of stuff but anyway I'm I'm I'm enjoying my life\"" },
              { q: '(On the young pitcher)', a: "\"He's good you know he's throwing 100 I never pitch 100 you know I don't hit even a 90 so but still you get a good location you can get him out\"" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                borderBottom: i < 3 ? '1px solid #f5f5f4' : 'none',
              }}>
                <p style={{ fontSize: '12px', color: '#a8a29e', marginBottom: '4px' }}>{item.q}</p>
                <p style={{ fontSize: '14px', color: '#1c1917', lineHeight: 1.7, fontStyle: 'italic' }}>{item.a}</p>
              </div>
            ))}
          </div>

          <Paragraph>
            文法は完璧じゃない。&quot;it&apos;s always good to me&quot; (正しくは for me)。
            &quot;those kind of stuff&quot; (正しくは that kind of stuff)。
            &quot;I don&apos;t hit even a 90&quot; (語順が少し変)。
            でも、<strong>誰も気にしない</strong>。なぜか。
          </Paragraph>

          <KeyPoint>
            <strong>長谷川の英語の特徴:</strong><br /><br />
            <strong style={{ color: '#10B981' }}>1. 絶対に止まらない。</strong>
            &quot;I&apos;m I&apos;m I&apos;m enjoying my life&quot; -- 繰り返してでも前に進む。
            フリーズしない。これが一番大事。<br /><br />
            <strong style={{ color: '#10B981' }}>2. &quot;you know&quot; マスター。</strong>
            2分間のインタビューで10回以上使っている。
            これは「考える時間を買う」テクニック。ネイティブもまったく同じことをやる。<br /><br />
            <strong style={{ color: '#10B981' }}>3. 短い文をつなげる。</strong>
            複雑な構文は使わない。&quot;He&apos;s good. He&apos;s throwing 100. I never pitch 100.&quot;
            シンプルな文の連射。<br /><br />
            <strong style={{ color: '#10B981' }}>4. 人柄が出る。</strong>
            &quot;I can&apos;t make money that&apos;s why I&apos;m doing this&quot; -- 自虐ユーモア。
            &quot;this is my home home&quot; -- 繰り返しで愛情を表現。
            文法の正確さではなく、「この人と話したい」と思わせる英語。<br /><br />
            <strong style={{ color: '#10B981' }}>5. リスニングが完璧。</strong>
            質問を100%理解し、ジョークを拾い、会話のタイミングに乗っている。
            だから話せる。<strong>聞けるから話せる</strong>。
          </KeyPoint>

          <PracticeBox>
            <strong>これがゴール。</strong><br />
            ネイティブみたいに話すことじゃない。
            長谷川みたいに「文法は崩れてても、止まらない、人柄が伝わる、会話が成立する」英語。
            このレベルを最初の目標にしろ。
          </PracticeBox>

          <SubSectionHeading id="part2-3" number="2.3" title="ロハスモデル -- 明瞭さ > スピード" />
          <Paragraph>
            もう一つの成功モデル。ドジャースのMiguel Rojas (ベネズエラ出身)の英語は、
            ネイティブより<strong>聞き取りやすい</strong>。30以上のインタビュー発言を分析すると、その理由が見えてくる。
          </Paragraph>
          <div style={{
            border: '1px solid #e7e5e4',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '20px',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafaf9' }}>
                  <th style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#44403c', textAlign: 'left', borderBottom: '1px solid #e7e5e4' }}>テクニック</th>
                  <th style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#44403c', textAlign: 'left', borderBottom: '1px solid #e7e5e4' }}>例</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tech: '反復スキャフォールド', ex: "\"I'm thinking about my family, I'm thinking about my wife, I'm thinking the possibility...\"" },
                  { tech: '"feel like" 滑走路', ex: '"I just feel like every time I got the opportunity..." -- 口が動いてる間に脳が次を組み立てる' },
                  { tech: 'クリアな母音', ex: '"opportunity" -- 全音節がはっきり聞こえる' },
                  { tech: '短い節', ex: '3-4節で切って再スタート。ネイティブの無限チェイニングをしない' },
                  { tech: 'フィラー最小', ex: 'ネイティブ: 15-20%がフィラー。ロハス: 約5%' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 500, color: '#1c1917' }}>{row.tech}</td>
                    <td style={{ padding: '10px 16px', fontSize: '13px', color: '#78716c' }}>{row.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <KeyPoint>
            Pellegrino et al. (2011)の研究: どの言語も情報伝達速度は<strong>約39 bits/sec</strong>に収束する。<br /><br />
            ネイティブ: 小さいパケットを高速で送る (syllable/sec高い、bit/syllable低い)<br />
            ロハス: 明瞭なパケットを中速で送る (同じ39 bits/sec)<br />
            日本語: 大きいパケットを低速で送る (syllable/sec低い、bit/syllable高い)<br /><br />
            <strong>帯域幅は同じ。アーキテクチャが違うだけ。</strong>
          </KeyPoint>

          <SubSectionHeading id="part2-4" number="2.4" title="3つのレベル -- どこを目指すか" />
          <div style={{
            border: '1px solid #e7e5e4',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '20px',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafaf9' }}>
                  <th style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#44403c', textAlign: 'left', borderBottom: '1px solid #e7e5e4' }}>Level</th>
                  <th style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#44403c', textAlign: 'left', borderBottom: '1px solid #e7e5e4' }}>できること</th>
                  <th style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#44403c', textAlign: 'left', borderBottom: '1px solid #e7e5e4' }}>目安</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f5f5f4' }}>
                  <td style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 600, color: '#D4AF37' }}>Survival</td>
                  <td style={{ padding: '10px 16px', fontSize: '13px', color: '#78716c' }}>最低限の意思疎通。注文、道案内、簡単な質問応答</td>
                  <td style={{ padding: '10px 16px', fontSize: '13px', color: '#78716c' }}>Step 1-2</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f5f5f4' }}>
                  <td style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 600, color: '#10B981' }}>Conversation</td>
                  <td style={{ padding: '10px 16px', fontSize: '13px', color: '#78716c' }}>雑談ができる。意見を言える。相手の話に反応できる</td>
                  <td style={{ padding: '10px 16px', fontSize: '13px', color: '#78716c' }}>Step 1-5</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 600, color: '#78716c' }}>Expression</td>
                  <td style={{ padding: '10px 16px', fontSize: '13px', color: '#78716c' }}>ニュアンスを伝えられる。ユーモアが使える。議論ができる</td>
                  <td style={{ padding: '10px 16px', fontSize: '13px', color: '#78716c' }}>Step 1-6 + 経験</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Paragraph>
            ほとんどの日本人が必要なのは「Conversation」レベルだ。
            ネイティブレベルの「Expression」は長期戦。まずはConversationを確実にする。
          </Paragraph>

          {/* ============================================================= */}
          {/* PART 3: 6-STEP METHOD */}
          {/* ============================================================= */}

          <SectionHeading id="part3" number="Part 3" title="6ステップメソッド" />
          <Paragraph>
            理論はここまで。ここからは実践。
            優先度順に並んでいるので、Step 1から始めて、できるようになったら次に進む。
            全部を同時にやろうとするな。1つずつ。
          </Paragraph>

          {/* STEP 1 */}
          <StepHeading id="step1" step={1} title="チャンク武装 -- 50フレーズを反射的に発射する" />
          <Paragraph>
            英語の文は最初の2-3語で定義される。
            この「発射口」を50個暗記すれば、考える前に口が動き始める。
            1秒以内に発射できるまで反復する。
          </Paragraph>
          <KeyPoint>
            <strong>なぜこれが最優先か:</strong><br />
            文の途中で止まるのは許される。でも「最初の一言が出ない」のは会話が始まらない。<br />
            チャンクは「考える時間を買う」ための武器。<br />
            口が &quot;I feel like...&quot; と動いている0.5秒の間に、脳が残りを組み立てる。
          </KeyPoint>

          <ChunkTable title="意見を言う (Opinion)" chunks={OPINION_CHUNKS} color="#D4AF37" />
          <ChunkTable title="説明する (Explain)" chunks={EXPLAIN_CHUNKS} color="#D4AF37" />
          <ChunkTable title="反応する (React)" chunks={REACTION_CHUNKS} color="#10B981" />
          <ChunkTable title="つなげる (Connect)" chunks={CONNECTOR_CHUNKS} color="#10B981" />
          <ChunkTable title="時間を稼ぐ (Fill)" chunks={FILLER_CHUNKS} color="#78716c" />

          <PracticeBox>
            <strong>練習法:</strong> 1日5チャンクずつ。声に出して10回繰り返す。
            通勤中、風呂の中、歩きながら。口の筋肉に覚えさせる。
            頭で「訳す」のではなく、条件反射で出るまで。
          </PracticeBox>

          {/* STEP 2 */}
          <StepHeading id="step2" step={2} title="2語発射 -- S+V から右に伸ばす" />
          <Paragraph>
            英語は「右に伸びる」言語 (right-branching)。
            主語と動詞を発射したら、後ろにどんどん情報を追加できる。
            日本語のように全部考えてから話し始める必要はない。
          </Paragraph>
          <div style={{
            padding: '20px',
            backgroundColor: '#fafaf9',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e7e5e4',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#44403c', marginBottom: '12px' }}>
              5秒の文を15秒に伸ばす練習:
            </p>
            <p style={{ fontSize: '14px', color: '#1c1917', marginBottom: '4px' }}>
              <strong style={{ color: '#D4AF37' }}>発射:</strong> &quot;I went to this restaurant&quot;
            </p>
            <p style={{ fontSize: '14px', color: '#1c1917', marginBottom: '4px' }}>
              <strong style={{ color: '#10B981' }}>+1:</strong> &quot;...that my friend recommended&quot;
            </p>
            <p style={{ fontSize: '14px', color: '#1c1917', marginBottom: '4px' }}>
              <strong style={{ color: '#10B981' }}>+2:</strong> &quot;...because she said the pasta was amazing&quot;
            </p>
            <p style={{ fontSize: '14px', color: '#1c1917', marginBottom: '4px' }}>
              <strong style={{ color: '#10B981' }}>+3:</strong> &quot;...and honestly, it was pretty good&quot;
            </p>
          </div>
          <KeyPoint>
            パッディングすると<strong>より流暢に聞こえる</strong>。不自然じゃない。
            ネイティブはまさにこれをやっている。文法的に正しく、自然に伸びる。<br /><br />
            <strong>パターン:</strong> S+V → that... → because... → and...<br />
            この3つの接続語だけで、どんな文でも15秒に伸ばせる。
          </KeyPoint>

          <PracticeBox>
            <strong>練習法:</strong> 日常の出来事を英語で「伸ばす」。<br />
            &quot;I had coffee&quot; → &quot;...at this place near my office&quot; → &quot;...that just opened last week&quot; → &quot;...and it was actually really good&quot;
          </PracticeBox>

          {/* STEP 3 */}
          <StepHeading id="step3" step={3} title="母音を殺せ -- 短縮形テーブル" />
          <Paragraph>
            「カジュアルな代替表現」ではない。これが<strong>本物の発音</strong>だ。
            プロのコーチも監督も解説者も、インタビューで &quot;gonna&quot; と &quot;kinda&quot; を連発する。
            教科書版 &quot;going to&quot; で話すと、逆に不自然に聞こえる。
            長谷川も &quot;those kind of stuff&quot; と言う。それでいい。
          </Paragraph>
          <div style={{
            border: '1px solid #e7e5e4',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '20px',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafaf9' }}>
                  <th style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#44403c', textAlign: 'left', borderBottom: '1px solid #e7e5e4' }}>教科書版</th>
                  <th style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#44403c', textAlign: 'left', borderBottom: '1px solid #e7e5e4' }}>リアル版</th>
                  <th style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#44403c', textAlign: 'left', borderBottom: '1px solid #e7e5e4' }}>カタカナ</th>
                </tr>
              </thead>
              <tbody>
                {CONTRACTIONS.map((c, i) => (
                  <tr key={i} style={{ borderBottom: i < CONTRACTIONS.length - 1 ? '1px solid #f5f5f4' : 'none' }}>
                    <td style={{ padding: '8px 16px', fontSize: '13px', color: '#78716c' }}>{c.full}</td>
                    <td style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 600, color: '#1c1917' }}>{c.short}</td>
                    <td style={{ padding: '8px 16px', fontSize: '13px', color: '#a8a29e' }}>{c.kana}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CompareBox
            wrong="&quot;I am going to go to the store&quot; (12ビート)"
            right="&quot;I'm gonna go da store&quot; (5ビート)"
          />

          {/* STEP 4 */}
          <StepHeading id="step4" step={4} title="リズムをコピー -- ストレスビートだけ追う" />
          <Paragraph>
            シャドーイングの間違ったやり方: 全部の単語を追おうとする → 追いつけない → 挫折。
            正しいやり方: <strong>強勢音節だけ</strong>をマッチさせる。残りは「ナーナーナー」でOK。
          </Paragraph>
          <div style={{
            padding: '20px',
            backgroundColor: '#fafaf9',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e7e5e4',
          }}>
            <p style={{ fontSize: '13px', color: '#78716c', marginBottom: '8px' }}>原文:</p>
            <p style={{ fontSize: '14px', color: '#1c1917', marginBottom: '16px' }}>
              &quot;I think this is something all baseball sickos can relate to&quot;
            </p>
            <p style={{ fontSize: '13px', color: '#78716c', marginBottom: '8px' }}>ストレスだけシャドー:</p>
            <p style={{ fontSize: '14px', color: '#D4AF37', fontWeight: 600 }}>
              &quot;AY <strong>THINK</strong> nuh nuh <strong>SOME</strong>-uh <strong>BASE</strong>-bull <strong>SICK</strong>-uzz kuh <strong>LATE</strong> too&quot;
            </p>
          </div>
          <KeyPoint>
            <strong>なぜリズムが最重要か:</strong><br />
            英語は「stress-timed」言語。強勢の間隔が等しくなるように、非強勢が圧縮される。
            日本語は「mora-timed」言語。全拍が等間隔。<br /><br />
            個々の発音が完璧でも、リズムが日本語だと「外国語」に聞こえる。
            逆に、発音が雑でもリズムが英語なら「通じる」。
          </KeyPoint>

          <PracticeBox>
            <strong>練習法:</strong> ポッドキャストやYouTubeで好きな人の英語を選ぶ。
            1文だけ取り出して、強勢音節だけ大声で言う。残りはハミング。
            リズムパターンが体に入ったら、徐々に単語を追加していく。
          </PracticeBox>

          {/* STEP 5 */}
          <StepHeading id="step5" step={5} title="沈黙を埋めろ -- ストーリング構造" />
          <Paragraph>
            ネイティブの会話では、0.5秒の沈黙 = 相手に発言権を奪われる。
            沈黙は恐怖。だからネイティブは「意味のない音」で埋める。
            あなたも同じことをすればいい。
          </Paragraph>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1c1917', marginBottom: '12px' }}>
              4つの沈黙キラー:
            </h4>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {[
                { title: 'エコー (相手の言葉を繰り返す)', ex: '"So you went to Osaka?" -- これだけで2秒稼げる' },
                { title: 'フラグメント (文の断片)', ex: '"Right, the thing about that is..." -- 続きはなくてもいい' },
                { title: 'S+V発射 (Step 2)', ex: '"I think..." [考え中] "...that makes sense"' },
                { title: '質問リダイレクト', ex: '"What about you?" / "How about you?" -- 相手にボールを返す' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '14px 16px',
                  backgroundColor: '#fafaf9',
                  borderRadius: '8px',
                  border: '1px solid #e7e5e4',
                }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>{item.title}</p>
                  <p style={{ fontSize: '12px', color: '#78716c' }}>{item.ex}</p>
                </div>
              ))}
            </div>
          </div>

          <PracticeBox>
            <strong>練習法:</strong> 内言語 (inner monologue) を英語に切り替える。<br />
            通勤中: &quot;Man, I&apos;m starving&quot; (「腹減った」じゃなく)<br />
            電車で: &quot;This train is so packed&quot;<br />
            料理中: &quot;I should probably add more salt&quot;<br /><br />
            常にスターターから始める: &quot;Honestly...&quot; [脳が追いつく] &quot;...I&apos;m so hungry right now&quot;
          </PracticeBox>

          {/* STEP 6 */}
          <StepHeading id="step6" step={6} title="1分間スピーチ -- 止まらないルール" />
          <Paragraph>
            タイマーを1分にセット。トピックを1つ選ぶ。1分間、<strong>絶対に止まらない</strong>。
            &quot;Um&quot; OK。繰り返し OK。文法崩壊 OK。唯一の失敗は「止まること」。
          </Paragraph>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1c1917', marginBottom: '12px' }}>
              トピックカード:
            </h4>
            <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {SPEECH_TOPICS.map((topic, i) => (
                <div key={i} style={{
                  padding: '12px 16px',
                  backgroundColor: '#fafaf9',
                  borderRadius: '8px',
                  border: '1px solid #e7e5e4',
                }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#1c1917' }}>{topic.en}</p>
                  <p style={{ fontSize: '12px', color: '#a8a29e' }}>{topic.ja}</p>
                </div>
              ))}
            </div>
          </div>

          <KeyPoint>
            <strong>進捗の目安:</strong><br />
            Week 1: 10秒で止まる。フリーズする。普通。<br />
            Week 2: 30秒いける。同じことを繰り返す。OK。<br />
            Month 1: 1分間完走できる。文法は壊れてる。全然OK。<br />
            Month 3: 1分間で実際に「言いたいこと」が言える。<br /><br />
            <strong>録音すること。</strong> 1ヶ月前の自分と比べると、成長が見える。
          </KeyPoint>

          {/* ============================================================= */}
          {/* PART 4: CONVERSATION SURVIVAL */}
          {/* ============================================================= */}

          <SectionHeading id="part4" number="Part 4" title="会話サバイバルガイド" />
          <Paragraph>
            実際の会話で使える「生き残りフレーズ」。
            全部覚える必要はない。自分がよく遭遇するシチュエーションのものだけ選んで、
            反射的に出るまで練習する。
          </Paragraph>

          <KeyPoint>
            <strong>200msの法則:</strong><br />
            英語の会話では、相手の発言が終わってから次の人が話し始めるまで平均200ミリ秒しかない。
            つまり、相手が話し終わる<strong>前</strong>に返答を準備している。
            だから「聞いてから考える」は間に合わない。<br /><br />
            <strong>対策:</strong> 下のフレーズを「聞きながら準備する」のではなく、
            「条件反射で出す」レベルまで体に入れる。
          </KeyPoint>

          <EmergencyTable
            title="聞き取れないとき"
            phrases={EMERGENCY_CANT_UNDERSTAND}
          />
          <EmergencyTable
            title="話題を変えたいとき"
            phrases={EMERGENCY_TOPIC_CHANGE}
          />
          <EmergencyTable
            title="会話を終わらせたいとき"
            phrases={EMERGENCY_ENDING}
          />

          <div style={{
            padding: '20px',
            backgroundColor: '#fafaf9',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e7e5e4',
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1c1917', marginBottom: '12px' }}>
              サバイバル3原則:
            </h4>
            <div style={{ fontSize: '14px', color: '#57534e', lineHeight: 1.9 }}>
              <p style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#D4AF37' }}>1. エコー:</strong> 相手の最後の2-3語をそのまま繰り返す。
                &quot;You went to Osaka?&quot; これだけで「聞いてますよ」のシグナルになる。
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#D4AF37' }}>2. フラグメント:</strong> 完全な文を作らなくていい。
                &quot;Right.&quot; &quot;Exactly.&quot; &quot;Makes sense.&quot; 断片で十分。
              </p>
              <p>
                <strong style={{ color: '#D4AF37' }}>3. 質問返し:</strong> 困ったら &quot;What about you?&quot;。
                相手が話してくれるから、その間に次を考えられる。
              </p>
            </div>
          </div>

          {/* ============================================================= */}
          {/* PART 5: THEORY BACKGROUND */}
          {/* ============================================================= */}

          <SectionHeading id="part5" number="Part 5" title="理論的背景" />
          <Paragraph>
            このガイドの裏にある言語学的・認知科学的根拠。興味がある人向け。
            実践には直接関係しないが、「なぜこのメソッドが効くのか」を理解すると納得感が違う。
          </Paragraph>

          <CollapsibleSection title="Pellegrino et al. (2011) -- 情報伝達速度の収束">
            <Paragraph>
              すべての言語は情報伝達速度が約39 bits/secに収束する。
              速い言語 (日本語、スペイン語)は1音節あたりの情報量が少なく、遅い言語 (中国語)は1音節あたりの情報量が多い。
            </Paragraph>
            <div style={{
              border: '1px solid #e7e5e4',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fafaf9' }}>
                    <th style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: '#44403c', textAlign: 'left', borderBottom: '1px solid #e7e5e4' }}>言語</th>
                    <th style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: '#44403c', textAlign: 'right', borderBottom: '1px solid #e7e5e4' }}>音節/秒</th>
                    <th style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: '#44403c', textAlign: 'right', borderBottom: '1px solid #e7e5e4' }}>bit/音節</th>
                    <th style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: '#44403c', textAlign: 'right', borderBottom: '1px solid #e7e5e4' }}>合計 bit/s</th>
                  </tr>
                </thead>
                <tbody>
                  {PELLEGRINO_DATA.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < PELLEGRINO_DATA.length - 1 ? '1px solid #f5f5f4' : 'none' }}>
                      <td style={{ padding: '8px 16px', fontSize: '13px', color: '#1c1917' }}>
                        {row.langJa} ({row.lang})
                      </td>
                      <td style={{ padding: '8px 16px', fontSize: '13px', color: '#78716c', textAlign: 'right' }}>{row.syllPerSec}</td>
                      <td style={{ padding: '8px 16px', fontSize: '13px', color: '#78716c', textAlign: 'right' }}>{row.bitsPerSyll}</td>
                      <td style={{ padding: '8px 16px', fontSize: '13px', color: '#D4AF37', fontWeight: 600, textAlign: 'right' }}>{row.totalBits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paragraph>
              つまり、「英語が速い」のではなく「英語は小さいパケットを高頻度で送っている」だけ。
              あなたが遅いのではなく、パケットサイズが違う。
            </Paragraph>
          </CollapsibleSection>

          <CollapsibleSection title="Stress-Timing vs Mora-Timing -- リズムの根本的な違い">
            <Paragraph>
              英語は「stress-timed」: 強勢の間隔が等しくなるように非強勢が圧縮される。
              日本語は「mora-timed」: 全モーラが等間隔。
            </Paragraph>
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#fafaf9',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #e7e5e4',
              fontSize: '14px',
              lineHeight: 1.8,
              color: '#57534e',
            }}>
              英語: <strong>&quot;I WENT to the STORE to BUY some BREAD&quot;</strong><br />
              → WENT...STORE...BUY...BREAD の間隔がほぼ等しい。間の語は圧縮される。<br /><br />
              日本語: 「パ・ン・を・か・い・に・い・き・ま・し・た」<br />
              → 全モーラが等間隔。圧縮されない。
            </div>
            <Paragraph>
              この違いが、日本人の英語が「ロボットっぽく」聞こえる最大の原因。
              個々の発音よりもリズムの方が、通じるかどうかに影響する。
            </Paragraph>
          </CollapsibleSection>

          <CollapsibleSection title="Head-Initial vs Head-Final -- 語順が思考を決める">
            <Paragraph>
              英語 (とスペイン語) は「head-initial」: 重要な情報 (動詞、主語) が文頭に来る。
              日本語は「head-final」: 重要な情報 (動詞) が文末に来る。
            </Paragraph>
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#fafaf9',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #e7e5e4',
              fontSize: '14px',
              lineHeight: 1.8,
              color: '#57534e',
            }}>
              <strong>英語 (head-initial, right-branching):</strong><br />
              &quot;I saw [the man [who was wearing [the hat [that I liked]]]]&quot;<br />
              → 右に伸びる。いつでも止められる。いつでも足せる。<br /><br />
              <strong>日本語 (head-final, left-branching):</strong><br />
              「[[[[私が気に入った]帽子を]かぶっていた]男を]見た」<br />
              → 左に伸びる。全部考えてからじゃないと「見た」が言えない。
            </div>
            <Paragraph>
              これがStep 2「2語発射」の言語学的根拠。
              英語の文法構造自体が「とりあえず始めて、後から足す」を許容している。
              日本語の文法構造は「全部考えてから話す」を強制する。
            </Paragraph>
          </CollapsibleSection>

          {/* ============================================================= */}
          {/* CLOSING: THE MOST IMPORTANT THING */}
          {/* ============================================================= */}

          <h2
            id="closing"
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#1c1917',
              marginBottom: '16px',
              paddingTop: '56px',
              scrollMarginTop: '80px',
              textAlign: 'center',
            }}
          >
            最後に: 最も大事なこと
          </h2>

          <div style={{
            padding: '32px 28px',
            backgroundColor: '#fffbeb',
            border: '2px solid #D4AF37',
            borderRadius: '12px',
            marginBottom: '28px',
          }}>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', lineHeight: 1.6, marginBottom: '20px', textAlign: 'center' }}>
              何回も口に出して、<br />
              それを言う自分が不自然じゃない状態にすること。
            </p>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '0' }}>
              このガイドのテクニック、チャンク、短縮形、リズム。
              全部大事だ。でも、一番大事なのはこれだけ。
            </p>
          </div>

          <Paragraph>
            日本語だって同じだ。
          </Paragraph>
          <Paragraph>
            「やぶさかではない」。この言葉、意味を逆に覚えている人も多い。
            何回も聞いて、ようやく正しい意味を理解して、
            それでも初めて自分の口から出すときは、変な感じがする。
            「俺が"やぶさかではない"とか言ってるの、なんかキモくない？」と。
          </Paragraph>
          <Paragraph>
            でも、政治家みたいな人が何回も使っているのを聞いていると、
            自分の中にあるその違和感が、少しずつ消えていく。
            そして自分でも何回か使ううちに、いつの間にか自分の言葉になっている。
          </Paragraph>
          <Paragraph>
            <strong>すべての言語のスピーキングの本質は、ここにある。</strong>
          </Paragraph>

          <div style={{
            padding: '24px',
            backgroundColor: '#fafaf9',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #e7e5e4',
          }}>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '16px' }}>
              想像してみろ。あなたが宇宙語を学んでいるとする。
            </p>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '16px' }}>
              「超疲れた」に該当する宇宙語は<strong style={{ color: '#D4AF37' }}>「いおっプあく」</strong>だと教わった。
              それを口に出してみる。
              ......変だろう？ 自分が「いおっプあく」とか言ってるの、どう考えても不自然だ。
            </p>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '16px' }}>
              でも、宇宙人がその言葉を --
              あなたが「チョー疲れた」と言うのとまったく同じ場面で、
              同じ顔の表情で、本当に疲れた感情を込めて言っているのを、何回も何回も聞いたとする。
            </p>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '0' }}>
              すると、不思議なことが起きる。
              その違和感が、消えていく。
              そして自分でも何回も口に出していくと、
              <strong>「いおっプあく」が、自分の感情になる</strong>。
            </p>
          </div>

          <Paragraph>
            &quot;I&apos;m exhausted&quot; も同じだ。
            最初は不自然に感じる。「俺が英語でI&apos;m exhaustedとか言ってるの、変じゃない？」と。
            でもネイティブが本当に疲れた顔で、感情を込めて言っているのを何十回も聞いて、
            自分でも何十回も口に出していると、その言葉に自分の感情が乗るようになる。
          </Paragraph>

          <KeyPoint>
            <strong>感情を込めること。</strong><br /><br />
            日本人が「チョー疲れた」と言うとき、その言葉には感情が乗っている。
            声のトーン、顔の表情、体の脱力。全部がセットになっている。<br /><br />
            英語も同じだ。&quot;I&apos;m SO tired&quot; を言うなら、
            本当に疲れた気持ちで、疲れた顔で、疲れた声で言え。
            テキストを読み上げるな。<strong>感じろ</strong>。<br /><br />
            感情が乗った瞬間、その言葉はあなたの言葉になる。
          </KeyPoint>

          <Paragraph>
            所詮、母語だって他人の言葉だ。
            赤ちゃんのとき、「疲れた」は他人の言葉だった。
            親が言っているのを何百回も聞いて、自分でも何百回も言って、
            いつの間にか「自分の言葉」になった。
          </Paragraph>
          <Paragraph>
            英語も同じプロセスを踏むしかない。
            聞いて、真似して、感情を込めて、何回も言って、違和感がなくなるまで繰り返す。
          </Paragraph>

          <div style={{
            padding: '28px',
            backgroundColor: '#ecfdf5',
            border: '2px solid #10B981',
            borderRadius: '12px',
            marginBottom: '28px',
          }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', lineHeight: 1.6, marginBottom: '16px' }}>
              スピーキングは、リーディングやリスニングとは本質的に違う。
            </p>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '16px' }}>
              リーディングは頭の作業。リスニングも頭の作業。
              でもスピーキングは<strong>体の作業</strong>だ。
            </p>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '16px' }}>
              口の筋肉、舌の動き、息の出し方、声の高さ。
              そして何より、<strong>その言葉を言っている自分に対する違和感をなくすこと</strong>。
            </p>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '0' }}>
              頭で理解するんじゃない。筋トレと慣れ。<br />
              感情込めて、繰り返し言うしかない。<br />
              違和感がなくなるまで。
            </p>
          </div>

          {/* Omake */}
          <SectionHeading id="omake" number="" title="おまけ: 覚者と言語学が同じことを言っている" />

          <Paragraph>
            ここまで読んで、一つ気づいたことがないか。
          </Paragraph>
          <Paragraph>
            「すべての言葉は借り物」。母語ですら、赤ちゃんのときに他人の言葉を
            何百回も聞いて、真似して、繰り返して、ようやく「自分の言葉」になった。
            英語だって同じプロセスを踏むだけだ -- と、さっき書いた。
          </Paragraph>
          <Paragraph>
            でもちょっと待て。<strong>「自分の言葉」って、何だ？</strong>
          </Paragraph>
          <Paragraph>
            母語の日本語ですら、全部外から来たものだ。
            親が言っていた言葉、先生が教えてくれた言葉、友達から聞いた言葉、
            テレビで覚えた言葉。自分で発明した単語なんて、一つもない。
          </Paragraph>
          <Paragraph>
            つまり、<strong>あなたが「自分の考え」だと思っているものは、
            全部他人から借りてきた言葉の組み合わせ</strong>にすぎない。
          </Paragraph>

          <div style={{
            padding: '24px',
            backgroundColor: '#fafaf9',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #e7e5e4',
          }}>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '16px' }}>
              瞑想の世界では、これを昔から言っている。
            </p>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '16px' }}>
              Adyashanti、Eckhart Tolle、禅の老師たち。
              彼らは全員、同じことを言う --
              <strong style={{ color: '#D4AF37' }}>「思考はあなた自身ではない」</strong>。
            </p>
            <p style={{ fontSize: '15px', color: '#57534e', lineHeight: 2.0, marginBottom: '0' }}>
              言語学の方向から来ても、瞑想の方向から来ても、
              たどり着く場所は同じだ。
              言語学者は外側から見て「言語は後天的に獲得された音声パターンだ」と言い、
              覚者は内側から見て「思考は自分ではない」と言う。
              別の角度から、同じ真実を指さしている。
            </p>
          </div>

          <Paragraph>
            いおっプあくの思考実験が、まさにこれを証明している。
            意味不明な音でも、感情と反復で「自分の言葉」になる。
            逆に言えば、今あなたが「自分の言葉」だと思っているもの --
            「疲れた」「やばい」「マジで」 -- も、
            かつてはいおっプあくだった。
          </Paragraph>
          <Paragraph>
            <strong>だから、言葉＝思考は自分ではないという、
            覚者の言うことは当たり前なんだよね。</strong>
          </Paragraph>
          <Paragraph>
            ......と、こういう哲学的な脱線をするのが俺のキャラなので。
            長谷川さんモデルに従って、人格で許してもらうスタイルでいく。
          </Paragraph>

          {/* Footer */}
          <div style={{
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid #e7e5e4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <Link href="/english" style={{
              fontSize: '13px',
              color: '#D4AF37',
              textDecoration: 'none',
            }}>
              ← ダッシュボードに戻る
            </Link>
            <p style={{ fontSize: '12px', color: '#a8a29e' }}>
              Iwasaki Naisou / Speaking Guide
            </p>
          </div>
        </div>
      </div>

      {/* Mobile TOC */}
      {isMobile && (
        <MobileToc activeSection={activeSection} onNavigate={handleNavigate} />
      )}
    </main>
  )
}
