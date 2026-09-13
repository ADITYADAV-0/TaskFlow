/**
 * Formats an ISO date string as "Sep 12, 2026". Returns null for falsy
 * input so callers can decide how to render a missing date.
 */
export function formatDate(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function isOverdue(isoDateOnly) {
  if (!isoDateOnly) return false;
  const due = new Date(isoDateOnly + "T23:59:59");
  return due.getTime() < Date.now();
}
