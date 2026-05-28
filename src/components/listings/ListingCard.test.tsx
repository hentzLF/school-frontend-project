import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ListingCard } from "./ListingCard";
import type { Listing } from "@/types/listing";

afterEach(cleanup);

const mockListing: Listing = {
  id: "1",
  title: "Tractor Service",
  categoryName: "Plowing",
  providerName: "John Farmer",
  pricePerHectare: 50,
  isActive: true,
  averageRating: 4.5,
  reviewCount: 10,
};

describe("ListingCard", () => {
  it("should render listing title", () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText("Tractor Service")).toBeInTheDocument();
  });

  it("should render price, category, and provider", () => {
    const { container } = render(<ListingCard listing={mockListing} />);
    expect(container.textContent).toContain("50.00 EUR / ha");
    expect(container.textContent).toContain("Plowing");
    expect(container.textContent).toContain("John Farmer");
  });

  it("should link to listing detail page", () => {
    render(<ListingCard listing={mockListing} />);
    const link = screen.getByRole("link", { name: /Tractor Service/i });
    expect(link).toHaveAttribute("href", "/listings/1");
  });
});
