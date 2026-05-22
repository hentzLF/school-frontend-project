import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { UserMenu } from "./UserMenu";
import type { User } from "@/types/auth";

afterEach(cleanup);

const mockLogout = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "nav.account": "Account",
        "nav.signedInAs": "Signed in as",
        "nav.dashboard": "Dashboard",
        "nav.admin": "Admin",
        "auth.signOut": "Sign out",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

const mockUser: User = {
  id: "user-1",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "Client",
};

describe("UserMenu", () => {
  it("should render nothing when user is null", async () => {
    const { useAuth } = await import("@/hooks/useAuth");
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      logout: mockLogout,
      login: vi.fn(),
      loginError: null,
      isLoginPending: false,
      isLoading: false,
      isAuthenticated: false,
      register: vi.fn(),
      registerError: null,
      isRegisterPending: false,
    });

    const { container } = render(<UserMenu />);
    expect(container.firstChild).toBeNull();
  });

  it("should render the user's initials when user is present", async () => {
    const { useAuth } = await import("@/hooks/useAuth");
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      login: vi.fn(),
      loginError: null,
      isLoginPending: false,
      isLoading: false,
      isAuthenticated: true,
      register: vi.fn(),
      registerError: null,
      isRegisterPending: false,
    });

    render(<UserMenu />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("should render the user's first name", async () => {
    const { useAuth } = await import("@/hooks/useAuth");
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      login: vi.fn(),
      loginError: null,
      isLoginPending: false,
      isLoading: false,
      isAuthenticated: true,
      register: vi.fn(),
      registerError: null,
      isRegisterPending: false,
    });

    render(<UserMenu />);
    expect(screen.getByText("John")).toBeInTheDocument();
  });
});
