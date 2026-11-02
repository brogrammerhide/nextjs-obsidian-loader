"use client";

import { useEffect, useRef } from "react";
import {
  defaultTheme,
  isThemeName,
  themeStorageKey,
  themes,
} from "@/lib/themes";

export default function ThemeSwitcher() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(themeStorageKey);
      if (savedTheme && isThemeName(savedTheme)) {
        document.documentElement.dataset.theme = savedTheme;
        if (selectRef.current) selectRef.current.value = savedTheme;
      }
    } catch {
      if (statusRef.current) statusRef.current.textContent = "Not saved";
    }
  }, []);

  function handleThemeChange(value: string) {
    if (!isThemeName(value)) return;

    document.documentElement.dataset.theme = value;

    try {
      window.localStorage.setItem(themeStorageKey, value);
      if (statusRef.current) statusRef.current.textContent = "";
    } catch {
      if (statusRef.current) statusRef.current.textContent = "Not saved";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-medium text-slate-400 sm:inline">
        Theme
      </span>
      <select
        ref={selectRef}
        aria-label="Color theme"
        onChange={(event) => handleThemeChange(event.target.value)}
        defaultValue={defaultTheme}
        className="max-w-32 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs font-medium text-slate-200 outline-none transition-colors hover:border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 sm:max-w-none sm:px-3 sm:text-sm"
      >
        {themes.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <span
        ref={statusRef}
        role="status"
        className="text-[10px] leading-tight text-red-300"
      />
    </div>
  );
}
