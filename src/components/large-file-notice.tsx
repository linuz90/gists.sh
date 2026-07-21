import { Download } from "lucide-react";

interface LargeFileNoticeProps {
  downloadUrl: string;
  fileSize: number;
  previewLimit: number;
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
  previewLimit,
}: LargeFileNoticeProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-5 dark:border-neutral-800 dark:bg-neutral-900/50">
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
        This file is too large to preview
      </p>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        At {formatFileSize(fileSize)}, it exceeds the safe preview limit of{" "}
        {formatFileSize(previewLimit)}. Download the complete file to view it
        without slowing down this page.
      </p>
      <a
        href={downloadUrl}
        download
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        <Download size={14} aria-hidden="true" />
        Download raw file
      </a>
    </div>
  );
}
