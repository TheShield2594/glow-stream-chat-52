import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

export interface AccentColor {
  name: string;
  hue: number;
  saturation: number;
  lightness: number;
}

export const accentColors: AccentColor[] = [
  { name: "Blue", hue: 220, saturation: 65, lightness: 54 },
  { name: "Violet", hue: 262, saturation: 60, lightness: 55 },
  { name: "Rose", hue: 350, saturation: 65, lightness: 52 },
  { name: "Amber", hue: 32, saturation: 60, lightness: 52 },
  { name: "Emerald", hue: 152, saturation: 55, lightness: 42 },
  { name: "Cyan", hue: 190, saturation: 65, lightness: 48 },
  { name: "Orange", hue: 24, saturation: 75, lightness: 50 },
  { name: "Slate", hue: 220, saturation: 14, lightness: 46 },
];

export type FontOption = "inter" | "jetbrains" | "system" | "georgia";

export const fontOptions: { id: FontOption; label: string; family: string }[] = [
  { id: "inter", label: "Inter", family: '"Inter", system-ui, sans-serif' },
  { id: "system", label: "System", family: 'system-ui, -apple-system, sans-serif' },
  { id: "georgia", label: "Georgia", family: 'Georgia, "Times New Roman", serif' },
  { id: "jetbrains", label: "JetBrains Mono", family: '"JetBrains Mono", monospace' },
];

interface ThemeState {
  mode: ThemeMode;
  accent: AccentColor;
  font: FontOption;
}

interface ThemeContextValue extends ThemeState {
  setMode: (m: ThemeMode) => void;
  setAccent: (a: AccentColor) => void;
  setFont: (f: FontOption) => void;
  resolvedMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "app-theme";

function getInitial(): ThemeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { mode: "light", accent: accentColors[0], font: "inter" };
}

function resolveMode(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(getInitial);
  const resolved = resolveMode(state.mode);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Apply dark class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [resolved]);

  // Apply accent color as CSS vars
  useEffect(() => {
    const root = document.documentElement;
    const a = state.accent;
    root.style.setProperty("--primary", `${a.hue} ${a.saturation}% ${a.lightness}%`);
    root.style.setProperty("--ring", `${a.hue} ${a.saturation}% ${a.lightness}%`);
    root.style.setProperty("--sidebar-primary", `${a.hue} ${a.saturation}% ${a.lightness}%`);
    root.style.setProperty("--sidebar-ring", `${a.hue} ${a.saturation}% ${a.lightness}%`);
  }, [state.accent]);

  // Apply font
  useEffect(() => {
    const opt = fontOptions.find((f) => f.id === state.font);
    if (opt) document.documentElement.style.setProperty("--font-sans", opt.family);
  }, [state.font]);

  // Listen for system theme changes
  useEffect(() => {
    if (state.mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setState((s) => ({ ...s })); // trigger re-render
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [state.mode]);

  return (
    <ThemeContext.Provider
      value={{
        ...state,
        resolvedMode: resolved,
        setMode: (mode) => setState((s) => ({ ...s, mode })),
        setAccent: (accent) => setState((s) => ({ ...s, accent })),
        setFont: (font) => setState((s) => ({ ...s, font })),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
