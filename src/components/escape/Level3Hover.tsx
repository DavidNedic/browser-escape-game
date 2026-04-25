import { useState } from "react";
import type { LevelProps } from "./types";

const CODE = "404";

export function Level3Hover({ onSolve }: LevelProps) {
  const [revealed, setRevealed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === CODE) {
      onSolve();
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div className="room-enter relative flex min-h-screen flex-col items-center justify-center gap-10 px-4">
      {/* Hidden hover zone in upper-right corner */}
      <div
        className="absolute right-0 top-0 h-32 w-32"
        onMouseEnter={() => setRevealed(true)}
      >
        <span
          className={`absolute right-6 top-6 font-mono text-2xl text-primary transition-opacity duration-700 ${
            revealed ? "opacity-100 text-glow" : "opacity-0"
          }`}
        >
          {CODE}
        </span>
      </div>

      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Aufgabe
      </p>
      <h2 className="text-glow text-3xl font-light tracking-wide md:text-4xl">
        Finde das Licht.
      </h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        Irgendwo in diesem Raum verbirgt sich ein Code. Tippe ihn ein, um zu entkommen.
      </p>

      <form onSubmit={submit} className="flex flex-col items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="• • •"
          aria-label="Code eingeben"
          className={`w-40 border-b bg-transparent py-2 text-center font-mono text-xl tracking-[0.5em] outline-none transition-all ${
            error
              ? "border-destructive text-destructive"
              : "border-border focus:border-primary focus:text-primary"
          }`}
          style={error ? { animation: "flicker 0.3s 2" } : undefined}
        />
        <button
          type="submit"
          className="btn-neon rounded-md px-6 py-2 text-xs uppercase tracking-[0.3em]"
        >
          Entkommen
        </button>
      </form>
    </div>
  );
}
