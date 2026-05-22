import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/api", () => ({
  api: vi.fn(),
}));

import { api } from "@/lib/api";
import {
  useEquipment,
  useCreateEquipment,
  useDeleteEquipment,
} from "./useEquipment";
import type { Equipment } from "@/types/equipment";

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

const mockEquipment: Equipment = {
  id: "eq1",
  name: "John Deere Tractor",
  description: "Powerful tractor for field work",
  providerId: "p1",
  condition: "Good",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("useEquipment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the list of equipment", async () => {
    mockApi.mockResolvedValue([mockEquipment]);

    const { result } = renderHook(() => useEquipment(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockEquipment]);
    expect(mockApi).toHaveBeenCalledWith("/api/equipment");
  });
});

describe("useCreateEquipment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with POST and equipment data", async () => {
    mockApi.mockResolvedValue(mockEquipment);

    const { result } = renderHook(() => useCreateEquipment(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      name: "John Deere Tractor",
      description: "Powerful tractor for field work",
      condition: "Good",
    });

    expect(mockApi).toHaveBeenCalledWith("/api/equipment", {
      method: "POST",
      body: {
        name: "John Deere Tractor",
        description: "Powerful tractor for field work",
        condition: "Good",
      },
    });
  });
});

describe("useDeleteEquipment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with DELETE for the given equipment id", async () => {
    mockApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteEquipment(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("eq1");

    expect(mockApi).toHaveBeenCalledWith("/api/equipment/eq1", {
      method: "DELETE",
    });
  });
});
