import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";

afterEach(cleanup);

const mockToggleTheme = vi.fn();

vi.mock("@/stores/themeStore", () => ({
  useThemeStore: (selector: (s: { toggleTheme: () => void; theme: string }) => unknown) =>
    selector({ toggleTheme: mockToggleTheme, theme: "light" }),
}));

describe("ThemeToggle", () => {
  it("should render the toggle button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("should call toggleTheme when clicked", () => {
    mockToggleTheme.mockClear();
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(mockToggleTheme).toHaveBeenCalled();
  });
});
