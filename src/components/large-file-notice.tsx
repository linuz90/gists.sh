import {
  type FilePreviewStatus,
  MAX_INLINE_PREVIEW_BYTES,
  MAX_RAW_FILE_BYTES,
  MAX_TOTAL_INLINE_PREVIEW_BYTES,
} from "@/lib/file-preview";
import { Download, ExternalLink } from "lucide-react";

interface LargeFileNoticeProps {
  downloadUrl: string | null;
  fileSize: number;
  githubUrl: string;
  status: Exclude<FilePreviewStatus, "available">;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.ceil(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function LargeFileNotice({
  downloadUrl,
  fileSize,
  githubUrl,
  status,
}: LargeFileNoticeProps) {
  const rawFileUnavailable = fileSize > MAX_RAW_FILE_BYTES;
  const gistBudgetExceeded = status === "gist-budget-exceeded";

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-5 dark:border-neutral-800 dark:bg-neutral-900/50">
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
        {gistBudgetExceeded
          ? "This gist is too large to preview in full"
          : "This file is too large to preview"}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {rawFileUnavailable ? (
          <>
            GitHub requires files larger than 10 MB to be cloned to access their
            complete contents.
          </>
        ) : gistBudgetExceeded ? (
          <>
            Previews are limited to{" "}
            {formatFileSize(MAX_TOTAL_INLINE_PREVIEW_BYTES)} across all files to
            keep this page responsive. Download this complete file instead.
          </>
        ) : (
          <>
            At {formatFileSize(fileSize)}, it exceeds the safe preview limit of{" "}
            {formatFileSize(MAX_INLINE_PREVIEW_BYTES)}. Download the complete
            file to view it without slowing down this page.
          </>
        )}
      </p>
      <a
        href={downloadUrl ?? githubUrl}
        {...(downloadUrl
          ? { download: true }
          : { target: "_blank", rel: "noopener noreferrer" })}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        {downloadUrl ? (
          <Download size={14} aria-hidden="true" />
        ) : (
          <ExternalLink size={14} aria-hidden="true" />
        )}
        {downloadUrl ? "Download raw file" : "View on GitHub"}
      </a>
    </div>
  );
}
