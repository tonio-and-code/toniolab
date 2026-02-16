'use client'

import Link from 'next/link'
import SocialShare from '@/components/website/SocialShare'

export default function CtaSection() {
    return (
        <section className="py-8 sm:py-12 bg-[#F5F5F5] border-t border-[#DAE2E8]">
            <div className="max-w-5xl mx-auto px-4">
                <div className="bg-white border border-[#DAE2E8] overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* 左側：画像 */}
                        <div className="relative h-48 sm:h-56 md:h-auto">
                            <img
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop"
                                alt="お問い合わせ"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* 右側:テキスト＆ボタン */}
                        <div className="p-8 flex flex-col justify-center">
                            <div className="inline-block bg-[#10B981]/10 text-[#10B981] px-3 py-1 text-xs font-bold mb-4 self-start border border-[#10B981]">
                                いつでも相談可能
                            </div>

                            <h2 className="text-2xl font-black text-[#252423] mb-3 leading-tight">
                                まずはAI職人「タクミ」に<br />相談してみませんか？
                            </h2>

                            <p className="text-sm text-[#252423]/70 mb-6 leading-relaxed">
                                見積もり相談、施工の疑問、工事の流れなど、<br />
                                AIが即座にお答えします。もちろん無料です。
                            </p>

                            <div className="space-y-3">
                                <Link
                                    href="/chat"
                                    className="block text-center bg-[#10B981] text-white px-6 py-4 text-base font-bold hover:bg-[#0ea572] transition-all shadow-lg hover:shadow-xl"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <span>AIタクミに相談する（無料）</span>
                                    </div>
                                </Link>

                                <div className="text-center">
                                    <p className="text-xs text-[#252423]/50 mb-2">お急ぎの方・直接相談したい方</p>
                                    <Link
                                        href="/contact"
                                        className="inline-block text-sm text-[#252423] hover:text-[#10B981] transition-colors underline"
                                    >
                                        お問い合わせフォーム
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SNSシェア */}
                <div className="mt-6 bg-white border border-[#DAE2E8] p-4">
                    <SocialShare
                        title="イワサキ内装 - 技術と人を尊重し、伝統と革新で持続可能な空間を創造する"
                        description="確かな技術と信頼で、理想の空間を実現します。内装工事・リフォーム・バリアフリーはイワサキ内装にお任せください。"
                    />
                </div>

            </div>
        </section>
    )
}
