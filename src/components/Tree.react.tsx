import { adaptElement, useComponent } from "@/lib/adapters/react";
import { createTree } from "@/lib/tree";

export const TreeReact = () => {
  const {
    elements: { element },
  } = useComponent(createTree());

  return <div {...element}>Tree</div>;
};
