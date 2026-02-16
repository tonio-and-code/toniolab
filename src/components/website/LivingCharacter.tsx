'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type TimeSlot = 'morning' | 'daytime' | 'evening' | 'night'

interface CharacterState {
  image: string
  character: 'takumi' | 'jijii'
  message: string
  greeting: string
}

const CHARACTER_STATES: Record<TimeSlot, CharacterState> = {
  morning: {
    image: '/generated/takumi-morning.png',
    character: 'takumi',
    message: 'ヘルメット装着、準備よし！',
    greeting: 'おはようございます！今日も良い仕事しましょう。',
  },
  daytime: {
    image: '/generated/takumi-daytime.png',
    character: 'takumi',
    message: '集中して作業中...',
    greeting: 'お疲れさまです。現場は順調っすよ！',
  },
  evening: {
    image: '/generated/jijii-evening.png',
    character: 'jijii',
    message: '今日も良い一日じゃったな',
    greeting: 'お疲れさん。茶でも飲んでいけ。',
  },
  night: {
    image: '/generated/jijii-night.png',
    character: 'jijii',
    message: '...まだ起きとるんか',
    greeting: '無理すんなよ。明日も床は待っとる。',
  },
}

function getTimeSlot(hour: number): TimeSlot {
  if (hour >= 6 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'daytime'
  if (hour >= 17 && hour < 22) return 'evening'
  return 'night'
}

export function LivingCharacter() {
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('daytime')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    setTimeSlot(getTimeSlot(hour))

    // Update every minute
    const interval = setInterval(() => {
      const currentHour = new Date().getHours()
      setTimeSlot(getTimeSlot(currentHour))
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-stone-50 to-stone-100 rounded-2xl">
        <div className="w-24 h-24 rounded-full bg-stone-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
          <div className="h-3 w-48 bg-stone-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  const state = CHARACTER_STATES[timeSlot]
  const isJijii = state.character === 'jijii'

  return (
    <div
      className={`
        flex items-center gap-6 p-6 rounded-2xl transition-all duration-700
        ${isJijii
          ? 'bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200/50'
          : 'bg-gradient-to-r from-emerald-50 to-stone-50 border border-emerald-200/50'
        }
      `}
    >
      <div className="relative">
        <div
          className={`
            w-24 h-24 rounded-full overflow-hidden ring-4 transition-all
            ${isJijii ? 'ring-amber-300/50' : 'ring-emerald-300/50'}
          `}
        >
          <Image
            src={state.image}
            alt={state.character === 'jijii' ? 'コルクじじい' : 'AIタクミ'}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={`
            absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
            ${isJijii ? 'bg-amber-400' : 'bg-emerald-400'}
          `}
          title="オンライン"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`
              text-sm font-medium tracking-wider
              ${isJijii ? 'text-amber-700' : 'text-emerald-700'}
            `}
          >
            {isJijii ? 'コルクじじい' : 'AIタクミ'}
          </span>
          <span className="text-xs text-stone-400">
            {timeSlot === 'morning' && '朝'}
            {timeSlot === 'daytime' && '日中'}
            {timeSlot === 'evening' && '夕方'}
            {timeSlot === 'night' && '深夜'}
          </span>
        </div>
        <p className="text-stone-600 text-sm mb-2">{state.message}</p>
        <p className="text-stone-800 font-medium">{state.greeting}</p>
      </div>
    </div>
  )
}
