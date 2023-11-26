<script lang="ts" context="module">
  export type TreeComponent = RunesComponent<Tree>;

  const setCtx = (ctx: TreeComponent) => {
    setContext("tree", ctx);
  };

  export const getCtx = () => getContext<TreeComponent>("tree");
</script>

<script lang="ts">
  import { getContext, setContext } from "svelte";

  import { data } from "@/data";
  import { withRunes, type RunesComponent } from "@/lib/adapters/runes.svelte";
  import { createTree, type Tree } from "@/lib/builders/tree";
  import TreeInner from "./TreeInner.runes.svelte";

  const tree = withRunes(createTree());
  setCtx(tree);
</script>

<div class="flex items-center gap-8">
  <button
    class="font-mono text-xs text-gray-8 hover:text-gray-4"
    onclick={tree.helpers.expandAll}
  >
    Expand all
  </button>
  <div class="w-px h-16 bg-gray-8" aria-hidden="true" />
  <button
    class="font-mono text-xs text-gray-8 hover:text-gray-4"
    onclick={tree.helpers.collapseAll}
  >
    Collapse all
  </button>
</div>

<ul class="mbs-8" {...tree.elements.tree}>
  <TreeInner treeItems={data} />
</ul>
