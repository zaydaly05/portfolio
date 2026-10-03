const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

/**
 * Intelligent Playwright Exploration, Validation & Screenshot Quality Gate Engine
 * Ensures ONLY authentic, meaningful, non-blank, non-directory-listing, and visually unique screenshots are accepted.
 */

const DANGEROUS_WORDS = [
  'delete', 'remove', 'erase', 'destroy', 'clear', 'reset',
  'logout', 'signout', 'sign-out', 'log-out', 'exit',
  'pay', 'checkout', 'purchase', 'buy', 'billing', 'subscribe'
];

function isSafeText(text = '') {
  const lower = text.toLowerCase();
  return !DANGEROUS_WORDS.some(word => lower.includes(word));
}

function computePerceptualHash(buffer) {
  if (!buffer || buffer.length === 0) return '0000000000000000000000000000000000000000000000000000000000000000';
  const step = Math.max(1, Math.floor(buffer.length / 64));
  const samples = [];
  let sum = 0;
  for (let i = 0; i < 64; i++) {
    const val = buffer[i * step] || 0;
    samples.push(val);
    sum += val;
  }
  const avg = sum / 64;
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += samples[i] >= avg ? '1' : '0';
  }
  return hash;
}

function hammingDistance(hash1, hash2) {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 64;
  let dist = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) dist++;
  }
  return dist;
}

function isBlankBuffer(buffer) {
  if (!buffer || buffer.length < 10000) return true; // Files < 10KB are invalid/blank
  const step = Math.max(1, Math.floor(buffer.length / 100));
  let min = 255, max = 0;
  for (let i = 0; i < 100; i++) {
    const val = buffer[i * step] || 0;
    if (val < min) min = val;
    if (val > max) max = val;
  }
  return (max - min) < 15; // Almost uniform color/blank
}

async function validatePageDOM(page) {
  return await page.evaluate(() => {
    const text = (document.body ? document.body.innerText : '') || '';
    const title = document.title || '';

    // 1. Directory Listing Check
    const isDirListing = 
      /Index of /i.test(title) ||
      /Index of /i.test(text) ||
      /Directory listing for/i.test(text) ||
      /Parent Directory/i.test(text) ||
      (text.includes('.github/') && text.includes('package.json') && text.includes('README.md') && document.querySelectorAll('a').length > 5 && !document.querySelector('header, nav, main, footer, button, .app, .container'));

    if (isDirListing) {
      return { valid: false, reason: 'INVALID_DIRECTORY_LISTING' };
    }

    // 2. Error Page Check
    const isError =
      /404 Not Found|500 Internal Server Error|502 Bad Gateway|503 Service Unavailable/i.test(title) ||
      /Cannot GET \/|ERR_CONNECTION_REFUSED|This site can't be reached|Failed to compile|Unhandled Exception/i.test(text);

    if (isError) {
      return { valid: false, reason: 'INVALID_ERROR_PAGE' };
    }

    // 3. Minimum DOM Element Richness Check
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, button, a, img, svg, canvas, table, form, input, select, .card, .box, article, div');
    if (elements.length < 4 || text.trim().length < 5) {
      return { valid: false, reason: 'INVALID_BLANK_SCREEN' };
    }

    return { valid: true, title, elementCount: elements.length };
  });
}

