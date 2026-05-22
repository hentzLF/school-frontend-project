import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { PaymentList } from "./PaymentList";
import type { Payment } from "@/types/payment";

afterEach(cleanup);

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock("@/hooks/usePayments", () => ({
  usePayments: vi.fn(),
  useCreatePayment: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "common.loading": "Loading...",
        "payments.loadError": "Failed to load payments",
        "payments.title": "My Payments",
        "payments.noPayments": "No payments yet",
        "payments.processPayment": "Process Payment",
        "payments.paymentMethod": "Payment Method",
        "payments.bankTransfer": "Bank Transfer",
        "payments.creditCard": "Credit Card",
        "payments.cash": "Cash",
        "payments.payNow": "Pay Now",
        "payments.processing": "Processing...",
        "payments.booking": "Booking",
        "payments.paymentFailed": "Payment failed",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

const mockPayment: Payment = {
  id: "pay-1",
  bookingId: "booking-12345678",
  amount: 150.0,
  currency: "EUR",
  status: "Completed",
  paymentMethod: "bank_transfer",
  transactionId: "txn-001",
  createdAt: "2026-05-01T00:00:00Z",
};

describe("PaymentList", () => {
  it("should render loading state", async () => {
    const { usePayments } = await import("@/hooks/usePayments");
    vi.mocked(usePayments).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof usePayments>);

    render(<PaymentList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render error state", async () => {
    const { usePayments } = await import("@/hooks/usePayments");
    vi.mocked(usePayments).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    } as ReturnType<typeof usePayments>);

    render(<PaymentList />);
    expect(screen.getByText("Failed to load payments")).toBeInTheDocument();
  });

  it("should render empty state when no payments", async () => {
    const { usePayments } = await import("@/hooks/usePayments");
    vi.mocked(usePayments).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as ReturnType<typeof usePayments>);

    render(<PaymentList />);
    expect(screen.getByText("No payments yet")).toBeInTheDocument();
  });

  it("should render payment details when payments exist", async () => {
    const { usePayments } = await import("@/hooks/usePayments");
    vi.mocked(usePayments).mockReturnValue({
      data: [mockPayment],
      isLoading: false,
      error: null,
    } as ReturnType<typeof usePayments>);

    const { container } = render(<PaymentList />);
    expect(container.textContent).toContain("booking-");
    expect(container.textContent).toContain("150.00");
    expect(container.textContent).toContain("EUR");
  });
});
