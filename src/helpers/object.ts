/**
 * Typed Object.keys
 *
 * @export
 * @template {Record<string, unknown>} T
 * @param {T} obj
 * @returns {(keyof T)[]}
 */
export function keys<T extends Record<string, unknown>>(obj: T): (keyof T)[] {
  return Object.keys(obj);
}
