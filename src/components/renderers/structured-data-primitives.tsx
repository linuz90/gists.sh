export function isPrimitive(value: unknown): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export function isArrayOfPrimitives(
  value: unknown,
): value is (string | number | boolean)[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((v) => isPrimitive(v))
  );
}

export function isArrayOfObjects(
  value: unknown,
): value is Record<string, unknown>[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (v) => typeof v === "object" && v !== null && !Array.isArray(v),
    )
  );
}

// Returns true if all values in all objects are primitives, null, or arrays of primitives.
// When false, the data is too complex for a flat table and should use tree view instead.
export function isFlatArrayOfObjects(
  value: Record<string, unknown>[],
): boolean {
  return value.every((obj) =>
    Object.values(obj).every(
      (v) => v == null || isPrimitive(v) || isArrayOfPrimitives(v),
    ),
  );
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function PrimitivePills({ items }: { items: (string | number | boolean)[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-xs"
        >
          {String(item)}
        </span>
      ))}
    </div>
  );
}

export function ObjectTable({ items }: { items: Record<string, unknown>[] }) {
  const allKeys = [...new Set(items.flatMap((obj) => Object.keys(obj)))];

  return (
    <div className="overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-neutral-50 dark:bg-neutral-900/50">
            {allKeys.map((key) => (
              <th
                key={key}
                className="px-3 py-1.5 text-left font-medium text-neutral-500 dark:text-neutral-500 border-b border-neutral-200 dark:border-neutral-800"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={i}
              className={
                i < items.length - 1
                  ? "border-b border-neutral-100 dark:border-neutral-800/50"
                  : ""
              }
            >
              {allKeys.map((key) => (
                <td
                  key={key}
                  className="px-3 py-1.5 text-neutral-700 dark:text-neutral-300"
                >
                  <TableCellValue value={item[key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableCellValue({ value }: { value: unknown }) {
  if (value == null) {
    return (
      <span className="text-neutral-300 dark:text-neutral-700">-</span>
    );
  }
  if (typeof value === "boolean") {
    return <BooleanChip value={value} />;
  }
  if (typeof value === "number") {
    return (
      <span className="font-mono text-blue-600 dark:text-blue-400">
        {value}
      </span>
    );
  }
  if (isArrayOfPrimitives(value)) {
    return <PrimitivePills items={value} />;
  }
  if (isPrimitive(value)) {
    return <span className="font-mono">{String(value)}</span>;
  }
  return (
    <span className="font-mono text-neutral-400">
      {JSON.stringify(value)}
    </span>
  );
}

export function BooleanChip({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md font-mono text-xs ${
        value
          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500"
      }`}
    >
      {String(value)}
    </span>
  );
}

export function FrontmatterValue({ value }: { value: unknown }) {
  if (typeof value === "boolean") {
    return <BooleanChip value={value} />;
  }

  if (isPrimitive(value)) {
    return (
      <span className="text-neutral-900 dark:text-neutral-200">
        {String(value)}
      </span>
    );
  }

  if (isArrayOfPrimitives(value)) {
    return <PrimitivePills items={value} />;
  }

  if (isArrayOfObjects(value)) {
    return <ObjectTable items={value} />;
  }

  if (isPlainObject(value)) {
    return <NestedObject data={value} />;
  }

  // Fallback for mixed arrays or other types
  if (Array.isArray(value)) {
    return (
      <PrimitivePills
        items={value.map((v) =>
          typeof v === "string" || typeof v === "number"
            ? v
            : JSON.stringify(v),
        )}
      />
    );
  }

  return (
    <span className="text-neutral-500 font-mono text-xs">
      {JSON.stringify(value)}
    </span>
  );
}

export function NestedObject({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data);

  return (
    <div className="flex flex-col gap-2 pl-4 border-l-2 border-neutral-100 dark:border-neutral-800">
      {entries.map(([key, value]) => {
        const isComplex = isPlainObject(value) || isArrayOfObjects(value);

        return isComplex ? (
          <div key={key} className="flex flex-col gap-2">
            <span className="text-xs font-mono font-medium text-neutral-400 dark:text-neutral-600">
              {key}
            </span>
            <FrontmatterValue value={value} />
          </div>
        ) : (
          <div key={key} className="flex items-center gap-3">
            <span className="shrink-0 text-xs font-medium text-neutral-400 dark:text-neutral-600">
              {key}
            </span>
            <FrontmatterValue value={value} />
          </div>
        );
      })}
    </div>
  );
}
