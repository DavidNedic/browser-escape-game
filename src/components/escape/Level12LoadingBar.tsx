import { useEffect, useRef, useState } from "react";
import type { LevelProps } from "./types";

/**
 * Der ewige Ladebalken.
 * Geht zügig auf 99% und bleibt dort hängen.
 * Lösung: Maus aus dem Fenster bewegen (mouseleave am document).
 * Sobald der Browser denkt, der Nutzer ist weg, "lädt" er fertig — wie im echten Leben.
 */

export function Level12LoadingBar({ onSolve }: LevelProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hint, setHint] = useState(false);
  const tickRef = useRef<number | null>(null);

  // Progress hochzählen bis 99%
  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 99) return 99;
        // Ease-out: schnell am Anfang, langsam am Ende
        const step = Math.max(0.4, (99 - p) / 18);
        return Math.min(99, p + step);
      });
    }, 80);
    tickRef.current = id;
    return () => window.clearInterval(id);
  }, []);

  // Hinweis-Wackler nach längerem Hängenbleiben
  useEffect(() => {
    if (progress < 99) return;
    const t = window.setTimeout(() => setHint(true), 6000);
    return () => window.clearTimeout(t);
  }, [progress]);

  // Lösung: mouseleave am document
  useEffect(() => {
    if (done) return;
    const onLeave = (e: MouseEvent) => {
      // relatedTarget === null heißt: Maus hat tatsächlich das Fenster verlassen
      if (e.relatedTarget === null && progress >= 99) {
        setDone(true);
        setProgress(100);
      }
    };
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, [done, progress]);

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6">
      <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
        {done ? "Abgeschlossen" : "Wird geladen…"}
      </p>

      <div className="w-full max-w-xl">
        {/* Balken */}
        <div className="relative h-3 w-full overflow-hidden rounded-full border border-border bg-muted/30">
          <div
            className="h-full transition-[width] duration-200 ease-out"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, oklch(0.7 0.18 165), oklch(0.85 0.18 165))",
              boxShadow: "0 0 16px oklch(0.85 0.18 165 / 0.6)",
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>{progress.toFixed(0)}%</span>
          <span>
            {done
              ? "fertig"
              : progress >= 99
                ? "fast geschafft…"
                : "verbinden…"}
          </span>
        </div>
      </div>

      {hint && !done && (
        <p className="max-w-md text-center text-xs italic text-muted-foreground/70">
          Vielleicht braucht die Verbindung etwas Privatsphäre. Schau kurz weg.
        </p>
      )}

      {done && (
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
