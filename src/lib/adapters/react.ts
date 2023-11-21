import type { MadeElement } from "../makeElement";

export function adaptElement<E extends MadeElement<any, any, any>>(element: E) {
  return {
    attributes: element.attributes as E["attributes"],
    listeners: Object.entries(element.listeners ?? {}).reduce(
      (acc, [key, value]) => {
        return {
          ...acc,
          [toCamelCase("on-" + key)]: value,
        };
      },
      {}
    ) as {
      [K in keyof E["listeners"] as `on${Capitalize<
        string & K
      >}`]: E["listeners"][K];
    },
  };
}

function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
