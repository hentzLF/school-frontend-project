import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { EquipmentList } from "./EquipmentList";
import type { Equipment } from "@/types/equipment";

afterEach(cleanup);

vi.mock("@/hooks/useEquipment", () => ({
  useEquipment: vi.fn(),
  useCreateEquipment: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
  useDeleteEquipment: () => ({ mutate: vi.fn() }),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "common.loading": "Loading...",
        "equipment.loadError": "Failed to load equipment",
        "equipment.title": "My Equipment",
        "equipment.noEquipment": "No equipment yet",
        "equipment.addEquipment": "Add Equipment",
        "equipment.name": "Name",
        "equipment.description": "Description",
        "equipment.condition": "Condition",
        "equipment.selectCondition": "Select condition",
        "equipment.conditionNew": "New",
        "equipment.conditionGood": "Good",
        "equipment.conditionFair": "Fair",
        "equipment.conditionPoor": "Poor",
        "equipment.adding": "Adding...",
        "common.cancel": "Cancel",
        "common.delete": "Delete",
        "auth.unexpectedError": "An error occurred",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

const mockEquipment: Equipment = {
  id: "eq-1",
  name: "John Deere Tractor",
  description: "Heavy-duty farming tractor",
  providerId: "provider-1",
  condition: "Good",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("EquipmentList", () => {
  it("should render loading state", async () => {
    const { useEquipment } = await import("@/hooks/useEquipment");
    vi.mocked(useEquipment).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useEquipment>);

    render(<EquipmentList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render error state", async () => {
    const { useEquipment } = await import("@/hooks/useEquipment");
    vi.mocked(useEquipment).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    } as ReturnType<typeof useEquipment>);

    render(<EquipmentList />);
    expect(screen.getByText("Failed to load equipment")).toBeInTheDocument();
  });

  it("should render empty state when no equipment", async () => {
    const { useEquipment } = await import("@/hooks/useEquipment");
    vi.mocked(useEquipment).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useEquipment>);

    render(<EquipmentList />);
    expect(screen.getByText("No equipment yet")).toBeInTheDocument();
  });

  it("should render equipment cards with name and description", async () => {
    const { useEquipment } = await import("@/hooks/useEquipment");
    vi.mocked(useEquipment).mockReturnValue({
      data: [mockEquipment],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useEquipment>);

    render(<EquipmentList />);
    expect(screen.getByText("John Deere Tractor")).toBeInTheDocument();
    expect(screen.getByText("Heavy-duty farming tractor")).toBeInTheDocument();
  });

  it("should show the add equipment button", async () => {
    const { useEquipment } = await import("@/hooks/useEquipment");
    vi.mocked(useEquipment).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useEquipment>);

    render(<EquipmentList />);
    expect(screen.getByText("Add Equipment")).toBeInTheDocument();
  });
});
