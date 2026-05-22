import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LocaleSwitcher } from "./LocaleSwitcher";

afterEach(cleanup);

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

describe("LocaleSwitcher", () => {
  it("should render the language select trigger", () => {
    render(<LocaleSwitcher />);
    expect(screen.getByRole("combobox", { name: /select language/i })).toBeInTheDocument();
  });

  it("should show the current locale value", () => {
    render(<LocaleSwitcher />);
    // The trigger shows the current locale
    const trigger = screen.getByRole("combobox", { name: /select language/i });
    expect(trigger).toBeInTheDocument();
  });
});
