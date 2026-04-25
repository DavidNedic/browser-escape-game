import { Level1Click } from "./Level1Click";
import { Level2Scroll } from "./Level2Scroll";
import { Level3Hover } from "./Level3Hover";
import type { LevelDef } from "./types";

// Add new levels here — they'll automatically appear in the game.
export const LEVELS: LevelDef[] = [
  { id: "click", name: "Der Knopf", Component: Level1Click },
  { id: "scroll", name: "Die Tiefe", Component: Level2Scroll },
  { id: "hover", name: "Das Licht", Component: Level3Hover },
];
