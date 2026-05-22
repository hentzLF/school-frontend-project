import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouteError } from "./RouteError";

afterEach(cleanup);

describe("RouteError", () => {
  it("should render a generic error message by default", () => {
    render(<RouteError reset={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/something went wrong/i);
  });

  it("should render a custom message when provided", () => {
    render(<RouteError reset={vi.fn()} message="Custom failure" />);
    expect(screen.getByText("Custom failure")).toBeInTheDocument();
  });

  it("should call reset when the retry button is clicked", async () => {
    const reset = vi.fn();
    const user = userEvent.setup();
    render(<RouteError reset={reset} />);

    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
