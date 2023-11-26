import type { Atom } from "nanostores";

export const isLetter = (key: string) => /^[a-z]$/i.test(key);

export const isHtmlElement = (element: unknown): element is HTMLElement => {
  return element instanceof HTMLElement;
};

export function isAtom(value: unknown): value is Atom {
  return typeof value === "object" && value !== null && "subscribe" in value;
}
