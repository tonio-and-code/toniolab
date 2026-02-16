'use client';

import dynamic from 'next/dynamic';

const DigitalSumitsubo = dynamic(() => import('./DigitalSumitsubo'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-gradient-to-b from-slate-900 to-black rounded-xl flex items-center justify-center">
            <div className="text-slate-500 animate-pulse">Loading 3D...</div>
        </div>
    )
});

interface SumitsuboWrapperProps {
    videoId: string;
}

export default function SumitsuboWrapper({ videoId }: SumitsuboWrapperProps) {
    return <DigitalSumitsubo videoId={videoId} />;
}
