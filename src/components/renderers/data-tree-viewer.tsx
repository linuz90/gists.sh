"use client";

import {
  BooleanChip,
  ObjectTable,
  PrimitivePills,
  isArrayOfObjects,
  isArrayOfPrimitives,
  isFlatArrayOfObjects,
  isPlainObject,
} from "@/components/renderers/structured-data-primitives";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";

interface DataTreeViewerProps {
  data: unknown;
}

// Check if a value renders as a collapsible (complex) node
function isComplexValue(value: unknown): boolean {
  if (isArrayOfPrimitives(value)) return false;
  return (
    isArrayOfObjects(value) || Array.isArray(value) || isPlainObject(value)
  );
}

// Top-level arrays of objects: use table only when values are simple primitives,
// otherwise render as expandable tree nodes so nested data is browsable
export function DataTreeViewer({ data }: DataTreeViewerProps) {
  if (isArrayOfObjects(data) && isFlatArrayOfObjects(data)) {
    return (
      <div className="text-[13px]">
        <p className="text-xs text-neutral-500 mb-3 font-mono">
          {data.length} {data.length === 1 ? "item" : "items"}
        </p>
        <ObjectTable items={data} />
      </div>
    );
  }

  // Flatten root object: render entries directly without collapsible wrapper
  if (isPlainObject(data)) {
    return (
      <div className="text-[13px] font-mono">
        <ObjectEntries data={data} depth={0} />
      </div>
    );
  }

  return (
    <div className="text-[13px] font-mono">
      <JsonNode value={data} depth={0} defaultExpanded />
    </div>
  );
}

// Grid-based key-value rendering for aligned columns
function ObjectEntries({
  data,
  depth,
}: {
  data: Record<string, unknown>;
  depth: number;
}) {
  const entries = Object.entries(data);

  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 items-start">
      {entries.map(([key, value], i) => {
        const complex = isComplexValue(value);
        const prevComplex = i > 0 && isComplexValue(entries[i - 1][1]);
        // Extra spacing around complex entries for visual grouping
        const spacing = cn(
          i > 0 && (complex || prevComplex) && "mt-2",
          i > 0 && !complex && !prevComplex && "mt-1",
        );

        return (
          <Fragment key={key}>
            <span
              className={cn("text-neutral-500 dark:text-neutral-500", spacing)}
            >
              {key}
            </span>
            <div className={spacing}>
              <JsonNode
                value={value}
                depth={depth + 1}
                defaultExpanded={depth < 1}
              />
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

interface JsonNodeProps {
  value: unknown;
  depth: number;
  defaultExpanded?: boolean;
}

function JsonNode({ value, depth, defaultExpanded }: JsonNodeProps) {
  // Primitives
  if (value === null) {
    return (
      <span className="text-neutral-400 dark:text-neutral-600 italic">
        null
      </span>
    );
  }

  if (typeof value === "boolean") {
    return <BooleanChip value={value} />;
  }

  if (typeof value === "number") {
    return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
  }

  if (typeof value === "string") {
    return (
      <span className="text-green-700 dark:text-green-400">
        &quot;{value}&quot;
      </span>
    );
  }

  // Arrays of primitives
  if (isArrayOfPrimitives(value)) {
    return <PrimitivePills items={value} />;
  }

  // Arrays of flat objects render as table, complex ones fall through to generic array
  if (isArrayOfObjects(value) && isFlatArrayOfObjects(value)) {
    return (
      <CollapsibleNode
        depth={depth}
        defaultExpanded={defaultExpanded}
        preview={`[${value.length} ${value.length === 1 ? "item" : "items"}]`}
      >
        <ObjectTable items={value} />
      </CollapsibleNode>
    );
  }

  // Generic arrays
  if (Array.isArray(value)) {
    return (
      <CollapsibleNode
        depth={depth}
        defaultExpanded={defaultExpanded}
        preview={`[${value.length} ${value.length === 1 ? "item" : "items"}]`}
      >
        <div className="flex flex-col gap-1">
          {value.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="shrink-0 text-neutral-300 dark:text-neutral-700 select-none">
                {i}
              </span>
              <JsonNode
                value={item}
                depth={depth + 1}
                defaultExpanded={depth < 1}
              />
            </div>
          ))}
        </div>
      </CollapsibleNode>
    );
  }

  // Objects
  if (isPlainObject(value)) {
    const keys = Object.keys(value);
    return (
      <CollapsibleNode
        depth={depth}
        defaultExpanded={defaultExpanded}
        preview={`{${keys.length} ${keys.length === 1 ? "key" : "keys"}}`}
      >
        <ObjectEntries data={value} depth={depth} />
      </CollapsibleNode>
    );
  }

  // Fallback
  return <span className="text-neutral-500">{JSON.stringify(value)}</span>;
}

interface CollapsibleNodeProps {
  depth: number;
  defaultExpanded?: boolean;
  preview: string;
  children: React.ReactNode;
}

function CollapsibleNode({
  depth,
  defaultExpanded,
  preview,
  children,
}: CollapsibleNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? depth < 2);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded px-1 -mx-1 transition-colors"
      >
        <ChevronRight
          size={14}
          className={cn(
            "shrink-0 text-neutral-400 transition-transform duration-150",
            expanded && "rotate-90",
          )}
        />
        <span className="text-neutral-400 dark:text-neutral-600">
          {preview}
        </span>
      </button>
      {expanded && (
        <div className="mt-1 ml-[6px] pl-[12px] border-l first-of-type:pt-1 last-of-type:pb-1 border-neutral-200 dark:border-neutral-800">
          {children}
        </div>
      )}
    </div>
  );
}
