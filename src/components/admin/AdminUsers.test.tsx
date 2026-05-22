import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AdminUsers } from "./AdminUsers";
import type { AdminUser } from "@/types/admin";

afterEach(cleanup);

const mockUsers: AdminUser[] = [
  {
    id: "user-1",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Smith",
    role: "Client",
    createdAt: "2025-01-15T10:00:00Z",
    isActive: true,
  },
  {
    id: "user-2",
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Jones",
    role: "Provider",
    createdAt: "2025-02-20T10:00:00Z",
    isActive: true,
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

vi.mock("@/components/common/ConfirmDialog", () => ({
  ConfirmDialog: ({ trigger }: { trigger: React.ReactNode }) => (
    <div data-testid="confirm-dialog">{trigger}</div>
  ),
}));

const mockUseAdminUsers = vi.fn();
const mockUseUpdateUser = vi.fn();
const mockUseDeleteUser = vi.fn();

vi.mock("@/hooks/useAdmin", () => ({
  useAdminUsers: () => mockUseAdminUsers(),
  useUpdateUser: () => mockUseUpdateUser(),
  useDeleteUser: () => mockUseDeleteUser(),
}));

describe("AdminUsers", () => {
  beforeEach(() => {
    mockUseUpdateUser.mockReturnValue({ mutate: vi.fn(), isPending: false });
    mockUseDeleteUser.mockReturnValue({ mutate: vi.fn(), isPending: false });
  });

  it("should render loading state when isLoading is true", () => {
    mockUseAdminUsers.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    render(<AdminUsers />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("should render error state when error is present", () => {
    mockUseAdminUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    });
    render(<AdminUsers />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("should render empty state when users list is empty", () => {
    mockUseAdminUsers.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    render(<AdminUsers />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("should render user rows when data is loaded", () => {
    mockUseAdminUsers.mockReturnValue({
      data: mockUsers,
      isLoading: false,
      error: null,
    });
    render(<AdminUsers />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });
});
