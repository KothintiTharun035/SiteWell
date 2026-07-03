// Shared helpers used across pages and components.

/** Basic email format check for client-side validation. */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
}

/** Normalizes user-entered URLs so the backend / fetch always gets a valid absolute URL. */
export function normalizeUrl(rawUrl) {
  const trimmed = String(rawUrl).trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function isValidUrl(rawUrl) {
  try {
    const normalized = normalizeUrl(rawUrl);
    // eslint-disable-next-line no-new
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}

/** Lighthouse category scores come back as 0-1 floats; convert to a whole percentage. */
    export function scoreToPercent(score) {
    if (typeof score !== "number") return 0;
    return Math.round(score);
    }

/** Maps a 0-100 score to a semantic tier, matching Lighthouse's own thresholds. */
export function scoreTier(percent) {
  if (percent >= 90) return "good";
  if (percent >= 50) return "warn";
  return "bad";
}

export function scoreClass(percent) {
  const tier = scoreTier(percent);
  return `score-${tier}`;
}

export function scoreNote(percent) {
  const tier = scoreTier(percent);
  if (tier === "good") return "Passing";
  if (tier === "warn") return "Needs work";
  return "Poor";
}

/** Human-friendly relative-ish date, e.g. "Jul 2, 2026, 3:45 PM". */
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Initials for the navbar avatar, e.g. "Jane Doe" -> "JD". */
export function getInitials(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ---------- Local check history ----------
   The backend's /get-url endpoint doesn't persist results, so we
   keep a lightweight history per-browser in localStorage, scoped
   by user email so switching accounts doesn't mix histories. */

const HISTORY_KEY_PREFIX = "sitewell_history_";

function historyKey(userEmail) {
  return `${HISTORY_KEY_PREFIX}${userEmail || "guest"}`;
}

export function getCheckHistory(userEmail) {
  try {
    const raw = localStorage.getItem(historyKey(userEmail));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCheckToHistory(userEmail, check) {
  const history = getCheckHistory(userEmail);
  const updated = [check, ...history].slice(0, 20); // keep the most recent 20
  try {
    localStorage.setItem(historyKey(userEmail), JSON.stringify(updated));
  } catch {
    // localStorage may be unavailable (private mode, quota) — fail silently
  }
  return updated;
}

export function clearCheckHistory(userEmail) {
  try {
    localStorage.removeItem(historyKey(userEmail));
  } catch {
    // ignore
  }
}
