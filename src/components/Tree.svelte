<script lang="ts" context="module">
  export type TreeComponent = SvelteComponent<Tree>;

  const setCtx = (ctx: TreeComponent) => {
    setContext("tree", ctx);
  };

  export const getCtx = () => getContext<TreeComponent>("tree");
</script>

<script lang="ts">
  import { getContext, setContext } from "svelte";

  import type { TreeItem } from "./TreeInner.svelte";
  import TreeInner from "./TreeInner.svelte";
  import { createTree, type Tree } from "@/lib/tree";
  import { withComponent, type SvelteComponent } from "@/lib/adapters/svelte";

  const ctx = withComponent(createTree());
  setCtx(ctx);

  const {
    elements: { tree },
  } = ctx;

  const treeItems: TreeItem[] = [
    { title: "index.svelte", icon: "svelte" },
    {
      title: "lib",
      icon: "folder",
      children: [
        {
          title: "tree",
          icon: "folder",
          children: [
            {
              title: "Tree.svelte",
              icon: "svelte",
            },
            {
              title: "TreeView.svelte",
              icon: "svelte",
            },
          ],
        },
        {
          title: "icons",
          icon: "folder",
          children: [
            { title: "JS.svelte", icon: "svelte" },
            { title: "Svelte.svelte", icon: "svelte" },
          ],
        },
        {
          title: "index.js",
          icon: "js",
        },
      ],
    },
    {
      title: "routes",
      icon: "folder",
      children: [
        {
          title: "contents",
          icon: "folder",
          children: [
            {
              title: "+layout.svelte",
              icon: "svelte",
            },
            {
              title: "+page.svelte",
              icon: "svelte",
            },
          ],
        },
      ],
    },
  ];
</script>

<div
  class="flex h-[18.75rem] w-[18.75rem] flex-col rounded-xl bg-white text-neutral-900 md:h-[350px]"
>
  <div class="flex flex-col gap-1 px-4 pt-4">
    <h3 class="text-lg font-bold">Project Structure</h3>
    <hr />
  </div>

  <ul class="overflow-auto px-4 pb-4 pt-2" {...$tree}>
    <TreeInner {treeItems} />
  </ul>
</div>
