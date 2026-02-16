export const PrintStyles = () => (
  <style jsx global>{`
    @media print {
      @page {
        size: A4;
        margin: 15mm;
      }
      
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      /* ナビゲーション等を非表示 */
      .print\\:hidden {
        display: none !important;
      }
      
      /* 印刷時のみ表示 */
      .print\\:block {
        display: block !important;
      }
      
      /* テーブルのページ分割制御 */
      table {
        page-break-inside: auto;
      }
      
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      
      thead {
        display: table-header-group;
      }
      
      tfoot {
        display: table-footer-group;
      }
      
      /* ボタンを非表示 */
      button {
        display: none !important;
      }
      
      /* 印刷用ボタンは表示しない */
      .print-button {
        display: none !important;
      }
      
      /* カードの影を削除 */
      .shadow-sm, .shadow, .shadow-md, .shadow-lg {
        box-shadow: none !important;
      }
      
      /* 背景色を白に */
      .bg-gray-50 {
        background-color: white !important;
      }
      
      /* 境界線をはっきりさせる */
      .border {
        border-color: #000 !important;
      }
    }
  `}</style>
)

export const handlePrint = () => {
  window.print()
}