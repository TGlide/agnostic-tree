import { entries } from "@/lib/helpers/object";
import { toCamelCase } from "@/lib/helpers/toCamelCase";
import type { GeneralListenerMap } from "@/lib/types";
import type { DOMAttributes } from "react";

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

export type Listeners<L extends GeneralListenerMap> = {
  [K in keyof L as ListenerKey<
    string & K
  >]: DOMAttributes<HTMLElement>[ListenerKey<
    string & K
  > extends keyof DOMAttributes<HTMLElement>
    ? ListenerKey<string & K>
    : never];
};

export function adaptListeners<L extends GeneralListenerMap>(listeners: L) {
  return entries(listeners).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [getListenerName(key as any)]: value,
    };
  }, {} as Listeners<L>);
}
