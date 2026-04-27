import { useState } from "react";
import type { LevelProps } from "./types";

/**
 * Buchstaben in richtige Reihenfolge bringen, um das Wort zu bilden.
 */
const WORD = "FREIHEIT";
const SCRAMBLED = ["E", "I", "F", "T", "R", "H", "E", "I"];

export function LevelDragLetters({ onSolve }: LevelProps) {
  const [pool, setPool] = useState<string[]>(SCRAMBLED);
  const [slots, setSlots] = useState<(string | null)[]>(
    Array(WORD.length).fill(null),
  );
  const [dragged, setDragged] = useState<number | null>(null);

  const correct = slots.join("") === WORD;

  const placeIntoSlot = (slotIdx: number) => {
    if (dragged === null || slots[slotIdx] !== null) return;
    const letter = pool[dragged];
    const newPool = pool.filter((_, i) => i !== dragged);
    const newSlots = [...slots];
    newSlots[slotIdx] = letter;
    setPool(newPool);
    setSlots(newSlots);
    setDragged(null);
  };

  const removeFromSlot = (slotIdx: number) => {
    const letter = slots[slotIdx];
    if (!letter) return;
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    setSlots(newSlots);
    setPool([...pool, letter]);
  };

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-12 bg-background px-6">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Setze das Wort zusammen.
      </p>

      {/* Slots */}
      <div className="flex flex-wrap justify-center gap-2">
        {slots.map((letter, i) => (
          <button
            key={i}
            onClick={() => letter && removeFromSlot(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => placeIntoSlot(i)}
            className={`flex h-14 w-14 items-center justify-center rounded-md border-2 text-2xl font-light transition-all ${
              letter
                ? "border-primary bg-primary/15 text-primary"
                : "border-dashed border-border bg-muted/10 text-muted-foreground"
            }`}
            style={{
              boxShadow: letter ? "0 0 10px var(--neon-glow)" : "none",
            }}
          >
            {letter ?? ""}
          </button>
        ))}
      </div>

      {/* Pool */}
      <div className="flex flex-wrap justify-center gap-2">
        {pool.map((letter, i) => (
          <div
            key={`${letter}-${i}`}
            draggable
            onDragStart={() => setDragged(i)}
            onClick={() => {
              const slotIdx = slots.findIndex((s) => s === null);
              if (slotIdx >= 0) {
                setDragged(i);
                setTimeout(() => placeIntoSlot(slotIdx), 0);
              }
            }}
            className="flex h-12 w-12 cursor-grab select-none items-center justify-center rounded-md border border-border bg-card text-xl font-light text-foreground active:cursor-grabbing"
          >
            {letter}
          </div>
        ))}
      </div>

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
