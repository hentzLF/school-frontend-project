"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LISTING_ROUTES, COUNTY_ROUTES, CATEGORY_ROUTES } from "@/config/constants";
import type { Listing, CreateListingRequest, ListingFilters } from "@/types/listing";
import type { PaginatedResponse } from "@/types/api";
import type { County } from "@/types/county";
import type { Category } from "@/types/category";

export function useListings(filters: ListingFilters = {}): ReturnType<typeof useQuery<PaginatedResponse<Listing>>> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.countyId) params.set("countyId", filters.countyId);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.page !== undefined) params.set("page", String(filters.page));
  if (filters.pageSize !== undefined) params.set("pageSize", String(filters.pageSize));

  const query = params.toString();
  const url = `${LISTING_ROUTES.list}${query ? `?${query}` : ""}`;

  return useQuery<PaginatedResponse<Listing>>({
    queryKey: ["listings", filters],
    queryFn: () => api<PaginatedResponse<Listing>>(url),
  });
}

export function useListing(id: string): ReturnType<typeof useQuery<Listing>> {
  return useQuery<Listing>({
    queryKey: ["listings", id],
    queryFn: () => api<Listing>(LISTING_ROUTES.detail(id)),
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation<Listing, Error, CreateListingRequest>({
    mutationFn: (data) =>
      api<Listing>(LISTING_ROUTES.list, { method: "POST", body: data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useCounties(): ReturnType<typeof useQuery<County[]>> {
  return useQuery<County[]>({
    queryKey: ["counties"],
    queryFn: () => api<County[]>(COUNTY_ROUTES.list),
    staleTime: 30 * 60 * 1000,
  });
}

export function useCategories(): ReturnType<typeof useQuery<Category[]>> {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api<Category[]>(CATEGORY_ROUTES.list),
    staleTime: 30 * 60 * 1000,
  });
}
