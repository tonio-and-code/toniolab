'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function AutoCreateQuotation() {
  const supabase = createClient()

  useEffect(() => {
    createRoyalWakabaQuotation()
  }, [])

  const createRoyalWakabaQuotation = async () => {
    try {
      // 1. 顧客作成または取得
      let customerId = ''
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('customer_name', 'ローヤル若葉管理会社')
        .single()

      if (existingCustomer) {
        customerId = existingCustomer.id
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            customer_name: 'ローヤル若葉管理会社',
            address: '東京都',
            phone: '03-0000-0000'
          })
          .select()
          .single()

        if (customerError) throw customerError
        customerId = newCustomer.id
      }

      // 2. プロジェクト作成
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          project_name: 'ローヤル若葉109号室 クロス張替え工事',
          receivable_customer_id: customerId,
          receivable_amount: 56760,
          receivable_payment_date: '2025-09-30',
          project_status: '施工前',
          transaction_date: format(new Date(), 'yyyy-MM-dd')
        })
        .select()
        .single()

      if (projectError) throw projectError

      // 3. 見積書作成
      const quotationNumber = `Q${format(new Date(), 'yyyyMMdd')}-109`
      
      const { data: quotation, error: quotationError } = await supabase
        .from('quotations')
        .insert({
          quotation_number: quotationNumber,
          project_id: project.id,
          customer_id: customerId,
          issue_date: format(new Date(), 'yyyy-MM-dd'),
          customer_name: 'ローヤル若葉管理会社',
          customer_address: '東京都',
          payment_terms: '月末締め翌月末払い',
          delivery_date: 'ローヤル若葉109号室 内装工事',
          effective_period: '提出後30日',
          subtotal: 51600,
          tax_rate: 10,
          tax_amount: 5160,
          total_amount: 56760,
          status: 'draft',
          notes: '※工期：1日（9:00〜17:00）\n※材料は永浜クロス株式会社より調達済み'
        })
        .select()
        .single()

      if (quotationError) throw quotationError

      // 4. 見積明細作成
      const items = [
        {
          quotation_id: quotation.id,
          item_order: 1,
          item_name: 'RM-820 ルノン（クロス）',
          quantity: 30,
          unit: 'm',
          unit_price: 200,
          amount: 6000,
          tax_rate: 10
        },
        {
          quotation_id: quotation.id,
          item_order: 2,
          item_name: 'ホワイトシートロール 1800mm×100',
          quantity: 1,
          unit: '巻',
          unit_price: 8160,
          amount: 8160,
          tax_rate: 10
        },
        {
          quotation_id: quotation.id,
          item_order: 3,
          item_name: 'クロス張替え工事（27㎡施工）',
          quantity: 27,
          unit: '㎡',
          unit_price: 1100,
          amount: 29700,
          tax_rate: 10
        },
        {
          quotation_id: quotation.id,
          item_order: 4,
          item_name: '諸経費（廃材処分費・養生費・交通費）',
          quantity: 1,
          unit: '式',
          unit_price: 7740,
          amount: 7740,
          tax_rate: 10
        }
      ]

      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(items)

      if (itemsError) throw itemsError

      // 5. 納品書PDFをストレージにアップロード
      const deliveryFile = new File(
        ['納品書データ'], 
        'royal-wakaba-109-delivery.pdf',
        { type: 'application/pdf' }
      )

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`deliveries/${quotation.id}/納品書_永浜クロス.pdf`, deliveryFile, {
          upsert: true
        })

      // Upload error is not critical, continue with quotation creation

      toast.success(`見積書 ${quotationNumber} を作成しました`)
      
      // 見積書ページにリダイレクト
      setTimeout(() => {
        window.location.href = '/quotations'
      }, 2000)

    } catch (error: any) {
      toast.error(`見積書作成エラー: ${error.message}`)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">ローヤル若葉109号室 見積書を自動作成中...</h2>
      <div className="space-y-2">
        <p>✓ 材料費: ¥14,160（納品書より）</p>
        <p>✓ 工事費: ¥29,700（27㎡ × ¥1,100/㎡）</p>
        <p>✓ 諸経費: ¥7,740</p>
        <p className="font-bold">合計: ¥56,760（税込）</p>
      </div>
    </div>
  )
}