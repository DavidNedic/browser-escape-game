import { useState } from "react";
import { toast } from "sonner";
import type { LevelProps } from "./types";

const TAUNTS = [
  "Netter Versuch.",
  "Zu einfach, oder?",
  "Falscher Button.",
  "Wirklich? Das war zu offensichtlich.",
  "Nope.",
  "Du machst es dir zu einfach.",
];

export function Level5Bait({ onSolve }: LevelProps) {
  const [pulse, setPulse] = useState(false);

  const taunt = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 200);
    toast.error(TAUNTS[Math.floor(Math.random() * TAUNTS.length)], {
      duration: 1600,
    });
  };

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-12 px-4">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Hinweis
      </p>

      <p className="max-w-md text-center text-base font-light leading-relaxed text-foreground/80">
        Finde den Weg hinau
        {/* The tiny escape — a single character, slightly off-color */}
        <span
          onClick={onSolve}
          role="button"
          aria-label="versteckter Ausgang"
          className="cursor-default text-primary/50 hover:text-primary"
          style={{ textShadow: "0 0 1px var(--neon-glow)" }}
        >
          s
        </span>
        .
      </p>

      <button
        onClick={taunt}
        className="rounded-lg border-2 border-destructive bg-destructive/80 px-12 py-8 text-2xl font-bold uppercase tracking-wider text-destructive-foreground shadow-[0_0_40px_oklch(0.577_0.245_27.325/0.6)] transition-transform hover:scale-105"
        style={{
          animation: pulse
            ? "none"
            : "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      >
        ▶ HIER KLICKEN FÜR LEVEL 6 ◀
      </button>

      <p className="text-xs text-muted-foreground/50">
        Der größte Button ist nicht immer die Antwort.
      </p>
    </div>
  );
}
