<script lang="ts">
  import { getCtx } from "./Tree.svelte";
  import { getIcon, type FileTree, icons, isDirectory } from "@/data";

  export let treeItems: FileTree;
  export let level = 1;

  const {
    elements: { item, group },
    helpers: { isExpanded, isSelected },
  } = getCtx();
</script>

{#each treeItems as treeItem, i}
  {@const name = treeItem.name}
  {@const itemId = `${name}-${i}`}
  {@const hasChildren = treeItem.kind === "directory" && !!treeItem.children}

  <li class={level !== 1 ? "mis-12 pis-12 border-l bc-gray-10" : ""}>
    <button
      class="flex items-center gap-4 rounded-md p-4 relative focus:bg-gray-10"
      {...$item({
        id: itemId,
        hasChildren,
      })}
      use:item.action
    >
      <!-- Add icon. -->
      <div
        class="{getIcon({
          item: treeItem,
          isExpanded: $isExpanded(itemId),
        })} text-lg"
      />

      <span class="select-none">{name}</span>

      <!-- Selected icon. -->
      {#if $isSelected(itemId)}
        <div
          class="{icons.highlight} text-lg absolute right-0 translate-x-[calc(100%_+_0.25rem)]"
        />
      {/if}
    </button>

    {#if isDirectory(treeItem) && hasChildren}
      <ul {...$group({ id: itemId })} use:group.action>
        <svelte:self treeItems={treeItem.children} level={level + 1} />
      </ul>
    {/if}
  </li>
{/each}
