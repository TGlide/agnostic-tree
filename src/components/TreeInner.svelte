<script context="module" lang="ts">
  type Icon = "svelte" | "folder" | "js";

  export type TreeItem = {
    title: string;
    icon: Icon;

    children?: TreeItem[];
  };

  export const icons = {
    svelte: "i-logos-svelte-icon",
    folder: "i-logos-svelte",
    folderOpen: "i-logos-svelte",
    js: "i-logos-svelte",
    highlight: "i-logos-svelte",
  };
</script>

<script lang="ts">
  import { getCtx } from "./Tree.svelte";

  export let treeItems: TreeItem[];
  export let level = 1;

  const {
    elements: { item, group },
    helpers: { isExpanded, isSelected },
  } = getCtx();
</script>

{#each treeItems as { title, icon, children }, i}
  {@const itemId = `${title}-${i}`}
  {@const hasChildren = !!children?.length}

  <li class={level !== 1 ? "pl-4" : ""}>
    <button
      class="flex items-center gap-1 rounded-md p-1 focus:bg-magnum-200"
      {...$item({
        id: itemId,
        hasChildren,
      })}
      use:item.action
    >
      <!-- Add icon. -->
      {#if icon === "folder" && hasChildren && $isExpanded(itemId)}
        <div class="{icons['folderOpen']} h-4 w-4" />
      {:else}
        <div class="{icons[icon]} h-4 w-4" />
      {/if}

      <span class="select-none">{title}</span>

      <!-- Selected icon. -->
      {#if $isSelected(itemId)}
        <div class="{icons['highlight']} h-4 w-4" />
      {/if}
    </button>

    {#if children}
      <ul {...$group({ id: itemId })} use:group.action>
        <svelte:self treeItems={children} level={level + 1} />
      </ul>
    {/if}
  </li>
{/each}

<style>
  /* Remove docs' focus box-shadow styling. */
  li:focus {
    box-shadow: none !important;
  }
</style>
