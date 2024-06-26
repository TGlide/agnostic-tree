import { type Atom } from "nanostores";
import { computedObj } from "./helpers/computedObj";
import type { AtomValueMap, GeneralListenerMap } from "./types";

type BaseAttributes =
  | Record<string, unknown>
  | ((...args: any[]) => Record<string, unknown>);

type MakeElementArgs<
  Deps extends Record<string, Atom>,
  Attributes extends BaseAttributes,
  Listeners extends GeneralListenerMap | undefined = undefined
> = {
  dependencies: Deps;
  getAttributes: (values: AtomValueMap<Deps>) => Attributes;
  listeners: Listeners extends undefined ? undefined : Listeners;
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
    listeners: listeners,
  };
}

export type MadeElement<
  Deps extends Record<string, Atom> = Record<string, Atom>,
  Attributes extends BaseAttributes = BaseAttributes,
  Listeners extends GeneralListenerMap = GeneralListenerMap
> = ReturnType<typeof makeElement<Deps, Attributes, Listeners>>;
