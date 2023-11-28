import { entries, omit } from "@/lib/helpers/object";
import { generateId } from "../helpers/id";
import type { ComponentCallback, MadeComponent } from "../makeComponent";
import type { Expand } from "../types";
import { subscribeToObj } from "../helpers/subscribeToObj";
import { getObjSnapshot } from "../helpers/getObjSnapshot";
import { isFunction, isHtmlElement } from "../helpers/is";

function stringify(value: unknown) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

function setAttributes(node: HTMLElement, attributes: Record<string, unknown>) {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined) {
      node.removeAttribute(key);
    } else {
      node.setAttribute(key, stringify(value));
    }
  });
}

export function withComponent<Cb extends ComponentCallback>(callback: Cb) {
  const id = generateId();
  const component = callback({
    generatedId: id,
  }) as MadeComponent<Cb>;

  const unsubs: Array<() => void> = [];

  entries(component.elements).forEach(([key, value]) => {
    const dataAttribute = `data-v-${key}`;
    const selector = `[${dataAttribute}]`;
    document.querySelectorAll(selector).forEach((node) => {
      if (!isHtmlElement(node)) return;

      const unsub = value.attributes.subscribe(($attributes) => {
        if (isFunction($attributes)) {
          const args = JSON.parse(node.getAttribute(dataAttribute) || "{}");

          const attributes = $attributes(args);
          setAttributes(node, attributes);
        } else {
          setAttributes(node, $attributes);
        }
      });

      unsubs.push(unsub);

      if (value.listeners) {
        entries(value.listeners).forEach(([key, value]) => {
          node.addEventListener(key, value as any);
        });
      }
    });
  });

  return {
    ...omit(component, "elements"),
  };
}

export type VanillaComponent<Cb extends ComponentCallback> = Expand<
  ReturnType<typeof withComponent<Cb>>
>;
