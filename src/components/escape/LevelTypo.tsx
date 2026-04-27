import { useState } from "react";
import type { LevelProps } from "./types";

/**
 * Tippe den Satz exakt — inklusive aller Tippfehler.
 */
const SENTENCE = "Ich verspreche keien Mause zu bewgen wenn der Bal stil steht";

export function LevelTypo({ onSolve }: LevelProps) {
  const [value, setValue] = useState("");
  const correct = value === SENTENCE;

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Schreibe genau, was geschrieben steht.
      </p>

      <div className="max-w-2xl rounded-md border border-border bg-card p-6 font-mono text-lg leading-relaxed">
        {SENTENCE.split("").map((c, i) => {
          const typed = value[i];
          const status =
            typed === undefined ? "pending" : typed === c ? "ok" : "bad";
          return (
            <span
              key={i}
              className={
                status === "ok"
                  ? "text-primary"
                  : status === "bad"
                    ? "bg-destructive/30 text-destructive"
                    : "text-muted-foreground/50"
              }
            >
              {c === " " ? "\u00A0" : c}
            </span>
          );
        })}
      </div>

      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className="w-full max-w-2xl rounded-md border border-border bg-background px-4 py-3 font-mono text-base text-foreground outline-none focus:border-primary"
        placeholder="Hier tippen…"
      />

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
