/** @jsxImportSource react */

import { data, getIcon, type FileTree, isDirectory, icons } from "@/data";
import { useComponent, type ReactComponent } from "@/lib/adapters/react";
import { createTree } from "@/lib/builders/tree";
import { createContext, useContext } from "react";

type TreeComponent = ReactComponent<typeof createTree>;

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

const TreeInner = ({ level = 1, treeItems }: TreeInnerProps) => {
  const ctx = useTreeContext();
  const {
    elements: { item, group },
    helpers: { isExpanded, isSelected },
  } = ctx;

  return (
    <>
      {treeItems.map((treeItem, i) => {
        const { name } = treeItem;
        const itemId = `${name}-${i}`;
        const hasChildren =
          treeItem.kind === "directory" && !!treeItem.children;

        return (
          <li
            className={level !== 1 ? "mis-12 pis-12 border-l bc-gray-10" : ""}
            key={itemId}
          >
            <button
              className="flex items-center gap-4 rounded-md p-4 relative focus:bg-gray-10"
              {...item({
                id: itemId,
                hasChildren,
              })}
            >
              <div
                className={`${getIcon({
                  item: treeItem,
                  isExpanded: isExpanded(itemId),
                })} text-lg`}
              />

              <span className="select-none">{name}</span>

              {isSelected(itemId) ? (
                <div
                  className={`${icons["highlight"]} text-lg absolute right-0 translate-x-[calc(100%_+_0.25rem)]`}
                />
              ) : null}
            </button>

            {isDirectory(treeItem) && hasChildren ? (
              <ul {...group({ id: itemId })}>
                <TreeInner treeItems={treeItem.children} level={level + 1} />
              </ul>
            ) : null}
          </li>
        );
      })}
    </>
  );
};

export const TreeReact = () => {
  const cmp = useComponent(createTree);

  return (
    <Context.Provider value={cmp}>
      <div className="flex items-center gap-8">
        <button
          className="font-mono text-xs text-gray-8 hover:text-gray-4"
          onClick={cmp.helpers.expandAll}
        >
          Expand all
        </button>
        <div className="w-px h-16 bg-gray-8" aria-hidden="true" />
        <button
          className="font-mono text-xs text-gray-8 hover:text-gray-4"
          onClick={cmp.helpers.collapseAll}
        >
          Collapse all
        </button>
      </div>

      <ul className="mbs-8" {...cmp.elements.tree}>
        <TreeInner treeItems={data} />
      </ul>
    </Context.Provider>
  );
};
