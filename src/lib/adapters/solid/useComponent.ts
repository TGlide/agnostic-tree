import { entries } from "@/helpers/object";
import type { MadeComponent } from "@/lib/makeComponent";

import type { ComponentCallback } from "../../makeComponent";
import type { AtomValue, Expand } from "../../types";

import type { MadeElement } from "@/lib/makeElement";
import { adaptAttributes } from "./attributes";
import { adaptListeners, type Listeners } from "./listeners";
import { useStoreValues } from "./useStoreValues";
import type { Accessor } from "solid-js";

export type SolidElement<E extends MadeElement> = AtomValue<
  E["attributes"]
> extends (...args: infer Params) => infer Res
  ? (...args: Params) => Res & Listeners<E["listeners"]>
  : AtomValue<E["attributes"]> & Listeners<E["listeners"]>;

type ComponentElements<C extends MadeComponent> = {
  [K in keyof C["elements"]]: SolidElement<C["elements"][K]>;
};

export function useComponentElements<C extends MadeComponent>(
  component: C
): Accessor<ComponentElements<C>> {
  const elementValues = useStoreValues(component.elements) as Accessor<{
    [K in keyof C["elements"]]: {
      attributes: AtomValue<C["elements"][K]["attributes"]>;
      listeners?: C["elements"][K]["listeners"];
    };
  }>;

  return () =>
    entries(elementValues()).reduce((acc, [key, element]) => {
      const listeners = element.listeners
        ? adaptListeners(element.listeners)
        : {};

      if (typeof element.attributes === "function") {
        return {
          ...acc,
          [key]: (...args: any[]) => {
            const attributes = (element.attributes as any)(...args);
            return {
              ...adaptAttributes(attributes),
              ...listeners,
            };
          },
        };
      }

      return {
        ...acc,
        [key]: {
          ...adaptAttributes(element.attributes as any),
          ...listeners,
        },
      };
    }, {} as ComponentElements<C>);
}

export function useComponent<Cb extends ComponentCallback>(componentCb: Cb) {
  const component = componentCb() as ReturnType<Cb>;
  const elements = useComponentElements(component);
  const values = useStoreValues(component);

  return () => {
    return {
      ...values(),
      elements: elements(),
    };
  };
}

export type SolidComponent<C extends ComponentCallback> = ReturnType<
  typeof useComponent<C>
>;
