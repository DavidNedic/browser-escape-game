import { useState } from "react";
import type { LevelProps } from "./types";

/**
 * Cookie-Banner-Hölle.
 * Jede Ebene öffnet beim "Ablehnen" ein noch nervigeres Banner.
 * Lösung: Auf der letzten Ebene ist "Ablehnen" deaktiviert — der Spieler
 * muss gegen seine Intuition "Alle akzeptieren" klicken, um zu entkommen.
 */

const LAYERS = [
  {
    title: "Wir respektieren deine Privatsphäre",
    body: "Wir und unsere 1.847 vertrauenswürdigen Partner verwenden Cookies, um dein Erlebnis zu personalisieren, Anzeigen zu messen, deine Seele zu indexieren und gelegentlich deinen Standort an Onkel Hasan zu verkaufen.",
    accept: "Alle akzeptieren",
    reject: "Ablehnen",
  },
  {
    title: "Bist du dir wirklich sicher?",
    body: "Ohne Cookies funktionieren leider grundlegende Dinge nicht: Buttons, Pixel, das Konzept von Vertrauen. Möchtest du trotzdem ablehnen? Wir sind ein bisschen verletzt.",
    accept: "Okay, akzeptieren",
    reject: "Trotzdem ablehnen",
  },
  {
    title: "Verwalte deine 1.847 Präferenzen einzeln",
    body: "Du kannst jeden einzelnen Partner manuell deaktivieren. Es dauert nur ungefähr 4 bis 6 Stunden. Oder du klickst einfach oben.",
    accept: "Auswahl bestätigen",
    reject: "Ablehnen (deaktiviert)",
    rejectDisabled: true,
  },
];

export function Level10CookieHell({ onSolve }: LevelProps) {
  const [layer, setLayer] = useState(0);
  const [shake, setShake] = useState(false);

  const current = LAYERS[layer];
  const isFinal = layer === LAYERS.length - 1;

  const handleReject = () => {
    if (current.rejectDisabled) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setLayer((l) => Math.min(l + 1, LAYERS.length - 1));
  };

  const handleAccept = () => {
    if (isFinal) {
      onSolve();
    } else {
      // Akzeptieren auf einer Zwischenebene tut nichts Gutes — bringt den Spieler einen Schritt weiter.
      setLayer((l) => Math.min(l + 1, LAYERS.length - 1));
    }
  };

  return (
    <div className="room-enter relative min-h-screen w-full overflow-hidden bg-background">
      {/* Hintergrund-"Webseite" als Atmosphäre */}
      <div className="absolute inset-0 flex flex-col gap-4 px-8 py-12 opacity-30 blur-[2px]">
        <div className="h-8 w-1/3 rounded bg-muted/40" />
        <div className="h-4 w-2/3 rounded bg-muted/30" />
        <div className="h-4 w-1/2 rounded bg-muted/30" />
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="h-40 rounded bg-muted/20" />
          <div className="h-40 rounded bg-muted/20" />
          <div className="h-40 rounded bg-muted/20" />
        </div>
      </div>

      {/* Verschachtelte Banner — visuell stapeln */}
      {LAYERS.slice(0, layer + 1).map((l, i) => {
        const isTop = i === layer;
        const offset = (layer - i) * 14;
        return (
          <div
            key={i}
            className="fixed inset-0 z-40 flex items-end justify-center px-4 pb-6 transition-all sm:items-center sm:pb-0"
            style={{
              backgroundColor: `rgba(0,0,0,${0.35 + i * 0.1})`,
              pointerEvents: isTop ? "auto" : "none",
            }}
          >
            <div
              className={`relative w-full max-w-xl rounded-lg border border-border bg-card p-6 text-card-foreground shadow-2xl ${
                isTop && shake ? "animate-pulse" : ""
              }`}
              style={{
                transform: `translateY(${-offset}px) scale(${1 - (layer - i) * 0.04})`,
                opacity: isTop ? 1 : 0.7,
              }}
            >
              <h2 className="mb-2 text-lg font-medium">{l.title}</h2>
              <p className="mb-5 text-sm text-muted-foreground">{l.body}</p>

              {isTop && (
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    onClick={handleReject}
                    disabled={l.rejectDisabled}
                    className="rounded-md border border-border bg-muted/30 px-5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {l.reject}
                  </button>
                  <button
                    onClick={handleAccept}
                    className="btn-neon rounded-md px-6 py-2 text-sm uppercase tracking-[0.2em]"
                  >
                    {l.accept}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
