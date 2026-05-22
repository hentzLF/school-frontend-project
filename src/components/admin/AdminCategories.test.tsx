import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AdminCategories } from "./AdminCategories";
import type { Category } from "@/types/category";

afterEach(cleanup);

const mockCategories: Category[] = [
  { id: "cat-1", name: "Plowing", description: "Field plowing services" },
  { id: "cat-2", name: "Harvesting", description: null },
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

vi.mock("@/components/common/FormAlert", () => ({
  FormAlert: ({ message }: { message: string }) => (
    <div data-testid="form-alert">{message}</div>
  ),
}));

vi.mock("@/components/common/ConfirmDialog", () => ({
  ConfirmDialog: ({ trigger }: { trigger: React.ReactNode }) => (
    <div data-testid="confirm-dialog">{trigger}</div>
  ),
}));

vi.mock("@/lib/api", () => ({
  ApiError: class ApiError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ApiError";
    }
  },
}));

const mockUseAdminCategories = vi.fn();
const mockUseCreateCategory = vi.fn();
const mockUseDeleteCategory = vi.fn();

vi.mock("@/hooks/useAdmin", () => ({
  useAdminCategories: () => mockUseAdminCategories(),
  useCreateCategory: () => mockUseCreateCategory(),
  useDeleteCategory: () => mockUseDeleteCategory(),
}));

describe("AdminCategories", () => {
  beforeEach(() => {
    mockUseCreateCategory.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
    });
    mockUseDeleteCategory.mockReturnValue({ mutate: vi.fn(), isPending: false });
  });

  it("should render loading state when isLoading is true", () => {
    mockUseAdminCategories.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    render(<AdminCategories />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("should render error state when error is present", () => {
    mockUseAdminCategories.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    });
    render(<AdminCategories />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("should render empty state when categories list is empty", () => {
    mockUseAdminCategories.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    render(<AdminCategories />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("should render category items when data is loaded", () => {
    mockUseAdminCategories.mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    });
    render(<AdminCategories />);
    expect(screen.getByText("Plowing")).toBeInTheDocument();
    expect(screen.getByText("Field plowing services")).toBeInTheDocument();
    expect(screen.getByText("Harvesting")).toBeInTheDocument();
  });

  it("should render the add category form", () => {
    mockUseAdminCategories.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    render(<AdminCategories />);
    expect(screen.getByLabelText("admin.name")).toBeInTheDocument();
    expect(screen.getByLabelText("equipment.description")).toBeInTheDocument();
  });
});
