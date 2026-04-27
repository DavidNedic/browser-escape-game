import { useState } from "react";
import type { LevelProps } from "./types";

/**
 * Slider von 0 bis 100. Treffe exakt 73. Aktueller Wert ist nicht sichtbar —
 * nur eine vage „warm/kalt"-Anzeige.
 */
const TARGET = 73;

export function LevelSlider({ onSolve }: LevelProps) {
  const [value, setValue] = useState(50);
  const dist = Math.abs(value - TARGET);
  const heat = Math.max(0, 1 - dist / 50);
  const correct = value === TARGET;

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-6">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Finde die richtige Frequenz: dreiundsiebzig.
      </p>

      <div
        className="h-32 w-32 rounded-full transition-all"
        style={{
          background: `radial-gradient(circle, oklch(${0.4 + heat * 0.4} ${heat * 0.2} ${30 - heat * 30}), transparent 70%)`,
          boxShadow: `0 0 ${heat * 60}px oklch(0.7 0.2 ${30 - heat * 30} / ${heat})`,
        }}
      />

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-80 accent-primary"
      />

      <p className="font-mono text-xs text-muted-foreground/60">
        {dist === 0
          ? "Genau."
          : dist < 5
            ? "Heiß"
            : dist < 15
              ? "Warm"
              : dist < 30
                ? "Kühl"
                : "Eiskalt"}
      </p>

      {correct && (
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
