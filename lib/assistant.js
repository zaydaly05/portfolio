/**
 * Rule-based portfolio assistant. Every answer is built from the live portfolio data
 * (database content), so nothing about the owner is hard-coded here.
 */
const clip = (text, max) => {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  return value.length > max ? `${value.slice(0, max - 1).trim()}…` : value;
};

const has = (query, words) => words.some((w) => query.includes(w));

function describe(data) {
  const profile = data.profile || {};
  const name = profile.name || "the owner";
  const firstName = name.split(" ")[0];
  return { profile, name, firstName };
}

function skillsReply(data, firstName) {
  const groups = (data.technicalSkills || []).filter((g) => g && Array.isArray(g.items) && g.items.length);
  if (!groups.length) return `${firstName} has not listed technical skills yet.`;
  return (
    `${firstName} has a versatile technical skill set:\n\n` +
    groups.map((g) => `⚡ **${g.category}:** ${g.items.join(", ")}`).join("\n")
  );
}

function projectsReply(data, firstName) {
  const all = data.projects || [];
  if (!all.length) return `${firstName} has not added projects yet.`;
  const projects = all.slice(0, 12);
  return (
    `${firstName} has built **${all.length}** full-stack, mobile and enterprise projects` +
    `${all.length > projects.length ? ` (showing the first ${projects.length})` : ""}:\n\n` +
    projects
      .map((p, i) => `**${i + 1}. ${p.name}**${p.stack ? ` (${p.stack})` : ""}${p.description ? ` - ${clip(p.description, 100)}` : ""}`)
      .join("\n")
  );
}

function experienceReply(data, firstName) {
  const jobs = data.experience || [];
  if (!jobs.length) return `${firstName} has not listed experience yet.`;
  return (
    `Here is ${firstName}'s hands-on professional experience:\n\n` +
    jobs
      .map((j) => {
        const point = Array.isArray(j.points) ? j.points.slice(0, 2).map((p) => `\n• ${clip(p, 130)}`).join("") : "";
        return `🏢 **${j.company}**${j.period ? ` (${j.period})` : ""}\n${j.role || ""}${point}`;
      })
      .join("\n\n")
  );
}

function educationReply(data, firstName) {
  const edu = (data.education || [])[0];
  const clubs = (data.activities || []).map((a) => `**${a.name}**`);
  if (!edu) return `${firstName} has not listed education yet.`;
  return (
    `🎓 ${firstName} is pursuing a **${edu.degree}** at **${edu.institution}**${edu.period ? ` (${edu.period})` : ""}.` +
    (clubs.length ? `\n\nHe is also a member of ${clubs.join(" and ")}.` : "")
  );
}

function certificatesReply(data, firstName) {
  const certs = data.certificates || [];
  if (!certs.length) return `${firstName} has not listed certificates yet.`;
  return `${firstName} has completed these certifications:\n\n${certs.map((c) => `📜 **${c.title}**${c.issuer ? ` — ${c.issuer}` : ""}`).join("\n")}`;
}

function languagesReply(data, firstName) {
  const langs = (data.languages || []).filter((l) => l && l.name);
  if (!langs.length) return `${firstName} has not listed spoken languages yet.`;
  return `🗣️ ${firstName} speaks:\n\n${langs.map((l) => `${l.flag ? `${l.flag} ` : ""}**${l.name}** — ${l.level || ""}`).join("\n")}`;
}

function softSkillsReply(data, firstName) {
  const soft = (data.softSkills || []).filter((s) => s && s.title);
  if (!soft.length) return `${firstName} has not listed soft skills yet.`;
  return `🤝 ${firstName}'s working style:\n\n${soft.map((s) => `${s.icon ? `${s.icon} ` : ""}**${s.title}**${s.desc ? ` — ${clip(s.desc, 110)}` : ""}`).join("\n")}`;
}

function strengthsReply(data, firstName) {
  const stack = (data.featuredStack || []).filter((s) => s && s.name).sort((a, b) => (b.level || 0) - (a.level || 0)).slice(0, 5);
  if (!stack.length) return skillsReply(data, firstName);
  return `💪 ${firstName}'s strongest areas:\n\n${stack.map((s) => `${s.icon ? `${s.icon} ` : ""}**${s.name}**${s.level ? ` (${s.level}%)` : ""}${s.highlights ? ` — ${clip(s.highlights, 90)}` : ""}`).join("\n")}`;
}

function countsReply(data, firstName) {
  const projects = (data.projects || []).length;
  const certs = (data.certificates || []).length;
  const jobs = (data.experience || []).length;
  const skills = (data.technicalSkills || []).reduce((n, g) => n + ((g && g.items) || []).length, 0);
  return `📊 ${firstName} has **${projects}** projects, **${jobs}** internships, **${certs}** certifications and **${skills}** technical skills listed.`;
}

