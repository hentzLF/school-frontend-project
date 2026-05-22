import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AdminSidebar } from "./AdminSidebar";

afterEach(cleanup);

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
}));

describe("AdminSidebar", () => {
  it("should render the admin navigation landmark", () => {
    render(<AdminSidebar />);
    expect(
      screen.getByRole("navigation", { name: "Admin navigation" }),
    ).toBeInTheDocument();
  });

  it("should render all admin nav links", () => {
    render(<AdminSidebar />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(6);
  });

  it("should mark the current path link as active with aria-current", () => {
    render(<AdminSidebar />);
    // pathname is mocked to /admin so the overview link should be active
    const overviewLink = screen.getByRole("link", { name: /admin\.overview/i });
    expect(overviewLink).toHaveAttribute("aria-current", "page");
  });

  it("should render the admin title label", () => {
    render(<AdminSidebar />);
    expect(screen.getByText("admin.title")).toBeInTheDocument();
  });
});
