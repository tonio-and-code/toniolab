// Gamification audio system — Web Audio API synthesized sounds + fever BGM
// Extracted from training page for reuse across components.

import { getSettings } from './settings'
import { type CardRank } from '@/app/phrases-chakra/constants'

// Shared AudioContext singleton
let _audioCtx: AudioContext | null = null
function getAudioCtx(): AudioContext {
    if (!_audioCtx || _audioCtx.state === 'closed') {
        _audioCtx = new AudioContext()
    }
    return _audioCtx
}

// Gacha reel tick sound (300ms, fast burst)
export function playReelSound() {
    try {
        const st = getSettings(); if (!st.soundEnabled) return
        const vol = st.volume / 100
        const ctx = getAudioCtx()
        if (ctx.state === 'suspended') ctx.resume()
        const now = ctx.currentTime
        const delays = [0, 0.03, 0.065, 0.11, 0.17, 0.25]
        for (let i = 0; i < delays.length; i++) {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.frequency.value = 700 + i * 80
            osc.type = 'triangle'
            gain.gain.setValueAtTime(0.08 * vol, now + delays[i])
            gain.gain.exponentialRampToValueAtTime(0.001, now + delays[i] + 0.03)
            osc.connect(gain); gain.connect(ctx.destination)
            osc.start(now + delays[i]); osc.stop(now + delays[i] + 0.05)
        }
    } catch { /* audio not available */ }
}

// Gacha tier reveal sound
export function playGachaSound(tier: string) {
    try {
        const st = getSettings(); if (!st.soundEnabled) return
        const vol = st.volume / 100
        const ctx = getAudioCtx()
        if (ctx.state === 'suspended') ctx.resume()
        const now = ctx.currentTime
        const sounds: Record<string, { freqs: number[]; dur: number; type: OscillatorType; gain: number; stagger: number }> = {
            MISS: { freqs: [150], dur: 0.15, type: 'triangle', gain: 0.08, stagger: 0 },
            BONUS: { freqs: [523, 659], dur: 0.25, type: 'sine', gain: 0.12, stagger: 0.08 },
            GREAT: { freqs: [523, 659, 784], dur: 0.35, type: 'sine', gain: 0.14, stagger: 0.07 },
            SUPER: { freqs: [262, 392, 523, 659, 784], dur: 0.50, type: 'triangle', gain: 0.10, stagger: 0.05 },
            MEGA: { freqs: [220, 330, 440, 554, 659, 880], dur: 0.90, type: 'sine', gain: 0.08, stagger: 0.06 },
            LEGENDARY: { freqs: [440, 554, 659, 880, 1109, 1319, 1760], dur: 1.20, type: 'sine', gain: 0.07, stagger: 0.05 },
        }
        const s = sounds[tier] || sounds.MISS
        s.freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = s.type
            osc.frequency.value = freq
            const g = s.gain * vol
            gain.gain.setValueAtTime(0, now)
            gain.gain.linearRampToValueAtTime(g, now + 0.03)
            gain.gain.setValueAtTime(g, now + s.dur * 0.5)
            gain.gain.exponentialRampToValueAtTime(0.001, now + s.dur)
            osc.connect(gain); gain.connect(ctx.destination)
            osc.start(now + i * s.stagger); osc.stop(now + s.dur + 0.1)
        })
        if (tier === 'LEGENDARY') {
            const rumble = ctx.createOscillator()
            const rGain = ctx.createGain()
            rumble.frequency.value = 80; rumble.type = 'sawtooth'
            rGain.gain.setValueAtTime(0.08 * vol, now)
            rGain.gain.linearRampToValueAtTime(0.15 * vol, now + 0.3)
            rGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
            rumble.connect(rGain); rGain.connect(ctx.destination)
            rumble.start(now); rumble.stop(now + 0.5)
        }
    } catch { /* audio not available */ }
}

