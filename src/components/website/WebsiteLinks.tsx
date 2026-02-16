import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const websites = [
  {
    name: 'イワサキ内装 公式サイト',
    description: '施工事例・サービス紹介',
    url: '/',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop'
  },
  {
    name: '職人ネットワーク実験',
    description: '職人Link構想（開発中）',
    url: '/technology/craftsmen',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&auto=format&fit=crop'
  },
  {
    name: 'neocareer風デザイン',
    description: 'スクロールアニメーション',
    url: '/test2',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&auto=format&fit=crop'
  },
  {
    name: 'GIG風デザイン',
    description: 'パララックス・GSAP',
    url: '/test3',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop'
  },
  {
    name: 'BALANCe Magazine風',
    description: 'マガジンレイアウト',
    url: '/test5',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&auto=format&fit=crop'
  },
]

export default function WebsiteLinks() {
  return (
    <div className="bg-gray-50 p-6 border border-[#DAE2E8]">
      <h3 className="text-lg font-black mb-4 border-b-2 border-[#D4AF37] pb-2">
        イワサキ内装 Webサイト
      </h3>
      <div className="space-y-4">
        {websites.map((site, index) => (
          <Link
            key={index}
            href={site.url}
            className="group block hover:bg-white transition-colors p-3 -m-3"
          >
            <div className="flex gap-3 items-start">
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-gray-200">
                <img
                  src={site.image}
                  alt={site.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold mb-1 group-hover:text-[#10B981] transition-colors flex items-center gap-1">
                  {site.name}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-gray-600">{site.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
