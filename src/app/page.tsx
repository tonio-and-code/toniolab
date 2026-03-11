export default function Home() {
  const appUrl = 'https://english-quest-rpg.vercel.app/english/training'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E7E5E4',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#1C1917', letterSpacing: '-0.5px' }}>
            tonio<span style={{ color: '#D4AF37' }}>lab</span>
          </span>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="#features" style={{ fontSize: '13px', color: '#78716C', textDecoration: 'none', fontWeight: '500' }}>
              Features
            </a>
            <a href="#preview" style={{ fontSize: '13px', color: '#78716C', textDecoration: 'none', fontWeight: '500' }}>
              Preview
            </a>
            <a href="#devlog" style={{ fontSize: '13px', color: '#78716C', textDecoration: 'none', fontWeight: '500' }}>
              Dev Log
            </a>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: '#D4AF37',
                padding: '6px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                letterSpacing: '0.3px',
              }}
            >
              Launch App
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '140px 24px 80px',
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#D4AF37',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          ENGLISH QUEST RPG
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          color: '#1C1917',
          lineHeight: '1.2',
          letterSpacing: '-1.5px',
          maxWidth: '700px',
        }}>
          英語を「勉強」するな。<br />
          冒険しろ。
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#78716C',
          marginTop: '20px',
          lineHeight: '1.7',
          maxWidth: '560px',
        }}>
          教科書のきれいな英語じゃない。ネイティブが本当に使う um, like, you know だらけの英語を、RPGのクエストとして攻略する。
        </p>
        <p style={{
          fontSize: '15px',
          color: '#A8A29E',
          marginTop: '12px',
          lineHeight: '1.7',
          maxWidth: '540px',
        }}>
          1,000フレーズ。7つのシナリオ。310個の俺語録。<br />
          全部、ポッドキャストの書き起こしから作った。
        </p>
        <div style={{ marginTop: '36px' }}>
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '14px 32px',
              backgroundColor: '#D4AF37',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              textDecoration: 'none',
              letterSpacing: '0.5px',
            }}
          >
            Start Quest
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        borderTop: '1px solid #E7E5E4',
        borderBottom: '1px solid #E7E5E4',
        backgroundColor: '#fff',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '48px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
        }}>
          {[
            { number: '1,000', unit: '', label: 'Quest Phrases', sub: '10 stages' },
            { number: '7', unit: '', label: 'Memoria Scenarios', sub: '35 days of conversations' },
            { number: '310', unit: '', label: 'Goroku Expressions', sub: 'daily calendar' },
            { number: '134', unit: '+', label: 'Journal Entries', sub: 'research log' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#1C1917', letterSpacing: '-2px', lineHeight: '1' }}>
                {item.number}
                <span style={{ fontSize: '18px', color: '#D4AF37', fontWeight: '600', marginLeft: '2px' }}>
                  {item.unit}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#44403C', marginTop: '8px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '11px', color: '#A8A29E', marginTop: '4px' }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* App Preview */}
      <section id="preview" style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '80px 24px',
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#D4AF37',
          letterSpacing: '2px',
          marginBottom: '12px',
        }}>
          APP PREVIEW
        </div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1C1917',
          letterSpacing: '-0.8px',
          marginBottom: '16px',
        }}>
          実際の画面
        </h2>
        <p style={{ fontSize: '15px', color: '#78716C', lineHeight: '1.7', marginBottom: '32px', maxWidth: '600px' }}>
          ブラウザで動く。インストール不要。スマホでもPCでも。
        </p>
        <div style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #E7E5E4',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          backgroundColor: '#0a0a0a',
        }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#1C1917',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid #292524',
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
            </div>
            <div style={{
              flex: 1,
              backgroundColor: '#292524',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              color: '#78716C',
              fontFamily: 'var(--font-geist-mono), monospace',
              textAlign: 'center',
            }}>
              english-quest-rpg.vercel.app/english/training
            </div>
          </div>
          <iframe
            src={appUrl}
            style={{
              width: '100%',
              height: '600px',
              border: 'none',
              display: 'block',
            }}
            title="English Quest RPG"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #E7E5E4',
        borderBottom: '1px solid #E7E5E4',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '80px 24px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#D4AF37',
            letterSpacing: '2px',
            marginBottom: '12px',
          }}>
            FEATURES
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1C1917',
            letterSpacing: '-0.8px',
            marginBottom: '16px',
          }}>
            6つの武器
          </h2>
          <p style={{ fontSize: '15px', color: '#78716C', lineHeight: '1.7', marginBottom: '40px', maxWidth: '600px' }}>
            ネイティブの英語を半年分析して作った学習システム。教科書じゃ絶対に教えない「本物の喋り方」を攻略する。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                name: 'Quest Mode',
                tag: 'CORE',
                tagColor: '#D4AF37',
                desc: '10ステージ x 100フレーズ。各ステージに1つの「英語の裏技」。カードランク制（NORMAL → LEGENDARY）で育てる。',
              },
              {
                name: 'Memoria',
                tag: 'LISTENING',
                tagColor: '#0284C7',
                desc: '5日間のシナリオ会話。umが入る。文が途中で方向転換する。教科書にない本物のリズムで聴く。',
              },
              {
                name: 'Word Review',
                tag: 'PRACTICE',
                tagColor: '#16A34A',
                desc: '1シナリオ50語 x 5日間。キャラクターが会話の中で使う。g-droppingも足場も全部入り。',
              },
              {
                name: 'Goroku',
                tag: 'EXPRESSION',
                tagColor: '#9333EA',
                desc: '310個の俺語録。月間カレンダーで管理。「教科書では絶対出てこない言い方」だけを集めた。',
              },
              {
                name: 'Pro',
                tag: 'DEEP DIVE',
                tagColor: '#DC2626',
                desc: '1つの表現を深掘り。3段落の英語 + 3段落の日本語解説。居酒屋の友達が教えてくれる感覚で。',
              },
              {
                name: 'Training',
                tag: 'DAILY',
                tagColor: '#EA580C',
                desc: 'カード練習セッション。コンボシステムとXP。毎日の習慣を「続けたくなる仕掛け」で。',
              },
            ].map((item, i) => (
              <div key={i} style={{
                border: '1px solid #E7E5E4',
                borderRadius: '12px',
                padding: '28px',
                backgroundColor: '#FAFAF9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: item.tagColor,
                  letterSpacing: '1.5px',
                  marginBottom: '10px',
                }}>
                  {item.tag}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1C1917', marginBottom: '12px' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#78716C', lineHeight: '1.8' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '80px 24px',
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#D4AF37',
          letterSpacing: '2px',
          marginBottom: '12px',
        }}>
          HOW IT WORKS
        </div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1C1917',
          letterSpacing: '-0.8px',
          marginBottom: '40px',
        }}>
          なぜ「教科書の英語」じゃダメなのか
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            {
              step: '01',
              title: '英語の7割はゴミ',
              body: 'ネイティブの発話を書き起こすと、意味のある単語は3割だけ。残りは um, you know, I mean。教科書はこの7割を完全に無視してる。だから聞き取れない。',
            },
            {
              step: '02',
              title: '下手な方が伝わる',
              body: '非ネイティブの英語はネイティブより聞き取りやすい。語彙が少ないから短い文、繰り返し、方向転換なし。弱点が武器になってる。これがロハスモデル。',
            },
            {
              step: '03',
              title: '脳は毎秒39ビット',
              body: '17言語を測定した研究結果。全部同じ転送速度。日本語が速く聞こえるのは1音節が軽いだけ。英語は重い弾を少なく撃つ。人類は平等に遅い。',
            },
          ].map((item, i) => (
            <div key={i}>
              <div style={{
                fontSize: '48px',
                fontWeight: '800',
                color: '#E7E5E4',
                lineHeight: '1',
                marginBottom: '16px',
                fontFamily: 'var(--font-geist-mono), monospace',
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1C1917', marginBottom: '12px', lineHeight: '1.5' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#78716C', lineHeight: '1.8' }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quest Stages */}
      <section style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #E7E5E4',
        borderBottom: '1px solid #E7E5E4',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '80px 24px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#D4AF37',
            letterSpacing: '2px',
            marginBottom: '12px',
          }}>
            10 STAGES
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1C1917',
            letterSpacing: '-0.8px',
            marginBottom: '16px',
          }}>
            Quest Mode -- 10個の裏技
          </h2>
          <p style={{ fontSize: '15px', color: '#78716C', lineHeight: '1.7', marginBottom: '40px', maxWidth: '600px' }}>
            各ステージで1つの「英語の構造的な秘密」をアンロック。100フレーズを繰り返してカードを育てる。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { stage: '01', hack: '英語は意見と感情の表明', example: 'Nice to meet you = I\'m happy to meet you' },
              { stage: '02', hack: 'GETで英語の半分を表現できる', example: 'get angry, get there, get it, get ready' },
              { stage: '03', hack: 'HAVEは経験と状態', example: 'have a good time, have been, have to' },
              { stage: '04', hack: 'DO vs MAKE の違い', example: 'do damage (行為) vs make a mess (変化を生む)' },
              { stage: '05', hack: 'PUT / TAKE で移動・時間・感情', example: 'put up with, take it easy, put off' },
              { stage: '06', hack: 'GO / COME は聞き手基準', example: 'I\'m coming! (日本語と逆)' },
              { stage: '07', hack: 'フィラーは会話のエンジン', example: 'well, like, I mean, you know' },
              { stage: '08', hack: '質問で会話をコントロール', example: 'How come? What do you mean? Really?' },
              { stage: '09', hack: '3語で感情を表現', example: 'That\'s messed up. I\'m fed up.' },
              { stage: '10', hack: '実戦シナリオ', example: '全部を組み合わせた実践会話' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#FAFAF9',
                border: '1px solid #E7E5E4',
                borderRadius: '10px',
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#D4AF37',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  flexShrink: 0,
                  marginTop: '2px',
                  width: '28px',
                }}>
                  {item.stage}
                </span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1C1917', lineHeight: '1.4' }}>
                    {item.hack}
                  </div>
                  <div style={{ fontSize: '13px', color: '#A8A29E', marginTop: '4px', fontFamily: 'var(--font-geist-mono), monospace' }}>
                    {item.example}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memoria Scenarios */}
      <section style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '80px 24px',
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#0284C7',
          letterSpacing: '2px',
          marginBottom: '12px',
        }}>
          MEMORIA
        </div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1C1917',
          letterSpacing: '-0.8px',
          marginBottom: '16px',
        }}>
          会話シナリオ
        </h2>
        <p style={{ fontSize: '15px', color: '#78716C', lineHeight: '1.7', marginBottom: '40px', maxWidth: '600px' }}>
          リアルな会話を5日間に分けて聴く。キャラクターが um を挟み、文が途中で曲がり、g-dropping する。教科書では永遠に出会えない「本物の英語」。
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { title: 'College Party Recap', chars: '10 characters', days: 'Day 1-5', color: '#D4AF37' },
            { title: 'Monster Under the Bed', chars: '8 characters', days: 'Day 6-10', color: '#16A34A' },
            { title: 'Mariners Trade Talk', chars: '2 characters', days: 'Day 11-15', color: '#DC2626' },
            { title: 'First Movie Without Parents', chars: '8 characters', days: 'Day 16-20', color: '#9333EA' },
            { title: 'Game Night Gone Wrong', chars: '6 characters', days: 'Day 21-25', color: '#EA580C' },
            { title: 'Antiques House Call', chars: '6 characters', days: 'Day 26-30', color: '#0284C7' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '24px',
              border: '1px solid #E7E5E4',
              borderRadius: '10px',
              borderLeft: `3px solid ${item.color}`,
              backgroundColor: '#fff',
            }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#A8A29E', letterSpacing: '1px', marginBottom: '8px' }}>
                {item.days}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1C1917', marginBottom: '6px', lineHeight: '1.4' }}>
                {item.title}
              </h3>
              <div style={{ fontSize: '12px', color: '#78716C' }}>
                {item.chars}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dev Log */}
      <section id="devlog" style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #E7E5E4',
        borderBottom: '1px solid #E7E5E4',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '80px 24px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#D4AF37',
            letterSpacing: '2px',
            marginBottom: '12px',
          }}>
            DEV LOG
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1C1917',
            letterSpacing: '-0.8px',
            marginBottom: '16px',
          }}>
            開発記録
          </h2>
          <p style={{ fontSize: '15px', color: '#78716C', lineHeight: '1.7', marginBottom: '40px', maxWidth: '600px' }}>
            TOEIC 900点、でも喋れない男がバイブコーディングで英語アプリを作る日々の記録。AIとの会話ログ、設計判断、失敗と発見。
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                date: '2026.03.10',
                title: '岩﨑内装の残骸を全部引き剥がした',
                body: 'english-quest-rpgから内装会社のページ・コンポーネント・データを全削除。50以上のルート、40以上のコンポーネント、メタデータ全書き替え。ようやく純粋な英語アプリになった。',
              },
              {
                date: '2026.03.10',
                title: 'toniolab.comをアプリ紹介サイトに全面改装',
                body: '研究ブログだったtoniolabを、English Quest RPGの公式紹介サイトとして再構築。Features、App Preview、Quest Stages、Memoria Scenariosの紹介ページに。',
              },
              {
                date: '2026.03.10',
                title: 'Quest Modeをサイドバーに追加',
                body: '10ステージ x 100フレーズのクエストモードがサイドバーから直接アクセス可能に。トレーニングのすぐ下に配置。',
              },
            ].map((entry, i) => (
              <div key={i} style={{
                padding: '24px',
                backgroundColor: '#FAFAF9',
                border: '1px solid #E7E5E4',
                borderRadius: '10px',
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#D4AF37',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  marginBottom: '8px',
                }}>
                  {entry.date}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1C1917', marginBottom: '8px', lineHeight: '1.5' }}>
                  {entry.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#78716C', lineHeight: '1.8' }}>
                  {entry.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        backgroundColor: '#1C1917',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '80px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#D4AF37',
            letterSpacing: '2px',
            marginBottom: '16px',
          }}>
            START YOUR QUEST
          </div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#fff',
            letterSpacing: '-1px',
            marginBottom: '16px',
          }}>
            教科書を捨てろ。冒険を始めろ。
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#78716C',
            lineHeight: '1.7',
            maxWidth: '480px',
            margin: '0 auto 36px',
          }}>
            無料。アカウント不要。ブラウザで動く。
          </p>
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '14px 36px',
              backgroundColor: '#D4AF37',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              textDecoration: 'none',
              letterSpacing: '0.5px',
            }}
          >
            Launch App
          </a>
        </div>
      </section>

      {/* About + Footer */}
      <section style={{
        borderTop: '1px solid #44403C',
        backgroundColor: '#1C1917',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '48px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>とにお</span>
            <span style={{ fontSize: '13px', color: '#78716C', marginLeft: '12px' }}>
              TOEIC 900点。でも喋れない。バイブコーディングで毎日実験中。
            </span>
          </div>
          <a
            href="https://note.com/tonio_english"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 16px',
              backgroundColor: '#D4AF37',
              color: '#fff',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            note.com
          </a>
        </div>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '16px 24px',
          borderTop: '1px solid #292524',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', color: '#44403C' }}>toniolab.com</span>
          <span style={{ fontSize: '11px', color: '#44403C' }}>Built with vibe coding</span>
        </div>
      </section>
    </div>
  );
}
