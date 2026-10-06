/**
 * Contacts vault: a protected copy of the owner's phone contacts.
 *
 * Designed so contacts cannot be lost or silently changed:
 *  - there is no hard delete: "delete" moves a contact to the trash and it can always be restored;
 *  - every edit keeps the previous values in the contact's history;
 *  - the whole list can be exported as CSV at any time (backup / import into Kapso).
 */
const MAX_HISTORY = 20;

/** Digits-only international number ("201017741741"), or null if it does not look like a phone number. */
function normalizePhone(input, defaultCountryCode = "20") {
  const raw = String(input ?? "").trim();
  if (!raw) return null;
  const international = raw.startsWith("+") || raw.replace(/\s/g, "").startsWith("00");
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (international) {
    digits = digits.replace(/^00/, "");
  } else if (digits.startsWith("0")) {
    digits = defaultCountryCode + digits.replace(/^0+/, "");
  } else if (digits.length <= 10) {
    digits = defaultCountryCode + digits;
  }
  return digits.length >= 9 && digits.length <= 15 ? digits : null;
}

const PHONE_TOKEN = /\+?\(?\d[\d\s().-]{6,}\d/g;

/**
 * Reads contacts out of pasted text: one per line ("Name, 0101…"), several numbers per line,
 * or a vCard (.vcf) export. Returns the valid contacts and the pieces that were not understood.
 */
function parseImport(text, defaultCountryCode = "20") {
  const contacts = [];
  const invalid = [];
  const seen = new Set();
  const add = (phoneRaw, name) => {
    const phone = normalizePhone(phoneRaw, defaultCountryCode);
    if (!phone) return invalid.push(String(phoneRaw).trim().slice(0, 40));
    if (seen.has(phone)) return null;
    seen.add(phone);
    contacts.push({ phone, name: String(name || "").trim().slice(0, 100) });
    return null;
  };
  const source = String(text || "");

  if (/BEGIN:VCARD/i.test(source)) {
    for (const card of source.split(/BEGIN:VCARD/i).slice(1)) {
      const name = (card.match(/^FN[^:]*:(.*)$/im) || [])[1] || "";
      for (const tel of card.matchAll(/^TEL[^:]*:(.*)$/gim)) add(tel[1], name.trim());
    }
    return { contacts, invalid };
  }

  for (const line of source.split(/\r?\n/)) {
    const tokens = line.match(PHONE_TOKEN);
    if (!tokens) continue;
    const name = tokens.length === 1 ? line.replace(tokens[0], " ").replace(/[,;|\t"]+/g, " ").replace(/\s+/g, " ").trim() : "";
    tokens.forEach((token) => add(token, name));
  }
  return { contacts, invalid };
}

const csvCell = (value) => {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text) && !/^\+\d+$/.test(text)) text = `'${text}`; // spreadsheet formula injection
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function toCsv(contacts) {
  const rows = [["name", "phone_e164", "phone_digits", "notes"]];
  contacts.forEach((c) => rows.push([c.name, `+${c.phone}`, c.phone, c.notes]));
  return `${rows.map((r) => r.map(csvCell).join(",")).join("\n")}\n`;
}

/** Database storage with an in-memory fallback (so everything also works without a database). */
function createContactStore({ connectDB, models }) {
  const memory = new Map();
  let nextId = 1;
  const database = async () => {
    try {
      return models ? await connectDB() : null;
    } catch {
      return null;
    }
  };
  const plain = (doc) => (doc ? JSON.parse(JSON.stringify({ ...doc, id: String(doc._id || doc.id) })) : null);

  return {
    async findByPhone(phone) {
      if (await database()) return plain(await models.PhoneContact.findOne({ phone }).lean());
      return plain(memory.get(phone) || null);
    },
    async findById(id) {
      if (await database()) {
        return /^[a-f0-9]{24}$/i.test(String(id)) ? plain(await models.PhoneContact.findById(id).lean()) : null;
      }
      return plain([...memory.values()].find((c) => String(c.id) === String(id)) || null);
    },
    async insert(doc) {
      const record = { ...doc, createdAt: new Date(), updatedAt: new Date(), history: doc.history || [] };
      if (await database()) {
        const created = await models.PhoneContact.create(record);
        return plain(created.toObject ? created.toObject() : created);
      }
      record.id = String(nextId++);
      memory.set(record.phone, record);
      return plain(record);
    },
    async update(id, patch, historyEntry) {
      const fields = { ...patch, updatedAt: new Date() };
      if (await database()) {
        return plain(
          await models.PhoneContact.findByIdAndUpdate(
            id,
            { $set: fields, ...(historyEntry ? { $push: { history: { $each: [historyEntry], $slice: -MAX_HISTORY } } } : {}) },
            { new: true }
          ).lean()
        );
      }
      const record = [...memory.values()].find((c) => String(c.id) === String(id));
      if (!record) return null;
      if (fields.phone && fields.phone !== record.phone) {
        memory.delete(record.phone);
        memory.set(fields.phone, record);
      }
      Object.assign(record, fields);
      if (historyEntry) record.history = [...record.history, historyEntry].slice(-MAX_HISTORY);
      return plain(record);
    },
    async list(status) {
      const filter = status && status !== "all" ? { status } : {};
      if (await database()) return (await models.PhoneContact.find(filter).sort({ name: 1, phone: 1 }).limit(5000).lean()).map(plain);
      return [...memory.values()]
        .filter((c) => !filter.status || c.status === filter.status)
        .sort((a, b) => (a.name || "").localeCompare(b.name || "") || a.phone.localeCompare(b.phone))
        .map(plain);
    }
  };
}

function createContactVault({ store, defaultCountryCode = "20" }) {
  const entry = (action, by, before) => ({ at: new Date(), action, by, ...(before ? { before } : {}) });
  const snapshot = (c) => ({ name: c.name, phone: c.phone, notes: c.notes, status: c.status });
  const clean = (value, max) => String(value ?? "").trim().slice(0, max);

  async function add({ phone, name, notes }, by = "app") {
    const normalized = normalizePhone(phone, defaultCountryCode);
    if (!normalized) return { ok: false, error: "That does not look like a phone number." };
    const existing = await store.findByPhone(normalized);
    if (existing) {
      if (existing.status === "trashed") {
        const restored = await store.update(existing.id, { status: "active", trashedAt: null }, entry("restored", by, snapshot(existing)));
        return { ok: true, contact: restored, restored: true };
      }
      return { ok: false, error: "That number is already in your contacts.", contact: existing, duplicate: true };
    }
    const contact = await store.insert({
      phone: normalized,
      name: clean(name, 100),
      notes: clean(notes, 300),
      source: by,
      status: "active",
      history: [entry("created", by)]
    });
    return { ok: true, contact };
  }

  async function importText(text, by = "import") {
    const { contacts, invalid } = parseImport(text, defaultCountryCode);
    const result = { added: 0, restored: 0, duplicates: 0, invalid, numbers: [] };
    for (const item of contacts) {
      const res = await add(item, by);
      if (res.ok && res.restored) result.restored += 1;
      else if (res.ok) result.added += 1;
      else result.duplicates += 1;
      if (res.ok) result.numbers.push(item.phone);
    }
    return result;
  }

  async function edit(id, { name, notes, phone }, by = "app") {
    const existing = await store.findById(id);
    if (!existing) return { ok: false, error: "Contact not found." };
    const patch = {};
    if (name !== undefined) patch.name = clean(name, 100);
    if (notes !== undefined) patch.notes = clean(notes, 300);
    if (phone !== undefined && phone !== "") {
      const normalized = normalizePhone(phone, defaultCountryCode);
      if (!normalized) return { ok: false, error: "That does not look like a phone number." };
      if (normalized !== existing.phone) {
        if (await store.findByPhone(normalized)) return { ok: false, error: "Another contact already has that number." };
        patch.phone = normalized;
      }
    }
    if (!Object.keys(patch).length) return { ok: true, contact: existing };
    return { ok: true, contact: await store.update(id, patch, entry("edited", by, snapshot(existing))) };
  }

  /** "Delete" = move to the trash. Nothing is ever removed for good. */
  async function trash(id, by = "app") {
    const existing = await store.findById(id);
    if (!existing) return { ok: false, error: "Contact not found." };
    if (existing.status === "trashed") return { ok: true, contact: existing };
    return { ok: true, contact: await store.update(id, { status: "trashed", trashedAt: new Date() }, entry("trashed", by, snapshot(existing))) };
  }

  async function restore(id, by = "app") {
    const existing = await store.findById(id);
    if (!existing) return { ok: false, error: "Contact not found." };
    if (existing.status === "active") return { ok: true, contact: existing };
    return { ok: true, contact: await store.update(id, { status: "active", trashedAt: null }, entry("restored", by, snapshot(existing))) };
  }

  async function list({ status = "active", q = "" } = {}) {
    const all = await store.list("all");
    const needle = String(q || "").toLowerCase().replace(/\s+/g, " ").trim();
    const digits = needle.replace(/\D/g, "");
    const contacts = all
      .filter((c) => status === "all" || c.status === status)
      .filter((c) => !needle || (c.name || "").toLowerCase().includes(needle) || (digits.length >= 3 && c.phone.includes(digits)) || (c.notes || "").toLowerCase().includes(needle));
    return {
      contacts,
      counts: { active: all.filter((c) => c.status === "active").length, trashed: all.filter((c) => c.status === "trashed").length }
    };
  }

  async function exportCsv(status = "active") {
    const { contacts } = await list({ status });
    return { csv: toCsv(contacts), count: contacts.length };
  }

  /** Active contacts as plain { phone, name } (used by the WhatsApp owner commands). */
  async function activeContacts() {
    return (await list({ status: "active" })).contacts.map((c) => ({ phone: c.phone, name: c.name }));
  }

  return { add, importText, edit, trash, restore, list, exportCsv, activeContacts, store };
}

module.exports = { normalizePhone, parseImport, toCsv, createContactStore, createContactVault };
