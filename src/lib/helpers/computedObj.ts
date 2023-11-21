import { computed, type Atom } from "nanostores";
import type { AtomValueMap } from "../types";
import { keys } from "@/helpers/object";

export function computedObj<Deps extends Record<string, Atom>, Return>(
  deps: Deps,
  callback: (values: AtomValueMap<Deps>) => Return
) {
  return computed(Object.values(deps), (...values) => {
    const valueMap = {} as AtomValueMap<Deps>;
    values.forEach((value: any, index: number) => {
      const key = `$${keys(deps)[index] as string}` as keyof AtomValueMap<Deps>;
      valueMap[key] = value;
    });

    return callback(valueMap);
  });
}
