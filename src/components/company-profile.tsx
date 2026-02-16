"use client"

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface CompanyData {
  totalRevenue: number
  totalProjects: number
  totalCustomers: number
  totalCraftsmen: number
  currentYearProjects: number
  grossProfitRate: number
}

export default function CompanyProfile() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [
        { data: projects },
        { data: customers },
        { data: craftsmen }
      ] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('craftsmen').select('*')
      ])

      const currentYear = new Date().getFullYear()
      const currentPeriodProjects = projects?.filter(p => {
        const date = new Date(p.transaction_date || p.created_at)
        return date.getFullYear() === currentYear
      }) || []

      const totalRevenue = currentPeriodProjects.reduce((sum, p) => sum + (p.amount || 0), 0)
      const totalCost = currentPeriodProjects.reduce((sum, p) => sum + (p.cost || 0), 0)
      const grossProfit = totalRevenue - totalCost
      const grossProfitRate = totalRevenue > 0 ? (grossProfit / totalRevenue * 100) : 0

      setCompanyData({
        totalRevenue,
        totalProjects: projects?.length || 0,
        totalCustomers: customers?.length || 0,
        totalCraftsmen: craftsmen?.length || 0,
        currentYearProjects: currentPeriodProjects.length,
        grossProfitRate
      })
    } catch {
      // Failed to fetch data
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 100000000) return `${(value / 100000000).toFixed(1)}億円`
    if (value >= 10000) return `${Math.floor(value / 10000)}万円`
    return `${value.toLocaleString()}円`
  }

  const handleExportPDF = async () => {
    if (!contentRef.current) return

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save('イワサキ内装_会社案内.pdf')
    } catch {
      // PDF export failed silently
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-10 print:hidden">
        <Button onClick={handleExportPDF} className="bg-gray-900 text-white hover:bg-gray-800">
          <Download className="h-4 w-4 mr-2" />
          PDFダウンロード
        </Button>
      </div>

      <div ref={contentRef} className="max-w-[210mm] mx-auto bg-white min-h-[297mm] print:m-0 p-12">
        {/* ヘッダー */}
        <div className="text-center mb-10 pb-8 border-b-2 border-gray-900">
          <h1 className="text-3xl font-bold mb-2">有限会社イワサキ内装</h1>
          <p className="text-sm text-gray-600">〒130-0021 東京都墨田区緑1-24-2-101</p>
        </div>

        {/* 会社紹介 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-300">会社紹介</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            当社は1994年の創業以来、東京都墨田区を拠点に内装仕上工事の専門会社として活動しております。クロス張替え、ダイノックシート施工、床材施工など幅広い内装工事に対応し、確かな技術と豊富な経験でお客様のニーズに応える高品質な施工を提供しています。
          </p>
        </div>

        {/* 専門サービス */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-300">専門サービス</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-sm mb-2">クロス・壁紙工事</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                ビニルクロス、織物クロス、紙クロス、機能性クロスなど多様な材質に対応。下地処理から仕上げまで、全工程において妥協のない施工を行います。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2">ダイノックシート施工</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                3M™ダイノック™フィルムの認定施工技術で、900種類以上のデザインに対応。木目調、石目調、金属調など、本物と見紛うような仕上がりを実現。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2">床材施工</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                OAフロア、タイルカーペット、フロアタイル、長尺シート等、用途と環境に応じた最適な床材をご提案。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2">総合内装工事</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                パーティション工事、天井工事、造作家具工事まで一貫対応。空間全体のトータルコーディネートで理想の空間を実現します。
              </p>
            </div>
          </div>
        </div>

        {/* 2カラムレイアウト */}
        <div className="grid grid-cols-2 gap-8">{/* 左カラム */}
          <div>
            {/* 主な施工先 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-300">主な施工先</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-bold text-xs mb-2">オフィス・商業施設</h3>
                  <ul className="text-xs text-gray-700 space-y-1 leading-relaxed">
                    <li>• 大手企業本社ビル</li>
                    <li>• 金融機関店舗</li>
                    <li>• 百貨店・専門店</li>
                    <li>• 飲食チェーン店舗</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xs mb-2">公共・医療施設</h3>
                  <ul className="text-xs text-gray-700 space-y-1 leading-relaxed">
                    <li>• 官公庁施設</li>
                    <li>• 教育機関</li>
                    <li>• 総合病院</li>
                    <li>• クリニック</li>
                    <li>• 福祉施設</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xs mb-2">住宅・その他</h3>
                  <ul className="text-xs text-gray-700 space-y-1 leading-relaxed">
                    <li>• 高級マンション</li>
                    <li>• 戸建住宅</li>
                    <li>• ホテル・旅館</li>
                    <li>• 文化施設</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 品質保証 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-300">品質保証</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-xs mb-1">施工保証</h3>
                  <p className="text-xs text-gray-700">施工完了後1年間の品質保証。万一の不具合にも迅速対応いたします。</p>
                </div>
                <div>
                  <h3 className="font-bold text-xs mb-1">定期点検</h3>
                  <p className="text-xs text-gray-700">施工後3ヶ月、6ヶ月、1年の定期点検を実施。長期的な品質維持をサポートします。</p>
                </div>
                <div>
                  <h3 className="font-bold text-xs mb-1">アフターフォロー</h3>
                  <p className="text-xs text-gray-700">保証期間後も相談・メンテナンスに対応。長いお付き合いを大切にしています。</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右カラム */}
          <div>
            {/* 会社概要 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-300">会社概要</h2>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600 font-bold">商号</td>
                    <td className="py-2 text-gray-700">有限会社イワサキ内装</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600 font-bold">創業</td>
                    <td className="py-2 text-gray-700">1994年（平成6年）</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600 font-bold">代表取締役</td>
                    <td className="py-2 text-gray-700">岩﨑 和男</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600 font-bold">事業内容</td>
                    <td className="py-2 text-gray-700">内装仕上工事業、塗装工事業、大工工事業</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600 font-bold">建設業許可</td>
                    <td className="py-2 text-gray-700">東京都知事 許可（般ー５）第157230号</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600 font-bold">所在地</td>
                    <td className="py-2 text-gray-700">東京都墨田区緑1-24-2-101</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600 font-bold">営業時間</td>
                    <td className="py-2 text-gray-700">平日 9:00〜18:00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* お問い合わせ */}
            <div className="mb-8 bg-gray-50 p-4 rounded">
              <h2 className="text-xl font-bold mb-3">お問い合わせ</h2>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                内装工事のご相談・お見積りは無料です。お気軽にお問い合わせください。
              </p>
              <div className="text-xs text-gray-700 space-y-1">
                <p>〒130-0021</p>
                <p>東京都墨田区緑1丁目 24-2 タカミビル101</p>
                <p>TEL: 03-5638-7402</p>
                <p>FAX: 03-5638-7403</p>
                <p>E-mail: kaz@iwasaki-naisou.jp</p>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 pt-4 border-t text-center">
          <p className="text-xs text-gray-500">© 2024 有限会社イワサキ内装 All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}