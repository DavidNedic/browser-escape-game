import { useMemo, useState } from "react";
import type { LevelProps } from "./types";

/**
 * Endlos-Captcha.
 * "Wähle alle Ampeln" — sobald der Spieler etwas anklickt, lädt das Grid neu.
 * Lösung: Nichts auswählen und direkt auf "Bestätigen" klicken.
 * (Ein Mensch würde ja wissen, dass er kein Roboter ist und keine Beweise braucht.)
 */

const EMOJIS = ["🚦", "🌳", "🚗", "🏠", "🚲", "🛵", "🚏", "🌉", "🛣️"];

function shuffle(seed: number): string[] {
  const arr = [...EMOJIS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(((seed * (i + 7)) % (i + 1) + i + 1) % (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function Level11Captcha({ onSolve }: LevelProps) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const tiles = useMemo(() => shuffle(round + 1), [round]);

  const toggle = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
    // Nach kurzer Verzögerung: Grid lädt mit "neuen" Bildern neu — klassischer Captcha-Trick.
    setTimeout(() => {
      setRound((r) => r + 1);
      setSelected(new Set());
      setMessage("Bitte versuche es erneut.");
      setTimeout(() => setMessage(null), 1200);
    }, 350);
  };

  const verify = () => {
    if (selected.size === 0) {
      onSolve();
    } else {
      setShake(true);
      setMessage("Verdächtige Aktivität erkannt.");
      setTimeout(() => {
        setShake(false);
        setRound((r) => r + 1);
        setSelected(new Set());
      }, 600);
      setTimeout(() => setMessage(null), 1500);
    }
  };

  return (
    <div className="room-enter flex min-h-screen items-center justify-center bg-background px-4">
      <div
        className={`w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl ${
          shake ? "animate-pulse" : ""
        }`}
      >
        {/* Header — wie ein bekannter Captcha-Anbieter */}
        <div className="mb-4 rounded-md bg-primary/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Sicherheitsprüfung
          </p>
          <p className="mt-1 text-base font-medium text-foreground">
            Wähle alle Bilder mit Ampeln
          </p>
          <p className="text-xs text-muted-foreground">
            Klicke auf „Bestätigen“, wenn keine übrig sind.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-2" key={round}>
          {tiles.map((emoji, idx) => {
            const isSelected = selected.has(idx);
            return (
              <button
                key={idx}
                onClick={() => toggle(idx)}
                className={`relative aspect-square overflow-hidden rounded-md border-2 text-4xl transition-all ${
                  isSelected
                    ? "border-primary scale-95"
                    : "border-border hover:border-primary/50"
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.95 0.02 240), oklch(0.85 0.04 200))",
                }}
              >
                <span className="flex h-full w-full items-center justify-center">
                  {emoji}
                </span>
                {isSelected && (
                  <span className="absolute inset-0 bg-primary/20" />
                )}
              </button>
            );
          })}
        </div>

        {message && (
          <p className="mt-3 text-center text-xs text-destructive">{message}</p>
        )}

        <div className="mt-5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Versuch {round + 1}
          </span>
          <button
            onClick={verify}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Bestätigen
          </button>
        </div>
      </div>
    </div>
  );
}
