"use client";

import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { ReactNode } from "react";
import { useState } from "react";

type ViewMode = "pretty" | "raw";

interface StructuredFileViewerProps {
  children: ReactNode;
  rawHtml: string;
  rawContent: string;
}

export function StructuredFileViewer({
  children,
  rawHtml,
  rawContent,
}: StructuredFileViewerProps) {
  const [mode, setMode] = useState<ViewMode>("pretty");

  return (
    <div>
      <div className="mb-6">
        <SegmentedControl
          id="structured-file-toggle"
          options={[
            { value: "pretty" as const, label: "Pretty" },
            { value: "raw" as const, label: "Raw" },
          ]}
          value={mode}
          onChange={setMode}
        />
      </div>

      {mode === "pretty" ? (
        children
      ) : (
        <div className="code-block-wrapper relative">
          <CopyButton
            text={rawContent}
            label="Copy code"
            className="code-copy-btn"
          />
          <div
            className="text-[13px] leading-relaxed [&_pre]:rounded-lg [&_pre]:p-5 [&_pre]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: rawHtml }}
          />
        </div>
      )}
    </div>
  );
}
