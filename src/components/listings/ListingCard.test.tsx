import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ListingCard } from "./ListingCard";
import type { Listing } from "@/types/listing";

afterEach(cleanup);

const mockListing: Listing = {
  id: "1",
  title: "Tractor Service",
  description: "Professional tractor service for your fields",
  price: 50,
  priceUnit: "hour",
  categoryId: "cat-1",
  categoryName: "Plowing",
  countyId: "county-1",
  countyName: "Harju",
  providerId: "prov-1",
  providerName: "John Farmer",
  status: "Active",
  imageUrl: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("ListingCard", () => {
  it("should render listing title and description", () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText("Tractor Service")).toBeInTheDocument();
    expect(screen.getByText("Professional tractor service for your fields")).toBeInTheDocument();
  });

  it("should render price, county, category, and provider", () => {
    const { container } = render(<ListingCard listing={mockListing} />);
    expect(container.textContent).toContain("50.00 EUR / hour");
    expect(container.textContent).toContain("Harju");
    expect(container.textContent).toContain("Plowing");
    expect(container.textContent).toContain("John Farmer");
  });

  it("should link to listing detail page", () => {
    render(<ListingCard listing={mockListing} />);
    const link = screen.getByRole("link", { name: /Tractor Service/i });
    expect(link).toHaveAttribute("href", "/listings/1");
  });
});
