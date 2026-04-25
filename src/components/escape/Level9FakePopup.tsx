import { useEffect, useState } from "react";
import type { LevelProps } from "./types";

export function Level9FakePopup({ onSolve }: LevelProps) {
  const [showPopup, setShowPopup] = useState(true);

  // Esc closes the fake popup
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPopup(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const reallyReload = () => {
    // Total reset — wipe app state and reload.
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  return (
    <div className="room-enter relative flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Fast geschafft
      </p>
      <h2 className="text-glow text-center text-3xl font-light tracking-widest md:text-5xl">
        Der letzte Raum.
      </h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        Irgendwo hier ist der Ausgang. Hoffentlich.
      </p>

      {/* The "real" exit — hidden behind the fake popup */}
      <button
        onClick={onSolve}
        className="btn-neon rounded-md px-10 py-4 text-sm uppercase tracking-[0.4em]"
      >
        Entkommen
      </button>

      {/* Fake system error modal */}
      {showPopup && <FakeSystemModal onReload={reallyReload} />}
    </div>
  );
}

function FakeSystemModal({ onReload }: { onReload: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.55)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, sans-serif",
      }}
    >
      <div
        className="w-[420px] max-w-[92vw] overflow-hidden rounded-md shadow-2xl"
        style={{ background: "#f3f3f3", color: "#1a1a1a" }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-3 py-2 text-xs"
          style={{
            background: "#e1e1e1",
            borderBottom: "1px solid #c8c8c8",
            color: "#222",
          }}
        >
          <span>System</span>
          <div className="flex gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: "#c8c8c8" }}
            />
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: "#c8c8c8" }}
            />
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: "#d97070" }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex gap-4 p-5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold"
            style={{ background: "#d83b3b", color: "#fff" }}
          >
            !
          </div>
          <div className="flex-1">
            <p className="mb-1 text-sm font-semibold" style={{ color: "#1a1a1a" }}>
              Fehler 404: Sitzung abgelaufen
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#3a3a3a" }}>
              Die Verbindung zur Anwendung wurde unterbrochen. Bitte klicke auf
              "Neu laden", um die Seite wiederherzustellen.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-2 px-4 py-3"
          style={{ background: "#ececec", borderTop: "1px solid #d4d4d4" }}
        >
          <button
            onClick={onReload}
            className="rounded px-5 py-1.5 text-xs font-medium text-white transition-colors"
            style={{ background: "#1a73e8" }}
          >
            Neu laden
          </button>
        </div>
      </div>
    </div>
  );
}
