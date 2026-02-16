'use client'

interface AnimatedCraftsmanProps {
  state: 'idle' | 'listening' | 'speaking'
}

export default function AnimatedCraftsman({ state }: AnimatedCraftsmanProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 背景グロー */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
          state === 'speaking' ? 'w-80 h-80 opacity-40' :
          state === 'listening' ? 'w-72 h-72 opacity-30' :
          'w-0 h-0 opacity-0'
        }`}>
          <div className={`w-full h-full rounded-full blur-3xl ${
            state === 'speaking' ? 'bg-[#10B981]' : 'bg-[#D4AF37]'
          }`}></div>
        </div>
      </div>

      {/* メインキャラクター */}
      <div className="relative z-10">
        <div className={`relative transition-all duration-500 ease-out ${
          state === 'listening' ? 'scale-110 craftsman-listening' :
          state === 'speaking' ? 'scale-105 craftsman-speaking' :
          'scale-100'
        }`}>
          {/* 職人画像 */}
          <div className="relative w-full h-full">
            <img
              src="/icons/craftsman.png"
              alt="AI職人タクミ"
              className={`w-full h-full object-contain transition-all duration-500 ${
                state === 'speaking' ? 'drop-shadow-[0_0_30px_rgba(16,185,129,0.8)] brightness-110' :
                state === 'listening' ? 'drop-shadow-[0_0_30px_rgba(212,175,55,0.8)] brightness-110' :
                'drop-shadow-2xl hover:brightness-105 cursor-pointer'
              }`}
            />

            {/* 話している時の口の動き（シンプルな波） */}
            {state === 'speaking' && (
              <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-1.5 h-3 bg-[#252423] rounded-full mouth-wave" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-4 bg-[#252423] rounded-full mouth-wave" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-5 bg-[#252423] rounded-full mouth-wave" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-4 bg-[#252423] rounded-full mouth-wave" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-1.5 h-3 bg-[#252423] rounded-full mouth-wave" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>

          {/* 状態別リングエフェクト */}
          <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
            state === 'listening' ? 'ring-8 ring-[#D4AF37] ring-opacity-60 animate-pulse' :
            state === 'speaking' ? 'ring-8 ring-[#10B981] ring-opacity-60 animate-pulse' :
            'ring-0'
          }`}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes craftsman-listening {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }

        .craftsman-listening {
          animation: craftsman-listening 1.5s ease-in-out infinite;
        }

        @keyframes craftsman-speaking {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.08); }
        }

        .craftsman-speaking {
          animation: craftsman-speaking 0.8s ease-in-out infinite;
        }

        /* 口の波アニメーション */
        @keyframes mouth-wave {
          0%, 100% {
            transform: scaleY(0.6);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(1.2);
            opacity: 1;
          }
        }

        .mouth-wave {
          animation: mouth-wave 0.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
