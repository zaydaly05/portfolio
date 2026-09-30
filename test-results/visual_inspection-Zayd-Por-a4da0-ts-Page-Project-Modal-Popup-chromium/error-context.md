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
      - button "☀️ Light Mode" [ref=e18] [cursor=pointer]
      - link "Hire Me" [ref=e19] [cursor=pointer]:
        - /url: /contact
  - banner [ref=e20]:
    - generic [ref=e21]:
      - generic [ref=e22]: Production Repositories & Applications
      - heading "Projects & GitHub Hub" [level=1] [ref=e23]
      - paragraph [ref=e24]: Explore 11+ production web applications, cross-platform mobile apps, enterprise backend systems, and live GitHub repositories.
  - main [ref=e25]:
    - generic [ref=e26]:
      - generic [ref=e27]:
        - textbox "🔍 Search projects by title, stack, or tech..." [ref=e29]
        - generic [ref=e30]:
          - button "All Repos" [ref=e31] [cursor=pointer]
          - button "Mobile Apps" [ref=e32] [cursor=pointer]
          - button "React / Web" [ref=e33] [cursor=pointer]
          - button "Spring / Backend" [ref=e34] [cursor=pointer]
          - button "C# / .NET" [ref=e35] [cursor=pointer]
      - generic [ref=e36]:
        - button "Open Gulf Limousine Booking App details" [active] [ref=e37] [cursor=pointer]:
          - img "Gulf Limousine Booking App" [ref=e39]
          - generic [ref=e40]:
            - generic [ref=e41]:
              - heading "Gulf Limousine Booking App" [level=4] [ref=e42]
              - generic "Automatically synced with GitHub Repository" [ref=e43]: ● Synced
            - paragraph [ref=e44]: July 2026
            - paragraph [ref=e45]:
              - strong [ref=e46]: "Stack:"
              - text: Flutter, Dart, Firebase, REST API
            - paragraph [ref=e47]: Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation, vehicle selection, fare estimation, and client booking management.
            - link "View GitHub Repo ↗" [ref=e49]:
              - /url: https://github.com/zaydaly05/Gulf_Limousine_App
        - button "Open Essmat Plastic Factory Management System details" [ref=e52] [cursor=pointer]:
          - img "Essmat Plastic Factory Management System" [ref=e54]
          - generic [ref=e55]:
            - generic [ref=e56]:
              - heading "Essmat Plastic Factory Management System" [level=4] [ref=e57]
              - generic "Automatically synced with GitHub Repository" [ref=e58]: ● Synced
            - paragraph [ref=e59]: September 2026
            - paragraph [ref=e60]:
              - strong [ref=e61]: "Stack:"
              - text: C#, .NET, SQL Server, Entity Framework
            - paragraph [ref=e62]: Enterprise inventory and production management solution for plastic manufacturing, optimizing raw material tracking, order processing, and factory billing workflows.
            - generic [ref=e63]:
              - link "View GitHub Repo ↗" [ref=e64]:
                - /url: https://github.com/zaydaly05/EssmatPlastic
              - link "📄 PDF Report 📥" [ref=e67]:
                - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790736/zayd-portfolio/essmat-plastic-report.pdf
        - button "Open Dr. Naglaa Academic Biography Portal details" [ref=e68] [cursor=pointer]:
          - img "Dr. Naglaa Academic Biography Portal" [ref=e70]
          - generic [ref=e71]:
            - generic [ref=e72]:
              - heading "Dr. Naglaa Academic Biography Portal" [level=4] [ref=e73]
              - generic "Automatically synced with GitHub Repository" [ref=e74]: ● Synced
            - paragraph [ref=e75]: September 2026
            - paragraph [ref=e76]:
              - strong [ref=e77]: "Stack:"
              - text: HTML5, CSS3, JavaScript, Responsive UI
            - paragraph [ref=e78]: Modern academic portfolio & publication showcase website designed for university faculty, featuring curriculum vitae integration, research paper archives, and student contact channels.
            - link "View GitHub Repo ↗" [ref=e80]:
              - /url: https://github.com/zaydaly05/drNaglaBio
        - button "Open Food Ordering Management System details" [ref=e83] [cursor=pointer]:
          - img "Food Ordering Management System" [ref=e85]
          - generic [ref=e86]:
            - generic [ref=e87]:
              - heading "Food Ordering Management System" [level=4] [ref=e88]
              - generic "Automatically synced with GitHub Repository" [ref=e89]: ● Synced
            - paragraph [ref=e90]: May 2026
            - paragraph [ref=e91]:
              - strong [ref=e92]: "Stack:"
              - text: Spring Boot, Tailwind, React, MongoDB
            - paragraph [ref=e93]: Developed a full-stack food ordering system with Spring Boot and a React + Tailwind frontend. Built RESTful APIs for authentication, menu management, cart operations, and order processing with MongoDB. Implemented role-based Admin and Customer flows with CRUD, order tracking, and analytics such as top-selling items and profit insights.
            - link "View GitHub Repo ↗" [ref=e95]:
              - /url: https://github.com/zaydaly05/food_ordering_system
        - button "Open In Gaz API System details" [ref=e98] [cursor=pointer]:
          - img "In Gaz API System" [ref=e100]
          - generic [ref=e101]:
            - generic [ref=e102]:
              - heading "In Gaz API System" [level=4] [ref=e103]
              - generic "Automatically synced with GitHub Repository" [ref=e104]: ● Synced
            - paragraph [ref=e105]: July 2025
            - paragraph [ref=e106]:
              - strong [ref=e107]: "Stack:"
              - text: C#, Flutter, .NET Core Web API
            - paragraph [ref=e108]: Built a Flutter frontend integrated with a C# .NET Core Web API backend using MVC, secure role-based access, CRUD operations, and Swagger testing.
            - link "View GitHub Repo ↗" [ref=e110]:
              - /url: https://github.com/zaydaly05/InGazAPI
        - button "Open Employee Attendance & Leave System details" [ref=e113] [cursor=pointer]:
          - img "Employee Attendance & Leave System" [ref=e115]
          - generic [ref=e116]:
            - generic [ref=e117]:
              - heading "Employee Attendance & Leave System" [level=4] [ref=e118]
              - generic "Automatically synced with GitHub Repository" [ref=e119]: ● Synced
            - paragraph [ref=e120]: December 2025
            - paragraph [ref=e121]:
              - strong [ref=e122]: "Stack:"
              - text: HTML, CSS, PHP, MySQL
            - paragraph [ref=e123]: Developed a web-based attendance and leave platform with automated tracking and approval, event/announcement features, and secure relational role-based access.
            - link "View GitHub Repo ↗" [ref=e125]:
              - /url: https://github.com/zaydaly05/Employee_Attendance-Leave_Management_System
        - button "Open Car Rental Website details" [ref=e128] [cursor=pointer]:
          - img "Car Rental Website" [ref=e130]
          - generic [ref=e131]:
            - generic [ref=e132]:
              - heading "Car Rental Website" [level=4] [ref=e133]
              - generic "Automatically synced with GitHub Repository" [ref=e134]: ● Synced
            - paragraph [ref=e135]: May 2025
            - paragraph [ref=e136]:
              - strong [ref=e137]: "Stack:"
              - text: HTML, CSS, MongoDB, Node.js, JavaScript
            - paragraph [ref=e138]: Developed a comprehensive e-commerce style platform for users to browse and rent cars with authentication, catalog management, and order processing.
            - link "View GitHub Repo ↗" [ref=e140]:
              - /url: https://github.com/zaydaly05/Car_Rental_Website
        - button "Open Restaurant Management System details" [ref=e143] [cursor=pointer]:
          - img "Restaurant Management System" [ref=e145]
          - generic [ref=e146]:
            - generic [ref=e147]:
              - heading "Restaurant Management System" [level=4] [ref=e148]
              - generic "Automatically synced with GitHub Repository" [ref=e149]: ● Synced
            - paragraph [ref=e150]: December 2024
            - paragraph [ref=e151]:
              - strong [ref=e152]: "Stack:"
              - text: Java, JavaFX
            - paragraph [ref=e153]: Created a recruitment system with a graphical user interface for managing job postings, applications, and interviews using Java and JavaFX.
            - link "View GitHub Repo ↗" [ref=e155]:
              - /url: https://github.com/zaydaly05/Restaurant_Management_System
        - button "Open Sleeping Alert System details" [ref=e158] [cursor=pointer]:
          - img "Sleeping Alert System" [ref=e160]
          - generic [ref=e161]:
            - generic [ref=e162]:
              - heading "Sleeping Alert System" [level=4] [ref=e163]
              - generic "Automatically synced with GitHub Repository" [ref=e164]: ● Synced
            - paragraph [ref=e165]: December 2025
            - paragraph [ref=e166]:
              - strong [ref=e167]: "Stack:"
              - text: Python, Flutter
            - paragraph [ref=e168]: Developed a sleeping alert system for an HCI course, applying usability and interaction design principles with a responsive mobile interface.
            - link "View GitHub Repo ↗" [ref=e170]:
              - /url: https://github.com/zaydaly05/Sleep_Alert_System
        - button "Open Zaydentity Digital Identity Platform details" [ref=e173] [cursor=pointer]:
          - img "Zaydentity Digital Identity Platform" [ref=e175]
          - generic [ref=e176]:
            - generic [ref=e177]:
              - heading "Zaydentity Digital Identity Platform" [level=4] [ref=e178]
              - generic "Automatically synced with GitHub Repository" [ref=e179]: ● Synced
            - paragraph [ref=e180]: September 2026
            - paragraph [ref=e181]:
              - strong [ref=e182]: "Stack:"
              - text: HTML5, CSS3, JavaScript
            - paragraph [ref=e183]: Digital personal branding & bio-link platform consolidating developer links, project highlights, and verified professional credentials in a unified interactive card UI.
            - link "View GitHub Repo ↗" [ref=e185]:
              - /url: https://github.com/zaydaly05/zaydentity
        - button "Open WE Telecom Training Suite details" [ref=e188] [cursor=pointer]:
          - img "WE Telecom Training Suite" [ref=e190]
          - generic [ref=e191]:
            - generic [ref=e192]:
              - heading "WE Telecom Training Suite" [level=4] [ref=e193]
              - generic "Automatically synced with GitHub Repository" [ref=e194]: ● Synced
            - paragraph [ref=e195]: August 2026
            - paragraph [ref=e196]:
              - strong [ref=e197]: "Stack:"
              - text: Networking, C++, Telecommunications
            - paragraph [ref=e198]: Technical codebase & project artifacts developed during Telecom Egypt (WE) training, focusing on network protocol fundamentals, system administration, and enterprise infrastructure.
            - link "View GitHub Repo ↗" [ref=e200]:
              - /url: https://github.com/zaydaly05/WE_Intern
    - generic [ref=e203]:
      - generic [ref=e204]:
        - generic [ref=e205]: ★
        - heading "Live GitHub Account Activity" [level=3] [ref=e206]
      - generic [ref=e208]:
        - generic [ref=e209]:
          - img "Zayd GitHub Avatar" [ref=e211]
          - generic [ref=e212]:
            - heading "@zaydaly05" [level=4] [ref=e213]
            - paragraph [ref=e214]: Junior Computer Science Student | Software Developer
            - generic [ref=e215]:
              - generic [ref=e216]:
                - generic [ref=e217]: "15"
                - text: Public Repos
              - generic [ref=e218]:
                - generic [ref=e219]: "6"
                - text: Followers
            - link "Visit GitHub Profile ↗" [ref=e220] [cursor=pointer]:
              - /url: https://github.com/zaydaly05
        - generic [ref=e221]:
          - generic [ref=e222]:
            - heading "Recent Public Repositories" [level=5] [ref=e223]
            - generic [ref=e224]: Synced
          - generic [ref=e226]:
            - generic [ref=e227]:
              - generic [ref=e228]:
                - generic [ref=e229]: portfolio
                - paragraph [ref=e230]: Project repository by Zayd
              - generic [ref=e231]:
                - generic [ref=e232]: HTML
                - generic [ref=e234]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e235] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/portfolio
            - generic [ref=e236]:
              - generic [ref=e237]:
                - generic [ref=e238]: zaydentity
                - paragraph [ref=e239]: Project repository by Zayd
              - generic [ref=e240]:
                - generic [ref=e241]: HTML
                - generic [ref=e243]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e244] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/zaydentity
            - generic [ref=e245]:
              - generic [ref=e246]:
                - generic [ref=e247]: EssmatPlastic
                - paragraph [ref=e248]: Project repository by Zayd
              - generic [ref=e249]:
                - generic [ref=e250]: C#
                - generic [ref=e252]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e253] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/EssmatPlastic
            - generic [ref=e254]:
              - generic [ref=e255]:
                - generic [ref=e256]: cv-portfolio
                - paragraph [ref=e257]: Project repository by Zayd
              - generic [ref=e258]:
                - generic [ref=e259]: TeX
                - generic [ref=e261]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e262] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/cv-portfolio
            - generic [ref=e263]:
              - generic [ref=e264]:
                - generic [ref=e265]: drNaglaBio
                - paragraph [ref=e266]: Project repository by Zayd
              - generic [ref=e267]:
                - generic [ref=e268]: HTML
                - generic [ref=e270]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e271] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/drNaglaBio
            - generic [ref=e272]:
              - generic [ref=e273]:
                - generic [ref=e274]: Week6Task9
                - paragraph [ref=e275]: Project repository by Zayd
              - generic [ref=e276]:
                - generic [ref=e277]: Kotlin
                - generic [ref=e279]:
                  - text: ⭐ 0
                  - link "View ↗" [ref=e280] [cursor=pointer]:
                    - /url: https://github.com/zaydaly05/Week6Task9
  - contentinfo [ref=e281]:
    - generic [ref=e282]:
      - paragraph [ref=e283]: © 2026 Zayd Ali Mohamed. All rights reserved.
      - generic [ref=e284]:
        - link "Home" [ref=e285] [cursor=pointer]:
          - /url: /
        - link "Projects" [ref=e286] [cursor=pointer]:
          - /url: /projects
        - link "Experience" [ref=e287] [cursor=pointer]:
          - /url: /experience
        - button "Terminal CLI" [ref=e288] [cursor=pointer]
        - button "AI Assistant" [ref=e289] [cursor=pointer]
  - button "Toggle Ask Zayd AI Copilot" [ref=e291] [cursor=pointer]:
    - generic [ref=e296]: Ask Zayd AI
  - generic [ref=e298]:
    - button "Close" [ref=e299] [cursor=pointer]: ×
    - generic [ref=e300]:
      - generic [ref=e301]: ⭐
      - generic [ref=e302]:
        - heading "Enjoying Zayd's Portfolio?" [level=6] [ref=e303]
        - paragraph [ref=e304]: Star the repo & leave a review on the Experience page!
    - link "Leave Review & Star ↗" [ref=e306] [cursor=pointer]:
      - /url: /experience#reviews-section
  - dialog [ref=e309]:
    - button "Close details" [ref=e310] [cursor=pointer]: ×
    - paragraph [ref=e311]: Project Details
    - heading "Gulf Limousine Booking App" [level=3] [ref=e312]
    - paragraph [ref=e313]: July 2026 · Flutter, Dart, Firebase, REST API
    - paragraph [ref=e314]: "Cross-platform luxury limousine reservation & fleet tracking mobile app featuring real-time driver allocation, vehicle selection, fare estimation, and client booking management. 🔗 GitHub Repo: https://github.com/zaydaly05/Gulf_Limousine_App"
    - list [ref=e316]:
      - listitem [ref=e317]: "Live repository link: https://github.com/zaydaly05/Gulf_Limousine_App"
      - listitem [ref=e318]: Automatically synced with GitHub project commits
    - button "View Gulf Limousine App real output preview full size" [ref=e320]:
      - img "Gulf Limousine App real output preview" [ref=e321]
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