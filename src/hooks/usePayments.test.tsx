import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/api", () => ({
  api: vi.fn(),
}));

import { api } from "@/lib/api";
import { usePayments, useCreatePayment } from "./usePayments";
import type { Payment } from "@/types/payment";

const mockApi = vi.mocked(api);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

const mockPayment: Payment = {
  id: "pay1",
  bookingId: "b1",
  amount: 150,
  currency: "EUR",
  status: "Completed",
  paymentMethod: "card",
  transactionId: "txn-123",
  createdAt: "2026-01-01T00:00:00Z",
};

describe("usePayments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the list of payments", async () => {
    mockApi.mockResolvedValue([mockPayment]);

    const { result } = renderHook(() => usePayments(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockPayment]);
    expect(mockApi).toHaveBeenCalledWith("/api/payments");
  });
});

describe("useCreatePayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with POST and payment data", async () => {
    mockApi.mockResolvedValue(mockPayment);

    const { result } = renderHook(() => useCreatePayment(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      bookingId: "b1",
      paymentMethod: "card",
    });

    expect(mockApi).toHaveBeenCalledWith("/api/payments", {
      method: "POST",
      body: { bookingId: "b1", paymentMethod: "card" },
    });
  });

  it("should return the created payment on success", async () => {
    mockApi.mockResolvedValue(mockPayment);

    const { result } = renderHook(() => useCreatePayment(), {
      wrapper: createWrapper(),
    });

    const created = await result.current.mutateAsync({
      bookingId: "b1",
      paymentMethod: "bank_transfer",
    });

    expect(created).toEqual(mockPayment);
  });
});
