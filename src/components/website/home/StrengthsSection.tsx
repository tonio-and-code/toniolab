'use client'

import { motion } from 'framer-motion'
import { fadeInLeft, fadeInRight } from '@/utils/animations'

export default function StrengthsSection() {
    return (
        <section className="relative py-8 sm:py-12 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-[#DAE2E8] p-4 sm:p-6 md:p-8 relative overflow-visible">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-lg sm:text-xl md:text-2xl font-black mb-4 sm:mb-6 text-[#252423] border-b-2 border-[#10B981] pb-2 sm:pb-3 inline-block"
                    >
                        イワサキ内装の強み
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* 左カラム */}
                        <motion.div
                            variants={fadeInLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#10B981] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#252423] mb-1">1994年創業の確かな実績</h3>
                                    <p className="text-sm text-[#252423]/70">都内を中心に、クロス張替え、ダイノックシート施工、床材施工など幅広い内装工事に対応</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#10B981] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#252423] mb-1">50名超の職人ネットワーク</h3>
                                    <p className="text-sm text-[#252423]/70">確かな技術を持つプロフェッショナルが、あらゆる工事に対応</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#10B981] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">3</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#252423] mb-1">丁寧な施工と誠実な対応</h3>
                                    <p className="text-sm text-[#252423]/70">お客様とのコミュニケーションを大切にし、ご要望に寄り添った施工を心がけています</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* 右カラム */}
                        <motion.div
                            variants={fadeInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#10B981] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">4</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#252423] mb-1">色彩設計・デザイン提案</h3>
                                    <p className="text-sm text-[#252423]/70">専門家による色彩設計で、空間の価値を最大化。「壁紙を貼る」から「空間をデザインする」へ</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#10B981] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">5</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#252423] mb-1">充実のアフターサポート</h3>
                                    <p className="text-sm text-[#252423]/70">施工後も安心の保証制度。長期的なお付き合いを大切にしています</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#10B981] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">6</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#252423] mb-1">首都圏対応</h3>
                                    <p className="text-sm text-[#252423]/70">東京・神奈川を中心に幅広いエリアをカバー。迅速な対応が可能です</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
