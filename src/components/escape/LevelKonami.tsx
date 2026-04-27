import { useEffect, useState } from "react";
import type { LevelProps } from "./types";

/**
 * Konami-Code: ↑↑↓↓←→←→ B A
 */
const CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const SYMBOLS: Record<string, string> = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  b: "B",
  a: "A",
};

export function LevelKonami({ onSolve }: LevelProps) {
  const [progress, setProgress] = useState(0);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const expected = CODE[progress];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected) {
        const next = progress + 1;
        if (next >= CODE.length) {
          onSolve();
        } else {
          setProgress(next);
        }
      } else {
        setWrong(true);
        setProgress(0);
        setTimeout(() => setWrong(false), 400);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [progress, onSolve]);

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-6">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Eine alte Beschwörung
      </p>
      <div
        className={`flex flex-wrap justify-center gap-3 ${wrong ? "animate-pulse" : ""}`}
      >
        {CODE.map((c, i) => {
          const done = i < progress;
          return (
            <div
              key={i}
              className={`flex h-14 w-14 items-center justify-center rounded-md border text-2xl font-light transition-all ${
                done
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-muted/20 text-muted-foreground/40"
              }`}
              style={{
                boxShadow: done ? "0 0 12px var(--neon-glow)" : "none",
              }}
            >
              {SYMBOLS[c]}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground/60">
        {progress} / {CODE.length}
      </p>
    </div>
  );
}
