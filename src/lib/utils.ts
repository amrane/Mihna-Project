import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ThemeMode = "light" | "dark";

export function getTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("mihna-theme") as ThemeMode) || "light";
}

export function applyTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("mihna-theme", theme);
}
