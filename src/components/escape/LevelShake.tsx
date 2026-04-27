import { useEffect, useRef, useState } from "react";
import type { LevelProps } from "./types";

/**
 * Schüttle die Maus wild hin und her, um Energie aufzuladen.
 */
export function LevelShake({ onSolve }: LevelProps) {
  const [energy, setEnergy] = useState(0);
  const last = useRef<{ x: number; y: number; t: number } | null>(null);
  const decay = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (last.current) {
        const dx = e.clientX - last.current.x;
        const dy = e.clientY - last.current.y;
        const dt = Math.max(1, now - last.current.t);
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        if (speed > 1.5) {
          setEnergy((e) => Math.min(100, e + speed * 0.6));
        }
      }
      last.current = { x: e.clientX, y: e.clientY, t: now };
    };
    window.addEventListener("mousemove", onMove);

    decay.current = window.setInterval(() => {
      setEnergy((e) => Math.max(0, e - 1.2));
    }, 60);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (decay.current) window.clearInterval(decay.current);
    };
  }, []);

  const charged = energy >= 100;

  return (
    <div
      className="room-enter flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-6"
      style={{
        transform: `translate(${(Math.random() - 0.5) * energy * 0.06}px, ${(Math.random() - 0.5) * energy * 0.06}px)`,
      }}
    >
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Lade die Maschine. Mit roher Gewalt.
      </p>

      <div className="relative h-48 w-48">
        <div
          className="absolute inset-0 rounded-full border-2 border-border"
          style={{
            background: `conic-gradient(var(--primary) ${energy * 3.6}deg, transparent ${energy * 3.6}deg)`,
            opacity: 0.7,
          }}
        />
        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-background">
          <span className="font-mono text-3xl text-foreground">
            {energy.toFixed(0)}%
          </span>
        </div>
      </div>

      {charged ? (
        <button
          onClick={onSolve}
          className="btn-neon rounded-md px-8 py-3 text-sm uppercase tracking-[0.3em]"
        >
          Entladen →
        </button>
      ) : (
        <p className="text-xs text-muted-foreground/60">
          Bewege die Maus. Schneller. Schneller!
        </p>
      )}
    </div>
  );
}
