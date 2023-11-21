import { keys } from "@/helpers/object";
import { computed, type Atom } from "nanostores";
import type { AtomValue, AtomValueMap, GeneralListenerMap } from "./types";
import { computedObj } from "./helpers/computedObj";

type BaseAttributes =
  | Record<string, unknown>
  | ((...args: any[]) => Record<string, unknown>);

type MakeElementArgs<
  Deps extends Record<string, Atom>,
  Attributes extends BaseAttributes,
  Listeners extends GeneralListenerMap
> = {
  dependencies: Deps;
  getAttributes: (values: AtomValueMap<Deps>) => Attributes;
  listeners?: Listeners;
};

export function makeElement<
  Deps extends Record<string, Atom>,
  Attributes extends BaseAttributes,
  Listeners extends GeneralListenerMap
>({
  dependencies,
  getAttributes,
  listeners,
}: MakeElementArgs<Deps, Attributes, Listeners>) {
  const attributes = computedObj(dependencies, getAttributes);

  return {
    attributes,
    listeners: listeners as Listeners,
  };
}

export type MadeElement<
  Deps extends Record<string, Atom> = Record<string, Atom>,
  Attributes extends BaseAttributes = BaseAttributes,
  Listeners extends GeneralListenerMap = GeneralListenerMap
> = ReturnType<typeof makeElement<Deps, Attributes, Listeners>>;
