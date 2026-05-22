import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ErrorState } from "./ErrorState";

afterEach(cleanup);

describe("ErrorState", () => {
  it("should render the error message", () => {
    render(<ErrorState message="Failed to load data" />);

    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
  });

  it("should have alert role for screen reader accessibility", () => {
    render(<ErrorState message="Something went wrong" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should display different messages correctly", () => {
    const { rerender } = render(
      <ErrorState message="Network error occurred" />,
    );

    expect(screen.getByText("Network error occurred")).toBeInTheDocument();

    rerender(<ErrorState message="Server is unavailable" />);

    expect(screen.getByText("Server is unavailable")).toBeInTheDocument();
    expect(
      screen.queryByText("Network error occurred"),
    ).not.toBeInTheDocument();
  });
});
