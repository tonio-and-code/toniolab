/**
 * 施工実績データ（静的データ）
 */

export type PortfolioItem = {
  id: string
  title: string
  description: string
  location: string
  category: string
  image_url: string
  tags: string[]
  is_featured: boolean
  area?: string
  work_type?: string
  takumi_comment?: string // タクミの一言コメント
  coordinates?: {
    lat: number
    lng: number
  }
}

export const portfolioData: PortfolioItem[] = [
  // 最新の施工実績（2025年）
  {
    id: '0',
    title: 'あいおいニッセイ同和損保ビル 共用通路床T/C貼替',
    description: '大規模オフィスビルの共用通路における床タイルカーペット（T/C）全面貼替工事。既存T/C撤去後、下地調整を行い、防炎性能・耐久性に優れた新規タイルカーペットを施工。ビル管理会社様・テナント様との綿密な調整のもと、営業時間外の夜間作業で実施し、翌営業日に支障なく完工。',
    location: '千代田区二番町5-6',
    category: '店舗・オフィス',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    tags: ['オフィスビル', 'タイルカーペット', '夜間作業', '大規模改修'],
    is_featured: true,
    area: '約180㎡',
    work_type: '共用通路床T/C貼替工事',
    takumi_comment: '大手企業のビル、責任は重い。夜間作業だからこそ気を引き締める。既存T/C撤去、下地調整、新規施工まで一晩で完遂。翌朝、何事もなかったかのように社員の皆さんが歩いていく姿を見た時、「よし、やったぞ」って思ったぜ。これが職人の誇りだ。',
    coordinates: { lat: 35.6937, lng: 139.7433 } // 千代田区二番町
  },

  // 住宅・マンション
  {
    id: '1',
    title: '江東区Mマンション クロス・CF張替',
    description: '築25年3LDK。リビング天井にシミがあり下地補修から実施。サンゲツSP品番使用、廊下・洗面はCF（クッションフロア）張替。工期4日、お盆前に完工しました。',
    location: '江東区東陽町',
    category: '住宅・マンション',
    image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    tags: ['クロス', 'CF', '下地補修'],
    is_featured: false,
    area: '68㎡',
    work_type: 'クロス・CF張替',
    takumi_comment: '天井のシミ、見えないところの水が原因だ。下地補修からしっかりやらないと、またすぐ剥がれる。お盆前に完工して、お孫さんの帰省に間に合ったって喜んでもらえたぜ。',
    coordinates: { lat: 35.6702, lng: 139.8176 }
  },
  {
    id: '2',
    title: '墨田区Oビル 3F事務所改装',
    description: '入居前のリニューアル工事。既存GLボンドクロスを剥がして石膏ボード+クロス張り直し。床はタイルカーペット敷込み。電気屋さんと同時進行で工期短縮しました。',
    location: '墨田区業平',
    category: '店舗・オフィス',
    image_url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    tags: ['事務所', 'タイルカーペット', 'GL剥がし'],
    is_featured: false,
    area: '52㎡',
    work_type: '事務所改装',
    takumi_comment: 'GLボンド剥がしは大変だけど、ここは手を抜けない。電気屋さんと息を合わせて同時進行、工期短縮に成功した。チームワークが仕事の質を上げるんだ。',
    coordinates: { lat: 35.7101, lng: 139.8107 }
  },
  {
    id: '3',
    title: '台東区K様邸 バリアフリー改修',
    description: '80代ご夫婦のお宅。介護保険利用。トイレ・浴室・玄関に手すり、段差スロープ設置。床をノンスリップCFに張替え。ケアマネさんとの打合せ含め2週間で完工。',
    location: '台東区浅草',
    category: '住宅・マンション',
    image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    tags: ['バリアフリー', '介護保険', '手すり'],
    is_featured: true,
    area: '48㎡',
    work_type: '介護保険リフォーム',
    takumi_comment: '俺たちがやってるのは手すり設置じゃない。80代ご夫婦が自分の足で歩ける、尊厳を守れる環境を創造してるんだ。ケアマネさんと何度も打ち合わせた甲斐があったぜ。',
    coordinates: { lat: 35.7148, lng: 139.7967 }
  },
  {
    id: '4',
    title: '江戸川区I様 和室→洋室改装',
    description: '6畳和室を洋室に変更。畳撤去後12mm合板下地組んでフローリング張り。天井クロス、壁は一部ボード増張りして仕上げ。押入れはクローゼットに造替え。工期7日間。',
    location: '江戸川区西葛西',
    category: '住宅・マンション',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop',
    tags: ['和室→洋室', 'フローリング', '造作'],
    is_featured: false,
    area: '約10㎡（6畳）',
    work_type: '和室改装',
    takumi_comment: '畳を剥がすだけじゃない。暮らしの変化を受け入れる手伝いをしてるんだ。押入れをクローゼットに造替えて、新しい生活が始まる。それが俺たちの仕事さ。',
    coordinates: { lat: 35.6645, lng: 139.8682 }
  },
  {
    id: '5',
    title: '品川区Y様 キッチン壁CF張り',
    description: 'キッチン壁面のみ張替え依頼。油汚れがひどく下地処理に時間かかったが、3Mダイノック使ってタイル調に。お客様にご満足いただきました。',
    location: '品川区大井町',
    category: '住宅・マンション',
    image_url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
    tags: ['ダイノック', 'キッチン', 'CF'],
    is_featured: false,
    area: '約8㎡',
    work_type: '部分張替',
    takumi_comment: '油汚れがひどかったけど、下地処理に時間をかけた。3Mダイノックでタイル調に仕上げて、キッチンが明るくなった。お客様の笑顔が俺たちの報酬だ。',
    coordinates: { lat: 35.6056, lng: 139.7341 }
  },

  // 店舗・オフィス
  {
    id: '6',
    title: '渋谷区Sカフェ 内装工事',
    description: '居抜きカフェの改装。壁の一部を塗装仕上げ、カウンター廻りはダイノック貼り。床は既存タイル活かしてコスト削減。大工さんと連携して工期10日で完工。オープン後も繁盛しています。',
    location: '渋谷区神南',
    category: '店舗・オフィス',
    image_url: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop',
    tags: ['カフェ', '塗装', 'ダイノック'],
    is_featured: true,
    area: '42㎡',
    work_type: '店舗改装',
    takumi_comment: '内装を変えるだけじゃない。オーナーの夢の再出発を形にしてるんだ。大工さんと息を合わせて10日で完工。今も繁盛してるって聞くと嬉しいぜ。',
    coordinates: { lat: 35.6627, lng: 139.7025 }
  },
  {
    id: '7',
    title: '中央区Hビル会議室改装',
    description: '5階建てビルの3階会議室。既存カーペットタイル撤去→OAフロア組直し→新規カーペット敷込み。壁天井はクロス張替え。音響業者さんとの調整もあり工期2週間。',
    location: '中央区日本橋',
    category: '店舗・オフィス',
    image_url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&h=600&fit=crop',
    tags: ['会議室', 'OAフロア', 'カーペット'],
    is_featured: false,
    area: '85㎡',
    work_type: '会議室改装',
    takumi_comment: 'OAフロアの組み直しは緻密な作業だ。音響業者さんとの調整も多かったけど、チームワークで乗り切った。会議室は企業の顔、妥協はできないぜ。',
    coordinates: { lat: 35.6828, lng: 139.7745 }
  },
  {
    id: '8',
    title: '新宿区N美容室 床CF張替のみ',
    description: '営業中の美容室。定休日2日間のみの作業。既存CF剥がし→下地調整→CF張り。椅子や棚の移動もあり職人2名体制。夜間作業で何とか間に合わせた。翌営業日に無事間に合いました。',
    location: '新宿区高田馬場',
    category: '店舗・オフィス',
    image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
    tags: ['美容室', 'CF', '短期'],
    is_featured: false,
    area: '28㎡',
    work_type: '床張替',
    takumi_comment: '定休日2日間だけ。夜間作業で職人2名、必死で仕上げた。翌営業日に間に合った時の達成感は忘れられない。お客様の商売を守るのも俺たちの仕事だ。',
    coordinates: { lat: 35.7126, lng: 139.7038 }
  },

  // 公共施設・その他
  {
    id: '9',
    title: '台東区公共施設 多目的ホール',
    description: '区の施設改修工事。天井・壁クロス張替、床長尺シート張替。既存照明器具外して再取付けあり電気屋さんと共同作業。検査も無事通過しました。',
    location: '台東区上野',
    category: '公共施設',
    image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
    tags: ['公共施設', '長尺シート', 'クロス'],
    is_featured: false,
    area: '120㎡',
    work_type: '公共施設改修',
    takumi_comment: '公共施設は地域の人が使う場所だ。電気屋さんと共同作業、検査も無事通過。みんなが安心して使える空間を作る、それが俺たちの誇りさ。',
    coordinates: { lat: 35.7090, lng: 139.7744 }
  },
  {
    id: '10',
    title: '江戸川区M保育園 改修工事',
    description: '0〜2歳児室の床・壁改修。安全重視でノンスリップCF、腰壁は抗菌クロス使用。園児がいない土日祝で作業。においが残らないようF☆☆☆☆建材徹底。園長先生より高評価。',
    location: '江戸川区葛西',
    category: '公共施設',
    image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop',
    tags: ['保育園', '抗菌', 'F☆☆☆☆'],
    is_featured: false,
    area: '62㎡',
    work_type: '保育園改修',
    takumi_comment: '床を張ってるんじゃない。子どもたちの安全と未来を守ってるんだ。土日祝のみ作業、F☆☆☆☆建材でにおいも残さない。園長先生の笑顔が何よりの報酬だぜ。',
    coordinates: { lat: 35.6584, lng: 139.8695 }
  },
  {
    id: '11',
    title: '大田区Tクリニック 開業工事',
    description: 'テナント新規開業の内装。医療用クロス（抗菌・防カビ）、床はCF。間仕切りLGS組立〜ボード張り〜クロス仕上げまで一括受注。設備屋さんとの調整含め工期3週間。',
    location: '大田区蒲田',
    category: '公共施設',
    image_url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop',
    tags: ['クリニック', 'LGS', '抗菌'],
    is_featured: false,
    area: '75㎡',
    work_type: 'クリニック開業',
    takumi_comment: 'クリニック開業、先生の夢のスタートだ。医療用クロスで抗菌・防カビ、設備屋さんと調整しながら3週間で完工。患者さんが安心できる空間を作ったぜ。',
    coordinates: { lat: 35.5619, lng: 139.7231 }
  },
  {
    id: '12',
    title: '足立区F福祉施設 デイルーム',
    description: 'デイサービスの食堂・リハビリスペース。手すり追加、床ノンスリップ長尺シート、壁は明るい色のクロス。利用者さんの安全第一で施工。ケアマネさん立会検査も合格。',
    location: '足立区綾瀬',
    category: '公共施設',
    image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=600&fit=crop',
    tags: ['福祉', '手すり', '長尺シート'],
    is_featured: false,
    area: '95㎡',
    work_type: 'デイサービス改修',
    takumi_comment: 'デイサービス、利用者さんの安全が第一だ。手すり、ノンスリップ床、明るいクロス。ケアマネさんの立会検査も合格。人の尊厳を守る仕事、やりがいがあるぜ。',
    coordinates: { lat: 35.7649, lng: 139.8261 }
  },
]
