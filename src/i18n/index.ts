import { en } from "./locales/en";
import { et } from "./locales/et";
import type { TranslationKeys } from "./locales/en";

export type Locale = "en" | "et";

export const locales: Record<Locale, TranslationKeys> = { en, et };

export const localeNames: Record<Locale, string> = {
  en: "English",
  et: "Eesti",
};

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationKeys>;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".");
  let result: unknown = locales[locale];

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  return typeof result === "string" ? result : key;
}
