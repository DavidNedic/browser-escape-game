import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Moderator-Bubble: persistent unten links.
 * Spruchpool pro Kontext (Raum / Start / Win).
 * Rotiert alle paar Sekunden, mit Tippanimation.
 *
 * Stil: starkes Kanak-Deutsch, Mix aus Hilfe und Trolling.
 */

type ContextKey =
  | "start"
  | "won"
  | "click"
  | "scroll"
  | "hover"
  | "flee"
  | "bait"
  | "exact"
  | "ink"
  | "cursed"
  | "popup";

const LINES: Record<ContextKey, string[]> = {
  start: [
    "Ey Bruda, willkommen in mein Raum, lan!",
    "Hör mal su, isch bin dein Moderator. Vallah, isch helfe dir... vielleischt.",
    "Mach dein Kopf an, sons biste hier bis morgen, Habibi.",
  ],
  won: [
    "Vallah, du has gemacht! Isch bin stols auf disch, lan!",
    "Eyy Maschallah, Bruda! Du bis frei!",
    "Geh raus, trink ein Çay, du has verdient, Habibi.",
  ],
  click: [
    "Ey was machs du? Klick auf den Knopf, lan, was sons?",
    "Ja weiter klicken, immer weiter, isch sag dir wann genug is.",
    "Bruda, dein Finger wird müde? Heul nisch, weiter!",
    "Sehr gut Habibi, bald geht Tür auf. Vielleischt.",
  ],
  scroll: [
    "Ey Bruda, scroll mal runter. Ja runter, nisch hoch, lan!",
    "Tiefer, tiefer... wie mein Schulden bei Onkel, vallah.",
    "Was guckst du? Mausrad drehen, los los!",
    "Bissl Sport für dein Finger, schadet nisch.",
  ],
  hover: [
    "Irgendwo isses versteckt, Bruda. Mit Maus suchen, nisch mit Augen!",
    "Ecken sin dein Freund, Habibi. Geh in die Ecken, lan.",
    "Drei Sahlen, isch sag nisch welsche. Wäre su einfach.",
    "Tipp: oben rechs is immer was los. Aber pscht, isch hab nix gesag.",
  ],
  flee: [
    "Eyyy lan, der Knopf läuft weg! Was machs du, Bruda?",
    "Maus is nisch immer Antwort, Habibi. Tastatur exisirt aush!",
    "Tab Tab Tab, dann Enter. Isch hab nix gesag, lan.",
    "Hahaha du jagst Pixel wie Kasse beim Aldi am Samstag!",
  ],
  bait: [
    "Großer roter Knopf? Vallah, das is Falle, Bruda!",
    "Klick nisch da, isch warne disch! ...okay klick, isch lach drüber.",
    "Lies den Text genau. Buchstabe für Buchstabe, lan.",
    "Manschmal is Antwort mitten im Sats. Aber nur manschmal.",
  ],
  exact: [
    "Sähl mit, Bruda! Genau fünfzig, nisch mehr nisch weniger!",
    "Wenn du su schnell klicks, krieg isch Kopfschmerzen, lan!",
    "Eins su viel und du fängs wieder von vorn an. Maschallah!",
    "Atmen Habibi, atmen. Warte ein bissl, sons gibs Tilt.",
  ],
  ink: [
    "Bildschirm is leer? Bruda, mark mal alles mit Maus!",
    "Strg+A, lan! Wie in dein Hausaufgaben damals.",
    "Wenn du was sieht, sieh genau, Habibi. Ziehen, nisch lesen!",
    "Ecke unten rechs. Mehr sag isch nisch.",
  ],
  cursed: [
    "Diese Boxen sin verfluscht, Bruda. Wie mein Ex.",
    "Eine geht an, andere geht aus. Klassisch, lan.",
    "Lies Text genau. Doppelklick auf wischtige Wort, vallah.",
    "Manschmal hilf nisch klicken, sondern doppelt klicken, Habibi.",
  ],
  popup: [
    "Eyy was is das für Fenster? Sieht echt aus, lan, aber pscht...",
    "Klick nisch Neu Laden! Sons fängs du komplett von vorne an, Bruda!",
    "Drück die Taste oben links bei Tastatur. Du weiß welsche, Habibi.",
    "Escape heiß die Taste. Isch sag nur, isch sag nisch.",
  ],
};

interface Props {
  context: ContextKey;
}

export function Moderator({ context }: Props) {
  const lines = useMemo(() => LINES[context] ?? [], [context]);
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<number | null>(null);

  // Reset on context change
  useEffect(() => {
    setIdx(0);
  }, [context]);

  // Typewriter effect for current line
  useEffect(() => {
    if (lines.length === 0) return;
    const full = lines[idx % lines.length];
    setText("");
    let i = 0;
    const typeInterval = window.setInterval(() => {
      i++;
      setText(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(typeInterval);
      }
    }, 28);

    // Schedule next line
    const advanceTimer = window.setTimeout(() => {
      setIdx((n) => n + 1);
    }, Math.max(5500, full.length * 50 + 2500));

    timerRef.current = advanceTimer;
    return () => {
      window.clearInterval(typeInterval);
      window.clearTimeout(advanceTimer);
    };
  }, [idx, lines]);

  if (!visible || lines.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[60] max-w-[min(92vw,420px)]">
      <div className="pointer-events-auto flex items-end gap-3">
        {/* Avatar — Video-Loop */}
        <div
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-primary/40 bg-background/80 backdrop-blur-md"
          style={{ boxShadow: "0 0 16px var(--neon-glow)" }}
          aria-hidden
        >
          <video
            src="/moderator.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        </div>

        {/* Bubble */}
        <div className="relative">
          <div className="relative rounded-2xl rounded-bl-sm border border-border/60 bg-background/85 px-4 py-3 text-sm leading-snug text-foreground shadow-lg backdrop-blur-md">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="text-[9px] uppercase tracking-[0.3em] text-primary/80">
                Moderator
              </span>
              <button
                onClick={() => setVisible(false)}
                className="text-xs text-muted-foreground/60 hover:text-foreground"
                aria-label="Moderator ausblenden"
              >
                ✕
              </button>
            </div>
            <p className="font-light">
              {text}
              <span className="ml-0.5 inline-block h-3 w-[1px] animate-pulse bg-primary align-middle" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
