'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Check, Sparkles, MessageCircle } from 'lucide-react'
import { createFinanceClient } from '@/lib/supabase/finance-client'
import { casualSurveyQuestions, type SurveyAnswer } from '@/data/casual-survey-questions'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface CasualSurveyProps {
  isOpen: boolean
  onClose: () => void
}

const TOTAL_QUESTIONS = casualSurveyQuestions.length

export default function CasualSurvey({ isOpen, onClose }: CasualSurveyProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswer[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customInput, setCustomInput] = useState('')

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
        content: 'こんにちは。イワサキ内装でございます。\n\nこの度は、簡単なアンケートにご協力いただけますと幸いです。\n\n10問ほどございますので、お気軽にお答えください。',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])

      setTimeout(() => {
        askQuestion(0)
      }, 1500)
    }
  }, [isOpen])

  const askQuestion = (index: number) => {
    if (index >= casualSurveyQuestions.length) {
      handleSurveyComplete()
      return
    }

    const question = casualSurveyQuestions[index]
    const questionMessage: Message = {
      role: 'assistant',
      content: `【${index + 1}/${TOTAL_QUESTIONS}】${question.question}\n${question.subtitle ? question.subtitle : ''}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, questionMessage])
    setCurrentQuestionIndex(index)
    setShowCustomInput(false)
    setCustomInput('')
  }

  const handleChoiceClick = async (choice: string, choiceText: string) => {
    if (isProcessing) return

    const userMessage: Message = {
      role: 'user',
      content: choiceText,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    const currentQuestion = casualSurveyQuestions[currentQuestionIndex]
    const answer: SurveyAnswer = {
      question_id: currentQuestion.id,
      question: currentQuestion.question,
      selected_choice: choice,
      hidden_trait: currentQuestion.hiddenTrait,
    }
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    setIsProcessing(true)

    // 丁寧な反応
    const reactions = [
      'ありがとうございます。',
      'かしこまりました。',
      '承知いたしました。',
      'ご回答ありがとうございます。',
    ]
    const reaction = reactions[Math.floor(Math.random() * reactions.length)]

    setTimeout(() => {
      const reactionMessage: Message = {
        role: 'assistant',
        content: reaction,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, reactionMessage])

      setTimeout(() => {
        setIsProcessing(false)
        askQuestion(currentQuestionIndex + 1)
      }, 800)
    }, 600)
  }

  const handleCustomSubmit = async () => {
    if (!customInput.trim() || isProcessing) return

    const userMessage: Message = {
      role: 'user',
      content: customInput,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    const currentQuestion = casualSurveyQuestions[currentQuestionIndex]
    const answer: SurveyAnswer = {
      question_id: currentQuestion.id,
      question: currentQuestion.question,
      custom_answer: customInput.trim(),
      hidden_trait: currentQuestion.hiddenTrait,
    }
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    setCustomInput('')
    setShowCustomInput(false)
    setIsProcessing(true)

    const reactions = ['詳しくお答えいただきありがとうございます。', 'ご回答ありがとうございます。', '承知いたしました。']
    const reaction = reactions[Math.floor(Math.random() * reactions.length)]

    setTimeout(() => {
      const reactionMessage: Message = {
        role: 'assistant',
        content: reaction,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, reactionMessage])

      setTimeout(() => {
        setIsProcessing(false)
        askQuestion(currentQuestionIndex + 1)
      }, 800)
    }, 600)
  }

  const handleSurveyComplete = async () => {
    setIsCompleted(true)
    setIsProcessing(true)

    // 完了メッセージ（シンプルに）
    const completionMessage: Message = {
      role: 'assistant',
      content:
        'アンケートへのご協力、誠にありがとうございました。\n\nいただいた貴重なご意見を今後のサービス向上に活かしてまいります。\n\n引き続き、イワサキ内装をよろしくお願いいたします。',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, completionMessage])
    setIsProcessing(false)

    // Supabaseに保存
    try {
      if (!supabase) {
        return
      }
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('diagnostic_results')
        .insert({
          answers: {
            version: 'casual_survey_v1',
            flow_type: 'casual_personality_survey',
            completed_at: now,
            questions_and_answers: answers,
            total_questions: TOTAL_QUESTIONS,
          },
          result_type: 'casual_survey',
          flow_type: 'casual_personality_survey',
          completed_at: now,
        })
        .select()

      // Silently ignore save errors
    } catch {
      // Silently ignore save exceptions
    }
  }

  const currentQuestion = casualSurveyQuestions[currentQuestionIndex]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full h-full md:h-[90vh] md:max-w-4xl md:rounded-3xl bg-gradient-to-b from-white to-gray-50 overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-500">
        {/* ヘッダー */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-white/50 bg-white">
              <img src="/icons/craftsman.png" alt="タクミ" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white drop-shadow-lg">
                イワサキ内装 アンケート
              </h2>
              <p className="text-xs text-white/90 font-medium">
                {isCompleted ? '完了しました' : `質問 ${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            aria-label="閉じる"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* プログレスバー */}
        {!isCompleted && (
          <div className="relative h-1.5 bg-gray-200">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
            ></div>
          </div>
        )}

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-gray-50/30">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex animate-in slide-in-from-bottom-2 duration-300 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-emerald-200 bg-white">
                    <img src="/icons/craftsman.png" alt="タクミ" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${message.role === 'user'
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-medium'
                    : 'bg-white text-gray-800 border border-gray-100'
                  }`}
              >
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 選択肢エリア */}
        {!isCompleted && !isProcessing && currentQuestion && (
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="space-y-2 mb-3">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoiceClick(choice.value, choice.text)}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-teal-50 border-2 border-gray-200 hover:border-emerald-400 rounded-xl transition-all duration-200 flex items-center gap-3 group"
                >
                  <span className="text-[15px] font-medium text-gray-700 group-hover:text-emerald-700">{choice.text}</span>
                </button>
              ))}
            </div>

            {currentQuestion.allowCustomInput && !showCustomInput && (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-600"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">自由に記入する</span>
              </button>
            )}

            {showCustomInput && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
                  placeholder={currentQuestion.customInputPlaceholder || 'ご自由にお書きください'}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-[15px]"
                  autoFocus
                />
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customInput.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  送信
                </button>
              </div>
            )}
          </div>
        )}

        {/* 完了ボタン */}
        {isCompleted && (
          <div className="border-t border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
            <button
              onClick={onClose}
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <Check className="w-6 h-6" />
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
