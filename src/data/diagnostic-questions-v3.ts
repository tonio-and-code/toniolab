// Ver.3.0: 性格×価値観診断 - 10の質問データ

export const diagnosticQuestionsV3 = [
  {
    id: 1,
    dimension: '性格軸：革新 vs 安定',
    psychologyType: 'innovation',
    question: '率直にお伺いします。\n\n内装を選ぶとき、『長年支持されている定番デザイン』に安心感を感じますか？\n\nそれとも『まだ一般的ではない、新しいスタイル』にワクワクしますか？\n\nもちろんA/Bでお答えいただいても結構ですが、ご自身のお考えを自由にお聞かせいただけると、より精度の高いご提案ができます。',
    freeTextPrompt: 'よろしければ、詳しくお聞かせください',
    optionA: {
      label: '定番の安心デザイン',
      description: '長年支持されている定番デザインに安心感を感じる',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80'
    },
    optionB: {
      label: '新しい実験的デザイン',
      description: '新しい実験的なスタイルにワクワクする',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 2,
    dimension: '性格軸：内向 vs 外向',
    psychologyType: 'introvert_extrovert',
    question: '空間の使い方について、お伺いしたいんです。\n\nご自宅は、ご自身やご家族が『深くリラックスできる場所』として考えていますか？\n\nそれとも、お客様を招いて『交流が生まれる場所』として考えていますか？\n\nこれによって、空間設計の方向性が大きく変わってきます。',
    freeTextPrompt: '実際のご利用シーンをお聞かせください',
    optionA: {
      label: '静かに過ごすシェルター空間',
      description: 'ご自身やご家族が深くリラックスできる場所',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80'
    },
    optionB: {
      label: '交流が生まれるステージ空間',
      description: 'お客様を招いて交流が生まれる場所',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 3,
    dimension: '性格軸：論理 vs 直感',
    psychologyType: 'logical_intuitive',
    question: '選び方のスタイルについて、教えてください。\n\n内装を選ぶとき、『耐久性、メンテナンス性、コストパフォーマンス』といったスペックをしっかり比較検討されたいタイプですか？\n\nそれとも、『パッと見て、直感的にピンとくるかどうか』を重視されるタイプですか？\n\nこれによって、資料の作り方が変わってきます。',
    freeTextPrompt: '普段の選び方をお聞かせください',
    optionA: {
      label: 'スペックで論理的に判断',
      description: '数値やスペックをしっかり比較検討したい',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80'
    },
    optionB: {
      label: '直感でピンとくる方',
      description: 'パッと見て直感的に「これだ」と感じたい',
      image: 'https://images.unsplash.com/photo-1615875474908-f403116f5301?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 4,
    dimension: '性格軸：結果 vs プロセス',
    psychologyType: 'result_process',
    question: '施工に対するお考えを、お聞かせください。\n\n『完成した空間が素晴らしければ、過程は専門家に任せたい』とお考えですか？\n\nそれとも、『どんな素材を使い、どんな職人が、どう作るのか』というストーリーも大切にされたいですか？\n\nご要望に合わせて、情報の出し方を調整します。',
    freeTextPrompt: '施工への関わり方について、お聞かせください',
    optionA: {
      label: '完成度重視',
      description: '完成した空間が素晴らしければ、過程は専門家に任せる',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
    },
    optionB: {
      label: 'ストーリー重視',
      description: '素材や職人の物語も大切にしたい',
      image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 5,
    dimension: '価値観軸：増減',
    psychologyType: 'minimal_maximal',
    question: '空間の密度について、お伺いします。\n\n『必要最小限のモノを厳選し、余白の美しさを楽しむ空間』が心地よいですか？\n\nそれとも、『お気に入りのモノや思い出の品に囲まれた、豊かな空間』が心地よいですか？\n\nどちらも素晴らしい考え方ですので、率直にお聞かせください。',
    freeTextPrompt: '理想の空間イメージをお聞かせください',
    optionA: {
      label: 'ミニマルな空間',
      description: '余白の美しさを楽しむミニマルな空間',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80'
    },
    optionB: {
      label: 'マキシマルな空間',
      description: '好きなモノに囲まれた豊かな空間',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 6,
    dimension: '価値観軸：五感',
    psychologyType: 'visual_tactile',
    question: '五感の優先順位について、教えてください。\n\n空間全体の『視覚的な美しさ、デザインの統一感』を最優先されますか？\n\nそれとも、素足で触れる床や、手が触れる壁の『触覚的な質感、素材感』を最優先されますか？\n\nどちらを重視されるかで、素材選びが変わってきます。',
    freeTextPrompt: '空間で大切にしたいことをお聞かせください',
    optionA: {
      label: '視覚的な美しさ',
      description: '視覚的な美しさ・デザインの調和を最優先',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80'
    },
    optionB: {
      label: '触覚的な質感',
      description: '触覚的な質感・素材の心地よさを最優先',
      image: 'https://images.unsplash.com/photo-1615875474908-f403116f5301?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 7,
    dimension: '性格軸：予防 vs 対応',
    psychologyType: 'prevention_recovery',
    question: 'メンテナンスに対するお考えを、お伺いします。\n\n『傷や汚れを未然に防ぐ、高耐久な素材』を重視されますか？\n\nそれとも、『問題が起きたときに、修復や交換がしやすい設計』を重視されますか？\n\n初期投資とランニングコストのバランスに関わる重要な選択です。',
    freeTextPrompt: 'メンテナンスへのお考えをお聞かせください',
    optionA: {
      label: '予防的設計',
      description: '傷や汚れを未然に防ぐ高耐久素材',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80'
    },
    optionB: {
      label: '修復可能性',
      description: '修復や交換がしやすい設計',
      image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 8,
    dimension: '価値観軸：素材',
    psychologyType: 'artificial_natural',
    question: '素材の好みについて、お聞かせください。\n\n『お手入れが簡単で、機能性に優れた人工素材』を好まれますか？\n\nそれとも、『経年変化を楽しめる、温かみのある自然素材』を好まれますか？\n\nどちらも一長一短がございますので、率直なご意見をお聞かせください。',
    freeTextPrompt: '素材へのこだわりをお聞かせください',
    optionA: {
      label: '機能的な人工素材',
      description: 'お手入れが簡単で機能性に優れた人工素材',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&auto=format&fit=crop&q=80'
    },
    optionB: {
      label: '温かみのある自然素材',
      description: '経年変化を楽しめる温かみのある自然素材',
      image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 9,
    dimension: '性格軸：独立 vs 協調',
    psychologyType: 'independent_cooperative',
    question: '空間づくりの基準について、お伺いします。\n\n『ご自身（またはご家族）の好みで、すべて決めたい』とお考えですか？\n\nそれとも、『訪れるお客様から、どう見えるか』も同じくらい重視されますか？\n\nどちらを重視されるかで、デザインの方向性が変わってきます。',
    freeTextPrompt: '空間づくりで大切にしたいことをお聞かせください',
    optionA: {
      label: '自分の好みで完結',
      description: 'ご自身（ご家族）の好みですべて決めたい',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop&q=80'
    },
    optionB: {
      label: '来客時の印象も重視',
      description: '訪れるお客様からの見え方も同じくらい重視',
      image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 10,
    dimension: '価値観軸：音環境',
    psychologyType: 'quiet_lively',
    question: '最後に、音環境について教えてください。\n\n『外の音や生活音が遮断された、静かな空間』を求められますか？\n\nそれとも、『音楽や会話が心地よく響く、活気のある空間』を求められますか？\n\nこれによって、防音対策や音響設計が変わってまいります。',
    freeTextPrompt: '理想の音環境についてお聞かせください',
    optionA: {
      label: '静寂を重視',
      description: '外の音や生活音が遮断された静かな空間',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80'
    },
    optionB: {
      label: '活気を重視',
      description: '音楽や会話が心地よく響く活気のある空間',
      image: 'https://images.unsplash.com/photo-1618221710640-c0eaaa2adb49?w=800&auto=format&fit=crop&q=80'
    }
  }
]
