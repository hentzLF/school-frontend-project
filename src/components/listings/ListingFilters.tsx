"use client";

import { useCategories, useCounties } from "@/hooks/useListings";
import type { ListingFilters as ListingFiltersType } from "@/types/listing";

type ListingFiltersProps = {
  filters: ListingFiltersType;
  onFiltersChange: (filters: ListingFiltersType) => void;
};

export function ListingFilters({ filters, onFiltersChange }: ListingFiltersProps) {
  const { data: counties } = useCounties();
  const { data: categories } = useCategories();

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Search listings..."
        value={filters.search ?? ""}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value, page: 1 })}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <select
        value={filters.categoryId ?? ""}
        onChange={(e) => onFiltersChange({ ...filters, categoryId: e.target.value || undefined, page: 1 })}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <select
        value={filters.countyId ?? ""}
        onChange={(e) => onFiltersChange({ ...filters, countyId: e.target.value || undefined, page: 1 })}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Filter by county"
      >
        <option value="">All counties</option>
        {counties?.map((county) => (
          <option key={county.id} value={county.id}>{county.name}</option>
        ))}
      </select>
    </div>
  );
}
