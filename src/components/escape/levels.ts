import { Level1Click } from "./Level1Click";
import { Level2Scroll } from "./Level2Scroll";
import { Level3Hover } from "./Level3Hover";
import { Level4Flee } from "./Level4Flee";
import { Level5Bait } from "./Level5Bait";
import { Level6Exact } from "./Level6Exact";
import { Level7InvisibleInk } from "./Level7InvisibleInk";
import { Level8CursedCheckboxes } from "./Level8CursedCheckboxes";
import { Level9FakePopup } from "./Level9FakePopup";
import type { LevelDef } from "./types";

// Add new levels here — they'll automatically appear in the game.
export const LEVELS: LevelDef[] = [
  { id: "click", name: "Der Knopf", Component: Level1Click },
  { id: "scroll", name: "Die Tiefe", Component: Level2Scroll },
  { id: "hover", name: "Das Licht", Component: Level3Hover },
  { id: "flee", name: "Der Flüchtige", Component: Level4Flee },
  { id: "bait", name: "Die Ablenkung", Component: Level5Bait },
  { id: "exact", name: "Präzision", Component: Level6Exact },
  { id: "ink", name: "Unsichtbare Tinte", Component: Level7InvisibleInk },
  { id: "cursed", name: "Verfluchte Boxen", Component: Level8CursedCheckboxes },
  { id: "popup", name: "Trügerisches Pop-up", Component: Level9FakePopup },
];
