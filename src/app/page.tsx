export default function Home() {
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
            <a href="#articles" style={{ fontSize: '13px', color: '#78716C', textDecoration: 'none', fontWeight: '500' }}>
              Articles
            </a>
            <a href="#system" style={{ fontSize: '13px', color: '#78716C', textDecoration: 'none', fontWeight: '500' }}>
              System
            </a>
            <a
              href="https://github.com/tonio-and-code"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: '#1C1917',
                padding: '6px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                letterSpacing: '0.3px',
              }}
            >
              GitHub
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
          ENGLISH + VIBE CODING
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          color: '#1C1917',
          lineHeight: '1.2',
          letterSpacing: '-1.5px',
          maxWidth: '700px',
        }}>
          ネイティブ英語を<br />
          構造分析して<br />
          学習システムを作った。
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#78716C',
          marginTop: '20px',
          lineHeight: '1.7',
          maxWidth: '540px',
        }}>
          まだ喋れない。
        </p>
        <p style={{
          fontSize: '16px',
          color: '#A8A29E',
          marginTop: '8px',
          lineHeight: '1.7',
          maxWidth: '540px',
        }}>
          半年間ポッドキャストを書き起こして um を数えた結果、<br />
          英語学習システムを自作した男の記録。全部公開してる。
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '36px' }}>
          <a
            href="https://note.com/tonio_english"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '12px 28px',
              backgroundColor: '#D4AF37',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            note.com で読む
          </a>
          <a
            href="https://github.com/tonio-and-code"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '12px 28px',
              backgroundColor: '#fff',
              color: '#1C1917',
              border: '1px solid #E7E5E4',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Key numbers */}
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
            { number: '39', unit: 'bps', label: '人類の情報転送速度', sub: '17言語で同じ' },
            { number: '70', unit: '%', label: '発話のムダ', sub: 'um, you know, like...' },
            { number: '23', unit: 'sec', label: '2行の情報を伝える時間', sub: 'Mark Prior実測値' },
            { number: '6', unit: '', label: '記事', sub: 'note.comで連載中' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', fontWeight: '800', color: '#1C1917', letterSpacing: '-2px', lineHeight: '1' }}>
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

      {/* What I found */}
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
          FINDINGS
        </div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1C1917',
          letterSpacing: '-0.8px',
          marginBottom: '40px',
        }}>
          半年分析してわかったこと
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            {
              title: '英語の7割は聞き流していい',
              body: 'ネイティブの発話を書き起こした。意味のある単語は3割。残り7割は um, you know, I mean。何の情報も運んでない足場。でも教科書はこれを一切教えない。',
            },
            {
              title: '非ネイティブの方が明確',
              body: 'ドジャースのロハスの英語はネイティブより聞き取りやすい。語彙が少ないから短い文、同じ足場の繰り返し、方向転換なし。弱点が強みになってる。',
            },
            {
              title: '脳は毎秒39ビットのモデム',
              body: '17言語を測定した研究。結論：全部同じ速度。日本語が速く聞こえるのは1音節が軽いから。英語は重い弾を少なく撃つ。着弾量は同じ。人類は平等に遅い。',
            },
          ].map((card, i) => (
            <div key={i} style={{
              backgroundColor: '#fff',
              border: '1px solid #E7E5E4',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1C1917', marginBottom: '12px', lineHeight: '1.5' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#78716C', lineHeight: '1.8' }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* System */}
      <section id="system" style={{
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
            SYSTEM
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1C1917',
            letterSpacing: '-0.8px',
            marginBottom: '16px',
          }}>
            作ったもの
          </h2>
          <p style={{ fontSize: '15px', color: '#78716C', lineHeight: '1.7', marginBottom: '40px', maxWidth: '600px' }}>
            分析結果をもとに3つの学習システムを作った。教科書の正しい英語じゃなくて、本物のネイティブの喋り方で。全部オープンソース。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                name: 'Word Review',
                desc: '50語で1つのシナリオ。キャラクターが会話の中で単語を使う。足場もg-droppingも方向転換も全部入り。',
                tag: '復習',
              },
              {
                name: 'Memoria',
                desc: '会話リスニング。umが入る。文が途中で方向転換する。正しくない英語で作ってある。本物のリズムで聞く訓練。',
                tag: 'リスニング',
              },
              {
                name: 'Expressions',
                desc: '会話から抜き出した75個の表現。元の文脈へのリンク付き。会話で出会って、ここで整理して、復習で定着。',
                tag: '表現集',
              },
            ].map((item, i) => (
              <div key={i} style={{
                border: '1px solid #E7E5E4',
                borderRadius: '12px',
                padding: '28px',
                backgroundColor: '#FAFAF9',
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#D4AF37',
                  letterSpacing: '1px',
                  marginBottom: '8px',
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

      {/* Articles */}
      <section id="articles" style={{
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
          ARTICLES ON NOTE.COM
        </div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1C1917',
          letterSpacing: '-0.8px',
          marginBottom: '40px',
        }}>
          note.com の記事
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            {
              num: '01',
              title: 'ネイティブの英語を構造分析したら学習システムができた',
              desc: 'はじめまして。英語について毎日書いていきます。',
              url: 'https://note.com/tonio_english/n/n2fe3ab9595bf',
              published: true,
            },
            {
              num: '02',
              title: 'ネイティブは23秒かけて2行分の情報を喋る',
              desc: '他人のumを3時間数えた話',
              url: null,
              published: false,
            },
            {
              num: '03',
              title: 'どの言語で喋っても脳は毎秒39ビットしか送れない',
              desc: '17言語調べた科学者の結論 -- 人類は平等に遅い',
              url: null,
              published: false,
            },
            {
              num: '04',
              title: '非ネイティブの英語はネイティブより明確',
              desc: '英語が下手な方が伝わるという逆説',
              url: null,
              published: false,
            },
            {
              num: '05',
              title: '営業ができないから全部公開する',
              desc: 'コードも思想も間違いも',
              url: null,
              published: false,
            },
            {
              num: '06',
              title: '英語学習システムを作った男、まだ喋れない',
              desc: 'これから頑張ります',
              url: null,
              published: false,
            },
          ].map((article) => (
            <div key={article.num} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              padding: '20px 24px',
              backgroundColor: '#fff',
              border: '1px solid #E7E5E4',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#D4AF37',
                fontFamily: 'var(--font-geist-mono), monospace',
                flexShrink: 0,
                marginTop: '2px',
              }}>
                {article.num}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1C1917', lineHeight: '1.5' }}>
                    {article.title}
                  </h3>
                  {article.published && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: '600',
                      color: '#166534',
                      backgroundColor: '#dcfce7',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      letterSpacing: '0.5px',
                      flexShrink: 0,
                    }}>
                      PUBLIC
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: '#A8A29E', marginTop: '4px' }}>
                  {article.desc}
                </p>
              </div>
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#78716C',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    border: '1px solid #E7E5E4',
                    borderRadius: '6px',
                    flexShrink: 0,
                  }}
                >
                  Read
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section style={{
        backgroundColor: '#1C1917',
        color: '#fff',
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
            ABOUT
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            letterSpacing: '-0.8px',
            marginBottom: '20px',
          }}>
            とにお
          </h2>
          <p style={{ fontSize: '15px', color: '#A8A29E', lineHeight: '1.8', maxWidth: '600px' }}>
            バイブコーディング歴6ヶ月。英語システムは2026年から。ネイティブの英語を構造分析して、それをもとに学習システムを作ってる。自分でも実験中。正しいかはわからない。面白いとは思ってる。
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <a
              href="https://note.com/tonio_english"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 24px',
                backgroundColor: '#D4AF37',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              note.com
            </a>
            <a
              href="https://github.com/tonio-and-code"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 24px',
                backgroundColor: 'transparent',
                color: '#A8A29E',
                border: '1px solid #44403C',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #E7E5E4',
        backgroundColor: '#fff',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '12px', color: '#A8A29E' }}>
            toniolab.com
          </span>
          <span style={{ fontSize: '12px', color: '#A8A29E' }}>
            Built with vibe coding
          </span>
        </div>
      </footer>
    </div>
  );
}