// FEVER entry sound — pachinko kakuhen-level impact (~1.5s)
export function playFeverEntrySound() {
    try {
        const st = getSettings(); if (!st.soundEnabled) return
        const vol = st.volume / 100
        const ctx = getAudioCtx()
        if (ctx.state === 'suspended') ctx.resume()
        const now = ctx.currentTime

        // Phase 1: Low rumble sweep
        const sweep = ctx.createOscillator()
        const sweepGain = ctx.createGain()
        sweep.type = 'sawtooth'
        sweep.frequency.setValueAtTime(60, now)
        sweep.frequency.exponentialRampToValueAtTime(400, now + 0.3)
        sweepGain.gain.setValueAtTime(0.12 * vol, now)
        sweepGain.gain.linearRampToValueAtTime(0.18 * vol, now + 0.15)
        sweepGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
        sweep.connect(sweepGain); sweepGain.connect(ctx.destination)
        sweep.start(now); sweep.stop(now + 0.4)

        // Phase 2: Rising arpeggio
        const arpFreqs = [261.6, 329.6, 392.0, 523.3, 659.3]
        arpFreqs.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const g = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.value = freq
            const t = now + 0.3 + i * 0.1
            g.gain.setValueAtTime(0, t)
            g.gain.linearRampToValueAtTime(0.15 * vol, t + 0.03)
            g.gain.setValueAtTime(0.15 * vol, t + 0.06)
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
            osc.connect(g); g.connect(ctx.destination)
            osc.start(t); osc.stop(t + 0.25)
        })

        // Phase 3: Power chord
        const chordFreqs = [523.3, 659.3, 784.0, 1046.5]
        chordFreqs.forEach(freq => {
            const osc = ctx.createOscillator()
            const g = ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.value = freq
            g.gain.setValueAtTime(0, now + 0.8)
            g.gain.linearRampToValueAtTime(0.2 * vol, now + 0.85)
            g.gain.setValueAtTime(0.2 * vol, now + 0.95)
            g.gain.exponentialRampToValueAtTime(0.001, now + 1.25)
            osc.connect(g); g.connect(ctx.destination)
            osc.start(now + 0.8); osc.stop(now + 1.3)
        })

        // Phase 4: Sub-bass + white noise
        const sub = ctx.createOscillator()
        const subGain = ctx.createGain()
        sub.type = 'sine'
        sub.frequency.value = 40
        subGain.gain.setValueAtTime(0.2 * vol, now + 0.8)
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
        sub.connect(subGain); subGain.connect(ctx.destination)
        sub.start(now + 0.8); sub.stop(now + 1.6)

        const bufferSize = ctx.sampleRate * 0.3
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = noiseBuffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5
        const noise = ctx.createBufferSource()
        const noiseGain = ctx.createGain()
        noise.buffer = noiseBuffer
        noiseGain.gain.setValueAtTime(0.12 * vol, now + 0.8)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1)
        noise.connect(noiseGain); noiseGain.connect(ctx.destination)
        noise.start(now + 0.8); noise.stop(now + 1.2)
    } catch { /* audio not available */ }
}

// FEVER exit sound — descending sweep (~0.8s)
export function playFeverExitSound() {
    try {
        const st = getSettings(); if (!st.soundEnabled) return
        const vol = st.volume / 100
        const ctx = getAudioCtx()
        if (ctx.state === 'suspended') ctx.resume()
        const now = ctx.currentTime

        const sweep = ctx.createOscillator()
        const sweepGain = ctx.createGain()
        sweep.type = 'sawtooth'
        sweep.frequency.setValueAtTime(800, now)
        sweep.frequency.exponentialRampToValueAtTime(100, now + 0.5)
        sweepGain.gain.setValueAtTime(0.1 * vol, now)
        sweepGain.gain.linearRampToValueAtTime(0.14 * vol, now + 0.1)
        sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
        sweep.connect(sweepGain); sweepGain.connect(ctx.destination)
        sweep.start(now); sweep.stop(now + 0.7)

        const low = ctx.createOscillator()
        const lowGain = ctx.createGain()
        low.type = 'triangle'
        low.frequency.value = 80
        lowGain.gain.setValueAtTime(0.06 * vol, now + 0.4)
        lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
        low.connect(lowGain); lowGain.connect(ctx.destination)
        low.start(now + 0.4); low.stop(now + 0.9)
    } catch { /* audio not available */ }
}

// FEVER BGM — looping MP3
export function startFeverBGM(): HTMLAudioElement | null {
    try {
        const st = getSettings(); if (!st.soundEnabled) return null
        const audio = new Audio('/audio/fever-bgm.mp3')
        audio.loop = true
        audio.volume = (st.feverBgmVolume / 100) * (st.volume / 100)
        audio.play().catch(() => { /* autoplay blocked */ })
        return audio
    } catch { return null }
}

export function stopFeverBGM(audio: HTMLAudioElement | null) {
    if (!audio) return
    try {
        const startVol = audio.volume
        const steps = 8
        let step = 0
        const fade = setInterval(() => {
            step++
            audio.volume = Math.max(0, startVol * (1 - step / steps))
            if (step >= steps) {
                clearInterval(fade)
                audio.pause()
                audio.currentTime = 0
            }
        }, 30)
    } catch { /* audio not available */ }
}

