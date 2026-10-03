const fs = require('fs');
const path = require('path');

/**
 * Advanced Repository Analyzer & Application Entry Finder
 * Recursively inspects repository root and subdirectories (frontend, client, web, mvc, ui, etc.)
 * to locate actual runnable web applications and prevent generic static directory listing fallbacks.
 */

function analyzeRepository(repoPath, projectInfo = {}) {
  const result = {
    name: projectInfo.name || path.basename(repoPath),
    repoPath,
    appDir: repoPath,
    relativePath: '',
    isSupported: true,
    isWebRunnable: true,
    framework: 'Unknown',
    language: 'JavaScript',
    installCmd: null,
    startCmd: null,
    defaultPort: 3000,
    routesToExplore: ['/'],
    reason: null
  };

  if (!fs.existsSync(repoPath)) {
    result.isSupported = false;
    result.isWebRunnable = false;
    result.reason = 'Repository directory does not exist locally.';
    return result;
  }

  // 1. Locate actual web application subfolder if present
  const appSubDir = findWebApplicationSubfolder(repoPath);
  if (appSubDir) {
    result.appDir = appSubDir;
    result.relativePath = path.relative(repoPath, appSubDir).replace(/\\/g, '/');
  }

  const targetDir = result.appDir;
  const files = fs.readdirSync(targetDir);
  const pkgPath = path.join(targetDir, 'package.json');
  const pubspecPath = path.join(targetDir, 'pubspec.yaml');
  const csprojFiles = files.filter(f => f.endsWith('.csproj') || f.endsWith('.sln'));
  const pomPath = path.join(targetDir, 'pom.xml');
  const reqTxtPath = path.join(targetDir, 'requirements.txt');

  // Check if index.html exists in targetDir or its common public/dist/build subfolders
  const indexHtmlPath = findIndexHtml(targetDir);

  // 2. Node.js / React / Next.js / Vite / Express Web Projects
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      const scripts = pkg.scripts || {};

      result.language = 'JavaScript/TypeScript';

      if (deps['next']) {
        result.framework = 'Next.js';
        result.installCmd = 'npm install --prefer-offline --no-audit --legacy-peer-deps';
        result.startCmd = scripts.dev ? 'npm run dev -- -p {PORT}' : 'npx next dev -p {PORT}';
        result.routesToExplore = ['/', '/#projects', '/#about', '/#contact'];
        return result;
      }
      
      if (deps['vite']) {
        result.framework = 'React (Vite)';
        result.installCmd = 'npm install --prefer-offline --no-audit --legacy-peer-deps';
        result.startCmd = scripts.dev ? 'npm run dev -- --port {PORT} --host' : 'npx vite --port {PORT} --host';
        extractRoutesFromRepo(targetDir, result);
        return result;
      }

      if (deps['react-scripts'] || deps['react']) {
        result.framework = 'React';
        result.installCmd = 'npm install --prefer-offline --no-audit --legacy-peer-deps';
        if (fs.existsSync(path.join(targetDir, 'build'))) {
          result.startCmd = 'npx serve -s build -p {PORT}';
        } else if (fs.existsSync(path.join(targetDir, 'dist'))) {
          result.startCmd = 'npx serve -s dist -p {PORT}';
        } else if (scripts.dev) {
          result.startCmd = 'npm run dev -- --port {PORT}';
        } else if (scripts.start) {
          result.startCmd = process.platform === 'win32' ? 'set PORT={PORT} && npm start' : 'PORT={PORT} npm start';
        } else if (indexHtmlPath) {
          result.startCmd = 'npx serve -s . -p {PORT}';
        } else {
          result.startCmd = 'npx serve -s public -p {PORT}';
        }
        extractRoutesFromRepo(targetDir, result);
        return result;
      }

      if (deps['express'] || scripts.start || pkg.main) {
        result.framework = 'Node.js / Express';
        result.installCmd = 'npm install --prefer-offline --no-audit';
        const mainFile = pkg.main || (fs.existsSync(path.join(targetDir, 'server.js')) ? 'server.js' : (fs.existsSync(path.join(targetDir, 'app.js')) ? 'app.js' : 'index.js'));
        result.startCmd = scripts.start ? 'npm start' : `node ${mainFile}`;
        extractRoutesFromRepo(targetDir, result);
        return result;
      }

      // If package.json exists but has no web dev scripts, check if static index.html exists
      if (indexHtmlPath) {
        const serveSubDir = path.relative(targetDir, path.dirname(indexHtmlPath)).replace(/\\/g, '/') || '.';
        result.framework = 'Static Web App';
        result.startCmd = `npx serve -s ${serveSubDir} -p {PORT}`;
        extractRoutesFromHtml(indexHtmlPath, result);
        return result;
      }

    } catch (err) {
      console.warn(`[Analyzer] Note parsing package.json in ${targetDir}: ${err.message}`);
    }
  }

  // 3. Genuine Static HTML/CSS/JS Projects (MUST have an actual index.html)
  if (indexHtmlPath) {
    const serveSubDir = path.relative(targetDir, path.dirname(indexHtmlPath)).replace(/\\/g, '/') || '.';
    result.framework = 'Static HTML5 / CSS3 / JavaScript';
    result.language = 'HTML/CSS/JS';
    result.installCmd = null;
    result.startCmd = `npx serve -s ${serveSubDir} -p {PORT}`;
    extractRoutesFromHtml(indexHtmlPath, result);
    return result;
  }

  // 4. Flutter / Flutter Web
  if (fs.existsSync(pubspecPath)) {
    const hasWebFolder = fs.existsSync(path.join(targetDir, 'web'));
    result.language = 'Dart / Flutter';
    if (hasWebFolder) {
      result.framework = 'Flutter Web';
      result.installCmd = 'flutter pub get';
      result.startCmd = 'flutter run -d web-server --web-port {PORT}';
    } else {
      result.isSupported = false;
      result.isWebRunnable = false;
      result.framework = 'Flutter Mobile';
      result.reason = 'Flutter mobile application requires native Android emulator or physical device environment.';
    }
    return result;
  }

  // 5. .NET / C#
  if (csprojFiles.length > 0) {
    result.language = 'C# / .NET';
    // Check if it's a web project (API with Swagger or Web App) vs Desktop WPF/WinForms/Domain library
    const isWebProject = csprojFiles.some(f => {
      const pContent = fs.readFileSync(path.join(targetDir, f), 'utf8');
      return pContent.includes('Microsoft.NET.Sdk.Web') || pContent.includes('Swashbuckle') || pContent.includes('Endpoints');
    });

    if (isWebProject) {
      result.framework = '.NET Web API / Application';
      result.installCmd = 'dotnet restore';
      result.startCmd = 'dotnet run --urls http://localhost:{PORT}';
      result.routesToExplore = ['/', '/swagger/index.html', '/swagger'];
    } else {
      result.isSupported = false;
      result.isWebRunnable = false;
      result.framework = '.NET Desktop / Domain Library';
      result.reason = 'C# solution contains desktop GUI or class libraries without a browser web frontend.';
    }
    return result;
  }

  // 6. Java / Spring Boot
  if (fs.existsSync(pomPath)) {
    result.language = 'Java';
    const pomContent = fs.readFileSync(pomPath, 'utf8');
    if (pomContent.includes('javafx')) {
      result.isSupported = false;
      result.isWebRunnable = false;
      result.framework = 'Java / JavaFX Desktop';
      result.reason = 'JavaFX desktop GUI application requires native display server.';
    } else {
      result.framework = 'Java / Spring Boot';
      result.installCmd = './mvnw clean compile';
      result.startCmd = './mvnw spring-boot:run -Dspring-boot.run.arguments="--server.port={PORT}"';
    }
    return result;
  }

  // 7. Python Web
  if (fs.existsSync(reqTxtPath) || files.some(f => f.endsWith('.py'))) {
    result.language = 'Python';
    result.framework = 'Python Web';
    result.installCmd = 'pip install -r requirements.txt';
    const pyEntry = files.find(f => f === 'app.py' || f === 'main.py' || f === 'server.py') || 'app.py';
    result.startCmd = `python ${pyEntry}`;
    return result;
  }

  // CRITICAL RULE: NEVER ACCEPT A REPOSITORY WITHOUT A VALID WEB ENTRY POINT OR INDEX.HTML
  result.isSupported = false;
  result.isWebRunnable = false;
  result.framework = 'Codebase / CLI / Utilities';
  result.reason = 'Repository contains no runnable web application or static index.html entry point.';
  return result;
}

