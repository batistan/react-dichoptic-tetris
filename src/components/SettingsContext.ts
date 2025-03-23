import {createContext} from "react";
import {blueSwatches, redSwatches} from "../swatches.ts";

export interface Settings {
  showGhost: boolean;
  fallingColorHex: string;
  landedColorHex: string;
}

export const defaultSettings = {
  showGhost: true,
  fallingColorHex: redSwatches[redSwatches.length / 2],
  landedColorHex: blueSwatches[blueSwatches.length / 2]
}

export const settingsContext = createContext<Settings>(defaultSettings);