// Card rank reveal sound — per-rank SE
export function playCardRankSound(rank: CardRank) {
    try {
        if (rank === 'NORMAL') return
        const st = getSettings(); if (!st.soundEnabled) return
        const vol = st.volume / 100
        const ctx = getAudioCtx()
        if (ctx.state === 'suspended') ctx.resume()
        const now = ctx.currentTime

        const configs: Partial<Record<CardRank, { freqs: number[]; dur: number; type: OscillatorType; gain: number; stagger: number }>> = {
            BRONZE: { freqs: [440], dur: 0.15, type: 'triangle', gain: 0.1, stagger: 0 },
            SILVER: { freqs: [523, 659], dur: 0.2, type: 'sine', gain: 0.1, stagger: 0 },
            GOLD: { freqs: [523, 659, 784], dur: 0.35, type: 'sine', gain: 0.12, stagger: 0.08 },
            HOLOGRAPHIC: { freqs: [523, 659, 784, 988, 1175], dur: 0.6, type: 'sine', gain: 0.1, stagger: 0.06 },
            LEGENDARY: { freqs: [440, 523, 659, 784, 988, 1175, 1568], dur: 0.9, type: 'sine', gain: 0.08, stagger: 0.05 },
        }
        const s = configs[rank]
        if (!s) return

        s.freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const g = ctx.createGain()
            osc.type = s.type
            osc.frequency.value = freq
            const t = now + i * s.stagger
            const gv = s.gain * vol
            g.gain.setValueAtTime(0, t)
            g.gain.linearRampToValueAtTime(gv, t + 0.02)
            g.gain.setValueAtTime(gv, t + s.dur * 0.4)
            g.gain.exponentialRampToValueAtTime(0.001, t + s.dur)
            osc.connect(g); g.connect(ctx.destination)
            osc.start(t); osc.stop(t + s.dur + 0.05)
        })

        if (rank === 'LEGENDARY') {
            const rumble = ctx.createOscillator()
            const rg = ctx.createGain()
            rumble.type = 'sawtooth'; rumble.frequency.value = 80
            rg.gain.setValueAtTime(0.06 * vol, now)
            rg.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
            rumble.connect(rg); rg.connect(ctx.destination)
            rumble.start(now); rumble.stop(now + 0.6)
        }
    } catch { /* audio not available */ }
}

// Rank-up fanfare — ascending celebration
export function playRankUpSound(newRank: CardRank) {
    try {
        const st = getSettings(); if (!st.soundEnabled) return
        const vol = st.volume / 100
        const ctx = getAudioCtx()
        if (ctx.state === 'suspended') ctx.resume()
        const now = ctx.currentTime

        const fanfareFreqs: Record<string, number[]> = {
            BRONZE: [330, 440],
            SILVER: [330, 440, 523],
            GOLD: [330, 440, 523, 659],
            HOLOGRAPHIC: [330, 440, 523, 659, 784],
            LEGENDARY: [262, 330, 392, 523, 659, 784, 1047],
        }
        const freqs = fanfareFreqs[newRank] || [440, 523]
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const g = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.value = freq
            const t = now + i * 0.08
            g.gain.setValueAtTime(0, t)
            g.gain.linearRampToValueAtTime(0.14 * vol, t + 0.03)
            g.gain.setValueAtTime(0.14 * vol, t + 0.15)
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
            osc.connect(g); g.connect(ctx.destination)
            osc.start(t); osc.stop(t + 0.55)
        })

        const chordTime = now + freqs.length * 0.08 + 0.1
        const topFreqs = freqs.slice(-3)
        topFreqs.forEach(freq => {
            const osc = ctx.createOscillator()
            const g = ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.value = freq
            g.gain.setValueAtTime(0, chordTime)
            g.gain.linearRampToValueAtTime(0.12 * vol, chordTime + 0.03)
            g.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.4)
            osc.connect(g); g.connect(ctx.destination)
            osc.start(chordTime); osc.stop(chordTime + 0.45)
        })
    } catch { /* audio not available */ }
}

// FEVER chain hit — metallic ping that rises with streak
export function playFeverChainHit(streak: number) {
    try {
        const st = getSettings(); if (!st.soundEnabled) return
        const vol = st.volume / 100
        const ctx = getAudioCtx()
        if (ctx.state === 'suspended') ctx.resume()
        const now = ctx.currentTime
        const freq = 1200 + streak * 50
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = Math.min(freq, 3000)
        g.gain.setValueAtTime(0.08 * vol, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
        osc.connect(g); g.connect(ctx.destination)
        osc.start(now); osc.stop(now + 0.2)
    } catch { /* audio not available */ }
}
