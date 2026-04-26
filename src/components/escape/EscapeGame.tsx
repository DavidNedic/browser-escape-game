import { useEffect, useRef, useState } from "react";
import { LEVELS } from "./levels";
import { Moderator } from "./Moderator";
import { LevelTimer } from "./LevelTimer";
import { formatTime, useBestTimes } from "./useBestTimes";

type Phase = "start" | "playing" | "won";

export function EscapeGame() {
  const [phase, setPhase] = useState<Phase>("start");
  const [levelIdx, setLevelIdx] = useState(0);
  const { name, setName, times, submitTime } = useBestTimes();
  const [nameInput, setNameInput] = useState("");
  const levelStartRef = useRef<number>(performance.now());
  const [lastResult, setLastResult] = useState<{
    levelId: string;
    ms: number;
    isBest: boolean;
    previousMs?: number;
  } | null>(null);

  // Sync input with stored name on mount/update
  useEffect(() => {
    setNameInput(name);
  }, [name]);

  // Reset scroll between rooms
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [levelIdx, phase]);

  // Reset stopwatch when entering a new level
  useEffect(() => {
    if (phase === "playing") {
      levelStartRef.current = performance.now();
      setLastResult(null);
    }
  }, [levelIdx, phase]);

  const advance = () => {
    const elapsed = performance.now() - levelStartRef.current;
    const currentId = LEVELS[levelIdx].id;
    const previous = times[currentId];
    const result = submitTime(currentId, elapsed);
    setLastResult({
      levelId: currentId,
      ms: elapsed,
      isBest: result.isBest,
      previousMs: previous?.ms,
    });

    if (levelIdx + 1 >= LEVELS.length) {
      setPhase("won");
    } else {
      setLevelIdx((i) => i + 1);
    }
  };

  const restart = () => {
    setLevelIdx(0);
    setPhase("start");
    setLastResult(null);
  };

  const startGame = () => {
    const trimmed = nameInput.trim().slice(0, 24);
    if (trimmed) setName(trimmed);
    setPhase("playing");
  };

  if (phase === "start") {
    const hasAnyTimes = Object.keys(times).length > 0;
    return (
      <>
        <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-10 px-4 py-16">
          <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
            Browser Escape
          </p>
          <h1 className="text-glow text-center text-5xl font-light tracking-widest md:text-7xl">
            Zwölf Räume.
            <br />
            <span className="text-muted-foreground">Ein Ausgang.</span>
          </h1>

          <div className="flex w-full max-w-sm flex-col gap-3">
            <label
              htmlFor="player-name"
              className="text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
            >
              Dein Name
            </label>
            <input
              id="player-name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") startGame();
              }}
              maxLength={24}
              placeholder="Anonym"
              className="rounded-md border border-border/60 bg-background/60 px-4 py-3 text-center text-sm tracking-widest text-foreground outline-none backdrop-blur-md transition focus:border-primary/70 focus:shadow-[0_0_24px_-8px_hsl(var(--primary))]"
            />
            <button
              onClick={startGame}
              className="btn-neon mt-2 rounded-md px-10 py-4 text-sm uppercase tracking-[0.4em]"
            >
              Betreten
            </button>
          </div>

          {hasAnyTimes && (
            <div className="mt-4 w-full max-w-md rounded-lg border border-border/40 bg-background/40 p-5 backdrop-blur-md">
              <p className="mb-3 text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                Bestzeiten dieses Geräts
              </p>
              <ul className="flex flex-col gap-1.5 font-mono text-xs">
                {LEVELS.map((lvl, i) => {
                  const t = times[lvl.id];
                  return (
                    <li
                      key={lvl.id}
                      className="flex items-center justify-between gap-3 border-b border-border/20 pb-1.5 last:border-0"
                    >
                      <span className="text-muted-foreground">
                        {String(i + 1).padStart(2, "0")} · {lvl.name}
                      </span>
                      <span className="text-foreground">
                        {t ? (
                          <>
                            {formatTime(t.ms)}{" "}
                            <span className="text-muted-foreground">
                              · {t.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <Moderator context="start" />
      </>
    );
  }

  if (phase === "won") {
    const total = LEVELS.reduce((sum, lvl) => sum + (times[lvl.id]?.ms ?? 0), 0);
    return (
      <>
        <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-16">
          <p className="text-xs uppercase tracking-[0.5em] text-primary text-glow">
            Entkommen
          </p>
          <h1 className="text-glow text-center text-4xl font-light tracking-wide md:text-6xl">
            Du hast das Licht gefunden.
          </h1>
          <p className="max-w-md text-center text-sm text-muted-foreground">
            {name ? `${name}, ` : ""}deine Gesamtzeit:
          </p>
          <p className="font-mono text-3xl tracking-widest text-foreground text-glow">
            {formatTime(total)}
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
  const currentBest = times[LEVELS[levelIdx].id];

  return (
    <div className="relative">
      {/* Progress indicator */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex justify-center pt-6">
        <div className="rounded-full border border-border/50 bg-background/70 px-4 py-1.5 text-[10px] uppercase tracking-[0.4em] text-muted-foreground backdrop-blur-md">
          Ebene {levelIdx + 1} / {LEVELS.length}
          {name ? <span className="ml-2 text-foreground">· {name}</span> : null}
        </div>
      </div>

      <LevelTimer
        resetKey={LEVELS[levelIdx].id}
        bestMs={currentBest?.ms}
        bestName={currentBest?.name}
      />

      {/* Toast for previous level result */}
      {lastResult && (
        <div className="pointer-events-none fixed left-1/2 top-20 z-50 -translate-x-1/2">
          <div
            className={`rounded-full border px-4 py-1.5 font-mono text-[11px] tracking-widest backdrop-blur-md ${
              lastResult.isBest
                ? "border-primary/60 bg-primary/10 text-primary text-glow"
                : "border-border/40 bg-background/60 text-muted-foreground"
            }`}
          >
            {lastResult.isBest ? "Neue Bestzeit · " : "Vorheriger Raum · "}
            {formatTime(lastResult.ms)}
          </div>
        </div>
      )}

      <Level key={LEVELS[levelIdx].id} onSolve={advance} />
      <Moderator context={ctx} />
    </div>
  );
}
