import { useEffect, useRef, useState } from "react";
import type { LevelProps } from "./types";

/**
 * Dunkler Raum, ein kleiner Lichtkegel folgt der Maus. Knopf irgendwo finden.
 */
export function LevelDarkroom({ onSolve }: LevelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -200, y: -200 });
  // random spot per mount
  const [target] = useState(() => ({
    left: 10 + Math.random() * 70,
    top: 25 + Math.random() * 55,
  }));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="room-enter relative min-h-screen w-full overflow-hidden bg-background"
    >
      <button
        onClick={onSolve}
        className="absolute h-12 w-12 rounded-full border border-primary/60 bg-primary/30"
        style={{
          left: `${target.left}%`,
          top: `${target.top}%`,
          boxShadow: "0 0 20px var(--neon-glow)",
        }}
        aria-label="versteckter Ausgang"
      />
      <p className="absolute left-1/2 top-8 -translate-x-1/2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Folge dem Licht.
      </p>

      {/* Dark overlay with hole */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle 120px at ${pos.x}px ${pos.y}px, transparent 0%, rgba(0,0,0,0.5) 60%, oklch(0.05 0.01 270) 100%)`,
        }}
      />
    </div>
  );
}
