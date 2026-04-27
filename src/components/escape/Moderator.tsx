import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Moderator-Bubble: persistent unten links.
 * Spruchpool pro Kontext (Raum / Start / Win).
 * Stil: starkes Kanak-Deutsch, Mix aus Hilfe und Trolling.
 */

type ContextKey =
  | "start"
  | "won"
  | "mirror"
  | "shake"
  | "patience"
  | "konami"
  | "typo"
  | "darkroom"
  | "slider"
  | "drag"
  | "resize"
  | "trust";

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
  mirror: [
    "Eyy Bruda, dein Maus is besoffen oder was? Geht falsch rum, lan!",
    "Spiegel lügt, isch lüg nisch. X is plötslich rückwärts, Habibi.",
    "Wenn du nach rechs willst, geh nach links. Wie bei mein Ex.",
    "Knopf is oben in die Eke. Dein Eke, nisch sein Eke, vallah.",
  ],
  shake: [
    "Eyyy schüttel die Maus, Bruda! Wie Ayran in Flasche!",
    "Mehr Power, lan! Mein Oma macht Teig schneller als du!",
    "Wenn du aufhörs, geht Energie weg. Bewegen, immer bewegen, Habibi!",
    "Hundert Prosent, sonst nix. Vallah, is fair.",
  ],
  patience: [
    "Eyyy ruhig, Bruda. Atme. Mach gar nix, lan.",
    "Kein Maus, kein Tasten, nix. Wie Yoga, Habibi.",
    "Jede Bewegung und Timer geht von vorn. Wie mein Diät.",
    "Sweige. Warte. Sähle in Kopf bis swansig. Vallah.",
  ],
  konami: [
    "Alte Beschwörung, Bruda. Pfeile drücken, lan!",
    "Hoch hoch, runter runter, links rechs links rechs, B A. Klassisch, Habibi!",
    "Wenn du Falsche drücks, fängs alles von vorn an. Konsentration!",
    "Mein Cousin macht das mit geschlossenen Augen, vallah.",
  ],
  typo: [
    "Eyyy schreib genau wie da steht, Bruda. MIT Fehler, lan!",
    "Nisch korrigieren, Habibi! Genau falsch, das is rischtig!",
    "Dein Tastatur will dir helfen. Vertrau ihr nisch, vallah!",
    "Mein Deutsch is besser, glaub mir. Aber tipp wie da steht.",
  ],
  darkroom: [
    "Eyy is dunkel, Bruda. Maus bewegen, dann sieht man was, lan!",
    "Klein Liecht folgt dein Cursor. Such den Knopf, Habibi.",
    "Manschmal versteckt isses in die Mitte, manschmal in die Eke. Vallah.",
    "Augen auf! Oder zu, isses egal in dunkel.",
  ],
  slider: [
    "Eyyy Bruda, dreiundsiebsig! Genau, nisch swei vorbei, nisch swei rüber!",
    "Heiß heiß, kalt kalt. Wie Sushi, Habibi.",
    "Kreis leuchtet rot? Dann biste nah, lan. Pfeiltasten helfen aush.",
    "Mein Oma trifft das mit Augen su. Du schaffs aush, vallah.",
  ],
  drag: [
    "Eyy Bruda, Wort sussammenbauen. Buchstaben sieh, lan!",
    "Acht Buchstaben. Endet mit was Schönem, Habibi. Was alle wollen.",
    "Falsch gesetst? Klick drauf, kommt surück in die Reihe. Easy.",
    "Vallah, das Wort is FREIHEIT. Hab isch nisch gesagt, pscht!",
  ],
  resize: [
    "Eyyy mach Fenster schmaler, Bruda! Sieh den Marker, lan!",
    "Sone in der Mitte triffen, Habibi. Etwa fünfhundert Pixel.",
    "Sieh am Eke vom Browser, ssieh, ssieh!",
    "Wenn du auf Handy bis: Browser-Leiste rein und raus scrollen, vallah.",
  ],
  trust: [
    "Eyy Bruda, lies GENAU was da steht! Ja heiß manschmal Nein, lan!",
    "Frage hat NISCH? Dann antwort umgekehrt, Habibi!",
    "Ein Knopf is anders als der andere, su klein dass man's kaum sieht.",
    "Vertrau nix und niemand. Aush nisch mir, vallah.",
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
