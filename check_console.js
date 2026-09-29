const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', error => logs.push(`[pageerror] ${error.message}`));
  page.on('requestfailed', request => logs.push(`[requestfailed] ${request.url()} - ${request.failure().errorText}`));

  await page.goto('http://localhost:3000/experience', { waitUntil: 'networkidle' });

  // wait a bit for any delayed errors
  await page.waitForTimeout(2000);

  console.log(JSON.stringify(logs, null, 2));

  await browser.close();
})();
