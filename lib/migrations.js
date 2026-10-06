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
  }
];
