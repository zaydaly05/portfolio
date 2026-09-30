# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual_inspection.spec.js >> Zayd Portfolio Image & Modal Visual Inspection >> 2. Inspect Projects Page & Project Modal Popup
- Location: tests\visual_inspection.spec.js:59:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 3000ms exceeded.
Call log:
  - waiting for locator('#global-detail-modal:not(.hidden)') to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - navigation [ref=e2]:
    - link "Home" [ref=e3] [cursor=pointer]:
      - /url: /
      - img "ZA" [ref=e4]
    - generic [ref=e5]:
      - button "CLI" [ref=e6] [cursor=pointer]
      - button "☀️ Light Mode" [ref=e7] [cursor=pointer]
      - link "Hire Me" [ref=e8] [cursor=pointer]:
        - /url: /contact
      - button "Open navigation menu" [ref=e9] [cursor=pointer]
  - banner [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e15]: Production Repositories & Applications
      - heading "Projects & GitHub Hub" [level=1] [ref=e16]
      - paragraph [ref=e17]: Explore 11+ production web applications, cross-platform mobile apps, enterprise backend systems, and live GitHub repositories.
  - main [ref=e18]:
    - generic [ref=e19]:
      - generic [ref=e20]:
        - textbox "🔍 Search projects by title, stack, or tech..." [ref=e22]
        - generic [ref=e23]:
          - button "All Repos" [ref=e24] [cursor=pointer]
          - button "Mobile Apps" [ref=e25] [cursor=pointer]
          - button "React / Web" [ref=e26] [cursor=pointer]
          - button "Spring / Backend" [ref=e27] [cursor=pointer]
          - button "C# / .NET" [ref=e28] [cursor=pointer]
      - generic [ref=e29]:
        - button "Open Gulf Limousine Booking App details" [active] [ref=e30] [cursor=pointer]:
          - img "Gulf Limousine Booking App" [ref=e32]
          - generic [ref=e33]:
            - generic [ref=e34]:
              - heading "Gulf Limousine Booking App" [level=4] [ref=e35]
              - generic "Automatically synced with GitHub Repository" [ref=e36]: ● Synced
            - paragraph [ref=e37]: July 2026
            - paragraph [ref=e38]:
              - strong [ref=e39]: "Stack:"
              - text: Flutter, Dart, Firebase, REST API
            - paragraph [ref=e40]: Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation, vehicle selection, fare estimation, and client booking management.
            - link "View GitHub Repo ↗" [ref=e42]:
              - /url: https://github.com/zaydaly05/Gulf_Limousine_App
        - button "Open Essmat Plastic Factory Management System details" [ref=e45] [cursor=pointer]:
          - img "Essmat Plastic Factory Management System" [ref=e47]
          - generic [ref=e48]:
            - generic [ref=e49]:
              - heading "Essmat Plastic Factory Management System" [level=4] [ref=e50]
              - generic "Automatically synced with GitHub Repository" [ref=e51]: ● Synced
            - paragraph [ref=e52]: September 2026
            - paragraph [ref=e53]:
              - strong [ref=e54]: "Stack:"
              - text: C#, .NET, SQL Server, Entity Framework
            - paragraph [ref=e55]: Enterprise inventory and production management solution for plastic manufacturing, optimizing raw material tracking, order processing, and factory billing workflows.
            - generic [ref=e56]:
              - link "View GitHub Repo ↗" [ref=e57]:
                - /url: https://github.com/zaydaly05/EssmatPlastic
              - link "📄 PDF Report 📥" [ref=e60]:
                - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790736/zayd-portfolio/essmat-plastic-report.pdf
        - button "Open Dr. Naglaa Academic Biography Portal details" [ref=e61] [cursor=pointer]:
          - img "Dr. Naglaa Academic Biography Portal" [ref=e63]
          - generic [ref=e64]:
            - generic [ref=e65]:
              - heading "Dr. Naglaa Academic Biography Portal" [level=4] [ref=e66]
              - generic "Automatically synced with GitHub Repository" [ref=e67]: ● Synced
            - paragraph [ref=e68]: September 2026
            - paragraph [ref=e69]:
              - strong [ref=e70]: "Stack:"
              - text: HTML5, CSS3, JavaScript, Responsive UI
            - paragraph [ref=e71]: Modern academic portfolio & publication showcase website designed for university faculty, featuring curriculum vitae integration, research paper archives, and student contact channels.
            - link "View GitHub Repo ↗" [ref=e73]:
              - /url: https://github.com/zaydaly05/drNaglaBio
        - button "Open Food Ordering Management System details" [ref=e76] [cursor=pointer]:
          - img "Food Ordering Management System" [ref=e78]
          - generic [ref=e79]:
            - generic [ref=e80]:
              - heading "Food Ordering Management System" [level=4] [ref=e81]
              - generic "Automatically synced with GitHub Repository" [ref=e82]: ● Synced
            - paragraph [ref=e83]: May 2026
            - paragraph [ref=e84]:
              - strong [ref=e85]: "Stack:"
              - text: Spring Boot, Tailwind, React, MongoDB
            - paragraph [ref=e86]: Developed a full-stack food ordering system with Spring Boot and a React + Tailwind frontend. Built RESTful APIs for authentication, menu management, cart operations, and order processing with MongoDB. Implemented role-based Admin and Customer flows with CRUD, order tracking, and analytics such as top-selling items and profit insights.
            - link "View GitHub Repo ↗" [ref=e88]:
              - /url: https://github.com/zaydaly05/food_ordering_system
        - button "Open In Gaz API System details" [ref=e91] [cursor=pointer]:
          - img "In Gaz API System" [ref=e93]
          - generic [ref=e94]:
            - generic [ref=e95]:
              - heading "In Gaz API System" [level=4] [ref=e96]
              - generic "Automatically synced with GitHub Repository" [ref=e97]: ● Synced
            - paragraph [ref=e98]: July 2025
            - paragraph [ref=e99]:
              - strong [ref=e100]: "Stack:"
              - text: C#, Flutter, .NET Core Web API
            - paragraph [ref=e101]: Built a Flutter frontend integrated with a C# .NET Core Web API backend using MVC, secure role-based access, CRUD operations, and Swagger testing.
            - link "View GitHub Repo ↗" [ref=e103]:
              - /url: https://github.com/zaydaly05/InGazAPI
        - button "Open Employee Attendance & Leave System details" [ref=e106] [cursor=pointer]:
          - img "Employee Attendance & Leave System" [ref=e108]
          - generic [ref=e109]:
            - generic [ref=e110]:
              - heading "Employee Attendance & Leave System" [level=4] [ref=e111]
              - generic "Automatically synced with GitHub Repository" [ref=e112]: ● Synced
            - paragraph [ref=e113]: December 2025
            - paragraph [ref=e114]:
              - strong [ref=e115]: "Stack:"
              - text: HTML, CSS, PHP, MySQL
            - paragraph [ref=e116]: Developed a web-based attendance and leave platform with automated tracking and approval, event/announcement features, and secure relational role-based access.
            - link "View GitHub Repo ↗" [ref=e118]:
              - /url: https://github.com/zaydaly05/Employee_Attendance-Leave_Management_System
        - button "Open Car Rental Website details" [ref=e121] [cursor=pointer]:
          - img "Car Rental Website" [ref=e123]
          - generic [ref=e124]:
            - generic [ref=e125]:
              - heading "Car Rental Website" [level=4] [ref=e126]
              - generic "Automatically synced with GitHub Repository" [ref=e127]: ● Synced
            - paragraph [ref=e128]: May 2025
            - paragraph [ref=e129]:
              - strong [ref=e130]: "Stack:"
              - text: HTML, CSS, MongoDB, Node.js, JavaScript
            - paragraph [ref=e131]: Developed a comprehensive e-commerce style platform for users to browse and rent cars with authentication, catalog management, and order processing.
            - link "View GitHub Repo ↗" [ref=e133]:
              - /url: https://github.com/zaydaly05/Car_Rental_Website
        - button "Open Restaurant Management System details" [ref=e136] [cursor=pointer]:
          - img "Restaurant Management System" [ref=e138]
          - generic [ref=e139]:
            - generic [ref=e140]:
              - heading "Restaurant Management System" [level=4] [ref=e141]
              - generic "Automatically synced with GitHub Repository" [ref=e142]: ● Synced
            - paragraph [ref=e143]: December 2024
            - paragraph [ref=e144]:
              - strong [ref=e145]: "Stack:"
              - text: Java, JavaFX
            - paragraph [ref=e146]: Created a recruitment system with a graphical user interface for managing job postings, applications, and interviews using Java and JavaFX.
            - link "View GitHub Repo ↗" [ref=e148]:
              - /url: https://github.com/zaydaly05/Restaurant_Management_System
        - button "Open Sleeping Alert System details" [ref=e151] [cursor=pointer]:
          - img "Sleeping Alert System" [ref=e153]
          - generic [ref=e154]:
            - generic [ref=e155]:
              - heading "Sleeping Alert System" [level=4] [ref=e156]
              - generic "Automatically synced with GitHub Repository" [ref=e157]: ● Synced
            - paragraph [ref=e158]: December 2025
            - paragraph [ref=e159]:
              - strong [ref=e160]: "Stack:"
              - text: Python, Flutter
            - paragraph [ref=e161]: Developed a sleeping alert system for an HCI course, applying usability and interaction design principles with a responsive mobile interface.
            - link "View GitHub Repo ↗" [ref=e163]:
              - /url: https://github.com/zaydaly05/Sleep_Alert_System
        - button "Open Zaydentity Digital Identity Platform details" [ref=e166] [cursor=pointer]:
          - img "Zaydentity Digital Identity Platform" [ref=e168]
          - generic [ref=e169]:
            - generic [ref=e170]:
              - heading "Zaydentity Digital Identity Platform" [level=4] [ref=e171]
              - generic "Automatically synced with GitHub Repository" [ref=e172]: ● Synced
            - paragraph [ref=e173]: September 2026
            - paragraph [ref=e174]:
              - strong [ref=e175]: "Stack:"
              - text: HTML5, CSS3, JavaScript
            - paragraph [ref=e176]: Digital personal branding & bio-link platform consolidating developer links, project highlights, and verified professional credentials in a unified interactive card UI.
            - link "View GitHub Repo ↗" [ref=e178]:
              - /url: https://github.com/zaydaly05/zaydentity
        - button "Open WE Telecom Training Suite details" [ref=e181] [cursor=pointer]:
          - img "WE Telecom Training Suite" [ref=e183]
          - generic [ref=e184]:
            - generic [ref=e185]:
              - heading "WE Telecom Training Suite" [level=4] [ref=e186]
              - generic "Automatically synced with GitHub Repository" [ref=e187]: ● Synced
            - paragraph [ref=e188]: August 2026
            - paragraph [ref=e189]:
              - strong [ref=e190]: "Stack:"
              - text: Networking, C++, Telecommunications
            - paragraph [ref=e191]: Technical codebase & project artifacts developed during Telecom Egypt (WE) training, focusing on network protocol fundamentals, system administration, and enterprise infrastructure.
            - link "View GitHub Repo ↗" [ref=e193]:
              - /url: https://github.com/zaydaly05/WE_Intern
    - generic [ref=e196]:
      - generic [ref=e197]:
        - generic [ref=e198]: ★
        - heading "Live GitHub Account Activity" [level=3] [ref=e199]
      - generic [ref=e200]:
        - generic [ref=e201]:
          - img "Zayd GitHub Avatar" [ref=e203]
          - generic [ref=e204]:
            - heading "@zaydaly05" [level=4] [ref=e205]
            - paragraph [ref=e206]: Junior Computer Science Student | Software Developer
            - generic [ref=e207]:
              - generic [ref=e208]:
                - generic [ref=e209]: "15"
                - text: Public Repos
              - generic [ref=e210]:
                - generic [ref=e211]: "6"
                - text: Followers
            - link "Visit GitHub Profile ↗" [ref=e212] [cursor=pointer]:
              - /url: https://github.com/zaydaly05
        - generic [ref=e213]:
          - generic [ref=e214]:
            - heading "Recent Public Repositories" [level=5] [ref=e215]
            - generic [ref=e216]: Synced
          - generic [ref=e218]:
            - generic [ref=e219]:
              - generic [ref=e220]:
                - generic [ref=e221]: portfolio
                - paragraph [ref=e222]: Project repository by Zayd
              - generic [ref=e223]:
                - generic [ref=e224]: HTML
                - generic [ref=e226]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e227] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/portfolio
            - generic [ref=e228]:
              - generic [ref=e229]:
                - generic [ref=e230]: zaydentity
                - paragraph [ref=e231]: Project repository by Zayd
              - generic [ref=e232]:
                - generic [ref=e233]: HTML
                - generic [ref=e235]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e236] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/zaydentity
            - generic [ref=e237]:
              - generic [ref=e238]:
                - generic [ref=e239]: EssmatPlastic
                - paragraph [ref=e240]: Project repository by Zayd
              - generic [ref=e241]:
                - generic [ref=e242]: C#
                - generic [ref=e244]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e245] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/EssmatPlastic
            - generic [ref=e246]:
              - generic [ref=e247]:
                - generic [ref=e248]: cv-portfolio
                - paragraph [ref=e249]: Project repository by Zayd
              - generic [ref=e250]:
                - generic [ref=e251]: TeX
                - generic [ref=e253]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e254] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/cv-portfolio
            - generic [ref=e255]:
              - generic [ref=e256]:
                - generic [ref=e257]: drNaglaBio
                - paragraph [ref=e258]: Project repository by Zayd
              - generic [ref=e259]:
                - generic [ref=e260]: HTML
                - generic [ref=e262]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e263] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/drNaglaBio
            - generic [ref=e264]:
              - generic [ref=e265]:
                - generic [ref=e266]: Week6Task9
                - paragraph [ref=e267]: Project repository by Zayd
              - generic [ref=e268]:
                - generic [ref=e269]: Kotlin
                - generic [ref=e271]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e272] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/Week6Task9
  - contentinfo [ref=e273]:
    - generic [ref=e274]:
      - paragraph [ref=e275]: © 2026 Zayd Ali Mohamed. All rights reserved.
      - generic [ref=e276]:
        - link "Home" [ref=e277] [cursor=pointer]:
          - /url: /
        - link "Projects" [ref=e278] [cursor=pointer]:
          - /url: /projects
        - link "Experience" [ref=e279] [cursor=pointer]:
          - /url: /experience
        - button "Terminal CLI" [ref=e280] [cursor=pointer]
        - button "AI Assistant" [ref=e281] [cursor=pointer]
  - button "Toggle Ask Zayd AI Copilot" [ref=e283] [cursor=pointer]:
    - generic [ref=e288]: Ask Zayd AI
  - generic [ref=e290]:
    - button "Close" [ref=e291] [cursor=pointer]: ×
    - generic [ref=e292]:
      - generic [ref=e293]: ⭐
      - generic [ref=e294]:
        - heading "Enjoying Zayd's Portfolio?" [level=6] [ref=e295]
        - paragraph [ref=e296]: Star the repo & leave a review on the Experience page!
    - link "Leave Review & Star ↗" [ref=e298] [cursor=pointer]:
      - /url: /experience#reviews-section
  - dialog [ref=e301]:
    - button "Close details" [ref=e302] [cursor=pointer]: ×
    - paragraph [ref=e303]: Project Details
    - heading "Gulf Limousine Booking App" [level=3] [ref=e304]
    - paragraph [ref=e305]: July 2026 · Flutter, Dart, Firebase, REST API
    - paragraph [ref=e306]: "Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation, vehicle selection, fare estimation, and client booking management. 🔗 GitHub Repo: https://github.com/zaydaly05/Gulf_Limousine_App"
    - list [ref=e308]:
      - listitem [ref=e309]: "Live repository link: https://github.com/zaydaly05/Gulf_Limousine_App"
      - listitem [ref=e310]: Automatically synced with GitHub project commits
    - button "View Gulf Limousine App real output preview full size" [ref=e312]:
      - img "Gulf Limousine App real output preview" [ref=e313]
      - generic [aria-hidden]: Click to enlarge
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
  20 |       const src = await img.getAttribute('src');
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
> 67 |       await page.waitForSelector('#global-detail-modal:not(.hidden)', { timeout: 3000 });
     |                  ^ TimeoutError: page.waitForSelector: Timeout 3000ms exceeded.
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