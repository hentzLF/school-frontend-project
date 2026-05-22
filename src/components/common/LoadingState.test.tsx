import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LoadingState } from "./LoadingState";

afterEach(cleanup);

describe("LoadingState", () => {
  it("should render the default label when no label is provided", () => {
    render(<LoadingState />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render a custom label when provided", () => {
    render(<LoadingState label="Fetching bookings..." />);

    expect(screen.getByText("Fetching bookings...")).toBeInTheDocument();
  });

  it("should have status role for screen reader accessibility", () => {
    render(<LoadingState />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render custom label instead of default", () => {
    render(<LoadingState label="Please wait" />);

    expect(screen.getByText("Please wait")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
