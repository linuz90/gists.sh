import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "gists.sh — Gists, but beautiful";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const geistSemiBold = await readFile(
    join(
      process.cwd(),
      "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf",
    ),
  );
  const geistMono = await readFile(
    join(
      process.cwd(),
      "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf",
    ),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsl(0, 0%, 4%)",
        gap: "20px",
      }}
    >
      {/* Title row: icon + gists.sh */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <svg
          width="46"
          height="46"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "relative", top: 2 }}
        >
          <path
            d="M11 4V11.5C11 11.8978 11.158 12.2794 11.4393 12.5607C11.7206 12.842 12.1022 13 12.5 13H20"
            stroke="hsl(0, 0%, 98%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 6C3 4.34315 4.34315 3 6 3H9.75736C10.553 3 11.3161 3.31607 11.8787 3.87868L20.1213 12.1213C20.6839 12.6839 21 13.447 21 14.2426V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z"
            stroke="hsl(0, 0%, 98%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            fontSize: 48,
            fontFamily: "Geist",
            fontWeight: 600,
            color: "hsl(0, 0%, 98%)",
          }}
        >
          gists.sh
        </span>
      </div>

      {/* Subtitle */}
      <span
        style={{
          fontSize: 34,
          fontFamily: "GeistMono",
          fontWeight: 400,
          color: "hsl(0, 0%, 55%)",
        }}
      >
        Gists, but beautiful
      </span>
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
          name: "GeistMono",
          data: geistMono,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
