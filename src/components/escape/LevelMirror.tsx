import { useEffect, useRef, useState } from "react";
import type { LevelProps } from "./types";

/**
 * Spiegelwelt: Der echte Cursor ist versteckt, ein Fake-Cursor bewegt sich
 * auf X-Achse INVERTIERT. Treffe den Knopf in der Ecke.
 */
export function LevelMirror({ onSolve }: LevelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPos({ x: rect.width - x, y });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Hit detection on fake cursor against button area (top-right 80x80)
  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const inX = pos.x > rect.width - 100 && pos.x < rect.width - 20;
    const inY = pos.y > 20 && pos.y < 100;
    setHover(inX && inY);
  }, [pos]);

  return (
    <div
      ref={ref}
      onClick={() => hover && onSolve()}
      className="room-enter relative min-h-screen w-full overflow-hidden bg-background"
      style={{ cursor: "none" }}
    >
      <p className="pt-12 text-center text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Der Spiegel lügt. Vertraue ihm trotzdem.
      </p>

      {/* Target */}
      <button
        className={`absolute right-5 top-5 h-20 w-20 rounded-full border transition-all ${
          hover ? "border-primary bg-primary/30" : "border-border bg-muted/20"
        }`}
        style={{
          boxShadow: hover ? "0 0 30px var(--neon-glow)" : "none",
          cursor: "none",
        }}
      />

      {/* Fake cursor */}
      <div
        className="pointer-events-none absolute h-4 w-4 rounded-full bg-primary"
        style={{
          left: pos.x - 8,
          top: pos.y - 8,
          boxShadow: "0 0 12px var(--neon-glow)",
        }}
      />
    </div>
  );
}
