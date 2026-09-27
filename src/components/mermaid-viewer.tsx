"use client";

import { Maximize, Minus, Plus, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface View {
  x: number;
  y: number;
  scale: number;
}

interface Point {
  x: number;
  y: number;
}

// Safari reports trackpad pinches as non-standard gesture events
interface GestureEvent extends UIEvent {
  scale: number;
  clientX: number;
  clientY: number;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 8;
const MAX_FIT_SCALE = 2;
const FIT_PADDING = 48;
const FIT_PADDING_MOBILE = 16;
const ZOOM_STEP = 1.25;

const clampScale = (scale: number) =>
  Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

// Scales around (px, py) so the point under the cursor or fingers stays put
function zoomAt(view: View, scale: number, px: number, py: number): View {
  const next = clampScale(scale);
  const k = next / view.scale;
  return { scale: next, x: px - (px - view.x) * k, y: py - (py - view.y) * k };
}

interface MermaidViewerProps {
  svg: string;
  onClose: () => void;
}

// Full-screen pan and zoom view for a rendered Mermaid diagram. The stage is
// fixed at inset 0, so client coordinates double as stage coordinates.
export function MermaidViewer({ svg, onClose }: MermaidViewerProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const pointersRef = useRef(new Map<number, Point>());
  const [view, setView] = useState<View>({ x: 0, y: 0, scale: 1 });

  const fit = useCallback(() => {
    const { width, height } = sizeRef.current;
    if (!width || !height) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = vw < 640 ? FIT_PADDING_MOBILE : FIT_PADDING;
    const scale = Math.min(
      (vw - padding * 2) / width,
      (vh - padding * 2) / height,
      MAX_FIT_SCALE,
    );
    setView({
      scale,
      x: (vw - width * scale) / 2,
      y: (vh - height * scale) / 2,
    });
  }, []);

  const zoomBy = useCallback((factor: number) => {
    setView((v) =>
      zoomAt(
        v,
        v.scale * factor,
        window.innerWidth / 2,
        window.innerHeight / 2,
      ),
    );
  }, []);

  // Mermaid sizes its SVG to the page column; render it at natural size and
  // let the transform do the scaling. Injected here rather than through
  // dangerouslySetInnerHTML, which re-applied the original markup on re-render.
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    content.innerHTML = svg;
    const el = content.querySelector("svg");
    if (!el) return;
    const { width, height } = el.viewBox.baseVal;
    el.setAttribute("width", String(width));
    el.setAttribute("height", String(height));
    el.style.maxWidth = "none";
    sizeRef.current = { width, height };
    fit();
  }, [svg, fit]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    // Capture phase + stopPropagation keeps page shortcuts (page-copy-buttons)
    // from firing behind the viewer
    function handleKeyDown(e: KeyboardEvent) {
      e.stopPropagation();
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoomBy(ZOOM_STEP);
      else if (e.key === "-") zoomBy(1 / ZOOM_STEP);
      else if (e.key === "0") fit();
    }

    document.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("resize", fit);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("resize", fit);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [onClose, zoomBy, fit]);

  // Wheel and gesture listeners must be non-passive to stop the browser from
  // scrolling or zooming the page underneath.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      // Trackpad pinches arrive as ctrl+wheel; cap mouse wheel notches
      if (e.ctrlKey || e.metaKey) {
        const delta = Math.max(-30, Math.min(30, e.deltaY));
        setView((v) =>
          zoomAt(v, v.scale * Math.exp(-delta * 0.01), e.clientX, e.clientY),
        );
      } else {
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      }
    }

    let gestureScale = 1;
    function handleGestureStart(e: Event) {
      e.preventDefault();
      gestureScale = 1;
    }
    function handleGestureChange(e: Event) {
      e.preventDefault();
      const { scale, clientX, clientY } = e as GestureEvent;
      const factor = scale / gestureScale;
      gestureScale = scale;
      setView((v) => zoomAt(v, v.scale * factor, clientX, clientY));
    }

    stage.addEventListener("wheel", handleWheel, { passive: false });
    stage.addEventListener("gesturestart", handleGestureStart);
    stage.addEventListener("gesturechange", handleGestureChange);
    return () => {
      stage.removeEventListener("wheel", handleWheel);
      stage.removeEventListener("gesturestart", handleGestureStart);
      stage.removeEventListener("gesturechange", handleGestureChange);
    };
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }

  function handlePointerMove(e: React.PointerEvent) {
    const pointers = pointersRef.current;
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const next = { x: e.clientX, y: e.clientY };

    if (pointers.size === 1) {
      setView((v) => ({
        ...v,
        x: v.x + next.x - prev.x,
        y: v.y + next.y - prev.y,
      }));
    } else if (pointers.size === 2) {
      // Pinch: zoom by the change in finger distance, pan by the midpoint
      const other = [...pointers].find(([id]) => id !== e.pointerId)![1];
      const prevDist = Math.hypot(prev.x - other.x, prev.y - other.y);
      const nextDist = Math.hypot(next.x - other.x, next.y - other.y);
      const prevMid = { x: (prev.x + other.x) / 2, y: (prev.y + other.y) / 2 };
      const nextMid = { x: (next.x + other.x) / 2, y: (next.y + other.y) / 2 };
      setView((v) => {
        const zoomed = zoomAt(
          v,
          (v.scale * nextDist) / prevDist,
          prevMid.x,
          prevMid.y,
        );
        return {
          ...zoomed,
          x: zoomed.x + nextMid.x - prevMid.x,
          y: zoomed.y + nextMid.y - prevMid.y,
        };
      });
    }
    pointers.set(e.pointerId, next);
  }

  function handlePointerUp(e: React.PointerEvent) {
    pointersRef.current.delete(e.pointerId);
  }

  return createPortal(
    <div
      ref={stageRef}
      role="dialog"
      aria-modal="true"
      aria-label="Diagram viewer"
      className="fixed inset-0 z-50 overflow-hidden bg-white dark:bg-neutral-950 cursor-grab active:cursor-grabbing touch-none select-none animate-in fade-in-0 duration-150"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        ref={contentRef}
        className="absolute top-0 left-0 origin-top-left"
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
        }}
      />

      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close"
        className={`absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] w-10 h-10 rounded-full ${FLOATING_SURFACE} ${ICON_BUTTON}`}
      >
        <X size={18} />
      </button>

      <div
        className={`absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 flex items-center gap-0.5 p-1 rounded-full ${FLOATING_SURFACE}`}
      >
        <button
          onClick={() => zoomBy(1 / ZOOM_STEP)}
          aria-label="Zoom out"
          className={`w-8 h-8 rounded-full ${ICON_BUTTON}`}
        >
          <Minus size={16} />
        </button>
        <span className="min-w-12 text-center text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
          {Math.round(view.scale * 100)}%
        </span>
        <button
          onClick={() => zoomBy(ZOOM_STEP)}
          aria-label="Zoom in"
          className={`w-8 h-8 rounded-full ${ICON_BUTTON}`}
        >
          <Plus size={16} />
        </button>
        <div className="mx-1 h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
        <button
          onClick={fit}
          aria-label="Fit to screen"
          className={`w-8 h-8 rounded-full ${ICON_BUTTON}`}
        >
          <Maximize size={15} />
        </button>
      </div>
    </div>,
    document.body,
  );
}

// Matches the table of contents button
const FLOATING_SURFACE =
  "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-overlay dark:shadow-overlay-dark";
const ICON_BUTTON =
  "flex items-center justify-center cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors outline-none focus-visible:!outline-none focus-visible:!shadow-focus";
