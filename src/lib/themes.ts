export const themes = [
  { id: "midnight", name: "Midnight Violet", swatch: "#8b5cf6" },
  { id: "obsidian", name: "Obsidian", swatch: "#c084fc" },
  { id: "ocean", name: "Ocean", swatch: "#06b6d4" },
  { id: "forest", name: "Forest", swatch: "#22c55e" },
  { id: "sunset", name: "Sunset", swatch: "#f97316" },
  { id: "rose", name: "Rose", swatch: "#ec4899" },
  { id: "paper", name: "Paper", swatch: "#7c3aed" },
  { id: "nord", name: "Nord", swatch: "#88c0d0" },
] as const;

export type ThemeName = (typeof themes)[number]["id"];

export const defaultTheme: ThemeName = "midnight";
export const themeStorageKey = "obsidian-loader-theme";

export function isThemeName(value: string): value is ThemeName {
  return themes.some((theme) => theme.id === value);
}