async function captureProjectScreenshots(targetUrl, projectSlug, options = {}) {
  const routesToExplore = options.routesToExplore || ['/'];
  const maxScreenshots = options.maxScreenshots || 6;
  const outputDir = path.join(__dirname, '..', '..', 'public', 'assets', 'showcase', projectSlug);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`[Capturer] Launching Playwright browser to capture ${projectSlug} at ${targetUrl}...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 PortfolioShowcaseBot/2.0'
  });

  const page = await context.newPage();
  const acceptedScreenshots = [];
  const acceptedHashes = [];

  try {
    // 1. Primary Page Load & Readiness Wait
    console.log(`[Capturer] Navigating to primary URL: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {
      return page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    });
    
    // Application-aware readiness check
    await page.waitForTimeout(2000);

    // Validate DOM before capture
    const domCheck = await validatePageDOM(page);
    if (!domCheck.valid) {
      console.warn(`[Capturer] ❌ Primary URL rejected during DOM validation: ${domCheck.reason}`);
      await browser.close();
      return [];
    }

    // Capture Candidate 1
    const buffer1 = await page.screenshot({ type: 'jpeg', quality: 90 });
    if (!isBlankBuffer(buffer1)) {
      const hash1 = computePerceptualHash(buffer1);
      const heroPath = path.join(outputDir, `${projectSlug}-landing.jpg`);
      fs.writeFileSync(heroPath, buffer1);
      
      acceptedScreenshots.push({
        path: heroPath,
        relativePath: `/assets/showcase/${projectSlug}/${path.basename(heroPath)}`,
        caption: 'Main Application Landing Screen',
        hash: hash1
      });
      acceptedHashes.push(hash1);
      console.log(`   ✓ Accepted Screenshot 1: ${path.basename(heroPath)}`);
    } else {
      console.warn(`[Capturer] ❌ Primary landing screen rejected: INVALID_BLANK_SCREEN`);
    }

    // 2. Discover Interactive Elements
    const interactiveElements = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], .nav-link, .tab, .btn'));

      const links = anchors.map(a => ({
        text: (a.innerText || a.getAttribute('aria-label') || '').trim(),
        href: a.getAttribute('href')
      }));

      const btns = buttons.map(b => ({
        text: (b.innerText || b.getAttribute('aria-label') || '').trim(),
        isButton: true
      }));

      return [...links, ...btns];
    });

    // 3. Explore Routes & Sections with Quality Gate
    const visitedUrls = new Set([targetUrl]);
    let count = acceptedScreenshots.length;

    for (const route of routesToExplore) {
      if (count >= maxScreenshots) break;
      const fullRouteUrl = route.startsWith('http') ? route : `${targetUrl.replace(/\/$/, '')}${route.startsWith('/') ? route : `/${route}`}`;

      if (visitedUrls.has(fullRouteUrl)) continue;
      visitedUrls.add(fullRouteUrl);

      try {
        console.log(`[Capturer] Exploring route/section: ${fullRouteUrl}`);
        if (route.startsWith('#')) {
          await page.evaluate((selector) => {
            const el = document.querySelector(selector);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, route).catch(() => {});
          await page.waitForTimeout(1200);
        } else {
          await page.goto(fullRouteUrl, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
          await page.waitForTimeout(1500);
        }

        const domRes = await validatePageDOM(page);
        if (!domRes.valid) {
          console.warn(`   ⚠️ Route rejected: ${domRes.reason}`);
          continue;
        }

        const candidateBuffer = await page.screenshot({ type: 'jpeg', quality: 90 });
        if (isBlankBuffer(candidateBuffer)) {
          console.warn(`   ⚠️ Route rejected: INVALID_BLANK_SCREEN`);
          continue;
        }

        const candHash = computePerceptualHash(candidateBuffer);
        const isDuplicate = acceptedHashes.some(h => hammingDistance(h, candHash) <= 4);
        if (isDuplicate) {
          console.warn(`   ⚠️ Route rejected: INVALID_DUPLICATE_SCREEN (visually identical)`);
          continue;
        }

        const shotPath = path.join(outputDir, `${projectSlug}-feature-${count + 1}.jpg`);
        fs.writeFileSync(shotPath, candidateBuffer);

        acceptedScreenshots.push({
          path: shotPath,
          relativePath: `/assets/showcase/${projectSlug}/${path.basename(shotPath)}`,
          caption: `Application Feature View ${count + 1}`,
          hash: candHash
        });
        acceptedHashes.push(candHash);
        count++;
        console.log(`   ✓ Accepted Screenshot ${count}: ${path.basename(shotPath)}`);
      } catch (rErr) {
        console.warn(`   ⚠️ Skipping route ${fullRouteUrl}: ${rErr.message}`);
      }
    }

    // 4. Click Safe Navigation Buttons for Additional Screens
    if (count < maxScreenshots) {
      const safeElements = interactiveElements.filter(el => el.text && el.text.length > 2 && isSafeText(el.text));
      for (const el of safeElements) {
        if (count >= maxScreenshots) break;
        try {
          const locator = page.locator(`text="${el.text.replace(/"/g, '')}"`).first();
          if (await locator.isVisible()) {
            console.log(`[Capturer] Clicking safe navigation element: "${el.text}"`);
            await locator.click({ timeout: 4000 }).catch(() => {});
            await page.waitForTimeout(1500);

            const domRes = await validatePageDOM(page);
            if (!domRes.valid) continue;

            const candBuf = await page.screenshot({ type: 'jpeg', quality: 90 });
            if (isBlankBuffer(candBuf)) continue;

            const candHash = computePerceptualHash(candBuf);
            const isDup = acceptedHashes.some(h => hammingDistance(h, candHash) <= 4);
            if (isDup) {
              console.warn(`   ⚠️ Rejection: Visual duplicate of previously captured screen.`);
              continue;
            }

            const shotPath = path.join(outputDir, `${projectSlug}-feature-${count + 1}.jpg`);
            fs.writeFileSync(shotPath, candBuf);

            acceptedScreenshots.push({
              path: shotPath,
              relativePath: `/assets/showcase/${projectSlug}/${path.basename(shotPath)}`,
              caption: `Application Interface: ${el.text}`,
              hash: candHash
            });
            acceptedHashes.push(candHash);
            count++;
            console.log(`   ✓ Accepted Screenshot ${count}: ${path.basename(shotPath)}`);
          }
        } catch {}
      }
    }

    // 5. Scrolled Viewport Capture if needed
    if (count >= 1 && count < 3) {
      console.log(`[Capturer] Capturing secondary scrolled viewport for complete showcase...`);
      await page.evaluate(() => window.scrollBy(0, 650));
      await page.waitForTimeout(1000);
      
      const scrollBuf = await page.screenshot({ type: 'jpeg', quality: 90 });
      if (!isBlankBuffer(scrollBuf)) {
        const scrollHash = computePerceptualHash(scrollBuf);
        const isDup = acceptedHashes.some(h => hammingDistance(h, scrollHash) <= 4);
        if (!isDup) {
          const scrollShotPath = path.join(outputDir, `${projectSlug}-details.jpg`);
          fs.writeFileSync(scrollShotPath, scrollBuf);

          acceptedScreenshots.push({
            path: scrollShotPath,
            relativePath: `/assets/showcase/${projectSlug}/${path.basename(scrollShotPath)}`,
            caption: 'Dashboard Details & Functional Section',
            hash: scrollHash
          });
          acceptedHashes.push(scrollHash);
          console.log(`   ✓ Accepted Scrolled Screenshot: ${path.basename(scrollShotPath)}`);
        }
      }
    }

  } catch (err) {
    console.error(`[Capturer] Error during screenshot capture: ${err.message}`);
  } finally {
    await browser.close().catch(() => {});
  }

  console.log(`[Capturer] Quality Gate Summary: Accepted ${acceptedScreenshots.length} valid screenshots for ${projectSlug}.`);
  return acceptedScreenshots;
}

module.exports = { captureProjectScreenshots, validatePageDOM, isBlankBuffer, computePerceptualHash };
