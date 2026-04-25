import { useEffect, useRef, useState } from "react";
import type { LevelProps } from "./types";

const TARGET = 50;
const MIN_INTERVAL = 120; // ms — too fast triggers freeze
const FREEZE_MS = 2000;
const HOLD_MS = 3000;

export function Level6Exact({ onSolve }: LevelProps) {
  const [count, setCount] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [exitReady, setExitReady] = useState(false);
  const lastClick = useRef(0);
  const lastChange = useRef(Date.now());

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 1400);
  };

  const click = () => {
    if (frozen || exitReady) return;
    const now = Date.now();
    if (now - lastClick.current < MIN_INTERVAL) {
      setFrozen(true);
      flash("Zu schnell. Atme.");
      setTimeout(() => setFrozen(false), FREEZE_MS);
      lastClick.current = now;
      return;
    }
    lastClick.current = now;
    lastChange.current = now;

    setCount((c) => {
      const next = c + 1;
      if (next > TARGET) {
        flash("Das war einer zu viel. Noch mal von vorn.");
        return 0;
      }
      return next;
    });
  };

  // Hold timer: when count === TARGET, wait HOLD_MS without clicking
  useEffect(() => {
    if (count !== TARGET || exitReady) {
      setHoldProgress(0);
      return;
    }
    lastChange.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastChange.current;
      const pct = Math.min(elapsed / HOLD_MS, 1);
      setHoldProgress(pct);
      if (pct >= 1) {
        setExitReady(true);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [count, exitReady]);

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-10 px-4">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Präzision
      </p>
      <h2 className="text-glow text-3xl font-light tracking-wide md:text-4xl">
        Klicke exakt 50 Mal.
      </h2>

      <div className="font-mono text-5xl text-primary text-glow tabular-nums">
        {count} / {TARGET}
      </div>

      {!exitReady ? (
        <button
          onClick={click}
          disabled={frozen}
          className="btn-neon w-48 rounded-md px-8 py-4 text-sm uppercase tracking-[0.3em] disabled:cursor-not-allowed disabled:opacity-30"
        >
          {frozen ? "Eingefroren…" : "Klick"}
        </button>
      ) : (
        <button
          onClick={onSolve}
          className="btn-neon room-enter rounded-md px-10 py-4 text-sm uppercase tracking-[0.4em]"
        >
          Ausgang →
        </button>
      )}

      {/* Hold progress bar at exactly TARGET */}
      {count === TARGET && !exitReady && (
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-48 overflow-hidden bg-border">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{
                width: `${holdProgress * 100}%`,
                boxShadow: "0 0 8px var(--neon-glow)",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Halte still. Klicke nicht.
          </p>
        </div>
      )}

      {/* Passive-aggressive flash messages */}
      <div className="h-4">
        {message && (
          <p
            className="text-xs uppercase tracking-[0.3em] text-destructive"
            style={{ animation: "flicker 0.4s ease-in-out" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
