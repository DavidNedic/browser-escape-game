import { useEffect, useState } from "react";
import type { LevelProps } from "./types";

export function Level2Scroll({ onSolve }: LevelProps) {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.scrollTo(0, 0);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="room-enter relative" style={{ minHeight: "400vh" }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-6 px-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Hinweis
        </p>
        <h2 className="text-glow text-3xl font-light tracking-wide md:text-5xl">
          Der Ausweg liegt in der Tiefe.
        </h2>
        <div className="mt-12 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs">↓</span>
          <span className="text-xs">↓</span>
          <span className="text-xs animate-pulse">↓</span>
        </div>
      </div>

      <div
        className="pointer-events-none fixed bottom-0 left-0 h-px bg-primary transition-all duration-300"
        style={{ width: `${scrollPct * 100}%`, boxShadow: "0 0 8px var(--neon-glow)" }}
      />

      <div className="absolute bottom-0 left-0 right-0 flex h-screen flex-col items-center justify-end pb-16">
        <p className="mb-8 text-sm text-muted-foreground/60">… du bist angekommen.</p>
        <button
          onClick={onSolve}
          className="btn-neon rounded-md px-8 py-3 text-sm uppercase tracking-[0.3em]"
        >
          Tür öffnen
        </button>
      </div>
    </div>
  );
}
