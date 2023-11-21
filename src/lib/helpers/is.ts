export const isLetter = (key: string) => /^[a-z]$/i.test(key);

export const isHtmlElement = (element: unknown): element is HTMLElement => {
  return element instanceof HTMLElement;
};
