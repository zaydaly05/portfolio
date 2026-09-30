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
    - generic [ref=e5]:
      - button "CLI" [ref=e6] [cursor=pointer]
      - button "☀️ Light Mode" [ref=e7] [cursor=pointer]
      - link "Hire Me" [ref=e8] [cursor=pointer]:
        - /url: /contact
      - button "Open navigation menu" [ref=e9] [cursor=pointer]
  - banner [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e15]: Career Timeline & Visitor Feedback
      - heading "Experience, CV & Community Reviews" [level=1] [ref=e16]
      - paragraph [ref=e17]: Explore Zayd's internship history at TAQA Arabia and CHI, academic background, Overleaf LaTeX resume, and community visitor reviews.
  - main [ref=e18]:
    - generic [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]: "01"
        - heading "Industry Internships & Experience" [level=3] [ref=e22]
      - generic [ref=e23]:
        - button "Open IT Department Intern details" [ref=e24] [cursor=pointer]:
          - generic [ref=e25]:
            - generic [ref=e26]: 🖥️
            - generic [ref=e27]:
              - generic [ref=e28]:
                - generic [ref=e29]: Cairo Higher Institute
                - generic [ref=e30]: 📸 Photo Available
              - heading "IT Department Intern" [level=4] [ref=e31]
              - generic [ref=e32]:
                - generic [ref=e33]: August 2025 - September 2025
                - generic [ref=e37]: 1st Settlement, Cairo
              - list [ref=e41]:
                - listitem [ref=e42]: Created and managed institutional user email accounts using the official domain.
                - listitem [ref=e43]: Edited and updated the front-end of the institute website using WordPress.
                - listitem [ref=e44]: +2 more responsibilities →
              - generic [ref=e45]: View Full Details & Gallery ↗
        - button "Open Software Development Intern details" [ref=e50] [cursor=pointer]:
          - generic [ref=e51]:
            - generic [ref=e52]: 💻
            - generic [ref=e53]:
              - generic [ref=e54]:
                - generic [ref=e55]: TAQA Arabia
                - generic [ref=e56]: 📸 2 Photos & Certificate
              - heading "Software Development Intern" [level=4] [ref=e57]
              - generic [ref=e58]:
                - generic [ref=e59]: July 2025 - August 2025
                - generic [ref=e63]: Maadi, Cairo
              - list [ref=e67]:
                - listitem [ref=e68]: Contributed to developing the In Gaz API mobile application.
              - generic [ref=e69]: View Full Details & Gallery ↗
        - button "Open IT Department Intern details" [ref=e74] [cursor=pointer]:
          - generic [ref=e75]:
            - generic [ref=e76]: 🖥️
            - generic [ref=e77]:
              - generic [ref=e78]:
                - generic [ref=e79]: TAQA Arabia
                - generic [ref=e80]: 📸 2 Photos
              - heading "IT Department Intern" [level=4] [ref=e81]
              - generic [ref=e82]:
                - generic [ref=e83]: August 2024 - September 2024
                - generic [ref=e87]: Maadi, Cairo
              - list [ref=e91]:
                - listitem [ref=e92]: Handled devices software management.
                - listitem [ref=e93]: Managed user accounts and access support.
              - generic [ref=e94]: View Full Details & Gallery ↗
    - generic [ref=e99]:
      - generic [ref=e100]:
        - generic [ref=e101]: "02"
        - heading "Education" [level=3] [ref=e102]
      - article [ref=e104]:
        - generic [ref=e105]: 🎓
        - generic [ref=e106]:
          - generic [ref=e107]: Education
          - heading "Misr International University" [level=4] [ref=e108]
          - paragraph [ref=e109]: Bachelor of Science in Computer Science
          - paragraph [ref=e110]: Sep 2023 - Jun 2027
    - generic [ref=e114]:
      - generic [ref=e115]:
        - generic [ref=e116]: "03"
        - heading "Verified Online Certifications & Diplomas" [level=3] [ref=e117]
      - paragraph [ref=e118]: Official certifications, diplomas, and experience letters earned by Zayd Ali Mohamed from Cisco Networking Academy, OpenEDG Institutes, and industry employers.
      - generic [ref=e119]:
        - button "View TAQA Arabia Software Internship Certificate certificate" [active] [ref=e120] [cursor=pointer]:
          - generic [ref=e121]:
            - img "TAQA Arabia Software Internship Certificate" [ref=e122]
            - generic [ref=e123]: Industry Experience
          - generic [ref=e124]:
            - generic [ref=e125]:
              - heading "TAQA Arabia Software Internship Certificate" [level=4] [ref=e126]
              - generic [ref=e127]: August 2025
            - paragraph [ref=e128]: 📜 TAQA Arabia — Software Engineering Dept
            - paragraph [ref=e129]: Official engineering internship certificate recognizing contribution to the In Gaz API mobile platform.
            - link "View Credential Document ↗" [ref=e131]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790815/zayd-portfolio/Taqa25Crt.jpg
        - button "View Cisco JavaScript Essentials 1 & 2 certificate" [ref=e132] [cursor=pointer]:
          - generic [ref=e133]:
            - img "Cisco JavaScript Essentials 1 & 2" [ref=e134]
            - generic [ref=e135]: Full-Stack Development
          - generic [ref=e136]:
            - generic [ref=e137]:
              - heading "Cisco JavaScript Essentials 1 & 2" [level=4] [ref=e138]
              - generic [ref=e139]: July 2025
            - paragraph [ref=e140]: 📜 Cisco Networking Academy & OpenEDG JS Institute
            - paragraph [ref=e141]: Advanced JavaScript ES6+, asynchronous programming, object-oriented concepts, and DOM manipulation.
            - link "View Credential Document ↗" [ref=e143]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790790/zayd-portfolio/Online%20Certificates/JavaScriptEssentials2Update20250713-27-31fbam.pdf
        - button "View Cisco C Essentials 1 Certification certificate" [ref=e144] [cursor=pointer]:
          - generic [ref=e145]:
            - img "Cisco C Essentials 1 Certification" [ref=e146]
            - generic [ref=e147]: Systems & Core Programming
          - generic [ref=e148]:
            - generic [ref=e149]:
              - heading "Cisco C Essentials 1 Certification" [level=4] [ref=e150]
              - generic [ref=e151]: July 2025
            - paragraph [ref=e152]: 📜 Cisco Networking Academy & OpenEDG C Institute
            - paragraph [ref=e153]: Low-level system programming, memory management, pointers, and algorithmic structures in C.
            - link "View Credential Document ↗" [ref=e155]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790777/zayd-portfolio/Online%20Certificates/CEssentials1Update20250709-29-hnum8q.pdf
        - button "View Introduction to Cybersecurity Certification certificate" [ref=e156] [cursor=pointer]:
          - generic [ref=e157]:
            - img "Introduction to Cybersecurity Certification" [ref=e158]
            - generic [ref=e159]: Cybersecurity & Networks
          - generic [ref=e160]:
            - generic [ref=e161]:
              - heading "Introduction to Cybersecurity Certification" [level=4] [ref=e162]
              - generic [ref=e163]: July 2025
            - paragraph [ref=e164]: 📜 Cisco Networking Academy
            - paragraph [ref=e165]: Network security protocols, vulnerability analysis, encryption fundamentals, and threat mitigation.
            - link "View Credential Document ↗" [ref=e167]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790784/zayd-portfolio/Online%20Certificates/I2CSUpdate20250709-27-93jy0g.pdf
        - button "View CSS & Modern Web Development certificate" [ref=e168] [cursor=pointer]:
          - generic [ref=e169]:
            - img "CSS & Modern Web Development" [ref=e170]
            - generic [ref=e171]: Frontend Architecture
          - generic [ref=e172]:
            - generic [ref=e173]:
              - heading "CSS & Modern Web Development" [level=4] [ref=e174]
              - generic [ref=e175]: July 2025
            - paragraph [ref=e176]: 📜 Cisco OpenEDG Academy
            - paragraph [ref=e177]: Responsive layout design, Flexbox, CSS Grid, animation frameworks, and modern CSS3 aesthetics.
            - link "View Credential Document ↗" [ref=e179]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790779/zayd-portfolio/Online%20Certificates/CSS.png
        - button "View Cairo Higher Institute Experience Letter certificate" [ref=e180] [cursor=pointer]:
          - generic [ref=e181]:
            - img "Cairo Higher Institute Experience Letter" [ref=e182]
            - generic [ref=e183]: Industry Experience
          - generic [ref=e184]:
            - generic [ref=e185]:
              - heading "Cairo Higher Institute Experience Letter" [level=4] [ref=e186]
              - generic [ref=e187]: September 2025
            - paragraph [ref=e188]: 📜 Cairo Higher Institute — IT Dept
            - paragraph [ref=e189]: Institutional user account management, website front-end maintenance, and digital content production.
            - link "View Credential Document ↗" [ref=e191]:
              - /url: https://res.cloudinary.com/delnnzcph/image/upload/v1790790719/zayd-portfolio/chi-experience.jpg
    - generic [ref=e194]:
      - heading "Official LaTeX Resume" [level=3] [ref=e195]
      - paragraph [ref=e196]: Formatted and updated automatically via GitHub Actions from Overleaf LaTeX source code.
      - generic [ref=e197]:
        - button "Preview Resume PDF ↗" [ref=e198] [cursor=pointer]
        - link "Download PDF 📥" [ref=e199] [cursor=pointer]:
          - /url: /assets/Zayd%20Ali%20Mohamed%20CV.pdf
    - generic [ref=e200]:
      - generic [ref=e201]:
        - generic [ref=e202]: ⭐
        - heading "Community Reviews & Portfolio Star" [level=3] [ref=e203]
      - generic [ref=e204]:
        - generic [ref=e205]:
          - heading "Enjoying Zayd's Portfolio & Projects?" [level=4] [ref=e206]
          - paragraph [ref=e207]: Leave a star on GitHub & share your feedback or endorsement below!
        - button "★ Star Portfolio (48)" [ref=e209] [cursor=pointer]
      - generic [ref=e210]:
        - heading "✍️ Leave a Review or Endorsement" [level=4] [ref=e211]
        - generic [ref=e212]:
          - generic [ref=e213]:
            - textbox "Your Name *" [ref=e214]
            - textbox "Your Role / Company (e.g. Recruiter, Engineer)" [ref=e215]
          - generic [ref=e216]:
            - text: "Rating:"
            - combobox [ref=e217]:
              - option "⭐⭐⭐⭐⭐ (5 / 5 Stars)" [selected]
              - option "⭐⭐⭐⭐ (4 / 5 Stars)"
              - option "⭐⭐⭐ (3 / 5 Stars)"
          - textbox "Write your review, feedback, or recommendation..." [ref=e218]
          - button "Submit Review 🚀" [ref=e219] [cursor=pointer]
      - generic [ref=e220]:
        - heading "Community Reviews & Feedback" [level=5] [ref=e221]
        - generic [ref=e222]:
          - generic [ref=e223]:
            - generic [ref=e225]:
              - generic [ref=e226]:
                - heading "Mohammed Essam El Din" [level=5] [ref=e227]
                - generic "Verified Recommendation" [ref=e228]
              - generic [ref=e231]: SWE @ El Zatuna | IBM Student Ambassador @ MIU
            - generic [ref=e232]: ⭐⭐⭐⭐⭐
            - paragraph [ref=e233]: "\"I'm proud to recommend my friend and colleague, Zayd, whose dedication, knowledge, and willingness to help others truly set him apart. Throughout our time working and studying together, Zayd consistently demonstrated a strong commitment not only to his own learning but also to supporting those around him. One of Zayd's most admirable qualities is his willingness to help others.\""
            - generic [ref=e234]: 2025-07-09
          - generic [ref=e235]:
            - generic [ref=e237]:
              - generic [ref=e238]:
                - heading "Ahmed Hatem" [level=5] [ref=e239]
                - generic "Verified Recommendation" [ref=e240]
              - generic [ref=e243]: Electronics and Communication Engineering Student @MIU
            - generic [ref=e244]: ⭐⭐⭐⭐⭐
            - paragraph [ref=e245]: "\"Zayd is a hardworking and creative Computer Science student with a strong passion for software engineering. He approaches every task with focus and a problem-solving mindset. I'm confident he has a bright future ahead in tech.\""
            - generic [ref=e246]: 2025-07-09
          - generic [ref=e247]:
            - generic [ref=e249]:
              - generic [ref=e250]:
                - heading "Hazem Mohamed" [level=5] [ref=e251]
                - generic "Verified Recommendation" [ref=e252]
              - generic [ref=e255]: DevOps Engineer | 3x AWS Certified | Software Engineer
            - generic [ref=e256]: ⭐⭐⭐⭐⭐
            - paragraph [ref=e257]: "\"Zayd is a curious and motivated student who loves learning and always seeks to understand more.\""
            - generic [ref=e258]: 2025-07-01
  - contentinfo [ref=e259]:
    - generic [ref=e260]:
      - paragraph [ref=e261]: © 2026 Zayd Ali Mohamed. All rights reserved.
      - generic [ref=e262]:
        - link "Home" [ref=e263] [cursor=pointer]:
          - /url: /
        - link "Projects" [ref=e264] [cursor=pointer]:
          - /url: /projects
        - link "Experience" [ref=e265] [cursor=pointer]:
          - /url: /experience
        - button "Terminal CLI" [ref=e266] [cursor=pointer]
        - button "AI Assistant" [ref=e267] [cursor=pointer]
  - button "Toggle Ask Zayd AI Copilot" [ref=e269] [cursor=pointer]:
    - generic [ref=e274]: Ask Zayd AI
  - generic [ref=e276]:
    - button "Close" [ref=e277] [cursor=pointer]: ×
    - generic [ref=e278]:
      - generic [ref=e279]: ⭐
      - generic [ref=e280]:
        - heading "Enjoying Zayd's Portfolio?" [level=6] [ref=e281]
        - paragraph [ref=e282]: Star the repo & leave a review on the Experience page!
    - link "Leave Review & Star ↗" [ref=e284] [cursor=pointer]:
      - /url: /experience#reviews-section
  - dialog [ref=e287]:
    - button "Close details" [ref=e288] [cursor=pointer]: ×
    - paragraph [ref=e289]: Verified Online Certification
    - heading "TAQA Arabia Software Internship Certificate" [level=3] [ref=e290]
    - paragraph [ref=e291]: TAQA Arabia — Software Engineering Dept · August 2025
    - paragraph [ref=e292]: Official engineering internship certificate recognizing contribution to the In Gaz API mobile platform.
    - list [ref=e294]:
      - listitem [ref=e295]: "Issued by: TAQA Arabia — Software Engineering Dept"
      - listitem [ref=e296]: "Credential Category: Industry Experience"
      - listitem [ref=e297]: "Date: August 2025"
    - button "View TAQA Arabia Software Internship Certificate full size" [ref=e299]:
      - img "TAQA Arabia Software Internship Certificate" [ref=e300]
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