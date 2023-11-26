import { isAtom } from "./is";

export function subscribeToObj<Obj extends {}>(
  obj: Obj,
  callback: (key: string, value: unknown) => void
) {
  const subscribers: Array<() => void> = [];

  Object.entries(obj).forEach(([key, value]) => {
    if (isAtom(value)) {
      subscribers.push(value.subscribe(($value) => callback(key, $value)));
    } else if (typeof value === "object" && value !== null) {
      subscribers.push(subscribeToObj(value, callback));
    }
  });

  return () => {
    subscribers.forEach((unsubscribe) => unsubscribe());
  };
}
