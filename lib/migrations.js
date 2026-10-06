/**
 * One-time content patches for data that already lives in the database.
 *
 * The owner edits content from the app, so stored sections can differ from the built-in defaults and
 * must never be replaced wholesale. Each migration makes one small, additive change (and does nothing
 * if the change is already there). Applied ids are remembered, so a patch never re-adds something the
 * owner later removes on purpose.
 */
const WE_LETTER = "https://res.cloudinary.com/delnnzcph/image/upload/v1791137221/Experience_Letter_WE.png";

const isWe = (e) => /^WE\b/i.test(String((e && e.company) || ""));
const mentionsWeLetter = (c) => [c && c.image, c && c.pdf].some((u) => String(u || "").includes("Experience_Letter_WE"));

const CERT_TITLES = require("./cert-titles");

module.exports = [
  {
    id: "2026-10-we-letter-experience",
    section: "experience",
    /** Adds the WE experience letter to the WE card when it has no media yet. */
    apply(data) {
      if (!Array.isArray(data)) return null;
      const we = data.find(isWe);
      if (!we || (Array.isArray(we.media) && we.media.length)) return null;
      we.media = [{ src: WE_LETTER, alt: "WE (Telecom Egypt) — Experience Letter (Android Development, 2026)" }];
      if (!we.mediaBadge) we.mediaBadge = "📜 Experience Letter";
      return data;
    }
  },
  {
    id: "2026-10-we-letter-certificates",
    section: "certificates",
    /** Adds the WE experience letter card (first, it is the most recent) unless it is already listed. */
    apply(data) {
      if (!Array.isArray(data) || data.some(mentionsWeLetter)) return null;
      data.unshift({
        title: "WE (Telecom Egypt) Experience Letter",
        issuer: "WE (Telecom Egypt) — Android Development",
        date: "July 2026",
        category: "Experience Letter",
        image: WE_LETTER,
        pdf: WE_LETTER,
        desc: "Official experience letter confirming the Android development internship at Telecom Egypt (WE): Kotlin, Jetpack Compose, MVVM, Retrofit, Room and Hilt.",
        kind: "letter"
      });
      return data;
    }
  },
  {
    id: "2026-10-merge-same-title-docs",
    section: "certificates",
    /** Gives a certificate and its letter the same title so they show as one block (edits elsewhere untouched). */
    apply(data) {
      if (!Array.isArray(data)) return null;
      let changed = false;
      data.forEach((c) => {
        if (c && CERT_TITLES[c.title]) {
          c.title = CERT_TITLES[c.title];
          changed = true;
        }
      });
      return changed ? data : null;
    }
  },
  {
    id: "2026-10-lines-of-code-stat",
    section: "stats",
    /** Replaces the "Public GitHub Repositories" block with the lines-of-code counter. */
    apply(data) {
      if (!Array.isArray(data)) return null;
      const i = data.findIndex((s) => s && s.source === "github_repos");
      if (i === -1 || data.some((s) => s && s.source === "lines_of_code")) return null;
      data[i] = { icon: "⌨️", label: "Lines of Code Written", source: "lines_of_code", value: 0, suffix: data[i].suffix === undefined ? "+" : data[i].suffix };
      return data;
    }
  },
  {
    id: "2026-10-technologies-commits-stats",
    section: "stats",
    /** "Technical Skill Categories" becomes "Technologies Used"; "Verified Certifications" becomes "Commits Made". */
    apply(data) {
      if (!Array.isArray(data)) return null;
      let changed = false;
      const swap = (from, to) => {
        const i = data.findIndex((s) => s && s.source === from);
        if (i === -1 || data.some((s) => s && s.source === to.source)) return;
        data[i] = { ...to, suffix: data[i].suffix === undefined ? "+" : data[i].suffix };
        changed = true;
      };
      swap("skill_categories", { icon: "🛠️", label: "Technologies Used", source: "technologies", value: 0 });
      swap("certificates", { icon: "🔀", label: "Commits Made", source: "commits", value: 0 });
      return changed ? data : null;
    }
  }
];
