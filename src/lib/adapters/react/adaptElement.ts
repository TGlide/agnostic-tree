import type { MadeElement } from "@/lib/makeElement";
import type { AtomValue } from "@/lib/types";
import { type Listeners, getListenerName, type ListenerKey } from "./listeners";

export type ReactElement<E extends MadeElement> = AtomValue<
  E["attributes"]
> extends (...args: infer Params) => infer Res
  ? (...args: Params) => Res & Listeners<E>
  : AtomValue<E["attributes"]> & Listeners<E>;

export function adaptElement<E extends MadeElement>(element: E) {
  const listeners = {} as Listeners<E>;

  Object.entries(element.listeners ?? {}).forEach(([key, value]) => {
    const newKey = getListenerName(key) as ListenerKey<string>;
    (listeners as any)[newKey] = value;
  });

  return {
    attributes: element.attributes as E["attributes"],
    listeners,
  };
}
