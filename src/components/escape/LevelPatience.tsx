import { useEffect, useState } from "react";
import type { LevelProps } from "./types";

/**
 * 20 Sekunden absolut nichts tun. Keine Maus, keine Tasten.
 */
const TARGET = 20;

export function LevelPatience({ onSolve }: LevelProps) {
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      setSeconds((s) => {
        const next = s + (now - last) / 1000;
        last = now;
        if (next >= TARGET) {
          setDone(true);
          return TARGET;
        }
        return next;
      });
    }, 100);

    const reset = () => {
      if (!done) setSeconds(0);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("click", reset);
    window.addEventListener("scroll", reset);
    window.addEventListener("touchstart", reset);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("click", reset);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("touchstart", reset);
    };
  }, [done]);

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-6">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Stille ist die Lösung.
      </p>
      <div className="font-mono text-7xl text-foreground tabular-nums">
        {seconds.toFixed(1)}
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground/60">
        Bewege nichts. Atme leise. Bei jeder Eingabe beginnt die Zeit von vorn.
      </p>

      {done && (
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
