interface PreviewFile {
  filename: string;
  size: number;
  truncated?: boolean;
}

export type FilePreviewStatus =
  | "available"
  | "file-too-large"
  | "gist-budget-exceeded";

/**
 * Highlighted code and structured viewers can expand source files into DOM
 * trees more than ten times larger than the input. These limits bound both an
 * individual panel and the aggregate work from eagerly rendered gist tabs.
 */
export const MAX_INLINE_PREVIEW_BYTES = 128 * 1024;
export const MAX_TOTAL_INLINE_PREVIEW_BYTES = 256 * 1024;

/** GitHub requires cloning a gist to retrieve files larger than 10 MB. */
export const MAX_RAW_FILE_BYTES = 10_000_000;

export function getFilePreviewStatuses(
  files: readonly PreviewFile[],
): Map<string, FilePreviewStatus> {
  const statuses = new Map<string, FilePreviewStatus>();
  let previewedBytes = 0;

  for (const file of files) {
    if (file.truncated || file.size > MAX_INLINE_PREVIEW_BYTES) {
      statuses.set(file.filename, "file-too-large");
      continue;
    }

    if (previewedBytes + file.size > MAX_TOTAL_INLINE_PREVIEW_BYTES) {
      statuses.set(file.filename, "gist-budget-exceeded");
      continue;
    }

    statuses.set(file.filename, "available");
    previewedBytes += file.size;
  }

  return statuses;
}

export function canFetchFullRawFile(file: Pick<PreviewFile, "size">): boolean {
  return file.size <= MAX_RAW_FILE_BYTES;
}
