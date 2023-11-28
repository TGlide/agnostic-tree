import { entries, omit } from "@/lib/helpers/object";
import type { ComponentCallback, MadeComponent } from "../makeComponent";
import type { MadeElement } from "../makeElement";
import type { Expand, GeneralEventListener } from "../types";
import { generateId } from "../helpers/id";

type BaseAction = (node: HTMLElement) => {
  destroy(): void;
};

export type SvelteElement<E extends MadeElement> = Expand<{
  subscribe: E["attributes"]["subscribe"];
  action: BaseAction;
}>;

export function adaptElement<E extends MadeElement>(element: E) {
  const action = (node: HTMLElement) => {
    Object.entries(element.listeners ?? {}).forEach(([key, value]) => {
      node.addEventListener(key, value as GeneralEventListener);
    });

    return {
      destroy() {
        Object.entries(element.listeners ?? {}).forEach(([key, value]) => {
          node.removeEventListener(key, value as GeneralEventListener);
        });
      },
    };
  };

  const actionFn: SvelteElement<E> = {
    action,
    subscribe: element.attributes.subscribe,
  };

  return actionFn;
}

export function withComponent<Cb extends ComponentCallback>(callback: Cb) {
  const component = callback({
    generatedId: generateId(),
  }) as MadeComponent<Cb>;
  type C = typeof component;

  const elements = Object.fromEntries(
    entries(component.elements).map(([key, value]) => {
      return [key, adaptElement(value)];
    })
  ) as {
    [K in keyof C["elements"]]: SvelteElement<C["elements"][K]>;
  };

  return {
    ...omit(component, "elements"),
    elements,
  };
}

export type SvelteComponent<Cb extends ComponentCallback> = Expand<
  ReturnType<typeof withComponent<Cb>>
>;
