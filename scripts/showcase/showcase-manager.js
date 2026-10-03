const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { analyzeRepository } = require('./repo-analyzer');
const { startProject } = require('./repo-runner');
const { captureProjectScreenshots } = require('./repo-capturer');

/**
 * Intelligent Showcase Manager & Orchestrator
 * Coordinates repository cloning, analysis, execution, screenshot capture,
 * Cloudinary asset synchronization, and portfolio integration.
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

  manifest.projects[slug] = manifest.projects[slug] || {
    name: project.name,
    slug,
    github: githubUrl,
    status: 'Pending',
    updatedAt: new Date().toISOString(),
    screenshots: []
  };

  manifest.projects[slug].status = 'Analyzing';
  saveManifest(manifest);

  // 1. Prepare repository directory
  let repoPath = path.join(TEMP_PROJECTS_DIR, slug);

  // Check if repo already exists locally in workspace or temp_projects
  const workspaceLocalRepo = path.join(__dirname, '..', '..', slug);
  if (fs.existsSync(workspaceLocalRepo) && fs.statSync(workspaceLocalRepo).isDirectory()) {
    repoPath = workspaceLocalRepo;
  } else if (!fs.existsSync(repoPath) && githubUrl) {
    if (!fs.existsSync(TEMP_PROJECTS_DIR)) {
      fs.mkdirSync(TEMP_PROJECTS_DIR, { recursive: true });
    }
    console.log(`[Showcase] Cloning ${githubUrl} into isolated sandbox: ${repoPath}...`);
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
    startCmd: analysis.startCmd
  };

  if (!analysis.isWebRunnable) {
    console.log(`[Showcase] ⚠️ Project "${project.name}" is marked as unsupported/non-web.`);
    console.log(`   Reason: ${analysis.reason}`);
    manifest.projects[slug].status = 'Unsupported';
    manifest.projects[slug].reason = analysis.reason;
    saveManifest(manifest);
    return manifest.projects[slug];
  }

  // 3. Run application
  manifest.projects[slug].status = 'Running';
  saveManifest(manifest);

  let runnerResult = null;
  try {
    runnerResult = await startProject(analysis, { timeoutMs: 35000 });

    if (!runnerResult.isReady) {
      throw new Error(`Application failed to start or accept HTTP connections on port ${runnerResult.port}`);
    }

    // 4. Capture Screenshots
    manifest.projects[slug].status = 'Capturing';
    saveManifest(manifest);

    const screenshots = await captureProjectScreenshots(runnerResult.targetUrl, slug, {
      routesToExplore: analysis.routesToExplore
    });

    if (screenshots && screenshots.length > 0) {
      manifest.projects[slug].status = 'Completed';
      manifest.projects[slug].screenshots = screenshots.map(s => ({
        src: s.relativePath,
        alt: `${project.name} - ${s.caption}`,
        type: 'image'
      }));
      console.log(`[Showcase] ✅ Successfully updated showcase for ${project.name} with ${screenshots.length} screenshots!`);
    } else {
      manifest.projects[slug].status = 'Failed';
      manifest.projects[slug].reason = 'No valid screenshots were captured during browser exploration.';
    }

  } catch (err) {
    console.error(`[Showcase] ❌ Failed to generate showcase for ${project.name}:`, err.message);
    manifest.projects[slug].status = 'Failed';
    manifest.projects[slug].reason = err.message;
  } finally {
    if (runnerResult && runnerResult.stop) {
      console.log(`[Showcase] Terminating isolated process tree for ${project.name}...`);
      runnerResult.stop();
    }
  }

  saveManifest(manifest);

  // 5. Cloudinary Media Upload & Mapping (if configured)
  try {
    const cloudScript = path.join(__dirname, '..', 'upload-to-cloudinary.js');
    if (fs.existsSync(cloudScript)) {
      console.log('[Showcase] Running Cloudinary media sync to update image URLs...');
      execSync('node scripts/upload-to-cloudinary.js', { stdio: 'ignore' });
      const mapPath = path.join(__dirname, '..', 'cloudinary-map.json');
      if (fs.existsSync(mapPath)) {
        const cloudMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
        // Update local screenshot URLs to Cloudinary CDN URLs if mapped
        manifest.projects[slug].screenshots = manifest.projects[slug].screenshots.map(s => ({
          ...s,
          src: cloudMap[s.src] || s.src
        }));
        saveManifest(manifest);
      }
    }
  } catch {}

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
