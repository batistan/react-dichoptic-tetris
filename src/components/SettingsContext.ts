import {createContext} from "react";
import {blueSwatches, redSwatches} from "../swatches.ts";

export interface Settings {
  showGhost: boolean;
  fallingColorHex: string;
  landedColorHex: string;
  updateSettings: (settings: Settings) => Settings;
}

const savedSettings: Settings | null = localStorage?.getItem("settings") && JSON.parse(atob(localStorage.getItem("settings")!))

export const defaultSettings = savedSettings ?? {
  showGhost: true,
  fallingColorHex: redSwatches[redSwatches.length / 2],
  landedColorHex: blueSwatches[blueSwatches.length / 2],
  updateSettings: (settings: Settings) => settings, // no-op
}

export const settingsContext = createContext<Settings>(defaultSettings);
