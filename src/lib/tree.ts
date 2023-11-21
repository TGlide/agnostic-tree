import { atom } from "nanostores";
import { makeElement } from "./makeElement";
import { makeComponent } from "./makeComponent";

export const createTree = makeComponent(() => {
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
    elements: {
      element,
    },
  };
});
