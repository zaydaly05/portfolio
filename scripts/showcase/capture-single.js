const { captureProjectScreenshots } = require('./repo-capturer');

async function run() {
  const url = process.argv[2] || 'http://localhost:4099';
  const slug = process.argv[3] || 'Gulf_Limousine_App';
  const isMobile = process.argv[4] === 'true';

  console.log(`Starting capture for ${slug} at ${url} (isMobile=${isMobile})...`);
  const results = await captureProjectScreenshots(url, slug, { isMobile, maxScreenshots: 6 });
  console.log(`Finished capture for ${slug}. Total accepted: ${results.length}`);
}

run();
