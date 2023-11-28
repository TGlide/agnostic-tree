import { entries, omit } from "@/helpers/object";
import { getObjSnapshot, type ObjSnapshot } from "../helpers/getObjSnapshot";
import { subscribeToObj } from "../helpers/subscribeToObj";
import type { ComponentCallback, MadeComponent } from "../makeComponent";
import type { MadeElement } from "../makeElement";
import type { AtomValue, Expand, GeneralListenerMap } from "../types";
import { generateId } from "../helpers/id";

type Listeners<L extends GeneralListenerMap> = {
  [K in keyof L as `on${K & string}`]: L[K];
};

export type RunesElement<E extends MadeElement> = AtomValue<
  E["attributes"]
> extends (...args: infer Params) => infer Res
  ? (...args: Params) => Res & Listeners<E["listeners"]>
  : AtomValue<E["attributes"]> & Listeners<E["listeners"]>;

function adaptListeners<L extends GeneralListenerMap>(listeners: L) {
  return entries(listeners).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [`on${key as string}`]: value,
    };
  }, {} as Listeners<L>);
}

const getComponentSnapshot = <C extends MadeComponent>(component: C) => {
  const snapshot = getObjSnapshot(component);
  const elements = {} as any;

  for (const [key, el] of entries(snapshot.elements as any)) {
    if (typeof el.attributes === "function") {
      elements[key] = (...args: any[]) => {
        const attributes = el.attributes(...args);
        return {
          ...attributes,
          ...adaptListeners(el.listeners),
        };
      };
    } else {
      elements[key] = {
        ...el.attributes,
        ...adaptListeners(el.listeners),
      };
    }
  }

  return {
    ...omit(snapshot, "elements"),
    elements: elements as {
      [K in keyof C["elements"]]: RunesElement<C["elements"][K]>;
    },
  };
};

export function withRunes<Cb extends ComponentCallback>(callback: Cb) {
  const component = callback({ generatedId: generateId() });
  type C = typeof component;

  let res = $state<any>(getComponentSnapshot(component));

  $effect(() => {
    return subscribeToObj(component, () => {
      res = getComponentSnapshot(component);
    });
  });

  return {
    get helpers() {
      return res.helpers as ObjSnapshot<C["helpers"]>;
    },
    get elements() {
      return res.elements;
    },
    get states() {
      return res.states as ObjSnapshot<C["states"]>;
    },
  };
}

export type RunesComponent<Cb extends ComponentCallback> = Expand<
  ReturnType<typeof withRunes<Cb>>
>;
