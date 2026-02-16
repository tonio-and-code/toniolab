'use client';

import { useState, useMemo } from 'react';

// ---------- Data ----------

type WordEntry = {
    en: string;
    pron: string;
    ja: string;
    note: string;
    star?: boolean;
};

type Category = {
    id: string;
    title: string;
    titleEn: string;
    icon: string;
    color: string;
    subcategories: {
        name: string;
        words: WordEntry[];
    }[];
};

const CATEGORIES: Category[] = [
    {
        id: 'home',
        title: '家・住宅',
        titleEn: 'Home & House',
        icon: 'H',
        color: '#8B5CF6',
        subcategories: [
            {
                name: 'Structure & Rooms',
                words: [
                    { en: 'attic', pron: 'アティック', ja: '屋根裏部屋', note: 'storage space under roof' },
                    { en: 'basement', pron: 'ベイスメント', ja: '地下室', note: 'below ground floor' },
                    { en: 'crawl space', pron: 'クロールスペース', ja: '床下空間', note: 'low area under house' },
                    { en: 'den', pron: 'デン', ja: '書斎/くつろぎ部屋', note: 'informal living room' },
                    { en: 'foyer', pron: 'フォイエ', ja: '玄関ホール', note: 'entry area' },
                    { en: 'landing', pron: 'ランディング', ja: '踊り場', note: 'between stairs' },
                    { en: 'mudroom', pron: 'マッドルーム', ja: '泥落とし室', note: 'entry room for dirty shoes' },
                    { en: 'nursery', pron: 'ナーサリー', ja: '子供部屋', note: "baby's room" },
                    { en: 'pantry', pron: 'パントリー', ja: '食品庫', note: 'food storage room', star: true },
                    { en: 'patio', pron: 'パティオ', ja: 'テラス/中庭', note: 'outdoor living space' },
                    { en: 'porch', pron: 'ポーチ', ja: '玄関ポーチ', note: 'covered entrance' },
                    { en: 'sunroom', pron: 'サンルーム', ja: '日光室', note: 'glass-enclosed room' },
                    { en: 'utility room', pron: 'ユーティリティルーム', ja: '家事室', note: 'laundry/storage' },
                    { en: 'walk-in closet', pron: 'ウォークインクローゼット', ja: '大型収納', note: 'closet you enter' },
                    { en: 'breakfast nook', pron: 'ブレックファストヌック', ja: '朝食コーナー', note: 'small eating area' },
                    { en: 'master bedroom', pron: 'マスターベッドルーム', ja: '主寝室', note: 'largest bedroom' },
                    { en: 'en suite', pron: 'オンスウィート', ja: '専用バス付き', note: 'bathroom attached to bedroom' },
                    { en: 'half bath', pron: 'ハーフバス', ja: '洗面トイレのみ', note: 'no shower/tub' },
                    { en: 'powder room', pron: 'パウダールーム', ja: '化粧室/トイレ', note: 'small guest bathroom' },
                    { en: 'man cave', pron: 'マンケイブ', ja: '男の隠れ家', note: 'personal room for men' },
                ],
            },
            {
                name: 'Building & Structure',
                words: [
                    { en: 'baseboard', pron: 'ベースボード', ja: '幅木', note: 'bottom wall trim', star: true },
                    { en: 'caulk', pron: 'コーク', ja: 'コーキング材', note: 'sealant', star: true },
                    { en: 'crown molding', pron: 'クラウンモールディング', ja: '廻り縁', note: 'ceiling trim' },
                    { en: 'drywall', pron: 'ドライウォール', ja: '石膏ボード', note: 'wall material', star: true },
                    { en: 'eaves', pron: 'イーヴズ', ja: '軒', note: 'roof overhang' },
                    { en: 'gutter', pron: 'ガター', ja: '雨どい', note: 'roof drain', star: true },
                    { en: 'insulation', pron: 'インスレイション', ja: '断熱材', note: 'thermal barrier' },
                    { en: 'stud', pron: 'スタッド', ja: '間柱', note: 'wall frame piece', star: true },
                    { en: 'threshold', pron: 'スレッショルド', ja: '敷居', note: 'door bottom' },
                    { en: 'weatherstrip', pron: 'ウェザーストリップ', ja: '気密テープ', note: 'door/window seal' },
                    { en: 'downspout', pron: 'ダウンスパウト', ja: '縦樋', note: 'vertical gutter pipe' },
                    { en: 'grout', pron: 'グラウト', ja: '目地材', note: 'tile filler' },
                    { en: 'shingle', pron: 'シングル', ja: '屋根材', note: 'roof tile' },
                    { en: 'stucco', pron: 'スタッコ', ja: '化粧しっくい', note: 'exterior plaster' },
                ],
            },
            {
                name: 'Doors & Windows',
                words: [
                    { en: 'deadbolt', pron: 'デッドボルト', ja: '補助錠', note: 'security lock', star: true },
                    { en: 'doorbell', pron: 'ドアベル', ja: '呼び鈴', note: 'front door bell' },
                    { en: 'hinge', pron: 'ヒンジ', ja: '蝶番', note: 'door pivot' },
                    { en: 'peephole', pron: 'ピープホール', ja: 'のぞき穴', note: 'door viewer', star: true },
                    { en: 'screen door', pron: 'スクリーンドア', ja: '網戸付きドア', note: 'mesh door' },
                    { en: 'sill', pron: 'シル', ja: '窓台', note: 'window bottom ledge' },
                    { en: 'skylight', pron: 'スカイライト', ja: '天窓', note: 'roof window' },
                    { en: 'bay window', pron: 'ベイウィンドウ', ja: '出窓', note: 'protruding window' },
                    { en: 'blinds', pron: 'ブラインズ', ja: 'ブラインド', note: 'window covering' },
                    { en: 'shutter', pron: 'シャッター', ja: '雨戸/鎧戸', note: 'window cover' },
                ],
            },
            {
                name: 'Hardware & Fixtures',
                words: [
                    { en: 'faucet', pron: 'フォーセット', ja: '蛇口', note: 'water tap', star: true },
                    { en: 'garbage disposal', pron: 'ガーベッジディスポーザル', ja: '生ごみ処理機', note: 'in-sink grinder', star: true },
                    { en: 'thermostat', pron: 'サーモスタット', ja: '温度調節器', note: 'temperature control', star: true },
                    { en: 'circuit breaker', pron: 'サーキットブレイカー', ja: 'ブレーカー', note: 'electrical panel', star: true },
                    { en: 'outlet', pron: 'アウトレット', ja: 'コンセント', note: 'electrical socket' },
                    { en: 'smoke detector', pron: 'スモークディテクター', ja: '煙感知器', note: 'fire alarm' },
                    { en: 'mailbox', pron: 'メイルボックス', ja: '郵便受け', note: 'for mail delivery', star: true },
                    { en: 'furnace', pron: 'ファーネス', ja: '暖房炉', note: 'heating system' },
                ],
            },
            {
                name: 'Yard & Outdoor',
                words: [
                    { en: 'cul-de-sac', pron: 'カルデサック', ja: '袋小路', note: 'dead-end street', star: true },
                    { en: 'curb', pron: 'カーブ', ja: '縁石', note: 'street edge', star: true },
                    { en: 'driveway', pron: 'ドライブウェイ', ja: '私道/車庫前の道', note: 'car path to house', star: true },
                    { en: 'hedge', pron: 'ヘッジ', ja: '生垣', note: 'planted fence', star: true },
                    { en: 'lawn', pron: 'ローン', ja: '芝生', note: 'grass area', star: true },
                    { en: 'lawn mower', pron: 'ローンモウアー', ja: '芝刈り機', note: 'grass cutter', star: true },
                    { en: 'mulch', pron: 'マルチ', ja: 'マルチング材', note: 'garden ground cover', star: true },
                    { en: 'sidewalk', pron: 'サイドウォーク', ja: '歩道', note: 'walking path', star: true },
                    { en: 'sprinkler', pron: 'スプリンクラー', ja: '散水機', note: 'lawn watering', star: true },
                    { en: 'wheelbarrow', pron: 'ウィールバロー', ja: '手押し車', note: 'garden cart', star: true },
                    { en: 'compost', pron: 'コンポスト', ja: '堆肥', note: 'decomposed organic matter', star: true },
                    { en: 'leaf blower', pron: 'リーフブロワー', ja: '落ち葉掃き機', note: 'blows leaves away' },
                    { en: 'pergola', pron: 'パーゴラ', ja: 'パーゴラ', note: 'garden structure' },
                    { en: 'septic tank', pron: 'セプティックタンク', ja: '浄化槽', note: 'sewage processing' },
                ],
            },
            {
                name: 'Cleaning',
                words: [
                    { en: 'detergent', pron: 'ディタージェント', ja: '洗剤', note: 'cleaning soap', star: true },
                    { en: 'bleach', pron: 'ブリーチ', ja: '漂白剤', note: 'whitening chemical', star: true },
                    { en: 'fabric softener', pron: 'ファブリックソフナー', ja: '柔軟剤', note: 'laundry softener', star: true },
                    { en: 'dryer sheet', pron: 'ドライヤーシート', ja: '乾燥機用シート', note: 'static reducer', star: true },
                    { en: 'lint roller', pron: 'リントローラー', ja: '粘着クリーナー', note: 'removes lint', star: true },
                    { en: 'plunger', pron: 'プランジャー', ja: 'ラバーカップ', note: 'toilet unclogger', star: true },
                    { en: 'squeegee', pron: 'スクイージー', ja: 'ゴムべら', note: 'window cleaner' },
                    { en: 'dustpan', pron: 'ダストパン', ja: 'ちりとり', note: 'picks up dust' },
                    { en: 'paper towel', pron: 'ペイパータオル', ja: 'キッチンペーパー', note: 'disposable towel' },
                ],
            },
        ],
    },
    {
        id: 'kitchen',
        title: 'キッチン・料理',
        titleEn: 'Kitchen & Cooking',
        icon: 'K',
        color: '#F59E0B',
        subcategories: [
            {
                name: 'Cookware & Utensils',
                words: [
                    { en: 'colander', pron: 'カランダー', ja: 'ざる/水切り', note: 'strainer with holes', star: true },
                    { en: 'spatula', pron: 'スパチュラ', ja: 'フライ返し/ヘラ', note: 'turner/scraper', star: true },
                    { en: 'whisk', pron: 'ウィスク', ja: '泡立て器', note: 'beating tool', star: true },
                    { en: 'ladle', pron: 'レイドル', ja: 'おたま', note: 'soup spoon', star: true },
                    { en: 'tongs', pron: 'トングズ', ja: 'トング', note: 'gripping tool' },
                    { en: 'cutting board', pron: 'カッティングボード', ja: 'まな板', note: 'chopping surface', star: true },
                    { en: 'parchment paper', pron: 'パーチメントペーパー', ja: 'クッキングシート', note: 'baking paper', star: true },
                    { en: 'baking sheet', pron: 'ベイキングシート', ja: '天板', note: 'flat oven tray', star: true },
                    { en: 'muffin tin', pron: 'マフィンティン', ja: 'マフィン型', note: 'cupcake pan', star: true },
                    { en: 'rolling pin', pron: 'ローリングピン', ja: 'めん棒', note: 'dough roller', star: true },
                    { en: 'oven mitt', pron: 'オーブンミット', ja: 'オーブンミトン', note: 'heat gloves', star: true },
                    { en: 'pot holder', pron: 'ポットホルダー', ja: '鍋つかみ', note: 'hot pad', star: true },
                    { en: 'peeler', pron: 'ピーラー', ja: '皮むき器', note: 'skin remover' },
                    { en: 'grater', pron: 'グレイター', ja: 'おろし金', note: 'shredding tool' },
                    { en: 'cast iron skillet', pron: 'キャストアイアンスキレット', ja: '鋳鉄フライパン', note: 'heavy pan', star: true },
                    { en: 'dutch oven', pron: 'ダッチオーブン', ja: '鋳鉄鍋', note: 'heavy pot with lid' },
                    { en: 'slow cooker', pron: 'スロークッカー', ja: '電気鍋', note: 'crock pot' },
                ],
            },
            {
                name: 'Cooking Terms',
                words: [
                    { en: 'simmer', pron: 'シマー', ja: 'とろ火で煮る', note: 'low boil', star: true },
                    { en: 'braise', pron: 'ブレイズ', ja: '蒸し煮にする', note: 'slow cook in liquid', star: true },
                    { en: 'saute', pron: 'ソテイ', ja: 'ソテーする', note: 'pan fry quickly' },
                    { en: 'deglaze', pron: 'デグレイズ', ja: '焦げ付きを溶かす', note: 'add liquid to pan', star: true },
                    { en: 'knead', pron: 'ニード', ja: 'こねる', note: 'work dough', star: true },
                    { en: 'baste', pron: 'ベイスト', ja: '汁をかける', note: 'pour juices over meat', star: true },
                    { en: 'blanch', pron: 'ブランチ', ja: '湯通しする', note: 'brief boil then ice' },
                    { en: 'julienne', pron: 'ジュリエン', ja: '千切りにする', note: 'thin strips' },
                    { en: 'fold', pron: 'フォールド', ja: 'さっくり混ぜる', note: 'gentle mixing' },
                    { en: 'sear', pron: 'シア', ja: '焦げ目をつける', note: 'high heat surface' },
                    { en: 'drizzle', pron: 'ドリズル', ja: '少量かける', note: 'pour thin stream' },
                    { en: 'zest', pron: 'ゼスト', ja: '皮のすりおろし', note: 'citrus peel', star: true },
                ],
            },
            {
                name: 'American Foods',
                words: [
                    { en: 'biscuit (US)', pron: 'ビスケット', ja: 'スコーンに似たパン', note: 'not UK biscuit', star: true },
                    { en: 'casserole', pron: 'キャセロール', ja: 'オーブン焼き料理', note: 'mixed baked dish', star: true },
                    { en: 'cornbread', pron: 'コーンブレッド', ja: 'コーンブレッド', note: 'corn-based bread', star: true },
                    { en: 'deviled eggs', pron: 'デビルドエッグ', ja: '詰め卵', note: 'stuffed eggs', star: true },
                    { en: 'grits', pron: 'グリッツ', ja: 'トウモロコシ粥', note: 'Southern porridge', star: true },
                    { en: 'mac and cheese', pron: 'マカンチーズ', ja: 'マカロニチーズ', note: 'American staple', star: true },
                    { en: 'meatloaf', pron: 'ミートローフ', ja: 'ミートローフ', note: 'ground meat loaf', star: true },
                    { en: "s'mores", pron: 'スモアーズ', ja: 'スモア', note: 'campfire treat', star: true },
                    { en: 'coleslaw', pron: 'コールスロー', ja: 'コールスロー', note: 'cabbage salad', star: true },
                    { en: 'hash browns', pron: 'ハッシュブラウンズ', ja: 'ハッシュポテト', note: 'potato pancake', star: true },
                    { en: 'hoagie/sub', pron: 'ホーギー/サブ', ja: 'サブマリンサンド', note: 'long sandwich', star: true },
                    { en: 'funnel cake', pron: 'ファネルケイク', ja: 'ファネルケーキ', note: 'fried dough' },
                ],
            },
            {
                name: 'Ingredients',
                words: [
                    { en: 'buttermilk', pron: 'バターミルク', ja: 'バターミルク', note: 'cultured milk', star: true },
                    { en: 'half-and-half', pron: 'ハーフアンドハーフ', ja: '牛乳とクリーム半々', note: 'coffee cream', star: true },
                    { en: 'molasses', pron: 'モラセス', ja: '糖蜜', note: 'thick syrup', star: true },
                    { en: 'cilantro', pron: 'シラントロ', ja: 'パクチー', note: 'coriander leaf', star: true },
                    { en: 'heavy cream', pron: 'ヘビークリーム', ja: '生クリーム', note: 'thick cream' },
                    { en: 'baking soda', pron: 'ベイキングソーダ', ja: '重曹', note: 'sodium bicarbonate' },
                    { en: 'vanilla extract', pron: 'バニラエクストラクト', ja: 'バニラエッセンス', note: 'flavoring' },
                ],
            },
        ],
    },
    {
        id: 'baby',
        title: '赤ちゃん・育児',
        titleEn: 'Baby & Parenting',
        icon: 'B',
        color: '#EC4899',
        subcategories: [
            {
                name: 'Baby Essentials',
                words: [
                    { en: 'onesie', pron: 'ワンジー', ja: 'ベビー服', note: 'one-piece baby outfit', star: true },
                    { en: 'bassinet', pron: 'バシネット', ja: '新生児用ベッド', note: 'small baby bed', star: true },
                    { en: 'crib', pron: 'クリブ', ja: 'ベビーベッド', note: 'baby bed', star: true },
                    { en: 'diaper', pron: 'ダイアパー', ja: 'おむつ', note: 'nappy (UK)', star: true },
                    { en: 'stroller', pron: 'ストローラー', ja: 'ベビーカー', note: 'pushchair', star: true },
                    { en: 'pacifier', pron: 'パシファイアー', ja: 'おしゃぶり', note: 'dummy (UK)', star: true },
                    { en: 'car seat', pron: 'カーシート', ja: 'チャイルドシート', note: 'vehicle safety seat', star: true },
                    { en: 'high chair', pron: 'ハイチェア', ja: 'ベビーチェア', note: 'baby eating chair', star: true },
                    { en: 'bib', pron: 'ビブ', ja: 'よだれかけ', note: 'eating protector', star: true },
                    { en: 'swaddle', pron: 'スワドル', ja: 'おくるみ', note: 'wrap tightly', star: true },
                    { en: 'baby monitor', pron: 'ベビーモニター', ja: 'ベビーモニター', note: 'room camera/speaker', star: true },
                    { en: 'baby gate', pron: 'ベビーゲイト', ja: 'ベビーゲート', note: 'safety barrier', star: true },
                    { en: 'playpen', pron: 'プレイペン', ja: 'ベビーサークル', note: 'enclosed play area', star: true },
                    { en: 'sippy cup', pron: 'シッピーカップ', ja: 'こぼれにくいコップ', note: 'spill-proof cup', star: true },
                    { en: 'formula', pron: 'フォーミュラ', ja: '粉ミルク', note: 'baby milk substitute', star: true },
                    { en: 'breast pump', pron: 'ブレストポンプ', ja: '搾乳器', note: 'milk extractor', star: true },
                    { en: 'burp cloth', pron: 'バープクロス', ja: 'げっぷ用布', note: 'shoulder cloth', star: true },
                    { en: 'changing table', pron: 'チェンジングテーブル', ja: 'おむつ替え台', note: 'diaper station', star: true },
                    { en: 'teething ring', pron: 'ティーシングリング', ja: '歯固め', note: 'chew toy', star: true },
                    { en: 'baby wipes', pron: 'ベビーワイプス', ja: 'おしりふき', note: 'moist towels', star: true },
                ],
            },
            {
                name: 'Pregnancy & Parenting',
                words: [
                    { en: 'due date', pron: 'デューデイト', ja: '出産予定日', note: 'expected delivery', star: true },
                    { en: 'trimester', pron: 'トライメスター', ja: '妊娠期(3ヶ月)', note: 'pregnancy period', star: true },
                    { en: 'maternity leave', pron: 'マターニティリーブ', ja: '産休', note: 'pregnancy leave', star: true },
                    { en: 'ultrasound', pron: 'ウルトラサウンド', ja: 'エコー/超音波', note: 'pregnancy scan', star: true },
                    { en: 'baby shower', pron: 'ベビーシャワー', ja: '出産祝いパーティー', note: 'pre-birth party', star: true },
                    { en: 'baby registry', pron: 'ベビーレジストリ', ja: '出産祝いリスト', note: 'gift wish list', star: true },
                    { en: 'gender reveal', pron: 'ジェンダーリビール', ja: '性別発表', note: 'boy/girl announcement', star: true },
                    { en: 'pediatrician', pron: 'ピーディアトリシャン', ja: '小児科医', note: "children's doctor", star: true },
                    { en: 'potty training', pron: 'ポティトレーニング', ja: 'トイレトレーニング', note: 'toilet training' },
                    { en: 'colic', pron: 'コリック', ja: '乳児疝痛', note: 'baby stomach pain', star: true },
                    { en: 'tummy time', pron: 'タミータイム', ja: 'うつ伏せ運動', note: 'face-down play' },
                    { en: 'postpartum', pron: 'ポストパータム', ja: '産後の', note: 'after birth' },
                ],
            },
        ],
    },
    {
        id: 'school',
        title: '学校・教育',
        titleEn: 'School & Education',
        icon: 'S',
        color: '#3B82F6',
        subcategories: [
            {
                name: 'School Life',
                words: [
                    { en: 'varsity', pron: 'ヴァーシティ', ja: '代表チーム', note: "school's best team", star: true },
                    { en: 'homecoming', pron: 'ホームカミング', ja: '同窓パーティー', note: 'school celebration', star: true },
                    { en: 'prom', pron: 'プロム', ja: 'プロム', note: 'formal dance', star: true },
                    { en: 'valedictorian', pron: 'ヴァレディクトリアン', ja: '卒業総代', note: 'top student', star: true },
                    { en: 'GPA', pron: 'ジーピーエイ', ja: '成績平均値', note: 'grade point average', star: true },
                    { en: 'recess', pron: 'リセス', ja: '休み時間', note: 'outdoor break', star: true },
                    { en: 'detention', pron: 'ディテンション', ja: '居残り/罰', note: 'punishment stay', star: true },
                    { en: 'hall pass', pron: 'ホールパス', ja: '廊下通行許可証', note: 'permission slip', star: true },
                    { en: 'locker', pron: 'ロッカー', ja: 'ロッカー', note: 'personal storage', star: true },
                    { en: 'homeroom', pron: 'ホームルーム', ja: 'ホームルーム', note: 'first class of day', star: true },
                    { en: 'yearbook', pron: 'イヤーブック', ja: '卒業アルバム', note: 'school album', star: true },
                    { en: 'freshman', pron: 'フレッシュマン', ja: '1年生', note: 'first year', star: true },
                    { en: 'sophomore', pron: 'ソフモア', ja: '2年生', note: 'second year', star: true },
                    { en: 'substitute teacher', pron: 'サブスティチュートティーチャー', ja: '代行教師', note: 'replacement teacher', star: true },
                    { en: 'syllabus', pron: 'シラバス', ja: 'シラバス', note: 'course outline', star: true },
                    { en: 'SAT/ACT', pron: 'エスエイティー', ja: '大学入試テスト', note: 'college entrance exam', star: true },
                    { en: 'AP classes', pron: 'エイピークラス', ja: '上級クラス', note: 'advanced placement' },
                    { en: 'pep rally', pron: 'ペップラリー', ja: '応援集会', note: 'spirit event' },
                    { en: 'sorority', pron: 'ソロリティ', ja: '女子社交クラブ', note: "college women's group" },
                    { en: 'fraternity', pron: 'フラタニティ', ja: '男子社交クラブ', note: "college men's group" },
                    { en: 'spring break', pron: 'スプリングブレイク', ja: '春休み', note: 'vacation week' },
                    { en: 'commencement', pron: 'コメンスメント', ja: '卒業式', note: 'graduation ceremony' },
                ],
            },
        ],
    },
    {
        id: 'medical',
        title: '医療・健康',
        titleEn: 'Medical & Health',
        icon: 'M',
        color: '#EF4444',
        subcategories: [
            {
                name: 'Symptoms & Conditions',
                words: [
                    { en: 'cavity', pron: 'キャビティ', ja: '虫歯', note: 'tooth hole', star: true },
                    { en: 'congestion', pron: 'コンジェスチョン', ja: '鼻づまり', note: 'blocked nose', star: true },
                    { en: 'heartburn', pron: 'ハートバーン', ja: '胸焼け', note: 'acid reflux', star: true },
                    { en: 'hives', pron: 'ハイヴズ', ja: '蕁麻疹', note: 'allergic bumps', star: true },
                    { en: 'sprain', pron: 'スプレイン', ja: '捻挫', note: 'twisted joint', star: true },
                    { en: 'bruise', pron: 'ブルーズ', ja: 'あざ/打撲', note: 'blue mark', star: true },
                    { en: 'blister', pron: 'ブリスター', ja: '水ぶくれ', note: 'skin bubble', star: true },
                    { en: 'rash', pron: 'ラッシュ', ja: '発疹', note: 'skin irritation', star: true },
                    { en: 'strep throat', pron: 'ストレップスロート', ja: '溶連菌感染症', note: 'bacterial throat' },
                ],
            },
            {
                name: 'Doctor & Insurance',
                words: [
                    { en: 'co-pay', pron: 'コーペイ', ja: '自己負担金', note: 'insurance payment', star: true },
                    { en: 'deductible', pron: 'ディダクティブル', ja: '免責額', note: 'insurance threshold', star: true },
                    { en: 'prescription', pron: 'プリスクリプション', ja: '処方箋', note: 'medicine order', star: true },
                    { en: 'over-the-counter', pron: 'オーバーザカウンター', ja: '市販の', note: 'no prescription', star: true },
                    { en: 'flu shot', pron: 'フルーショット', ja: 'インフル予防接種', note: 'vaccination', star: true },
                    { en: 'stitches', pron: 'スティッチズ', ja: '縫合', note: 'surgical thread', star: true },
                    { en: 'crutches', pron: 'クラッチズ', ja: '松葉杖', note: 'walking aids', star: true },
                    { en: 'inhaler', pron: 'インヘイラー', ja: '吸入器', note: 'asthma device', star: true },
                    { en: 'band-aid', pron: 'バンドエイド', ja: '絆創膏', note: 'adhesive bandage', star: true },
                ],
            },
        ],
    },
    {
        id: 'car',
        title: '車・運転',
        titleEn: 'Car & Driving',
        icon: 'C',
        color: '#6366F1',
        subcategories: [
            {
                name: 'Car Parts & Driving',
                words: [
                    { en: 'trunk', pron: 'トランク', ja: 'トランク', note: 'rear storage', star: true },
                    { en: 'hood', pron: 'フッド', ja: 'ボンネット', note: 'engine cover', star: true },
                    { en: 'dashboard', pron: 'ダッシュボード', ja: 'ダッシュボード', note: 'front panel', star: true },
                    { en: 'glove compartment', pron: 'グラブコンパートメント', ja: 'グローブボックス', note: 'dashboard box', star: true },
                    { en: 'turn signal', pron: 'ターンシグナル', ja: 'ウインカー', note: 'blinker', star: true },
                    { en: 'rearview mirror', pron: 'リアビューミラー', ja: 'バックミラー', note: 'back-view mirror', star: true },
                    { en: 'windshield', pron: 'ウィンドシールド', ja: 'フロントガラス', note: 'front glass', star: true },
                    { en: 'bumper', pron: 'バンパー', ja: 'バンパー', note: 'front/rear guard', star: true },
                    { en: 'fender', pron: 'フェンダー', ja: 'フェンダー', note: 'wheel cover', star: true },
                    { en: 'tailgate', pron: 'テイルゲイト', ja: 'テールゲート', note: 'back door', star: true },
                    { en: 'blind spot', pron: 'ブラインドスポット', ja: '死角', note: "can't-see area", star: true },
                    { en: 'carpool', pron: 'カープール', ja: '相乗り', note: 'share ride', star: true },
                    { en: 'fender bender', pron: 'フェンダーベンダー', ja: '軽い接触事故', note: 'small accident', star: true },
                    { en: 'jaywalking', pron: 'ジェイウォーキング', ja: '信号無視横断', note: 'illegal crossing', star: true },
                    { en: 'parallel parking', pron: 'パラレルパーキング', ja: '縦列駐車', note: 'side parking', star: true },
                    { en: 'pothole', pron: 'ポットホール', ja: '道路の穴', note: 'road hole', star: true },
                ],
            },
        ],
    },
    {
        id: 'social',
        title: '社交行事',
        titleEn: 'Social Events',
        icon: 'E',
        color: '#10B981',
        subcategories: [
            {
                name: 'Parties & Events',
                words: [
                    { en: 'potluck', pron: 'ポットラック', ja: '持ち寄りパーティー', note: 'bring food party', star: true },
                    { en: 'housewarming', pron: 'ハウスウォーミング', ja: '引越し祝い', note: 'new home party', star: true },
                    { en: 'tailgate party', pron: 'テイルゲイト', ja: '駐車場パーティー', note: 'pre-game party', star: true },
                    { en: 'bridal shower', pron: 'ブライダルシャワー', ja: '花嫁パーティー', note: "bride's party", star: true },
                    { en: 'bachelor party', pron: 'バチェラーパーティー', ja: '独身最後のパーティー(男)', note: "groom's party", star: true },
                    { en: 'block party', pron: 'ブロックパーティー', ja: '近所のパーティー', note: 'neighborhood party', star: true },
                    { en: 'cookout', pron: 'クックアウト', ja: '外ごはん会', note: 'outdoor cooking', star: true },
                    { en: 'playdate', pron: 'プレイデイト', ja: '遊ぶ約束(子供)', note: "kids' meetup", star: true },
                    { en: 'BYOB', pron: 'ビーワイオービー', ja: '飲み物持参', note: 'bring your own bottle', star: true },
                    { en: 'RSVP', pron: 'アールエスヴィーピー', ja: '出欠回答', note: 'please respond' },
                    { en: 'Friendsgiving', pron: 'フレンズギビング', ja: '友達感謝祭', note: "friends' Thanksgiving", star: true },
                    { en: 'white elephant', pron: 'ホワイトエレファント', ja: 'プレゼント交換会', note: 'gift exchange game' },
                    { en: 'Secret Santa', pron: 'シークレットサンタ', ja: 'シークレットサンタ', note: 'anonymous gift giving' },
                    { en: 'trick-or-treat', pron: 'トリックオアトリート', ja: 'トリックオアトリート', note: 'Halloween custom', star: true },
                    { en: 'Black Friday', pron: 'ブラックフライデー', ja: 'ブラックフライデー', note: 'big sale day', star: true },
                ],
            },
        ],
    },
    {
        id: 'work',
        title: '仕事・オフィス',
        titleEn: 'Work & Office',
        icon: 'W',
        color: '#78716C',
        subcategories: [
            {
                name: 'Office Life',
                words: [
                    { en: 'cubicle', pron: 'キュービクル', ja: 'パーティション', note: 'small workspace', star: true },
                    { en: 'break room', pron: 'ブレイクルーム', ja: '休憩室', note: 'employee lounge', star: true },
                    { en: 'onboarding', pron: 'オンボーディング', ja: '入社研修', note: 'new hire training', star: true },
                    { en: 'PTO', pron: 'ピーティーオー', ja: '有給休暇', note: 'paid time off', star: true },
                    { en: 'two weeks\' notice', pron: 'トゥーウィークスノーティス', ja: '2週間前退職届', note: 'resignation notice', star: true },
                    { en: 'direct deposit', pron: 'ダイレクトデポジット', ja: '口座振込', note: 'paycheck to bank', star: true },
                    { en: '401(k)', pron: 'フォーオーワンケイ', ja: '企業年金制度', note: 'retirement savings', star: true },
                    { en: 'clock in/out', pron: 'クロックイン/アウト', ja: 'タイムカードを切る', note: 'record work hours', star: true },
                    { en: 'lay off', pron: 'レイオフ', ja: '一時解雇する', note: 'let go', star: true },
                    { en: 'water cooler talk', pron: 'ウォータークーラートーク', ja: '井戸端会議', note: 'casual office chat' },
                    { en: 'pink slip', pron: 'ピンクスリップ', ja: '解雇通知', note: 'fired notice' },
                ],
            },
        ],
    },
    {
        id: 'grocery',
        title: '買い物',
        titleEn: 'Grocery & Shopping',
        icon: 'G',
        color: '#D97706',
        subcategories: [
            {
                name: 'Shopping',
                words: [
                    { en: 'aisle', pron: 'アイル', ja: '通路', note: 'store lane', star: true },
                    { en: 'checkout', pron: 'チェックアウト', ja: 'レジ/会計', note: 'payment area', star: true },
                    { en: 'cart', pron: 'カート', ja: 'ショッピングカート', note: 'wheeled basket', star: true },
                    { en: 'coupon', pron: 'クーポン', ja: 'クーポン', note: 'discount slip', star: true },
                    { en: 'receipt', pron: 'リシート', ja: 'レシート', note: 'purchase proof', star: true },
                    { en: 'cashier', pron: 'キャッシアー', ja: 'レジ係', note: 'checkout person', star: true },
                    { en: 'deli counter', pron: 'デリカウンター', ja: 'デリカテッセン', note: 'prepared food', star: true },
                    { en: 'produce section', pron: 'プロデュースセクション', ja: '青果売り場', note: 'fruits/veggies area', star: true },
                    { en: 'BOGO', pron: 'ボゴ', ja: '1つ買うと1つ無料', note: 'buy one get one free', star: true },
                    { en: 'bag boy', pron: 'バッグボーイ', ja: '袋詰め係', note: 'packs groceries' },
                    { en: 'self-checkout', pron: 'セルフチェックアウト', ja: 'セルフレジ', note: 'scan yourself' },
                    { en: 'express lane', pron: 'エクスプレスレイン', ja: '少量レジ', note: 'few items line' },
                ],
            },
        ],
    },
];

