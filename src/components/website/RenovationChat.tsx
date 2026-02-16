'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Bot, Terminal, Loader2, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
    id: string
    role: 'ai' | 'user'
    text: string
    timestamp: Date
    isPrompt?: boolean
}

type RenovationChatProps = {
    onPromptGenerate: (prompt: string) => void
}

export default function RenovationChat({ onPromptGenerate }: RenovationChatProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMessages([
            {
                id: '1',
                role: 'ai',
                text: 'Nano Banana Pro Interface initialized. ターゲットエリアの指示を入力してください。最適な生成プロンプトを作成します。',
                timestamp: new Date()
            }
        ])
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Simulate AI processing
        setTimeout(() => {
            let prompt = ''
            let explanation = ''

            if (input.includes('北欧') || input.includes('ナチュラル')) {
                prompt = '/imagine prompt: interior design, nordic style, living room, white oak flooring, minimal furniture, natural lighting, soft shadows, 8k resolution, photorealistic, architectural photography --v 6.0 --ar 16:9'
                explanation = '北欧スタイルのための最適化プロンプトを生成しました。自然光と素材感を強調するパラメータを含めています。'
            } else if (input.includes('モダン') || input.includes('シック') || input.includes('暗く') || input.includes('黒')) {
                prompt = '/imagine prompt: interior design, modern chic style, luxury living room, dark tones, black marble flooring, ambient lighting, cinematic lighting, high contrast, 8k resolution, unreal engine 5 render --v 6.0 --ar 16:9'
                explanation = 'モダンシックな空間のためのプロンプトです。コントラストとライティングを強化し、高級感を演出するパラメータを設定しました。'
            } else if (input.includes('インダストリアル') || input.includes('コンクリート')) {
                prompt = '/imagine prompt: interior design, industrial loft style, exposed concrete walls, raw wood beams, iron furniture, dramatic lighting, volumetric fog, 8k resolution, hyperrealistic --v 6.0 --ar 16:9'
                explanation = 'インダストリアルデザイン向けのプロンプトです。コンクリートの質感と空間の奥行きを表現するためのパラメータを追加しています。'
            } else {
                prompt = `/imagine prompt: interior design, ${input} style, living room, professional photography, 8k resolution, photorealistic, highly detailed --v 6.0 --ar 16:9`
                explanation = '入力されたキーワードに基づき、汎用的な高品質プロンプトを生成しました。'
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                text: explanation,
                timestamp: new Date()
            }

            const promptMsg: Message = {
                id: (Date.now() + 2).toString(),
                role: 'ai',
                text: prompt,
                timestamp: new Date(),
                isPrompt: true
            }

            setMessages(prev => [...prev, aiMsg, promptMsg])
            setIsTyping(false)
            onPromptGenerate(prompt)
        }, 1500)
    }

    return (
        <div className="flex flex-col h-full bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl font-mono">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center border border-gray-700">
                    <Terminal className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                    <h3 className="text-gray-200 font-bold text-sm tracking-wider">NANO BANANA PRO</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        <span className="text-[10px] text-gray-500 uppercase">System Ready</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] uppercase ${msg.role === 'user' ? 'text-blue-400' : 'text-[#10B981]'}`}>
                                {msg.role === 'user' ? 'USER_INPUT' : 'SYSTEM_OUTPUT'}
                            </span>
                            <span className="text-[10px] text-gray-600">{msg.timestamp.toLocaleTimeString()}</span>
                        </div>

                        {msg.isPrompt ? (
                            <div className="w-full max-w-[95%] bg-[#10B981]/10 border border-[#10B981]/30 rounded p-4 relative group">
                                <code className="text-[#10B981] text-sm break-all">{msg.text}</code>
                                <button
                                    onClick={() => handleCopy(msg.text, msg.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-[#10B981]/20 hover:bg-[#10B981]/40 rounded text-[#10B981] transition-colors"
                                >
                                    {copiedId === msg.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        ) : (
                            <div className={`max-w-[85%] text-sm leading-relaxed ${msg.role === 'user'
                                ? 'text-gray-300'
                                : 'text-gray-400'
                                }`}>
                                {msg.role === 'ai' && <span className="text-[#10B981] mr-2">{'>'}</span>}
                                {msg.text}
                            </div>
                        )}
                    </motion.div>
                ))}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[#10B981]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs animate-pulse">PROCESSING...</span>
                    </motion.div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/30">
                <div className="relative flex items-center gap-2">
                    <span className="text-[#10B981]">{'>'}</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Enter instruction..."
                        className="w-full bg-transparent border-none text-white placeholder-gray-600 focus:outline-none focus:ring-0 font-mono text-sm"
                        autoFocus
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="p-2 text-gray-500 hover:text-[#10B981] disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
