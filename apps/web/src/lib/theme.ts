import type { AgeBand } from "./constants";

export interface AgeBandTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  label: string;
}

export const ageBandThemes: Record<AgeBand, AgeBandTheme> = {
  seedlings: {
    primary: "#3B82C4",
    secondary: "#A8D4F5",
    accent: "#E8B4D0",
    background: "#FFF8F0",
    cardBg: "#FFFFFF",
    label: "Seedlings",
  },
  sprouts: {
    primary: "#4CAF6E",
    secondary: "#F5A623",
    accent: "#FF7E6B",
    background: "#FFF8F0",
    cardBg: "#FFFFFF",
    label: "Sprouts",
  },
  explorers: {
    primary: "#1E5FA0",
    secondary: "#D4920B",
    accent: "#9B7ED8",
    background: "#FFF8F0",
    cardBg: "#FFFFFF",
    label: "Explorers",
  },
};

export function getAgeBandTheme(ageBand: AgeBand): AgeBandTheme {
  return ageBandThemes[ageBand];
}
