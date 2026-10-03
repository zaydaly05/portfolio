const path = require('path');
const fs = require('fs');
const { runAllShowcases, processProjectShowcase } = require('./showcase/showcase-manager');

// Load portfolio projects from server.js portfolioData or argument
function getPortfolioProjects() {
  const serverJsPath = path.join(__dirname, '..', 'server.js');
  const content = fs.readFileSync(serverJsPath, 'utf8');

  // Parse projects array from server.js
  const match = content.match(/projects:\s*(\[\s*\{[\s\S]*?\}\s*\])/);
  if (match) {
    try {
      // Evaluate safe projects array
      const projectsFn = new Function(`return ${match[1]};`);
      return projectsFn();
    } catch (err) {
      console.error("Failed to parse projects from server.js:", err.message);
    }
  }
  return [];
}

async function main() {
  const targetProjectArg = process.argv[2];
  const projects = getPortfolioProjects();

  if (projects.length === 0) {
    console.error("No portfolio projects found in server.js");
    process.exit(1);
  }

  if (targetProjectArg) {
    const target = projects.find(p => p.name.toLowerCase().includes(targetProjectArg.toLowerCase()) || p.github?.toLowerCase().includes(targetProjectArg.toLowerCase()));
    if (target) {
      console.log(`Targeting single project: ${target.name}`);
      await processProjectShowcase(target);
    } else {
      console.error(`Project matching "${targetProjectArg}" not found.`);
    }
  } else {
    await runAllShowcases(projects);
  }
}

main().catch(err => {
  console.error("Fatal Showcase Error:", err);
  process.exit(1);
});
