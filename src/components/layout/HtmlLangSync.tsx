"use client";

import { useEffect } from "react";
import { useLocaleStore } from "@/stores/localeStore";

/**
 * Keeps the document's `<html lang>` attribute in sync with the selected
 * locale. The root layout renders a static `lang="en"`; this updates it once
 * the persisted locale store has hydrated on the client.
 */
export function HtmlLangSync() {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
