'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { portfolioData } from '@/data/portfolio-real'
import { fadeInUp, staggerContainer } from '@/utils/animations'

export default function PortfolioSection() {
    return (
        <section className="py-8 sm:py-12 bg-white border-t border-[#DAE2E8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    className="mb-6"
                >
                    <h2 className="text-lg sm:text-xl font-black text-[#252423] border-b-2 border-[#D4AF37] pb-2 inline-block">主な施工実績</h2>
                    <p className="text-xs sm:text-sm text-[#252423]/70 mt-2">
                        最近の施工実績の抜粋をご紹介します
                    </p>
                </motion.div>

                {/* グリッドレイアウト - portfolio.tsから最新6件を表示 */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
                >
                    {portfolioData.slice(0, 6).map((project) => (
                        <motion.div key={project.id} variants={fadeInUp}>
                            <Link
                                href={`/portfolio#${project.id}`}
                                className="group block bg-white border border-[#DAE2E8] overflow-hidden hover:shadow-lg transition-all h-full"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={project.image_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {project.is_featured && (
                                        <div className="absolute top-2 left-2 bg-[#10B981] text-white px-2 py-1 text-xs font-bold">
                                            注目実績
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-[#D4AF37] text-white px-2 py-1 text-xs font-bold">
                                        {project.area}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-[#252423] mb-2 text-sm line-clamp-2">
                                        {project.title}
                                    </h3>
                                    <div className="space-y-1 text-xs text-[#252423]/70 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#10B981]">●</span>
                                            <span className="font-bold">所在地:</span>
                                            <span>{project.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#10B981]">●</span>
                                            <span className="font-bold">工事内容:</span>
                                            <span className="line-clamp-1">{project.work_type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#10B981]">●</span>
                                            <span className="font-bold">完工日:</span>
                                            <span>{new Date(project.completion_date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#252423]/60 line-clamp-2">
                                        {project.description}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <Link
                        href="/portfolio"
                        className="inline-block bg-white text-[#252423] px-8 py-3 font-bold text-sm border-2 border-[#DAE2E8] hover:border-[#10B981] hover:text-[#10B981] transition-all"
                    >
                        すべての施工実績を見る（{portfolioData.length}件） →
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
