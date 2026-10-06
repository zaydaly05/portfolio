/**
 * Builds the CV's LaTeX source from the portfolio data (database content).
 * The preamble (fonts, margins, spacing) is fixed; only the content changes.
 */
const PREAMBLE = require("./cv-preamble");

const UNICODE_MAP = {
  "\u2018": "'",
  "\u2019": "'",
  "\u201C": "``",
  "\u201D": "''",
  "\u2013": "--",
  "\u2014": "---",
  "\u2026": "\\ldots{}",
  "\u2022": "\\textbullet{}",
  "\u00A0": "~",
  "\u2192": "$\\rightarrow$"
};

const SPECIALS = {
  "\\": "\\textbackslash{}",
  "&": "\\&",
  "%": "\\%",
  $: "\\$",
  "#": "\\#",
  _: "\\_",
  "{": "\\{",
  "}": "\\}",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
  "<": "\\textless{}",
  ">": "\\textgreater{}",
  "|": "\\textbar{}"
};

/** Escapes text for LaTeX. Characters pdfLaTeX cannot typeset (emoji, Arabic, …) are dropped. */
function esc(value) {
  let out = "";
  for (const ch of String(value ?? "").replace(/\s+/g, " ").trim()) {
    if (UNICODE_MAP[ch] !== undefined) out += UNICODE_MAP[ch];
    else if (SPECIALS[ch] !== undefined) out += SPECIALS[ch];
    else if (ch.codePointAt(0) >= 0x20 && ch.codePointAt(0) <= 0xff && ch.codePointAt(0) !== 0x7f) out += ch;
  }
  return out;
}

/** URL for \href: only `%`, `#` and `\` need care inside the argument. */
function url(value) {
  return String(value ?? "").trim().replace(/[{}\s]/g, "").replace(/\\/g, "/").replace(/%/g, "\\%").replace(/#/g, "\\#");
}

const stripProtocol = (value) => String(value ?? "").trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
const list = (value) => (Array.isArray(value) ? value : []);
const text = (value) => String(value ?? "").trim();
const bulletsOf = (item) => list(item.bullets).map(text).filter(Boolean);

function itemList(bullets, indent) {
  if (!bullets.length) return "";
  const pad = " ".repeat(indent);
  return [
    `${pad}\\resumeItemListStart`,
    ...bullets.map((b) => `${pad}  \\resumeItem{${esc(b)}}`),
    `${pad}\\resumeItemListEnd`
  ].join("\n");
}

function heading(profile) {
  const lines = [`{\\Huge \\scshape ${esc(profile.name)}} \\\\ \\vspace{1pt}`];
  if (text(profile.location)) lines.push(`${esc(profile.location)} \\\\ \\vspace{1pt}`);
  const contacts = [];
  if (text(profile.phone)) contacts.push(`\\raisebox{-0.1\\height}\\faPhone\\ ${esc(profile.phone)}`);
  if (text(profile.email)) {
    contacts.push(`\\href{mailto:${url(profile.email)}}{\\raisebox{-0.2\\height}\\faEnvelope\\ \\underline{${esc(profile.email)}}}`);
  }
  if (text(profile.linkedin)) {
    contacts.push(`\\href{${url(profile.linkedin)}}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{${esc(stripProtocol(profile.linkedin))}}}`);
  }
  if (text(profile.github)) {
    contacts.push(`\\href{${url(profile.github)}}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{${esc(stripProtocol(profile.github))}}}`);
  }
  if (contacts.length) lines.push(`\\small ${contacts.join(" ~ \n    ")}`);
  lines.push("\\vspace{-8pt}");
  return `\\begin{center}\n    ${lines.join("\n    ")}\n\\end{center}`;
}

function summarySection(summary) {
  if (!text(summary)) return "";
  return `%-----------SUMMARY-----------
\\section{Summary}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {}{}
      {\\parbox{\\textwidth}{
        ${esc(summary)}
      }}{}
  \\resumeSubHeadingListEnd`;
}

function experienceSection(items) {
  const rows = list(items).filter((i) => text(i.company));
  if (!rows.length) return "";
  const body = rows
    .map((e) => {
      const bullets = itemList(bulletsOf(e), 6);
      return `    \\resumeSubheading
      {${esc(e.company)}}{${esc(e.period)}}
      {${esc(e.role)}}{${esc(e.location)}}${bullets ? `\n${bullets}` : ""}`;
    })
    .join("\n\n");
  return `%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${body}
  \\resumeSubHeadingListEnd`;
}

function projectsSection(items) {
  const rows = list(items).filter((i) => text(i.name));
  if (!rows.length) return "";
  const body = rows
    .map((p) => {
      const stack = text(p.stack) ? ` $|$ \\emph{${esc(p.stack)}}` : "";
      const bullets = itemList(bulletsOf(p), 10);
      return `      \\resumeProjectHeading
          {\\textbf{${esc(p.name)}}${stack}}{${esc(p.date)}}${bullets ? `\n${bullets}` : ""}
          \\vspace{-13pt}`;
    })
    .join("\n\n");
  return `%-----------PROJECTS-----------
\\section{Projects}
    \\vspace{-5pt}
    \\resumeSubHeadingListStart
${body}
    \\resumeSubHeadingListEnd
\\vspace{-2pt}`;
}

function skillsSection(items) {
  const rows = list(items).filter((i) => text(i.label));
  if (!rows.length) return "";
  const lines = rows.map((s) => {
    const values = Array.isArray(s.items) ? s.items.join(", ") : text(s.items);
    return `     \\textbf{${esc(s.label)}:}{ ${esc(values)}}`;
  });
  return `%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${lines.join(" \\\\\n")}
    }}
 \\end{itemize}
 \\vspace{-16pt}`;
}

function bulletSection(title, comment, items) {
  const rows = list(items).map((i) => text(i.text)).filter(Boolean);
  if (!rows.length) return "";
  return `%-----------${comment}-----------
\\section{${title}}
${itemList(rows, 2)}`;
}

function educationSection(items) {
  const rows = list(items).filter((i) => text(i.institution));
  if (!rows.length) return "";
  const body = rows
    .map(
      (e) => `    \\resumeSubheading
      {${esc(e.institution)}}{${esc(e.period)}}
      {${esc(e.degree)}}{${esc(e.location)}}`
    )
    .join("\n\n");
  return `%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${body}
  \\resumeSubHeadingListEnd`;
}

/**
 * @param {object} data portfolio content: profile + cvSummary, cvExperience, cvProjects, cvSkills,
 *                      cvSoftSkills, cvEducation, cvLanguages
 * @returns {string} complete .tex document
 */
function renderCvTex(data) {
  const profile = data.profile || {};
  const parts = [
    heading(profile),
    summarySection((data.cvSummary || {}).summary),
    experienceSection(data.cvExperience),
    projectsSection(data.cvProjects),
    skillsSection(data.cvSkills),
    bulletSection("Soft Skills", "SOFT SKILLS", data.cvSoftSkills),
    educationSection(data.cvEducation),
    bulletSection("Languages", "LANGUAGES", data.cvLanguages)
  ].filter(Boolean);

  return `${PREAMBLE}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
${parts[0]}

${parts.slice(1).join("\n\n")}

\\end{document}
`;
}

/** Sections of the portfolio data that change the CV. */
const CV_SECTIONS = ["cvSummary", "cvExperience", "cvProjects", "cvSkills", "cvSoftSkills", "cvEducation", "cvLanguages", "profile"];

module.exports = { renderCvTex, esc, url, CV_SECTIONS };
