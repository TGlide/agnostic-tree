import type { Atom } from "nanostores";
import { isAtom } from "./is";

export type ObjSnapshot<T> = {
  [K in keyof T]: T[K] extends Atom<infer U>
    ? U
    : T[K] extends object
    ? ObjSnapshot<T[K]>
    : T[K];
};

export function getObjSnapshot<T extends {}>(obj: T): ObjSnapshot<T> {
  const res = {} as ObjSnapshot<T>;

  Object.entries(obj).forEach(([key, value]) => {
    if (isAtom(value)) {
      res[key as keyof T] = value.get();
    } else if (typeof value === "object" && value !== null) {
      res[key as keyof T] = getObjSnapshot(value) as any;
    } else {
      res[key as keyof T] = value as any;
    }
  });

  return res;
}
