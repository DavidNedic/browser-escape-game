import { useEffect, useState } from "react";
import { LEVELS } from "./levels";
import { Moderator } from "./Moderator";

type Phase = "start" | "playing" | "won";

export function EscapeGame() {
  const [phase, setPhase] = useState<Phase>("start");
  const [levelIdx, setLevelIdx] = useState(0);

  // Reset scroll between rooms
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [levelIdx, phase]);

  const advance = () => {
    if (levelIdx + 1 >= LEVELS.length) {
      setPhase("won");
    } else {
      setLevelIdx((i) => i + 1);
    }
  };

  const restart = () => {
    setLevelIdx(0);
    setPhase("start");
  };

  if (phase === "start") {
    return (
      <>
        <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-10 px-4">
          <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
            Browser Escape
          </p>
          <h1 className="text-glow text-center text-5xl font-light tracking-widest md:text-7xl">
            Drei Räume.
            <br />
            <span className="text-muted-foreground">Ein Ausgang.</span>
          </h1>
          <button
            onClick={() => setPhase("playing")}
            className="btn-neon rounded-md px-10 py-4 text-sm uppercase tracking-[0.4em]"
          >
            Betreten
          </button>
        </div>
        <Moderator context="start" />
      </>
    );
  }

  if (phase === "won") {
    return (
      <>
        <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-8 px-4">
          <p className="text-xs uppercase tracking-[0.5em] text-primary text-glow">
            Entkommen
          </p>
          <h1 className="text-glow text-center text-4xl font-light tracking-wide md:text-6xl">
            Du hast das Licht gefunden.
          </h1>
          <p className="max-w-md text-center text-sm text-muted-foreground">
            Die Tür hinter dir schließt sich. Vielleicht möchtest du es noch einmal versuchen?
          </p>
          <button
            onClick={restart}
            className="btn-neon mt-4 rounded-md px-8 py-3 text-sm uppercase tracking-[0.3em]"
          >
            Neu starten
          </button>
        </div>
        <Moderator context="won" />
      </>
    );
  }

  const Level = LEVELS[levelIdx].Component;
  const ctx = LEVELS[levelIdx].id as Parameters<typeof Moderator>[0]["context"];

  return (
    <div className="relative">
      {/* Progress indicator */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex justify-center pt-6">
        <div className="rounded-full border border-border/50 bg-background/70 px-4 py-1.5 text-[10px] uppercase tracking-[0.4em] text-muted-foreground backdrop-blur-md">
          Ebene {levelIdx + 1} / {LEVELS.length}
        </div>
      </div>

      <Level key={LEVELS[levelIdx].id} onSolve={advance} />
      <Moderator context={ctx} />
    </div>
  );
}
