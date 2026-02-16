'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { servicesData, supportServicesData } from '@/data/home-data'
import { fadeInUp, staggerContainer } from '@/utils/animations'

export default function ServicesSection() {
    return (
        <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ staggerChildren: 0.1 }}
                    className="text-center mb-12"
                >
                    <motion.div variants={fadeInUp} className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 text-xs sm:text-sm font-bold mb-4 border border-[#D4AF37]">
                        Our Services
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-black text-[#252423] mb-4">
                        サービス一覧
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-base sm:text-lg text-[#252423]/70 max-w-2xl mx-auto">
                        伝統の職人技から最先端技術まで、<br className="hidden sm:block" />
                        お客様のニーズに合わせた多彩なサービスをご提供
                    </motion.p>
                </motion.div>

                {/* 主要サービス */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12"
                >
                    {servicesData.map((s, i) => (
                        <motion.div key={i} variants={fadeInUp}>
                            <Link href={s.href} className="group block h-full">
                                <div className="relative bg-white border-2 border-[#DAE2E8] p-6 hover:shadow-2xl hover:border-[#10B981] transition-all h-full overflow-hidden rounded-lg">
                                    {/* 背景画像 */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                                        <img src={s.bgImage} alt="" className="w-full h-full object-cover" />
                                    </div>

                                    {/* カラーアクセント */}
                                    <div
                                        className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2"
                                        style={{ backgroundColor: s.color }}
                                    ></div>

                                    {/* コンテンツ */}
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-gray-50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                            <img src={s.icon} alt={s.title} className="w-8 h-8 object-contain" />
                                        </div>
                                        <h3 className="text-lg font-black text-[#252423] mb-2">{s.title}</h3>
                                        <p className="text-sm text-[#252423]/80 mb-2 font-medium">{s.desc}</p>
                                        <p className="text-xs text-[#252423]/60">{s.detail}</p>

                                        {/* 矢印アイコン */}
                                        <div className="mt-4 flex items-center text-[#10B981] text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <span>詳しく見る</span>
                                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* サポートサービス */}
                <div className="border-t border-[#DAE2E8] pt-8">
                    <h3 className="text-xl font-black text-[#252423] mb-6 text-center">その他サービス</h3>
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {supportServicesData.map((s, i) => (
                            <motion.div key={i} variants={fadeInUp}>
                                <Link href={s.href} className="group block h-full">
                                    <div className="bg-white border border-[#DAE2E8] p-4 hover:shadow-lg hover:border-[#D4AF37] transition-all h-full rounded-lg">
                                        <div className="w-8 h-8 mb-2 flex items-center justify-center">
                                            <img src={s.icon} alt={s.title} className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <h4 className="text-sm font-bold text-[#252423] mb-1">{s.title}</h4>
                                        <p className="text-xs text-[#252423]/60">{s.desc}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
