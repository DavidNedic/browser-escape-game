import { LevelMirror } from "./LevelMirror";
import { LevelShake } from "./LevelShake";
import { LevelPatience } from "./LevelPatience";
import { LevelKonami } from "./LevelKonami";
import { LevelTypo } from "./LevelTypo";
import { LevelDarkroom } from "./LevelDarkroom";
import { LevelSlider } from "./LevelSlider";
import { LevelDragLetters } from "./LevelDragLetters";
import { LevelResize } from "./LevelResize";
import { LevelTrustfall } from "./LevelTrustfall";
import type { LevelDef } from "./types";

// Add new levels here — they'll automatically appear in the game.
export const LEVELS: LevelDef[] = [
  { id: "mirror", name: "Spiegelwelt", Component: LevelMirror },
  { id: "shake", name: "Schüttel-Maschine", Component: LevelShake },
  { id: "patience", name: "Stille", Component: LevelPatience },
  { id: "konami", name: "Beschwörung", Component: LevelKonami },
  { id: "typo", name: "Tippfehler-Eid", Component: LevelTypo },
  { id: "darkroom", name: "Dunkelraum", Component: LevelDarkroom },
  { id: "slider", name: "Frequenz", Component: LevelSlider },
  { id: "drag", name: "Wortbau", Component: LevelDragLetters },
  { id: "resize", name: "Schrumpfraum", Component: LevelResize },
  { id: "trust", name: "Vertrauenssturz", Component: LevelTrustfall },
];
