'use client'

import { useEffect, useState } from 'react'
import DigitalHuman from './DigitalHuman'

interface FloatingElementsProps {
  glowTrigger?: boolean
}

interface TakumiComment {
  jijiiTweet: string
  takumiComment: string
  createdAt: string
}

export default function FloatingElements({ glowTrigger = false }: FloatingElementsProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [isDigitalHumanOpen, setIsDigitalHumanOpen] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const [takumiComment, setTakumiComment] = useState<TakumiComment | null>(null)
  const [isCommentExpanded, setIsCommentExpanded] = useState(false)
  const [isCommentVisible, setIsCommentVisible] = useState(true)

  // タクミコメントの表示状態をlocalStorageから読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem('takumi_comment_visible')
      if (saved === 'false') setIsCommentVisible(false)
    } catch {
      // localStorage read failed silently
    }
  }, [])

  // [n8n停止中] タクミのコメント取得を一時的に無効化
  // useEffect(() => {
  //   async function fetchTakumiComment() {
  //     try {
  //       const res = await fetch('/api/takumi-comments')
  //       const data = await res.json()
  //       if (data.success && data.data.length > 0) {
  //         setTakumiComment(data.data[0])
  //       }
  //     } catch {
  //       // Failed to fetch takumi comment silently
  //     }
  //   }
  //   fetchTakumiComment()
  //   // 5分ごとに更新
  //   const interval = setInterval(fetchTakumiComment, 5 * 60 * 1000)
  //   return () => clearInterval(interval)
  // }, [])

  useEffect(() => {
    setMounted(true)

    // SSR対応: window と localStorage のチェック
    if (typeof window === 'undefined') return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    // グローバルイベントリスナー（LP等から呼び出し可能）
    const handleOpenAITakumi = () => {
      setIsDigitalHumanOpen(true)
    }

    const handleCloseTakumi = () => {
      setIsDigitalHumanOpen(false)
      setShowWelcomeModal(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('openAITakumi' as any, handleOpenAITakumi)
    window.addEventListener('closeTakumi' as any, handleCloseTakumi)

    // #takumi アンカーでタクミを自動オープン
    if (window.location.hash === '#takumi') {
      setTimeout(() => {
        setIsDigitalHumanOpen(true)
        // アンカーをクリア（ブラウザ履歴を汚さない）
        window.history.replaceState(null, '', window.location.pathname)
      }, 500)
    }

    // 初回訪問チェック（localStorage安全アクセス）
    let hasVisited = false
    try {
      hasVisited = localStorage.getItem('iwasaki_digital_human_visited') === 'true'
    } catch {
      // localStorage access failed silently
    }

    if (!hasVisited) {
      // 10秒後にウェルカムモーダル表示
      setTimeout(() => {
        setShowWelcomeModal(true)
      }, 10000)
    } else {
      // 既訪問でも30秒後にボタンをパルス
      setTimeout(() => {
        setIsPulsing(true)
        setTimeout(() => setIsPulsing(false), 3000)
      }, 30000)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('openAITakumi' as any, handleOpenAITakumi)
      window.removeEventListener('closeTakumi' as any, handleCloseTakumi)
    }
  }, [])

  const elements = [
    { id: 1, text: '正直に、今、ここで向き合い、嘘をつかない', initialX: 15, initialY: 20, moveSpeed: 0.01 },
    { id: 2, text: 'die before you die', initialX: 80, initialY: 30, moveSpeed: 0.012 },
    { id: 3, text: 'compassion', initialX: 25, initialY: 70, moveSpeed: 0.011 },
    { id: 4, text: 'thank you', initialX: 70, initialY: 75, moveSpeed: 0.013 },
    { id: 5, text: 'dukkha', initialX: 50, initialY: 50, moveSpeed: 0.01 },
    { id: 6, text: 'as it is', initialX: 40, initialY: 40, moveSpeed: 0.011 },
  ]

  if (!mounted) return null

  return (
    <>
      {/* フロート要素 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {elements.map((element) => {
          const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
          const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
          const moveX = (mousePos.x - windowWidth / 2) * element.moveSpeed
          const moveY = (mousePos.y - windowHeight / 2) * element.moveSpeed

          return (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: `${element.initialX}%`,
                top: `${element.initialY}%`,
              }}
            >
              <div className="text-[#252423] opacity-10 font-light text-sm sm:text-base md:text-lg whitespace-nowrap tracking-wide italic" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                {element.text}
              </div>
            </div>
          )
        })}
      </div>


      <style jsx global>{`
        /* 職人アイコンパルスアニメーション */
        .craftsman-pulse {
          animation: craftsmanPulse 2s ease-in-out 3;
        }

        @keyframes craftsmanPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>

      {/* ウェルカムモーダル（初回訪問時） */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/60 z-[101] flex items-start md:items-center justify-center p-4 pt-32 md:pt-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white shadow-2xl max-w-lg w-full p-6 md:p-8 border-4 border-[#10B981] my-4 md:my-0">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* 職人アイコン */}
              <div className="flex-shrink-0">
                <img
                  src="/icons/craftsman.png"
                  alt="AI職人タクミ"
                  loading="eager"
                  className="w-32 h-32 md:w-40 md:h-40 object-contain"
                />
              </div>

              {/* テキスト */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-[#10B981] text-white px-3 py-1 text-xs font-bold mb-3">
                  NEW! AI職人登場
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-[#252423] mb-3">
                  タクミに<br className="md:hidden" />何でも聞いてみて！
                </h3>
                <p className="text-sm text-[#252423]/80 mb-6">
                  音声でも文字でもOK！<br />
                  リフォーム・料金・工期、なんでも答えるよ
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowWelcomeModal(false)
                      setIsDigitalHumanOpen(true)
                      try {
                        localStorage.setItem('iwasaki_digital_human_visited', 'true')
                      } catch {
                        // localStorage write failed silently
                      }
                    }}
                    className="bg-[#10B981] text-white px-8 py-4 font-bold hover:bg-[#0ea572] transition-colors shadow-lg text-lg"
                  >
                    話しかけてみる →
                  </button>
                  <button
                    onClick={() => {
                      setShowWelcomeModal(false)
                      try {
                        localStorage.setItem('iwasaki_digital_human_visited', 'true')
                      } catch {
                        // localStorage write failed silently
                      }
                      setTimeout(() => {
                        setIsPulsing(true)
                        setTimeout(() => setIsPulsing(false), 3000)
                      }, 30000)
                    }}
                    className="text-[#252423]/60 text-sm hover:text-[#252423] transition-colors"
                  >
                    あとで話す
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 右下固定の職人アイコン（デジタルヒューマン起動） */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-auto flex items-end gap-3">
        {/* タクミの吹き出し（じじいへのコメント） */}
        {takumiComment && isCommentVisible && (
          <div
            className={`hidden lg:flex mb-4 animate-fadeIn transition-all duration-300 ${isCommentExpanded ? 'max-w-[320px]' : 'max-w-[200px]'
              }`}
          >
            <div className="relative bg-[#10B981] text-white text-xs p-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              {/* 閉じるボタン */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsCommentVisible(false)
                  try {
                    localStorage.setItem('takumi_comment_visible', 'false')
                  } catch {
                    // localStorage write failed silently
                  }
                }}
                className="absolute -top-2 -left-2 w-5 h-5 bg-white text-[#10B981] rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                title="閉じる"
              >
                <span className="text-xs font-bold">×</span>
              </button>
              {/* コメント本文 */}
              <button
                onClick={() => setIsCommentExpanded(!isCommentExpanded)}
                className="text-left w-full"
              >
                <p className="leading-relaxed text-[12px]">
                  {isCommentExpanded
                    ? takumiComment.takumiComment
                    : takumiComment.takumiComment.length > 40
                      ? takumiComment.takumiComment.slice(0, 40) + '...'
                      : takumiComment.takumiComment}
                </p>
                {/* 展開ヒント */}
                {!isCommentExpanded && takumiComment.takumiComment.length > 40 && (
                  <span className="text-[9px] opacity-70 mt-1 block">タップで全文 →</span>
                )}
                {isCommentExpanded && (
                  <span className="text-[9px] opacity-70 mt-2 block">タップで閉じる</span>
                )}
              </button>
              {/* 吹き出しの尻尾 */}
              <div className="absolute -right-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-[#10B981]" />
            </div>
          </div>
        )}

        {/* 閉じた時の再表示バー（タクミコメント） */}
        {takumiComment && !isCommentVisible && (
          <button
            onClick={() => {
              setIsCommentVisible(true)
              try {
                localStorage.setItem('takumi_comment_visible', 'true')
              } catch {
                // localStorage write failed silently
              }
            }}
            className="hidden lg:block mb-8"
          >
            <div className="w-1 h-12 bg-[#10B981]/30 hover:bg-[#10B981]/60 hover:w-2 transition-all duration-300 rounded-l-full" />
          </button>
        )}

        {/* タクミアイコン */}
        <button
          onClick={() => setIsDigitalHumanOpen(true)}
          className={`group ${isPulsing ? 'craftsman-pulse' : ''}`}
        >
          <div className="relative">
            <img
              src="/icons/craftsman.png"
              alt="デジタルアシスタント"
              loading="eager"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -top-2 -right-2 bg-[#82EDA6] text-[#252423] text-xs font-bold px-2 py-1 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              質問してね！
            </div>
          </div>
        </button>
      </div>

      {/* デジタルヒューマンモーダル */}
      <DigitalHuman
        isOpen={isDigitalHumanOpen}
        onClose={() => setIsDigitalHumanOpen(false)}
      />

    </>
  )
}
