/* ============================================
   AUTOMATED COMPONENT & LAYOUT VERIFICATION TEST
   Verifies that all HTML pages contain required centralized placeholders
   and that all JavaScript modules compile without syntax errors.
   ============================================ */

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { execSync } = require("child_process");

console.log("🔍 Running Automated Portfolio Component Verification Tests...\n");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const HTML_PAGES = ["index.html", "projects.html", "skills.html", "experience.html", "contact.html"];
const CORE_JS_FILES = ["layout.js", "modals.js", "buttons.js", "ui-effects.js", "script.js"];

let errors = 0;

// Test 1: Verify JS files compile cleanly
CORE_JS_FILES.forEach((file) => {
  const filePath = path.join(PUBLIC_DIR, file);
  try {
    execSync(`node -c "${filePath}"`);
    console.log(`  ✓ ${file} compiled successfully with zero syntax errors.`);
  } catch (err) {
    console.error(`  ❌ Syntax error detected in ${file}!`, err.message);
    errors++;
  }
});

console.log("");

// Test 2: Verify HTML files contain single source of truth component scripts and placeholders
HTML_PAGES.forEach((page) => {
  const filePath = path.join(PUBLIC_DIR, page);
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ Missing HTML file: ${page}`);
    errors++;
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  // Check required script tags
  const requiredScripts = ["layout.js", "modals.js", "buttons.js", "ui-effects.js", "script.js"];
  requiredScripts.forEach((script) => {
    assert.strictEqual(
      content.includes(`src="${script}`),
      true,
      `${page} is missing script tag for ${script}`
    );
  });

  // Check centralized header and footer placeholders
  assert.strictEqual(
    content.includes('id="site-header"'),
    true,
    `${page} is missing <header id="site-header"></header>`
  );
  assert.strictEqual(
    content.includes('id="site-footer"'),
    true,
    `${page} is missing <footer id="site-footer"></footer>`
  );

  console.log(`  ✓ ${page} verified: contains all modular scripts and #site-header / #site-footer placeholders.`);
});

console.log("");

if (errors === 0) {
  console.log("🎉 All Component & Layout Verification Tests Passed Successfully!");
  process.exit(0);
} else {
  console.error(`💥 ${errors} verification test failure(s) found.`);
  process.exit(1);
}
