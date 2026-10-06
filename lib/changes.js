/**
 * Automatic changes that wait for the owner's decision.
 *
 * A "change" is a proposal such as "add these new GitHub repositories to the portfolio and the CV".
 * The owner approves, rejects or modifies it from WhatsApp or from the admin app; only an approval
 * changes the portfolio. Edits the owner makes directly in the app are not proposals and apply at once.
 */
const crypto = require("crypto");
const { repoSlugFromUrl, repoToProject, newRepos } = require("./github");

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const EDITABLE_FIELDS = { name: "name", period: "period", date: "period", stack: "stack", description: "description", desc: "description" };
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const newCode = () => Array.from(crypto.randomBytes(4), (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");

/** "September 2026" -> "Sep 2026" (the CV's date style); anything else is left alone. */
function shortPeriod(period) {
  const match = String(period || "").match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{4})$/);
  if (!match) return String(period || "");
  const month = MONTHS_SHORT.find((m) => m.toLowerCase() === match[1].toLowerCase());
  return month ? `${month} ${match[2]}` : String(period);
}

/** The CV entry that goes with a portfolio project. */
const cvEntryFor = (project) => ({
  name: project.name,
  stack: project.stack || "",
  date: shortPeriod(project.period),
  bullets: project.description ? [project.description] : []
});

/** Storage with an in-memory fallback so everything also works without a database. */
function createChangeStore({ connectDB, models }) {
  const memory = [];
  const database = async () => {
    try {
      return models ? await connectDB() : null;
    } catch {
      return null;
    }
  };
  const plain = (doc) => (doc ? JSON.parse(JSON.stringify({ ...doc, id: String(doc._id || doc.id || doc.code) })) : null);

  return {
    async create(doc) {
      const record = { ...doc, createdAt: new Date(), updatedAt: new Date() };
      if (await database()) {
        const created = await models.PendingChange.create(record);
        return plain(created.toObject ? created.toObject() : created);
      }
      memory.push(record);
      return plain(record);
    },
    async list(status) {
      const filter = status && status !== "all" ? { status } : {};
      if (await database()) {
        const docs = await models.PendingChange.find(filter).sort({ createdAt: -1 }).limit(100).lean();
        return docs.map(plain);
      }
      return memory
        .filter((c) => !filter.status || c.status === filter.status)
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(plain);
    },
    async get(idOrCode) {
      const key = String(idOrCode || "");
      if (await database()) {
        const byCode = await models.PendingChange.findOne({ code: key.toUpperCase() }).lean();
        if (byCode) return plain(byCode);
        if (/^[a-f0-9]{24}$/i.test(key)) return plain(await models.PendingChange.findById(key).lean());
        return null;
      }
      return plain(memory.find((c) => c.code === key.toUpperCase()) || null);
    },
    async update(code, patch) {
      const fields = { ...patch, updatedAt: new Date() };
      if (await database()) {
        return plain(await models.PendingChange.findOneAndUpdate({ code }, { $set: fields }, { new: true }).lean());
      }
      const record = memory.find((c) => c.code === code);
      if (record) Object.assign(record, fields);
      return plain(record || null);
    }
  };
}

const CODE = "[ABCDEFGHJKMNPQRSTUVWXYZ2-9]{4}";

/**
 * Parses an owner's reply such as "1", "approve K7Q2", "3", "2 name: X; stack: Y".
 * A code is only recognised right after the answer ("1 K7Q2") or right before it ("K7Q2 1"), so
 * field names such as "name:" in an edit are never mistaken for one.
 */
function parseReply(text) {
  let raw = String(text || "").trim();
  if (!raw) return null;

  let code = null;
  const leading = raw.match(new RegExp(`^(${CODE})\\s+(?=\\S)`, "i"));
  if (leading && /^(1|2|3|approve|reject|modify|edit|yes|no|cancel)\b/i.test(raw.slice(leading[0].length))) {
    code = leading[1].toUpperCase();
    raw = raw.slice(leading[0].length);
  }

  const intentMatch = raw.match(/^(status|list|pending|approve|approved|yes|reject|rejected|no|cancel|modify|edit|1|2|3)(?![A-Za-z0-9])[\s:,-]*([\s\S]*)$/i);
  if (!intentMatch) return null;
  const word = intentMatch[1].toLowerCase();
  let rest = intentMatch[2].trim();

  if (!code) {
    const trailing = rest.match(new RegExp(`^(${CODE})(?![A-Za-z0-9:=])\\s*`, "i"));
    if (trailing) {
      code = trailing[1].toUpperCase();
      rest = rest.slice(trailing[0].length);
    }
  }

  if (["status", "list", "pending"].includes(word)) return { intent: "status", code };
  if (["1", "approve", "approved", "yes"].includes(word)) return { intent: "approve", code };
  if (["3", "reject", "rejected", "no", "cancel"].includes(word)) return { intent: "reject", code };
  return { intent: "modify", code, rest };
}

