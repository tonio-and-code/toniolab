'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react'
import AnimatedCraftsman from './AnimatedCraftsman'
import { diagnosticQuestionsV4, detailedDiagnosticQuestions, initialConcernOptions, skipDiagnosticMessage, getRecommendedTags } from '@/data/diagnostic-questions-v4'
import { portfolioData } from '@/data/portfolio'
import { getFixedDiagnosticResult } from '@/data/fixed-diagnostic-results'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  images?: string[] // 施工写真を含める場合
}

interface DigitalHumanProps {
  isOpen: boolean
  onClose: () => void
}

// Ver.4.0診断質問データ（3問コア + 具体的表現）
const diagnosticQuestions = diagnosticQuestionsV4

export default function DigitalHuman({ isOpen, onClose }: DigitalHumanProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'speaking'>('idle')

  // 診断モード用のstate (Ver.4.0)
  const [flowPhase, setFlowPhase] = useState<'initial' | 'concern_select' | 'diagnostic' | 'result' | 'chat' | 'detailed_diagnostic' | 'detailed_result'>('initial')
  // initial: 初回挨拶, concern_select: 悩み選択, diagnostic: 簡易3問中, result: 簡易結果表示, detailed_diagnostic: 詳細10問中, detailed_result: 詳細結果表示, chat: フリーチャット

  const [initialConcern, setInitialConcern] = useState<string>('') // 最初の悩み選択
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<number, 'A' | 'B'>>({})
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false) // 早押し防止用
  const [recommendedImages, setRecommendedImages] = useState<string[]>([]) // 診断結果の施工写真
  const [showDetailedDiagnosticButton, setShowDetailedDiagnosticButton] = useState(false) // 詳細診断ボタン表示フラグ

  // 背景スライドショー用のstate
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0)

  // 施工実績から画像を取得（image_urlがあるもののみ）
  const backgroundImages = portfolioData
    .filter(item => item.image_url && item.image_url.length > 0)
    .map(item => item.image_url)
    .slice(0, 20) // 最大20枚

  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 背景スライドショー（10秒ごとに切り替え）
  useEffect(() => {
    if (!isOpen || backgroundImages.length === 0) return

    const interval = setInterval(() => {
      setCurrentBackgroundIndex(prev => (prev + 1) % backgroundImages.length)
    }, 10000) // 10秒ごと

    return () => clearInterval(interval)
  }, [isOpen, backgroundImages.length])

  // 背景スクロール防止
  useEffect(() => {
    if (isOpen) {
      // モーダル表示時：背景を固定
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else {
      // モーダル非表示時：スクロール位置を復元
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }

    return () => {
      // クリーンアップ
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [isOpen])

  // 初期メッセージ（Ver.4.0: 悩み選択から開始）
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: 'こんにちは！イワサキ内装のAI職人、タクミです。\n\nどんなことでお困りですか？下のボタンから選んでください。',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])

      // 音声で読み上げ
      if (!isMuted) {
        speakText('こんにちは。イワサキ内装のAI職人、タクミです。どんなことでお困りですか？')
      }

      // フェーズを「悩み選択」に移行
      setFlowPhase('concern_select')
    }
  }, [isOpen])

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 音声認識初期化
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.lang = 'ja-JP'
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
        setAvatarState('idle')
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
        setAvatarState('idle')
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setAvatarState('idle')
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      window.speechSynthesis.cancel()
    }
  }, [])

  // 音声認識開始/停止
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('お使いのブラウザは音声認識に対応していません。Chrome、Edge、Safariをご利用ください。')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setAvatarState('idle')
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      setAvatarState('listening')
    }
  }

  // テキスト読み上げ（キャンセルしない版）
  const speakText = (text: string) => {
    if (isMuted) return

    // 現在話し中の場合は終わるまで待つ（キャンセルしない）
    if (isSpeaking) {
      setTimeout(() => speakText(text), 500)
      return
    }

    // 音声リストが読み込まれるまで待つ
    const voices = window.speechSynthesis.getVoices()
    if (voices.length === 0) {
      // 音声リストがまだ読み込まれていない場合は、イベントを待つ
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        speakText(text)
      }, { once: true })
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 1.3
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // 日本語音声を取得（Google日本語が一番自然）
    const japaneseVoice = voices.find(voice =>
      voice.lang === 'ja-JP' && (
        voice.name.includes('Google') ||
        voice.name.includes('Kyoko') ||
        voice.name.includes('Otoya')
      )
    ) || voices.find(voice => voice.lang === 'ja-JP')

    if (japaneseVoice) {
      utterance.voice = japaneseVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
      setAvatarState('speaking')
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setAvatarState('idle')
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      setAvatarState('idle')
    }

    synthesisRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  // 悩み選択の処理
  const handleConcernSelect = async (concernId: string) => {
    setInitialConcern(concernId)

    if (concernId === 'skip') {
      // 診断スキップ → 直接チャットへ
      const skipMessage: Message = {
        role: 'assistant',
        content: skipDiagnosticMessage,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, skipMessage])

      if (!isMuted) {
        speakText('診断スキップですね！全然OKです。気になることがあれば、何でも聞いてください。')
      }

      // スキップデータをSupabaseに保存（JSONB柔軟設計 Ver.5.0）
      await saveDiagnosticResult({
        flow_type: 'skip_diagnostic',
        initial_concern: 'skip',
        answers: {
          skipped: true,
          skip_reason: 'user_choice'
        }
      }).catch(() => {
        // Ignore save errors for skip diagnostic
      })

      setFlowPhase('chat')
      return
    }

    // 悩み選択 → フォローアップメッセージ → 診断開始
    const selectedConcern = initialConcernOptions.find(opt => opt.id === concernId)
    if (!selectedConcern) return

    const followUpMessage: Message = {
      role: 'assistant',
      content: selectedConcern.followUpMessage + '\n\nじゃあ、3つだけ質問させてください。すぐ終わりますので！',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, followUpMessage])

    if (!isMuted) {
      speakText(selectedConcern.followUpMessage + '。じゃあ、3つだけ質問させてください。')
    }

    // 診断モード開始
    setFlowPhase('diagnostic')
    setTimeout(() => {
      askNextQuestion(0)
    }, 3000)
  }

  // 診断完了を監視して結果生成
  useEffect(() => {
    // 簡易診断（3問）完了
    if (
      flowPhase === 'diagnostic' &&
      Object.keys(diagnosticAnswers).length === 3 &&
      currentQuestionIndex >= diagnosticQuestions.length
    ) {
      generateDiagnosticResult()
    }

    // 詳細診断（10問）完了
    if (
      flowPhase === 'detailed_diagnostic' &&
      Object.keys(diagnosticAnswers).length === 13 && // 簡易3問 + 詳細10問
      currentQuestionIndex >= detailedDiagnosticQuestions.length
    ) {
      generateDetailedDiagnosticResult()
    }
  }, [diagnosticAnswers, currentQuestionIndex, flowPhase])

  // 次の質問をする (Ver.4.0: 3問のみ)
  const askNextQuestion = (index: number) => {
    if (index >= diagnosticQuestions.length) {
      // 全質問完了（useEffectで診断結果生成を監視）
      return
    }

    const q = diagnosticQuestions[index]
    const questionText = `【質問${index + 1}/3】${q.question}`

    const questionMessage: Message = {
      role: 'assistant',
      content: questionText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, questionMessage])

    if (!isMuted) {
      speakText(`質問${index + 1}です。${q.question}`)
    }
  }

  // 詳細診断の質問をする（10問）
  const askDetailedQuestion = (index: number) => {
    if (index >= detailedDiagnosticQuestions.length) {
      // 全質問完了（useEffectで診断結果生成を監視）
      return
    }

    const q = detailedDiagnosticQuestions[index]
    const questionText = `【質問${index + 1}/10】${q.question}`

    const questionMessage: Message = {
      role: 'assistant',
      content: questionText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, questionMessage])

    if (!isMuted) {
      speakText(`質問${index + 1}です。${q.question}`)
    }
  }

  // 診断の回答処理（簡易診断と詳細診断の両方に対応）
  const handleDiagnosticAnswer = (answer: 'A' | 'B') => {
    // 早押し防止：処理中は何もしない
    if (isProcessingAnswer) {
      return
    }

    // 詳細診断モードかどうかで質問データを切り替え
    const isDetailed = flowPhase === 'detailed_diagnostic'
    const questions = isDetailed ? detailedDiagnosticQuestions : diagnosticQuestions
    const totalQuestions = questions.length

    // 範囲チェック：既に全質問終了している場合は何もしない
    if (currentQuestionIndex >= totalQuestions) {
      return
    }

    // 処理開始
    setIsProcessingAnswer(true)

    const q = questions[currentQuestionIndex]

    // 回答を記録（詳細診断の場合はid 4-13、簡易診断の場合はid 1-3）
    setDiagnosticAnswers(prev => ({
      ...prev,
      [q.id]: answer
    }))

    // ユーザーの選択をメッセージに追加
    const selectedOption = answer === 'A' ? q.optionA : q.optionB
    const userAnswer: Message = {
      role: 'user',
      content: `${answer}（${selectedOption.label}）`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userAnswer])

    // タクミの雑談コメント（共感・情報提供）
    const chatComment: Message = {
      role: 'assistant',
      content: selectedOption.chatResponse,
      timestamp: new Date()
    }

    setTimeout(() => {
      setMessages(prev => [...prev, chatComment])

      if (!isMuted) {
        speakText(selectedOption.chatResponse)
      }

      // 次の質問へ
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)

      setTimeout(() => {
        if (isDetailed) {
          askDetailedQuestion(nextIndex)
        } else {
          askNextQuestion(nextIndex)
        }
        // 処理完了（次の質問が表示されてから1秒後に解除）
        setTimeout(() => {
          setIsProcessingAnswer(false)
        }, 1000)
      }, 2000) // 雑談後に次の質問
    }, 800) // 回答後すぐに雑談
  }

  // 診断結果をSupabaseに保存（JSONB柔軟設計）
  const saveDiagnosticResult = async (resultData: {
    flow_type: 'full_diagnostic' | 'skip_diagnostic' | 'partial' | 'detailed_diagnostic'
    initial_concern: string
    answers: Record<string, any>
    result_content?: string
    user_name?: string
    user_phone?: string
    user_email?: string
  }) => {
    try {
      const response = await fetch('/api/save-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: {
            version: '5.0',
            flow_type: resultData.flow_type,
            initial_concern: resultData.initial_concern,
            core_questions: Object.keys(diagnosticAnswers)
              .filter(key => parseInt(key) <= 3)
              .reduce((obj, key) => ({ ...obj, [key]: diagnosticAnswers[parseInt(key)] }), {}),
            detailed_questions: Object.keys(diagnosticAnswers)
              .filter(key => parseInt(key) > 3)
              .reduce((obj, key) => ({ ...obj, [key]: diagnosticAnswers[parseInt(key)] }), {}),
            chat_history: messages.map(m => ({
              role: m.role,
              content: m.content,
              timestamp: m.timestamp.toISOString()
            })),
            ...resultData.answers
          },
          result_type: resultData.flow_type,
          result_content: resultData.result_content,
          user_name: resultData.user_name,
          user_phone: resultData.user_phone,
          user_email: resultData.user_email,
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.id
      }
    } catch {
      // Ignore save errors
    }
    return null
  }

  // 診断結果生成（固定パターン）
  const generateDiagnosticResult = async () => {
    const thinkingMessage: Message = {
      role: 'assistant',
      content: '3つの質問、ありがとうございました！\n\nあなたにぴったりのプランを選んでいます...',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, thinkingMessage])

    if (!isMuted) {
      speakText('3つの質問、ありがとうございました！少々お待ちください。')
    }

    try {
      // 診断パターンを取得
      const q1Answer = diagnosticAnswers[1]
      const q2Answer = diagnosticAnswers[2]
      const q3Answer = diagnosticAnswers[3]

      // 回答が全て揃っているか確認
      if (!q1Answer || !q2Answer || !q3Answer) {
        throw new Error('診断回答が不完全です')
      }

      // 固定診断結果を取得
      const fixedResult = getFixedDiagnosticResult(q1Answer, q2Answer, q3Answer)

      // タグに基づいて施工写真を選定（最大3枚）
      const matchedPortfolios = portfolioData.filter(item =>
        item.tags.some(tag => fixedResult.recommendedTags.includes(tag)) && item.image_url
      ).slice(0, 3)

      const images = matchedPortfolios.map(p => p.image_url)
      setRecommendedImages(images)

      // 簡易診断結果メッセージ
      const result = `✨ **${fixedResult.title}**

${fixedResult.description}

${fixedResult.nextAction}`

      // 少し待ってから結果表示
      setTimeout(() => {
        const resultMessage: Message = {
          role: 'assistant',
          content: result,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, resultMessage])

        if (!isMuted) {
          speakText(fixedResult.title + '。' + fixedResult.description)
        }

        // フェーズを「結果表示」に移行
        setFlowPhase('result')
      }, 1500)

      // 診断結果をSupabaseに保存（JSONB柔軟設計 Ver.5.0）
      await saveDiagnosticResult({
        flow_type: 'full_diagnostic',
        initial_concern: initialConcern,
        answers: {
          result: {
            result_type: fixedResult.id,
            recommended_tags: fixedResult.recommendedTags,
            title: fixedResult.title,
            description: fixedResult.description,
            summary: result
          }
        },
        result_content: result
      }).catch(() => {
        // Ignore save errors
      })

      // 診断完了メッセージ（褒める + 詳細診断誘導）
      setTimeout(() => {
        const completeMessage: Message = {
          role: 'assistant',
          content: '素晴らしい選択ですね！お住まいへのこだわりが感じられます✨\n\n今回は簡易診断（3問）でしたが、もっと詳しく診断すれば、あなたにぴったりの提案ができますよ。\n\n下のボタンから選んでください！',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, completeMessage])

        if (!isMuted) {
          speakText('素晴らしい選択ですね！お住まいへのこだわりが感じられます。もっと詳しく診断することもできますよ。')
        }

        // 詳細診断ボタンを表示
        setShowDetailedDiagnosticButton(true)
        // チャットモードに移行（詳細診断ボタンまたはチャット入力を待つ）
        setFlowPhase('result')
      }, 3000)

    } catch {
      const errorMessage: Message = {
        role: 'assistant',
        content: '申し訳ございません。診断結果の生成中にエラーが発生しました。直接ご相談も承りますので、お気軽にお声がけください。',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])

      if (!isMuted) {
        speakText('申し訳ございません。診断結果の生成中にエラーが発生しました。')
      }

      setFlowPhase('chat')
    }
  }

  // 詳細診断結果生成（10問の回答を基に、OpenAI APIで詳細提案）
  const generateDetailedDiagnosticResult = async () => {
    const thinkingMessage: Message = {
      role: 'assistant',
      content: '10問の質問、お疲れさまでした！\n\nあなたにぴったりの詳細プランを選んでいます...',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, thinkingMessage])

    if (!isMuted) {
      speakText('10問の質問、お疲れさまでした！少々お待ちください。')
    }

    try {
      // すべての回答を取得して質問文とセットで整理
      const answersText = Object.entries(diagnosticAnswers)
        .map(([id, answer]) => {
          const qId = parseInt(id)
          let q
          if (qId <= 3) {
            q = diagnosticQuestionsV4.find(q => q.id === qId)
          } else {
            q = detailedDiagnosticQuestions.find(q => q.id === qId)
          }
          if (!q) return ''
          const selectedOption = answer === 'A' ? q.optionA : q.optionB
          return `Q${qId}: ${q.question}\n回答: ${selectedOption.label}（${selectedOption.description}）`
        })
        .filter(Boolean)
        .join('\n\n')

      // OpenAI APIで詳細な提案を生成
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `あなたは内装工事のプロ職人「タクミ」です。お客様の13問の診断結果を基に、具体的で実践的な施工プランを提案してください。

【提案の形式】
1. プラン名（例：「コスパ重視・スピード施工プラン」）
2. プランの説明（2-3文で、なぜこのプランが最適か）
3. 具体的な施工内容（箇条書き、5-7項目）
4. 予算の目安（概算）
5. 工期の目安
6. おすすめのポイント（2-3個）
7. 次のステップ（お客様への具体的な提案）

【トーン】
- 親しみやすく、カジュアルな口調（「〜ですね」「〜ですよ」）
- 専門用語は使わず、わかりやすく
- 200文字程度でまとめる`
            },
            {
              role: 'user',
              content: `以下の診断結果から、お客様にぴったりの施工プランを提案してください。\n\n【診断結果】\n${answersText}`
            }
          ]
        })
      })

      const data = await response.json()
      const aiProposal = data.message || '申し訳ございません。診断結果の生成に失敗しました。'

      // 少し待ってから結果表示
      setTimeout(async () => {
        const detailedResult = `✨ **詳細診断結果**\n\n${aiProposal}`

        const resultMessage: Message = {
          role: 'assistant',
          content: detailedResult,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, resultMessage])

        if (!isMuted) {
          speakText('詳細診断結果が出ました。あなたにぴったりのプランをご提案します。気になることがあれば、何でも聞いてくださいね。')
        }

        // フェーズを「詳細結果表示」に移行
        setFlowPhase('detailed_result')

        // 詳細診断結果をSupabaseに保存（JSONB柔軟設計 Ver.5.0）
        await saveDiagnosticResult({
          flow_type: 'detailed_diagnostic',
          initial_concern: initialConcern,
          answers: {
            answers_text: answersText,
            result: {
              result_type: 'ai_generated_detailed',
              ai_proposal: aiProposal,
              summary: detailedResult
            }
          },
          result_content: aiProposal
        }).catch(() => {
          // Ignore save errors
        })

        // 診断完了後、チャットモードに移行
        setTimeout(() => {
          const completeMessage: Message = {
            role: 'assistant',
            content: 'これで詳細診断は完了です！\n\nご不明な点や、さらに詳しく知りたいことがあれば、何でも聞いてくださいね。お見積もりのご依頼も承ります！',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, completeMessage])

          if (!isMuted) {
            speakText('これで詳細診断は完了です。ご不明な点があれば、何でも聞いてくださいね。')
          }

          setFlowPhase('chat')
        }, 3000)
      }, 1500)

    } catch {
      // エラー時はフォールバック（簡易的な提案）
      const fallbackResult = `申し訳ございません。詳細な提案の生成中に少し問題が発生しました。

簡易的な提案をさせていただきますね。

【あなたの回答まとめ】
・予算感：${diagnosticAnswers[4] === 'A' ? 'コストを抑えたい' : '質を重視したい'}
・工期：${diagnosticAnswers[5] === 'A' ? 'できるだけ早く' : 'じっくり計画'}
・施工範囲：${diagnosticAnswers[6] === 'A' ? '1〜2部屋' : '3部屋以上'}
・壁紙：${diagnosticAnswers[8] === 'A' ? '無地・シンプル' : '柄・アクセント'}
・床材：${diagnosticAnswers[9] === 'A' ? 'フローリング・木目' : 'タイル・CF'}

この内容で、無料見積もりを出すことができます。
気になることがあれば、何でも聞いてくださいね！`

      const errorMessage: Message = {
        role: 'assistant',
        content: fallbackResult,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])

      if (!isMuted) {
        speakText('申し訳ございません。詳細な提案の生成中に少し問題が発生しました。簡易的な提案をさせていただきますね。')
      }

      setFlowPhase('chat')
    }
  }

  // 詳細診断を開始する関数
  const startDetailedDiagnostic = () => {
    const detailedStartMessage: Message = {
      role: 'assistant',
      content: 'わかりました！それでは、より詳しい10問の診断を始めますね。\n\nあなたにぴったりのプランを見つけるために、もう少し詳しく教えてください！',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, detailedStartMessage])

    if (!isMuted) {
      speakText('わかりました！それでは、より詳しい10問の診断を始めますね。')
    }

    // 詳細診断ボタンを非表示
    setShowDetailedDiagnosticButton(false)

    // 詳細診断モードに移行し、質問をリセット（簡易診断の回答は保持）
    setFlowPhase('detailed_diagnostic')
    setCurrentQuestionIndex(0)

    // 最初の詳細質問を表示
    setTimeout(() => {
      askDetailedQuestion(0)
    }, 2000)
  }

  // メッセージ送信（OpenAI API統合版）
  const handleSend = async () => {
    if (!input.trim()) return

    // 通常のチャットモード（診断後も含む）
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = input // 後でAI応答と一緒に保存するため
    setInput('')

    // AI応答を生成（API経由）
    let aiResponseText = ''
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      const data = await response.json()
      aiResponseText = data.message || '申し訳ございません。少々調子が悪いようです。もう一度お試しください。'

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // 音声で読み上げ
      if (!isMuted) {
        speakText(aiResponseText)
      }

      // コスト監視用ログ（開発環境のみ）
    } catch {
      // エラー時のフォールバック
      aiResponseText = '申し訳ございません。現在少々調子が悪いようです。お急ぎの場合は、お電話（03-5638-7402）でご相談いただけます。'

      const errorMessage: Message = {
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])

      if (!isMuted) {
        speakText('申し訳ございません。現在少々調子が悪いようです。')
      }
    }

    // 診断後の会話の場合、ユーザーメッセージとAI応答をセットでDBに保存（FINANCE用Supabaseに保存）
    const lastDiagnosisId = localStorage.getItem('last_diagnosis_id')
    if (lastDiagnosisId && aiResponseText) {
      try {
        const { createFinanceClient } = await import('@/lib/supabase/finance-client')
        const supabase = createFinanceClient()

        const { error } = await supabase
          .from('diagnostic_conversations')
          .insert({
            diagnosis_id: lastDiagnosisId,
            user_message: userInput,
            ai_response: aiResponseText,
            timestamp: new Date().toISOString()
          })
          .select()

        if (error) {
          throw error
        }
      } catch {
        // 会話保存失敗はサイレントに処理（ユーザー体験に影響させない）
      }
    }
  }


  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[250] flex items-center justify-center backdrop-blur-sm"
      onTouchMove={(e) => {
        // 背景のタッチスクロールを完全に防止
        e.preventDefault()
      }}
      style={{ touchAction: 'none' }}
    >
      <div
        className="bg-white w-full h-full md:w-full md:max-w-5xl md:h-[90vh] flex flex-col overflow-hidden md:shadow-2xl"
        onTouchMove={(e) => {
          // モーダル内のタッチイベントは許可（伝播を停止）
          e.stopPropagation()
        }}
        style={{ touchAction: 'auto' }}
      >
        {/* ヘッダー */}
        <div className="bg-[#10B981] text-white px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b-4 border-[#0ea572] flex-shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-bold">AI職人タクミ</h2>
            <p className="text-xs md:text-sm text-white/90">音声でもテキストでもOK！</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 transition-colors rounded-full"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* アバター表示（上部：スマホ / 左側：PC） */}
          <div className="w-full md:w-2/5 bg-gradient-to-b from-[#40E0D0]/20 to-white flex flex-row md:flex-col items-center justify-center py-2 px-3 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-[#DAE2E8] relative overflow-hidden max-h-[12vh] md:max-h-none gap-3 md:gap-0">
            {/* 背景スライドショー */}
            {backgroundImages.length > 0 && (
              <div className="absolute inset-0 z-0">
                {backgroundImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentBackgroundIndex ? 'opacity-20' : 'opacity-0'
                    }`}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'blur(3px)',
                    }}
                  />
                ))}
              </div>
            )}

            {/* タクミキャラクター（スマホ：左側、PC：中央） */}
            <div className="relative w-16 h-16 md:w-64 md:h-64 z-10 flex-shrink-0">
              {/* 2D職人キャラクター（アニメーション付き） */}
              <AnimatedCraftsman state={avatarState} />

              {/* ステータス表示 - スマホでは非表示 */}
              <div className="hidden md:block absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white border-2 border-[#DAE2E8] px-4 py-2 shadow-lg whitespace-nowrap z-10">
                <p className="text-sm font-bold text-[#252423]">
                  {avatarState === 'listening' && '🎤 聞いてるよ'}
                  {avatarState === 'speaking' && '💬 話し中'}
                  {avatarState === 'idle' && '待機中'}
                </p>
              </div>
            </div>

            {/* コントロール（スマホ：右側縦並び、PC：下部横並び） */}
            <div className="flex flex-col md:flex-row md:mt-8 gap-2 md:gap-4 z-10">
              <button
                onClick={() => {
                  // 音声認識開始時に音声読み上げを停止
                  if (!isListening) {
                    window.speechSynthesis.cancel()
                  }
                  toggleListening()
                }}
                className={`p-2 md:p-4 rounded-full transition-all ${
                  isListening
                    ? 'bg-[#D4AF37] text-white animate-pulse'
                    : 'bg-[#10B981] text-white hover:bg-[#0ea572]'
                } shadow-lg`}
              >
                {isListening ? <MicOff className="w-4 h-4 md:w-6 md:h-6" /> : <Mic className="w-4 h-4 md:w-6 md:h-6" />}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 md:p-4 rounded-full transition-all ${
                  isMuted
                    ? 'bg-gray-400 text-white'
                    : 'bg-[#10B981] text-white hover:bg-[#0ea572]'
                } shadow-lg`}
              >
                {isMuted ? <VolumeX className="w-4 h-4 md:w-6 md:h-6" /> : <Volume2 className="w-4 h-4 md:w-6 md:h-6" />}
              </button>
            </div>

            <p className="mt-1 md:mt-6 text-[10px] md:text-xs text-[#252423]/70 text-center max-w-xs z-10 relative hidden md:block">
              マイクで音声質問OK
            </p>

            {/* 診断進捗バー */}
            {flowPhase === 'diagnostic' && (
              <div className="mt-2 md:mt-4 w-full max-w-xs z-10 relative">
                <div className="bg-gray-200 rounded-full h-1.5 md:h-2 overflow-hidden">
                  <div
                    className="bg-[#10B981] h-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex) / 3) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] md:text-xs text-center mt-0.5 md:mt-1 text-[#252423]/60">
                  簡易診断 {currentQuestionIndex}/3
                </p>
              </div>
            )}
            {flowPhase === 'detailed_diagnostic' && (
              <div className="mt-2 md:mt-4 w-full max-w-xs z-10 relative">
                <div className="bg-gray-200 rounded-full h-1.5 md:h-2 overflow-hidden">
                  <div
                    className="bg-[#D4AF37] h-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex) / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] md:text-xs text-center mt-0.5 md:mt-1 text-[#252423]/60">
                  詳細診断 {currentQuestionIndex}/10
                </p>
              </div>
            )}
          </div>

          {/* チャット表示（下部：スマホ / 右側：PC） */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* メッセージ表示エリア */}
            <div
              className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] px-3 py-2 md:px-4 md:py-3 transform transition-all hover:scale-[1.02] ${
                      message.role === 'user'
                        ? 'bg-[#10B981] text-white rounded-l-2xl rounded-tr-2xl shadow-md hover:shadow-lg'
                        : 'bg-gray-100 text-[#252423] border border-[#DAE2E8] rounded-r-2xl rounded-tl-2xl shadow-sm hover:shadow-md'
                    }`}
                  >
                    <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                    <p className="text-[10px] md:text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 入力エリア */}
            <div className="border-t-2 border-[#DAE2E8] p-3 md:p-4 bg-gray-50 flex-shrink-0 max-h-[50vh] overflow-hidden">
              {/* Ver.4.0: 悩み選択ボタン */}
              {flowPhase === 'concern_select' && (
                <div
                  className="mb-3 space-y-2 animate-slideUp h-full overflow-y-auto overscroll-contain pr-2"
                  style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                >
                  <div className="space-y-2">
                    {initialConcernOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => {
                          // 音声を停止してから選択処理
                          window.speechSynthesis.cancel()
                          handleConcernSelect(option.id)
                        }}
                        className="w-full bg-white border-2 border-[#10B981] text-left py-4 px-5 rounded-xl hover:bg-[#10B981] hover:text-white transition-all shadow-md hover:shadow-lg active:scale-[0.98] group"
                      >
                        <div className="font-bold text-base mb-1 group-hover:text-white text-[#10B981]">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600 group-hover:text-white/90">
                          {option.description}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      // 音声を停止してからスキップ処理
                      window.speechSynthesis.cancel()
                      handleConcernSelect('skip')
                    }}
                    className="w-full bg-gray-200 text-[#252423] py-3 px-4 rounded-xl hover:bg-gray-300 transition-all text-sm border-2 border-gray-300"
                  >
                    診断スキップして直接相談する
                  </button>
                </div>
              )}

              {/* 簡易診断モード用のA/Bボタン */}
              {flowPhase === 'diagnostic' && currentQuestionIndex < diagnosticQuestions.length && (
                <div className="mb-3 space-y-3 animate-slideUp">
                  <button
                    onClick={() => {
                      window.speechSynthesis.cancel()
                      handleDiagnosticAnswer('A')
                    }}
                    disabled={isProcessingAnswer}
                    className="w-full bg-white border-2 border-[#10B981] text-left py-4 px-5 rounded-xl hover:bg-[#10B981] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] group"
                  >
                    <div className="font-bold text-base mb-1 group-hover:text-white text-[#10B981]">
                      A. {diagnosticQuestions[currentQuestionIndex].optionA.label}
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-white/90">
                      {diagnosticQuestions[currentQuestionIndex].optionA.description}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      window.speechSynthesis.cancel()
                      handleDiagnosticAnswer('B')
                    }}
                    disabled={isProcessingAnswer}
                    className="w-full bg-white border-2 border-[#10B981] text-left py-4 px-5 rounded-xl hover:bg-[#10B981] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] group"
                  >
                    <div className="font-bold text-base mb-1 group-hover:text-white text-[#10B981]">
                      B. {diagnosticQuestions[currentQuestionIndex].optionB.label}
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-white/90">
                      {diagnosticQuestions[currentQuestionIndex].optionB.description}
                    </div>
                  </button>
                </div>
              )}

              {/* 詳細診断モード用のA/Bボタン */}
              {flowPhase === 'detailed_diagnostic' && currentQuestionIndex < detailedDiagnosticQuestions.length && (
                <div className="mb-3 space-y-3 animate-slideUp">
                  <button
                    onClick={() => {
                      window.speechSynthesis.cancel()
                      handleDiagnosticAnswer('A')
                    }}
                    disabled={isProcessingAnswer}
                    className="w-full bg-white border-2 border-[#D4AF37] text-left py-4 px-5 rounded-xl hover:bg-[#D4AF37] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] group"
                  >
                    <div className="font-bold text-base mb-1 group-hover:text-white text-[#D4AF37]">
                      A. {detailedDiagnosticQuestions[currentQuestionIndex].optionA.label}
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-white/90">
                      {detailedDiagnosticQuestions[currentQuestionIndex].optionA.description}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      window.speechSynthesis.cancel()
                      handleDiagnosticAnswer('B')
                    }}
                    disabled={isProcessingAnswer}
                    className="w-full bg-white border-2 border-[#D4AF37] text-left py-4 px-5 rounded-xl hover:bg-[#D4AF37] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] group"
                  >
                    <div className="font-bold text-base mb-1 group-hover:text-white text-[#D4AF37]">
                      B. {detailedDiagnosticQuestions[currentQuestionIndex].optionB.label}
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-white/90">
                      {detailedDiagnosticQuestions[currentQuestionIndex].optionB.description}
                    </div>
                  </button>
                </div>
              )}

              {/* 詳細診断ボタン（簡易診断結果後に表示） */}
              {showDetailedDiagnosticButton && flowPhase === 'result' && (
                <div className="mb-3 space-y-2 animate-slideUp">
                  <button
                    onClick={() => {
                      window.speechSynthesis.cancel()
                      startDetailedDiagnostic()
                    }}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-white py-4 px-6 rounded-xl hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] font-bold text-base"
                  >
                    🔍 詳しく診断する（10問）
                  </button>
                  <button
                    onClick={() => {
                      window.speechSynthesis.cancel()
                      setShowDetailedDiagnosticButton(false)
                      setFlowPhase('chat')
                    }}
                    className="w-full bg-gray-200 text-[#252423] py-3 px-4 rounded-xl hover:bg-gray-300 transition-all text-sm border-2 border-gray-300"
                  >
                    このまま相談する
                  </button>
                </div>
              )}

              {/* 通常入力 (Ver.4.0: チャットモードと結果表示後) */}
              {(flowPhase === 'chat' || flowPhase === 'detailed_result' || (flowPhase === 'result' && !showDetailedDiagnosticButton)) && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    onFocus={() => {
                      // 入力フォーカス時に音声を停止
                      window.speechSynthesis.cancel()
                    }}
                    placeholder="メッセージを入力..."
                    className="flex-1 px-3 py-2 md:px-4 md:py-3 border border-[#DAE2E8] focus:outline-none focus:border-[#10B981] text-xs md:text-sm rounded-lg"
                    disabled={isListening}
                  />
                  <button
                    onClick={() => {
                      // 送信時に音声を停止
                      window.speechSynthesis.cancel()
                      handleSend()
                    }}
                    disabled={!input.trim() || isListening}
                    className="bg-[#10B981] text-white px-4 md:px-6 py-2 md:py-3 hover:bg-[#0ea572] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 md:gap-2 rounded-lg shadow-lg hover:shadow-xl active:scale-95 text-xs md:text-sm font-bold"
                  >
                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">送信</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
