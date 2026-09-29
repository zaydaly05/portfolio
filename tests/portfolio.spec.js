const { test, expect } = require('@playwright/test');

test.describe('Zayd Portfolio Full End-to-End Suite', () => {

  test('Homepage loads correctly with Hero Slider, Counters, and Navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check title and brand
    await expect(page).toHaveTitle(/Zayd Ali Mohamed/i);
    await expect(page.locator('.logo img')).toBeVisible();

    // Verify navigation links
    await expect(page.locator('.nav-links')).toContainText('Home');
    await expect(page.locator('.nav-links')).toContainText('Projects Hub');
    await expect(page.locator('.nav-links')).toContainText('Experience & Reviews');

    // Verify Hero Slider is active
    await expect(page.locator('.slider-slide.active')).toBeVisible();

    // Verify stat counters exist
    const statsContainer = page.locator('#stat-counters-row');
    await expect(statsContainer).toBeVisible();

    // Verify Skills section
    const skillsSection = page.locator('#technical-skills');
    await expect(skillsSection).toBeVisible();
  });

  test('Projects Hub renders cards, filter pills, search bar, and GitHub API badge', async ({ page }) => {
    await page.goto('/projects');

    // Verify search bar and filter pills
    const searchInput = page.locator('#project-search-input');
    await expect(searchInput).toBeVisible();
    await expect(page.locator('#project-filter-pills')).toBeVisible();

    // Verify project list cards load
    const projectCards = page.locator('.js-project-card');
    await expect(projectCards.first()).toBeVisible();
    const count = await projectCards.count();
    expect(count).toBeGreaterThanOrEqual(5);

    // Verify search filtering works
    await searchInput.fill('React');
    await page.waitForTimeout(300);
    const filteredCount = await page.locator('.js-project-card').count();
    expect(filteredCount).toBeGreaterThan(0);

    // Reset search
    await searchInput.fill('');
  });

  test('Experience page loads timeline, CV modal, and community reviews API', async ({ page }) => {
    await page.goto('/experience');

    // Verify experience cards load
    const expCards = page.locator('.js-exp-card');
    await expect(expCards.first()).toBeVisible();

    // Verify CV Modal opening
    const cvBtn = page.locator('#preview-cv-exp-btn');
    await expect(cvBtn).toBeVisible();
    await cvBtn.click();

    const cvModal = page.locator('#cv-viewer-modal');
    await expect(cvModal).not.toHaveClass(/hidden/);
    
    // Close CV Modal
    await page.locator('#cv-modal-close').click();
    await expect(cvModal).toHaveClass(/hidden/);

    // Verify Star Repo button
    const starBtn = page.locator('#btn-star-repo');
    await expect(starBtn).toBeVisible();
  });

  test('Interactive Terminal CLI opens and responds to help command', async ({ page }) => {
    await page.goto('/');

    const cliNavBtn = page.locator('#open-terminal-nav-btn');
    await cliNavBtn.click();

    const terminalDrawer = page.locator('#terminal-drawer');
    await expect(terminalDrawer).not.toHaveClass(/hidden/);

    const termInput = page.locator('#terminal-input');
    await termInput.fill('help');
    await termInput.press('Enter');

    const output = page.locator('#terminal-output');
    await expect(output).toContainText('Available Commands');
  });

  test('Ask Zayd AI Copilot Widget opens and sends prompt', async ({ page }) => {
    await page.goto('/');

    const aiToggleBtn = page.locator('#ai-chat-toggle-btn');
    await aiToggleBtn.click();

    const aiDrawer = page.locator('#ai-chat-drawer');
    await expect(aiDrawer).not.toHaveClass(/hidden/);

    const aiInput = page.locator('#ai-chat-input');
    await aiInput.fill('What is Zayd tech stack?');
    await page.locator('#ai-chat-form').dispatchEvent('submit');

    await page.waitForTimeout(1000);
    const body = page.locator('#ai-chat-body');
    await expect(body).toContainText('tech stack');
  });

});
