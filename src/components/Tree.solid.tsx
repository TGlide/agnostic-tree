/** @jsxImportSource solid-js */

import { data, getIcon, type FileTree, icons, isDirectory } from "@/data";
import { useComponent, type SolidComponent } from "@/lib/adapters/solid";
import { createTree } from "@/lib/builders/tree";
import { For, createContext, mergeProps, useContext } from "solid-js";

type TreeComponent = SolidComponent<typeof createTree>;

const Context = createContext<TreeComponent | null>(null);

const useTreeContext = () => {
  const ctx = useContext(Context);

  if (!ctx) {
    throw new Error("Missing context");
  }

  return ctx;
};

type TreeInnerProps = {
  treeItems: FileTree;
  level?: number;
};

const TreeInner = (p: TreeInnerProps) => {
  const props = mergeProps({ level: 1 }, p);
  const tree = useTreeContext();

  return (
    <>
      <For each={props.treeItems}>
        {(treeItem, i) => {
          const { name } = treeItem;
          const itemId = `${name}-${i()}`;
          const hasChildren =
            treeItem.kind === "directory" && !!treeItem.children;

          return (
            <li
              class={
                props.level !== 1 ? "mis-12 pis-12 border-l bc-gray-10" : ""
              }
            >
              <button
                class="flex items-center gap-4 rounded-md p-4 relative focus:bg-gray-10"
                {...tree().elements.item({
                  id: itemId,
                  hasChildren,
                })}
              >
                <div
                  class={`${getIcon({
                    item: treeItem,
                    isExpanded: tree().helpers.isExpanded(itemId),
                  })} text-lg`}
                />
                <span class="select-none">{name}</span>
                {tree().helpers.isSelected(itemId) ? (
                  <div
                    class={`${icons["highlight"]} text-lg absolute right-0 translate-x-[calc(100%_+_0.25rem)]`}
                  />
                ) : null}
              </button>
              {isDirectory(treeItem) && hasChildren ? (
                <ul {...tree().elements.group({ id: itemId })}>
                  <TreeInner
                    treeItems={treeItem.children}
                    level={props.level + 1}
                  />
                </ul>
              ) : null}
            </li>
          );
        }}
      </For>
    </>
  );
};

export const TreeSolid = () => {
  console.log("TreeSolid");
  const cmp = useComponent(createTree);

  const { expandAll, collapseAll } = cmp().helpers;
  return (
    <Context.Provider value={cmp}>
      <div class="flex items-center gap-8">
        <button
          class="font-mono text-xs text-gray-8 hover:text-gray-4"
          onClick={expandAll}
        >
          Expand all
        </button>
        <div class="w-px h-16 bg-gray-8" aria-hidden="true" />
        <button
          class="font-mono text-xs text-gray-8 hover:text-gray-4"
          onClick={collapseAll}
        >
          Collapse all
        </button>
      </div>

      <ul class="mbs-8" {...cmp().elements.tree}>
        <TreeInner treeItems={data} />
      </ul>
    </Context.Provider>
  );
};
