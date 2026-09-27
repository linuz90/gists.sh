import type { Element, Root } from "hast";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

/**
 * Turns ```mermaid fences into <div class="mermaid-diagram"> holding the raw
 * source, so Shiki skips them and <MermaidRenderer> can swap in the SVG
 * client-side. Must run before rehypeShiki.
 */
export function rehypeMermaidBlocks() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || typeof index !== "number") {
        return;
      }
      const code = node.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code",
      );
      const classes = code?.properties.className;
      if (
        !code ||
        !Array.isArray(classes) ||
        !classes.includes("language-mermaid")
      ) {
        return;
      }
      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["mermaid-diagram"] },
        children: [{ type: "text", value: toString(code) }],
      };
    });
  };
}
