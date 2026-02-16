'use client';

import { useEffect, useState } from 'react';

interface Comment {
  id: string;
  jijiiTweet: string;
  takumiComment: string;
  createdAt: string;
}

export function JijiiTakumiChat() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch('/api/takumi-comments');
        const data = await res.json();
        if (data.success) {
          setComments(data.data);
        }
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
    // 5分ごとに更新
    const interval = setInterval(fetchComments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || comments.length === 0) {
    return null;
  }

  const latestComment = comments[0];

  return (
    <div className="fixed bottom-4 left-4 z-40 w-80 hidden lg:block">
      <div className="bg-gradient-to-b from-[#1a1612] to-[#0d0a08] border border-[#D4AF37]/40 shadow-2xl overflow-hidden">
        {/* ゴールドアクセントライン */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* ヘッダー */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-[#D4AF37]/20">
          <span className="text-xs font-bold text-[#D4AF37] tracking-wide">
            じじい × タクミ
          </span>
          <a
            href="https://twitter.com/korku_jijii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors"
          >
            X
          </a>
        </div>

        {/* 会話エリア */}
        <div className="p-3 space-y-3 max-h-72 overflow-y-auto">
          {/* じじいの発言 */}
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
              <span className="text-sm">👴</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-[#D4AF37]/60 mb-1">コルクじじい</div>
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-2 text-xs text-white/90 leading-relaxed">
                {latestComment.jijiiTweet.length > 80
                  ? latestComment.jijiiTweet.slice(0, 80) + '...'
                  : latestComment.jijiiTweet}
              </div>
            </div>
          </div>

          {/* タクミの返答 */}
          <div className="flex gap-2 flex-row-reverse">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center">
              <span className="text-sm">👷</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-[#10B981]/80 mb-1 text-right">AIタクミ</div>
              <div className="bg-[#10B981]/10 border border-[#10B981]/30 p-2 text-xs text-white/90 leading-relaxed">
                {latestComment.takumiComment}
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="px-3 py-2 border-t border-[#D4AF37]/20 flex items-center justify-between">
          <span className="text-[9px] text-white/40">
            {new Date(latestComment.createdAt).toLocaleDateString('ja-JP', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <a
            href="/crew"
            className="text-[10px] text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors"
          >
            CREWを見る →
          </a>
        </div>

        {/* 下部アクセント */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
      </div>
    </div>
  );
}
