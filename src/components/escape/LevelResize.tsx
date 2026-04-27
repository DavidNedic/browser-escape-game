import { useEffect, useState } from "react";
import type { LevelProps } from "./types";

/**
 * Verändere die Fenstergröße, bis die Breite in einem schmalen Zielbereich ist.
 * Auf Mobile: Gerät drehen, oder Browser-UI ein-/ausblenden.
 */
const MIN = 480;
const MAX = 560;

export function LevelResize({ onSolve }: LevelProps) {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const inRange = w >= MIN && w <= MAX;
  const center = (MIN + MAX) / 2;
  const dist = Math.abs(w - center);

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Schrumpfe den Raum.
      </p>

      <div className="w-full max-w-xl">
        <div className="relative h-2 rounded-full bg-muted/30">
          {/* Target zone */}
          <div
            className="absolute top-0 h-full rounded-full bg-primary/40"
            style={{
              left: `${(MIN / 1600) * 100}%`,
              width: `${((MAX - MIN) / 1600) * 100}%`,
            }}
          />
          {/* Marker */}
          <div
            className="absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary"
            style={{
              left: `${Math.min(100, (w / 1600) * 100)}%`,
              boxShadow: "0 0 10px var(--neon-glow)",
            }}
          />
        </div>
        <div className="mt-3 flex justify-between font-mono text-xs text-muted-foreground">
          <span>0</span>
          <span className="text-foreground">{w}px</span>
          <span>1600</span>
        </div>
      </div>

      <p className="max-w-md text-center text-xs text-muted-foreground/60">
        {inRange
          ? "Stillhalten…"
          : dist < 100
            ? "Beinahe. Sanfter."
            : "Zieh am Fensterrand. Mache es schmaler oder breiter."}
      </p>

      {inRange && (
        <button
          onClick={onSolve}
          className="btn-neon room-enter rounded-md px-8 py-3 text-sm uppercase tracking-[0.3em]"
        >
          Weiter →
        </button>
      )}
    </div>
  );
}