function cvReply(profile, firstName) {
  const link = profile.cvUrl ? `\n\n📎 [Open the latest CV (PDF)](${profile.cvUrl})` : "";
  return `📄 You can view ${firstName}'s full CV right here in the web app, or click **Download CV** in the page header.${link}`;
}

function contactReply(profile, firstName) {
  const lines = [`📬 You can reach ${firstName} directly via:\n`];
  if (profile.email) lines.push(`📧 **Email:** [${profile.email}](mailto:${profile.email})`);
  if (profile.phone) lines.push(`📱 **Phone / WhatsApp:** ${profile.phone}`);
  if (profile.linkedin) lines.push(`💼 **LinkedIn:** [${profile.linkedin.replace(/^https?:\/\//, "")}](${profile.linkedin})`);
  if (profile.github) lines.push(`💻 **GitHub:** [${profile.github.replace(/^https?:\/\//, "")}](${profile.github})`);
  return lines.join("\n");
}

/** @returns {{reply: string, suggestions: string[]}} */
function buildReply(rawQuery, data) {
  const query = String(rawQuery || "").toLowerCase().trim();
  const { profile, name, firstName } = describe(data);
  const ask = {
    stack: `What is ${firstName}'s tech stack?`,
    projects: "Show top projects",
    contact: `How to contact ${firstName}?`
  };

  if (has(query, ["hello", "hey", "who are you"]) || /\bhi\b/.test(query)) {
    return {
      reply: `Hello! I am **${firstName}'s AI Assistant**. I can tell you about ${firstName}'s skills, projects, experience, education, certifications, or help you get in touch!`,
      suggestions: [ask.stack, "Show experience", ask.projects, ask.contact]
    };
  }
  if (has(query, ["speak", "spoken", "arabic", "english", "french", "fluent", "native"])) {
    return { reply: languagesReply(data, firstName), suggestions: ["Show skills", "Show experience", `Contact ${firstName}`] };
  }
  if (has(query, ["soft skill", "teamwork", "personality", "working style"])) {
    return { reply: softSkillsReply(data, firstName), suggestions: ["Show experience", ask.projects, "Download CV"] };
  }
  if (has(query, ["strongest", "best at", "expert", "proficien", "main stack", "core stack"])) {
    return { reply: strengthsReply(data, firstName), suggestions: ["Show projects", "Show skills", "Download CV"] };
  }
  if (has(query, ["how many", "statistics", "stats"])) {
    return { reply: countsReply(data, firstName), suggestions: [ask.projects, "Show experience", "Show certifications"] };
  }
  if (has(query, ["cv", "resume", "pdf", "download"])) {
    return { reply: cvReply(profile, firstName), suggestions: ["Open CV Viewer", `Contact ${firstName}`, "Show experience"] };
  }
  if (has(query, ["skill", "stack", "language", "framework", "tool"])) {
    return { reply: skillsReply(data, firstName), suggestions: ["Show projects", "Show experience", "Download CV"] };
  }
  if (has(query, ["project", "portfolio", "built", "app"])) {
    return { reply: projectsReply(data, firstName), suggestions: ["GitHub repositories", "Show skills", `Contact ${firstName}`] };
  }
  if (has(query, ["intern", "experience", "work", "job", "career"])) {
    return { reply: experienceReply(data, firstName), suggestions: ["Show projects", "View Skills", "How to contact?"] };
  }
  if (has(query, ["education", "university", "study", "degree", "club"])) {
    return { reply: educationReply(data, firstName), suggestions: ["What projects were built?", "Skills breakdown", "Contact info"] };
  }
  if (has(query, ["certificate", "certification", "course", "training"])) {
    return { reply: certificatesReply(data, firstName), suggestions: ["Show experience", ask.stack, "Download CV"] };
  }
  if (query.includes("linkedin")) {
    const link = profile.linkedin ? `🔗 [${profile.linkedin.replace(/^https?:\/\//, "")}](${profile.linkedin})` : "";
    return { reply: `💼 **Connect with ${name} on LinkedIn:**\n\n${link}`, suggestions: [`Email ${firstName}`, "Show experience", "Download CV"] };
  }
  if (has(query, ["contact", "email", "phone", "hire", "reach", "whatsapp"])) {
    return { reply: contactReply(profile, firstName), suggestions: ["Download CV", "Ask for availability", ask.projects] };
  }
  if (has(query, ["available", "opportunity", "role", "status"])) {
    const status = profile.availability || "Available for Roles";
    return {
      reply: `🟢 **${status}** — ${firstName} is open to software engineering internships, development roles, and collaborative projects.`,
      suggestions: ["Send a message", "Download CV", "View experience"]
    };
  }

  const skills = (data.technicalSkills || []).flatMap((g) => g.items || []).slice(0, 8).join(", ");
  return {
    reply: `That's a great question! ${clip(profile.summary, 220)}${skills ? ` Key skills include ${skills}.` : ""} Feel free to ask about projects, experience, or contact details!`,
    suggestions: [ask.stack, "Show experience", ask.projects, ask.contact]
  };
}

module.exports = { buildReply };
