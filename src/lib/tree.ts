import { atom } from "nanostores";
import { makeElement } from "./makeElement";

export function createTree() {
  const value = atom(0);

  const element = makeElement({
    dependencies: { value },
    getAttributes({ $value }) {
      return {
        "data-value": String($value),
      };
    },
    listeners: {
      click(e) {
        console.log("Hi from tree!");
      },
    },
  });

  return {
    element,
  };
}
