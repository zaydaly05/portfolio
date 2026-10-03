const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Load .env.local or .env if present
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envPath = path.join(__dirname, '..', '.env');

function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0 && !process.env[key.trim()]) {
          process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  }
}

loadEnvFile(envPath);
loadEnvFile(envLocalPath);

// Configure Cloudinary
let cloudUrl = (process.env.CLOUDINARY_URL || '').trim();
// Automatically strip formatting brackets < > if user included them
if (cloudUrl) {
  cloudUrl = cloudUrl.replace(/<([^>]+)>/g, '$1');
}
let cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').replace(/[<>]/g, '').trim();
let apiKey = (process.env.CLOUDINARY_API_KEY || '').replace(/[<>]/g, '').trim();
let apiSecret = (process.env.CLOUDINARY_API_SECRET || '').replace(/[<>]/g, '').trim();

if (cloudUrl) {
  const match = cloudUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/i);
  if (match) {
    apiKey = match[1];
    apiSecret = match[2];
    cloudName = match[3].toLowerCase();
  }
}

const isPlaceholder = cloudUrl.includes('API_KEY') || cloudName === 'your_cloud_name';

if (!cloudName || !apiKey || !apiSecret || isPlaceholder) {
  console.error('\n❌ ERROR: Cloudinary credentials missing or set to placeholder!\n');
  console.log('Please add your Cloudinary URL or credentials to .env.local:');
  console.log('CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>\n');
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

const PUBLIC_ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const MAP_FILE = path.join(__dirname, 'cloudinary-map.json');

// Get all files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Ignore OS hidden files or non-media links
      if (!file.startsWith('.') && !file.endsWith('.lnk')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function uploadAssets() {
  console.log('🚀 Starting Cloudinary Media Upload...\n');
  const files = getAllFiles(PUBLIC_ASSETS_DIR);
  const urlMap = {};

  if (fs.existsSync(MAP_FILE)) {
    try {
      Object.assign(urlMap, JSON.parse(fs.readFileSync(MAP_FILE, 'utf8')));
    } catch {
      // Ignore invalid JSON map
    }

    // Clean up obsolete keys if local file no longer exists
    Object.keys(urlMap).forEach((key) => {
      const localFile = path.join(__dirname, '..', 'public', key.replace(/^\//, ''));
      if (!fs.existsSync(localFile)) {
        delete urlMap[key];
      }
    });
  }

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const relativePath = path.relative(path.join(__dirname, '..', 'public'), filePath).replace(/\\/g, '/');
    const assetKey = '/' + relativePath;

    // Generate clean Cloudinary public ID
    const pathParsed = path.parse(relativePath);
    const subFolder = pathParsed.dir.replace(/^assets\/?/, '');
    const cleanFileName = pathParsed.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const publicId = subFolder
      ? `zayd-portfolio/${subFolder}/${cleanFileName}`
      : `zayd-portfolio/${cleanFileName}`;

    if (urlMap[assetKey] && !process.argv.includes('--force')) {
      console.log(`[${i + 1}/${files.length}] Cached: ${assetKey}`);
      continue;
    }

    console.log(`[${i + 1}/${files.length}] Uploading ${assetKey}...`);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'auto'
      });

      urlMap[assetKey] = result.secure_url;
      console.log(`   ✓ Uploaded: ${result.secure_url}`);
    } catch (err) {
      console.error(`   ❌ Failed to upload ${assetKey}:`, err.message || err);
    }
  }

  // Save URL map
  fs.writeFileSync(MAP_FILE, JSON.stringify(urlMap, null, 2));
  console.log(`\n✅ Upload complete! Cloudinary URL map saved to: scripts/cloudinary-map.json`);

  const shouldReplace = process.argv.includes('--replace');
  if (shouldReplace) {
    replaceUrlsInProject(urlMap);
  } else {
    console.log('\n💡 Tip: Run `node scripts/upload-to-cloudinary.js --replace` to automatically update image URLs in your HTML/CSS/JS files!');
  }
}

function replaceUrlsInProject(urlMap) {
  console.log('\n🔄 Updating HTML, CSS, and JS references with Cloudinary URLs...');
  const publicDir = path.join(__dirname, '..', 'public');
  const filesToScan = getAllFiles(publicDir).filter((f) => /\.(html|css|js|json)$/i.test(f));

  let totalReplacements = 0;

  filesToScan.forEach((filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileModified = false;

    Object.entries(urlMap).forEach(([localUrl, cloudinaryUrl]) => {
      // Escape for regex matching
      const relativeUrlNoSlash = localUrl.replace(/^\//, '');
      
      if (content.includes(localUrl) || content.includes(relativeUrlNoSlash)) {
        content = content.split(localUrl).join(cloudinaryUrl);
        content = content.split(relativeUrlNoSlash).join(cloudinaryUrl);
        fileModified = true;
        totalReplacements++;
      }
    });

    if (fileModified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✓ Updated: ${path.relative(path.join(__dirname, '..'), filePath)}`);
    }
  });

  console.log(`\n🎉 Replaced ${totalReplacements} image links with Cloudinary URLs across your project!`);
}

uploadAssets().catch((err) => {
  console.error('Fatal error during Cloudinary upload:', err);
});
