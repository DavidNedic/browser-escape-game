import { useState } from "react";
import type { LevelProps } from "./types";

const TARGET = 10;

export function Level1Click({ onSolve }: LevelProps) {
  const [count, setCount] = useState(0);
  const solved = count >= TARGET;

  const lightness = 0.15 + (count / TARGET) * 0.7;
  const pulseIntensity = (count / TARGET) * 0.05;

  return (
    <div
      className="room-enter flex min-h-screen flex-col items-center justify-center gap-12 px-4"
      style={{
        backgroundColor: `oklch(${0.08 + pulseIntensity} 0.01 270)`,
        transition: "background-color 0.4s ease",
      }}
    >
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Stille. Ein Knopf.
      </p>

      {!solved ? (
        <button
          onClick={() => setCount((c) => Math.min(c + 1, TARGET))}
          aria-label="mysteriöser Knopf"
          className="h-20 w-20 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `oklch(${lightness} 0.02 270)`,
            boxShadow: `0 0 ${count * 4}px oklch(0.85 0.18 165 / ${count / TARGET * 0.6})`,
            border: `1px solid oklch(${lightness + 0.2} 0.05 165)`,
          }}
        />
      ) : (
        <button
          onClick={onSolve}
          className="btn-neon room-enter rounded-md px-8 py-3 text-sm uppercase tracking-[0.3em]"
        >
          Weiter →
        </button>
      )}

      <p className="text-xs text-muted-foreground/60">
        {count} / {TARGET}
      </p>
    </div>
  );
}
