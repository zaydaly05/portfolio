const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { analyzeRepository } = require('./repo-analyzer');
const { startProject } = require('./repo-runner');
const { captureProjectScreenshots } = require('./repo-capturer');

/**
 * Intelligent Showcase Manager & Orchestrator v2.0
 * Enforces strict Quality Gate validation, status lifecycle (COMPLETED, PARTIAL, FAILED, UNSUPPORTED),
 * diagnostic logging, and screenshot preservation.
 */

const MANIFEST_PATH = path.join(__dirname, 'showcase-manifest.json');
const TEMP_PROJECTS_DIR = path.join(__dirname, '..', '..', 'temp_projects');

function loadManifest() {
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch {}
  }
  return { lastUpdated: null, projects: {} };
}

function saveManifest(manifest) {
  manifest.lastUpdated = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
}

function extractRepoSlug(githubUrl, name) {
  if (githubUrl) {
    const match = githubUrl.match(/github\.com\/[^/]+\/([^/#?]+)/i);
    if (match) return match[1].replace(/\.git$/i, '');
  }
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
}

async function processProjectShowcase(project, options = {}) {
  const manifest = loadManifest();
  const githubUrl = project.github;
  const slug = extractRepoSlug(githubUrl, project.name);

  console.log(`\n========================================`);
  console.log(`📦 Processing Showcase for: ${project.name} (${slug})`);
  console.log(`   Repo URL: ${githubUrl || 'N/A'}`);
  console.log(`========================================`);

  const existingProjectData = manifest.projects[slug] || {};
  const previousGoodScreenshots = existingProjectData.screenshots || [];

  manifest.projects[slug] = {
    ...existingProjectData,
    name: project.name,
    slug,
    github: githubUrl,
    status: 'Analyzing',
    updatedAt: new Date().toISOString(),
    diagnostics: {
      startedAt: new Date().toISOString(),
      appDir: null,
      startCmd: null,
      port: null,
      targetUrl: null,
      acceptedCount: 0,
      rejectedReasons: []
    }
  };
  saveManifest(manifest);

  // 1. Prepare repository directory
  let repoPath = path.join(TEMP_PROJECTS_DIR, slug);
  const workspaceLocalRepo = path.join(__dirname, '..', '..', slug);

  if (fs.existsSync(workspaceLocalRepo) && fs.statSync(workspaceLocalRepo).isDirectory()) {
    repoPath = workspaceLocalRepo;
  } else if (!fs.existsSync(repoPath) && githubUrl) {
    if (!fs.existsSync(TEMP_PROJECTS_DIR)) {
      fs.mkdirSync(TEMP_PROJECTS_DIR, { recursive: true });
    }
    console.log(`[Showcase] Cloning ${githubUrl} into sandbox: ${repoPath}...`);
    try {
      execSync(`git clone --depth 1 ${githubUrl} "${repoPath}"`, { stdio: 'inherit', timeout: 60000 });
    } catch (cErr) {
      console.warn(`[Showcase] Could not clone ${githubUrl}: ${cErr.message}`);
    }
  }

  // 2. Analyze repository
  const analysis = analyzeRepository(repoPath, project);
  manifest.projects[slug].analysis = {
    framework: analysis.framework,
    language: analysis.language,
    isWebRunnable: analysis.isWebRunnable,
    startCmd: analysis.startCmd,
    appDir: analysis.appDir
  };
  manifest.projects[slug].diagnostics.appDir = analysis.appDir;
  manifest.projects[slug].diagnostics.startCmd = analysis.startCmd;

  if (!analysis.isWebRunnable) {
    console.log(`[Showcase] ⚠️ Project "${project.name}" is marked as Unsupported/Non-Web.`);
    console.log(`   Reason: ${analysis.reason}`);
    manifest.projects[slug].status = 'Unsupported';
    manifest.projects[slug].reason = analysis.reason;
    manifest.projects[slug].screenshots = previousGoodScreenshots; // Preserve previous good screenshots
    saveManifest(manifest);
    return manifest.projects[slug];
  }

  // 3. Run application
  manifest.projects[slug].status = 'Running';
  saveManifest(manifest);

  let runnerResult = null;
  try {
    runnerResult = await startProject(analysis, { timeoutMs: 40000 });

    manifest.projects[slug].diagnostics.port = runnerResult.port;
    manifest.projects[slug].diagnostics.targetUrl = runnerResult.targetUrl;

    if (!runnerResult.isReady) {
      throw new Error(`Application server failed to respond at ${runnerResult.targetUrl}`);
    }

    // 4. Capture & Validate Screenshots
    manifest.projects[slug].status = 'Capturing';
    saveManifest(manifest);

    const screenshots = await captureProjectScreenshots(runnerResult.targetUrl, slug, {
      routesToExplore: analysis.routesToExplore,
      framework: analysis.framework,
      language: analysis.language
    });

    manifest.projects[slug].diagnostics.acceptedCount = screenshots.length;

    // Strict Quality Gate Status Evaluation
    if (screenshots && screenshots.length >= 2) {
      manifest.projects[slug].status = 'Completed';
      manifest.projects[slug].screenshots = screenshots.map(s => ({
        src: s.relativePath,
        alt: `${project.name} - ${s.caption}`,
        type: 'image',
        hash: s.hash
      }));
      console.log(`[Showcase] ✅ Showcase COMPLETED for ${project.name} with ${screenshots.length} valid screenshots!`);
    } else if (screenshots && screenshots.length === 1) {
      manifest.projects[slug].status = 'Partial';
      manifest.projects[slug].screenshots = screenshots.map(s => ({
        src: s.relativePath,
        alt: `${project.name} - ${s.caption}`,
        type: 'image',
        hash: s.hash
      }));
      console.log(`[Showcase] ⚠️ Showcase PARTIAL for ${project.name} with 1 valid screenshot.`);
    } else {
      manifest.projects[slug].status = 'Failed';
      manifest.projects[slug].reason = 'Screenshot Quality Gate rejected all candidates (directory listings, blank screens, or errors).';
      manifest.projects[slug].screenshots = previousGoodScreenshots; // Preserve previous good screenshots
      console.error(`[Showcase] ❌ Showcase FAILED for ${project.name}: No valid screenshots passed Quality Gate.`);
    }

  } catch (err) {
    console.error(`[Showcase] ❌ Failed showcase generation for ${project.name}:`, err.message);
    manifest.projects[slug].status = 'Failed';
    manifest.projects[slug].reason = err.message;
    manifest.projects[slug].screenshots = previousGoodScreenshots; // Preserve previous good screenshots
  } finally {
    if (runnerResult && runnerResult.stop) {
      console.log(`[Showcase] Terminating isolated process tree for ${project.name}...`);
      runnerResult.stop();
    }
  }

  saveManifest(manifest);

  // 5. Cloudinary Media Upload & Mapping (if configured & valid screenshots exist)
  if (manifest.projects[slug].screenshots && manifest.projects[slug].screenshots.length > 0) {
    try {
      const cloudScript = path.join(__dirname, '..', 'upload-to-cloudinary.js');
      if (fs.existsSync(cloudScript)) {
        console.log('[Showcase] Running Cloudinary media sync to update image URLs...');
        execSync('node scripts/upload-to-cloudinary.js', { stdio: 'ignore' });
        const mapPath = path.join(__dirname, '..', 'cloudinary-map.json');
        if (fs.existsSync(mapPath)) {
          const cloudMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
          manifest.projects[slug].screenshots = manifest.projects[slug].screenshots.map(s => ({
            ...s,
            src: cloudMap[s.src] || s.src
          }));
          saveManifest(manifest);
        }
      }
    } catch {}
  }

  return manifest.projects[slug];
}

async function runAllShowcases(projects = []) {
  console.log(`\n🌟 Starting Automated Showcase Pipeline for ${projects.length} projects...\n`);
  const results = [];
  for (const project of projects) {
    try {
      const res = await processProjectShowcase(project);
      results.push(res);
    } catch (err) {
      console.error(`Error processing ${project.name}:`, err.message);
    }
  }
  console.log(`\n🎉 Showcase Pipeline execution complete!\n`);
  return results;
}

module.exports = { processProjectShowcase, runAllShowcases, loadManifest, saveManifest, extractRepoSlug };
