/**
 * Derives the CV's content sections from the portfolio's own sections (experience, projects,
 * technicalSkills), keeping the CV to one page. Used for the "update CV from portfolio" action.
 */
const list = (v) => (Array.isArray(v) ? v : []);
const text = (v) => String(v ?? "").replace(/\s+/g, " ").trim();

const DANGLING = /\s+(a|an|the|and|or|of|with|in|on|for|to|by|from|as|at|into|its|their|that|which)$/i;

/** `value` shortened to at most `max` characters, cut at a sentence or clause end, never mid-phrase. */
function shorten(value, max) {
  const s = text(value);
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "), cut.lastIndexOf(", "));
  let out = stop > max * 0.45 ? cut.slice(0, stop) : cut.slice(0, cut.lastIndexOf(" "));
  out = out.replace(/[,;:\s.]+$/, "");
  while (DANGLING.test(out)) out = out.replace(DANGLING, "");
  return `${out}.`;
}

const toPeriod = (v) => text(v).replace(/\s+-\s+/g, " – ");

function cvExperienceFrom(experience) {
  return list(experience)
    .filter((e) => text(e.company))
    .map((e) => ({
      company: text(e.company),
      role: text(e.role),
      period: toPeriod(e.period),
      location: text(e.location),
      bullets: list(e.points).map((p) => shorten(p, 170)).filter(Boolean).slice(0, 2)
    }));
}

function cvProjectsFrom(projects) {
  return list(projects)
    .filter((p) => text(p.name))
    .map((p) => ({
      name: text(p.name),
      stack: text(p.stack),
      date: text(p.period),
      bullets: [shorten(p.description, 190)].filter(Boolean)
    }));
}

function cvSkillsFrom(technicalSkills) {
  return list(technicalSkills)
    .filter((s) => text(s.category) && list(s.items).length)
    .map((s) => ({ label: text(s.category), items: list(s.items).map(text).filter(Boolean).join(", ") }));
}

/**
 * @param {object} data portfolio content (experience, projects, technicalSkills)
 * @returns {{cvExperience: object[], cvProjects: object[], cvSkills: object[]}}
 */
function buildCvSections(data) {
  return {
    cvExperience: cvExperienceFrom(data.experience),
    cvProjects: cvProjectsFrom(data.projects),
    cvSkills: cvSkillsFrom(data.technicalSkills)
  };
}

module.exports = { buildCvSections, shorten };
