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
  import { createTree, type Tree } from "@/lib/builders/tree";
  import { withComponent, type SvelteComponent } from "@/lib/adapters/svelte";

  const ctx = withComponent(createTree());
  setCtx(ctx);

  const {
    elements: { tree },
  } = ctx;

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
</script>

<div class="grid w-full h-full place-items-center overflow-y-auto">
  <ul class="py-4 px-16" {...$tree}>
    <TreeInner {treeItems} />
  </ul>
</div>
