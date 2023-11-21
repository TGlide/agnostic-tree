import { keys } from "@/helpers/object";
import { computed, type Atom } from "nanostores";

/**
 * A type alias for a general event listener function.
 *
 * @template E - The type of event to listen for
 * @param evt - The event object
 * @returns The return value of the event listener function
 */
type GeneralEventListener<E = Event> = (evt: E) => unknown;

type AtomValue<T> = T extends Atom<infer V> ? V : never;

// Type that gets a record, and adds a dollar sign to the beginning of each key
type AtomValueMap<T extends Record<string, unknown>> = {
  [K in keyof T as `$${string & K}`]: AtomValue<T[K]>;
};

type GeneralListenerMap = {
  [K in keyof HTMLElementEventMap]?: GeneralEventListener<
    HTMLElementEventMap[K]
  >;
};

type MakeElementArgs<
  Deps extends Record<string, Atom>,
  Attributes extends Record<string, string>,
  Listeners extends GeneralListenerMap
> = {
  dependencies: Deps;
  getAttributes: (values: AtomValueMap<Deps>) => Attributes;
  listeners?: Listeners;
};

export function makeElement<
  Deps extends Record<string, Atom>,
  Attributes extends Record<string, string>,
  Listeners extends GeneralListenerMap
>({
  dependencies,
  getAttributes,
  listeners,
}: MakeElementArgs<Deps, Attributes, Listeners>) {
  const attributes = computed(Object.values(dependencies), (values) => {
    const valueMap = {} as AtomValueMap<Deps>;
    values.forEach((value: any, index: number) => {
      const key = `$${
        keys(dependencies)[index] as string
      }` as keyof AtomValueMap<Deps>;
      valueMap[key] = value;
    });

    return getAttributes(valueMap);
  });

  return {
    attributes,
    listeners,
  };
}

export type MadeElement<
  Deps extends Record<string, Atom>,
  Attributes extends Record<string, string>,
  Listeners extends GeneralListenerMap
> = ReturnType<typeof makeElement<Deps, Attributes, Listeners>>;
