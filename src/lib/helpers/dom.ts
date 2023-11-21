export function isHidden(el: HTMLElement): boolean {
  return el.offsetParent === null;
}

export function getElByDataAttr(attribute: string, value: string) {
  return document.querySelector(`[data-${attribute}="${value}"]`);
}
