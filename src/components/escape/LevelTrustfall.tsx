import { useState } from "react";
import type { LevelProps } from "./types";

/**
 * Vier Bestätigungs-Dialoge. Die Beschriftung der Buttons ist vertauscht
 * oder die Frage ist invertiert. Spieler muss aufmerksam lesen.
 */

interface Question {
  q: string;
  options: { label: string; correct: boolean }[];
}

const QUESTIONS: Question[] = [
  {
    q: "Möchtest du den Raum NICHT verlassen?",
    options: [
      { label: "Ja", correct: false },
      { label: "Nein", correct: true },
    ],
  },
  {
    q: "Bestätige, dass du fortfahren willst.",
    options: [
      { label: "Abbrechen", correct: true },
      { label: "Bestätigen", correct: false },
    ],
  },
  {
    q: "Klicke auf den Button, der NICHT 'Weiter' heißt.",
    options: [
      { label: "Weiter", correct: false },
      { label: "Weiter ", correct: true },
    ],
  },
  {
    q: "Wähle die wahre Aussage.",
    options: [
      { label: "Dieser Button ist falsch.", correct: false },
      { label: "Dieser Button ist falsch.", correct: true },
    ],
  },
];

export function LevelTrustfall({ onSolve }: LevelProps) {
  const [step, setStep] = useState(0);
  const [shake, setShake] = useState(false);

  const current = QUESTIONS[step];

  const choose = (correct: boolean) => {
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setStep(0);
      return;
    }
    if (step + 1 >= QUESTIONS.length) {
      onSolve();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="room-enter flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-6">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Vertraue niemandem. Auch nicht der Schrift.
      </p>

      <div
        className={`w-full max-w-md rounded-lg border border-border bg-card p-8 ${shake ? "animate-pulse" : ""}`}
      >
        <p className="mb-6 text-center text-lg text-foreground">{current.q}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => choose(opt.correct)}
              className="flex-1 rounded-md border border-border bg-background px-5 py-3 text-sm text-foreground transition-colors hover:border-primary"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Frage {step + 1} / {QUESTIONS.length}
      </p>
    </div>
  );
}
