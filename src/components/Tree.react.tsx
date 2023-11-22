import {
  adaptElement,
  useComponent,
  type ReactComponent,
} from "@/lib/adapters/react";
import { createTree, type Tree } from "@/lib/tree";
import { createContext, useContext } from "react";

type Icon = "svelte" | "folder" | "js";

type TreeItem = {
  title: string;
  children?: TreeItem[];
};

const icons = {
  svelte: "i-logos-svelte-icon",
  folder: "i-solar-folder-2-bold-duotone",
  folderOpen: "i-solar-folder-open-bold-duotone",
  js: "i-logos-javascript",
  highlight: "i-solar-arrow-left-bold",
  unknown: "i-solar-question-circle-bold",
};

type TreeComponent = ReactComponent<Tree>;

const Context = createContext<TreeComponent | null>(null);

const useTreeContext = () => {
  const ctx = useContext(Context);

  if (!ctx) {
    throw new Error("Missing context");
  }

  return ctx;
};

type TreeInnerProps = {
  treeItems: TreeItem[];
  level?: number;
};

const TreeInner = ({ level = 1, treeItems }: TreeInnerProps) => {
  const ctx = useTreeContext();
  const {
    elements: { item, group },
    helpers: { isExpanded, isSelected },
  } = ctx;
  console.log({ ctx, item, group });

  function getIcon(item: TreeItem, id: string) {
    if (item.children) {
      return isExpanded.get()(id) ? icons.folderOpen : icons.folder;
    }

    const fileExt = item.title.split(".").pop();
    return icons[fileExt as Icon] ?? icons.unknown;
  }

  return (
    <>
      {treeItems.map((treeItem, i) => {
        const { title, children } = treeItem;
        const itemId = `${title}-${i}`;
        const hasChildren = !!children?.length;

        return (
          <li className={level !== 1 ? "pl-4" : ""} key={itemId}>
            <button
              className="flex items-center gap-4 rounded-md p-4 relative
          focus:bg-neutral-700 focus:ring focus:ring-neutral-100 focus:outline-none"
              {...item({
                id: itemId,
                hasChildren,
              })}
            >
              <div className={`${getIcon(treeItem, itemId)} text-lg`} />

              <span className="select-none">{title}</span>

              {isSelected.get()(itemId) ? (
                <div
                  className={`${icons["highlight"]} text-lg absolute right-0 translate-x-[calc(100%_+_0.25rem)]`}
                />
              ) : null}
            </button>

            {children ? (
              <ul {...group({ id: itemId })}>
                <TreeInner treeItems={children} level={level + 1} />
              </ul>
            ) : null}
          </li>
        );
      })}
    </>
  );
};

export const TreeReact = () => {
  const cmp = useComponent(createTree());

  const treeItems: TreeItem[] = [
    { title: "index.js" },
    {
      title: "lib",
      children: [
        {
          title: "tree",
          children: [
            {
              title: "Tree.svelte",
            },
            {
              title: "TreeView.svelte",
            },
          ],
        },
        {
          title: "icons",
          children: [{ title: "JS.svelte" }, { title: "Svelte.svelte" }],
        },
        {
          title: "index.js",
        },
      ],
    },
    {
      title: "routes",
      children: [
        {
          title: "contents",
          children: [
            {
              title: "+layout.svelte",
            },
            {
              title: "+page.svelte",
            },
          ],
        },
      ],
    },
  ];

  console.log({ cmp });

  return (
    <Context.Provider value={cmp}>
      <div className="grid w-full h-full place-items-center overflow-y-auto">
        <ul className="py-4 px-16" {...cmp.elements.tree}>
          <TreeInner treeItems={treeItems} />
        </ul>
      </div>
    </Context.Provider>
  );
};
