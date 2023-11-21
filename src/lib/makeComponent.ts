import type { MadeElement } from "./makeElement";

type ComponentCallback<Elements extends Record<string, MadeElement> = any> =
  () => {
    elements: Elements;
  };

export function makeComponent<Callback extends ComponentCallback>(
  cb: Callback
) {
  return cb as Callback;
}

export type MadeComponent<
  Callback extends ComponentCallback = ComponentCallback
> = ReturnType<Callback>;
