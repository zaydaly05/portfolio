/**
 * GitHub helpers: everything about repositories comes from the GitHub API, and the account name
 * is taken from the portfolio profile (never hard-coded).
 */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "https://github.com/zaydaly05" or "zaydaly05" -> "zaydaly05" (null if it can't be read). */
function usernameFromProfile(profile) {
  const value = (profile && profile.github) || "";
  const match = String(value).match(/github\.com\/([A-Za-z0-9-]+)/i);
  if (match) return match[1];
  return /^[A-Za-z0-9-]+$/.test(value) ? value : null;
}

/** "Employee_Attendance-Leave_Management_System" -> "Employee Attendance Leave Management System" */
function prettyRepoName(name) {
  return String(name)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(^|\s)([a-z])/g, (m, space, ch) => space + ch.toUpperCase());
}

/** Last path segment of a GitHub repo URL, lower-cased, for matching projects to repos. */
function repoSlugFromUrl(url) {
  const match = String(url || "").match(/github\.com\/[^/]+\/([^/#?]+)/i);
  return match ? match[1].replace(/\.git$/i, "").toLowerCase() : null;
}

function periodFromDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Turns a GitHub repo object into a project entry in the portfolio's shape. */
function repoToProject(repo) {
  const stack = [repo.language, ...(Array.isArray(repo.topics) ? repo.topics.map(prettyRepoName) : [])]
    .filter(Boolean)
    .filter((item, i, arr) => arr.indexOf(item) === i)
    .slice(0, 6)
    .join(", ");
  return {
    name: prettyRepoName(repo.name),
    period: periodFromDate(repo.created_at),
    stack,
    image: "",
    github: repo.html_url,
    description: repo.description || ""
  };
}

function headers(token) {
  const h = { "User-Agent": "Portfolio-Admin", Accept: "application/vnd.github+json" };
  if (token) h.Authorization = `token ${token}`;
  return h;
}

/** All public, non-fork, non-archived repositories (newest first). Throws on API failure. */
async function fetchRepos(username, token, fetchImpl = fetch) {
  const repos = [];
  for (let page = 1; page <= 3; page += 1) {
    const res = await fetchImpl(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=created&page=${page}`,
      { headers: headers(token) }
    );
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos.filter((r) => !r.fork && !r.archived && !r.private);
}

/** Repositories that are not yet in the portfolio's projects list. */
function newRepos(repos, projects) {
  const known = new Set((projects || []).map((p) => repoSlugFromUrl(p.github)).filter(Boolean));
  return repos.filter((r) => !known.has(String(r.name).toLowerCase()));
}

module.exports = { usernameFromProfile, prettyRepoName, repoSlugFromUrl, repoToProject, fetchRepos, newRepos, headers };