/** "project 2 name: X; stack: Y" -> { index: 1, fields: { name: "X", stack: "Y" } } */
function parseEdits(rest) {
  let text = String(rest || "").trim();
  let index = 0;
  const projectMatch = text.match(/^project\s+(\d+)\s*[:,-]?\s*/i);
  if (projectMatch) {
    index = Math.max(0, Number(projectMatch[1]) - 1);
    text = text.slice(projectMatch[0].length);
  }
  const fields = {};
  for (const part of text.split(/;|\n/)) {
    const m = part.match(/^\s*([a-z]+)\s*[:=]\s*([\s\S]+?)\s*$/i);
    if (!m) continue;
    const field = EDITABLE_FIELDS[m[1].toLowerCase()];
    if (field) fields[field] = m[2].slice(0, 600);
  }
  return { index, fields };
}

const projectLine = (p, i) => `${i + 1}. *${p.name}*${p.stack ? ` (${p.stack})` : ""}${p.period ? ` · ${p.period}` : ""}${p.description ? `\n   ${String(p.description).slice(0, 160)}` : ""}`;

function describe(change) {
  const projects = (change.payload && change.payload.projects) || [];
  return projects.map(projectLine).join("\n");
}

/**
 * @param {object} deps
 * @param {object} deps.store createChangeStore(...)
 * @param {Function} deps.apply async (change) => void   applies an approved change (throws on failure)
 * @param {object} [deps.whatsapp] lib/whatsapp.js instance
 */
