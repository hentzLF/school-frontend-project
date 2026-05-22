import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

afterEach(cleanup);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockLogin = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
    loginError: null,
    isLoginPending: false,
    user: null,
    isLoading: false,
    isAuthenticated: false,
    register: vi.fn(),
    logout: vi.fn(),
    registerError: null,
    isRegisterPending: false,
  }),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "auth.signIn": "Sign in",
        "auth.email": "Email",
        "auth.password": "Password",
        "auth.signInLink": "Sign in",
        "auth.signingIn": "Signing in...",
        "auth.noAccount": "No account?",
        "auth.register": "Register",
        "auth.unexpectedError": "An error occurred",
        "auth.signOut": "Log out",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

vi.mock("@/components/layout/LocaleSwitcher", () => ({
  LocaleSwitcher: () => <div data-testid="locale-switcher" />,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the login form", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("should render locale switcher", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("locale-switcher")).toBeInTheDocument();
  });

  it("should render register link", () => {
    render(<LoginPage />);
    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute("href", "/register");
  });

  it("should call login on valid form submission", async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});
