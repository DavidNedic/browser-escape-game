import { useEffect, useRef, useState } from "react";
import { formatTime } from "./useBestTimes";

type Props = {
  /** Reset / restart trigger; changing this restarts the timer from zero. */
  resetKey: string | number;
  /** Optional best time in ms to display alongside live timer. */
  bestMs?: number;
  /** Optional best holder name. */
  bestName?: string;
};

/**
 * Lightweight per-level stopwatch overlay.
 * Mounts top-right, ticks ~10x/s for a smooth centisecond display.
 */
export function LevelTimer({ resetKey, bestMs, bestName }: Props) {
  const startRef = useRef<number>(performance.now());
  const [now, setNow] = useState<number>(performance.now());

  useEffect(() => {
    startRef.current = performance.now();
    setNow(performance.now());
    const id = window.setInterval(() => {
      setNow(performance.now());
    }, 100);
    return () => window.clearInterval(id);
  }, [resetKey]);

  const elapsed = Math.max(0, now - startRef.current);
  const beatingBest = bestMs !== undefined && elapsed < bestMs;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col items-end gap-1">
      <div
        className={`rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.3em] backdrop-blur-md ${
          beatingBest
            ? "border-primary/60 bg-primary/10 text-primary text-glow"
            : "border-border/50 bg-background/70 text-foreground"
        }`}
      >
        {formatTime(elapsed)}
      </div>
      {bestMs !== undefined && (
        <div className="rounded-full border border-border/30 bg-background/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur-md">
          Best {formatTime(bestMs)}
          {bestName ? ` · ${bestName}` : ""}
        </div>
      )}
    </div>
  );
}
