import { entries, keys } from "@/helpers/object";
import type { MadeComponent } from "@/lib/makeComponent";
import { useEffect, useMemo, useState } from "react";
import type { ComponentCallback } from "../../makeComponent";
import type { AtomValue, Expand } from "../../types";

import { useStoreValues } from "./useStoreValues";
import type { MadeElement } from "@/lib/makeElement";
import { adaptListeners, type Listeners } from "./listeners";
import type { ObjSnapshot } from "@/lib/helpers/getObjSnapshot";
import { adaptAttributes } from "./attributes";

export type ReactElement<E extends MadeElement> = AtomValue<
  E["attributes"]
> extends (...args: infer Params) => infer Res
  ? (...args: Params) => Res & Listeners<E["listeners"]>
  : AtomValue<E["attributes"]> & Listeners<E["listeners"]>;

type ComponentElements<C extends MadeComponent> = {
  [K in keyof C["elements"]]: ReactElement<C["elements"][K]>;
};

export function useComponentElements<C extends MadeComponent>(
  component: C
): ComponentElements<C> {
  const elementValues = useStoreValues(component.elements) as {
    [K in keyof C["elements"]]: {
      attributes: AtomValue<C["elements"][K]["attributes"]>;
      listeners?: C["elements"][K]["listeners"];
    };
  };

  return entries(elementValues).reduce((acc, [key, element]) => {
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
  const component = useMemo(() => componentCb(), []) as ReturnType<Cb>;
  const elements = useComponentElements(component);

  const values = useStoreValues(component);

  return {
    ...values,
    elements,
  };
}

export type ReactComponent<C extends ComponentCallback> = Expand<
  ReturnType<typeof useComponent<C>>
>;
