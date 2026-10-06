/**
 * CV build pipeline.
 *
 * The CV is a LaTeX document (fixed layout) whose content comes from the database. LaTeX cannot run
 * on the web server, so a GitHub Action compiles it: the server marks a build as "requested", the
 * Action fetches the generated .tex, compiles it with pdfTeX and uploads the PDF back. The PDF is
 * stored in the database and served from /api/document/resume.
 */
const { renderCvTex } = require("./cv-tex");

const MAX_PDF_BYTES = 3 * 1024 * 1024;
const KEEP_VERSIONS = 10;

class CvBuildError extends Error {}

function isPdf(buffer) {
  return Buffer.isBuffer(buffer) && buffer.length > 1000 && buffer.length <= MAX_PDF_BYTES && buffer.subarray(0, 5).toString("latin1") === "%PDF-" && buffer.subarray(-1024).toString("latin1").includes("%%EOF");
}

/**
 * @param {object} deps
 * @param {Function} deps.connectDB resolves a connection or null
 * @param {object} deps.models { CvBuild, CvFile } (mongoose models)
 * @param {Function} deps.getData () => portfolio data (profile + cv sections)
 * @param {Function} deps.onBuilt async ({ version, url }) => void  stores the new link / notifies
 * @param {Function} [deps.dispatch] async () => boolean  asks GitHub to start the workflow now
 */
function createCvBuilder({ connectDB, models, getData, onBuilt, dispatch }) {
  const memory = { state: { status: "idle", version: 0 }, files: new Map() };

  const database = async () => {
    try {
      return models ? await connectDB() : null;
    } catch {
      return null;
    }
  };

  async function getState() {
    if (await database()) {
      const doc = await models.CvBuild.findOne({ key: "state" }).lean();
      return doc ? { ...doc } : { status: "idle", version: 0 };
    }
    return { ...memory.state };
  }

  async function patchState(patch) {
    if (await database()) {
      await models.CvBuild.findOneAndUpdate({ key: "state" }, { $set: patch }, { upsert: true });
    } else {
      Object.assign(memory.state, patch);
    }
  }

  /** Marks a build as wanted and nudges the GitHub workflow (the workflow also polls). */
  async function requestBuild(reason) {
    const requestedAt = new Date().toISOString();
    await patchState({ status: "requested", requestedAt, reason: String(reason || "content changed").slice(0, 200), error: null });
    let dispatched = false;
    let dispatchError = null;
    if (dispatch) {
      try {
        dispatched = Boolean(await dispatch());
      } catch (err) {
        dispatchError = err.message;
      }
    }
    return { requestedAt, dispatched, dispatchError };
  }

  async function source() {
    return { state: await getState(), tex: renderCvTex(getData()) };
  }

  /** Stores a compiled PDF. `id` is the requestedAt value the runner built from. */
  async function complete({ pdf, id }) {
    if (!isPdf(pdf)) throw new CvBuildError("That is not a valid PDF (or it is larger than 3 MB).");
    const state = await getState();
    const version = (Number(state.version) || 0) + 1;
    const stale = Boolean(id && state.requestedAt && id !== state.requestedAt);

    if (await database()) {
      await models.CvFile.create({ version, data: pdf, size: pdf.length });
      const old = await models.CvFile.find({ version: { $lte: version - KEEP_VERSIONS } }).select("version").lean();
      if (old.length) await models.CvFile.deleteMany({ version: { $in: old.map((o) => o.version) } });
    } else {
      memory.files.set(version, pdf);
      for (const key of [...memory.files.keys()]) if (key <= version - KEEP_VERSIONS) memory.files.delete(key);
    }

    // If content changed again while this build ran, keep the request open so it is rebuilt.
    await patchState({ status: stale ? "requested" : "done", builtAt: new Date(), version, error: null });
    const url = `/api/document/resume?v=${version}`;
    await onBuilt({ version, url, stale });
    return { version, url, stale };
  }

  async function fail(message) {
    await patchState({ status: "failed", error: String(message || "Build failed").slice(0, 2000) });
  }

  async function latestPdf() {
    const state = await getState();
    const version = Number(state.version) || 0;
    if (!version) return null;
    if (await database()) {
      const doc = await models.CvFile.findOne({ version }).lean();
      return doc ? Buffer.from(doc.data.buffer ? doc.data.buffer : doc.data) : null;
    }
    return memory.files.get(version) || null;
  }

  return { getState, requestBuild, source, complete, fail, latestPdf };
}

/** Starts the GitHub Actions workflow now. Returns false when it is not configured. */
async function dispatchWorkflow({ token, repository, ref, workflow = "build-cv.yml", fetchImpl = fetch }) {
  if (!token || !repository) return false;
  const res = await fetchImpl(`https://api.github.com/repos/${repository}/actions/workflows/${workflow}/dispatches`, {
    method: "POST",
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json", "User-Agent": "Portfolio-Admin", "content-type": "application/json" },
    body: JSON.stringify({ ref: ref || "main" })
  });
  if (res.status !== 204) throw new Error(`GitHub dispatch returned ${res.status}`);
  return true;
}

module.exports = { createCvBuilder, dispatchWorkflow, isPdf, CvBuildError, MAX_PDF_BYTES };
