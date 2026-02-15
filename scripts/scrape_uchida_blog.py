# -*- coding: utf-8 -*-
"""
内田樹ブログスクレイピングツール
http://blog.tatsuru.com/ から記事を取得
"""
import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime

BASE_URL = "http://blog.tatsuru.com/"

def scrape_article(url):
    """個別記事をスクレイピング"""
    try:
        print(f"Fetching: {url}")
        response = requests.get(url, timeout=10)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.content, 'html.parser')

        # タイトル取得
        title_elem = soup.find('h1', class_='entry-title')
        if not title_elem:
            title_elem = soup.find('h2', class_='entry-title')
        title = title_elem.text.strip() if title_elem else "無題"

        # 本文取得
        content_elem = soup.find('div', class_='entry-content')
        if not content_elem:
            content_elem = soup.find('div', class_='post')

        if content_elem:
            # 不要な要素を削除
            for script in content_elem(['script', 'style', 'iframe']):
                script.decompose()

            content = content_elem.get_text(separator='\n', strip=True)
        else:
            content = ""

        # 日付取得
        date_elem = soup.find('time', class_='entry-date')
        if not date_elem:
            date_elem = soup.find('span', class_='date')
        date = date_elem.text.strip() if date_elem else ""

        return {
            "title": title,
            "content": content,
            "date": date,
            "url": url,
            "scraped_at": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

def get_article_links(page_num=1):
    """記事一覧ページからリンクを取得"""
    try:
        if page_num == 1:
            url = BASE_URL
        else:
            url = f"{BASE_URL}page/{page_num}"

        print(f"Fetching article list from: {url}")
        response = requests.get(url, timeout=10)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.content, 'html.parser')

        # 記事リンクを取得
        links = []
        for article in soup.find_all('article'):
            link_elem = article.find('a', href=True)
            if link_elem and 'http://blog.tatsuru.com/' in link_elem['href']:
                links.append(link_elem['href'])

        # 代替方法：h2やh3のリンク
        if not links:
            for heading in soup.find_all(['h2', 'h3']):
                link = heading.find('a', href=True)
                if link and 'http://blog.tatsuru.com/' in link['href']:
                    links.append(link['href'])

        return list(set(links))  # 重複削除
    except Exception as e:
        print(f"Error getting links from page {page_num}: {e}")
        return []

def scrape_blog(target_count=50):
    """ブログから指定数の記事を取得"""
    articles = []
    page = 1
    max_pages = 10  # 最大10ページまで

    while len(articles) < target_count and page <= max_pages:
        print(f"\n=== Page {page} ===")
        links = get_article_links(page)

        if not links:
            print(f"No links found on page {page}, stopping")
            break

        for link in links:
            if len(articles) >= target_count:
                break

            article = scrape_article(link)
            if article and article['content']:
                articles.append(article)
                print(f"Scraped: {article['title']} ({len(articles)}/{target_count})")

            time.sleep(1)  # 礼儀正しくスクレイピング

        page += 1
        time.sleep(2)

    return articles

if __name__ == "__main__":
    print("=== 内田樹ブログスクレイピング開始 ===\n")

    # 50記事を取得
    articles = scrape_blog(target_count=50)

    # JSON保存
    output_file = "uchida_blog_articles.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)

    print(f"\n=== 完了 ===")
    print(f"取得記事数: {len(articles)}")
    print(f"保存先: {output_file}")

    # サマリー表示
    total_chars = sum(len(a['content']) for a in articles)
    print(f"総文字数: {total_chars:,} 文字")
    print(f"推定トークン数: {int(total_chars / 0.75):,} トークン")
    print(f"推定学習コスト: ${int(total_chars / 0.75) * 3.0 / 1000000:.2f}")
