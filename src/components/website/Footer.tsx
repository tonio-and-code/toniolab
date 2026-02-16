import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import GuestBook from './GuestBook'

export default function Footer() {
  const footerNavigation = {
    company: [
      { name: '会社概要', href: '/corporate/about' },
      { name: '企業理念', href: '/corporate/philosophy' },
      { name: '沿革', href: '/corporate/history' },
    ],
    services: [
      { name: '内装工事', href: '/services/interior' },
      { name: 'リフォーム', href: '/services/reform' },
      { name: 'バリアフリー', href: '/services/barrier-free' },
      { name: '店舗デザイン', href: '/services/shop-design' },
    ],
    support: [
      { name: 'お知らせ', href: '/news' },
      { name: 'お問い合わせ', href: '/contact' },
      { name: 'プライバシーポリシー', href: '/privacy' },
    ],
    recommend: [
      { name: '永浜クロス', href: '/partners/nagahama-cloth' },
    ],
    social: [
      { name: 'Facebook', href: '#', icon: Facebook },
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'Instagram', href: '#', icon: Instagram },
      { name: 'LinkedIn', href: '#', icon: Linkedin },
    ],
  }

  return (
    <footer className="bg-[#0a0a0a] relative overflow-hidden" aria-labelledby="footer-heading">
      {/* Decorative Gradient Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32 relative z-10">

        {/* Top Section: CTA & Brand */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 border-b border-white/5 pb-20">
          <div>
            <h3 className="text-[10px] tracking-[0.3em] text-[#D4AF37] mb-6 uppercase font-serif">Contact Us</h3>
            <p className="text-3xl md:text-4xl font-light text-white leading-relaxed font-serif mb-8">
              空間に、<br />
              <span className="font-bold">「意識」</span>と<span className="font-bold">「色彩」</span>を。<br />
              <span className="text-xl text-white/60 mt-4 block font-sans">お問い合わせ・ご相談はこちらから</span>
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-bold tracking-widest hover:bg-[#D4AF37] transition-all duration-300"
            >
              CONTACT FORM <span className="text-lg">→</span>
            </Link>
          </div>
          <div className="flex flex-col justify-end items-start text-left lg:items-end lg:text-right">
            <div className="text-5xl md:text-6xl font-black text-white/5 mb-4 tracking-tighter select-none">IWASAKI</div>
            <address className="text-white/60 text-sm leading-7 font-light not-italic">
              <span className="block text-white text-base font-bold mb-2 tracking-widest">有限会社イワサキ内装</span>
              〒130-0021<br />
              東京都墨田区緑 1-24-2 タカミビル101<br />
              <a href="tel:0356387402" className="hover:text-white transition-colors">TEL: 03-5638-7402</a> / FAX: 03-5638-7403<br />
              <span className="block mt-2 text-white/40 text-xs tracking-widest uppercase">Interior Design & Construction Studio</span>
            </address>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="text-2xl font-serif text-white tracking-widest">
              IWASAKI
            </div>
            <p className="text-xs leading-6 text-gray-400 font-light tracking-wide">
              地域に根差した内装工事で、<br />
              安心と満足をお届けします。
            </p>
            <div className="flex space-x-6">
              {footerNavigation.social.map((item) => {
                const Icon = item.icon
                return (
                  <a key={item.name} href={item.href} className="text-gray-500 hover:text-[#D4AF37] transition-all duration-300 transform hover:scale-110">
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-semibold leading-6 text-white uppercase tracking-widest border-b border-[#D4AF37]/30 pb-2 mb-6 w-fit">Corporate</h3>
                <ul role="list" className="space-y-3">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-xs font-semibold leading-6 text-white uppercase tracking-widest border-b border-[#D4AF37]/30 pb-2 mb-6 w-fit">Services</h3>
                <ul role="list" className="space-y-3">
                  {footerNavigation.services.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-semibold leading-6 text-white uppercase tracking-widest border-b border-[#D4AF37]/30 pb-2 mb-6 w-fit">Support</h3>
                <ul role="list" className="space-y-3">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-xs font-semibold leading-6 text-white uppercase tracking-widest border-b border-[#D4AF37]/30 pb-2 mb-6 w-fit">Recommend</h3>
                <ul role="list" className="space-y-3">
                  {footerNavigation.recommend.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Book - Cork Jijii's Visitor Counter */}
        <div className="mt-16 border-t border-white/5 pt-8 sm:mt-20 lg:mt-24">
          <GuestBook />
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] leading-5 text-gray-500 tracking-wider">
              &copy; {new Date().getFullYear()} Iwasaki Naisou Co., Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/lab" className="text-[10px] text-green-500/70 hover:text-green-500 transition-colors uppercase tracking-widest font-mono">
                Artifacts / 断片集
              </Link>
              <Link href="/journal" className="text-[10px] text-gray-600 hover:text-[#D4AF37] transition-colors uppercase tracking-widest">
                System Journal
              </Link>
              <Link href="/sitemap" className="text-[10px] text-gray-600 hover:text-[#D4AF37] transition-colors uppercase tracking-widest">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
