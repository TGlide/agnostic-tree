<script lang="ts" context="module">
  export type TreeComponent = SvelteComponent<Tree>;

  const setCtx = (ctx: TreeComponent) => {
    setContext("tree", ctx);
  };

  export const getCtx = () => getContext<TreeComponent>("tree");
</script>

<script lang="ts">
  import { getContext, setContext } from "svelte";

  import { data } from "@/data";
  import { withComponent, type SvelteComponent } from "@/lib/adapters/svelte";
  import { createTree, type Tree } from "@/lib/builders/tree";
  import TreeInner from "./TreeInner.svelte";

  const ctx = withComponent(createTree());
  setCtx(ctx);

  const {
    elements: { tree },
    helpers: { expandAll, collapseAll },
  } = ctx;
</script>

<div class="flex items-center gap-8">
  <button
    class="font-mono text-xs text-gray-8 hover:text-gray-4"
    on:click={expandAll}
  >
    Expand all
  </button>
  <div class="w-px h-16 bg-gray-8" aria-hidden="true" />
  <button
    class="font-mono text-xs text-gray-8 hover:text-gray-4"
    on:click={collapseAll}
  >
    Collapse all
  </button>
</div>

<ul class="mbs-8" {...$tree}>
  <TreeInner treeItems={data} />
</ul>
