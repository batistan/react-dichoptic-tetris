import {useEffect, useState} from "react";

export type Theme = "dark" | "light";

const themePreference = localStorage.getItem("theme") ??
  (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";

export default function useDarkMode(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(themePreference);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  useEffect(() => {
    const root = window.document.documentElement;
    const currentColorMode = theme === "dark" ? "light" : "dark";

    root.classList.remove(currentColorMode);
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme])

  return [theme, toggleDarkMode]
}