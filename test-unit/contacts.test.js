const test = require("node:test");
const assert = require("node:assert/strict");

const { normalizePhone, parseImport, toCsv, createContactStore, createContactVault } = require("../lib/contacts");

const newVault = () => createContactVault({ store: createContactStore({ connectDB: async () => null, models: null }), defaultCountryCode: "20" });

test("phone numbers are normalised to one international form", () => {
  for (const same of ["01017741741", "+201017741741", "201017741741", "+20 101 774 1741", "0020 101 774 1741", "(010) 1774-1741", "1017741741"]) {
    assert.equal(normalizePhone(same), "201017741741", same);
  }
  assert.equal(normalizePhone("+1 (415) 555-2671"), "14155552671");
  assert.equal(normalizePhone("+44 7911 123456"), "447911123456");
  assert.equal(normalizePhone("0101", "20"), null); // too short
  assert.equal(normalizePhone("abc"), null);
  assert.equal(normalizePhone(""), null);
  assert.equal(normalizePhone("+1234567890123456789"), null); // too long
  assert.equal(normalizePhone("0101 774 1741", "966"), "9661017741741"); // other default country
});

test("import: lines with names, several numbers per line, duplicates and junk", () => {
  const text = `name,phone
Sara Ali, 0100 000 0001
Omar;+20 111 222 3333
0122 333 4444 , 0155 666 7777
Sara Ali again, 01000000001
just words here
12`;
  const { contacts, invalid } = parseImport(text);
  assert.deepEqual(contacts.map((c) => [c.name, c.phone]), [
    ["Sara Ali", "201000000001"],
    ["Omar", "201112223333"],
    ["", "201223334444"],
    ["", "201556667777"]
  ]);
  assert.deepEqual(invalid, []);
});

test("import: vCard export from a phone", () => {
  const vcf = `BEGIN:VCARD
VERSION:3.0
FN:Dr. Naglaa
TEL;TYPE=CELL:+20 100 111 2222
TEL;TYPE=HOME:0233334444
END:VCARD
BEGIN:VCARD
FN:No Phone
EMAIL:x@y.z
END:VCARD
BEGIN:VCARD
FN:Mina
TEL:+1 (415) 555-2671
END:VCARD`;
  const { contacts } = parseImport(vcf);
  assert.deepEqual(contacts.map((c) => [c.name, c.phone]), [
    ["Dr. Naglaa", "201001112222"],
    ["Dr. Naglaa", "20233334444"],
    ["Mina", "14155552671"]
  ]);
});

test("vault: add, duplicates, edit with history, trash and restore (never a hard delete)", async () => {
  const vault = newVault();
  const added = await vault.add({ phone: "0101 774 1741", name: "Zayd", notes: "me" }, "app");
  assert.equal(added.ok, true);
  assert.equal(added.contact.phone, "201017741741");
  const id = added.contact.id;

  const dup = await vault.add({ phone: "+201017741741", name: "Other" });
  assert.equal(dup.ok, false);
  assert.equal(dup.duplicate, true);
  assert.equal((await vault.add({ phone: "nope" })).ok, false);

  const edited = await vault.edit(id, { name: "Zayd Ali", notes: "updated" }, "app");
  assert.equal(edited.contact.name, "Zayd Ali");
  assert.equal(edited.contact.history.at(-1).action, "edited");
  assert.equal(edited.contact.history.at(-1).before.name, "Zayd"); // the old value is never lost

  const second = (await vault.add({ phone: "01000000001", name: "Sara" })).contact;
  assert.equal((await vault.edit(second.id, { phone: "01017741741" })).ok, false); // would collide
  assert.equal((await vault.edit("999", { name: "x" })).ok, false);

  const trashed = await vault.trash(id, "app");
  assert.equal(trashed.contact.status, "trashed");
  assert.deepEqual((await vault.list()).counts, { active: 1, trashed: 1 });
  assert.equal((await vault.list({ status: "active" })).contacts.length, 1);
  assert.equal((await vault.list({ status: "trashed" })).contacts[0].name, "Zayd Ali");

  // adding the same number again brings it back instead of creating a copy
  const again = await vault.add({ phone: "01017741741", name: "ignored" });
  assert.equal(again.restored, true);
  assert.equal(again.contact.name, "Zayd Ali");
  assert.equal(again.contact.history.map((h) => h.action).join(), "created,edited,trashed,restored");

  await vault.trash(second.id);
  assert.equal((await vault.restore(second.id)).contact.status, "active");
  assert.equal((await vault.restore("999")).ok, false);
});

test("vault: bulk import reports what happened and restores trashed numbers", async () => {
  const vault = newVault();
  await vault.add({ phone: "01000000001", name: "A" });
  const b = (await vault.add({ phone: "01000000002", name: "B" })).contact;
  await vault.trash(b.id);
  const result = await vault.importText("A, 01000000001\nB, 01000000002\nC, 01000000003\nbad, 12");
  assert.equal(result.added, 1);
  assert.equal(result.restored, 1);
  assert.equal(result.duplicates, 1);
  assert.equal((await vault.list()).counts.active, 3);
});

test("vault: search by name, number and notes; history is capped", async () => {
  const vault = newVault();
  await vault.add({ phone: "01000000001", name: "Sara Ali", notes: "client" });
  await vault.add({ phone: "01111111111", name: "Omar" });
  assert.deepEqual((await vault.list({ q: "sara" })).contacts.map((c) => c.name), ["Sara Ali"]);
  assert.deepEqual((await vault.list({ q: "111111" })).contacts.map((c) => c.name), ["Omar"]);
  assert.deepEqual((await vault.list({ q: "client" })).contacts.map((c) => c.name), ["Sara Ali"]);
  assert.equal((await vault.list({ q: "zzz" })).contacts.length, 0);

  const c = (await vault.add({ phone: "01222222222", name: "X" })).contact;
  for (let i = 0; i < 30; i += 1) await vault.edit(c.id, { name: `X${i}` });
  assert.equal((await vault.store.findById(c.id)).history.length, 20);
});

test("CSV export: header, E.164 column, quoting and spreadsheet-formula protection", async () => {
  const vault = newVault();
  await vault.add({ phone: "01000000001", name: 'Sara "S" Ali, MD', notes: "line1\nline2" });
  await vault.add({ phone: "01000000002", name: "=HYPERLINK(\"x\")" });
  const { csv, count } = await vault.exportCsv();
  assert.equal(count, 2);
  const lines = csv.split("\n");
  assert.equal(lines[0], "name,phone_e164,phone_digits,notes");
  assert.ok(csv.includes('"Sara ""S"" Ali, MD",+201000000001,201000000001,"line1\nline2"'));
  assert.ok(csv.includes("\"'=HYPERLINK(\"\"x\"\")\",+201000000002"));
  assert.equal(toCsv([]), "name,phone_e164,phone_digits,notes\n");
});
