import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LandingContent } from "./LandingContent";

afterEach(cleanup);

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "landing.signIn": "Sign in",
        "landing.badge": "Agricultural Marketplace",
        "landing.title": "Connect with Agricultural Service Providers",
        "landing.subtitle": "Find the right services for your farm",
        "landing.getStarted": "Get Started",
        "landing.feature1Title": "Browse Listings",
        "landing.feature1Desc": "Find agricultural services in your area",
        "landing.feature2Title": "Book Services",
        "landing.feature2Desc": "Schedule services with providers",
        "landing.feature3Title": "Leave Reviews",
        "landing.feature3Desc": "Share your experience",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

vi.mock("@/stores/themeStore", () => ({
  useThemeStore: (selector: (s: { toggleTheme: () => void }) => unknown) =>
    selector({ toggleTheme: vi.fn() }),
}));

describe("LandingContent", () => {
  it("should render the main heading", () => {
    render(<LandingContent />);
    expect(
      screen.getByText("Connect with Agricultural Service Providers"),
    ).toBeInTheDocument();
  });

  it("should render sign in and get started links", () => {
    render(<LandingContent />);
    const signInButtons = screen.getAllByRole("button", { name: /sign in/i });
    expect(signInButtons.length).toBeGreaterThanOrEqual(1);
    expect(signInButtons[0]).toHaveAttribute("href", "/login");

    const getStartedButton = screen.getByRole("button", { name: /get started/i });
    expect(getStartedButton).toHaveAttribute("href", "/listings");
  });

  it("should render the three feature cards", () => {
    render(<LandingContent />);
    expect(screen.getByText("Browse Listings")).toBeInTheDocument();
    expect(screen.getByText("Book Services")).toBeInTheDocument();
    expect(screen.getByText("Leave Reviews")).toBeInTheDocument();
  });

  it("should render the AgriMarket logo", () => {
    render(<LandingContent />);
    expect(screen.getByText("AgriMarket")).toBeInTheDocument();
  });
});
