import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AdminPayments } from "./AdminPayments";
import type { Payment } from "@/types/payment";

afterEach(cleanup);

const mockPayments: Payment[] = [
  {
    id: "pay-1",
    bookingId: "booking-1",
    amount: 240.0,
    currency: "EUR",
    status: "Completed",
    paymentMethod: "Card",
    transactionId: "txn-abc123",
    createdAt: "2025-06-01T12:00:00Z",
  },
  {
    id: "pay-2",
    bookingId: "booking-2",
    amount: 360.5,
    currency: "EUR",
    status: "Pending",
    paymentMethod: "BankTransfer",
    transactionId: null,
    createdAt: "2025-07-10T08:00:00Z",
  },
];

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

vi.mock("@/components/common/EmptyState", () => ({
  EmptyState: ({ title }: { title: string }) => (
    <div data-testid="empty-state">{title}</div>
  ),
}));

vi.mock("@/components/common/StatusBadge", () => ({
  StatusBadge: ({ label }: { label: string }) => (
    <span data-testid="status-badge">{label}</span>
  ),
}));

const mockUseAdminPayments = vi.fn();

vi.mock("@/hooks/useAdmin", () => ({
  useAdminPayments: () => mockUseAdminPayments(),
}));

describe("AdminPayments", () => {
  it("should render loading state when isLoading is true", () => {
    mockUseAdminPayments.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    render(<AdminPayments />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("should render error state when error is present", () => {
    mockUseAdminPayments.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    });
    render(<AdminPayments />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("should render empty state when payments list is empty", () => {
    mockUseAdminPayments.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    render(<AdminPayments />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("should render payment rows when data is loaded", () => {
    mockUseAdminPayments.mockReturnValue({
      data: mockPayments,
      isLoading: false,
      error: null,
    });
    render(<AdminPayments />);
    // Transaction id shown when present
    expect(screen.getByText("txn-abc123")).toBeInTheDocument();
    expect(screen.getByText("Card")).toBeInTheDocument();
    expect(screen.getByText("240.00 EUR")).toBeInTheDocument();
    expect(screen.getByText("BankTransfer")).toBeInTheDocument();
    expect(screen.getByText("360.50 EUR")).toBeInTheDocument();
  });

  it("should fall back to sliced id when transactionId is null", () => {
    mockUseAdminPayments.mockReturnValue({
      data: [mockPayments[1]],
      isLoading: false,
      error: null,
    });
    render(<AdminPayments />);
    // pay-2 sliced to 12 chars = "pay-2"
    expect(screen.getByText("pay-2")).toBeInTheDocument();
  });
});
