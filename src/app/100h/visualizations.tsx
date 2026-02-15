'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// =============================================================================
// SHARED TYPES & DATA
// =============================================================================

interface DepthZone {
  depth: number
  name: string
  nameJa: string
  hours: number
  color: string
  thought: string
  innerVoice: string  // 内なる声（長い独白）
  discovery: string
  soundscape: string
  creature: string | null
  milestone: string  // この深度で起こる出来事
  feeling: string    // 感情の状態
}

const DEPTH_ZONES: DepthZone[] = [
  {
    depth: 0, name: 'Surface', nameJa: '水面', hours: 0, color: '#87CEEB',
    thought: '何も聞き取れない。音の洪水に溺れそうだ。',
    innerVoice: '英語が怖い。ネイティブの速さについていけない。単語と単語の切れ目すら分からない。これは無理なんじゃないか...でも、飛び込むしかない。深呼吸。潜るぞ。',
    discovery: '音の洪水',
    soundscape: '♪♪???♪♪???',
    creature: null,
    milestone: '最初の一歩を踏み出した',
    feeling: '不安と期待',
  },
  {
    depth: 1, name: 'Sunlight Zone', nameJa: '太陽光層', hours: 25, color: '#4169E1',
    thought: '待って...今の単語、知ってる！',
    innerVoice: '25時間。まだ浅い。でも何かが変わり始めている。あ、今「actually」って聞こえた。知ってる単語だ。音の洪水の中に、浮かぶ単語がある。点と点が、少しずつ繋がり始めている。',
    discovery: '単語が浮かぶ',
    soundscape: 'Hello...♪...thank you...nice to meet...',
    creature: 'jellyfish',
    milestone: '知っている単語が聞こえ始めた',
    feeling: '小さな希望',
  },
  {
    depth: 2, name: 'Twilight Zone', nameJa: '薄明層', hours: 50, color: '#191970',
    thought: '文の骨格が見えてきた。',
    innerVoice: '50時間。光が届きにくくなってきた。でも、目が慣れてきた。文の構造が見える。主語があって、動詞があって、目的語がある。「I think that...」で始まったら、次は理由が来る。パターンが見えてきた。暗闘の中に、秩序がある。',
    discovery: '文法の骨格',
    soundscape: 'I think that... because... actually, what I meant was...',
    creature: 'fish',
    milestone: '文の構造が見えるようになった',
    feeling: '確かな手応え',
  },
  {
    depth: 3, name: 'Midnight Zone', nameJa: '深夜層', hours: 75, color: '#0a0a2e',
    thought: '会話についていける！',
    innerVoice: '75時間。ほぼ光が届かない深さ。でも不思議と怖くない。会話の流れが分かる。相手が何を言いたいのか、言葉の裏にある意図が感覚で掴める。「What do you mean?」と聞き返せる。対話ができている。',
    discovery: '対話の流れ',
    soundscape: "What do you mean by that? Oh, I see what you're saying! That makes sense.",
    creature: 'octopus',
    milestone: '会話のキャッチボールができる',
    feeling: '自信と喜び',
  },
  {
    depth: 4, name: 'The Abyss', nameJa: '深淵', hours: 100, color: '#000011',
    thought: '英語で考えている自分がいる。',
    innerVoice: '100時間。深淵に到達した。暗闘ではない。ここには静寂がある。気づいたら、英語で考えている自分がいた。日本語に翻訳してから理解するんじゃない。英語のまま、意味が流れ込んでくる。これが「言語に住む」ということか。',
    discovery: '言語に住む',
    soundscape: '...thinking in English... no translation needed...',
    creature: 'whale',
    milestone: '翻訳なしで理解できる',
    feeling: '静かな達成感',
  },
]

// 深度ごとの詳細な解説
const DEPTH_NARRATIVES = {
  0: {
    title: '旅の始まり',
    body: `
      水面に立つ。見下ろすと、深い青が広がっている。

      最初の一歩は、いつも怖い。英語のポッドキャストを再生する。
      ネイティブの会話が、轟音のように耳に押し寄せる。

      何も聞き取れない。単語の切れ目すら分からない。
      ただの音の洪水。意味のない波。

      でも、ここから始めるしかない。
      深呼吸をして、水面を蹴る。

      潜り始めた。
    `,
  },
  1: {
    title: '最初の光',
    body: `
      25時間が経った。太陽光層に入った。

      光はまだ届いている。水は青く澄んでいる。
      そして、何かが変わり始めている。

      音の洪水の中に、浮かぶものがある。
      「actually」「basically」「I mean」
      知っている単語が、ぽつぽつと聞こえる。

      クラゲが漂っている。透明で、ゆらゆらと。
      まるで、浮かんでくる単語のように。

      まだ文は分からない。でも、点が見え始めた。
    `,
  },
  2: {
    title: '構造の発見',
    body: `
      50時間。薄明層。光が届きにくくなってきた。

      でも、目が慣れてきた。暗がりの中で、形が見える。

      文には骨格がある。主語があり、動詞があり、目的語がある。
      「I think that...」で始まったら、次は意見が来る。
      「because」が聞こえたら、理由が続く。

      魚の群れが泳いでいく。群れには秩序がある。
      バラバラに見えて、一つの方向に向かっている。

      英語も同じだ。混沌に見えて、法則がある。
    `,
  },
  3: {
    title: '対話の深み',
    body: `
      75時間。深夜層。ほぼ光が届かない。

      でも、怖くない。むしろ、心地いい。

      会話の流れが分かる。相手が言いたいこと、
      言葉の裏にある意図。感覚で掴める。

      「What do you mean?」と聞き返せる。
      「Oh, I see!」と相槌を打てる。

      タコが優雅に泳いでいる。8本の腕で、
      複数のことを同時にこなしている。

      会話もそうだ。聴きながら、考えながら、返す。
    `,
  },
  4: {
    title: '深淵の静寂',
    body: `
      100時間。深淵に到達した。

      ここには光がない。でも、暗闘ではない。
      静寂がある。透明な静けさ。

      気づいたら、英語で考えている自分がいた。
      日本語に翻訳してから理解するんじゃない。
      英語のまま、意味が流れ込んでくる。

      クジラが悠然と泳いでいく。
      この巨大な存在は、深海を住処にしている。

      俺も今、英語という言語に住んでいる。
      「勉強」じゃない。「生活」になった。
    `,
  },
}

// =============================================================================
// PATTERN 1: DIVER - 「深海への旅」完全版
// =============================================================================

