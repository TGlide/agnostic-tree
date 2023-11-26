import { getObjSnapshot, type ObjSnapshot } from "@/lib/helpers/getObjSnapshot";
import { subscribeToObj } from "@/lib/helpers/subscribeToObj";
import { useEffect, useState } from "react";

/**
 * Given an object that may contain stores, returns a new object with the same
 * keys, but with the stores replaced with their values.
 *
 * @export
 * @template T
 * @returns {*}
 */
export function useStoreValues<T extends {}>(obj: T): ObjSnapshot<T> {
  const [res, setRes] = useState(() => getObjSnapshot(obj));

  useEffect(() => {
    return subscribeToObj(obj, () => {
      setRes(getObjSnapshot(obj));
    });
  }, []);

  return res;
}
