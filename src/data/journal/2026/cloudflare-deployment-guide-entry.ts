/**
 * 120 - ウェブサイトを公開するまでの全工程
 * toniolab.comのデプロイ作業を通して学んだインフラの基礎知識を体系的に解説
 */

import { JournalEntry } from '../types';

export const cloudflareDeploymentGuideEntry: JournalEntry = {
    id: '120',
    date: '2026-02-16',
    title: 'ウェブサイトを公開するまでの全工程',
    summary: 'toniolab.comのデプロイ作業を通して、Cloudflare Workers、GitHub Actions、D1データベース、DNS設定、バンドルサイズ制限まで、ウェブサイト公開に必要なインフラ知識を体系的に解説。',
    businessTags: ['インフラ', 'デプロイ', '技術解説'],
    techTags: ['Cloudflare Workers', 'GitHub Actions', 'D1', 'CI/CD', 'DNS', 'Next.js'],
    readTime: 18,
    featured: true,
    conversation: `## はじめに -- この記事の目的

toniolab.comを公開した。

「コードを書いて、ネットで見れるようにする」

たったこれだけのことに丸2日かかった。

なぜか。**コードを書く** と **ネットで見れるようにする** は、全く別のスキルだから。

プログラミングの解説は無限にある。でも「書いたコードをどうやってインターネットに出すのか」を体系的に解説してる記事は意外と少ない。

この記事は、toniolab.comのデプロイ作業を通じて学んだことを、初心者向けに整理したもの。自分のための勉強ノートでもある。

---

## 第1章 -- デプロイとは何か

### 「ローカル」と「本番」

コードを書いているとき、ブラウザで http://localhost:3000 にアクセスして動作確認する。これは**ローカル環境**。自分のPCの中だけで動いている。

この状態では他の誰もアクセスできない。

**デプロイ**とは、このローカルで動いているアプリケーションを、インターネット上のサーバーに配置して、世界中の誰でもアクセスできるようにすること。

### デプロイに必要な3つの要素

1. **コード** -- 動くアプリケーション（Next.js、React等）
2. **サーバー** -- コードを実行する場所（Vercel、Cloudflare、AWS等）
3. **ドメイン** -- アクセスするためのURL（toniolab.com等）

この3つを繋ぐ作業がデプロイ。

---

## 第2章 -- サーバーの選択肢

### Vercel -- 最も簡単

iwasaki-naisou.comはVercelで動いている。

Vercelの特徴:
- GitHubにプッシュするだけで自動デプロイ
- Next.jsの開発元なので相性が完璧
- 設定ほぼゼロ
- 無料枠が大きい

**欠点**: Cloudflare D1のようなエッジデータベースとの統合が面倒。

### Cloudflare -- 速いが複雑

toniolab.comはCloudflareで動いている。

Cloudflareの特徴:
- 世界300以上のエッジロケーション
- D1データベースがネイティブに使える
- Workerとして動くのでレスポンスが速い

**欠点**: 設定が多い。Next.jsを動かすのに変換ツールが必要。

### 重要な違い

Vercelは「そのまま動く」。Cloudflareは「変換して動かす」。

Next.jsはもともとNode.jsサーバーで動くように作られている。Cloudflare Workersは独自のランタイム（V8 isolate）で動く。**環境が違う**。

だから \`@opennextjs/cloudflare\` という変換ツールが必要。これがNext.jsのコードをCloudflare Workerで動く形に変換する。

---

## 第3章 -- Cloudflare Workers vs Pages

Cloudflareには2つのデプロイ方式がある。初見では違いがわからない。

### Pages -- 静的ファイル配信

HTMLやCSS、JavaScriptの静的ファイルを配信する。SPAやSSG（Static Site Generation）向け。

イメージ: ファイルを置く棚。置いたものがそのまま配られる。

### Workers -- サーバーサイド実行

コードがリクエストごとに実行される。SSR（Server-Side Rendering）やAPI処理ができる。

イメージ: 注文を受けて料理を作る厨房。リクエストに応じて動的にレスポンスを生成する。

### toniolab.comがWorkersを使う理由

Next.jsはSSRが必要。ページの表示時にサーバーでHTMLを組み立てる処理がある。API（/api/user-phrases等）もサーバーで実行される。

Pagesでは静的ファイルしか配信できないので、SSRやAPIが動かない。

**最初はPagesでデプロイしようとして失敗した。** ページは表示されたがAPIが404を返した。WorkersにSSRワーカーがいなかったから。

### wrangler.toml -- Workers設定ファイル

\`\`\`toml
name = "toniolab"
main = ".open-next/worker.js"
compatibility_date = "2024-11-27"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"

[[d1_databases]]
binding = "DB"
database_name = "iwasaki-phrases"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
\`\`\`

各行の意味:
- **name**: Worker名。Cloudflareダッシュボードに表示される
- **main**: 実行されるJavaScriptファイル。opennextjsが生成する
- **compatibility_flags**: Node.jsのAPIを使えるようにするフラグ
- **[assets]**: 静的ファイル（CSS、画像等）の置き場所
- **[[d1_databases]]**: D1データベースの接続設定

---

## 第4章 -- CI/CD -- 自動デプロイの仕組み

### CI/CDとは

**CI** = Continuous Integration（継続的インテグレーション）
**CD** = Continuous Deployment（継続的デプロイ）

簡単に言うと: **コードをプッシュしたら自動でビルドしてデプロイする仕組み**。

手動でやるとこうなる:
1. コードを書く
2. \`npm run build\` でビルド
3. ビルド結果をサーバーにアップロード
4. サーバーを再起動

CI/CDがあると:
1. コードを書く
2. \`git push\` する
3. 以上。あとは自動。

### GitHub Actions

GitHubが提供するCI/CDサービス。リポジトリに \`.github/workflows/\` ディレクトリを作り、YAMLファイルを置くだけで使える。

\`\`\`yaml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx @opennextjs/cloudflare build
      - run: npx @opennextjs/cloudflare deploy
        env:
          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
\`\`\`

上から順に読む:

1. **on: push: branches: [main]** -- mainブランチにプッシュされたら実行
2. **runs-on: ubuntu-latest** -- GitHubのLinuxサーバーで実行
3. **actions/checkout@v4** -- リポジトリのコードをダウンロード
4. **actions/setup-node@v4** -- Node.js 22をインストール
5. **npm ci** -- パッケージをインストール
6. **opennextjs/cloudflare build** -- Next.jsをCloudflare用にビルド
7. **opennextjs/cloudflare deploy** -- Cloudflareにデプロイ

**env** にある \`secrets.CLOUDFLARE_API_TOKEN\` は、GitHub Settingsで設定する秘密の値。コードに直接書くとセキュリティリスクになるため。

### なぜWindowsではなくGitHub Actionsか

opennextjs-cloudflareのビルドツールはLinux前提で作られている。Windowsでは動かない。

GitHub Actionsは \`ubuntu-latest\`（Linux）で動くので、Windowsの開発マシンからでもLinux上でビルド・デプロイできる。

**これがCI/CDの大きなメリットの一つ**: 開発環境とデプロイ環境の違いを吸収できる。

---

## 第5章 -- D1データベース

### D1とは

CloudflareのエッジSQLデータベース。SQLiteベースで、Workerから直接アクセスできる。

普通のWebアプリ: アプリ → インターネット → データベースサーバー
CloudflareのD1: アプリ（Worker） → 同じエッジロケーションのD1

データベースが物理的に近い場所にあるのでレスポンスが速い。

### アクセス方法: バインディング vs REST API

**バインディング（直接接続）:**
WorkerのコードからD1に直接アクセス。最速。ただしWorker内部からしか使えない。

**REST API（HTTP経由）:**
どこからでもHTTPリクエストでD1にアクセス。APIトークンが必要。

toniolab.comはREST APIを使っている。理由: 元々Vercel（iwasaki-naisou.com）からもアクセスする設計だったため。

### Worker Secrets -- 秘密情報の管理

データベースにアクセスするにはAPIトークンが必要。これをコードに直接書いてはいけない。GitHubに公開されてしまう。

**Worker Secret**: Workerの環境変数として安全に保存する仕組み。

\`\`\`bash
echo "YOUR_TOKEN" | npx wrangler secret put CLOUDFLARE_API_TOKEN
\`\`\`

コード内では \`process.env.CLOUDFLARE_API_TOKEN\` で参照する。

### APIトークンの権限

Cloudflare APIトークンには細かい権限設定がある。

今回の失敗: 最初に作ったトークンに **Workers** の権限しかなく、**D1** の権限がなかった。

結果: Workerは動くがデータベースにアクセスできない。APIが「account not authorized」エラーを返す。

教訓: **トークン作成時に必要な権限を全て付与する。足りない権限は後から追加できない。新しいトークンを作り直す必要がある。**

---

## 第6章 -- Workerサイズ制限

### 無料プランの壁: 3 MiB

Cloudflare Workersの無料プランでは、Workerの圧縮後サイズが **3 MiB（約3.07 MB）** に制限されている。

有料プラン（$5/月）では **10 MiB** まで。

### なぜサイズが大きくなるのか

Next.jsアプリをWorkerにすると、全ページのSSRコードが1つの \`handler.mjs\` ファイルにバンドルされる。

ページが多い = バンドルが大きい = 制限に引っかかる。

最初のデプロイ: **gzip 3,471 KiB** → 制限超え
不要ファイル削除後: **gzip 3,160 KiB** → まだ超え
さらに削除後: **gzip 2,966 KiB** → 制限内

### 何を削ったか

1. **世界地図ページ6個**: 大きなTopoJSONデータ（739KB）を含む
2. **業務用コンポーネント170個**: 請求書、工程表、顧客管理等。英語学習に不要
3. **未使用データファイル40個**: 料理日記、健康ジャーナル等
4. **プロトタイプページ13個**: 古いダッシュボード、レビュー機能等

**削除の判断基準**: ページから import されていないコンポーネント・データは全てバンドルから除外できる。grepで依存関係を確認してから削除する。

### 重要な教訓

サイズ制限は無料プランの宿命。対策:

1. **不要なコードを入れない**: 使わないページ・コンポーネントは削除
2. **大きなデータファイルに注意**: JSONの地図データ等は特に重い
3. **有料プランの検討**: $5/月で10 MiBまで。3 MiBがきつい場合は現実的
4. **バンドル分析**: どのファイルが大きいかを確認してから最適化する

---

## 第7章 -- DNS とカスタムドメイン

### ドメインとは

toniolab.com は**ドメイン名**。人間が覚えやすいWebサイトの住所。

実際のサーバーはIPアドレス（例: 104.21.23.45）で特定される。ドメイン名をIPアドレスに変換するのが **DNS**（Domain Name System）。

### ドメインの設定手順

1. **ドメイン購入**: Cloudflare Registrar等で取得（年$10程度）
2. **DNSレコード設定**: ドメインがどのサーバーを指すか設定
3. **Workers側の設定**: このドメインのリクエストを受け付けるよう設定

Cloudflareでは、Workers設定画面の「Custom Domains」からドメインを追加する。DNS設定が自動で行われる。

### 作業の流れ

toniolab.comの場合:
1. Cloudflare Registrarでドメイン取得済み
2. Workers設定 → Routes → Custom Domains → toniolab.com を追加
3. SSL証明書が自動発行
4. https://toniolab.com でアクセス可能に

---

## 第8章 -- トラブルシューティング実録

今回実際に踏んだエラーとその解決策。

### エラー1: Pages デプロイで404

**症状**: ページは表示されるがAPIが404
**原因**: PagesモードではSSRワーカーがデプロイされない
**解決**: PagesからWorkersに切り替え

### エラー2: GitHub push が拒否される

**症状**: \`.github/workflows/\` を含むプッシュが rejected
**原因**: GitHubのPersonal Access Tokenに \`workflow\` スコープがない
**解決**: GitHubの Settings → Developer settings → Personal access tokens で workflow スコープを追加

### エラー3: D1が空のデータを返す

**症状**: APIは200を返すがフレーズ数が0
**原因**: Worker SecretにCLOUDFLARE_API_TOKENが設定されていない
**解決**: \`wrangler secret put\` で設定

### エラー4: D1アクセスが「account not authorized」

**症状**: APIが認証エラー
**原因**: APIトークンにD1の権限がない（Workersの権限のみ）
**解決**: D1 Edit権限付きの新しいトークンを作成

### エラー5: Worker サイズ超過

**症状**: デプロイ時に「exceeded size limit of 3 MiB」
**原因**: 全ページが1つのバンドルにまとまり、圧縮後3 MiB超え
**解決**: 不要なページ・コンポーネント・データを削除して2,966 KiBまで圧縮

### エラー6: TypeScript型エラーでビルド失敗

**症状**: \`declare global\` の Window 拡張が conflict
**原因**: 複数ファイルで同じプロパティのoptional修飾子が不一致（\`YG:\` vs \`YG?:\`）
**解決**: next.config.ts に \`ignoreBuildErrors: true\` を追加（iwasaki側と同じ設定）

---

## 第9章 -- 全体像の整理

### デプロイパイプラインの流れ

\`\`\`
ローカルでコードを編集
      ↓
git push origin main
      ↓
GitHub Actions が起動（ubuntu-latest）
      ↓
npm ci（パッケージインストール）
      ↓
opennextjs/cloudflare build（Next.js→Worker変換）
      ↓
opennextjs/cloudflare deploy（Cloudflareにアップロード）
      ↓
Worker更新 → toniolab.com に反映
\`\`\`

### 関係する技術の地図

- **Next.js**: アプリケーションフレームワーク
- **opennextjs-cloudflare**: Next.js→Cloudflare変換ツール
- **Cloudflare Workers**: サーバーレス実行環境
- **Cloudflare D1**: エッジSQLデータベース
- **GitHub Actions**: CI/CDパイプライン
- **GitHub Secrets**: 秘密情報の安全な保管
- **Worker Secrets**: ランタイムの環境変数
- **DNS**: ドメインとサーバーの紐付け
- **wrangler**: Cloudflareの管理CLI

### 覚えておくべき数字

| 項目 | 値 |
|------|-----|
| Worker無料サイズ上限 | 3 MiB（gzip後） |
| Worker有料サイズ上限 | 10 MiB（gzip後） |
| Workers有料プラン | $5/月 |
| GitHub Actions無料枠 | 2,000分/月 |
| D1無料枠 | 5 GB ストレージ |
| ビルド時間（目安） | 約40秒 |
| デプロイ時間（目安） | 約15秒 |

---

## おわりに

Vercelなら \`git push\` だけで済む作業に、Cloudflareでは2日かかった。

でも2日で学んだこと:
- Workers/Pagesの違い
- CI/CDの仕組み
- データベースの認証と権限
- バンドルサイズの最適化
- DNSとドメインの設定

Vercelの「何もしなくても動く」は魔法じゃない。裏で同じことが自動化されてるだけ。

自分でやると面倒。でも何が起きてるか全部わかる。

**面倒なことを一度やっておくと、次から何が壊れても直せる。**

これがインフラを理解するということ。`,

    englishSummary: {
        title: "How to Deploy a Website: The Complete Infrastructure Guide",
        readTime: 18,
        sections: [
            {
                heading: "Why This Article Exists",
                paragraphs: [
                    "OK so I just spent two full days deployin' a website. Two days. And like, I'm not talkin' about buildin' the app -- the app was already done. I'm talkin' about gettin' it onto the internet so people can actually see it.",
                    "And here's the thing -- nobody really teaches you this part. There's a million tutorials on how to write React components or whatever. But the whole 'OK my code works locally, now how do I make it live?' part? That's weirdly hard to find good explanations for.",
                    "So this is my attempt at writin' down everything I learned. For myself, mostly. 'Cause I know I'm gonna forget all of this in like a week."
                ]
            },
            {
                heading: "What Deploying Actually Means",
                paragraphs: [
                    "So when you're writin' code, you open your browser and go to localhost:3000, right? That's your local environment. It's runnin' on your own computer. Nobody else can see it.",
                    "Deploying means takin' that thing that works on your laptop and puttin' it on a server somewhere on the internet. So anyone with the URL can access it. That's literally it.",
                    "You need three things. The code, obviously. A server to run it on -- could be Vercel, Cloudflare, AWS, whatever. And a domain name so people know where to go. Like toniolab.com. You gotta connect all three."
                ]
            },
            {
                heading: "Vercel vs Cloudflare -- Why I Picked the Hard One",
                paragraphs: [
                    "So my other site, iwasaki-naisou.com, runs on Vercel. And Vercel is like... stupid easy. You push to GitHub, and boom, it's deployed. No config. No nothin'. It just works. 'Cause Vercel literally made Next.js, so they know exactly how to run it.",
                    "But toniolab.com is on Cloudflare. And Cloudflare is... not easy. The thing is, Next.js was built for Node.js servers. Cloudflare Workers run on a completely different runtime called V8 isolates. So you need this translation tool called opennextjs-cloudflare to convert your Next.js app into something Cloudflare can actually run.",
                    "Why pick Cloudflare then? 'Cause it has D1 -- this edge database that sits right next to the worker. Same physical location. Super fast. And both sites share the same database, so they need to both talk to D1."
                ]
            },
            {
                heading: "Workers vs Pages -- I Picked Wrong First",
                paragraphs: [
                    "OK so Cloudflare has two ways to deploy stuff. Pages and Workers. And this tripped me up real bad.",
                    "Pages is for static files. HTML, CSS, JavaScript -- you upload 'em and they get served. It's like a bookshelf. You put books on it, people take books off it. Simple.",
                    "Workers actually run code. Every time someone visits your site, the worker executes and generates a response. It's like a kitchen -- someone orders food, the kitchen makes it fresh.",
                    "I tried Pages first. Big mistake. The pages showed up fine but all the API routes returned 404. 'Cause Pages can't run server-side code. There's no kitchen, just a bookshelf. You can't order food from a bookshelf.",
                    "Switched to Workers and everything worked. Lesson learned: if your app has any server-side rendering or API routes, you need Workers."
                ]
            },
            {
                heading: "CI/CD -- Making Deployment Automatic",
                paragraphs: [
                    "CI/CD stands for Continuous Integration, Continuous Deployment. Fancy words for a simple idea: you push code, and it automatically builds and deploys. No manual steps.",
                    "Without CI/CD, you'd have to build locally, then manually upload files to the server, then restart things. Every. Single. Time. That gets old real fast.",
                    "GitHub Actions is what I'm usin'. You create a YAML file in your repo at .github/workflows/ and describe what should happen when you push. Install Node, run the build, deploy to Cloudflare. GitHub runs it all on their Linux servers.",
                    "And here's a key thing -- my development machine runs Windows. The Cloudflare build tools don't work on Windows. But GitHub Actions runs on Linux. So the CI/CD pipeline actually solves a platform compatibility problem too. I code on Windows, it builds on Linux. Beautiful."
                ]
            },
            {
                heading: "Secrets -- Don't Put Passwords in Your Code",
                paragraphs: [
                    "This part is super important and a lot of beginners mess it up. You need API tokens to deploy to Cloudflare and to access the database. These are basically passwords.",
                    "If you put 'em directly in your code and push to GitHub, anyone can see 'em. That's a security disaster. Someone could delete your database or rack up charges on your account.",
                    "So there are two places to store secrets. GitHub Secrets -- for the CI/CD pipeline. These get injected as environment variables when your workflow runs. And Worker Secrets -- for runtime. These are available to your Worker code when it's actually handlin' requests.",
                    "I screwed this up twice. First time, I forgot to set the Worker secret for the database token. Everything deployed fine but the API returned empty data. Second time, my token had Workers permission but not D1 permission. Got an 'account not authorized' error. You can't add permissions to an existing token -- you gotta make a whole new one."
                ]
            },
            {
                heading: "The 3 MiB Wall -- Size Limits Are Real",
                paragraphs: [
                    "This one almost killed me. Cloudflare's free plan has a 3 megabyte size limit for Workers. After gzip compression. And my app was 3.4 megabytes.",
                    "Why so big? 'Cause when Next.js gets bundled for Cloudflare, ALL your pages get crammed into one single JavaScript file. More pages equals bigger file. I'd copied over like 200 files from the original site, includin' a ton of business components and map data that the English learning app doesn't even use.",
                    "So I had to start deletin' stuff. World map pages with huge JSON data -- gone. 170 business components like invoice managers and project schedules -- gone. Old prototype pages -- gone. Got it down from 3,471 KB to 2,966 KB. Just barely under the limit.",
                    "The lesson here is pretty clear. Every file you add to a Cloudflare Worker project has a cost. You can't just copy everything and hope for the best. You gotta be intentional about what goes in."
                ]
            },
            {
                heading: "DNS -- Connecting Your Domain",
                paragraphs: [
                    "Last piece of the puzzle. You've got your Worker runnin'. But it's at some ugly URL like toniolab.engineworks-iwasaki.workers.dev. You want toniolab.com.",
                    "DNS is the system that translates human-readable domain names into server addresses. When someone types toniolab.com, DNS tells their browser where to find the actual server.",
                    "With Cloudflare, you just go to Workers settings, add a Custom Domain, type in toniolab.com, and it handles the DNS records and SSL certificate automatically. This was actually the easiest part of the whole process. Like two clicks."
                ]
            },
            {
                heading: "Every Error I Hit (And How I Fixed Them)",
                paragraphs: [
                    "Lemme run through the actual errors real quick 'cause these are the things that eat up your time.",
                    "Error one: Pages deployment gives 404 on APIs. Fix: switch to Workers mode. Error two: git push gets rejected when pushin' workflow files. Fix: add the 'workflow' scope to your GitHub Personal Access Token. Error three: database returns empty. Fix: set the API token as a Worker secret.",
                    "Error four: database says 'account not authorized.' Fix: the token needs D1 Edit permission, not just Workers permission. Make a new token. Error five: Worker exceeds 3 MiB. Fix: delete unused pages and components until it fits.",
                    "Error six: TypeScript build fails on global Window type declarations. Different files had conflicting optional modifiers. Fix: add ignoreBuildErrors in next.config. Not the cleanest fix but it matches the original site's config."
                ]
            },
            {
                heading: "The Big Picture",
                paragraphs: [
                    "So here's the whole flow. You write code on your laptop. You push to GitHub. GitHub Actions kicks off on a Linux server. It installs dependencies, builds the Next.js app, converts it for Cloudflare, and deploys it as a Worker. The Worker starts handlin' requests. DNS points your domain to the Worker. Users visit toniolab.com and see the app.",
                    "Every piece in that chain can break independently. And when it does, you need to know which piece broke and how to fix it. That's what infrastructure knowledge is.",
                    "On Vercel, all of this is hidden. Push and it works. Magic. But when somethin' breaks, you're helpless 'cause you don't know what's happenin' under the hood.",
                    "Doin' it manually on Cloudflare took two days. It was frustrating. I messed up like six different things. But now I know exactly what happens between 'git push' and a live website. And next time somethin' breaks, I'll know where to look."
                ]
            },
            {
                heading: "Numbers Worth Remembering",
                paragraphs: [
                    "Quick reference. Free Worker size limit: 3 MiB after gzip. Paid plan -- five bucks a month -- gets you 10 MiB. GitHub Actions gives you 2,000 minutes per month for free. D1 gives you 5 gigs of storage for free. A typical build takes about 40 seconds. Deploy takes about 15.",
                    "And the biggest number: two days. That's how long it takes to learn this stuff the first time. But only the first time."
                ]
            }
        ]
    },

    conversationData: {
        english: [
            { speaker: 'male', text: "So I just went through this whole deployment thing for toniolab.com and I feel like I need to write everything down before I forget it all." },
            { speaker: 'female', text: "Oh yeah? How bad was it?" },
            { speaker: 'male', text: "Two days. Two full days just to get a website live. And the app was already built. This was just the 'put it on the internet' part." },
            { speaker: 'female', text: "That seems... excessive. Can't you just push to GitHub and it deploys automatically?" },
            { speaker: 'male', text: "That's Vercel. Vercel is like magic -- push and done. But I'm deployin' to Cloudflare this time, and Cloudflare is a whole different beast." },
            { speaker: 'female', text: "Why Cloudflare then?" },
            { speaker: 'male', text: "D1 database. It's this edge database that sits right next to the worker. Both sites share the same database so it made sense." },
            { speaker: 'female', text: "OK start from the beginning. What even is deploying?" },
            { speaker: 'male', text: "Right, so when you're coding, everything runs on localhost -- your own machine. Nobody else can see it. Deploying means putting your app on a server somewhere on the internet so anyone with the URL can access it." },
            { speaker: 'female', text: "You need three things right? The code, a server, and a domain?" },
            { speaker: 'male', text: "Exactly. And connecting those three is where all the pain happens. Especially on Cloudflare." },
            { speaker: 'female', text: "What's the difference between Cloudflare Workers and Pages? I keep hearin' both." },
            { speaker: 'male', text: "OK so Pages is like a bookshelf. You put static files on it and people grab 'em. Workers is like a kitchen -- it actually runs code and generates responses on the fly." },
            { speaker: 'female', text: "And you need the kitchen 'cause Next.js does server-side rendering?" },
            { speaker: 'male', text: "Yep. I tried Pages first, big mistake. Pages loaded fine but all the API routes returned 404. No server-side processing at all. You can't order food from a bookshelf." },
            { speaker: 'female', text: "Ha. OK so Workers it is. What about the CI/CD stuff?" },
            { speaker: 'male', text: "GitHub Actions. You make a YAML file that describes what happens when you push. Install Node, build the app, deploy to Cloudflare. GitHub runs it all on Linux servers." },
            { speaker: 'female', text: "And that matters 'cause your machine is Windows?" },
            { speaker: 'male', text: "Exactly! The Cloudflare build tools don't even work on Windows. So GitHub Actions solves a platform problem too. I write code on Windows, it builds and deploys on Linux. Super useful." },
            { speaker: 'female', text: "What about secrets? Like API tokens and stuff?" },
            { speaker: 'male', text: "Two kinds. GitHub Secrets for the CI/CD pipeline -- they get injected as environment variables during the build. And Worker Secrets for runtime -- available to your code when it's actually handling requests." },
            { speaker: 'female', text: "And you messed those up?" },
            { speaker: 'male', text: "Twice. First I forgot to set the Worker secret. Everything deployed fine but the API returned empty data. Then my token had Workers permission but not D1 permission. Got 'account not authorized.' Had to make a whole new token." },
            { speaker: 'female', text: "You can't just add permissions to an existing token?" },
            { speaker: 'male', text: "Nope. Gotta make a new one. Learned that the hard way." },
            { speaker: 'female', text: "What about the size limit thing? That sounded brutal." },
            { speaker: 'male', text: "Dude. Free plan is 3 MiB after gzip. My app was 3.4 MiB. Just barely over. 'Cause when Next.js gets bundled for Cloudflare, ALL your pages go into one file." },
            { speaker: 'female', text: "So you had to start cuttin' stuff?" },
            { speaker: 'male', text: "Yeah. Deleted 200 files. World maps with huge JSON data, business components, old prototypes. Got it from 3,471 KB down to 2,966 KB. Barely under the limit." },
            { speaker: 'female', text: "That's tight. What happens if you add more pages later?" },
            { speaker: 'male', text: "Either delete somethin' else or upgrade to the paid plan. Five bucks a month gets you 10 MiB. Which is honestly pretty reasonable." },
            { speaker: 'female', text: "And the domain setup?" },
            { speaker: 'male', text: "That was actually the easiest part. Workers settings, Custom Domains, type in toniolab.com, done. Two clicks. SSL certificate auto-generated. Kinda anticlimactic after everything else." },
            { speaker: 'female', text: "So the whole flow is: push code, GitHub Actions builds it, deploys to Cloudflare Worker, DNS points the domain to it?" },
            { speaker: 'male', text: "That's it. And every single one of those steps can break independently. That's why you need to understand all of 'em." },
            { speaker: 'female', text: "Worth the two days?" },
            { speaker: 'male', text: "Honestly? Yeah. On Vercel everything's magic. But when somethin' breaks you're helpless. Now I know exactly what happens between git push and a live website. Next time somethin' breaks, I'll know where to look." },
            { speaker: 'female', text: "Two days to learn it, but only the first time." },
            { speaker: 'male', text: "Exactly. Only the first time." }
        ],
        japanese: [
            { speaker: 'male', text: "toniolab.comのデプロイ作業を全部やったから、忘れる前に書いておきたくて。" },
            { speaker: 'female', text: "そんなに大変だった？" },
            { speaker: 'male', text: "丸2日かかった。アプリはもう出来てたのに。インターネットに出すだけの作業で2日。" },
            { speaker: 'female', text: "それは...かかりすぎじゃない？GitHubにプッシュしたら自動でデプロイされないの？" },
            { speaker: 'male', text: "Vercelならそう。プッシュするだけで終わり。でも今回はCloudflareで、こっちは全然違う世界。" },
            { speaker: 'female', text: "なんでCloudflareにしたの？" },
            { speaker: 'male', text: "D1データベース。Workerのすぐ隣にあるエッジデータベース。両方のサイトで同じDBを使うから。" },
            { speaker: 'female', text: "じゃあ最初から説明して。デプロイって何？" },
            { speaker: 'male', text: "コード書いてるときはlocalhostで動いてるよね。自分のPCの中だけ。デプロイはそれをインターネット上のサーバーに置いて、誰でもアクセスできるようにすること。" },
            { speaker: 'female', text: "コード、サーバー、ドメインの3つが必要ってこと？" },
            { speaker: 'male', text: "そう。その3つを繋ぐのが大変。特にCloudflareだと。" },
            { speaker: 'female', text: "Cloudflare WorkersとPagesの違いは？両方よく聞くけど。" },
            { speaker: 'male', text: "Pagesは本棚。静的ファイルを置いて、来た人がそのまま持っていく。Workersは厨房。注文を受けてその場で料理を作る。" },
            { speaker: 'female', text: "Next.jsはSSRが必要だから厨房が要るってこと？" },
            { speaker: 'male', text: "そう。最初Pagesで試して大失敗。ページは表示されるけどAPIが全部404。本棚に料理は注文できない。" },
            { speaker: 'female', text: "なるほどね。じゃあCI/CDの話は？" },
            { speaker: 'male', text: "GitHub Actions。YAMLファイルにプッシュ時の手順を書く。Nodeインストール、ビルド、デプロイ。全部GitHubのLinuxサーバーで動く。" },
            { speaker: 'female', text: "Windowsだから重要なんだよね？" },
            { speaker: 'male', text: "そう！CloudflareのビルドツールがそもそもWindowsで動かない。GitHub ActionsはLinuxで走るから、Windows環境からでもデプロイできる。" },
            { speaker: 'female', text: "シークレットは？APIトークンとか。" },
            { speaker: 'male', text: "2種類ある。GitHub Secretsがビルド時用。Worker Secretsがランタイム用。コードにリクエストが来たときに使える。" },
            { speaker: 'female', text: "それで失敗したんでしょ？" },
            { speaker: 'male', text: "2回やらかした。最初はWorker Secretの設定忘れ。APIがデータ0件。次はトークンにD1の権限がなくてaccount not authorizedエラー。新しいトークン作り直し。" },
            { speaker: 'female', text: "既存のトークンに権限追加できないの？" },
            { speaker: 'male', text: "できない。新規作成のみ。これは痛い教訓だった。" },
            { speaker: 'female', text: "サイズ制限の話は？あれキツそうだった。" },
            { speaker: 'male', text: "無料プランはgzip後3 MiBまで。俺のアプリは3.4 MiB。ギリギリオーバー。Next.jsを全部1ファイルにバンドルするから。" },
            { speaker: 'female', text: "削ったの？" },
            { speaker: 'male', text: "200ファイル消した。地図データ、業務用コンポーネント、古いプロトタイプ。3,471KBから2,966KBまで。ギリギリセーフ。" },
            { speaker: 'female', text: "今後ページ増やしたら？" },
            { speaker: 'male', text: "何か消すか、有料プランにするか。月5ドルで10 MiBまで使える。正直アリだと思う。" },
            { speaker: 'female', text: "ドメイン設定は？" },
            { speaker: 'male', text: "実はこれが一番簡単だった。Workers設定からCustom Domainsでtoniolab.com追加。2クリック。SSL証明書も自動。他が大変だったから拍子抜け。" },
            { speaker: 'female', text: "全体の流れは、プッシュ→GitHub Actionsがビルド→Cloudflare Workerにデプロイ→DNSでドメイン接続？" },
            { speaker: 'male', text: "そう。その全ステップが独立して壊れる。だから全部理解しとく必要がある。" },
            { speaker: 'female', text: "2日かけた価値はあった？" },
            { speaker: 'male', text: "正直あった。Vercelは全部魔法で動く。でも壊れたとき何も直せない。今はgit pushからサイト公開まで全部わかる。次壊れたら直せる。" },
            { speaker: 'female', text: "2日かかるのは最初だけだもんね。" },
            { speaker: 'male', text: "そう。最初だけ。" }
        ],
        tone: 'casual' as const,
        generatedAt: new Date('2026-02-16')
    }
};
