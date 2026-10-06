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
  const projects = (data.projects || []).slice(0, 6);
  if (!projects.length) return `${firstName} has not added projects yet.`;
  const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
  return (
    `${firstName} has built several full-stack and mobile projects:\n\n` +
    projects
      .map((p, i) => `${numbers[i]} **${p.name}**${p.stack ? ` (${p.stack})` : ""}${p.description ? ` - ${clip(p.description, 110)}` : ""}`)
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
        const point = Array.isArray(j.points) && j.points[0] ? `\n${clip(j.points[0], 140)}` : "";
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
  if (has(query, ["cv", "resume", "pdf"])) {
    return {
      reply: `📄 You can view ${firstName}'s full CV right here in the web app or click **Download CV** in the page header!`,
      suggestions: ["Open CV Viewer", `Contact ${firstName}`, "Show experience"]
    };
  }

  const skills = (data.technicalSkills || []).flatMap((g) => g.items || []).slice(0, 8).join(", ");
  return {
    reply: `That's a great question! ${clip(profile.summary, 220)}${skills ? ` Key skills include ${skills}.` : ""} Feel free to ask about projects, experience, or contact details!`,
    suggestions: [ask.stack, "Show experience", ask.projects, ask.contact]
  };
}

module.exports = { buildReply };
