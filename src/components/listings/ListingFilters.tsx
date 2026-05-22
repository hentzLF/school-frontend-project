"use client";

import { Search } from "lucide-react";
import { useCategories, useCounties } from "@/hooks/useListings";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ListingFilters as ListingFiltersType } from "@/types/listing";

type ListingFiltersProps = {
  filters: ListingFiltersType;
  onFiltersChange: (filters: ListingFiltersType) => void;
};

export function ListingFilters({
  filters,
  onFiltersChange,
}: ListingFiltersProps) {
  const { data: counties } = useCounties();
  const { data: categories } = useCategories();
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <div className="relative sm:min-w-56 sm:flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder={t("listings.searchPlaceholder")}
          value={filters.search ?? ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value, page: 1 })
          }
          className="pl-8"
          aria-label={t("common.search")}
        />
      </div>

      <Select
        value={filters.categoryId ?? "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            categoryId: value && value !== "all" ? value : undefined,
            page: 1,
          })
        }
      >
        <SelectTrigger
          className="w-full sm:w-48"
          aria-label={t("listings.category")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("listings.allCategories")}</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.countyId ?? "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            countyId: value && value !== "all" ? value : undefined,
            page: 1,
          })
        }
      >
        <SelectTrigger
          className="w-full sm:w-48"
          aria-label={t("listings.county")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("listings.allCounties")}</SelectItem>
          {counties?.map((county) => (
            <SelectItem key={county.id} value={county.id}>
              {county.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
