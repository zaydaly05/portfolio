const path = require('path');
const fs = require('fs');
const { runAllShowcases, processProjectShowcase } = require('./showcase/showcase-manager');

// Load portfolio projects: the live site when PORTFOLIO_URL is set, otherwise the built-in seed data.
async function getPortfolioProjects() {
  const siteUrl = (process.env.PORTFOLIO_URL || '').replace(/\/+$/, '');
  if (siteUrl) {
    try {
      const response = await fetch(`${siteUrl}/api/portfolio`);
      if (response.ok) return (await response.json()).projects || [];
    } catch (err) {
      console.warn(`Could not read ${siteUrl}/api/portfolio (${err.message}); using built-in data.`);
    }
  }
  return require('../data/defaults').projects;
}

async function main() {
  const targetProjectArg = process.argv[2];
  const projects = await getPortfolioProjects();

  if (projects.length === 0) {
    console.error("No portfolio projects found");
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
