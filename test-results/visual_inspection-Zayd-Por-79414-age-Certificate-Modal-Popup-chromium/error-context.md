# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual_inspection.spec.js >> Zayd Portfolio Image & Modal Visual Inspection >> 3. Inspect Experience Page & Certificate Modal Popup
- Location: tests\visual_inspection.spec.js:73:3

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
      - generic [ref=e22]: Career Timeline & Visitor Feedback
      - heading "Experience, CV & Community Reviews" [level=1] [ref=e23]
      - paragraph [ref=e24]: Explore Zayd's internship history at TAQA Arabia and CHI, academic background, Overleaf LaTeX resume, and community visitor reviews.
  - main [ref=e25]:
    - generic [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]: "01"
        - heading "Industry Internships & Experience" [level=3] [ref=e29]
      - generic [ref=e31]:
        - button "Open IT Department Intern details" [ref=e32] [cursor=pointer]:
          - generic [ref=e33]:
            - generic [ref=e34]: 🖥️
            - generic [ref=e35]:
              - generic [ref=e36]:
                - generic [ref=e37]: Cairo Higher Institute
                - generic [ref=e38]: 📸 Photo Available
              - heading "IT Department Intern" [level=4] [ref=e39]
              - generic [ref=e40]:
                - generic [ref=e41]: August 2025 - September 2025
                - generic [ref=e45]: 1st Settlement, Cairo
              - list [ref=e49]:
                - listitem [ref=e50]: Created and managed institutional user email accounts using the official domain.
                - listitem [ref=e51]: Edited and updated the front-end of the institute website using WordPress.
                - listitem [ref=e52]: +2 more responsibilities →
              - generic [ref=e53]: View Full Details & Gallery ↗
        - button "Open Software Development Intern details" [ref=e58] [cursor=pointer]:
          - generic [ref=e59]:
            - generic [ref=e60]: 💻
            - generic [ref=e61]:
              - generic [ref=e62]:
                - generic [ref=e63]: TAQA Arabia
                - generic [ref=e64]: 📸 2 Photos & Certificate
              - heading "Software Development Intern" [level=4] [ref=e65]
              - generic [ref=e66]:
                - generic [ref=e67]: July 2025 - August 2025
                - generic [ref=e71]: Maadi, Cairo
              - list [ref=e75]:
                - listitem [ref=e76]: Contributed to developing the In Gaz API mobile application.
              - generic [ref=e77]: View Full Details & Gallery ↗
        - button "Open IT Department Intern details" [ref=e82] [cursor=pointer]:
          - generic [ref=e83]:
            - generic [ref=e84]: 🖥️
            - generic [ref=e85]:
              - generic [ref=e86]:
                - generic [ref=e87]: TAQA Arabia
                - generic [ref=e88]: 📸 2 Photos
              - heading "IT Department Intern" [level=4] [ref=e89]
              - generic [ref=e90]:
                - generic [ref=e91]: August 2024 - September 2024
                - generic [ref=e95]: Maadi, Cairo
              - list [ref=e99]:
                - listitem [ref=e100]: Handled devices software management.
                - listitem [ref=e101]: Managed user accounts and access support.
              - generic [ref=e102]: View Full Details & Gallery ↗
    - generic [ref=e107]:
      - generic [ref=e108]:
        - generic [ref=e109]: "02"
        - heading "Education" [level=3] [ref=e110]
      - article [ref=e113]:
        - generic [ref=e114]: 🎓
        - generic [ref=e115]:
          - generic [ref=e116]: Education
          - heading "Misr International University" [level=4] [ref=e117]
          - paragraph [ref=e118]: Bachelor of Science in Computer Science
          - paragraph [ref=e119]: Sep 2023 - Jun 2027
    - generic [ref=e123]:
      - generic [ref=e124]:
        - generic [ref=e125]: "03"
        - heading "Verified Online Certifications & Diplomas" [level=3] [ref=e126]
      - paragraph [ref=e128]: Official certifications, diplomas, and experience letters earned by Zayd Ali Mohamed from Cisco Networking Academy, OpenEDG Institutes, and industry employers.
      - generic [ref=e129]:
        - button "View TAQA Arabia Software Internship Certificate certificate" [active] [ref=e130] [cursor=pointer]:
          - generic [ref=e131]:
            - img "TAQA Arabia Software Internship Certificate" [ref=e132]
            - generic [ref=e133]: Industry Experience
          - generic [ref=e134]:
            - generic [ref=e135]:
              - heading "TAQA Arabia Software Internship Certificate" [level=4] [ref=e136]
              - generic [ref=e137]: August 2025
            - paragraph [ref=e138]: 📜 TAQA Arabia — Software Engineering Dept
            - paragraph [ref=e139]: Official engineering internship certificate recognizing contribution to the In Gaz API mobile platform.
            - link "View Credential Document ↗" [ref=e141]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790815/zayd-portfolio/Taqa25Crt.jpg
        - button "View Cisco JavaScript Essentials 1 & 2 certificate" [ref=e142] [cursor=pointer]:
          - generic [ref=e143]:
            - img "Cisco JavaScript Essentials 1 & 2" [ref=e144]
            - generic [ref=e145]: Full-Stack Development
          - generic [ref=e146]:
            - generic [ref=e147]:
              - heading "Cisco JavaScript Essentials 1 & 2" [level=4] [ref=e148]
              - generic [ref=e149]: July 2025
            - paragraph [ref=e150]: 📜 Cisco Networking Academy & OpenEDG JS Institute
            - paragraph [ref=e151]: Advanced JavaScript ES6+, asynchronous programming, object-oriented concepts, and DOM manipulation.
            - link "View Credential Document ↗" [ref=e153]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790790/zayd-portfolio/Online%20Certificates/JavaScriptEssentials2Update20250713-27-31fbam.pdf
        - button "View Cisco C Essentials 1 Certification certificate" [ref=e154] [cursor=pointer]:
          - generic [ref=e155]:
            - img "Cisco C Essentials 1 Certification" [ref=e156]
            - generic [ref=e157]: Systems & Core Programming
          - generic [ref=e158]:
            - generic [ref=e159]:
              - heading "Cisco C Essentials 1 Certification" [level=4] [ref=e160]
              - generic [ref=e161]: July 2025
            - paragraph [ref=e162]: 📜 Cisco Networking Academy & OpenEDG C Institute
            - paragraph [ref=e163]: Low-level system programming, memory management, pointers, and algorithmic structures in C.
            - link "View Credential Document ↗" [ref=e165]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790777/zayd-portfolio/Online%20Certificates/CEssentials1Update20250709-29-hnum8q.pdf
        - button "View Introduction to Cybersecurity Certification certificate" [ref=e166] [cursor=pointer]:
          - generic [ref=e167]:
            - img "Introduction to Cybersecurity Certification" [ref=e168]
            - generic [ref=e169]: Cybersecurity & Networks
          - generic [ref=e170]:
            - generic [ref=e171]:
              - heading "Introduction to Cybersecurity Certification" [level=4] [ref=e172]
              - generic [ref=e173]: July 2025
            - paragraph [ref=e174]: 📜 Cisco Networking Academy
            - paragraph [ref=e175]: Network security protocols, vulnerability analysis, encryption fundamentals, and threat mitigation.
            - link "View Credential Document ↗" [ref=e177]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790784/zayd-portfolio/Online%20Certificates/I2CSUpdate20250709-27-93jy0g.pdf
        - button "View CSS & Modern Web Development certificate" [ref=e178] [cursor=pointer]:
          - generic [ref=e179]:
            - img "CSS & Modern Web Development" [ref=e180]
            - generic [ref=e181]: Frontend Architecture
          - generic [ref=e182]:
            - generic [ref=e183]:
              - heading "CSS & Modern Web Development" [level=4] [ref=e184]
              - generic [ref=e185]: July 2025
            - paragraph [ref=e186]: 📜 Cisco OpenEDG Academy
            - paragraph [ref=e187]: Responsive layout design, Flexbox, CSS Grid, animation frameworks, and modern CSS3 aesthetics.
            - link "View Credential Document ↗" [ref=e189]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790779/zayd-portfolio/Online%20Certificates/CSS.png
        - button "View Cairo Higher Institute Experience Letter certificate" [ref=e190] [cursor=pointer]:
          - generic [ref=e191]:
            - img "Cairo Higher Institute Experience Letter" [ref=e192]
            - generic [ref=e193]: Industry Experience
          - generic [ref=e194]:
            - generic [ref=e195]:
              - heading "Cairo Higher Institute Experience Letter" [level=4] [ref=e196]
              - generic [ref=e197]: September 2025
            - paragraph [ref=e198]: 📜 Cairo Higher Institute — IT Dept
            - paragraph [ref=e199]: Institutional user account management, website front-end maintenance, and digital content production.
            - link "View Credential Document ↗" [ref=e201]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790719/zayd-portfolio/chi-experience.jpg
    - generic [ref=e204]:
      - heading "Official LaTeX Resume" [level=3] [ref=e205]
      - paragraph [ref=e206]: Formatted and updated automatically via GitHub Actions from Overleaf LaTeX source code.
      - generic [ref=e207]:
        - button "Preview Resume PDF ↗" [ref=e208] [cursor=pointer]
        - link "Download PDF 📥" [ref=e209] [cursor=pointer]:
          - /url: /assets/Zayd%20Ali%20Mohamed%20CV.pdf
    - generic [ref=e210]:
      - generic [ref=e211]:
        - generic [ref=e212]: ⭐
        - heading "Community Reviews & Portfolio Star" [level=3] [ref=e213]
      - generic [ref=e215]:
        - generic [ref=e216]:
          - heading "Enjoying Zayd's Portfolio & Projects?" [level=4] [ref=e217]
          - paragraph [ref=e218]: Leave a star on GitHub & share your feedback or endorsement below!
        - button "★ Star Portfolio (48)" [ref=e220] [cursor=pointer]
      - generic [ref=e221]:
        - heading "✍️ Leave a Review or Endorsement" [level=4] [ref=e222]
        - generic [ref=e223]:
          - generic [ref=e224]:
            - textbox "Your Name *" [ref=e225]
            - textbox "Your Role / Company (e.g. Recruiter, Engineer)" [ref=e226]
          - generic [ref=e227]:
            - text: "Rating:"
            - combobox [ref=e228]:
              - option "⭐⭐⭐⭐⭐ (5 / 5 Stars)" [selected]
              - option "⭐⭐⭐⭐ (4 / 5 Stars)"
              - option "⭐⭐⭐ (3 / 5 Stars)"
          - textbox "Write your review, feedback, or recommendation..." [ref=e229]
          - button "Submit Review 🚀" [ref=e230] [cursor=pointer]
      - generic [ref=e231]:
        - heading "Community Reviews & Feedback" [level=5] [ref=e232]
        - generic [ref=e233]:
          - generic [ref=e234]:
            - generic [ref=e236]:
              - generic [ref=e237]:
                - heading "Mohammed Essam El Din" [level=5] [ref=e238]
                - generic "Verified Recommendation" [ref=e239]
              - generic [ref=e242]: SWE @ El Zatuna | IBM Student Ambassador @ MIU
            - generic [ref=e243]: ⭐⭐⭐⭐⭐
            - paragraph [ref=e244]: "\"I'm proud to recommend my friend and colleague, Zayd, whose dedication, knowledge, and willingness to help others truly set him apart. Throughout our time working and studying together, Zayd consistently demonstrated a strong commitment not only to his own learning but also to supporting those around him. One of Zayd's most admirable qualities is his willingness to help others.\""
            - generic [ref=e245]: 2025-07-09
          - generic [ref=e246]:
            - generic [ref=e248]:
              - generic [ref=e249]:
                - heading "Ahmed Hatem" [level=5] [ref=e250]
                - generic "Verified Recommendation" [ref=e251]
              - generic [ref=e254]: Electronics and Communication Engineering Student @MIU
            - generic [ref=e255]: ⭐⭐⭐⭐⭐
            - paragraph [ref=e256]: "\"Zayd is a hardworking and creative Computer Science student with a strong passion for software engineering. He approaches every task with focus and a problem-solving mindset. I'm confident he has a bright future ahead in tech.\""
            - generic [ref=e257]: 2025-07-09
          - generic [ref=e258]:
            - generic [ref=e260]:
              - generic [ref=e261]:
                - heading "Hazem Mohamed" [level=5] [ref=e262]
                - generic "Verified Recommendation" [ref=e263]
              - generic [ref=e266]: DevOps Engineer | 3x AWS Certified | Software Engineer
            - generic [ref=e267]: ⭐⭐⭐⭐⭐
            - paragraph [ref=e268]: "\"Zayd is a curious and motivated student who loves learning and always seeks to understand more.\""
            - generic [ref=e269]: 2025-07-01
  - contentinfo [ref=e270]:
    - generic [ref=e271]:
      - paragraph [ref=e272]: © 2026 Zayd Ali Mohamed. All rights reserved.
      - generic [ref=e273]:
        - link "Home" [ref=e274] [cursor=pointer]:
          - /url: /
        - link "Projects" [ref=e275] [cursor=pointer]:
          - /url: /projects
        - link "Experience" [ref=e276] [cursor=pointer]:
          - /url: /experience
        - button "Terminal CLI" [ref=e277] [cursor=pointer]
        - button "AI Assistant" [ref=e278] [cursor=pointer]
  - button "Toggle Ask Zayd AI Copilot" [ref=e280] [cursor=pointer]:
    - generic [ref=e285]: Ask Zayd AI
  - generic [ref=e287]:
    - button "Close" [ref=e288] [cursor=pointer]: ×
    - generic [ref=e289]:
      - generic [ref=e290]: ⭐
      - generic [ref=e291]:
        - heading "Enjoying Zayd's Portfolio?" [level=6] [ref=e292]
        - paragraph [ref=e293]: Star the repo & leave a review on the Experience page!
    - link "Leave Review & Star ↗" [ref=e295] [cursor=pointer]:
      - /url: /experience#reviews-section
  - dialog [ref=e298]:
    - button "Close details" [ref=e299] [cursor=pointer]: ×
    - paragraph [ref=e300]: Verified Online Certification
    - heading "TAQA Arabia Software Internship Certificate" [level=3] [ref=e301]
    - paragraph [ref=e302]: TAQA Arabia — Software Engineering Dept · August 2025
    - paragraph [ref=e303]: Official engineering internship certificate recognizing contribution to the In Gaz API mobile platform.
    - list [ref=e305]:
      - listitem [ref=e306]: "Issued by: TAQA Arabia — Software Engineering Dept"
      - listitem [ref=e307]: "Credential Category: Industry Experience"
      - listitem [ref=e308]: "Date: August 2025"
    - button "View TAQA Arabia Software Internship Certificate full size" [ref=e310]:
      - img "TAQA Arabia Software Internship Certificate" [ref=e311]
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
> 81 |       await page.waitForSelector('#global-detail-modal:not(.hidden)', { timeout: 3000 });
     |                  ^ TimeoutError: page.waitForSelector: Timeout 3000ms exceeded.
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