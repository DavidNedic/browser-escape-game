import { useState } from "react";
import { toast } from "sonner";
import type { LevelProps } from "./types";

export function Level8CursedCheckboxes({ onSolve }: LevelProps) {
  const [boxes, setBoxes] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);

  const tickle = (msg: string) => {
    toast.error(msg, { duration: 1400 });
  };

  // Trolling rules:
  // 1 -> uncheck 2; 2 -> uncheck 3; 3 -> uncheck 1
  const toggle = (idx: 0 | 1 | 2) => {
    setBoxes((prev) => {
      const next: [boolean, boolean, boolean] = [...prev] as [
        boolean,
        boolean,
        boolean,
      ];
      next[idx] = !prev[idx];
      if (next[idx]) {
        if (idx === 0) next[1] = false;
        if (idx === 1) next[2] = false;
        if (idx === 2) next[0] = false;
        tickle("Hmm. Da ist gerade etwas anderes ausgegangen.");
      }
      return next;
    });
  };

  const allCheckedSecret = () => {
    setBoxes([true, true, true]);
    setTimeout(onSolve, 600);
  };

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-10 px-4">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Bestätigung erforderlich
      </p>

      <p className="max-w-md text-center text-base font-light leading-relaxed text-foreground/80">
        Bitte bestätige{" "}
        <span
          onDoubleClick={allCheckedSecret}
          className="cursor-text select-none"
          // Looks identical to surrounding text — no styling tells.
        >
          alle
        </span>{" "}
        drei Boxen, um fortzufahren.
      </p>

      <div className="flex flex-col gap-4">
        {boxes.map((checked, i) => (
          <label
            key={i}
            className="flex cursor-pointer items-center gap-4 rounded-md border border-border/60 bg-card/60 px-6 py-3 text-sm tracking-wider text-foreground/80 backdrop-blur-sm"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(i as 0 | 1 | 2)}
              className="h-4 w-4 accent-[var(--neon)]"
            />
            <span>Option {i + 1}</span>
          </label>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/50">
        Drei kleine Häkchen. Was kann schon schiefgehen?
      </p>
    </div>
  );
}
