'use client'

import { motion } from 'framer-motion'
import { timelineData } from '@/data/home-data'
import { fadeInUp, staggerContainer } from '@/utils/animations'

export default function HistorySection() {
    return (
        <section className="py-8 sm:py-12 bg-white border-t border-[#DAE2E8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-lg sm:text-xl font-black mb-4 sm:mb-6 text-[#252423] border-b-2 border-[#D4AF37] pb-2 inline-block"
                >
                    沿革
                </motion.h2>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-4 sm:mt-6"
                >
                    {timelineData.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            className="border border-[#DAE2E8] p-3 sm:p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="text-sm sm:text-base font-black text-[#D4AF37] mb-1 sm:mb-2">
                                {item.year}
                            </div>
                            <h3 className="text-sm font-bold text-[#252423] mb-1">
                                {item.title}
                            </h3>
                            <p className="text-xs text-[#252423]/70">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
