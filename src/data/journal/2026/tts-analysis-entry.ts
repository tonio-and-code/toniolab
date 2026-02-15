/**
 * 英語学習システム全面改善記事
 */

import { JournalEntry } from '../types';

export const englishSystemRevampEntry: JournalEntry = {
  id: '065',
  date: '2026-01-10',
  title: '英語学習を、全部作り直した日',
  summary: '音声分析はフェイク、日記は孤立、練習は退屈。全てを壊して、Takumi & Anyaと一緒に再構築した。Memoria、本物の波形分析、キャラクター対話—英語学習が、ようやく面白くなった。',
  featured: true,
  readTime: 12,
  businessTags: ['開発', '全面刷新', 'UX', '英語学習', 'イノベーション'],
  techTags: ['Next.js', 'Web Audio API', 'Google Cloud TTS', 'LocalStorage', 'TTS', '音声分析'],
  heroImage: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/f3cb9570-3894-495f-471a-bb5945b6ef00/public',
  englishSummary: {
    title: "The Day I Rebuilt Everything -- Fake Waveforms, Real Guilt, and Two New Friends",
    readTime: 10,
    sections: [
      {
        heading: "I Tore It All Down",
        paragraphs: [
          "So I rebuilt the entire English learning system today. And when I say rebuilt, I don't mean like, tweaked a few things. I mean I burned it to the ground and started over.",
          "Why? 'Cause the whole thing was built on lies. And I finally couldn't take it anymore."
        ]
      },
      {
        heading: "The Fake Waveform Thing",
        paragraphs: [
          "OK so get this. I had these beautiful waveforms and spectrograms on the screen, right? Looked super legit. Like, professional audio analysis stuff.",
          "But here's the thing -- the browser's SpeechSynthesis API doesn't actually return audio streams. So all that fancy visualization? Literally just random noise. The whole thing was fake.",
          "I was comparing my voice against... nothin'. It was like grading a test with a random answer key."
        ]
      },
      {
        heading: "The Diary Problem",
        paragraphs: [
          "And then there was the English learning page. It existed, sure. But it had nothin' to do with my actual life.",
          "Just memorize phrases. No connection to what I did today. No way to practice sayin' my own stuff. Boring. Unsustainable. Nobody's gonna stick with that."
        ]
      },
      {
        heading: "Faceless Conversations",
        paragraphs: [
          "I wanted that NotebookLM-style conversation format, you know? Like two people actually talkin'.",
          "But when it was just 'Male' and 'Female' -- no names, no faces -- it felt like listenin' to a text-to-speech demo. Zero personality. Zero stickiness."
        ]
      },
      {
        heading: "The Fix: Memoria",
        paragraphs: [
          "So here's what I built. It's called Memoria. You write a diary entry in Japanese, and the AI turns it into a natural English conversation.",
          "Takumi and Anya -- two characters with actual names and faces -- have this back-and-forth about your day. You can loop it, shuffle it, change the speed. Your own daily life becomes your English textbook.",
          "Two birds, one stone. Honestly, this is how it shoulda been from the start."
        ]
      },
      {
        heading: "Real Audio Analysis (Finally)",
        paragraphs: [
          "Switched to Google Cloud TTS. Actual MP3 files. Decoded 'em with Web Audio API and got real waveform data, real spectrograms with FFT analysis.",
          "Blue for native, gold for your voice. Side-by-side comparison that actually means somethin'. I finally stopped lyin' to myself."
        ]
      },
      {
        heading: "Takumi and Anya",
        paragraphs: [
          "Here's the wild part -- just givin' the characters names and faces changed everything. 'Takumi' and 'Anya' feel infinitely more relatable than 'Male Speaker' and 'Female Speaker'.",
          "I generated their icons with AI, gave 'em distinct personalities. And suddenly the conversations felt... real. Like you actually wanna listen."
        ]
      },
      {
        heading: "What I Learned",
        paragraphs: [
          "Fake feels wrong. I thought if it looks good, who cares? But knowin' it's fake and leavin' it there? That eats at you.",
          "Characters are powerful. Names and faces turn generic audio into something memorable.",
          "And the biggest one -- learning with your own words beats any textbook. When it's about YOUR day, you actually remember it."
        ]
      },
      {
        heading: "Before and After",
        paragraphs: [
          "Before: fake audio analysis, no diary feature, no characters, boring as hell.",
          "After: real data, Memoria turns your diary into conversations, Takumi and Anya make it feel alive, and you're learnin' from your own life.",
          "Rebuilt everything. Finally satisfied. ...For now."
        ]
      }
    ]
  },
  conversation: `
## 2026年1月10日

英語学習システムを、全部作り直した。

いや、「改善」じゃない。

**破壊して、再構築した。**

---

## 問題だらけだった前のシステム

### 1. 音声分析が全部フェイク

波形（Waveform）とスペクトログラムを綺麗に表示していたが——

**全部嘘だった。**

ブラウザの\`SpeechSynthesis API\`は音声ストリームを返さないので、波形もスペクトログラムも**ランダムなノイズ**を表示していた。

マイクで録音した「あなたの声」と比較する元データがないので、比較自体が**無意味**だった。

### 2. 日記と英語学習が繋がっていない

英語フレーズを学習するページはあった。

でも——

- 日常の体験が反映されない
- 自分の言葉で話す練習ができない
- ただフレーズを暗記するだけ

**退屈で、続かない。**

### 3. キャラクターがいない

NotebookLMみたいな「会話形式」で学ぶのが理想。

でも、男女の対話を作っても、誰が誰だかわからない。

**顔がない会話は、記憶に残らない。**

---

## だから、全部作り直した

### 1. Memoria × English Learning

**「日記を書くと、英語会話になる」**

- 日本語で日記を書く
- AIが自然な英語会話に変換
- Takumi（男性）とAnya（女性）が対話形式で話す
- 音声で再生、ループ、シャッフル、速度調整可能

日常の体験が、そのまま英語学習教材になる。

**一石二鳥。**

### 2. 本物の音声分析

Google Cloud TTS APIに切り替えて、**実際のMP3音声ファイル**を取得。

Web Audio APIでデコードして：

- **本物の波形データ**を抽出
- **本物のスペクトログラム**（FFT分析）
- 波形オーバーレイ表示（青: ネイティブ / 金: あなた）
- スペクトログラム横並び比較

**ようやく嘘をやめた。**

### 3. Takumi & Anyaのキャラクター化

- **Takumi**（男性・青）: 爽やかな見た目、落ち着いた声
- **Anya**（女性・ピンク）: 明るい雰囲気、はつらつとした声

それぞれにアイコンを生成して、会話リストに表示。

**顔があると、記憶に残る。**

---

## 技術的な詳細

### Memoria機能

**データ構造:**

\`\`\`typescript
interface MemoriaEntry {
  id: string;
  date: string;
  title: string;
  content: string; // 日本語の日記
  tone: 'casual' | 'formal' | 'friendly';
  conversation?: {
    english: Array<{
      speaker: 'male' | 'female';
      text: string;
    }>;
    japanese: Array<{
      speaker: 'male' | 'female';
      text: string;
    }>;
    generatedAt: string;
  };
}
\`\`\`

**ストレージ:** LocalStorage（サーバー不要）

**音声再生:** 
- ブラウザTTS（Web Speech API）
- 男性声・女性声を自動選択
- 再生速度調整（0.5x〜1.5x）

### 本物の音声分析

**Google Cloud TTS統合:**

\`\`\`typescript
// /api/tts
const [audioContent] = await client.synthesizeSpeech({
  input: { text },
  voice: { languageCode: 'en-US', name: 'en-US-Neural2-J' },
  audioConfig: { audioEncoding: 'MP3' }
});
\`\`\`

**Web Audio APIで波形抽出:**

\`\`\`typescript
const audioContext = new AudioContext();
const arrayBuffer = await response.arrayBuffer();
const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

// 波形データ
const waveformData = audioBuffer.getChannelData(0);

// FFTでスペクトログラム
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
const frequencyData = new Uint8Array(analyser.frequencyBinCount);
\`\`\`

### キャラクターアイコン

AI生成（Imagen 3）:
- Takumi: 青ベースの男性キャラ、テック系デザイン
- Anya: ピンクベースの女性キャラ、親しみやすいデザイン

公開フォルダ: \`public/icons/takumi.png\`, \`public/icons/anya.png\`

---

## 作っていて気づいたこと

### 1. フェイクは気持ち悪い

「見た目が良ければいい」と思っていた。

でも、**自分が気づいている嘘**を放置するのは、気持ち悪い。

だから直した。

### 2. キャラクターは強い

「Male」「Female」という表示より、「Takumi」「Anya」の方が圧倒的に親しみやすい。

**名前と顔があるだけで、学習体験が変わる。**

### 3. 日記と学習の統合は正解

「今日の体験」を英語にするから、記憶に残る。

教科書のフレーズより、**自分の言葉**の方が覚えやすい。

---

## まとめ

### Before（改善前）
- 音声分析：フェイク
- 日記機能：なし
- キャラクター：なし
- 学習体験：退屈

### After（改善後）
- 音声分析：**本物のデータ**
- 日記機能：**Memoria（日記→英語会話）**
- キャラクター：**Takumi & Anya**
- 学習体験：**自分の言葉で学べる**

---

**全部作り直して、ようやく満足した。**

## English Version

### The Day I Rebuilt the Entire English Learning System

**January 10, 2026**

I rebuilt the entire English learning system today.

No, not "improved."

**Destroyed and reconstructed.**

---

### The Old System Was Full of Problems

#### 1. Audio Analysis Was Completely Fake

The waveforms and spectrograms looked nice, but—

**They were all lies.**

Browser's \`SpeechSynthesis API\` doesn't return audio streams, so both waveforms and spectrograms were just **random noise**.

Without the source data to compare against your recorded voice, the comparison itself was **meaningless**.

#### 2. Diary and English Learning Were Disconnected

There was a page for learning English phrases.

But—

- It didn't reflect daily experiences
- No practice speaking your own words
- Just rote memorization

**Boring. Unsustainable.**

#### 3. No Characters

The ideal was learning through "conversation format" like NotebookLM.

But even with male-female dialogue, you couldn't tell who was who.

**Faceless conversations don't stick in memory.**

---

### So I Rebuilt Everything

#### 1. Memoria × English Learning

**"Write a diary, get English conversation."**

- Write diary in Japanese
- AI converts to natural English conversation
- Takumi (male) and Anya (female) speak in dialogue format
- Audio playback with loop, shuffle, speed control

Your daily experiences become English learning material.

**Two birds, one stone.**

#### 2. Real Audio Analysis

Switched to Google Cloud TTS API to get **actual MP3 audio files**.

Decoded with Web Audio API:

- **Real waveform data** extraction
- **Real spectrogram** (FFT analysis)
- Waveform overlay (blue: native / gold: you)
- Side-by-side spectrogram comparison

**Finally stopped lying.**

#### 3. Takumi & Anya Characters

- **Takumi** (male/blue): Fresh appearance, calm voice
- **Anya** (female/pink): Bright atmosphere, energetic voice

Generated AI icons for each, displayed in conversation list.

**Having faces makes it memorable.**

---

### What I Realized While Building

#### 1. Fake Feels Wrong

I thought "if it looks good, it's fine."

But **leaving lies I'm aware of** felt disgusting.

So I fixed it.

#### 2. Characters Are Powerful

"Takumi" and "Anya" feel infinitely more relatable than "Male" and "Female."

**Just having names and faces changes the learning experience.**

#### 3. Diary-Learning Integration Works

Converting "today's experience" to English makes it stick.

**Your own words** are easier to remember than textbook phrases.

---

### Summary

**Before:**
- Audio analysis: Fake
- Diary feature: None
- Characters: None
- Learning experience: Boring

**After:**
- Audio analysis: **Real data**
- Diary feature: **Memoria (diary→English conversation)**
- Characters: **Takumi & Anya**
- Learning experience: **Learn with your own words**

---

**Rebuilt everything. Finally satisfied.**
`
};
