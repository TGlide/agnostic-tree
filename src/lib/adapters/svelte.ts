import { entries, omit } from "@/helpers/object";
import type { MadeComponent } from "../makeComponent";
import type { MadeElement } from "../makeElement";
import type { Expand, GeneralEventListener } from "../types";

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

export function withComponent<C extends MadeComponent>(component: C) {
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

export type SvelteComponent<C extends MadeComponent> = Expand<
  ReturnType<typeof withComponent<C>>
>;
