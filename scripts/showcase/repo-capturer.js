const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

/**
 * Intelligent Playwright Exploration & Screenshot Capturer
 * Opens running web applications, discovers key features/pages safely,
 * and captures high-resolution portfolio showcase screenshots.
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
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 PortfolioShowcaseBot/1.0'
  });

  const page = await context.newPage();
  const capturedScreenshots = [];

  try {
    // 1. Initial Page Load
    console.log(`[Capturer] Navigating to primary URL: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {
      return page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    });
    await page.waitForTimeout(1500);

    // Capture main landing screen
    const heroPath = path.join(outputDir, `${projectSlug}-landing.jpg`);
    await page.screenshot({ path: heroPath, type: 'jpeg', quality: 90 });
    if (isValidScreenshot(heroPath)) {
      capturedScreenshots.push({
        path: heroPath,
        relativePath: `/assets/showcase/${projectSlug}/${path.basename(heroPath)}`,
        caption: 'Main Application Landing Screen'
      });
      console.log(`   ✓ Captured: ${path.basename(heroPath)}`);
    }

    // 2. Discover interactive navigation links and buttons
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

    console.log(`[Capturer] Discovered ${interactiveElements.length} interactive elements.`);

    // 3. Explore Hash Sections or Routes
    const visitedUrls = new Set([targetUrl]);
    let count = capturedScreenshots.length;

    // A. Check for hash targets or specific route links
    for (const route of routesToExplore) {
      if (count >= maxScreenshots) break;
      const fullRouteUrl = route.startsWith('http') ? route : `${targetUrl.replace(/\/$/, '')}${route.startsWith('/') ? route : `/${route}`}`;

      if (visitedUrls.has(fullRouteUrl)) continue;
      visitedUrls.add(fullRouteUrl);

      try {
        console.log(`[Capturer] Exploring route/section: ${fullRouteUrl}`);
        if (route.startsWith('#')) {
          // Scroll to hash element
          await page.evaluate((selector) => {
            const el = document.querySelector(selector);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, route).catch(() => {});
          await page.waitForTimeout(1000);
        } else {
          await page.goto(fullRouteUrl, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
          await page.waitForTimeout(1200);
        }

        const shotPath = path.join(outputDir, `${projectSlug}-feature-${count + 1}.jpg`);
        await page.screenshot({ path: shotPath, type: 'jpeg', quality: 90 });

        if (isValidScreenshot(shotPath)) {
          capturedScreenshots.push({
            path: shotPath,
            relativePath: `/assets/showcase/${projectSlug}/${path.basename(shotPath)}`,
            caption: `Application Feature View ${count + 1}`
          });
          count++;
          console.log(`   ✓ Captured: ${path.basename(shotPath)}`);
        }
      } catch (rErr) {
        console.warn(`[Capturer] Skipping route ${fullRouteUrl}: ${rErr.message}`);
      }
    }

    // B. Click safe navigation buttons/links if we still need more screenshots
    if (count < maxScreenshots) {
      const safeElements = interactiveElements.filter(el => el.text && el.text.length > 2 && isSafeText(el.text));
      for (const el of safeElements) {
        if (count >= maxScreenshots) break;
        try {
          const locator = page.locator(`text="${el.text.replace(/"/g, '')}"`).first();
          if (await locator.isVisible()) {
            console.log(`[Capturer] Clicking safe navigation element: "${el.text}"`);
            await locator.click({ timeout: 5000 }).catch(() => {});
            await page.waitForTimeout(1200);

            const shotPath = path.join(outputDir, `${projectSlug}-feature-${count + 1}.jpg`);
            await page.screenshot({ path: shotPath, type: 'jpeg', quality: 90 });

            if (isValidScreenshot(shotPath)) {
              capturedScreenshots.push({
                path: shotPath,
                relativePath: `/assets/showcase/${projectSlug}/${path.basename(shotPath)}`,
                caption: `Application Interface: ${el.text}`
              });
              count++;
              console.log(`   ✓ Captured: ${path.basename(shotPath)}`);
            }
          }
        } catch {}
      }
    }

    // C. Capture a smooth scrolled view of the main dashboard/page if needed
    if (count < 3) {
      console.log(`[Capturer] Capturing secondary scrolled viewport for complete showcase...`);
      await page.evaluate(() => window.scrollBy(0, 650));
      await page.waitForTimeout(1000);
      const scrollShotPath = path.join(outputDir, `${projectSlug}-details.jpg`);
      await page.screenshot({ path: scrollShotPath, type: 'jpeg', quality: 90 });
      if (isValidScreenshot(scrollShotPath)) {
        capturedScreenshots.push({
          path: scrollShotPath,
          relativePath: `/assets/showcase/${projectSlug}/${path.basename(scrollShotPath)}`,
          caption: 'Dashboard Details & Functional Section'
        });
        console.log(`   ✓ Captured: ${path.basename(scrollShotPath)}`);
      }
    }

  } catch (err) {
    console.error(`[Capturer] Error during screenshot capture: ${err.message}`);
  } finally {
    await browser.close().catch(() => {});
  }

  console.log(`[Capturer] Successfully captured ${capturedScreenshots.length} screenshots for ${projectSlug}.`);
  return capturedScreenshots;
}

function isValidScreenshot(filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stats = fs.statSync(filePath);
    // Ignore tiny or corrupt screenshots (< 12KB)
    return stats.size > 12000;
  } catch {
    return false;
  }
}

module.exports = { captureProjectScreenshots, isValidScreenshot };
