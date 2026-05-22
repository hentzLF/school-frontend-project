"use client";

import { useCallback } from "react";
import { useLocaleStore } from "@/stores/localeStore";
import { getTranslation } from "@/i18n";
import type { Locale } from "@/i18n";

type UseTranslationReturn = {
  t: (key: string) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export function useTranslation(): UseTranslationReturn {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const t = useCallback(
    (key: string) => getTranslation(locale, key),
    [locale]
  );

  return { t, locale, setLocale };
}
