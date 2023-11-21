/**
 * Returns the last element in an array.
 * @param array the array.
 */
export function last<T>(array: T[]): T {
  return array[array.length - 1];
}
