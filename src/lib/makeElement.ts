import { keys } from "@/helpers/object";
import { computed, type Atom } from "nanostores";
import type { AtomValue, AtomValueMap, GeneralListenerMap } from "./types";

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
  const attributes = computed(Object.values(dependencies), (...values) => {
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
    listeners: listeners as Listeners,
  };
}

export type MadeElement<
  Deps extends Record<string, Atom> = Record<string, Atom>,
  Attributes extends Record<string, string> = Record<string, string>,
  Listeners extends GeneralListenerMap = GeneralListenerMap
> = ReturnType<typeof makeElement<Deps, Attributes, Listeners>>;
