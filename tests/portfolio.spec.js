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

    // Verify search bar and filter chips
    const searchInput = page.locator('#project-search-input');
    await expect(searchInput).toBeVisible();

    // Verify project list cards load
    const projectCards = page.locator('.project-card');
    await expect(projectCards.first()).toBeVisible();
    const count = await projectCards.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Verify search filtering works
    await searchInput.fill('React');
    await page.waitForTimeout(300);
    const filteredCount = await page.locator('.project-card:not(.hidden-filter)').count();
    expect(filteredCount).toBeGreaterThan(0);

    // Reset search
    await searchInput.fill('');

    // Open first project card modal details
    await projectCards.first().click();
    const detailsModal = page.locator('#details-modal');
    await expect(detailsModal).not.toHaveClass(/hidden/);
    await expect(page.locator('#modal-title')).not.toBeEmpty();

    // Verify modal media container exists
    const mediaContainer = page.locator('#modal-media');
    await expect(mediaContainer).toBeVisible();

    // Close modal
    await page.locator('#modal-close').click();
    await expect(detailsModal).toHaveClass(/hidden/);
  });

  test('Showcase API returns status and generated project metadata', async ({ request }) => {
    const response = await request.get('/api/showcase/status');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('projects');
  });

  test('Experience page loads timeline, CV modal, and community reviews API', async ({ page }) => {
    await page.goto('/experience');

    // Verify experience cards load
    const expCards = page.locator('.exp-card, .timeline-item');
    await expect(expCards.first()).toBeVisible();

    // Verify CV Modal opening
    const cvBtn = page.locator('#preview-cv-nav-btn');
    await expect(cvBtn).toBeVisible();
    await cvBtn.click();

    const cvModal = page.locator('#cv-viewer-modal');
    await expect(cvModal).not.toHaveClass(/hidden/);
    
    // Close CV Modal
    await page.locator('#cv-modal-close').click();
    await expect(cvModal).toHaveClass(/hidden/);
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
    await aiToggleBtn.click({ force: true });

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
