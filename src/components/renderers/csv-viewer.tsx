"use client";

import { isTSV } from "@/lib/github";
import { ChevronDown, ChevronUp } from "lucide-react";
import Papa from "papaparse";
import { useMemo, useState } from "react";

interface CsvViewerProps {
  content: string;
  filename: string;
}

const MAX_ROWS = 500;

type SortDirection = "asc" | "desc";

function compareValues(a: unknown, b: unknown, dir: SortDirection): number {
  // Nulls always go last regardless of direction
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  const mult = dir === "asc" ? 1 : -1;

  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * mult;
  }

  return String(a).localeCompare(String(b)) * mult;
}

export function CsvViewer({ content, filename }: CsvViewerProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const delimiter = isTSV(filename) ? "\t" : undefined;
  const result = useMemo(
    () =>
      Papa.parse<Record<string, unknown>>(content, {
        header: true,
        dynamicTyping: true,
        delimiter,
        skipEmptyLines: true,
      }),
    [content, delimiter]
  );

  const headers = result.meta.fields ?? [];
  const totalRows = result.data.length;
  const isTruncated = totalRows > MAX_ROWS;

  const rows = useMemo(() => {
    if (!sortColumn) return result.data.slice(0, MAX_ROWS);
    const sorted = [...result.data].sort((a, b) =>
      compareValues(a[sortColumn], b[sortColumn], sortDirection)
    );
    return sorted.slice(0, MAX_ROWS);
  }, [result.data, sortColumn, sortDirection]);

  if (result.errors.length > 0 && result.data.length === 0) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400">
        Failed to parse CSV: {result.errors[0].message}
      </div>
    );
  }

  if (rows.length === 0) {
    return <p className="text-sm text-neutral-500">Empty file</p>;
  }

  function handleSort(header: string) {
    if (sortColumn === header) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        // Third click: reset to unsorted
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(header);
      setSortDirection("asc");
    }
  }

  return (
    <div className="text-[13px]">
      <p className="text-xs text-neutral-500 mb-3 font-mono">
        {isTruncated
          ? sortColumn
            ? `Top ${MAX_ROWS} of ${totalRows} rows by ${sortColumn}`
            : `Showing first ${MAX_ROWS} of ${totalRows} rows`
          : `${totalRows} ${totalRows === 1 ? "row" : "rows"}`}
      </p>
      <div className="overflow-auto max-h-[70vh] rounded-md border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-1">
            <tr className="bg-neutral-50 dark:bg-neutral-900/50">
              {headers.map((header) => (
                <th
                  key={header}
                  onClick={() => handleSort(header)}
                  className="px-3 py-1.5 text-left font-medium text-neutral-500 dark:text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 whitespace-nowrap bg-neutral-50 dark:bg-neutral-900/50 cursor-pointer select-none hover:text-neutral-800 dark:hover:text-neutral-300 transition-colors"
                >
                  <span className="inline-flex items-center gap-1">
                    {header}
                    {sortColumn === header &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="size-3" />
                      ) : (
                        <ChevronDown className="size-3" />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={
                  i < rows.length - 1
                    ? "border-b border-neutral-100 dark:border-neutral-800/50"
                    : ""
                }
              >
                {headers.map((header) => {
                  const value = row[header];
                  const isNumber = typeof value === "number";
                  return (
                    <td
                      key={header}
                      className={`px-3 py-1.5 font-mono whitespace-nowrap ${
                        isNumber
                          ? "text-right text-blue-600 dark:text-blue-400"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {value === null || value === undefined ? (
                        <span className="text-neutral-300 dark:text-neutral-700">
                          -
                        </span>
                      ) : typeof value === "boolean" ? (
                        <span
                          className={
                            value
                              ? "text-green-700 dark:text-green-400"
                              : "text-neutral-500"
                          }
                        >
                          {String(value)}
                        </span>
                      ) : (
                        String(value)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
