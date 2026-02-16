'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, Loader2, Check } from 'lucide-react'
import { createFinanceClient } from '@/lib/supabase/finance-client'
import { lpSurveyQuestionsV2, type SurveyAnswer } from '@/data/lp-survey-questions-v2'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface DigitalHumanSurveyProps {
  isOpen: boolean
  onClose: () => void
}

const TOTAL_QUESTIONS = 10

export default function DigitalHumanSurvey({ isOpen, onClose }: DigitalHumanSurveyProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswer[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createFinanceClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 初期メッセージと最初の質問
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: 'こんにちは！AI職人タクミです。\n\nこれから、あなた専用のホームページを作るために、10個の質問をさせていただきます。\n\nあなたの魅力や強みを引き出すための会話なので、リラックスしてお答えください。',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])

      // 最初の質問を表示
      setTimeout(() => {
        askQuestion(0)
      }, 2000)
    }
  }, [isOpen])

  // 質問を表示
  const askQuestion = (index: number) => {
    if (index >= lpSurveyQuestionsV2.length) {
      handleSurveyComplete()
      return
    }

    const question = lpSurveyQuestionsV2[index]
    const questionMessage: Message = {
      role: 'assistant',
      content: `【質問 ${index + 1}/${TOTAL_QUESTIONS}】${question.category}\n\n${question.question}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, questionMessage])
    setCurrentQuestionIndex(index)
  }

  // ユーザーの回答を送信
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // 回答を保存
    const currentQuestion = lpSurveyQuestionsV2[currentQuestionIndex]
    const answer: SurveyAnswer = {
      question_id: currentQuestion.id,
      question: currentQuestion.question,
      answer: input.trim(),
    }
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    setInput('')
    setIsProcessing(true)

    // 5問目の場合は、GPT APIで共感コメントを生成
    if (currentQuestionIndex === 4) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'あなたは職人のLP作成を支援するAI職人タクミです。これまでの回答を踏まえ、相手の魅力や特徴を理解していることを示す共感コメントを1〜2文で返してください。敬語で自然に。',
              },
              {
                role: 'user',
                content: `これまでの回答:\n${newAnswers.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join('\n\n')}`,
              },
            ],
          }),
        })

        const data = await response.json()
        const empathyComment = data.message || 'ありがとうございます。素晴らしい内容ですね。'

        const reactionMessage: Message = {
          role: 'assistant',
          content: empathyComment,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, reactionMessage])
      } catch {
        const reactionMessage: Message = {
          role: 'assistant',
          content: 'ありがとうございます。あなたの仕事への想いがよく伝わってきました。',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, reactionMessage])
      }
    } else {
      // 通常の短い反応
      const reactions = [
        'ありがとうございます。',
        'なるほど、素晴らしいですね。',
        'わかりました。',
        '了解しました。',
      ]
      const reaction = reactions[Math.floor(Math.random() * reactions.length)]

      const reactionMessage: Message = {
        role: 'assistant',
        content: reaction,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, reactionMessage])
    }

    // 次の質問へ
    setTimeout(() => {
      setIsProcessing(false)
      askQuestion(currentQuestionIndex + 1)
    }, 1500)
  }

  // アンケート完了
  const handleSurveyComplete = async () => {
    setIsCompleted(true)
    setIsProcessing(true)

    // GPT APIで全体のまとめコメントを生成
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'あなたは職人のLP作成を支援するAI職人タクミです。10個の質問への回答をもとに、この職人の魅力を3〜4文で要約してください。具体的で心に響く内容にし、最後に「近日中に専用URLをお送りします」と締めてください。敬語で。',
            },
            {
              role: 'user',
              content: `全ての回答:\n${answers.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join('\n\n')}`,
            },
          ],
        }),
      })

      const data = await response.json()
      const summaryComment = data.message || 'ありがとうございました。\n\n全ての質問にお答えいただきました。\n\nいただいた情報をもとに、あなたの魅力を最大限に引き出すホームページを作成します。\n\n近日中に、専用URLをお送りしますので、楽しみにお待ちください。'

      const completionMessage: Message = {
        role: 'assistant',
        content: summaryComment,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, completionMessage])
    } catch {
      const completionMessage: Message = {
        role: 'assistant',
        content: 'ありがとうございました。\n\n全ての質問にお答えいただきました。\n\nいただいた情報をもとに、あなたの魅力を最大限に引き出すホームページを作成します。\n\n近日中に、専用URLをお送りしますので、楽しみにお待ちください。',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, completionMessage])
    } finally {
      setIsProcessing(false)
    }

    // Supabaseに保存
    try {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('diagnostic_results')
        .insert({
          answers: {
            version: 'lp_survey_v3_static',
            flow_type: 'lp_survey_static',
            completed_at: now,
            questions_and_answers: answers,
            total_questions: TOTAL_QUESTIONS,
          },
          result_type: 'lp_survey',
          flow_type: 'lp_survey_static',
          completed_at: now,
        })
        .select()

      // Silently ignore save errors - survey answers already collected
    } catch {
      // Silently ignore save exceptions
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-3xl bg-gradient-to-b from-white to-gray-50 overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-500">
        {/* ヘッダー */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
              AI職人タクミ - あなた専用LP作成
            </h2>
            <p className="text-sm text-white/90 mt-1 font-medium">
              {isCompleted
                ? '✨ 完了しました！'
                : `質問 ${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS} - あなたの魅力を引き出します`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            aria-label="閉じる"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* プログレスバー */}
        {!isCompleted && (
          <div className="relative h-2 bg-gray-200">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
            ></div>
          </div>
        )}

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-gray-50/50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex animate-in slide-in-from-bottom-2 duration-300 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg ring-4 ring-emerald-100 bg-white">
                    <img
                      src="/icons/craftsman.png"
                      alt="AI職人タクミ"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div
                className={`max-w-[75%] px-5 py-4 rounded-3xl shadow-md transition-all duration-200 hover:shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-100'
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg ring-4 ring-emerald-100 bg-white">
                  <img
                    src="/icons/craftsman.png"
                    alt="AI職人タクミ"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="bg-white px-5 py-4 rounded-3xl shadow-md border border-gray-100">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                  <span className="text-sm text-gray-500">考え中...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        {!isCompleted && (
          <div className="border-t border-gray-200 bg-white p-5">
            <div className="flex gap-3 items-end">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={lpSurveyQuestionsV2[currentQuestionIndex]?.placeholder || 'ここに回答を入力してください...'}
                disabled={isProcessing}
                className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-[15px] transition-all duration-200"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isProcessing}
                className="px-7 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl font-medium"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">送信</span>
              </button>
            </div>
          </div>
        )}

        {/* 完了ボタン */}
        {isCompleted && (
          <div className="border-t border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
            <button
              onClick={onClose}
              className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl"
            >
              <Check className="w-7 h-7" />
              完了 - 閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
