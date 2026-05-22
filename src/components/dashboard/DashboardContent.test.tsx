import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DashboardContent } from "./DashboardContent";

afterEach(cleanup);

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "dashboard.welcome": "Welcome to AgriMarket",
        "dashboard.subtitle": "Manage your agricultural services",
        "nav.listings": "Listings",
        "nav.bookings": "Bookings",
        "nav.payments": "Payments",
        "nav.messages": "Messages",
        "nav.equipment": "Equipment",
        "nav.reviews": "Reviews",
        "dashboard.listingsDesc": "Browse available services",
        "dashboard.bookingsDesc": "Manage your bookings",
        "dashboard.paymentsDesc": "View payment history",
        "dashboard.messagesDesc": "Chat with users",
        "dashboard.equipmentDesc": "Manage your equipment",
        "dashboard.reviewsDesc": "See your reviews",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

describe("DashboardContent", () => {
  it("should render the welcome heading", () => {
    render(<DashboardContent />);
    expect(screen.getByText("Welcome to AgriMarket")).toBeInTheDocument();
  });

  it("should render all dashboard navigation links", () => {
    render(<DashboardContent />);
    expect(screen.getByRole("link", { name: /listings/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /bookings/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /payments/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /messages/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /equipment/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /reviews/i })).toBeInTheDocument();
  });

  it("should have correct hrefs for all dashboard links", () => {
    render(<DashboardContent />);
    const expectedHrefs = [
      "/listings",
      "/bookings",
      "/payments",
      "/messages",
      "/equipment",
      "/reviews",
    ];

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    for (const href of expectedHrefs) {
      expect(hrefs).toContain(href);
    }
  });
});
