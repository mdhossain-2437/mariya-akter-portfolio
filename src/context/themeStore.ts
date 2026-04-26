import { createContext } from "react";

export type Theme = "light" | "dark";

export type ThemeCtxValue = {
  theme: Theme;
  toggle: () => void;
  set: (t: Theme) => void;
};

export const ThemeContext = createContext<ThemeCtxValue | null>(null);

export function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
