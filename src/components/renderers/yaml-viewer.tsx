import { DataTreeViewer } from "@/components/renderers/data-tree-viewer";
import { parse } from "yaml";

interface YamlViewerProps {
  content: string;
}

export function YamlViewer({ content }: YamlViewerProps) {
  let parsed: unknown;
  try {
    parsed = parse(content);
  } catch (e) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400">
        Failed to parse YAML:{" "}
        {e instanceof Error ? e.message : "Unknown error"}
      </div>
    );
  }

  return <DataTreeViewer data={parsed} />;
}
