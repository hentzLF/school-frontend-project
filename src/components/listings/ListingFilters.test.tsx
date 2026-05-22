import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ListingFilters } from "./ListingFilters";

afterEach(cleanup);

vi.mock("@/hooks/useListings", () => ({
  useListings: vi.fn(),
  useCategories: vi.fn(),
  useCounties: vi.fn(),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "listings.searchPlaceholder": "Search listings...",
        "listings.allCategories": "All Categories",
        "listings.allCounties": "All Counties",
        "listings.category": "Category",
        "listings.county": "County",
        "common.search": "Search",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

describe("ListingFilters", () => {
  it("should render the search input", async () => {
    const { useCategories, useCounties } = await import("@/hooks/useListings");
    vi.mocked(useCategories).mockReturnValue({ data: [] } as ReturnType<typeof useCategories>);
    vi.mocked(useCounties).mockReturnValue({ data: [] } as ReturnType<typeof useCounties>);

    render(
      <ListingFilters
        filters={{ page: 1, pageSize: 12 }}
        onFiltersChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("textbox", { name: /search/i })).toBeInTheDocument();
  });

  it("should call onFiltersChange when search input changes", async () => {
    const { useCategories, useCounties } = await import("@/hooks/useListings");
    vi.mocked(useCategories).mockReturnValue({ data: [] } as ReturnType<typeof useCategories>);
    vi.mocked(useCounties).mockReturnValue({ data: [] } as ReturnType<typeof useCounties>);

    const user = userEvent.setup();
    const onFiltersChange = vi.fn();

    render(
      <ListingFilters
        filters={{ page: 1, pageSize: 12 }}
        onFiltersChange={onFiltersChange}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: /search/i }), "tractor");
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it("should render category and county selects", async () => {
    const { useCategories, useCounties } = await import("@/hooks/useListings");
    vi.mocked(useCategories).mockReturnValue({
      data: [{ id: "cat-1", name: "Plowing" }],
    } as ReturnType<typeof useCategories>);
    vi.mocked(useCounties).mockReturnValue({
      data: [{ id: "county-1", name: "Harju" }],
    } as ReturnType<typeof useCounties>);

    render(
      <ListingFilters
        filters={{ page: 1, pageSize: 12 }}
        onFiltersChange={vi.fn()}
      />,
    );

    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(2);
  });
});
