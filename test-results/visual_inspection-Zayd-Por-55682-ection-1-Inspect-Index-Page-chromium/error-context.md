# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual_inspection.spec.js >> Zayd Portfolio Image & Modal Visual Inspection >> 1. Inspect Index Page
- Location: tests\visual_inspection.spec.js:54:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.getAttribute: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - link "Zayd Ali Mohamed home" [ref=e3] [cursor=pointer]:
      - /url: "#hero"
      - img "ZA" [ref=e4]
    - list [ref=e5]:
      - listitem [ref=e6]:
        - link "Home" [ref=e7] [cursor=pointer]:
          - /url: /
      - listitem [ref=e8]:
        - link "Projects Hub" [ref=e9] [cursor=pointer]:
          - /url: /projects
      - listitem [ref=e10]:
        - link "Experience & Reviews" [ref=e11] [cursor=pointer]:
          - /url: /experience
      - listitem [ref=e12]:
        - link "Skills & Tech Stack" [ref=e13] [cursor=pointer]:
          - /url: /skills
      - listitem [ref=e14]:
        - link "Contact & Hire" [ref=e15] [cursor=pointer]:
          - /url: /contact
    - generic [ref=e16]:
      - button "CLI" [ref=e17] [cursor=pointer]
      - button "☀️ Light Mode" [ref=e20] [cursor=pointer]
      - button "View CV" [ref=e21] [cursor=pointer]
      - link "Hire Me" [ref=e25] [cursor=pointer]:
        - /url: /contact
  - banner [ref=e26]:
    - generic [ref=e27]:
      - generic [ref=e29]: Available for Roles
      - generic [ref=e30]: •
      - generic [ref=e31]:
        - text: "Cairo Time:"
        - generic [ref=e35]: 10:43:28 PM
    - generic [ref=e36]:
      - generic [ref=e37]:
        - paragraph [ref=e38]: Full-Stack & Mobile Software Developer
        - heading "Zayd Ali Mohamed" [level=1] [ref=e39]
        - heading "Software De" [level=2] [ref=e40]
        - paragraph [ref=e42]: Motivated senior computer science student who loves technology and problem solving. I enjoy learning new skills, building practical projects, and taking part in workshops that strengthen my software development knowledge.
        - generic [ref=e43]:
          - generic [ref=e44]: ☕ Spring Boot
          - generic [ref=e46]: ⚛️ React.js
          - generic [ref=e48]: 📱 Flutter & Dart
          - generic [ref=e50]: 🔷 C# .NET API
          - generic [ref=e52]: 🗄️ SQL & MongoDB
        - generic [ref=e54]:
          - generic [ref=e55]: 📍 Maadi, Cairo
          - generic [ref=e56]: ✉ zaydaly0501@gmail.com
          - generic [ref=e57]: 📱 01017741741
      - generic [ref=e59]:
        - img "Zayd Ali Mohamed" [ref=e60]
        - generic [ref=e61]:
          - generic [ref=e62]: 💼
          - generic [ref=e63]: TAQA Arabia Intern
        - generic [ref=e64]:
          - generic [ref=e65]: 🎓
          - generic [ref=e66]: MIU CS Student
    - generic [ref=e67]:
      - link "LinkedIn Profile ↗" [ref=e68] [cursor=pointer]:
        - /url: https://www.linkedin.com/in/zayd-ali-17a85a1a0
      - link "GitHub Repos" [ref=e71] [cursor=pointer]:
        - /url: https://github.com/zaydaly05
      - button "Preview CV" [ref=e74] [cursor=pointer]
      - link "Download CV" [ref=e78] [cursor=pointer]:
        - /url: /assets/Zayd%20Ali%20Mohamed%20CV.pdf
    - generic [ref=e82]:
      - generic [ref=e83]: 02 / 03
      - generic [ref=e85]:
        - img "Zayd Mobile App Development" [ref=e86]
        - generic [ref=e87]:
          - generic [ref=e88]:
            - generic [ref=e89]: 📱 MOBILE & CLOUD APIS
            - generic [ref=e90]: Flutter · Dart · Firebase · C#
          - heading "Cross-Platform Mobile Apps & Real-Time Booking Solutions" [level=3] [ref=e91]
          - paragraph [ref=e92]: Crafting responsive mobile experiences for luxury limousine booking, driver tracking, and enterprise API backends with C# .NET Core.
          - generic [ref=e93]:
            - link "View Mobile Apps ↗" [ref=e94] [cursor=pointer]:
              - /url: /projects?search=flutter
            - generic [ref=e95]:
              - generic [ref=e96]: Flutter
              - generic [ref=e97]: Dart
              - generic [ref=e98]: Firebase
              - generic [ref=e99]: C# API
      - button "Previous Slide" [ref=e100] [cursor=pointer]: ‹
      - button "Next Slide" [ref=e101] [cursor=pointer]: ›
      - generic [ref=e102]:
        - generic [ref=e103] [cursor=pointer]
        - generic [ref=e104] [cursor=pointer]
        - generic [ref=e105] [cursor=pointer]
    - generic [ref=e108]: Scroll
  - main [ref=e111]:
    - generic [ref=e113]:
      - generic [ref=e114]:
        - generic [ref=e115]: 💻
        - text: 0+
        - generic [ref=e116]: Public GitHub Repositories
      - generic [ref=e117]:
        - generic [ref=e118]: 🚀
        - text: 0+
        - generic [ref=e119]: Production Projects Built
      - generic [ref=e120]:
        - generic [ref=e121]: ⚡
        - text: 0+
        - generic [ref=e122]: Technical Skill Categories
      - generic [ref=e123]:
        - generic [ref=e124]: 📜
        - text: 0+
        - generic [ref=e125]: Verified Certifications
      - generic [ref=e126]:
        - generic [ref=e127]: 🏢
        - text: "0"
        - generic [ref=e128]: Industry IT Internships
    - generic [ref=e129]:
      - generic [ref=e130]:
        - generic [ref=e131]: "01"
        - heading "Featured Flagship Projects" [level=3] [ref=e132]
      - paragraph [ref=e134]: Top highlighted software systems engineered by Zayd Ali Mohamed.
      - generic [ref=e135]:
        - article [ref=e136]:
          - generic [ref=e137]: Mobile App
          - img "Gulf Limousine Booking App" [ref=e139]
          - generic [ref=e140]:
            - heading "Gulf Limousine Reservation & Fleet App" [level=4] [ref=e141]
            - paragraph [ref=e142]: July 2026 · Flutter, Dart, Firebase, REST
            - paragraph [ref=e143]: Cross-platform luxury limousine reservation & fleet tracking mobile app with real-time driver allocation, fare estimation, and client booking management.
            - generic [ref=e144]:
              - link "GitHub Repo ↗" [ref=e145] [cursor=pointer]:
                - /url: https://github.com/zaydaly05/Gulf_Limousine_App
              - link "Full Hub Details →" [ref=e146] [cursor=pointer]:
                - /url: /projects
        - article [ref=e147]:
          - generic [ref=e148]: Full-Stack
          - img "Food Ordering Management System" [ref=e150]
          - generic [ref=e151]:
            - heading "Full-Stack Food Ordering & Analytics System" [level=4] [ref=e152]
            - paragraph [ref=e153]: May 2026 · Spring Boot, React, Tailwind, MongoDB
            - paragraph [ref=e154]: Developed full-stack food ordering platform with Spring Boot backend, React UI, cart processing, role-based admin dashboard, and profit analytics.
            - generic [ref=e155]:
              - link "GitHub Repo ↗" [ref=e156] [cursor=pointer]:
                - /url: https://github.com/zaydaly05/food_ordering_system
              - link "Full Hub Details →" [ref=e157] [cursor=pointer]:
                - /url: /projects
        - article [ref=e158]:
          - generic [ref=e159]: Enterprise C#
          - img "Essmat Plastic Management System" [ref=e161]
          - generic [ref=e162]:
            - heading "Essmat Plastic Factory Management Solution" [level=4] [ref=e163]
            - paragraph [ref=e164]: September 2026 · C#, .NET Core, SQL Server, Entity Framework
            - paragraph [ref=e165]: Enterprise inventory and production management solution for plastic manufacturing, optimizing raw material tracking, order processing, and factory billing.
            - generic [ref=e166]:
              - link "GitHub Repo ↗" [ref=e167] [cursor=pointer]:
                - /url: https://github.com/zaydaly05/EssmatPlastic
              - link "Full Hub Details →" [ref=e168] [cursor=pointer]:
                - /url: /projects
    - generic [ref=e169]:
      - generic [ref=e170]:
        - generic [ref=e171]: "02"
        - heading "Explore Portfolio Sections" [level=3] [ref=e172]
      - generic [ref=e174]:
        - generic [ref=e175]:
          - generic [ref=e176]:
            - generic [ref=e177]: 🚀
            - generic [ref=e178]: 11+ Projects Sync
            - heading "Projects Hub & Live GitHub Sync" [level=3] [ref=e179]
            - paragraph [ref=e180]: Explore all 11+ production full-stack, mobile, and system projects, live search filters, and real-time GitHub activity sync.
          - link "Explore Projects Hub ↗" [ref=e181] [cursor=pointer]:
            - /url: /projects
        - generic [ref=e182]:
          - generic [ref=e183]:
            - generic [ref=e184]: 💼
            - generic [ref=e185]: TAQA Arabia & CHI
            - heading "Experience, Resume & Reviews" [level=3] [ref=e186]
            - paragraph [ref=e187]: Review TAQA Arabia & CHI internships, education background, interactive Overleaf LaTeX resume, and visitor reviews.
          - link "View Experience & CV ↗" [ref=e188] [cursor=pointer]:
            - /url: /experience
        - generic [ref=e189]:
          - generic [ref=e190]:
            - generic [ref=e191]: ⚡
            - generic [ref=e192]: Core Tech Stack
            - heading "Skills, Tech Stack & Languages" [level=3] [ref=e193]
            - paragraph [ref=e194]: Browse technical skills, category filters (Java, Spring Boot, React, C#, Flutter, SQL, Docker), soft skills, and languages.
          - link "View Skills & Stack ↗" [ref=e195] [cursor=pointer]:
            - /url: /skills
        - generic [ref=e196]:
          - generic [ref=e197]:
            - generic [ref=e198]: 📬
            - generic [ref=e199]: Direct Contact
            - heading "Get In Touch & Hire Zayd" [level=3] [ref=e200]
            - paragraph [ref=e201]: Direct messaging form, 1-click email/WhatsApp/LinkedIn copy chips, interview booking banner, and FAQ answers.
          - link "Contact & Hire Zayd ↗" [ref=e202] [cursor=pointer]:
            - /url: /contact
  - button "Back to top"
  - contentinfo [ref=e203]:
    - generic [ref=e204]:
      - paragraph [ref=e205]:
        - text: Crafted with passion by
        - strong [ref=e206]: Zayd Ali Mohamed
        - text: .
      - generic [ref=e207]:
        - button "Terminal CLI" [ref=e208] [cursor=pointer]
        - button "Ask AI Copilot" [ref=e209] [cursor=pointer]
        - link "GitHub" [ref=e210] [cursor=pointer]:
          - /url: https://github.com/zaydaly05
        - link "LinkedIn" [ref=e211] [cursor=pointer]:
          - /url: https://www.linkedin.com/in/zayd-ali-17a85a1a0
        - link "Email" [ref=e212] [cursor=pointer]:
          - /url: mailto:zaydaly0501@gmail.com
      - paragraph [ref=e213]: © 2026 Zayd Ali Mohamed · Built with Node.js & Express
  - button "Toggle Ask Zayd AI Copilot" [ref=e215] [cursor=pointer]:
    - generic [ref=e220]: Ask Zayd AI
  - generic [ref=e222]:
    - button "Close" [ref=e223] [cursor=pointer]: ×
    - generic [ref=e224]:
      - generic [ref=e225]: ⭐
      - generic [ref=e226]:
        - heading "Enjoying Zayd's Portfolio?" [level=6] [ref=e227]
        - paragraph [ref=e228]: Star the repo & leave a review on the Experience page!
    - link "Leave Review & Star ↗" [ref=e230] [cursor=pointer]:
      - /url: /experience#reviews-section
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Zayd Portfolio Image & Modal Visual Inspection', () => {
  4  | 
  5  |   async function checkImagesOnCurrentPage(page, contextName) {
  6  |     await page.waitForTimeout(500);
  7  |     const images = page.locator('img');
  8  |     const count = await images.count();
  9  |     let checkedCount = 0;
  10 |     const brokenImages = [];
  11 | 
  12 |     for (let i = 0; i < count; i++) {
  13 |       const img = images.nth(i);
  14 |       const isVisible = await img.isVisible().catch(() => false);
  15 |       if (!isVisible) continue;
  16 | 
  17 |       // Scroll into view so lazy loading triggers in browser
  18 |       await img.scrollIntoViewIfNeeded().catch(() => {});
  19 | 
> 20 |       const src = await img.getAttribute('src');
     |                             ^ Error: locator.getAttribute: Target page, context or browser has been closed
  21 |       const alt = await img.getAttribute('alt');
  22 | 
  23 |       // Wait up to 5 seconds for network image to complete loading
  24 |       const isLoaded = await img.evaluate(async (el) => {
  25 |         if (el.complete && el.naturalWidth > 0) return true;
  26 |         return new Promise((resolve) => {
  27 |           const timer = setTimeout(() => {
  28 |             resolve(el.complete && el.naturalWidth > 0);
  29 |           }, 5000);
  30 | 
  31 |           el.addEventListener('load', () => {
  32 |             clearTimeout(timer);
  33 |             resolve(el.naturalWidth > 0);
  34 |           }, { once: true });
  35 | 
  36 |           el.addEventListener('error', () => {
  37 |             clearTimeout(timer);
  38 |             resolve(false);
  39 |           }, { once: true });
  40 |         });
  41 |       });
  42 | 
  43 |       checkedCount++;
  44 |       if (!isLoaded) {
  45 |         brokenImages.push({ src, alt, index: i });
  46 |         console.error(`❌ Broken image in ${contextName}: src="${src}" alt="${alt}"`);
  47 |       }
  48 |     }
  49 | 
  50 |     expect(brokenImages, `Found ${brokenImages.length} broken image(s) in ${contextName}`).toEqual([]);
  51 |     console.log(`✅ [${contextName}] All ${checkedCount} visible images loaded perfectly!`);
  52 |   }
  53 | 
  54 |   test('1. Inspect Index Page', async ({ page }) => {
  55 |     await page.goto('/');
  56 |     await checkImagesOnCurrentPage(page, 'Index Page');
  57 |   });
  58 | 
  59 |   test('2. Inspect Projects Page & Project Modal Popup', async ({ page }) => {
  60 |     await page.goto('/projects');
  61 |     await checkImagesOnCurrentPage(page, 'Projects Page');
  62 | 
  63 |     const imageWrap = page.locator('.project-card-image-wrap').first();
  64 |     if (await imageWrap.isVisible()) {
  65 |       await imageWrap.scrollIntoViewIfNeeded();
  66 |       await imageWrap.click();
  67 |       await page.waitForSelector('#global-detail-modal:not(.hidden)', { timeout: 3000 });
  68 |       await checkImagesOnCurrentPage(page, 'Project Modal Popup');
  69 |       await page.locator('#global-modal-close').click();
  70 |     }
  71 |   });
  72 | 
  73 |   test('3. Inspect Experience Page & Certificate Modal Popup', async ({ page }) => {
  74 |     await page.goto('/experience');
  75 |     await checkImagesOnCurrentPage(page, 'Experience Page');
  76 | 
  77 |     const certWrap = page.locator('.cert-img-wrap').first();
  78 |     if (await certWrap.isVisible()) {
  79 |       await certWrap.scrollIntoViewIfNeeded();
  80 |       await certWrap.click();
  81 |       await page.waitForSelector('#global-detail-modal:not(.hidden)', { timeout: 3000 });
  82 |       await checkImagesOnCurrentPage(page, 'Certificate Modal Popup');
  83 |       await page.locator('#global-modal-close').click();
  84 |     }
  85 |   });
  86 | 
  87 |   test('4. Inspect Skills Page', async ({ page }) => {
  88 |     await page.goto('/skills');
  89 |     await checkImagesOnCurrentPage(page, 'Skills Page');
  90 |   });
  91 | 
  92 |   test('5. Inspect Contact Page', async ({ page }) => {
  93 |     await page.goto('/contact');
  94 |     await checkImagesOnCurrentPage(page, 'Contact Page');
  95 |   });
  96 | 
  97 | });
  98 | 
```