// ---------- Component ----------

export default function EverydayWordsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [starOnly, setStarOnly] = useState(false);

    const allWords = useMemo(() => {
        const words: (WordEntry & { category: string; subcategory: string })[] = [];
        for (const cat of CATEGORIES) {
            for (const sub of cat.subcategories) {
                for (const w of sub.words) {
                    words.push({ ...w, category: cat.id, subcategory: sub.name });
                }
            }
        }
        return words;
    }, []);

    const totalCount = allWords.length;
    const starCount = allWords.filter(w => w.star).length;

    const filteredCategories = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return CATEGORIES
            .filter(cat => !activeCategory || cat.id === activeCategory)
            .map(cat => ({
                ...cat,
                subcategories: cat.subcategories.map(sub => ({
                    ...sub,
                    words: sub.words.filter(w => {
                        if (starOnly && !w.star) return false;
                        if (!q) return true;
                        return (
                            w.en.toLowerCase().includes(q) ||
                            w.ja.includes(q) ||
                            w.pron.includes(q) ||
                            w.note.toLowerCase().includes(q)
                        );
                    }),
                })).filter(sub => sub.words.length > 0),
            }))
            .filter(cat => cat.subcategories.length > 0);
    }, [searchQuery, activeCategory, starOnly]);

    const filteredCount = filteredCategories.reduce(
        (acc, cat) => acc + cat.subcategories.reduce((a, s) => a + s.words.length, 0),
        0
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #164038 0%, #1a5c4a 100%)',
                padding: '48px 32px 32px',
                color: '#fff',
            }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>
                    日常英単語
                </h1>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', lineHeight: '1.6' }}>
                    日本で生活していると出会わない、英語圏の「当たり前」の単語集
                </p>
                <div style={{ display: 'flex', gap: '24px', marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                    <span>{totalCount} words</span>
                    <span>{starCount} starred</span>
                    <span>{CATEGORIES.length} categories</span>
                </div>
            </div>

            {/* Search & Filters */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid #E7E5E4', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search... (English / Japanese)"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            padding: '10px 16px',
                            border: '1px solid #D6D3D1',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                    />
                    <button
                        onClick={() => setStarOnly(!starOnly)}
                        style={{
                            padding: '10px 16px',
                            border: starOnly ? '2px solid #D4AF37' : '1px solid #D6D3D1',
                            borderRadius: '8px',
                            backgroundColor: starOnly ? '#FFFBEB' : '#fff',
                            color: starOnly ? '#92400E' : '#57534E',
                            fontSize: '13px',
                            fontWeight: starOnly ? '600' : '400',
                            cursor: 'pointer',
                        }}
                    >
                        {starOnly ? '* Starred Only' : '* Filter Starred'}
                    </button>
                    {searchQuery || activeCategory || starOnly ? (
                        <span style={{ fontSize: '13px', color: '#78716C' }}>
                            {filteredCount} / {totalCount}
                        </span>
                    ) : null}
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setActiveCategory(null)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: !activeCategory ? '2px solid #164038' : '1px solid #D6D3D1',
                            backgroundColor: !activeCategory ? '#164038' : '#fff',
                            color: !activeCategory ? '#fff' : '#57534E',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                        }}
                    >
                        All
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '20px',
                                border: activeCategory === cat.id ? `2px solid ${cat.color}` : '1px solid #D6D3D1',
                                backgroundColor: activeCategory === cat.id ? cat.color : '#fff',
                                color: activeCategory === cat.id ? '#fff' : '#57534E',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                            }}
                        >
                            {cat.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '24px 32px', maxWidth: '1200px' }}>
                {filteredCategories.map(cat => (
                    <div key={cat.id} style={{ marginBottom: '40px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '16px',
                            paddingBottom: '12px',
                            borderBottom: `2px solid ${cat.color}`,
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: cat.color,
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: '700',
                            }}>
                                {cat.icon}
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1C1917' }}>
                                    {cat.title}
                                </h2>
                                <span style={{ fontSize: '12px', color: '#78716C' }}>{cat.titleEn}</span>
                            </div>
                        </div>

                        {cat.subcategories.map(sub => (
                            <div key={sub.name} style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#78716C', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                    {sub.name}
                                </h3>
                                <div style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #E7E5E4',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#F5F5F4' }}>
                                                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: '#57534E', fontSize: '12px', width: '25%' }}>English</th>
                                                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: '#57534E', fontSize: '12px', width: '20%' }}>Pronunciation</th>
                                                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: '#57534E', fontSize: '12px', width: '25%' }}>Japanese</th>
                                                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: '#57534E', fontSize: '12px', width: '30%' }}>Note</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sub.words.map((w, i) => (
                                                <tr key={w.en} style={{ borderTop: i > 0 ? '1px solid #F5F5F4' : 'none' }}>
                                                    <td style={{ padding: '10px 16px', fontWeight: '600', color: '#1C1917' }}>
                                                        {w.star && <span style={{ color: '#D4AF37', marginRight: '4px' }}>*</span>}
                                                        {w.en}
                                                    </td>
                                                    <td style={{ padding: '10px 16px', color: '#78716C', fontSize: '13px' }}>{w.pron}</td>
                                                    <td style={{ padding: '10px 16px', color: '#44403C' }}>{w.ja}</td>
                                                    <td style={{ padding: '10px 16px', color: '#A8A29E', fontSize: '12px' }}>{w.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {filteredCategories.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#A8A29E' }}>
                        <p style={{ fontSize: '16px' }}>No results found</p>
                        <p style={{ fontSize: '13px' }}>Try a different search term</p>
                    </div>
                )}

                {/* Footer */}
                <div style={{
                    marginTop: '40px',
                    padding: '24px',
                    backgroundColor: '#fff',
                    border: '1px solid #E7E5E4',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: '#78716C',
                    lineHeight: '1.8',
                }}>
                    <p style={{ fontWeight: '600', color: '#44403C', marginBottom: '8px' }}>About This List</p>
                    <p>
                        TOEIC 900+, IELTS 7.0+でも日本で生活している限り出会わない単語を集めたリストです。
                        英語圏では子供でも知っている日常単語ですが、日本の英語教育やメディアではほぼ登場しません。
                    </p>
                    <p style={{ marginTop: '8px' }}>
                        * = 特に知らない人が多い重要単語。Phase 1: {totalCount}語収録。
                        Full version (15,000語) は docs/everyday-english-vocabulary.md を参照。
                    </p>
                </div>
            </div>
        </div>
    );
}
