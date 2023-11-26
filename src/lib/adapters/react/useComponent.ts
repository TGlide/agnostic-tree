import { entries, keys } from "@/helpers/object";
import type { MadeComponent } from "@/lib/makeComponent";
import { useEffect, useMemo, useState } from "react";
import type { ComponentCallback } from "../../makeComponent";
import type { Expand } from "../../types";
import { adaptElement, type ReactElement } from "./adaptElement";
import { useStoreValues } from "./useStoreValues";

export function useComponentElements<C extends MadeComponent>(component: C) {
  const adaptedElements = Object.fromEntries(
    entries(component.elements).map(([key, value]) => {
      return [key, adaptElement(value)];
    })
  ) as {
    [K in keyof C["elements"]]: ReturnType<
      typeof adaptElement<C["elements"][K]>
    >;
  };

  const getElValue = (key: keyof C["elements"]) => {
    const element = adaptedElements[key];
    const { attributes, listeners } = element;
    const $attributes = attributes.get();

    if (typeof $attributes === "function") {
      return (...args: Parameters<typeof $attributes>) => {
        return {
          ...$attributes(...args),
          ...listeners,
        };
      };
    }
    return { ...$attributes, ...listeners };
  };

  const [elements, setElements] = useState(() => {
    const res = {} as {
      [K in keyof C["elements"]]: ReactElement<C["elements"][K]>;
    };

    keys(adaptedElements).forEach((k) => {
      const v = getElValue(k);
      res[k] = v;
    });

    return res;
  });

  useEffect(() => {
    const unsubs = [] as (() => void)[];
    keys(adaptedElements).forEach((key) => {
      const { attributes } = adaptedElements[key];

      const unsub = attributes.subscribe(() => {
        const value = getElValue(key);
        setElements((prev) => {
          return {
            ...prev,
            [key]: value,
          };
        });
      });

      unsubs.push(unsub);
    });

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  return elements;
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
