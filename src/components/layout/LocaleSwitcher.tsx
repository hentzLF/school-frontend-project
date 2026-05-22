"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { localeNames } from "@/i18n";
import type { Locale } from "@/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LocaleSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <Select
      value={locale}
      onValueChange={(value) => setLocale(value as Locale)}
    >
      <SelectTrigger size="sm" className="gap-1.5" aria-label="Select language">
        <Languages
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(localeNames) as [Locale, string][]).map(
          ([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
}
