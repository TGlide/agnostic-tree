import type { MadeElement } from "@/lib/makeElement";
import type { DOMAttributes } from "react";

function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

const LISTENER_MAP = {
  click: "onClick",
  keydown: "onKeyDown",
} as const satisfies {
  [K in keyof HTMLElementEventMap]?: string;
};

export function getListenerName(key: string) {
  if (key in LISTENER_MAP) {
    return LISTENER_MAP[key as keyof typeof LISTENER_MAP];
  }

  return toCamelCase("on-" + key);
}

export type ListenerKey<K extends string> = K extends keyof typeof LISTENER_MAP
  ? (typeof LISTENER_MAP)[K]
  : `on${Capitalize<string & K>}`;

export type Listeners<E extends MadeElement> = {
  [K in keyof E["listeners"] as ListenerKey<
    string & K
  >]: DOMAttributes<HTMLElement>[ListenerKey<
    string & K
  > extends keyof DOMAttributes<HTMLElement>
    ? ListenerKey<string & K>
    : never];
};