function createChangeService({ store, apply, whatsapp }) {
  const say = async (text) => (whatsapp ? whatsapp.sendText(text) : { sent: false, reason: "no WhatsApp" });

  async function uniqueCode() {
    for (let i = 0; i < 10; i += 1) {
      const code = newCode();
      if (!(await store.get(code))) return code;
    }
    throw new Error("Could not allocate a change code.");
  }

  /** Asks the owner (WhatsApp) about a pending change. */
  async function announce(change) {
    if (!whatsapp) return { sent: false, reason: "no WhatsApp" };
    const body = describe(change);
    const longText =
      `🔔 *Portfolio change ${change.code}*\n\n${change.summary}\n\n${body}\n\n` +
      `Reply:\n1️⃣ *1* — approve (adds it to your portfolio and CV)\n2️⃣ *2 name: …; stack: …; description: …* — modify, then I ask again\n3️⃣ *3* — reject`;
    return whatsapp.sendApprovalRequest({ code: change.code, summary: `${change.summary} ${body.replace(/\n\s*/g, " ")}`.slice(0, 700), longText });
  }

  /** Proposes adding GitHub repositories that are not in the portfolio (nor already decided on). */
  async function proposeNewProjects({ repos, projects }) {
    const decided = new Set();
    for (const c of await store.list("all")) {
      if (c.status !== "failed") (c.repos || []).forEach((r) => decided.add(String(r).toLowerCase()));
    }
    const fresh = newRepos(repos, projects)
      .filter((r) => r.description || (r.topics || []).length)
      .filter((r) => !decided.has(String(r.name).toLowerCase()));
    if (!fresh.length) return { created: null, checked: repos.length };

    const entries = fresh.map(repoToProject);
    const change = await store.create({
      code: await uniqueCode(),
      type: "add_projects",
      status: "pending",
      source: "github",
      summary: `${fresh.length} new GitHub project${fresh.length === 1 ? "" : "s"} found.`,
      repos: fresh.map((r) => r.name),
      payload: { projects: entries, cvProjects: entries.map(cvEntryFor) }
    });
    const delivery = await announce(change);
    return { created: change, checked: repos.length, notified: delivery.sent, notifyError: delivery.reason || null };
  }

  async function approve(idOrCode, by) {
    const change = await store.get(idOrCode);
    if (!change) return { ok: false, error: "Change not found." };
    if (change.status === "applied") return { ok: true, change, already: true };
    if (change.status === "rejected") return { ok: false, error: "That change was already rejected." };
    try {
      await apply(change);
    } catch (err) {
      const failed = await store.update(change.code, { status: "failed", error: String(err.message || err).slice(0, 500), decidedBy: by, decidedAt: new Date() });
      return { ok: false, error: err.message || String(err), change: failed };
    }
    const applied = await store.update(change.code, { status: "applied", decidedBy: by, decidedAt: new Date(), error: null });
    return { ok: true, change: applied };
  }

  async function reject(idOrCode, by) {
    const change = await store.get(idOrCode);
    if (!change) return { ok: false, error: "Change not found." };
    if (change.status === "applied") return { ok: false, error: "That change was already applied." };
    const rejected = await store.update(change.code, { status: "rejected", decidedBy: by, decidedAt: new Date() });
    return { ok: true, change: rejected };
  }

  /** Edits fields of one proposed project (and its CV entry). The change stays pending. */
  async function modify(idOrCode, { index = 0, fields }) {
    const change = await store.get(idOrCode);
    if (!change) return { ok: false, error: "Change not found." };
    if (change.status !== "pending") return { ok: false, error: `That change is already ${change.status}.` };
    const payload = JSON.parse(JSON.stringify(change.payload || {}));
    const project = (payload.projects || [])[index];
    if (!project) return { ok: false, error: `There is no project ${index + 1} in that change.` };
    const applied = Object.keys(fields || {}).filter((k) => ["name", "period", "stack", "description"].includes(k));
    if (!applied.length) return { ok: false, error: "Nothing to change. Use name, period, stack or description." };
    applied.forEach((k) => {
      project[k] = String(fields[k]).trim();
    });
    payload.cvProjects[index] = cvEntryFor(project);
    const updated = await store.update(change.code, { payload });
    return { ok: true, change: updated, edited: applied };
  }

  /** Handles a WhatsApp message from the owner. Returns the reply text, or null if it is not about a change. */
  async function handleOwnerReply(text) {
    const parsed = parseReply(text);
    if (!parsed) return null;

    const pending = await store.list("pending");
    if (parsed.intent === "status") {
      if (!pending.length) return "✅ Nothing is waiting for your decision.";
      return pending.map((c) => `🔔 *${c.code}* — ${c.summary}`).join("\n");
    }
    if (!parsed.code && pending.length > 1) {
      return `More than one change is waiting. Add the code to your answer, e.g. *${parsed.intent === "reject" ? "3" : "1"} ${pending[0].code}*:\n${pending.map((c) => `🔔 *${c.code}* — ${c.summary}`).join("\n")}`;
    }
    const target = parsed.code ? await store.get(parsed.code) : pending[0] || null;
    if (!target || target.status !== "pending") {
      return pending.length || parsed.code ? "I could not find a pending change with that code. Reply *status* to list them." : null;
    }

    if (parsed.intent === "approve") {
      const result = await approve(target.code, "whatsapp");
      return result.ok
        ? `✅ *${target.code} approved.* Your portfolio is updated and the CV is being rebuilt — I will send the new PDF when it is ready.`
        : `⚠️ Could not apply ${target.code}: ${result.error}`;
    }
    if (parsed.intent === "reject") {
      const result = await reject(target.code, "whatsapp");
      return result.ok ? `🔴 *${target.code} rejected.* Nothing was changed.` : `⚠️ ${result.error}`;
    }
    const edits = parseEdits(parsed.rest);
    const result = await modify(target.code, edits);
    if (!result.ok) {
      return `${result.error}\nExample: *2 name: My App; stack: Dart, Flutter; description: A short text*`;
    }
    return `✏️ Updated (${result.edited.join(", ")}).\n\n${describe(result.change)}\n\nReply *1* to approve, *2 …* to edit more, or *3* to reject.`;
  }

  return { store, proposeNewProjects, approve, reject, modify, handleOwnerReply, announce };
}

module.exports = { createChangeStore, createChangeService, parseReply, parseEdits, shortPeriod, cvEntryFor, repoSlugFromUrl };
