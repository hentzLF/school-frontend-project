"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { localeNames } from "@/i18n";
import type { Locale } from "@/i18n";

export function LocaleSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      aria-label="Select language"
    >
      {(Object.entries(localeNames) as [Locale, string][]).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
