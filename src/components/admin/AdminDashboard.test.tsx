import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AdminDashboard } from "./AdminDashboard";
import type { AdminDashboard as AdminDashboardType } from "@/types/admin";

afterEach(cleanup);

const mockDashboardData: AdminDashboardType = {
  totalUsers: 42,
  totalListings: 15,
  totalBookings: 100,
  totalRevenue: 2500.5,
  recentBookings: 7,
  activeListings: 10,
};

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

vi.mock("@/components/common/PageHeader", () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("@/components/common/LoadingState", () => ({
  LoadingState: ({ label }: { label: string }) => (
    <div data-testid="loading-state">{label}</div>
  ),
}));

vi.mock("@/components/common/ErrorState", () => ({
  ErrorState: ({ message }: { message: string }) => (
    <div data-testid="error-state">{message}</div>
  ),
}));

const mockUseAdminDashboard = vi.fn();

vi.mock("@/hooks/useAdmin", () => ({
  useAdminDashboard: () => mockUseAdminDashboard(),
}));

describe("AdminDashboard", () => {
  it("should render loading state when isLoading is true", () => {
    mockUseAdminDashboard.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    render(<AdminDashboard />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("should render error state when error is present", () => {
    mockUseAdminDashboard.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    });
    render(<AdminDashboard />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("should render dashboard stats when data is loaded", () => {
    mockUseAdminDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });
    render(<AdminDashboard />);
    expect(screen.getByText("admin.dashboard")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("2500.50 EUR")).toBeInTheDocument();
  });

  it("should render nothing when data is undefined and not loading", () => {
    mockUseAdminDashboard.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
    const { container } = render(<AdminDashboard />);
    expect(container.firstChild).toBeNull();
  });
});
