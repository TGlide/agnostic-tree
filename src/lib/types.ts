import type { Atom } from "nanostores";

export type AtomValue<T> = T extends Atom<infer V> ? V : never;

/**
 * A type alias for a general event listener function.
 *
 * @template E - The type of event to listen for
 * @param evt - The event object
 * @returns The return value of the event listener function
 */
export type GeneralEventListener<E = Event> = (evt: E) => unknown;

// Type that gets a record, and adds a dollar sign to the beginning of each key
export type AtomValueMap<T extends Record<string, unknown>> = {
  [K in keyof T as `$${string & K}`]: AtomValue<T[K]>;
};

export type GeneralListenerMap = {
  [K in keyof HTMLElementEventMap]?: GeneralEventListener<
    HTMLElementEventMap[K]
  >;
};

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