export function DiverVisualization({ hours = 0, maxHours = 100 }: { hours?: number; maxHours?: number }) {
  const [animatedHours, setAnimatedHours] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [showThought, setShowThought] = useState(false)
  const [showNarrative, setShowNarrative] = useState(false)
  const [currentNarrativeIndex, setCurrentNarrativeIndex] = useState(0)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([])
  const [sonarPulse, setSonarPulse] = useState(false)
  const [bioluminescence, setBioluminescence] = useState<Array<{id: number, x: number, y: number, size: number}>>([])

  const depthPercent = Math.min((animatedHours / maxHours) * 100, 100)
  const currentZone = DEPTH_ZONES.reduce((prev, curr) => (animatedHours >= curr.hours ? curr : prev), DEPTH_ZONES[0])
  const nextZone = DEPTH_ZONES.find(z => z.hours > animatedHours)
  const currentNarrative = DEPTH_NARRATIVES[currentZone.depth as keyof typeof DEPTH_NARRATIVES]

  // Pressure increases with depth
  const pressure = (1 + depthPercent / 20).toFixed(1)
  // Oxygen decreases (dramatic effect)
  const oxygen = Math.max(100 - depthPercent * 0.5, 50).toFixed(0)

  useEffect(() => {
    setMounted(true)
    // Generate floating particles (plankton, debris)
    setParticles(Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 4,
      speed: 0.5 + Math.random() * 2,
    })))
    // Generate bioluminescent organisms for deep layers
    setBioluminescence(Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 50 + Math.random() * 50,
      size: 2 + Math.random() * 5,
    })))

    // Sonar pulse every 5 seconds
    const sonarInterval = setInterval(() => {
      setSonarPulse(true)
      setTimeout(() => setSonarPulse(false), 1500)
    }, 5000)

    return () => clearInterval(sonarInterval)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const duration = 12000 // Longer for more dramatic effect
    const startTime = Date.now()
    let lastZone = 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // More dramatic easing
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

      const newHours = eased * hours
      setAnimatedHours(newHours)

      // Show thought and narrative at zone transitions
      const newZoneIndex = DEPTH_ZONES.findIndex(z => z.hours > newHours) - 1
      if (newZoneIndex !== lastZone && newZoneIndex >= 0) {
        lastZone = newZoneIndex
        setCurrentNarrativeIndex(newZoneIndex)
        setShowThought(true)
        setTimeout(() => {
          setShowThought(false)
          setShowNarrative(true)
          setTimeout(() => setShowNarrative(false), 6000)
        }, 4000)
      }

      if (progress < 1) requestAnimationFrame(animate)
    }

    // Show initial narrative
    setTimeout(() => {
      setShowNarrative(true)
      setTimeout(() => setShowNarrative(false), 5000)
    }, 1000)

    const timer = setTimeout(() => requestAnimationFrame(animate), 2500)
    return () => clearTimeout(timer)
  }, [mounted, hours])

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Cinematic intro text */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h3 className="text-2xl font-bold text-stone-700 mb-3">深海への旅</h3>
        <p className="text-stone-600 text-sm leading-relaxed max-w-lg mx-auto mb-3">
          英語という海に飛び込む。最初は何も見えない。音の洪水に押し流されそうになる。<br />
          でも、諦めずに潜り続けると、少しずつ世界が変わり始める。<br />
          暗闘の底には、静寂と理解がある。
        </p>
        <motion.p
          className="text-amber-600 text-xs italic"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          「恐れは畏敬に変わり、畏敬は理解になる」
        </motion.p>
      </motion.div>

      <div className="relative h-[580px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Ocean gradient with more depth */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #87CEEB 0%,
              #4a90d9 15%,
              #2563eb 30%,
              #1e40af 45%,
              #1e3a8a 60%,
              #172554 75%,
              #0f172a 90%,
              #020617 100%)`
          }}
        />

        {/* Floating particles (plankton) */}
        {mounted && particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/20"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
            }}
            animate={{
              y: [0, -500],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 10 / p.speed,
              repeat: Infinity,
              delay: p.id * 0.2,
            }}
          />
        ))}

        {/* Light rays from surface - fade with depth */}
        <div className="absolute inset-0 overflow-hidden" style={{ opacity: Math.max(0, 1 - depthPercent / 60) }}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 bg-gradient-to-b from-white/50 via-cyan-200/30 to-transparent"
              style={{
                left: `${5 + i * 12}%`,
                width: '4px',
                height: '80%',
                transform: `rotate(${-20 + i * 5}deg)`,
                transformOrigin: 'top center',
              }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        {/* Sonar pulse effect */}
        <AnimatePresence>
          {sonarPulse && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-5"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <div className="w-32 h-32 rounded-full border-2 border-cyan-400/50" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bioluminescence in deeper layers */}
        {depthPercent > 40 && mounted && bioluminescence.map((bio) => (
          <motion.div
            key={bio.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${bio.x}%`,
              top: `${bio.y}%`,
              width: bio.size,
              height: bio.size,
              background: 'radial-gradient(circle, rgba(0,255,200,0.8) 0%, rgba(0,200,255,0) 70%)',
              filter: 'blur(1px)',
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: bio.id * 0.2,
            }}
          />
        ))}

        {/* Sound waves / What you hear at this depth */}
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="bg-black/70 backdrop-blur-md rounded-xl px-5 py-3 border border-cyan-500/30">
            <p className="text-cyan-400/60 text-[8px] uppercase tracking-widest mb-1 text-center">聞こえてくる音</p>
            <motion.p
              key={currentZone.soundscape}
              className="text-cyan-300 text-sm font-mono text-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentZone.soundscape}
            </motion.p>
          </div>
        </motion.div>

        {/* Narrative overlay when reaching new zones */}
        <AnimatePresence>
          {showNarrative && currentNarrative && (
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="max-w-md text-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.p
                  className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentZone.nameJa} - {currentZone.hours}時間
                </motion.p>
                <motion.h4
                  className="text-2xl font-bold text-white mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {currentNarrative.title}
                </motion.h4>
                <motion.p
                  className="text-white/80 text-sm leading-relaxed whitespace-pre-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {currentNarrative.body.trim().split('\n').slice(0, 6).join('\n')}
                </motion.p>
                <motion.div
                  className="mt-4 text-amber-400 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 3, duration: 2, repeat: Infinity }}
                >
                  タップで続行
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Depth meter (left side) */}
        <div className="absolute left-3 top-16 bottom-20 w-8 z-20">
          <div className="relative h-full bg-black/40 backdrop-blur-sm rounded-full overflow-hidden">
            {/* Depth scale marks */}
            {DEPTH_ZONES.map((zone, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{ top: `${(zone.hours / maxHours) * 100}%` }}
              >
                <div className={`w-full h-0.5 ${animatedHours >= zone.hours ? 'bg-amber-400' : 'bg-white/30'}`} />
              </div>
            ))}
            {/* Current depth indicator */}
            <motion.div
              className="absolute left-1 right-1 h-2 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"
              style={{ top: `${depthPercent}%` }}
            />
          </div>
          <p className="text-white/60 text-[8px] text-center mt-2 uppercase tracking-wider">Depth</p>
        </div>

        {/* Stats panel (right side) */}
        <div className="absolute right-3 top-16 z-20 space-y-2">
          {/* Pressure */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-white/50 text-[8px] uppercase">Pressure</p>
            <p className="text-cyan-400 font-mono text-sm">{pressure} atm</p>
          </div>
          {/* Oxygen */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-white/50 text-[8px] uppercase">O₂</p>
            <div className="flex items-center gap-1">
              <div className="w-12 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${Number(oxygen) > 70 ? 'bg-green-400' : 'bg-amber-400'}`}
                  style={{ width: `${oxygen}%` }}
                />
              </div>
              <span className="text-white/70 font-mono text-[10px]">{oxygen}%</span>
            </div>
          </div>
        </div>

        {/* Creatures at each depth with better animations */}
        {DEPTH_ZONES.filter(z => z.creature).map((zone) => {
          const isVisible = animatedHours >= zone.hours - 8
          const zoneY = (zone.hours / maxHours) * 85 + 5

          return (
            <motion.div
              key={zone.depth}
              className="absolute"
              style={{ top: `${zoneY}%`, left: '15%' }}
              initial={{ opacity: 0, x: -50, scale: 0.5 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                x: isVisible ? 0 : -50,
                scale: isVisible ? 1 : 0.5,
              }}
              transition={{ duration: 1.5, type: 'spring' }}
            >
              {/* Creature SVGs with animations */}
              {zone.creature === 'jellyfish' && (
                <motion.svg
                  width="50" height="65" viewBox="0 0 50 65"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <defs>
                    <radialGradient id="jellyglow" cx="50%" cy="30%" r="50%">
                      <stop offset="0%" stopColor="rgba(200, 230, 255, 0.9)" />
                      <stop offset="100%" stopColor="rgba(147, 197, 253, 0.4)" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="25" cy="18" rx="18" ry="15" fill="url(#jellyglow)" />
                  {[0, 1, 2, 3, 4].map(i => (
                    <motion.path
                      key={i}
                      d={`M${10 + i * 8} 28 Q${7 + i * 8} 45, ${12 + i * 8} 60`}
                      stroke="rgba(147, 197, 253, 0.5)"
                      strokeWidth="2"
                      fill="none"
                      animate={{
                        d: [
                          `M${10 + i * 8} 28 Q${7 + i * 8} 45, ${12 + i * 8} 60`,
                          `M${10 + i * 8} 28 Q${13 + i * 8} 48, ${8 + i * 8} 60`,
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.svg>
              )}

              {zone.creature === 'fish' && (
                <motion.div
                  className="flex gap-2"
                  animate={{ x: [0, 30, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  {[0, 1, 2].map(i => (
                    <motion.svg
                      key={i}
                      width="35" height="22"
                      viewBox="0 0 35 22"
                      animate={{ y: [0, i % 2 ? -5 : 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      <ellipse cx="15" cy="11" rx="12" ry="8" fill={`rgba(251, 191, 36, ${0.9 - i * 0.2})`} />
                      <polygon points="27,11 35,4 35,18" fill={`rgba(251, 191, 36, ${0.9 - i * 0.2})`} />
                      <circle cx="8" cy="9" r="2.5" fill="white" />
                      <circle cx="8.5" cy="9" r="1.2" fill="#1e3a5f" />
                    </motion.svg>
                  ))}
                </motion.div>
              )}

              {zone.creature === 'octopus' && (
                <motion.svg
                  width="60" height="60" viewBox="0 0 60 60"
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <ellipse cx="30" cy="20" rx="18" ry="15" fill="rgba(167, 139, 250, 0.8)" />
                  <circle cx="23" cy="17" r="4" fill="white" />
                  <circle cx="37" cy="17" r="4" fill="white" />
                  <circle cx="24" cy="18" r="2" fill="#1e1b4b" />
                  <circle cx="38" cy="18" r="2" fill="#1e1b4b" />
                  {[...Array(8)].map((_, i) => (
                    <motion.path
                      key={i}
                      d={`M${18 + i * 3.5} 32 Q${12 + i * 4} 45, ${15 + i * 3.5} 58`}
                      stroke="rgba(167, 139, 250, 0.7)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      animate={{
                        d: [
                          `M${18 + i * 3.5} 32 Q${12 + i * 4} 45, ${15 + i * 3.5} 58`,
                          `M${18 + i * 3.5} 32 Q${20 + i * 4} 48, ${22 + i * 3.5} 58`,
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </motion.svg>
              )}

              {zone.creature === 'whale' && (
                <motion.svg
                  width="120" height="55" viewBox="0 0 120 55"
                  animate={{ x: [-20, 20, -20], y: [0, -8, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <defs>
                    <linearGradient id="whalegradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(96, 165, 250, 0.8)" />
                      <stop offset="100%" stopColor="rgba(37, 99, 235, 0.6)" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="50" cy="28" rx="42" ry="22" fill="url(#whalegradient)" />
                  <ellipse cx="88" cy="28" rx="18" ry="12" fill="url(#whalegradient)" />
                  <polygon points="106,28 120,15 120,41" fill="url(#whalegradient)" />
                  <circle cx="22" cy="22" r="4" fill="rgba(255,255,255,0.9)" />
                  <circle cx="23" cy="22" r="2" fill="#1e3a5f" />
                  <ellipse cx="50" cy="42" rx="22" ry="5" fill="rgba(186, 230, 253, 0.4)" />
                  {/* Whale song visualization */}
                  <motion.ellipse
                    cx="15" cy="28" rx="8" ry="4"
                    fill="none"
                    stroke="rgba(147, 197, 253, 0.5)"
                    strokeWidth="1"
                    animate={{ rx: [8, 20, 8], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.svg>
              )}

              {/* Discovery label */}
              <motion.div
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: animatedHours >= zone.hours ? 1 : 0, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                  <p className="text-amber-300 text-[10px] font-medium">{zone.discovery}</p>
                  <p className="text-white/50 text-[8px]">{zone.hours}h</p>
                </div>
              </motion.div>
            </motion.div>
          )
        })}

        {/* THE DIVER */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ top: `${Math.max(8, depthPercent - 3)}%` }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="55" height="80" viewBox="0 0 55 80" className="drop-shadow-2xl">
              {/* Bubbles from regulator */}
              <motion.circle cx="35" cy="20" r="3" fill="rgba(255,255,255,0.4)"
                animate={{ cy: [20, -20], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle cx="40" cy="25" r="2" fill="rgba(255,255,255,0.3)"
                animate={{ cy: [25, -15], opacity: [0.3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />

              {/* Tank */}
              <rect x="20" y="22" width="15" height="28" rx="4" fill="#4b5563" />
              <rect x="22" y="24" width="3" height="10" rx="1" fill="#6b7280" />

              {/* Body/Wetsuit */}
              <ellipse cx="27" cy="42" rx="14" ry="16" fill="#1e3a5f" />

              {/* Head with mask */}
              <circle cx="27" cy="18" r="13" fill="#fbbf24" />
              <ellipse cx="27" cy="17" rx="10" ry="7" fill="#38bdf8" opacity="0.95" />
              <ellipse cx="23" cy="15" rx="3" ry="1.5" fill="white" opacity="0.5" />

              {/* Regulator */}
              <path d="M37 18 L42 22" stroke="#374151" strokeWidth="2" />
              <circle cx="43" cy="23" r="3" fill="#374151" />

              {/* Arms */}
              <motion.path d="M13 38 Q5 45 8 58" stroke="#1e3a5f" strokeWidth="6" fill="none" strokeLinecap="round"
                animate={{ d: ['M13 38 Q5 45 8 58', 'M13 38 Q3 48 6 62'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.path d="M41 38 Q49 45 46 58" stroke="#1e3a5f" strokeWidth="6" fill="none" strokeLinecap="round"
                animate={{ d: ['M41 38 Q49 45 46 58', 'M41 38 Q51 48 48 62'] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
              />

              {/* Legs */}
              <path d="M20 55 L16 72" stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round" />
              <path d="M34 55 L38 72" stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round" />

              {/* Fins */}
              <ellipse cx="12" cy="74" rx="9" ry="3" fill="#0ea5e9" />
              <ellipse cx="42" cy="74" rx="9" ry="3" fill="#0ea5e9" />

              {/* Flashlight beam (deeper = more important) */}
              {depthPercent > 50 && (
                <motion.polygon
                  points="8,58 -20,90 20,90"
                  fill="url(#flashlight)"
                  opacity={Math.min((depthPercent - 50) / 50, 0.6)}
                />
              )}
              <defs>
                <linearGradient id="flashlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(253, 224, 71, 0.8)" />
                  <stop offset="100%" stopColor="rgba(253, 224, 71, 0)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Thought bubble */}
            <AnimatePresence>
              {showThought && (
                <motion.div
                  className="absolute -right-36 -top-2 w-32"
                  initial={{ opacity: 0, scale: 0, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring' }}
                >
                  <div className="bg-white rounded-xl px-3 py-2 shadow-xl relative">
                    <p className="text-stone-700 text-xs font-medium leading-relaxed">
                      {currentZone.thought}
                    </p>
                    <div className="absolute -left-2 top-3 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[10px] border-transparent border-r-white" />
                  </div>
                  {/* Thought bubble dots */}
                  <div className="absolute -left-4 top-6 w-2 h-2 bg-white rounded-full" />
                  <div className="absolute -left-6 top-8 w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Bottom panel with current zone */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-5 z-20">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-cyan-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <p className="text-white/50 text-[10px] uppercase tracking-wider">Current Depth</p>
              </div>
              <p className="text-2xl font-bold text-white">{currentZone.nameJa}</p>
              <p className="text-cyan-400 text-sm">{currentZone.name}</p>
              <p className="text-amber-400/80 text-xs mt-1">{currentZone.milestone}</p>
            </div>
            <div className="text-right">
              <p className="text-amber-400 font-mono text-4xl font-bold">{animatedHours.toFixed(1)}<span className="text-xl">h</span></p>
              {nextZone && (
                <p className="text-white/50 text-xs mt-1">次の層「{nextZone.nameJa}」まで {(nextZone.hours - animatedHours).toFixed(1)}h</p>
              )}
              <p className="text-cyan-400/60 text-[10px] mt-1">{currentZone.feeling}</p>
            </div>
          </div>

          {/* Inner voice - scrolling text effect */}
          <motion.div
            key={currentZone.innerVoice}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-white/20 pt-3"
          >
            <p className="text-cyan-400/60 text-[9px] uppercase tracking-wider mb-1">内なる声</p>
            <p className="text-white/90 text-xs leading-relaxed italic">
              「{currentZone.innerVoice}」
            </p>
          </motion.div>

          {/* Progress through current zone */}
          <div className="mt-3">
            <div className="flex justify-between text-[9px] text-white/40 mb-1">
              <span>{currentZone.hours}h</span>
              <span>{nextZone?.hours || maxHours}h</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full"
                style={{
                  width: nextZone
                    ? `${((animatedHours - currentZone.hours) / (nextZone.hours - currentZone.hours)) * 100}%`
                    : '100%'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed explanation below */}
      <motion.div
        className="mt-6 bg-stone-100 rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h4 className="text-stone-700 font-bold text-sm mb-2">深海のメタファー</h4>
        <p className="text-stone-600 text-xs leading-relaxed mb-3">
          海には5つの層がある。水面から深淵まで。英語学習も同じだ。
          最初は光があふれる水面。何も分からないけど、見通しは明るい。
          潜るほど暗くなる。でも、目が慣れてくる。暗がりの中で、形が見えてくる。
        </p>
        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div className="bg-white rounded-lg p-2">
            <p className="text-cyan-600 font-bold">クラゲ（25h）</p>
            <p className="text-stone-500">浮かぶ単語の象徴。透明で、つかみどころがない。</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-amber-600 font-bold">魚の群れ（50h）</p>
            <p className="text-stone-500">文法の秩序。バラバラに見えて、一つの方向。</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-purple-600 font-bold">タコ（75h）</p>
            <p className="text-stone-500">複数の処理。聴く、考える、返す。同時にできる。</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-blue-600 font-bold">クジラ（100h）</p>
            <p className="text-stone-500">深海の住人。言語の中に住むということ。</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// =============================================================================
// PATTERN 2: AQUARIUM - 「生態系を育てる」完全版
// =============================================================================

// 水槽の物語データ
const AQUARIUM_STORIES = [
  { hours: 0, title: '空っぽの水槽', story: '目の前に空っぽの水槽がある。ガラスは透明で、何も入っていない。これから、ここに一つの世界を作る。' },
  { hours: 10, title: '最初の一滴', story: '水を注ぎ始めた。一滴、また一滴。まだ底が見える。でも、始まった。' },
  { hours: 25, title: '最初の住人', story: '小さな魚が泳ぎ始めた。「hello」という名の金魚。挨拶ができるようになった。' },
  { hours: 50, title: '生態系の芽生え', story: 'サンゴが育ち始めた。魚が増えた。それぞれが役割を持ち、関係し合っている。' },
  { hours: 75, title: '豊かな海', story: '水槽の中に、小さな海ができた。複雑で、美しく、生き生きとしている。' },
  { hours: 95, title: '宝箱が開く', story: '海底の宝箱が開いた。中には、言葉という宝物がたくさん詰まっていた。' },
]

export function AquariumVisualization({ hours = 0, maxHours = 100 }: { hours?: number; maxHours?: number }) {
  const [animatedHours, setAnimatedHours] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [feedingAnimation, setFeedingAnimation] = useState(false)
  const [currentStory, setCurrentStory] = useState(AQUARIUM_STORIES[0])
  const [showStory, setShowStory] = useState(true)
  const [hoveredFish, setHoveredFish] = useState<number | null>(null)
  const [lightBeams, setLightBeams] = useState<Array<{id: number, x: number, delay: number}>>([])

  const fillPercent = Math.min((animatedHours / maxHours) * 100, 100)
  const currentZone = DEPTH_ZONES.reduce((prev, curr) => (animatedHours >= curr.hours ? curr : prev), DEPTH_ZONES[0])

  useEffect(() => {
    setMounted(true)
    // Generate light beams
    setLightBeams(Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: 10 + i * 12,
      delay: i * 0.3,
    })))
  }, [])

  useEffect(() => {
    if (!mounted) return
    const duration = 12000
    const startTime = Date.now()
    let lastStoryIndex = 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2
      const newHours = eased * hours
      setAnimatedHours(newHours)

      // Update story based on hours
      const storyIndex = AQUARIUM_STORIES.reduce((idx, story, i) =>
        newHours >= story.hours ? i : idx, 0)
      if (storyIndex !== lastStoryIndex) {
        lastStoryIndex = storyIndex
        setCurrentStory(AQUARIUM_STORIES[storyIndex])
        setShowStory(true)
        setTimeout(() => setShowStory(false), 4000)
      }

      // Trigger feeding animation at milestones
      if ([25, 50, 75].some(m => Math.abs(newHours - m) < 0.5)) {
        setFeedingAnimation(true)
        setTimeout(() => setFeedingAnimation(false), 2500)
      }

      if (progress < 1) requestAnimationFrame(animate)
    }

    // Show initial story
    setTimeout(() => setShowStory(false), 4000)

    const timer = setTimeout(() => requestAnimationFrame(animate), 2000)
    return () => clearTimeout(timer)
  }, [mounted, hours])

  // 語彙 = 魚（それぞれに物語がある）
  const vocabulary = [
    { hours: 5, word: 'hello', ja: '最初の一声。ここから全てが始まる。', x: 20, color: '#fbbf24', size: 24 },
    { hours: 12, word: 'thank you', ja: '感謝を伝える言葉。心が通じる瞬間。', x: 70, color: '#fb923c', size: 26 },
    { hours: 18, word: 'sorry', ja: '謝罪ができると、関係が深まる。', x: 45, color: '#f472b6', size: 22 },
    { hours: 28, word: 'actually', ja: '「実はね」と切り出せる余裕。', x: 30, color: '#a78bfa', size: 28 },
    { hours: 38, word: 'I mean', ja: '言い直しができる。会話に粘りが出る。', x: 65, color: '#60a5fa', size: 26 },
    { hours: 48, word: 'basically', ja: '要約できる力。複雑を簡潔に。', x: 25, color: '#34d399', size: 30 },
    { hours: 60, word: 'perspective', ja: '視点を語れる。議論に参加できる。', x: 55, color: '#f43f5e', size: 32 },
    { hours: 72, word: 'nuance', ja: '微妙な違いが分かる。大人の会話。', x: 40, color: '#8b5cf6', size: 34 },
    { hours: 85, word: 'elaborate', ja: '詳しく説明してと言われても怖くない。', x: 75, color: '#14b8a6', size: 36 },
    { hours: 95, word: 'articulate', ja: '自分の考えを明確に表現できる。完成形。', x: 35, color: '#eab308', size: 40 },
  ]

  // Coral grows over time
  const coralGrowth = Math.min(animatedHours / 50, 1)

  // Treasure chest opens at 100h
  const treasureOpen = animatedHours >= 95

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-stone-700 mb-3">言葉の生態系</h3>
        <p className="text-stone-600 text-sm leading-relaxed max-w-lg mx-auto mb-3">
          空っぽの水槽から始める。毎日少しずつ水を注ぎ、魚を放ち、サンゴを植える。<br />
          最初は寂しい水槽。でも、時間をかければ、そこに一つの世界が生まれる。<br />
          語彙は魚。文法はサンゴ。そして全体が、生きた生態系になる。
        </p>
        <motion.p
          className="text-emerald-600 text-xs italic"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          「一匹ずつ、語彙が泳ぎ始める」
        </motion.p>
      </motion.div>

      {/* Story overlay */}
      <AnimatePresence>
        {showStory && (
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center p-6 max-w-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-emerald-400 text-xs uppercase tracking-widest mb-2">{currentStory.hours}時間</p>
              <h4 className="text-xl font-bold text-white mb-3">{currentStory.title}</h4>
              <p className="text-white/80 text-sm leading-relaxed">{currentStory.story}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aquarium frame - premium wood finish */}
      <div className="relative p-5 rounded-2xl shadow-2xl" style={{
        background: 'linear-gradient(135deg, #44403c 0%, #292524 50%, #1c1917 100%)'
      }}>
        {/* Wood grain texture overlay */}
        <div className="absolute inset-0 opacity-20 rounded-2xl" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.03) 2px,
            rgba(255,255,255,0.03) 4px
          )`
        }} />

        {/* Glass tank */}
        <div className="relative h-[480px] rounded-xl overflow-hidden" style={{
          background: 'linear-gradient(to bottom, #e0f2fe 0%, #bae6fd 30%, #7dd3fc 100%)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.1)'
        }}>

          {/* Water with dynamic color */}
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${Math.max(fillPercent, 10)}%`,
              background: `linear-gradient(to top,
                ${currentZone.color}ee 0%,
                ${currentZone.color}aa 50%,
                ${currentZone.color}66 100%)`
            }}
          >
            {/* Animated wave surface */}
            <svg className="absolute -top-4 left-0 w-full h-6" viewBox="0 0 400 24" preserveAspectRatio="none">
              <motion.path
                fill={`${currentZone.color}cc`}
                animate={{
                  d: [
                    "M0,12 Q25,6 50,12 T100,12 T150,12 T200,12 T250,12 T300,12 T350,12 T400,12 L400,24 L0,24 Z",
                    "M0,12 Q25,18 50,12 T100,12 T150,12 T200,12 T250,12 T300,12 T350,12 T400,12 L400,24 L0,24 Z",
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>

            {/* Bubbles from air stone */}
            {mounted && [...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 3 + Math.random() * 6,
                  height: 3 + Math.random() * 6,
                  left: `${45 + (Math.random() - 0.5) * 15}%`,
                  background: 'radial-gradient(circle at 30% 30%, white, rgba(255,255,255,0.3))',
                }}
                animate={{
                  bottom: ['5%', '100%'],
                  opacity: [0, 0.7, 0],
                  x: [0, (Math.random() - 0.5) * 30],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}

            {/* Fish = Vocabulary */}
            {vocabulary.map((fish, i) => {
              const isLearned = animatedHours >= fish.hours
              const fishY = 15 + (fish.hours / maxHours) * 70

              return (
                <motion.div
                  key={i}
                  className="absolute group cursor-pointer"
                  style={{
                    bottom: `${100 - fishY}%`,
                    left: `${fish.x}%`,
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{
                    opacity: isLearned ? 1 : 0,
                    scale: isLearned ? 1 : 0,
                    rotate: 0,
                    x: isLearned ? [0, 25, 0, -25, 0] : 0,
                    y: isLearned ? [0, -8, 0, 8, 0] : 0,
                  }}
                  transition={{
                    duration: 0.8,
                    x: { duration: 6 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
                  }}
                  whileHover={{ scale: 1.3 }}
                >
                  <svg width={fish.size} height={fish.size * 0.65} viewBox="0 0 48 31">
                    <defs>
                      <linearGradient id={`fish${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={fish.color} />
                        <stop offset="100%" stopColor={`${fish.color}aa`} />
                      </linearGradient>
                    </defs>
                    <ellipse cx="20" cy="15" rx="17" ry="12" fill={`url(#fish${i})`} />
                    <polygon points="37,15 48,5 48,25" fill={`url(#fish${i})`} />
                    <circle cx="10" cy="12" r="4" fill="white" />
                    <circle cx="11" cy="12" r="2" fill="#1e293b" />
                    <path d="M7 18 Q12 22 17 18" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                    {/* Fin animation */}
                    <motion.path
                      d="M20 3 Q25 -2 30 5"
                      stroke={fish.color}
                      strokeWidth="3"
                      fill="none"
                      animate={{ d: ["M20 3 Q25 -2 30 5", "M20 3 Q25 0 28 3"] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  </svg>

                  {/* Word tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
                    <div className="bg-white rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                      <p className="text-sm font-bold text-stone-800">{fish.word}</p>
                      <p className="text-[10px] text-stone-500">{fish.ja}</p>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                  </div>
                </motion.div>
              )
            })}

            {/* Coral reef - grows over time */}
            <div className="absolute bottom-0 left-0 right-0">
              {[10, 25, 40, 60, 80].map((x, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0"
                  style={{ left: `${x}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: coralGrowth }}
                  transition={{ duration: 2, delay: i * 0.3 }}
                >
                  <svg width="40" height={50 + i * 10} viewBox="0 0 40 60" style={{ transformOrigin: 'bottom' }}>
                    <path
                      d={`M20 60 Q${10 + i * 2} ${40 - i * 3} ${15 - i} ${20 + i * 2} Q${20} ${10} ${25 + i} ${20 + i * 2} Q${30 - i * 2} ${40 - i * 3} 20 60`}
                      fill={['#f472b6', '#fb923c', '#a78bfa', '#34d399', '#f43f5e'][i]}
                      opacity={0.8}
                    />
                  </svg>
                </motion.div>
              ))}
            </div>

            {/* Seaweed */}
            {[8, 22, 52, 72, 92].map((x, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0"
                style={{ left: `${x}%` }}
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
              >
                <div
                  className="w-4 rounded-t-full origin-bottom"
                  style={{
                    height: 60 + i * 15,
                    background: `linear-gradient(to top, #15803d, #22c55e, #4ade80)`,
                  }}
                />
              </motion.div>
            ))}

            {/* Treasure chest (opens at 95h+) */}
            <motion.div
              className="absolute bottom-2 right-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <svg width="50" height="40" viewBox="0 0 50 40">
                <rect x="5" y="18" width="40" height="22" rx="3" fill="#92400e" />
                <rect x="7" y="20" width="36" height="18" rx="2" fill="#b45309" />
                <motion.path
                  d={treasureOpen ? "M5 18 Q25 -5 45 18" : "M5 18 Q25 15 45 18"}
                  fill="#92400e"
                  animate={{ d: treasureOpen ? "M5 18 Q25 -10 45 18" : "M5 18 Q25 15 45 18" }}
                  transition={{ duration: 0.5 }}
                />
                {treasureOpen && (
                  <>
                    <motion.circle cx="25" cy="8" r="4" fill="#fcd34d"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    />
                    <motion.circle cx="18" cy="12" r="3" fill="#fcd34d"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    />
                    <motion.circle cx="32" cy="12" r="3" fill="#fcd34d"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    />
                  </>
                )}
                <rect x="20" y="25" width="10" height="8" rx="1" fill="#78350f" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Sand */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-300 via-amber-200 to-amber-100" />

          {/* Feeding animation */}
          <AnimatePresence>
            {feedingAnimation && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-amber-600"
                    style={{ left: `${40 + (Math.random() - 0.5) * 30}%`, top: '5%' }}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: 300, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, delay: i * 0.1 }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Glass reflections */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/20 to-transparent" />
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white/10 to-transparent" />
          </div>
        </div>

        {/* Control panel */}
        <div className="mt-4 bg-gradient-to-r from-stone-900 to-stone-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-emerald-400/70 text-[10px] uppercase tracking-wider mb-1">収集した語彙</p>
              <div className="flex items-baseline gap-2">
                <motion.span
                  key={vocabulary.filter(v => animatedHours >= v.hours).length}
                  className="text-emerald-400 font-mono text-4xl font-bold"
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                >
                  {vocabulary.filter(v => animatedHours >= v.hours).length}
                </motion.span>
                <span className="text-stone-500">/ {vocabulary.length} 種</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-stone-500 text-[10px] uppercase mb-1">生態系フェーズ</p>
              <p className="text-white text-xl font-bold">{currentStory.title}</p>
              <p className="text-emerald-400/60 text-xs">{currentZone.nameJa}</p>
            </div>
          </div>

          {/* Current story snippet */}
          <motion.div
            key={currentStory.story}
            className="bg-stone-800/50 rounded-lg p-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-white/70 text-xs leading-relaxed italic">
              「{currentStory.story}」
            </p>
          </motion.div>

          {/* Time bar */}
          <div className="h-2.5 bg-stone-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${fillPercent}%`,
                background: `linear-gradient(90deg, #06b6d4, #10b981, #22c55e, #84cc16)`
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-stone-500">
            <span className="text-emerald-400">{animatedHours.toFixed(1)} hours</span>
            <span>魚にホバーで詳細を確認</span>
          </div>
        </div>
      </div>

      {/* Detailed explanation below */}
      <motion.div
        className="mt-6 bg-stone-100 rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h4 className="text-stone-700 font-bold text-sm mb-3">水槽のメタファー</h4>
        <p className="text-stone-600 text-xs leading-relaxed mb-4">
          水槽は、あなたの英語力そのもの。最初は空っぽで、何もいない。
          でも、毎日少しずつ水を注ぎ（=英語に触れ）、魚を放ち（=単語を覚え）、
          サンゴを植える（=文法を身につける）。時間をかければ、豊かな生態系が育つ。
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 text-sm">🐠</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">魚 = 語彙</p>
              <p className="text-stone-500 text-[10px]">それぞれの魚は一つの単語。泳ぎ回り、生きている。使うほど元気になる。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
              <span className="text-pink-600 text-sm">🪸</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">サンゴ = 文法構造</p>
              <p className="text-stone-500 text-[10px]">ゆっくり育つ。でも一度育てば、魚たちの住処になる。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-700 text-sm">📦</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">宝箱 = 流暢さ</p>
              <p className="text-stone-500 text-[10px]">95時間を超えると開く。中には「自由に話せる」という宝物が入っている。</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// =============================================================================
// PATTERN 3: TIME-LAPSE - 「日常の変容」完全版
// =============================================================================

// タイムラプスの週ごとの変化（詳細な物語付き）
const WEEKLY_CHANGES = [
  {
    week: 1,
    change: '英語が「音」にしか聞こえない',
    mood: '不安',
    insight: 'でも、毎日聴くことが大事だと信じている',
    narrative: `
      初日。ヘッドホンをつけて、英語のポッドキャストを再生する。
      何が聞こえるか。答えは「何も」だ。
      ネイティブの会話は、ただの音の洪水。意味のある言葉じゃない。
      ノイズ。雑音。暗号。
      「これを本当に理解できる日が来るのか？」
      不安が胸を締め付ける。でも、再生ボタンを押し続ける。
    `
  },
  {
    week: 2,
    change: '知っている単語が浮かび始める',
    mood: '小さな希望',
    insight: '点が見え始めた。これを繋げていけばいい',
    narrative: `
      14日目。何かが変わった。
      音の洪水の中に、ぽつぽつと「浮かぶもの」がある。
      「actually」「basically」「you know」
      知ってる単語だ。意味が分かる単語だ。
      まだ文は分からない。でも、点が見え始めた。
      この点と点を繋げていけば、いつか線になる。
    `
  },
  {
    week: 3,
    change: '簡単なフレーズが聞き取れる',
    mood: '確信',
    insight: '「Thank you」「I see」がクリアに聞こえる',
    narrative: `
      21日目。フレーズが聞こえる。
      「Thank you so much」「I see what you mean」「That makes sense」
      単語じゃない。フレーズだ。意味のある塊だ。
      ネイティブの会話は、フレーズの組み合わせでできている。
      一つ一つのフレーズを覚えていけば、会話が組み立てられる。
      確信が生まれた。このまま続ければ、いける。
    `
  },
  {
    week: 4,
    change: '文の構造が見えてくる',
    mood: '理解',
    insight: '主語、動詞、目的語。英語にも骨がある',
    narrative: `
      28日目。文法が「見える」ようになった。
      「I think that...」で始まったら、次は意見が来る。
      「because」が聞こえたら、理由が続く。
      「but」が来たら、反論。「so」が来たら、結論。
      英語にも骨格がある。日本語と違う骨格だけど、確かにある。
      その骨格が見えてきた。
    `
  },
  {
    week: 5,
    change: '会話の流れについていける',
    mood: '自信',
    insight: '完璧じゃなくても、意味は分かる',
    narrative: `
      35日目。会話についていける。
      完璧じゃない。全部の単語は聞き取れない。
      でも、何を話しているかは分かる。
      相手が怒っているのか、喜んでいるのか、困っているのか。
      言葉の裏にある感情が、伝わってくる。
      これが「リスニング力」なのかもしれない。
    `
  },
  {
    week: 6,
    change: '字幕なしで映画が見られる',
    mood: '達成感',
    insight: '全部は分からなくても、楽しめる',
    narrative: `
      42日目。字幕をオフにした。
      最初は不安だった。でも、映画を見終わった後、気づいた。
      楽しかった。話の筋を追えた。笑うべきところで笑えた。
      100%理解したわけじゃない。70%くらいかもしれない。
      でも、70%で映画は楽しめる。
      「全部分からないと」という呪縛が解けた瞬間だった。
    `
  },
  {
    week: 7,
    change: '英語のジョークで笑える',
    mood: '喜び',
    insight: '翻訳せずに、直接笑えた',
    narrative: `
      49日目。Stand-upコメディを見ていた。
      コメディアンがジョークを言った。観客が笑った。
      そして、俺も笑った。
      日本語に翻訳してから笑ったんじゃない。
      英語のまま、直接、笑えた。
      これは小さな奇跡だ。言語の壁を、一瞬だけ超えた。
    `
  },
  {
    week: 8,
    change: '英語で夢を見た',
    mood: '驚き',
    insight: '無意識が英語を受け入れ始めている',
    narrative: `
      56日目。朝起きて、衝撃を受けた。
      夢の中で、英語を話していた。
      夢の中の自分は、流暢に英語を話していた。
      意識の力じゃない。無意識が、英語を受け入れ始めている。
      脳が、英語を「外国語」じゃなく「言語」として認識し始めた。
      これが、本当の意味での習得の始まりかもしれない。
    `
  },
]

// タイムラプスの詳細なナラティブ
const TIMELAPSE_NARRATIVES = {
  morning: {
    title: '朝の静寂',
    body: `
      朝6時。まだ誰も起きていない。
      コーヒーを淹れ、ヘッドホンをつける。
      英語のポッドキャストを再生する。
      これが、毎日のルーティン。
      静かな朝の30分。英語と向き合う時間。
    `
  },
  evening: {
    title: '夜の没入',
    body: `
      夜11時。一日の終わり。
      ベッドに入り、イヤホンをつける。
      英語のオーディオブックを再生する。
      言葉が、ゆっくりと染み込んでいく。
      眠りに落ちる直前まで、英語の世界にいる。
    `
  },
  weekend: {
    title: '週末の集中',
    body: `
      土曜日の午後。まとまった時間がある。
      映画を一本、字幕なしで見る。
      分からない部分は、気にしない。
      全体の流れを追う。感情を追う。
      3時間後、達成感と共に画面を閉じる。
    `
  }
}

export function TimeLapseVisualization({ hours = 0, maxHours = 100 }: { hours?: number; maxHours?: number }) {
  const [animatedHours, setAnimatedHours] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [showWeeklyInsight, setShowWeeklyInsight] = useState(false)
  const [currentWeekData, setCurrentWeekData] = useState(WEEKLY_CHANGES[0])
  const [showNarrative, setShowNarrative] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([])
  const [fireflies, setFireflies] = useState<Array<{id: number, x: number, y: number}>>([])
  const [windStrength, setWindStrength] = useState(0)

  const progress = Math.min(animatedHours / maxHours, 1)
  const dayCount = Math.floor(animatedHours / 1.5)
  const weekCount = Math.min(Math.floor(dayCount / 7), 7)
  const currentZone = DEPTH_ZONES.reduce((prev, curr) => (animatedHours >= curr.hours ? curr : prev), DEPTH_ZONES[0])

  // Time of day cycles
  const timeOfDay = (animatedHours % 4) / 4
  const isDaytime = timeOfDay > 0.2 && timeOfDay < 0.7
  const isSunset = timeOfDay >= 0.7 && timeOfDay < 0.85

  // Books on shelf (knowledge accumulation)
  const bookCount = Math.floor(animatedHours / 8)

  useEffect(() => {
    setMounted(true)
    // Generate floating particles (dust motes, inspiration)
    setParticles(Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: 1 + Math.random() * 3,
    })))
    // Generate fireflies for night scenes
    setFireflies(Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 20 + Math.random() * 40,
    })))
  }, [])

  useEffect(() => {
    if (!mounted) return
    const duration = 12000
    const startTime = Date.now()
    let lastWeek = 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progressTime = Math.min(elapsed / duration, 1)
      const eased = progressTime < 0.5 ? 4 * progressTime ** 3 : 1 - Math.pow(-2 * progressTime + 2, 3) / 2
      const newHours = eased * hours
      setAnimatedHours(newHours)

      // Wind varies with time of day
      setWindStrength(Math.sin(newHours * 0.1) * 2 + 2)

      // Show weekly insight at week transitions
      const newWeek = Math.min(Math.floor(newHours / 12.5), 7)
      if (newWeek !== lastWeek && newWeek < WEEKLY_CHANGES.length) {
        lastWeek = newWeek
        setCurrentWeekData(WEEKLY_CHANGES[newWeek])
        setShowWeeklyInsight(true)
        setTimeout(() => setShowWeeklyInsight(false), 5000)
      }

      if (progressTime < 1) requestAnimationFrame(animate)
    }

    // Show initial narrative
    setTimeout(() => {
      setShowNarrative(true)
      setTimeout(() => setShowNarrative(false), 4000)
    }, 800)

    const timer = setTimeout(() => requestAnimationFrame(animate), 2500)
    return () => clearTimeout(timer)
  }, [mounted, hours])

  // Journal entries with emotional progression（感情の変化を追う日記）
  const journalEntries = [
    { hours: 0, text: "Day 1. This is terrifying.", ja: '初日。何も聞き取れない。耳が拒否してる感じ。本当にできるのか不安だ。', mood: 'anxious' },
    { hours: 15, text: "Wait... I understood that word!", ja: '待って...今「actually」って言った！知ってる単語だ。小さいけど、確かな手応え。', mood: 'surprised' },
    { hours: 30, text: "The sounds are becoming words.", ja: '音の塊が、少しずつ単語として聞こえてきた。脳が慣れてきてる。不思議な感覚。', mood: 'curious' },
    { hours: 45, text: "I can follow the conversation now.", ja: '会話の流れについていける。完璧じゃないけど、何を話してるか分かる。これが成長か。', mood: 'confident' },
    { hours: 60, text: "Watched a movie without subtitles.", ja: '初めて字幕なしで映画を見た。全部は分からないけど、楽しめた。泣きそうになった。', mood: 'proud' },
    { hours: 75, text: "I laughed at a joke in English.", ja: '英語のジョークで笑えた。翻訳してから笑ったんじゃない。直接、笑えた。', mood: 'joyful' },
    { hours: 90, text: "Dreamed in English last night.", ja: '昨夜、英語で夢を見た。夢の中の自分は、普通に英語を話してた。', mood: 'amazed' },
    { hours: 100, text: "I don't translate anymore. I just... know.", ja: 'もう頭の中で翻訳してない。英語を聞いて、そのまま意味が分かる。言語に住むってこういうことか。', mood: 'peaceful' },
  ]

  const currentEntry = journalEntries.reduce((prev, curr) =>
    (animatedHours >= curr.hours ? curr : prev), journalEntries[0])

  // Sky colors
  const getSkyGradient = () => {
    if (isDaytime) {
      return `linear-gradient(to bottom, #7dd3fc 0%, #bae6fd 40%, #fef3c7 100%)`
    } else if (isSunset) {
      return `linear-gradient(to bottom, #f97316 0%, #fb923c 30%, #fcd34d 60%, #fef3c7 100%)`
    } else {
      return `linear-gradient(to bottom, #0f172a 0%, #1e293b 40%, #334155 100%)`
    }
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Cinematic intro text */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h3 className="text-2xl font-bold text-stone-700 mb-3">日常の変容</h3>
        <p className="text-stone-600 text-sm leading-relaxed max-w-lg mx-auto mb-3">
          毎朝6時、同じ椅子に座り、同じヘッドホンをつける。<br />
          英語のポッドキャストを再生する。最初は何も聞き取れない。<br />
          でも、7日後、14日後、21日後...少しずつ、世界が変わり始める。<br />
          見た目は何も変わらない日常。でも、耳の中で革命が起きている。
        </p>
        <motion.p
          className="text-amber-600 text-xs italic"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          「変化は、静かに、確実に、積み重なる」
        </motion.p>
      </motion.div>

      <div className="relative h-[580px] rounded-2xl overflow-hidden shadow-2xl">
        {/* Sky */}
        <motion.div
          className="absolute inset-0 transition-all duration-1000"
          style={{ background: getSkyGradient() }}
        />

        {/* Sun/Moon */}
        <motion.div
          className="absolute w-20 h-20 rounded-full"
          style={{
            background: isDaytime || isSunset
              ? 'radial-gradient(circle, #fcd34d 0%, #f59e0b 100%)'
              : 'radial-gradient(circle, #f1f5f9 0%, #cbd5e1 100%)',
            boxShadow: isDaytime || isSunset
              ? '0 0 80px rgba(251, 191, 36, 0.8)'
              : '0 0 40px rgba(226, 232, 240, 0.4)',
            top: `${10 + Math.sin(timeOfDay * Math.PI) * 25}%`,
            left: `${10 + timeOfDay * 70}%`,
          }}
        />

        {/* Stars */}
        {!isDaytime && !isSunset && mounted && [...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}

        {/* Clouds */}
        {(isDaytime || isSunset) && [...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 100 + i * 30,
              height: 40 + i * 10,
              top: `${8 + i * 8}%`,
              background: isSunset
                ? 'linear-gradient(to bottom, rgba(251,146,60,0.9), rgba(253,186,116,0.6))'
                : 'rgba(255,255,255,0.9)',
            }}
            animate={{ x: [-150, 600] }}
            transition={{ duration: 25 + i * 8, repeat: Infinity, delay: i * 5 }}
          />
        ))}

        {/* Floating dust particles in daylight */}
        {isDaytime && mounted && particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-amber-200/60"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, windStrength * 5, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + p.id * 0.3,
              repeat: Infinity,
              delay: p.id * 0.2,
            }}
          />
        ))}

        {/* Fireflies at night */}
        {!isDaytime && !isSunset && mounted && fireflies.map((f) => (
          <motion.div
            key={f.id}
            className="absolute pointer-events-none"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
            }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(250,240,137,1) 0%, rgba(250,240,137,0) 70%)',
                boxShadow: '0 0 8px rgba(250,240,137,0.8)',
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                x: [0, 20, -10, 0],
                y: [0, -10, 5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: f.id * 0.3,
              }}
            />
          </motion.div>
        ))}

        {/* Weekly insight narrative overlay */}
        <AnimatePresence>
          {showWeeklyInsight && currentWeekData && (
            <motion.div
              className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="max-w-md text-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.p
                  className="text-amber-400 text-xs uppercase tracking-[0.3em] mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Week {currentWeekData.week}
                </motion.p>
                <motion.h4
                  className="text-xl font-bold text-white mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentWeekData.change}
                </motion.h4>
                <motion.p
                  className="text-white/80 text-sm leading-relaxed whitespace-pre-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {currentWeekData.narrative?.trim().split('\n').slice(0, 5).join('\n')}
                </motion.p>
                <motion.div
                  className="mt-4 inline-block px-4 py-2 bg-amber-500/20 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-amber-400 text-xs">{currentWeekData.mood}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Room interior - window frame */}
        <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-b from-stone-100 to-stone-200">
          {/* Window frame */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-[70%] h-4 bg-stone-400 rounded-t" />
          <div className="absolute top-0 left-[15%] w-1 h-[45%] bg-stone-400" />
          <div className="absolute top-0 right-[15%] w-1 h-[45%] bg-stone-400" />

          {/* Desk */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-amber-800 rounded-t-lg shadow-lg">
            {/* Desk surface */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-amber-700 rounded-t-lg" />

            {/* Laptop */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Screen */}
                <div className="w-28 h-20 bg-stone-800 rounded-t-lg p-1">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center">
                    <motion.div
                      className="text-white text-[8px] font-mono"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Listening...
                    </motion.div>
                  </div>
                </div>
                {/* Keyboard */}
                <div className="w-32 h-2 bg-stone-700 rounded-b -mt-0.5 mx-auto" />
              </motion.div>
            </div>

            {/* Coffee cup */}
            <div className="absolute -top-6 right-8">
              <div className="w-5 h-6 bg-white rounded-b-lg border-2 border-stone-300" />
              <motion.div
                className="absolute -top-2 left-1 w-3 h-3 text-stone-300"
                animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ~
              </motion.div>
            </div>
          </div>

          {/* Bookshelf on the wall */}
          <div className="absolute top-8 right-6 w-20 h-32 bg-amber-900 rounded">
            <div className="absolute top-2 left-2 right-2 h-8 bg-amber-800">
              {[...Array(Math.min(bookCount, 5))].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0"
                  style={{
                    left: `${i * 18}%`,
                    width: '16%',
                    height: `${60 + (i % 3) * 15}%`,
                    background: ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'][i],
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.2 }}
                />
              ))}
            </div>
            <div className="absolute top-14 left-2 right-2 h-8 bg-amber-800">
              {[...Array(Math.min(Math.max(bookCount - 5, 0), 5))].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0"
                  style={{
                    left: `${i * 18}%`,
                    width: '16%',
                    height: `${50 + (i % 3) * 20}%`,
                    background: ['#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'][i],
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>

          {/* Person with headphones */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
            <motion.svg
              width="60" height="90" viewBox="0 0 60 90"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Chair */}
              <rect x="10" y="60" width="40" height="25" rx="3" fill="#78716c" />
              <rect x="5" y="82" width="50" height="8" rx="2" fill="#57534e" />

              {/* Body */}
              <ellipse cx="30" cy="55" rx="18" ry="20" fill="#374151" />

              {/* Head */}
              <circle cx="30" cy="25" r="15" fill="#fcd34d" />

              {/* Face expression based on mood */}
              {currentEntry.mood === 'anxious' && (
                <>
                  <circle cx="24" cy="23" r="2" fill="#1e293b" />
                  <circle cx="36" cy="23" r="2" fill="#1e293b" />
                  <path d="M24 30 Q30 28 36 30" stroke="#1e293b" strokeWidth="2" fill="none" />
                </>
              )}
              {(currentEntry.mood === 'surprised' || currentEntry.mood === 'amazed') && (
                <>
                  <circle cx="24" cy="22" r="3" fill="white" />
                  <circle cx="36" cy="22" r="3" fill="white" />
                  <circle cx="24" cy="22" r="1.5" fill="#1e293b" />
                  <circle cx="36" cy="22" r="1.5" fill="#1e293b" />
                  <ellipse cx="30" cy="32" rx="4" ry="3" fill="#1e293b" />
                </>
              )}
              {(currentEntry.mood === 'joyful' || currentEntry.mood === 'proud') && (
                <>
                  <path d="M22 21 Q24 19 26 21" stroke="#1e293b" strokeWidth="2" fill="none" />
                  <path d="M34 21 Q36 19 38 21" stroke="#1e293b" strokeWidth="2" fill="none" />
                  <path d="M22 30 Q30 36 38 30" stroke="#1e293b" strokeWidth="2" fill="none" />
                </>
              )}
              {(currentEntry.mood === 'confident' || currentEntry.mood === 'curious' || currentEntry.mood === 'peaceful') && (
                <>
                  <circle cx="24" cy="22" r="2" fill="#1e293b" />
                  <circle cx="36" cy="22" r="2" fill="#1e293b" />
                  <path d="M24 30 Q30 34 36 30" stroke="#1e293b" strokeWidth="2" fill="none" />
                </>
              )}

              {/* Headphones */}
              <path d="M15 25 Q15 10 30 10 Q45 10 45 25" stroke="#f59e0b" strokeWidth="4" fill="none" />
              <circle cx="15" cy="26" r="5" fill="#f59e0b" />
              <circle cx="45" cy="26" r="5" fill="#f59e0b" />
            </motion.svg>
          </div>

          {/* Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-amber-700"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,0,0,0.1) 30px, rgba(0,0,0,0.1) 60px)' }}
          />
        </div>

        {/* Calendar */}
        <motion.div
          className="absolute top-6 left-6 z-20"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.8 }}
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden w-16">
            <div className="bg-red-500 text-white text-center py-1">
              <p className="text-[8px] uppercase tracking-wider font-bold">Day</p>
            </div>
            <div className="py-2 text-center">
              <motion.p
                key={dayCount}
                className="text-3xl font-bold text-stone-800"
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {dayCount}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Time display */}
        <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 z-20">
          <p className="text-white/60 text-[10px] uppercase">Total Time</p>
          <p className="text-amber-400 font-mono text-2xl font-bold">{animatedHours.toFixed(1)}h</p>
        </div>

        {/* Journal entry card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEntry.text}
            className="absolute bottom-24 left-4 right-4 z-20"
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-amber-50 rounded-lg shadow-xl p-4 border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                <div className="text-3xl">
                  {currentEntry.mood === 'anxious' && '😰'}
                  {currentEntry.mood === 'surprised' && '😮'}
                  {currentEntry.mood === 'curious' && '🤔'}
                  {currentEntry.mood === 'confident' && '😊'}
                  {currentEntry.mood === 'proud' && '😄'}
                  {currentEntry.mood === 'joyful' && '😁'}
                  {currentEntry.mood === 'amazed' && '🤩'}
                  {currentEntry.mood === 'peaceful' && '😌'}
                </div>
                <div>
                  <p className="text-stone-800 font-medium leading-relaxed">"{currentEntry.text}"</p>
                  <p className="text-stone-500 text-sm mt-1">{currentEntry.ja}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Phase indicator */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="flex justify-between">
            {DEPTH_ZONES.map((zone, i) => (
              <div key={i} className={`text-center ${currentZone.depth >= zone.depth ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                  currentZone.depth === zone.depth ? 'bg-amber-400 ring-2 ring-amber-300' :
                  currentZone.depth > zone.depth ? 'bg-emerald-400' : 'bg-white/50'
                }`} />
                <p className="text-white text-[8px] font-medium">{zone.hours}h</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed explanation below */}
      <motion.div
        className="mt-6 bg-stone-100 rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h4 className="text-stone-700 font-bold text-sm mb-3">タイムラプスのメタファー</h4>
        <p className="text-stone-600 text-xs leading-relaxed mb-4">
          毎日、同じ部屋で、同じことをしているように見える。
          でも、カメラを固定して早送りすると、変化が見える。
          窓の外の景色は変わる。季節が移ろう。そして、聞こえてくる音も変わる。
          最初はノイズだったものが、言葉になり、意味になり、感情になる。
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sky-600 text-sm">🌅</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">朝 = 新鮮な耳</p>
              <p className="text-stone-500 text-[10px]">朝一番は、耳がリセットされている。新しい音を吸収するベストタイム。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 text-sm">🌆</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">夕方 = 復習の時間</p>
              <p className="text-stone-500 text-[10px]">一日の終わり、聞いたことを振り返る。脳が整理を始める。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-600 text-sm">🌙</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">夜 = 定着の時間</p>
              <p className="text-stone-500 text-[10px]">眠る直前に聞いた英語は、睡眠中に脳に刻まれる。</p>
            </div>
          </div>
        </div>

        {/* Weekly progress summary */}
        <div className="mt-4 pt-4 border-t border-stone-200">
          <p className="text-stone-600 font-bold text-xs mb-3">8週間の変化</p>
          <div className="grid grid-cols-4 gap-2">
            {WEEKLY_CHANGES.slice(0, 8).map((week, i) => (
              <div
                key={i}
                className={`text-center p-2 rounded-lg ${
                  weekCount >= i ? 'bg-amber-100' : 'bg-stone-50'
                }`}
              >
                <p className="text-[10px] text-stone-400">W{week.week}</p>
                <p className={`text-[9px] font-medium ${
                  weekCount >= i ? 'text-amber-700' : 'text-stone-400'
                }`}>
                  {week.mood}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// =============================================================================
// PATTERN 4: SEED TO TREE - 「根を張り、実を結ぶ」完全版
// =============================================================================

// 成長の各段階の詳細なナラティブ
const GROWTH_NARRATIVES = {
  seed: {
    title: '土の中で',
    body: `
      種は土の中にいる。暗くて、何も見えない。
      でも、水を吸い、養分を吸い、じっと待っている。

      英語学習も同じだ。最初は何も見えない。
      何が分かっているのか、何が分かっていないのかすら分からない。
      ただ、毎日少しずつ、英語に触れる。

      見えない場所で、何かが始まっている。
    `
  },
  sprout: {
    title: '土を破って',
    body: `
      25時間。ついに芽が出た。

      土を押しのけ、光に向かって伸びる。
      まだ小さい。風が吹けば折れそうだ。
      でも、確かに生きている。

      最初のフレーズが口から出た。
      「Thank you」「Nice to meet you」
      完璧じゃない。でも、伝わった。
    `
  },
  growth: {
    title: '幹を太く',
    body: `
      50時間。幹が太くなってきた。

      根は見えないところで広がっている。
      枝は四方に伸び、葉を茂らせ始めた。
      もう、ちょっとの風では倒れない。

      語彙が増えた。文法が身についてきた。
      会話の中で、言いたいことが言えるようになってきた。
    `
  },
  bloom: {
    title: '花が咲く',
    body: `
      75時間。花が咲いた。

      蕾がほころび、色とりどりの花が開く。
      蝶が寄ってくる。蜂が蜜を吸いにくる。
      木が「社会」の一部になった瞬間だ。

      英語で冗談が言えた。相手が笑った。
      英語で悩みを聞いた。相手が泣いた。
      言葉が、人と人を繋いでいる。
    `
  },
  fruit: {
    title: '実がなる',
    body: `
      100時間。実がなった。

      種から始まった旅が、一つの形になった。
      この実の中には、また新しい種がある。
      次の世代に繋がる可能性。

      もう「勉強」じゃない。英語は生活の一部になった。
      考える言語が、時々英語になっている。
      夢の中で、英語を話している自分がいる。

      これが「習得」だ。でも、終わりじゃない。
      木は、これからも成長し続ける。
    `
  }
}

export function SeedToTreeVisualization({ hours = 0, maxHours = 100 }: { hours?: number; maxHours?: number }) {
  const [animatedHours, setAnimatedHours] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isRaining, setIsRaining] = useState(false)
  const [showNarrative, setShowNarrative] = useState(false)
  const [currentNarrativeKey, setCurrentNarrativeKey] = useState<keyof typeof GROWTH_NARRATIVES>('seed')
  const [butterflies, setButterflies] = useState<Array<{id: number, x: number, y: number}>>([])
  const [fallingLeaves, setFallingLeaves] = useState<Array<{id: number, x: number, delay: number}>>([])
  const [windPulse, setWindPulse] = useState(false)

  const progress = Math.min(animatedHours / maxHours, 1)

  useEffect(() => {
    setMounted(true)
    // Generate butterflies
    setButterflies(Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 40,
    })))
    // Generate falling leaves
    setFallingLeaves(Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
    })))

    // Wind pulse every 8 seconds
    const windInterval = setInterval(() => {
      setWindPulse(true)
      setTimeout(() => setWindPulse(false), 2000)
    }, 8000)

    return () => clearInterval(windInterval)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const duration = 12000
    const startTime = Date.now()
    let lastStageIndex = 0
    const stageThresholds = [0, 25, 50, 75, 100]
    const narrativeKeys: (keyof typeof GROWTH_NARRATIVES)[] = ['seed', 'sprout', 'growth', 'bloom', 'fruit']

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progressTime = Math.min(elapsed / duration, 1)
      const eased = progressTime < 0.5 ? 4 * progressTime ** 3 : 1 - Math.pow(-2 * progressTime + 2, 3) / 2
      const newHours = eased * hours
      setAnimatedHours(newHours)

      // Rain at growth spurts
      if ([20, 45, 70].some(m => Math.abs(newHours - m) < 2)) {
        setIsRaining(true)
        setTimeout(() => setIsRaining(false), 3000)
      }

      // Show narrative at stage transitions
      const currentStageIndex = stageThresholds.filter(t => newHours >= t).length - 1
      if (currentStageIndex > lastStageIndex && currentStageIndex < narrativeKeys.length) {
        lastStageIndex = currentStageIndex
        setCurrentNarrativeKey(narrativeKeys[currentStageIndex])
        setShowNarrative(true)
        setTimeout(() => setShowNarrative(false), 5000)
      }

      if (progressTime < 1) requestAnimationFrame(animate)
    }

    // Show initial narrative
    setTimeout(() => {
      setShowNarrative(true)
      setTimeout(() => setShowNarrative(false), 4000)
    }, 800)

    const timer = setTimeout(() => requestAnimationFrame(animate), 2500)
    return () => clearTimeout(timer)
  }, [mounted, hours])

  // Growth stages（成長の各段階に意味を持たせる）
  const stages = [
    { hours: 0, name: '種', icon: '🌱', meaning: '決意', desc: '土の中で眠る小さな可能性。まだ何も見えない。でも、始める決意がある。' },
    { hours: 25, name: '発芽', icon: '🌿', meaning: '基礎', desc: '土を割って芽が出た。基本単語と文法。小さいけど確かな一歩。' },
    { hours: 50, name: '成長', icon: '🌳', meaning: '構築', desc: '幹が太くなり、枝が伸びる。語彙が増え、表現が広がる。' },
    { hours: 75, name: '開花', icon: '🌸', meaning: '対話', desc: '花が咲いた。会話が楽しい。伝わる喜び、通じ合う瞬間。' },
    { hours: 100, name: '結実', icon: '🍎', meaning: '習得', desc: '実がなった。もう「勉強」じゃない。英語の中に住んでいる。' },
  ]

  const currentStage = stages.reduce((prev, curr) => (animatedHours >= curr.hours ? curr : prev), stages[0])

  // Tree dimensions
  const trunkHeight = 20 + progress * 200
  const trunkWidth = 8 + progress * 30
  const canopySize = progress > 0.3 ? (progress - 0.3) * 220 : 0
  const rootLength = Math.min(progress * 2.5, 1) * 120

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Cinematic intro text */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h3 className="text-2xl font-bold text-stone-700 mb-3">成長の軌跡</h3>
        <p className="text-stone-600 text-sm leading-relaxed max-w-lg mx-auto mb-3">
          一粒の種を土に埋める。最初は何も見えない。<br />
          でも、毎日水をやり、日光を当て、じっと待つ。<br />
          見えない場所で根が張り、やがて芽が土を破る。<br />
          幹が太くなり、枝が伸び、花が咲き、実がなる。<br />
          100時間とは、そういう時間だ。
        </p>
        <motion.p
          className="text-emerald-600 text-xs italic"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          「根が深いほど、木は高く伸びる」
        </motion.p>
      </motion.div>

      <div className="relative h-[620px] rounded-2xl overflow-hidden shadow-2xl">
        {/* Sky - changes with growth */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              ${progress < 0.3 ? '#e0f2fe' : progress < 0.6 ? '#bae6fd' : progress < 0.9 ? '#7dd3fc' : '#38bdf8'} 0%,
              ${progress < 0.5 ? '#fef3c7' : '#fef9c3'} 100%)`
          }}
        />

        {/* Growth narrative overlay */}
        <AnimatePresence>
          {showNarrative && GROWTH_NARRATIVES[currentNarrativeKey] && (
            <motion.div
              className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="max-w-md text-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.p
                  className="text-emerald-400 text-xs uppercase tracking-[0.3em] mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentStage.name} - {currentStage.hours}時間
                </motion.p>
                <motion.h4
                  className="text-xl font-bold text-white mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {GROWTH_NARRATIVES[currentNarrativeKey].title}
                </motion.h4>
                <motion.p
                  className="text-white/80 text-sm leading-relaxed whitespace-pre-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {GROWTH_NARRATIVES[currentNarrativeKey].body.trim().split('\n').slice(0, 6).join('\n')}
                </motion.p>
                <motion.div
                  className="mt-4 inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-4xl">{currentStage.icon}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Butterflies appear after flowers bloom */}
        {progress > 0.7 && mounted && butterflies.map((b) => (
          <motion.div
            key={b.id}
            className="absolute z-30 pointer-events-none"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
            }}
            animate={{
              x: [0, 30, -20, 10, 0],
              y: [0, -15, 10, -8, 0],
            }}
            transition={{
              duration: 8 + b.id * 0.5,
              repeat: Infinity,
              delay: b.id * 0.3,
            }}
          >
            <motion.svg
              width="20" height="16" viewBox="0 0 20 16"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <ellipse cx="6" cy="8" rx="5" ry="6" fill="#f472b6" opacity="0.8" />
              <ellipse cx="14" cy="8" rx="5" ry="6" fill="#f472b6" opacity="0.8" />
              <ellipse cx="10" cy="8" rx="1.5" ry="6" fill="#1e293b" />
            </motion.svg>
          </motion.div>
        ))}

        {/* Falling leaves in autumn (late growth) */}
        {progress > 0.85 && mounted && fallingLeaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            className="absolute z-20 pointer-events-none"
            style={{ left: `${leaf.x}%` }}
            initial={{ top: '-5%', opacity: 0, rotate: 0 }}
            animate={{
              top: '100%',
              opacity: [0, 1, 1, 0],
              rotate: [0, 180, 360],
              x: [0, 30, -20, 40, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: leaf.delay,
              ease: 'linear',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M6 0 Q9 3 12 6 Q9 9 6 12 Q3 9 0 6 Q3 3 6 0"
                fill={['#f59e0b', '#ef4444', '#ea580c'][leaf.id % 3]}
              />
            </svg>
          </motion.div>
        ))}

        {/* Sun - grows brighter with progress */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 60 + progress * 30,
            height: 60 + progress * 30,
            top: '8%',
            right: '10%',
            background: 'radial-gradient(circle, #fcd34d 0%, #f97316 100%)',
            boxShadow: `0 0 ${60 + progress * 40}px rgba(251, 191, 36, ${0.4 + progress * 0.3})`,
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Rain effect */}
        {isRaining && mounted && [...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 bg-blue-400/60"
            style={{
              height: 15 + Math.random() * 15,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ top: '-5%', opacity: 0.7 }}
            animate={{ top: '100%', opacity: 0 }}
            transition={{
              duration: 0.8 + Math.random() * 0.4,
              repeat: 3,
              delay: Math.random() * 0.5,
            }}
          />
        ))}

        {/* Ground with grass */}
        <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800">
          {/* Grass layer */}
          <div className="absolute -top-3 left-0 right-0 h-6">
            {[...Array(60)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 w-1 rounded-t bg-gradient-to-t from-green-600 to-green-400"
                style={{
                  left: `${i * 1.7}%`,
                  height: 10 + Math.random() * 15,
                }}
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.05 }}
              />
            ))}
          </div>

          {/* Cross-section soil layers */}
          <div className="absolute top-4 left-0 right-0 h-2 bg-amber-500/30" />
          <div className="absolute top-8 left-0 right-0 h-1 bg-amber-500/20" />
        </div>

        {/* THE TREE */}
        <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2">

          {/* Roots (underground) */}
          <svg
            className="absolute top-full left-1/2 -translate-x-1/2"
            width="250"
            height="150"
          >
            {[...Array(9)].map((_, i) => {
              const angle = -70 + i * 17.5
              const length = rootLength * (0.5 + (i % 3) * 0.2)
              const endX = 125 + Math.sin(angle * Math.PI / 180) * length
              const endY = length * 0.9

              return (
                <motion.path
                  key={i}
                  d={`M125,0 Q${125 + Math.sin(angle * Math.PI / 180) * length * 0.4},${length * 0.35} ${endX},${endY}`}
                  stroke="#78350f"
                  strokeWidth={8 - Math.abs(4 - i) * 0.8}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(progress * 2.5, 1) }}
                  transition={{ duration: 2.5, delay: i * 0.15 }}
                />
              )
            })}
            {/* Root label */}
            {progress > 0.15 && (
              <motion.text
                x="125" y="130"
                textAnchor="middle"
                className="fill-amber-300/80 text-xs font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                根 = 基礎文法
              </motion.text>
            )}
          </svg>

          {/* Trunk */}
          <motion.div
            className="absolute bottom-0 left-1/2 origin-bottom"
            style={{
              width: trunkWidth,
              marginLeft: -trunkWidth / 2,
              height: trunkHeight,
              background: `linear-gradient(90deg,
                #5c3d2e 0%,
                #8b5a3c 20%,
                #a0674a 50%,
                #8b5a3c 80%,
                #5c3d2e 100%)`,
              borderRadius: '8px 8px 0 0',
            }}
            initial={{ height: 0 }}
            animate={{ height: trunkHeight }}
          >
            {/* Bark texture */}
            {progress > 0.2 && [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-amber-900/30 rounded"
                style={{
                  width: '60%',
                  height: 8 + i * 3,
                  left: '20%',
                  top: `${15 + i * 15}%`,
                }}
              />
            ))}
          </motion.div>

          {/* Branches */}
          {progress > 0.35 && (
            <svg
              className="absolute"
              style={{
                bottom: trunkHeight * 0.55,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 280,
                height: 180,
              }}
            >
              {[...Array(10)].map((_, i) => {
                const angle = -80 + i * 18
                const length = 35 + (progress - 0.35) * 100 + (i % 3) * 15
                const startY = 160 - i * 10

                return (
                  <motion.path
                    key={i}
                    d={`M140,${startY}
                       Q${140 + Math.cos(angle * Math.PI / 180) * length * 0.5},${startY - length * 0.3}
                        ${140 + Math.cos(angle * Math.PI / 180) * length},${startY - length * 0.6}`}
                    stroke="#5c3d2e"
                    strokeWidth={10 - Math.abs(5 - i) * 1.2}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: i * 0.12 }}
                  />
                )
              })}
            </svg>
          )}

          {/* Canopy (leaves) with wind effect */}
          {progress > 0.35 && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ bottom: trunkHeight * 0.4 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {/* Multiple layers for depth */}
              {[0.75, 0.85, 0.95, 1].map((scale, layer) => (
                <motion.div
                  key={layer}
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    width: canopySize * scale,
                    height: canopySize * 0.75 * scale,
                    background: `radial-gradient(ellipse at 40% 30%,
                      ${['#4ade80', '#22c55e', '#16a34a', '#15803d'][layer]} 0%,
                      ${['#22c55e', '#16a34a', '#15803d', '#166534'][layer]} 100%)`,
                    transform: `translateX(-50%) translateY(${layer * -12}px)`,
                    boxShadow: layer === 3 ? 'none' : 'inset -15px -15px 30px rgba(0,0,0,0.15)',
                  }}
                  animate={{
                    scale: [1, 1.02, 1],
                    x: windPulse ? [0, 8, -4, 0] : 0,
                    skewX: windPulse ? [0, 3, -1, 0] : 0,
                  }}
                  transition={{
                    scale: { duration: 4, repeat: Infinity, delay: layer * 0.4 },
                    x: { duration: 2, ease: 'easeOut' },
                    skewX: { duration: 2, ease: 'easeOut' },
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Flowers (70h+) */}
          {progress > 0.65 && [...Array(18)].map((_, i) => {
            const angle = (i / 18) * Math.PI * 2
            const r = canopySize * 0.3 * (0.6 + Math.random() * 0.4)

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * r}px)`,
                  bottom: trunkHeight * 0.4 + canopySize * 0.3 + Math.sin(angle) * r * 0.5,
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  {[...Array(5)].map((_, j) => (
                    <ellipse
                      key={j}
                      cx="10"
                      cy="4"
                      rx="3"
                      ry="5"
                      fill={['#fda4af', '#f9a8d4', '#f472b6'][i % 3]}
                      transform={`rotate(${j * 72} 10 10)`}
                    />
                  ))}
                  <circle cx="10" cy="10" r="3" fill="#fcd34d" />
                </svg>
              </motion.div>
            )
          })}

          {/* Fruits (85h+) */}
          {progress > 0.8 && [...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2 + 0.3
            const r = canopySize * 0.25 * (0.5 + Math.random() * 0.5)

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * r}px)`,
                  bottom: trunkHeight * 0.35 + Math.sin(angle) * r * 0.4,
                }}
                initial={{ scale: 0, y: -30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, type: 'spring', bounce: 0.5 }}
              >
                <div className="w-6 h-7 rounded-full bg-gradient-to-b from-red-400 via-red-500 to-red-600 shadow-lg">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-amber-800 rounded-full" />
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-green-500 rounded-full" style={{ transform: 'translateX(-30%) rotate(-30deg)' }} />
                </div>
              </motion.div>
            )
          })}

          {/* Birds at completion */}
          {progress > 0.92 && [...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ x: -200, opacity: 0 }}
              animate={{
                x: [null, 30 + i * 20],
                y: [null, -trunkHeight - 50 - i * 15],
                opacity: 1,
              }}
              transition={{ duration: 2.5, delay: 0.5 + i * 0.4 }}
            >
              <motion.svg
                width="28" height="14" viewBox="0 0 28 14"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              >
                <path
                  d="M14,7 Q7,0 0,5 Q7,7 14,7 Q21,7 28,5 Q21,0 14,7"
                  fill="#374151"
                />
              </motion.svg>
            </motion.div>
          ))}

          {/* Swing at the end (reward) */}
          {progress > 0.95 && (
            <motion.div
              className="absolute"
              style={{
                left: 'calc(50% + 60px)',
                bottom: trunkHeight * 0.6,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ transformOrigin: 'top center' }}
              >
                {/* Ropes */}
                <div className="w-0.5 h-16 bg-amber-800 absolute left-0" />
                <div className="w-0.5 h-16 bg-amber-800 absolute left-6" />
                {/* Seat */}
                <div className="absolute top-16 -left-1 w-8 h-2 bg-amber-700 rounded" />
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Stage indicator panel */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl z-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentStage.icon}</span>
            <div>
              <p className="font-bold text-stone-800 text-lg">{currentStage.name}</p>
              <p className="text-amber-600 text-sm font-medium">{currentStage.meaning}</p>
            </div>
          </div>
          <p className="text-stone-500 text-xs max-w-[140px]">{currentStage.desc}</p>
        </div>

        {/* Progress display */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3 z-20">
          <p className="text-white/60 text-[10px] uppercase tracking-wider">Growth</p>
          <p className="text-amber-400 font-mono text-3xl font-bold">{animatedHours.toFixed(1)}<span className="text-lg">h</span></p>
        </div>

        {/* Stage progress */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-sm rounded-xl p-3 z-20">
          <div className="flex justify-between mb-2">
            {stages.map((stage, i) => {
              const isReached = animatedHours >= stage.hours
              const isCurrent = currentStage.hours === stage.hours

              return (
                <div key={i} className="text-center flex-1">
                  <motion.div
                    className={`w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] ${
                      isCurrent ? 'bg-amber-400 ring-2 ring-amber-300 shadow-lg shadow-amber-400/50' :
                      isReached ? 'bg-green-400' : 'bg-white/30'
                    }`}
                    animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {isReached && stage.icon}
                  </motion.div>
                  <p className={`text-[9px] font-medium ${isReached ? 'text-white' : 'text-white/50'}`}>
                    {stage.name}
                  </p>
                </div>
              )
            })}
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, #fbbf24, #22c55e, #16a34a)'
              }}
            />
          </div>
          <p className="text-center text-white/60 text-[10px] mt-2">
            根=文法 | 幹=語彙 | 花=会話 | 実=流暢さ | 鳥=ネイティブとの交流
          </p>
        </div>
      </div>

      {/* Detailed explanation below */}
      <motion.div
        className="mt-6 bg-stone-100 rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h4 className="text-stone-700 font-bold text-sm mb-3">木のメタファー</h4>
        <p className="text-stone-600 text-xs leading-relaxed mb-4">
          木は急には育たない。でも、毎日少しずつ、確実に大きくなる。
          根を張り、幹を太くし、枝を伸ばし、葉を茂らせる。
          見えない部分（根=基礎文法）が、見える部分（枝葉=会話力）を支えている。
          この比喩は、言語習得の本質を捉えている。
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-700 text-sm">🌱</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">種 = 決意</p>
              <p className="text-stone-500 text-[10px]">何も見えない暗闘の中で、「やる」と決めた瞬間。全てはここから始まる。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-700 text-sm">🪵</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">根 = 基礎文法</p>
              <p className="text-stone-500 text-[10px]">見えないけど一番大事。文法が弱いと、どんなに語彙があっても倒れる。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-700 text-sm">🌳</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">幹・枝 = 語彙力</p>
              <p className="text-stone-500 text-[10px]">単語は枝。フレーズは太い枝。増えるほど、表現の幅が広がる。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
              <span className="text-pink-600 text-sm">🌸</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">花 = 会話の喜び</p>
              <p className="text-stone-500 text-[10px]">伝わる、通じる、笑い合える。言葉が人と人を繋ぐ瞬間。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 text-sm">🍎</span>
            </div>
            <div>
              <p className="text-stone-700 font-bold text-xs">実 = 流暢さ</p>
              <p className="text-stone-500 text-[10px]">長い時間をかけてたどり着く境地。でも終わりじゃない。実の中には、次の種がある。</p>
            </div>
          </div>
        </div>

        {/* Growth phase summary */}
        <div className="mt-4 pt-4 border-t border-stone-200">
          <p className="text-stone-600 font-bold text-xs mb-3">5つの成長フェーズ</p>
          <div className="flex justify-between">
            {stages.map((stage, i) => (
              <div
                key={i}
                className={`text-center flex-1 p-2 ${
                  animatedHours >= stage.hours ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <span className="text-xl">{stage.icon}</span>
                <p className="text-[9px] font-medium text-stone-600 mt-1">{stage.name}</p>
                <p className="text-[8px] text-stone-400">{stage.hours}h</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// =============================================================================
// VISUALIZATION SWITCHER COMPONENT
// =============================================================================

interface VisualizationSwitcherProps {
  hours?: number
  maxHours?: number
}

export function VisualizationSwitcher({ hours = 72.5, maxHours = 100 }: VisualizationSwitcherProps) {
  const [activePattern, setActivePattern] = useState<'diver' | 'aquarium' | 'timelapse' | 'tree'>('diver')
  const [key, setKey] = useState(0) // Force re-render for animation restart

  const patterns = [
    { id: 'diver' as const, name: 'ダイバー', subtitle: '深海への旅', icon: '🤿', story: '深く潜るほど、見える世界が変わる' },
    { id: 'aquarium' as const, name: '水槽', subtitle: '言葉の生態系', icon: '🐠', story: '一匹ずつ、語彙が泳ぎ始める' },
    { id: 'timelapse' as const, name: 'タイムラプス', subtitle: '日常の変容', icon: '📅', story: '同じ毎日が、違って見えてくる' },
    { id: 'tree' as const, name: '木', subtitle: '成長の軌跡', icon: '🌳', story: '根を張り、花を咲かせ、実を結ぶ' },
  ]

  const handlePatternChange = (pattern: typeof activePattern) => {
    setActivePattern(pattern)
    setKey(k => k + 1) // Reset animation
  }

  const currentPattern = patterns.find(p => p.id === activePattern)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-3">100 Hours Visualization</p>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">100時間の旅を、どう描く？</h2>
        <p className="text-stone-500 text-sm max-w-lg mx-auto leading-relaxed">
          学習の進捗を4つの物語で表現。それぞれが異なる視点から、<br className="hidden sm:block" />
          あなたの100時間を語ります。好きな物語を選んでください。
        </p>
      </div>

      {/* Pattern selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex flex-wrap justify-center bg-stone-100 rounded-2xl p-1.5 gap-1">
          {patterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handlePatternChange(pattern.id)}
              className={`
                relative px-4 py-3 rounded-xl transition-all duration-300
                ${activePattern === pattern.id
                  ? 'bg-white shadow-lg text-stone-800'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-white/50'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{pattern.icon}</span>
                <div className="text-left">
                  <p className="font-bold text-sm">{pattern.name}</p>
                  <p className="text-[10px] opacity-70">{pattern.subtitle}</p>
                </div>
              </div>
              {activePattern === pattern.id && (
                <motion.div
                  className="absolute inset-0 border-2 border-amber-400 rounded-xl"
                  layoutId="activeTab"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Current pattern story */}
      <motion.p
        key={currentPattern?.story}
        className="text-center text-amber-600 text-sm font-medium mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        「{currentPattern?.story}」
      </motion.p>

      {/* Visualization */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activePattern}-${key}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {activePattern === 'diver' && <DiverVisualization hours={hours} maxHours={maxHours} />}
          {activePattern === 'aquarium' && <AquariumVisualization hours={hours} maxHours={maxHours} />}
          {activePattern === 'timelapse' && <TimeLapseVisualization hours={hours} maxHours={maxHours} />}
          {activePattern === 'tree' && <SeedToTreeVisualization hours={hours} maxHours={maxHours} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
