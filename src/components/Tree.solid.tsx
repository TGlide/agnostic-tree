/** @jsxImportSource solid-js */

import { useComponent, type SolidComponent } from "@/lib/adapters/solid";
import { createTree } from "@/lib/builders/tree";
import { For, createContext, mergeProps, useContext } from "solid-js";

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
  treeItems: TreeItem[];
  level?: number;
};

const TreeInner = (p: TreeInnerProps) => {
  const props = mergeProps({ level: 1 }, p);
  const tree = useTreeContext();

  function getIcon(item: TreeItem, id: string) {
    if (item.children) {
      return tree().helpers.isExpanded(id) ? icons.folderOpen : icons.folder;
    }

    const fileExt = item.title.split(".").pop();
    return icons[fileExt as Icon] ?? icons.unknown;
  }

  return (
    <>
      <For each={props.treeItems}>
        {(treeItem, i) => {
          const { title, children } = treeItem;
          const itemId = `${title}-${i()}`;
          const hasChildren = !!children?.length;

          return (
            <li class={props.level !== 1 ? "pl-4" : ""}>
              <button
                class="flex items-center gap-4 rounded-md p-4 relative focus:bg-neutral-700 focus:ring focus:ring-neutral-100 focus:outline-none"
                {...tree().elements.item({
                  id: itemId,
                  hasChildren,
                })}
              >
                <div class={`${getIcon(treeItem, itemId)} text-lg`} />
                <span class="select-none">{title}</span>
                {tree().helpers.isSelected(itemId) ? (
                  <div
                    class={`${icons["highlight"]} text-lg absolute right-0 translate-x-[calc(100%_+_0.25rem)]`}
                  />
                ) : null}
              </button>
              {children ? (
                <ul {...tree().elements.group({ id: itemId })}>
                  <TreeInner treeItems={children} level={props.level + 1} />
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
  const cmp = useComponent(createTree);

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

  return (
    <Context.Provider value={cmp}>
      <div class="grid w-full h-full place-items-center overflow-y-auto">
        <ul class="py-4 px-16" {...cmp().elements.tree}>
          <TreeInner treeItems={treeItems} />
        </ul>
      </div>
    </Context.Provider>
  );
};
