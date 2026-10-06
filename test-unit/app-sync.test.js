// Guards against the admin app and the server drifting apart.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { SECTION_RULES } = require("../routes/admin");
const defaults = require("../data/defaults");

const dart = fs.readFileSync(path.join(__dirname, "..", "admin_app", "lib", "content_model.dart"), "utf8");

/** Parses `SectionInfo(key: 'x', ... template: {...})` blocks out of the Dart source. */
function parseSections(source) {
  const result = {};
  const blocks = source.split("SectionInfo(").slice(2); // skip class definition + constructor
  for (const block of blocks) {
    const key = (block.match(/key:\s*'(\w+)'/) || [])[1];
    const titleKey = (block.match(/titleKey:\s*'(\w+)'/) || [])[1];
    const templateStart = block.indexOf("template:");
    if (!key || templateStart === -1) continue;
    const body = block.slice(templateStart);
    const open = body.indexOf("{");
    let depth = 0;
    let end = open;
    for (; end < body.length; end += 1) {
      if (body[end] === "{") depth += 1;
      if (body[end] === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    const fields = [...body.slice(open, end).matchAll(/'(\w+)':/g)].map((m) => m[1]);
    result[key] = { titleKey, fields: new Set(fields) };
  }
  return result;
}

const appSections = parseSections(dart);

test("the app edits exactly the sections the server accepts", () => {
  assert.deepEqual(Object.keys(appSections).sort(), Object.keys(SECTION_RULES).sort());
});

test("each section's title field matches what the server requires", () => {
  for (const [key, rule] of Object.entries(SECTION_RULES)) {
    assert.equal(appSections[key].titleKey, rule.required, key);
  }
});

test("every field used by the built-in content has a form field in the app", () => {
  // These hold lists of objects and are edited through the section's "Edit as JSON" / JSON fields
  const jsonOnly = new Set(["screenshots", "media"]);
  for (const key of Object.keys(SECTION_RULES)) {
    const items = Array.isArray(defaults[key]) ? defaults[key] : [defaults[key]];
    const used = new Set(items.flatMap((item) => Object.keys(item)));
    for (const field of used) {
      if (jsonOnly.has(field)) continue;
      assert.ok(appSections[key].fields.has(field), `${key}.${field} is missing from the app's form`);
    }
  }
});
