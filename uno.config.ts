// uno.config.ts
import { defineConfig, type DynamicMatcher, type Rule } from "unocss";
import { colors } from "./src/styles/color";
import presetIcons from "@unocss/preset-icons";
import presetUno from "@unocss/preset-uno";

function pxToRem(num: number) {
  return `${num / 16}rem`;
}

const colorRules: Rule[] = [
  ["color", "color"],
  ["text", "color"],
  ["bg", "background-color"],
  ["bc", "border-color"],
].map(([prefix, property]) => [
  new RegExp(`^${prefix}-(.+)$`),
  ((match) => {
    if (!Object.keys(colors).includes(match[1])) {
      return;
    }

    return { [property]: `var(--clr-${match[1]});` };
  }) as DynamicMatcher,
]);

const spacingRules: Rule[] = [
  ["m", "margin"],
  ["mi", "margin-inline"],
  ["mis", "margin-inline-start"],
  ["mie", "margin-inline-end"],
  ["mblock", "margin-block"],
  ["mblck", "margin-block"],
  ["mk", "margin-block"],
  ["mbs", "margin-block-start"],
  ["mks", "margin-block-start"],
  ["mbe", "margin-block-end"],
  ["mke", "margin-block-end"],
  ["p", "padding"],
  ["pi", "padding-inline"],
  ["pis", "padding-inline-start"],
  ["pie", "padding-inline-end"],
  ["pblock", "padding-block"],
  ["pblck", "padding-block"],
  ["pk", "padding-block"],
  ["pbs", "padding-block-start"],
  ["pks", "padding-block-start"],
  ["pbe", "padding-block-end"],
  ["pke", "padding-block-end"],
  ["w", "width"],
  ["h", "height"],
  ["min-w", "min-width"],
  ["min-h", "min-height"],
  ["square", "width", "height"],
  ["gap", "gap"],
  ["right", "right"],
  ["left", "left"],
  ["top", "top"],
  ["bottom", "bottom"],
  ["inset", "inset"],
  ["text", "font-size"],
  ["rounded", "border-radius"],
].map(([prefix, ...properties]) => [
  new RegExp(`^${prefix}-(\\d+)$`),
  ((match) => {
    const num = parseInt(match[1]);
    const value = Number.isNaN(num) ? match[1] : pxToRem(num);

    return Object.fromEntries(properties.map((property) => [property, value]));
  }) as DynamicMatcher,
]);

export default defineConfig({
  rules: [...colorRules, ...spacingRules],
  presets: [presetUno(), presetIcons()],
});
