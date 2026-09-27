"use client";

import { MermaidViewer } from "@/components/mermaid-viewer";
import type { Mermaid } from "mermaid";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

const EXPAND_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/></svg>`;

interface RenderedDiagram {
  id: string;
  svg: string;
}

const renderedDiagrams = new WeakMap<HTMLElement, RenderedDiagram>();
let renderCount = 0;

// mermaid.initialize() is global, so overlapping runs (the system theme
// resolving, then ?theme= forcing another) would render with each other's
// config. Chaining every run makes the latest theme always win.
let renderQueue: Promise<void> = Promise.resolve();

// Mermaid's default node shadows are hard and offset; the site is flat
const FLAT_THEME_VARIABLES = { dropShadow: "none" };

// Mermaid's own dark themes are colorful, so dark mode gets a grayscale
// palette to match the "neutral" light theme. Hex, not the Tailwind CSS
// vars: Mermaid derives shades from these and can't parse oklch.
const DARK_THEME_VARIABLES = {
  darkMode: true,
  background: "#0a0a0a", // neutral-950
  primaryColor: "#262626", // neutral-800
  primaryTextColor: "#e5e5e5", // neutral-200
  primaryBorderColor: "#525252", // neutral-600
  secondaryColor: "#404040", // neutral-700
  tertiaryColor: "#171717", // neutral-900
  lineColor: "#a3a3a3", // neutral-400
  textColor: "#d4d4d4", // neutral-300
  edgeLabelBackground: "#0a0a0a", // page background, not pure black
  // Derived pie shades are too close to the background, so set them
  pie1: "#737373",
  pie2: "#404040",
  pie3: "#a3a3a3",
  pie4: "#262626",
  pie5: "#525252",
  pie6: "#8a8a8a",
  pie7: "#333333",
  pie8: "#636363",
  pieStrokeColor: "#0a0a0a",
  pieOuterStrokeColor: "#0a0a0a",
  pieSectionTextColor: "#fafafa",
  xyChart: { plotColorPalette: "#a3a3a3, #e5e5e5, #737373, #d4d4d4" },
  // Mindmap and timeline sections cycle through cScale
  ...Object.fromEntries(
    ["#404040", "#525252", "#333333", "#636363", "#2a2a2a", "#737373"].flatMap(
      (color, i) => [
        [`cScale${i}`, color],
        [`cScale${i + 6}`, color],
        [`cScaleLabel${i}`, "#fafafa"],
        [`cScaleLabel${i + 6}`, "#fafafa"],
      ],
    ),
  ),
};

// Block diagrams JSON.stringify D3 selections, which reference <html>, and
// React hydration leaves circular fiber props on it. Giving <html> a toJSON
// short-circuits the walk. https://github.com/mermaid-js/mermaid/issues/7907
function guardHtmlSerialization() {
  Object.defineProperty(document.documentElement, "toJSON", {
    value: () => "html",
    configurable: true,
  });
}

async function renderBlock(mermaid: Mermaid, block: HTMLElement) {
  // Keep the original source so theme switches can re-render
  const source = (block.dataset.source ??= block.textContent ?? "");
  const id = `gists-mermaid-${++renderCount}`;
  try {
    const { svg } = await mermaid.render(id, source);
    block.innerHTML = svg;
    const width = block.querySelector("svg")?.viewBox.baseVal.width;
    if (width) block.style.setProperty("--diagram-width", `${width}px`);

    const button = document.createElement("button");
    button.className = "mermaid-expand-btn";
    button.setAttribute("aria-label", "View diagram full screen");
    button.innerHTML = EXPAND_SVG;
    block.append(button);

    block.dataset.rendered = "true";
    renderedDiagrams.set(block, { id, svg });
  } catch {
    // Leave the source visible so the diagram is still readable
    block.textContent = source;
    block.style.removeProperty("--diagram-width");
    delete block.dataset.rendered;
    renderedDiagrams.delete(block);
  }
}

// Renders the .mermaid-diagram blocks emitted by rehypeMermaidBlocks.
// Mermaid needs a real DOM to measure text, so it can't run on the server,
// and it's large, so it's only imported on pages that contain a diagram.
export function MermaidRenderer() {
  // resolvedTheme ignores ?theme= overrides (see providers.tsx), so
  // prefer the forced theme when there is one
  const { forcedTheme, resolvedTheme } = useTheme();
  const theme = forcedTheme ?? resolvedTheme;
  const [expanded, setExpanded] = useState<RenderedDiagram | null>(null);
  const close = useCallback(() => setExpanded(null), []);

  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>(
      ".markdown-body .mermaid-diagram",
    );
    if (blocks.length === 0 || !theme) return;

    let cancelled = false;
    renderQueue = renderQueue
      .then(async () => {
        if (cancelled) return;
        const { default: mermaid } = await import("mermaid");
        if (cancelled) return;
        guardHtmlSerialization();
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          suppressErrorRendering: true,
          ...(theme === "dark"
            ? {
                theme: "base",
                themeVariables: {
                  ...FLAT_THEME_VARIABLES,
                  ...DARK_THEME_VARIABLES,
                },
              }
            : { theme: "neutral", themeVariables: FLAT_THEME_VARIABLES }),
          fontFamily: getComputedStyle(document.body).fontFamily,
        });
        for (const block of blocks) {
          if (cancelled) return;
          await renderBlock(mermaid, block);
        }
      })
      // A failed chunk load leaves the sources visible; keep the queue usable
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [theme]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const block = (e.target as HTMLElement).closest<HTMLElement>(
        ".markdown-body .mermaid-diagram[data-rendered]",
      );
      const diagram = block && renderedDiagrams.get(block);
      if (diagram) setExpanded(diagram);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!expanded) return null;

  // The SVG's <style> and arrow markers are scoped by its id, so the copy in
  // the viewer needs its own id to avoid clashing with the inline diagram.
  const viewerSvg = expanded.svg.replaceAll(expanded.id, `${expanded.id}-full`);
  return <MermaidViewer svg={viewerSvg} onClose={close} />;
}
