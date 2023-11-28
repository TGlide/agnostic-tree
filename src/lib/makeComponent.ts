import type { ReadableAtom } from "nanostores";
import type { MadeElement } from "./makeElement";

type Toolbox = {
  generatedId: string;
};

export type ComponentCallback<
  Elements extends Record<string, MadeElement> = Record<string, MadeElement>,
  States extends Record<string, ReadableAtom> = Record<string, ReadableAtom>,
  Helpers extends Record<string, any> = Record<string, any>
> = (args: Toolbox) => {
  elements: Elements;
  states?: States;
  helpers?: Helpers;
};

export function makeComponent<Callback extends ComponentCallback>(
  cb: Callback
) {
  return cb as Callback;
}

export type MadeComponent<
  Callback extends ComponentCallback = ComponentCallback
> = ReturnType<Callback>;
