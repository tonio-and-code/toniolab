'use client';

import { useState } from 'react';
import Link from 'next/link';

const GOLD = '#D4AF37';
const EMERALD = '#10B981';
const STONE_50 = '#FAFAF9';
const STONE_100 = '#F5F5F4';
const STONE_200 = '#E7E5E4';
const STONE_700 = '#44403C';
const STONE_800 = '#292524';
const STONE_900 = '#1C1917';

interface Feature {
  title: string;
  description: string;
  href: string;
  accent: string;
}

const FEATURES: Feature[] = [
  {
    title: 'Requiem (単語レビュー)',
    description: '毎日10語。映画のシナリオで覚える',
    href: '/english/requiem',
    accent: GOLD,
  },
  {
    title: 'Memoria (会話リスニング)',
    description: 'ネイティブの日常会話を聞く。5日完結',
    href: '/memoria',
    accent: EMERALD,
  },
  {
    title: '俺語録',
    description: '日常表現を毎日10個。カレンダーで管理',
    href: '/english/goroku',
    accent: GOLD,
  },
  {
    title: 'Expression Harvest',
    description: '映画の台本からAIが自動収穫',
    href: '/english/harvest',
    accent: EMERALD,
  },
  {
    title: 'Expressions',
    description: 'シナリオ別75表現。使い方付き',
    href: '/english/expressions',
    accent: GOLD,
  },
  {
    title: 'Training',
    description: '覚えた表現をトレーニング',
    href: '/english/training',
    accent: EMERALD,
  },
  {
    title: 'note記事',
    description: '英語学習の過程を全部書いてる',
    href: '/english/note',
    accent: GOLD,
  },
  {
    title: 'Phrases Chakra Guide',
    description: '学習ガイド。全体の地図',
    href: '/phrases-chakra/guide',
    accent: EMERALD,
  },
];

const STATS = [
  { value: '2,000+', label: 'フレーズ' },
  { value: '310', label: '語録' },
  { value: '55+', label: 'Memoria' },
  { value: '215', label: '映画' },
  { value: '60+', label: 'note記事' },
];

export default function MembershipPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: STONE_50 }}>
      {/* Header */}
      <header style={{
        paddingTop: '80px',
        paddingBottom: '48px',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderBottom: `1px solid ${STONE_200}`,
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '3px',
            textTransform: 'uppercase' as const,
            color: GOLD,
            marginBottom: '16px',
          }}>
            MEMBERSHIP
          </p>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: STONE_900,
            marginBottom: '12px',
            lineHeight: '1.3',
          }}>
            900点の嘘つきクラブ
          </h1>
          <p style={{
            fontSize: '16px',
            color: STONE_700,
            lineHeight: '1.6',
          }}>
            傍聴席プラン -- 月額100円
          </p>
        </div>
      </header>

      {/* Feature Grid */}
      <section style={{
        maxWidth: '880px',
        margin: '0 auto',
        padding: '48px 24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {FEATURES.map((feature, i) => (
            <Link
              key={feature.href}
              href={feature.href}
              style={{ textDecoration: 'none' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: `1px solid ${hoveredIndex === i ? GOLD : STONE_200}`,
                padding: '24px',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease',
                cursor: 'pointer',
              }}>
                <div>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: feature.accent,
                    marginBottom: '14px',
                  }} />
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: STONE_900,
                    marginBottom: '8px',
                    lineHeight: '1.4',
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: STONE_700,
                    lineHeight: '1.5',
                    margin: 0,
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{
        backgroundColor: '#fff',
        borderTop: `1px solid ${STONE_200}`,
        borderBottom: `1px solid ${STONE_200}`,
      }}>
        <div style={{
          maxWidth: '880px',
          margin: '0 auto',
          padding: '36px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '32px',
        }}>
          {STATS.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center', minWidth: '100px' }}>
              <p style={{
                fontSize: '24px',
                fontWeight: '700',
                color: STONE_900,
                margin: '0 0 4px 0',
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '12px',
                color: STONE_700,
                margin: 0,
                fontWeight: '500',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Message */}
      <section style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '56px 24px 80px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: STONE_900,
          marginBottom: '20px',
        }}>
          傍聴席のみなさんへ
        </h2>
        <div style={{
          fontSize: '14px',
          color: STONE_700,
          lineHeight: '2',
          textAlign: 'left',
        }}>
          <p style={{ margin: '0 0 16px 0' }}>
            TOEIC 900点あるのに喋れない男が、毎日アプリ作りながら英語の練習してます。
          </p>
          <p style={{ margin: '0 0 16px 0' }}>
            正直、教える立場じゃないです。自分の学習記録を全部公開してるだけ。
            単語帳も、リスニング教材も、語録も、全部「自分が使いたいから」作ったもの。
            それがたまたま他の人にも使えるかもしれない、というだけの話。
          </p>
          <p style={{ margin: '0 0 16px 0' }}>
            月額100円。缶コーヒー1本分。
            それで「こいつ今日も何か作ってんな」って傍聴してもらえたら、それで十分です。
          </p>
          <p style={{
            margin: 0,
            color: STONE_800,
            fontWeight: '500',
          }}>
            -- とにお
          </p>
        </div>
      </section>
    </div>
  );
}
