import { adaptElement } from "@/lib/adapters/react";
import { createTree } from "@/lib/tree";

export const TreeReact = () => {
  const { element } = createTree();
  const adapted = adaptElement(element);

  return <div {...adapted.listeners}>Tree</div>;
};
