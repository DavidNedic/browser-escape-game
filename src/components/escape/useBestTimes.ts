import { useCallback, useEffect, useState } from "react";

const NAME_KEY = "escape.playerName";
const TIMES_KEY = "escape.bestTimes";

export type BestTimeEntry = {
  ms: number;
  name: string;
  at: number; // timestamp
};

export type BestTimes = Record<string, BestTimeEntry>;

function readTimes(): BestTimes {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(TIMES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as BestTimes;
  } catch {
    return {};
  }
}

function readName(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function useBestTimes() {
  const [name, setNameState] = useState<string>("");
  const [times, setTimes] = useState<BestTimes>({});

  useEffect(() => {
    setName(readName());
    setTimes(readTimes());
    function onStorage(e: StorageEvent) {
      if (e.key === TIMES_KEY) setTimes(readTimes());
      if (e.key === NAME_KEY) setNameState(readName());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setName = useCallback((newName: string) => {
    setNameState(newName);
    try {
      localStorage.setItem(NAME_KEY, newName);
    } catch {
      // ignore
    }
  }, []);

  const submitTime = useCallback(
    (levelId: string, ms: number): { isBest: boolean; previous?: BestTimeEntry } => {
      const current = readTimes();
      const previous = current[levelId];
      if (!previous || ms < previous.ms) {
        const entry: BestTimeEntry = {
          ms,
          name: readName() || "Anonym",
          at: Date.now(),
        };
        const next = { ...current, [levelId]: entry };
        try {
          localStorage.setItem(TIMES_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        setTimes(next);
        return { isBest: true, previous };
      }
      return { isBest: false, previous };
    },
    [],
  );

  return { name, setName, times, submitTime };
}

export function formatTime(ms: number): string {
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const cs = Math.floor((ms % 1000) / 10);
  if (m > 0) {
    return `${m}:${s.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
  }
  return `${s}.${cs.toString().padStart(2, "0")}s`;
}
