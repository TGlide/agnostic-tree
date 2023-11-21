import { entries, keys } from "@/helpers/object";
import { useEffect, useState, type DOMAttributes } from "react";
import type { MadeComponent } from "../makeComponent";
import type { MadeElement } from "../makeElement";
import type { AtomValue, Expand, GeneralEventListener } from "../types";

function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

const LISTENER_MAP = {
  click: "onClick",
} as const satisfies {
  [K in keyof HTMLElementEventMap]?: string;
};

function getListenerName(key: string) {
  if (key in LISTENER_MAP) {
    return LISTENER_MAP[key as keyof typeof LISTENER_MAP];
  }

  return toCamelCase("on-" + key);
}

type ListenerKey<K extends string> = K extends keyof typeof LISTENER_MAP
  ? (typeof LISTENER_MAP)[K]
  : `on${Capitalize<string & K>}`;

type Listeners<E extends MadeElement> = {
  [K in keyof E["listeners"] as ListenerKey<
    string & K
  >]: DOMAttributes<HTMLElement>[ListenerKey<
    string & K
  > extends keyof DOMAttributes<HTMLElement>
    ? ListenerKey<string & K>
    : never];
};

type ReactElement<E extends MadeElement> = Expand<
  AtomValue<E["attributes"]> & Listeners<E>
>;

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

export function useComponent<C extends MadeComponent>(component: C) {
  const adaptedElements = Object.fromEntries(
    entries(component.elements).map(([key, value]) => {
      return [key, adaptElement(value)];
    })
  ) as {
    [K in keyof C["elements"]]: ReturnType<
      typeof adaptElement<C["elements"][K]>
    >;
  };

  const [elements, setElements] = useState(
    {} as {
      [K in keyof C["elements"]]: ReactElement<C["elements"][K]>;
    }
  );

  useEffect(() => {
    const unsubs = [] as (() => void)[];
    keys(adaptedElements).forEach((key) => {
      const element = adaptedElements[key];
      const { attributes, listeners } = element;

      const unsub = attributes.subscribe(() => {
        setElements((prev) => {
          return {
            ...prev,
            [key]: {
              ...attributes.get(),
              ...listeners,
            },
          };
        });
      });

      unsubs.push(unsub);
    });

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  return {
    ...component,
    elements,
  };
}
