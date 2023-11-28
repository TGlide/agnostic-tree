export function isJsEnabled() {
  return typeof window !== "undefined" && window !== null;
}
