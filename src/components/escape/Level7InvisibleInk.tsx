import { useEffect, useRef, useState } from "react";
import type { LevelProps } from "./types";

export function Level7InvisibleInk({ onSolve }: LevelProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [solved, setSolved] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const tokenRef = useRef<HTMLSpanElement | null>(null);

  // Pointer-based dragging (works with mouse + touch)
  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      setPos({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      });
    };
    const onUp = (e: PointerEvent) => {
      setDragging(false);
      const cornerX = window.innerWidth - 160;
      const cornerY = window.innerHeight - 160;
      if (e.clientX >= cornerX && e.clientY >= cornerY) {
        setSolved(true);
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  const startDrag = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const el = tokenRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setPos({ x: rect.left, y: rect.top });
    setDragging(true);
  };

  const positioned = pos !== null;

  return (
    <div
      className="relative min-h-screen w-full select-text bg-white text-white"
      style={{ caretColor: "transparent" }}
    >
      {/* Drop zone — only visible while dragging */}
      <div
        className="pointer-events-none fixed bottom-0 right-0 h-40 w-40 transition-opacity"
        style={{
          opacity: dragging ? 1 : 0,
          background:
            "radial-gradient(circle at bottom right, rgba(0,0,0,0.08), transparent 70%)",
          border: dragging ? "1px dashed rgba(0,0,0,0.2)" : "none",
        }}
      />

      {/* The hidden text — white on white. Selectable to reveal. */}
      <div className="flex min-h-screen items-center justify-center px-6">
        {!positioned && (
          <span
            ref={tokenRef}
            onPointerDown={startDrag}
            className="cursor-grab text-lg font-light tracking-wide"
            style={{ userSelect: "text" }}
          >
            Markiere mich nicht, sondern ziehe mich in die Ecke.
          </span>
        )}
      </div>

      {positioned && (
        <span
          ref={tokenRef}
          onPointerDown={startDrag}
          className="fixed z-40 cursor-grabbing rounded px-2 py-1 text-lg font-light tracking-wide text-black shadow-lg"
          style={{
            left: pos!.x,
            top: pos!.y,
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(0,0,0,0.15)",
            userSelect: "none",
            touchAction: "none",
          }}
        >
          Markiere mich nicht, sondern ziehe mich in die Ecke.
        </span>
      )}

      {/* Reveal button after drop */}
      {solved && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={onSolve}
            className="rounded-md border border-black bg-white px-6 py-3 text-xs uppercase tracking-[0.4em] text-black shadow-md transition-colors hover:bg-black hover:text-white"
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}
