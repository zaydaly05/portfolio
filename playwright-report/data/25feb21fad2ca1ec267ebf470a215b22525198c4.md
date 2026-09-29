# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portfolio.spec.js >> Zayd Portfolio Full End-to-End Suite >> Interactive Terminal CLI opens and responds to help command
- Location: tests\portfolio.spec.js:77:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#terminal-output')
Timeout: 5000ms
- Expected substring  -  1
+ Received string     + 10

- Available CLI Commands
+ zayd@portfolio:~$ helpAvailable Commands:
+   • skills   - List Zayd's technical skill set
+   • projects - Display Zayd's top projects & tech stacks
+   • exp      - Display internship & work experience
+   • contact  - View Zayd's email, phone, and LinkedIn
+   • cv       - Open the PDF CV viewer
+   • whoami   - Show current viewer identity
+   • date     - Show current Cairo date & time
+   • hire     - Quick message for recruiters
+   • clear    - Clear terminal output screen

Call log:
  - Expect "toContainText" locator('#terminal-output') with timeout 5000ms
  - waiting for locator('#terminal-output')
    13 × locator resolved to <div id="terminal-output">…</div>
       - unexpected value "zayd@portfolio:~$ helpAvailable Commands:
  • skills   - List Zayd's technical skill set
  • projects - Display Zayd's top projects & tech stacks
  • exp      - Display internship & work experience
  • contact  - View Zayd's email, phone, and LinkedIn
  • cv       - Open the PDF CV viewer
  • whoami   - Show current viewer identity
  • date     - Show current Cairo date & time
  • hire     - Quick message for recruiters
  • clear    - Clear terminal output screen"

```

```yaml
- text: "zayd@portfolio:~$ help Available Commands: • skills - List Zayd's technical skill set • projects - Display Zayd's top projects & tech stacks • exp - Display internship & work experience • contact - View Zayd's email, phone, and LinkedIn • cv - Open the PDF CV viewer • whoami - Show current viewer identity • date - Show current Cairo date & time • hire - Quick message for recruiters • clear - Clear terminal output screen"
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | test.describe('Zayd Portfolio Full End-to-End Suite', () => {
  4   | 
  5   |   test('Homepage loads correctly with Hero Slider, Counters, and Navigation', async ({ page }) => {
  6   |     await page.goto('/');
  7   |     
  8   |     // Check title and brand
  9   |     await expect(page).toHaveTitle(/Zayd Ali Mohamed/i);
  10  |     await expect(page.locator('.logo img')).toBeVisible();
  11  | 
  12  |     // Verify navigation links
  13  |     await expect(page.locator('.nav-links')).toContainText('Home');
  14  |     await expect(page.locator('.nav-links')).toContainText('Projects Hub');
  15  |     await expect(page.locator('.nav-links')).toContainText('Experience & Reviews');
  16  | 
  17  |     // Verify Hero Slider is active
  18  |     await expect(page.locator('.slider-slide.active')).toBeVisible();
  19  | 
  20  |     // Verify stat counters exist
  21  |     const statsContainer = page.locator('#stat-counters-row');
  22  |     await expect(statsContainer).toBeVisible();
  23  | 
  24  |     // Verify Skills section
  25  |     const skillsSection = page.locator('#technical-skills');
  26  |     await expect(skillsSection).toBeVisible();
  27  |   });
  28  | 
  29  |   test('Projects Hub renders cards, filter pills, search bar, and GitHub API badge', async ({ page }) => {
  30  |     await page.goto('/projects');
  31  | 
  32  |     // Verify search bar and filter pills
  33  |     const searchInput = page.locator('#project-search-input');
  34  |     await expect(searchInput).toBeVisible();
  35  |     await expect(page.locator('#project-filter-pills')).toBeVisible();
  36  | 
  37  |     // Verify project list cards load
  38  |     const projectCards = page.locator('.js-project-card');
  39  |     await expect(projectCards.first()).toBeVisible();
  40  |     const count = await projectCards.count();
  41  |     expect(count).toBeGreaterThanOrEqual(5);
  42  | 
  43  |     // Verify search filtering works
  44  |     await searchInput.fill('React');
  45  |     await page.waitForTimeout(300);
  46  |     const filteredCount = await page.locator('.js-project-card').count();
  47  |     expect(filteredCount).toBeGreaterThan(0);
  48  | 
  49  |     // Reset search
  50  |     await searchInput.fill('');
  51  |   });
  52  | 
  53  |   test('Experience page loads timeline, CV modal, and community reviews API', async ({ page }) => {
  54  |     await page.goto('/experience');
  55  | 
  56  |     // Verify experience cards load
  57  |     const expCards = page.locator('.js-exp-card');
  58  |     await expect(expCards.first()).toBeVisible();
  59  | 
  60  |     // Verify CV Modal opening
  61  |     const cvBtn = page.locator('#preview-cv-exp-btn');
  62  |     await expect(cvBtn).toBeVisible();
  63  |     await cvBtn.click();
  64  | 
  65  |     const cvModal = page.locator('#cv-viewer-modal');
  66  |     await expect(cvModal).not.toHaveClass(/hidden/);
  67  |     
  68  |     // Close CV Modal
  69  |     await page.locator('#cv-modal-close').click();
  70  |     await expect(cvModal).toHaveClass(/hidden/);
  71  | 
  72  |     // Verify Star Repo button
  73  |     const starBtn = page.locator('#btn-star-repo');
  74  |     await expect(starBtn).toBeVisible();
  75  |   });
  76  | 
  77  |   test('Interactive Terminal CLI opens and responds to help command', async ({ page }) => {
  78  |     await page.goto('/');
  79  | 
  80  |     const cliNavBtn = page.locator('#open-terminal-nav-btn');
  81  |     await cliNavBtn.click();
  82  | 
  83  |     const terminalDrawer = page.locator('#terminal-drawer');
  84  |     await expect(terminalDrawer).not.toHaveClass(/hidden/);
  85  | 
  86  |     const termInput = page.locator('#terminal-input');
  87  |     await termInput.fill('help');
  88  |     await termInput.press('Enter');
  89  | 
  90  |     const output = page.locator('#terminal-output');
> 91  |     await expect(output).toContainText('Available CLI Commands');
      |                          ^ Error: expect(locator).toContainText(expected) failed
  92  |   });
  93  | 
  94  |   test('Ask Zayd AI Copilot Widget opens and sends prompt', async ({ page }) => {
  95  |     await page.goto('/');
  96  | 
  97  |     const aiToggleBtn = page.locator('#ai-chat-toggle-btn');
  98  |     await aiToggleBtn.click();
  99  | 
  100 |     const aiDrawer = page.locator('#ai-chat-drawer');
  101 |     await expect(aiDrawer).not.toHaveClass(/hidden/);
  102 | 
  103 |     const aiInput = page.locator('#ai-chat-input');
  104 |     await aiInput.fill('What is Zayd tech stack?');
  105 |     await page.locator('#ai-chat-form').dispatchEvent('submit');
  106 | 
  107 |     await page.waitForTimeout(1000);
  108 |     const body = page.locator('#ai-chat-body');
  109 |     await expect(body).toContainText('tech stack');
  110 |   });
  111 | 
  112 | });
  113 | 
```