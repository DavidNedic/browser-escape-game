import { useEffect, useRef, useState } from "react";
import type { LevelProps } from "./types";

export function Level4Flee({ onSolve }: LevelProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [hint, setHint] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Show hint after 8s of frustration
  useEffect(() => {
    const t = setTimeout(() => setHint(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const teleport = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const padding = 24;
    const w = btn.offsetWidth;
    const h = btn.offsetHeight;
    const maxX = window.innerWidth - w - padding;
    const maxY = window.innerHeight - h - padding;
    const x = Math.max(padding, Math.random() * maxX);
    const y = Math.max(padding, Math.random() * maxY);
    setPos({ x, y });
  };

  const style: React.CSSProperties = pos
    ? { position: "fixed", left: pos.x, top: pos.y, transform: "none" }
    : { position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)" };

  return (
    <div className="room-enter min-h-screen overflow-hidden">
      <div className="flex min-h-screen flex-col items-center justify-start gap-4 px-4 pt-32">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Aufgabe
        </p>
        <h2 className="text-glow text-2xl font-light tracking-wide md:text-3xl">
          Fang den Knopf.
        </h2>
        <p
          className={`mt-8 max-w-md text-center text-xs text-muted-foreground/70 transition-opacity duration-1000 ${
            hint ? "opacity-100" : "opacity-0"
          }`}
        >
          Manchmal hilft die Maus nicht weiter. ⌨
        </p>
      </div>

      <button
        ref={btnRef}
        onMouseEnter={teleport}
        onFocus={teleport}
        onClick={onSolve}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSolve();
          }
        }}
        style={{ ...style, transition: "left 0.15s ease, top 0.15s ease" }}
        className="btn-neon z-10 rounded-md px-6 py-3 text-sm uppercase tracking-[0.2em]"
      >
        Klick mich, um weiterzukommen
      </button>
    </div>
  );
}
