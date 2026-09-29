const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshot() {
  const url = process.argv[2];
  const projectName = process.argv[3];

  if (!url || !projectName) {
    console.error('Error: Please provide both a URL and a Project Name.');
    process.exit(1);
  }

  console.log(`Starting headless browser to capture: ${url}`);
  
  // Launch Puppeteer with standard CI arguments
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  
  // Set a professional high-resolution viewport for the portfolio
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // Navigate to the live project and wait for the network to settle
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Ensure the output directory exists
    const outDir = path.join(__dirname, '..', 'public', 'assets');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const safeProjectName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const screenshotPath = path.join(outDir, `${safeProjectName}-auto-screenshot.jpg`);
    
    // Take a full-page or viewport high-quality JPEG screenshot
    await page.screenshot({ 
      path: screenshotPath, 
      type: 'jpeg',
      quality: 90,
      fullPage: false // Change to true if you want the entire scrolling page
    });

    console.log(`✅ Professional screenshot successfully saved to: ${screenshotPath}`);
  } catch (err) {
    console.error(`❌ Failed to capture screenshot for ${url}:`, err);
  } finally {
    await browser.close();
  }
}

takeScreenshot();
