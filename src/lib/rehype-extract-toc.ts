import type { Element, Root } from "hast";
import { headingRank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";
import type { TocEntry } from "./toc";

export function rehypeExtractToc(entries: TocEntry[]) {
  return () => (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const rank = headingRank(node);
      if (rank && rank <= 3) {
        const id = (node.properties?.id as string) ?? "";
        const text = toString(node);
        if (id && text) {
          entries.push({ id, text, level: rank });
        }
      }
    });
  };
}
