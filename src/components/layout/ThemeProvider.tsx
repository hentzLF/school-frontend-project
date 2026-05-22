"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";

/**
 * Keeps the `dark` class on <html> in sync with the persisted theme store.
 * Renders nothing — purely a side-effect component.
 */
export function ThemeProvider() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}

/**
 * Static, inline script that applies the persisted theme before first paint
 * to avoid a flash of the wrong color scheme. The content is a fixed literal
 * with no user input, so it carries no XSS risk.
 */
const themeInitScript = `(function(){try{var s=localStorage.getItem('agrimarket-theme');if(s&&JSON.parse(s).state.theme==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export function ThemeInitScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
}
