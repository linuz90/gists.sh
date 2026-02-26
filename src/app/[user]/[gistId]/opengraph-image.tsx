import { fetchGist } from "@/lib/github";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Gist on gists.sh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ user: string; gistId: string }>;
}) {
  const { user, gistId } = await params;

  const [geistSemiBold, geistRegular, geistMono] = await Promise.all([
    readFile(
      join(
        process.cwd(),
        "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf",
      ),
    ),
    readFile(
      join(
        process.cwd(),
        "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf",
      ),
    ),
    readFile(
      join(
        process.cwd(),
        "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf",
      ),
    ),
  ]);

  const gist = await fetchGist(gistId);
  const files = gist ? Object.values(gist.files) : [];
  const firstFile = files[0];
  const filename = firstFile?.filename || "Untitled";
  const description = gist?.description || null;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "hsl(0, 0%, 4%)",
        padding: "72px 80px",
      }}
    >
      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Description (primary) */}
        <span
          style={{
            fontSize: 40,
            fontFamily: "Geist",
            fontWeight: 600,
            color: "hsl(0, 0%, 98%)",
            letterSpacing: "-0.02em",
            lineClamp: 3,
            overflow: "hidden",
          }}
        >
          {description
            ? description.length > 140
              ? description.slice(0, 137) + "..."
              : description
            : filename.length > 45
              ? filename.slice(0, 42) + "..."
              : filename}
        </span>

        {/* Filename (secondary, only show when description exists) */}
        {description && (
          <span
            style={{
              fontSize: 34,
              fontFamily: "GeistMono",
              fontWeight: 400,
              color: "hsl(0, 0%, 50%)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {filename}
          </span>
        )}
      </div>

      {/* Footer: author + gists.sh branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src={`https://github.com/${user}.png?size=120`}
            alt=""
            width={50}
            height={50}
            style={{ borderRadius: "50%" }}
          />
          <span
            style={{
              fontSize: 34,
              fontFamily: "Geist",
              fontWeight: 600,
              color: "hsl(0, 0%, 45%)",
            }}
          >
            {user}
          </span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistSemiBold,
          weight: 600,
          style: "normal",
        },
        {
          name: "Geist",
          data: geistRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "GeistMono",
          data: geistMono,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
