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

/**
 * Typed Object.entries
 *
 * @export
 * @template {Record<string, unknown>} T
 * @param {T} obj
 * @returns {[keyof T, T[keyof T]][]}
 */
export function entries<T extends Record<string, unknown>>(
  obj: T
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}
