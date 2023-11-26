import { entries } from "@/helpers/object";
import type { DOMAttributes, HTMLAttributes } from "react";

const ATTRIBUTE_MAP = {
  tabindex: "tabIndex",
} as const satisfies {
  [K in string]?: keyof HTMLAttributes<HTMLElement>;
};

export function getAttributeName(key: string) {
  if (key in ATTRIBUTE_MAP) {
    return ATTRIBUTE_MAP[key as keyof typeof ATTRIBUTE_MAP];
  }

  return key;
}

export type AttributeKey<K extends string> =
  K extends keyof typeof ATTRIBUTE_MAP ? (typeof ATTRIBUTE_MAP)[K] : K;

export type Attributes<A extends Record<string, unknown>> = {
  [K in keyof A as AttributeKey<
    string & K
  >]: DOMAttributes<HTMLElement>[AttributeKey<
    string & K
  > extends keyof DOMAttributes<HTMLElement>
    ? AttributeKey<string & K>
    : never];
};

export function adaptAttributes<A extends Record<string, unknown>>(
  attributes: A
) {
  return entries(attributes).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [getAttributeName(key as any)]: value,
    };
  }, {} as Attributes<A>);
}
