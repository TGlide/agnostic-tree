export function toCamelCase(str: string) {
  return str
    .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    .replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}
