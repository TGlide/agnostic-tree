<script context="module" lang="ts">
  type Icon = "svelte" | "folder" | "js";

  export type TreeItem = {
    title: string;
    children?: TreeItem[];
  };

  export const icons = {
    svelte: "i-logos-svelte-icon",
    folder: "i-solar-folder-2-bold-duotone",
    folderOpen: "i-solar-folder-open-bold-duotone",
    js: "i-logos-javascript",
    highlight: "i-solar-arrow-left-bold",
    unknown: "i-solar-question-circle-bold",
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

  function getIcon(item: TreeItem, id: string) {
    if (item.children) {
      return $isExpanded(id) ? icons.folderOpen : icons.folder;
    }

    const fileExt = item.title.split(".").pop();
    return icons[fileExt as Icon] ?? icons.unknown;
  }
</script>

{#each treeItems as treeItem, i}
  {@const { title, children } = treeItem}
  {@const itemId = `${title}-${i}`}
  {@const hasChildren = !!children?.length}

  <li class={level !== 1 ? "pl-4" : ""}>
    <button
      class="flex items-center gap-4 rounded-md p-4 relative
			focus:bg-neutral-700 focus:ring focus:ring-neutral-100 focus:outline-none"
      {...$item({
        id: itemId,
        hasChildren,
      })}
      use:item.action
    >
      <!-- Add icon. -->
      <div class="{getIcon(treeItem, itemId)} text-lg" />

      <span class="select-none">{title}</span>

      <!-- Selected icon. -->
      {#if $isSelected(itemId)}
        <div
          class="{icons[
            'highlight'
          ]} text-lg absolute right-0 translate-x-[calc(100%_+_0.25rem)]"
        />
      {/if}
    </button>

    {#if children}
      <ul {...$group({ id: itemId })} use:group.action>
        <svelte:self treeItems={children} level={level + 1} />
      </ul>
    {/if}
  </li>
{/each}
