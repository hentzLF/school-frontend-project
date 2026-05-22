import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Logo } from "./Logo";

afterEach(cleanup);

describe("Logo", () => {
  it("should render the brand name", () => {
    render(<Logo />);
    expect(screen.getByText("AgriMarket")).toBeInTheDocument();
  });

  it("should link to / by default", () => {
    render(<Logo />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("should use a custom href when provided", () => {
    render(<Logo href="/home" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/home");
  });

  it("should apply additional className", () => {
    render(<Logo className="custom-class" />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("custom-class");
  });
});
