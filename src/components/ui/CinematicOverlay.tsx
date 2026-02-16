"use client";

import React from "react";
export default function CinematicOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-screen">
            <div className="absolute inset-0">
                {/* 生成されたパーティクル群 */}
                <div className="particles-container w-full h-full relative">
                    {/* Generate 20 static particles via CSS for performance */}
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="particle" style={generateParticleStyle(i)} />
                    ))}
                </div>
            </div>

            <style jsx>{`
        .particle {
          position: absolute;
          background: radial-gradient(circle, #D4AF37 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          animation: float 15s infinite linear;
        }

        @keyframes float {
          0% {
            transform: translateY(110vh) translateX(-20px) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-10vh) translateX(20px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
}

// ランダムなスタイルを生成（サーバーサイドレンダリングとの整合性を保つため、クライアントサイドでのみ実行が望ましいが、
// ここでは簡略化のため固定シード的に分散させるか、Hydration Errorを防ぐためにuseEffect内で生成するのがベスト。
// 今回は「装飾」なので、多少のランダム性は許容しつつ、Reactのルールを守るためstyleタグでランダム値を注入するアプローチをとる。
// しかし、簡便のため関数で生成する。
function generateParticleStyle(i: number) {
    // 決定論的な疑似ランダム（インデックスに基づく）
    const left = ((i * 17) % 100) + "%";
    const size = ((i * 3) % 4) + 2 + "px"; // 2-6px
    const duration = 10 + (i % 10) + "s"; // 10-20s
    const delay = -(i * 1.5) + "s"; // Start at different times

    return {
        left,
        width: size,
        height: size,
        animationDuration: duration,
        animationDelay: delay,
    } as React.CSSProperties;
}
