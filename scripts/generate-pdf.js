const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
  console.log('PDF生成を開始...');

  const browser = await puppeteer.launch({
    headless: 'new'
  });

  const page = await browser.newPage();

  // ローカルサーバーのURLを開く
  await page.goto('http://localhost:3001/ochiai-presentation.html', {
    waitUntil: 'networkidle0'
  });

  // 印刷ボタンを非表示にする
  await page.addStyleTag({
    content: '.print-controls { display: none !important; }'
  });

  const outputPath = path.join(__dirname, '..', 'public', 'ochiai-presentation.pdf');

  // PDFを生成
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    }
  });

  await browser.close();

  console.log(`PDF生成完了: ${outputPath}`);
}

generatePDF().catch(console.error);