function findWebApplicationSubfolder(repoPath) {
  const candidates = [
    'frontend', 'client', 'web', 'ui', 'app', 'site',
    'mvc/frontend', 'mvc/web', 'src/frontend', 'src/web',
    'public', 'dist'
  ];

  for (const c of candidates) {
    const full = path.join(repoPath, c);
    if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
      const hasPkg = fs.existsSync(path.join(full, 'package.json'));
      const hasIndex = fs.existsSync(path.join(full, 'index.html')) || fs.existsSync(path.join(full, 'public', 'index.html'));
      if (hasPkg || hasIndex) {
        return full;
      }
    }
  }

  // Scan 1-level deep subdirectories for package.json with web dependencies
  try {
    const subdirs = fs.readdirSync(repoPath).filter(f => {
      const full = path.join(repoPath, f);
      return fs.statSync(full).isDirectory() && !f.startsWith('.') && f !== 'node_modules';
    });

    for (const sub of subdirs) {
      const full = path.join(repoPath, sub);
      const pkgPath = path.join(full, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        if (deps['next'] || deps['react'] || deps['vite'] || deps['express'] || deps['vue'] || deps['angular']) {
          return full;
        }
      }
    }
  } catch {}

  return null;
}

function findIndexHtml(dirPath) {
  const possibilities = [
    path.join(dirPath, 'index.html'),
    path.join(dirPath, 'public', 'index.html'),
    path.join(dirPath, 'dist', 'index.html'),
    path.join(dirPath, 'build', 'index.html'),
    path.join(dirPath, 'src', 'index.html')
  ];
  return possibilities.find(p => fs.existsSync(p)) || null;
}

function extractRoutesFromHtml(indexPath, result) {
  try {
    const html = fs.readFileSync(indexPath, 'utf8');
    const hrefMatches = html.match(/href=["'](#[\w-]+|\/[\w-/.]*)/g) || [];
    const routes = new Set(['/']);
    hrefMatches.forEach(m => {
      const href = m.replace(/^href=["']|["']$/g, '');
      if (href && href !== '#' && !href.startsWith('http') && !href.endsWith('.css') && !href.endsWith('.pdf')) {
        routes.add(href.startsWith('#') || href.startsWith('/') ? href : `/${href}`);
      }
    });
    result.routesToExplore = Array.from(routes).slice(0, 6);
  } catch {}
}

function extractRoutesFromRepo(repoPath, result) {
  try {
    const readmePath = path.join(repoPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      const readme = fs.readFileSync(readmePath, 'utf8');
      const routeMatches = readme.match(/\/(dashboard|projects|about|contact|menu|cart|catalog|settings|features|auth|login)/gi) || [];
      routeMatches.forEach(r => result.routesToExplore.push(r.toLowerCase()));
    }
    result.routesToExplore = Array.from(new Set(result.routesToExplore)).slice(0, 6);
  } catch {}
}

module.exports = { analyzeRepository, findWebApplicationSubfolder };
