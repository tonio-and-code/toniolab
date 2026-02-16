'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, TrendingUp, Building2, Calculator } from 'lucide-react'

export function FiscalYear31Report() {
  // 第31期（令和6年8月1日～令和7年7月31日）の実際の決算データ
  const fiscalData = {
    period: '第31期',
    startDate: '令和6年8月1日',
    endDate: '令和7年7月31日',
    bs: {
      // 資産の部
      currentAssets: {
        cashAndDeposits: 4098191,
        accountsReceivable: 13849330,
        advances: 132000,
        total: 18079521
      },
      fixedAssets: {
        tangibleAssets: {
          vehicles: 1,  // 車両運搬具（簿価1円）
          total: 1
        },
        intangibleAssets: {
          telephoneRights: 171784,
          deposit: 118800,
          total: 290584
        },
        total: 290585
      },
      totalAssets: 18370106,
      // 負債の部
      currentLiabilities: {
        accountsPayable: 12422895,
        shortTermLoans: 230000,
        accruedExpenses: 198756,
        incomeTaxPayable: 1199200,
        consumptionTaxPayable: 782500,
        deposits: 65508,
        total: 14898859
      },
      // 純資産の部
      equity: {
        capitalStock: 3000000,
        retainedEarnings: 471247,
        total: 3471247
      },
      totalLiabilitiesAndEquity: 18370106
    },
    pl: {
      revenue: 54426139,
      costOfSales: 31638901,
      grossProfit: 22787238,
      sellingGeneralExpenses: {
        salaries: 8440000,
        bonus: 930000,
        statutoryWelfare: 759028,
        welfare: 39080,
        supplies: 419527,
        officeSupplies: 47101,
        rent: 1429560,
        insurance: 228300,
        repairs: 9006,
        depreciation: 259729,
        travelTransportation: 861250,
        communication: 219227,
        utilities: 179298,
        vehicleExpenses: 14205,
        commissions: 588060,
        conferenceExpenses: 261156,
        taxesAndDues: 1519319,
        entertainment: 88281,
        newspapers: 8720,
        membershipFees: 3000,
        professionalFees: 457200,
        fuel: 183034,
        miscellaneous: 93061,
        total: 17067142
      },
      operatingIncome: 5720096,
      nonOperatingIncome: 1444,
      nonOperatingExpenses: 57036,
      ordinaryIncome: 5664504,
      specialLoss: 720000,
      incomeBeforeTaxes: 4944504,
      corporateTaxes: 1199200,
      netIncome: 3745304
    },
    taxDetails: {
      corporateTax: 741000,
      localCorporateTax: 76300,
      metropolitanTax: 121800,
      businessTax: 189900,
      specialBusinessTax: 70200,
      totalTax: 1199200
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1) + '%'
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-2">有限会社イワサキ内装</h2>
        <p className="text-xl text-gray-700">{fiscalData.period} 決算報告書</p>
        <p className="text-gray-600">
          {fiscalData.startDate} ～ {fiscalData.endDate}
        </p>
      </div>

      <Tabs defaultValue="pl" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="pl">損益計算書</TabsTrigger>
          <TabsTrigger value="bs">貸借対照表</TabsTrigger>
          <TabsTrigger value="analysis">経営分析</TabsTrigger>
          <TabsTrigger value="tax">税金詳細</TabsTrigger>
        </TabsList>

        {/* 損益計算書 */}
        <TabsContent value="pl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                損益計算書
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <tbody className="divide-y">
                  <tr className="flex justify-between py-3">
                    <td className="font-semibold text-lg">売上高</td>
                    <td className="text-right text-lg font-bold text-green-600">
                      {formatCurrency(fiscalData.pl.revenue)}
                    </td>
                  </tr>
                  <tr className="flex justify-between py-3">
                    <td className="font-medium">売上原価（商品仕入）</td>
                    <td className="text-right">{formatCurrency(fiscalData.pl.costOfSales)}</td>
                  </tr>
                  <tr className="flex justify-between py-3 bg-blue-50">
                    <td className="font-bold">売上総利益</td>
                    <td className="text-right font-bold">
                      {formatCurrency(fiscalData.pl.grossProfit)}
                      <span className="text-sm text-gray-500 ml-2">
                        ({formatPercentage(fiscalData.pl.grossProfit, fiscalData.pl.revenue)})
                      </span>
                    </td>
                  </tr>

                  {/* 販売費及び一般管理費の内訳 */}
                  <tr className="py-3">
                    <td colSpan={2}>
                      <details className="cursor-pointer">
                        <summary className="flex justify-between font-medium py-2">
                          <span>販売費及び一般管理費</span>
                          <span>{formatCurrency(fiscalData.pl.sellingGeneralExpenses.total)}</span>
                        </summary>
                        <div className="pl-4 mt-2 space-y-1 text-sm">
                          <div className="flex justify-between py-1">
                            <span>給料手当</span>
                            <span>{formatCurrency(fiscalData.pl.sellingGeneralExpenses.salaries)}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>賞与</span>
                            <span>{formatCurrency(fiscalData.pl.sellingGeneralExpenses.bonus)}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>法定福利費</span>
                            <span>{formatCurrency(fiscalData.pl.sellingGeneralExpenses.statutoryWelfare)}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>賃借料</span>
                            <span>{formatCurrency(fiscalData.pl.sellingGeneralExpenses.rent)}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>租税公課</span>
                            <span>{formatCurrency(fiscalData.pl.sellingGeneralExpenses.taxesAndDues)}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>旅費交通費</span>
                            <span>{formatCurrency(fiscalData.pl.sellingGeneralExpenses.travelTransportation)}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>その他経費</span>
                            <span className="text-gray-500">（詳細は勘定科目内訳書参照）</span>
                          </div>
                        </div>
                      </details>
                    </td>
                  </tr>

                  <tr className="flex justify-between py-3 bg-yellow-50">
                    <td className="font-bold">営業利益</td>
                    <td className="text-right font-bold">
                      {formatCurrency(fiscalData.pl.operatingIncome)}
                      <span className="text-sm text-gray-500 ml-2">
                        ({formatPercentage(fiscalData.pl.operatingIncome, fiscalData.pl.revenue)})
                      </span>
                    </td>
                  </tr>
                  <tr className="flex justify-between py-3">
                    <td className="font-medium">営業外収益</td>
                    <td className="text-right">{formatCurrency(fiscalData.pl.nonOperatingIncome)}</td>
                  </tr>
                  <tr className="flex justify-between py-3">
                    <td className="font-medium">営業外費用（売上割引）</td>
                    <td className="text-right">{formatCurrency(fiscalData.pl.nonOperatingExpenses)}</td>
                  </tr>
                  <tr className="flex justify-between py-3 bg-green-50">
                    <td className="font-bold">経常利益</td>
                    <td className="text-right font-bold text-green-600">
                      {formatCurrency(fiscalData.pl.ordinaryIncome)}
                      <span className="text-sm text-gray-500 ml-2">
                        ({formatPercentage(fiscalData.pl.ordinaryIncome, fiscalData.pl.revenue)})
                      </span>
                    </td>
                  </tr>
                  <tr className="flex justify-between py-3">
                    <td className="font-medium">特別損失（雑損失）</td>
                    <td className="text-right text-red-500">{formatCurrency(fiscalData.pl.specialLoss)}</td>
                  </tr>
                  <tr className="flex justify-between py-3">
                    <td className="font-medium">税引前当期純利益</td>
                    <td className="text-right font-semibold">{formatCurrency(fiscalData.pl.incomeBeforeTaxes)}</td>
                  </tr>
                  <tr className="flex justify-between py-3">
                    <td className="font-medium">法人税・住民税及び事業税</td>
                    <td className="text-right text-red-600">{formatCurrency(fiscalData.pl.corporateTaxes)}</td>
                  </tr>
                  <tr className="flex justify-between py-3 bg-indigo-100">
                    <td className="font-bold text-lg">当期純利益</td>
                    <td className="text-right font-bold text-lg text-indigo-600">
                      {formatCurrency(fiscalData.pl.netIncome)}
                      <span className="text-sm text-gray-500 ml-2">
                        ({formatPercentage(fiscalData.pl.netIncome, fiscalData.pl.revenue)})
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 貸借対照表 */}
        <TabsContent value="bs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 資産の部 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">資産の部</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-600">I 流動資産</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="flex justify-between py-1">
                          <td>現金及び預金</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentAssets.cashAndDeposits)}</td>
                        </tr>
                        <tr className="flex justify-between py-1">
                          <td>売掛金</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentAssets.accountsReceivable)}</td>
                        </tr>
                        <tr className="flex justify-between py-1">
                          <td>立替金</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentAssets.advances)}</td>
                        </tr>
                        <tr className="flex justify-between py-2 font-semibold border-t">
                          <td>流動資産合計</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentAssets.total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-gray-600">II 固定資産</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="flex justify-between py-1">
                          <td>車両運搬具</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.fixedAssets.tangibleAssets.vehicles)}</td>
                        </tr>
                        <tr className="flex justify-between py-1">
                          <td>電話加入権</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.fixedAssets.intangibleAssets.telephoneRights)}</td>
                        </tr>
                        <tr className="flex justify-between py-1">
                          <td>保証金</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.fixedAssets.intangibleAssets.deposit)}</td>
                        </tr>
                        <tr className="flex justify-between py-2 font-semibold border-t">
                          <td>固定資産合計</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.fixedAssets.total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t-2 pt-2">
                    <table className="w-full">
                      <tbody>
                        <tr className="flex justify-between py-2">
                          <td className="font-bold text-lg">資産合計</td>
                          <td className="text-right font-bold text-lg">{formatCurrency(fiscalData.bs.totalAssets)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 負債・純資産の部 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">負債・純資産の部</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-600">I 流動負債</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="flex justify-between py-1">
                          <td>買掛金</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentLiabilities.accountsPayable)}</td>
                        </tr>
                        <tr className="flex justify-between py-1">
                          <td>短期借入金</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentLiabilities.shortTermLoans)}</td>
                        </tr>
                        <tr className="flex justify-between py-1">
                          <td>未払金</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentLiabilities.accruedExpenses)}</td>
                        </tr>
                        <tr className="flex justify-between py-1">
                          <td>未払法人税等</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentLiabilities.incomeTaxPayable)}</td>
                        </tr>
                        <tr className="flex justify-between py-1">
                          <td>未払消費税</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentLiabilities.consumptionTaxPayable)}</td>
                        </tr>
                        <tr className="flex justify-between py-1">
                          <td>預り金</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentLiabilities.deposits)}</td>
                        </tr>
                        <tr className="flex justify-between py-2 font-semibold border-t">
                          <td>負債合計</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.currentLiabilities.total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-gray-600">II 純資産の部</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="flex justify-between py-1">
                          <td>資本金</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.equity.capitalStock)}</td>
                        </tr>
                        <tr className="flex justify-between py-1">
                          <td>利益剰余金</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.equity.retainedEarnings)}</td>
                        </tr>
                        <tr className="flex justify-between py-2 font-semibold border-t">
                          <td>純資産合計</td>
                          <td className="text-right">{formatCurrency(fiscalData.bs.equity.total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t-2 pt-2">
                    <table className="w-full">
                      <tbody>
                        <tr className="flex justify-between py-2">
                          <td className="font-bold text-lg">負債・純資産合計</td>
                          <td className="text-right font-bold text-lg">{formatCurrency(fiscalData.bs.totalLiabilitiesAndEquity)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 経営分析 */}
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                経営分析指標
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-600">収益性指標</h4>
                  <div className="bg-gray-50 rounded p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">売上総利益率</span>
                      <span className="font-semibold">
                        {formatPercentage(fiscalData.pl.grossProfit, fiscalData.pl.revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">営業利益率</span>
                      <span className="font-semibold">
                        {formatPercentage(fiscalData.pl.operatingIncome, fiscalData.pl.revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">経常利益率</span>
                      <span className="font-semibold">
                        {formatPercentage(fiscalData.pl.ordinaryIncome, fiscalData.pl.revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">純利益率</span>
                      <span className="font-semibold">
                        {formatPercentage(fiscalData.pl.netIncome, fiscalData.pl.revenue)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-600">安全性指標</h4>
                  <div className="bg-gray-50 rounded p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">流動比率</span>
                      <span className="font-semibold">
                        {((fiscalData.bs.currentAssets.total / fiscalData.bs.currentLiabilities.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">自己資本比率</span>
                      <span className="font-semibold">
                        {formatPercentage(fiscalData.bs.equity.total, fiscalData.bs.totalAssets)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">負債比率</span>
                      <span className="font-semibold">
                        {formatPercentage(fiscalData.bs.currentLiabilities.total, fiscalData.bs.totalAssets)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-600">効率性指標</h4>
                  <div className="bg-gray-50 rounded p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">総資産回転率</span>
                      <span className="font-semibold">
                        {(fiscalData.pl.revenue / fiscalData.bs.totalAssets).toFixed(2)}回
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">売上債権回転期間</span>
                      <span className="font-semibold">
                        {((fiscalData.bs.currentAssets.accountsReceivable / fiscalData.pl.revenue) * 365).toFixed(0)}日
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">ROE（自己資本利益率）</span>
                      <span className="font-semibold">
                        {formatPercentage(fiscalData.pl.netIncome, fiscalData.bs.equity.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">総評</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  第31期は売上高54,426,139円、営業利益率10.5%、純利益率6.9%と堅調な業績を達成しました。
                  自己資本比率18.9%、流動比率121.4%と財務の安全性も維持されています。
                  売上総利益率41.9%は建設業界において良好な水準です。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 税金詳細 */}
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                法人税等の内訳
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">税目</th>
                    <th className="text-right py-2">税額</th>
                    <th className="text-right py-2">備考</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">法人税（国税）</td>
                    <td className="text-right py-2">{formatCurrency(fiscalData.taxDetails.corporateTax)}</td>
                    <td className="text-right py-2 text-sm text-gray-500">税率 23.2%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">地方法人税</td>
                    <td className="text-right py-2">{formatCurrency(fiscalData.taxDetails.localCorporateTax)}</td>
                    <td className="text-right py-2 text-sm text-gray-500">税率 10.3%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">法人都民税</td>
                    <td className="text-right py-2">{formatCurrency(fiscalData.taxDetails.metropolitanTax)}</td>
                    <td className="text-right py-2 text-sm text-gray-500">税率 16.4%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">事業税</td>
                    <td className="text-right py-2">{formatCurrency(fiscalData.taxDetails.businessTax)}</td>
                    <td className="text-right py-2 text-sm text-gray-500">税率 5.1%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">特別法人事業税</td>
                    <td className="text-right py-2">{formatCurrency(fiscalData.taxDetails.specialBusinessTax)}</td>
                    <td className="text-right py-2 text-sm text-gray-500">税率 37%（事業税の）</td>
                  </tr>
                  <tr className="font-bold bg-gray-50">
                    <td className="py-3">合計</td>
                    <td className="text-right py-3 text-lg">{formatCurrency(fiscalData.taxDetails.totalTax)}</td>
                    <td className="text-right py-3 text-sm">納付期限: 令和7年9月30日</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-semibold mb-2">消費税関連</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>課税売上高</span>
                      <span>{formatCurrency(54426139)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>未払消費税</span>
                      <span className="font-semibold">{formatCurrency(782500)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold mb-2">実効税率</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>税引前利益</span>
                      <span>{formatCurrency(4944504)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>法人税等</span>
                      <span>{formatCurrency(1199200)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>実効税率</span>
                      <span className="text-lg">24.3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}