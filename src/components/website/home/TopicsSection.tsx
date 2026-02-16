'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'

export default function TopicsSection() {
    return (
        <section className="py-8 sm:py-12 bg-white border-t border-[#DAE2E8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-lg sm:text-xl font-black text-[#252423] border-b-2 border-[#D4AF37] pb-2"
                    >
                        TOPICS
                    </motion.h2>
                    <Link href="/news" className="text-[#10B981] font-bold flex items-center gap-1 sm:gap-2 hover:gap-3 transition-all text-xs sm:text-sm">
                        すべて見る <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                </div>

                {/* メイントピック（大きく） */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4"
                >
                    <motion.div variants={fadeInUp}>
                        <Link href="/technology/ai" className="group block relative overflow-hidden border border-[#DAE2E8] hover:shadow-lg transition-shadow h-full">
                            <div className="relative h-48 sm:h-56 md:h-64">
                                <img
                                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop"
                                    alt="AI・DX推進"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/50"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white">
                                    <div className="inline-block bg-[#D4AF37] text-[#252423] px-2 py-1 text-xs font-bold mb-1 sm:mb-2">DX</div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">業界のDX推進事例</h3>
                                    <p className="text-xs text-gray-200">AI・デジタル技術で内装業界に革新を</p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Link href="/portfolio" className="group block relative overflow-hidden border border-[#DAE2E8] hover:shadow-lg transition-shadow h-full">
                            <div className="relative h-48 sm:h-56 md:h-64">
                                <img
                                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop"
                                    alt="施工実績"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/50"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white">
                                    <div className="inline-block bg-[#D4AF37] text-[#252423] px-2 py-1 text-xs font-bold mb-1 sm:mb-2">実績</div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">最新施工実績</h3>
                                    <p className="text-xs text-gray-200">マンション・オフィス改修事例</p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* サブトピック（小さく） */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
                >
                    <motion.div variants={fadeInUp}>
                        <Link href="/news/1" className="group block bg-[#F5F5F5] p-4 border border-[#DAE2E8] hover:shadow-md transition-shadow h-full">
                            <div className="flex items-start gap-3">
                                <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=200&auto=format&fit=crop"
                                        alt="AI日報"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[#D4AF37] text-xs font-bold mb-1">Tech</div>
                                    <h4 className="text-sm font-bold text-[#252423]">AI日報システム導入</h4>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Link href="/technology/craftsmen" className="group block bg-[#F5F5F5] p-4 border border-[#DAE2E8] hover:shadow-md transition-shadow h-full">
                            <div className="flex items-start gap-3">
                                <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&auto=format&fit=crop"
                                        alt="職人ネットワーク"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[#D4AF37] text-xs font-bold mb-1">人材</div>
                                    <h4 className="text-sm font-bold text-[#252423]">職人ネットワーク拡大</h4>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Link href="/technology/quality" className="group block bg-[#F5F5F5] p-4 border border-[#DAE2E8] hover:shadow-md transition-shadow h-full">
                            <div className="flex items-start gap-3">
                                <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&auto=format&fit=crop"
                                        alt="品質管理"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[#D4AF37] text-xs font-bold mb-1">品質</div>
                                    <h4 className="text-sm font-bold text-[#252423]">施工品質へのこだわり</h4>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
