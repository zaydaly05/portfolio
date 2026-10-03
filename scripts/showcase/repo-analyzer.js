const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Intelligent Repository Analyzer
 * Analyzes repository files (README, package.json, source files, config files)
 * to determine project type, framework, build/run commands, ports, and routes.
 */

function analyzeRepository(repoPath, projectInfo = {}) {
  const result = {
    name: projectInfo.name || path.basename(repoPath),
    repoPath,
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

  const files = fs.readdirSync(repoPath);
  const pkgPath = path.join(repoPath, 'package.json');
  const indexHtmlPath = path.join(repoPath, 'index.html');
  const pubspecPath = path.join(repoPath, 'pubspec.yaml');
  const csprojFiles = files.filter(f => f.endsWith('.csproj') || f.endsWith('.sln'));
  const pomPath = path.join(repoPath, 'pom.xml');
  const reqTxtPath = path.join(repoPath, 'requirements.txt');

  // 1. Node.js / React / Next.js / Vite Projects
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      const scripts = pkg.scripts || {};

      result.language = 'JavaScript/TypeScript';

      if (deps['next']) {
        result.framework = 'Next.js';
        result.installCmd = 'npm install --prefer-offline --no-audit';
        result.startCmd = scripts.dev ? 'npm run dev -- -p {PORT}' : 'npx next dev -p {PORT}';
        result.routesToExplore = ['/', '/#projects', '/#about', '/#contact'];
      } else if (deps['react'] || deps['vite']) {
        result.framework = deps['vite'] ? 'React (Vite)' : 'React';
        result.installCmd = 'npm install --prefer-offline --no-audit';
        result.startCmd = scripts.dev ? 'npm run dev -- --port {PORT}' : 'npx serve -s . -p {PORT}';
      } else if (deps['express'] || scripts.start || pkg.main) {
        result.framework = 'Node.js / Express';
        result.installCmd = 'npm install --prefer-offline --no-audit';
        const mainFile = pkg.main || (fs.existsSync(path.join(repoPath, 'server.js')) ? 'server.js' : (fs.existsSync(path.join(repoPath, 'app.js')) ? 'app.js' : 'index.js'));
        result.startCmd = scripts.start ? 'npm start' : `node ${mainFile}`;
      } else {
        result.framework = 'Node.js';
        result.installCmd = 'npm install --prefer-offline --no-audit';
        result.startCmd = 'npx serve -p {PORT} .';
      }

      // Check for available routes in project files
      extractRoutesFromRepo(repoPath, result);
      return result;
    } catch (err) {
      console.warn(`[Analyzer] Note parsing package.json in ${repoPath}: ${err.message}`);
    }
  }

  // 2. Static HTML/CSS/JS Projects
  if (fs.existsSync(indexHtmlPath)) {
    result.framework = 'Static HTML5 / CSS3 / JavaScript';
    result.language = 'HTML/CSS/JS';
    result.installCmd = null;
    result.startCmd = 'npx serve -p {PORT} .';
    extractRoutesFromHtml(indexHtmlPath, result);
    return result;
  }

  // 3. Flutter / Flutter Web
  if (fs.existsSync(pubspecPath)) {
    const hasWebFolder = fs.existsSync(path.join(repoPath, 'web'));
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

  // 4. .NET / C#
  if (csprojFiles.length > 0) {
    result.language = 'C# / .NET';
    result.framework = '.NET Web Application';
    result.installCmd = 'dotnet restore';
    result.startCmd = 'dotnet run --urls http://localhost:{PORT}';
    return result;
  }

  // 5. Java / JavaFX / Spring Boot
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

  // 6. Python Web
  if (fs.existsSync(reqTxtPath) || files.some(f => f.endsWith('.py'))) {
    result.language = 'Python';
    result.framework = 'Python Web';
    result.installCmd = 'pip install -r requirements.txt';
    const pyEntry = files.find(f => f === 'app.py' || f === 'main.py' || f === 'server.py') || 'app.py';
    result.startCmd = `python ${pyEntry}`;
    return result;
  }

  // Fallback for non-web / unknown
  result.isSupported = false;
  result.isWebRunnable = false;
  result.framework = 'Codebase / CLI / Utilities';
  result.reason = 'Repository is non-visual or CLI/library project without a web server interface.';
  return result;
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

module.exports = { analyzeRepository };
