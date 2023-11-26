import { atom } from "nanostores";
import { last } from "../helpers/array";
import { computedObj } from "../helpers/computedObj";
import { isHidden } from "../helpers/dom";
import { isHtmlElement, isLetter } from "../helpers/is";
import { kbd } from "../helpers/keyboard";
import { makeComponent, type MadeComponent } from "../makeComponent";
import { makeElement } from "../makeElement";

const ATTRS = {
  TABINDEX: "tabindex",
  EXPANDED: "aria-expanded",
  LABELLEDBY: "aria-labelledby",
  DATAID: "data-id",
} as const;

export const createTree = makeComponent(() => {
  /**
   * Track currently focused item in the tree.
   */
  const lastFocusedId = atom<string | null>(null);
  const selectedItem = atom<HTMLElement | null>(null);

  const expanded = atom<string[]>([]);

  const selectedId = computedObj({ selectedItem }, ({ $selectedItem }) => {
    return $selectedItem?.getAttribute("data-id");
  });

  /**
   * Determines if the tree view item is selected.
   * This is useful for displaying additional markup.
   */
  const isSelected = computedObj({ selectedItem }, ({ $selectedItem }) => {
    return (itemId: string) =>
      $selectedItem?.getAttribute("data-id") === itemId;
  });

  /**
   * Determines if a tree view item is collapsed or not.
   * This is useful for displaying additional markup or using Svelte transitions
   * on the group item.
   */
  const isExpanded = computedObj({ expanded }, ({ $expanded }) => {
    return (itemId: string) => $expanded.includes(itemId);
  });

  const rootTree = makeElement({
    dependencies: {},
    getAttributes() {
      return {
        role: "tree",
        "data-tree-root": "",
      } as const;
    },
  });

  let isKeydown = false;
  const item = makeElement({
    dependencies: { expanded, selectedId, lastFocusedId },
    getAttributes({ $expanded, $selectedId, $lastFocusedId }) {
      return (opts: { id: string; hasChildren?: boolean }) => {
        // Have some default options that can be passed to the create()
        const { id, hasChildren } = opts;

        let tabindex = 0;
        if ($lastFocusedId !== null) {
          tabindex = $lastFocusedId === id ? 0 : -1;
        }
        return {
          role: "treeitem",
          "aria-selected": $selectedId === id,
          "data-id": id,
          tabindex,
          "aria-expanded": hasChildren ? $expanded.includes(id) : undefined,
        };
      };
    },
    listeners: {
      keydown(e) {
        const node = e.currentTarget;
        if (!isHtmlElement(node)) return;

        const { key } = e;

        const keyIsLetter = isLetter(key);

        const keys = [
          kbd.ARROW_DOWN,
          kbd.ARROW_UP,
          kbd.ARROW_LEFT,
          kbd.ARROW_RIGHT,
          kbd.ENTER,
          kbd.SPACE,
          kbd.END,
          kbd.HOME,
          kbd.ASTERISK,
        ] as const;

        if (!keys.includes(key) && !keyIsLetter) {
          return;
        }

        const rootEl = node.closest('[data-tree-root=""]');

        if (
          !isHtmlElement(rootEl) ||
          node.getAttribute("role") !== "treeitem"
        ) {
          return;
        }

        const items = getItems(rootEl);
        const nodeIdx = items.findIndex((item) => item === node);

        if (key !== kbd.ENTER && key !== kbd.SPACE) {
          e.preventDefault();
        }

        if (key === kbd.ENTER || key === kbd.SPACE) {
          // Select el
          updateSelectedElement(node);
          isKeydown = true;
        } else if (key === kbd.ARROW_DOWN && nodeIdx !== items.length - 1) {
          // Focus next el
          const nextItem = items[nodeIdx + 1];
          if (!nextItem) return;
          setFocusedItem(nextItem);
        } else if (key === kbd.ARROW_UP && nodeIdx !== 0) {
          // Focus previous el
          const prevItem = items[nodeIdx - 1];
          if (!prevItem) return;
          setFocusedItem(prevItem);
        } else if (key === kbd.HOME && nodeIdx !== 0) {
          // Focus first el
          const item = items[0];
          if (!item) return;
          setFocusedItem(item);
        } else if (key === kbd.END && nodeIdx != items.length - 1) {
          // Focus last el
          const item = last(items);
          if (!item) return;
          setFocusedItem(item);
        } else if (key === kbd.ARROW_LEFT) {
          if (elementIsExpanded(node)) {
            // Collapse group
            toggleChildrenElements(node);
          } else {
            // Focus parent group
            const parentGroup = node?.closest('[role="group"]');
            const groupId = parentGroup?.getAttribute("data-group-id");
            const item = items.find(
              (item) => item.getAttribute("data-id") === groupId
            );
            if (!item) return;
            setFocusedItem(item as HTMLElement);
          }
        } else if (key === kbd.ARROW_RIGHT) {
          if (elementIsExpanded(node)) {
            // Focus first child
            const nextItem = items[nodeIdx + 1];
            if (!nextItem) return;
            setFocusedItem(nextItem);
          } else if (elementHasChildren(node)) {
            // Expand group
            toggleChildrenElements(node);
          }
        } else if (keyIsLetter) {
          /**
           * Check whether a value with the letter exists
           * after the current focused element and focus it,
           * if it does exist. If it does not exist, we check
           * previous values.
           */
          const values = items.map((item) => {
            return {
              value: item.textContent?.toLowerCase().trim(),
              id: item.getAttribute("data-id"),
            };
          });

          let nextFocusIdx = -1;

          // Check elements after currently focused one.
          let foundNextFocusable = values.slice(nodeIdx + 1).some((item, i) => {
            if (item.value?.toLowerCase()[0] === key) {
              nextFocusIdx = nodeIdx + 1 + i;
              return true;
            }

            return false;
          });

          if (!foundNextFocusable) {
            /**
             * Check elements before currently focused one,
             * if no index has been found yet.
             * */
            foundNextFocusable = values.slice(0, nodeIdx).some((item, i) => {
              if (item.value?.toLowerCase().at(0) === key) {
                nextFocusIdx = i;
                return true;
              }

              return false;
            });
          }

          if (foundNextFocusable && values[nextFocusIdx].id) {
            const nextFocusEl = items[nextFocusIdx];
            if (!nextFocusEl) return;
            setFocusedItem(nextFocusEl);
          }
        }
      },
      click(e) {
        const node = e.currentTarget;
        if (!isHtmlElement(node)) return;

        updateSelectedElement(node);
        setFocusedItem(node);
        if (!isKeydown) {
          toggleChildrenElements(node);
        }
        isKeydown = false;
      },
      focus(e) {
        const node = e.currentTarget;
        if (!isHtmlElement(node)) return;

        lastFocusedId.set(node.getAttribute("data-id") ?? lastFocusedId.get());
      },
    },
  });

  const group = makeElement({
    dependencies: { expanded },
    getAttributes: ({ $expanded }) => {
      return (opts: { id: string }) => ({
        role: "group",
        "data-group-id": opts.id,
        hidden: !$expanded.includes(opts.id) ? true : undefined,
      });
    },
  });

  function setFocusedItem(el: HTMLElement) {
    lastFocusedId.set(el.getAttribute("data-id") ?? lastFocusedId.get());
    el.focus();
  }

  function updateSelectedElement(el: HTMLElement) {
    const id = el.getAttribute(ATTRS.DATAID);
    if (!id) return;

    selectedItem.set(el);
  }

  function getItems(rootEl: HTMLElement): HTMLElement[] {
    let items = [] as HTMLElement[];

    // Select all 'treeitem' li elements within our root element.
    items = Array.from(rootEl.querySelectorAll('[role="treeitem"]')).filter(
      (el) => !isHidden(el as HTMLElement)
    ) as HTMLElement[];

    return items;
  }

  function getElementAttributes(el: HTMLElement) {
    const hasChildren = el.hasAttribute(ATTRS.EXPANDED);
    const expanded = el.getAttribute(ATTRS.EXPANDED);
    const dataId = el.getAttribute(ATTRS.DATAID);

    return {
      hasChildren,
      expanded,
      dataId,
    };
  }

  function toggleChildrenElements(el: HTMLElement) {
    const {
      hasChildren,
      expanded: expandedAttr,
      dataId,
    } = getElementAttributes(el);
    if (!hasChildren || expandedAttr === null || dataId === null) return;

    if (expandedAttr === "false") {
      expanded.set([...expanded.get(), dataId]);
    } else {
      expanded.set(expanded.get().filter((item) => item !== dataId));
    }
  }

  function elementHasChildren(el: HTMLElement) {
    return el.hasAttribute(ATTRS.EXPANDED);
  }

  function elementIsExpanded(el: HTMLElement) {
    return el.getAttribute(ATTRS.EXPANDED) === "true";
  }

  return {
    elements: {
      tree: rootTree,
      item,
      group,
    },
    states: {
      expanded,
      selectedItem,
    },
    helpers: {
      isExpanded,
      isSelected,
    },
  };
});

export type Tree = MadeComponent<typeof createTree>;
