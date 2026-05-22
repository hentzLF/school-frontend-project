import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

afterEach(cleanup);

describe("StatusBadge", () => {
  it("should render the label text", () => {
    render(<StatusBadge status="Active" label="Active" />);

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("should render different status labels", () => {
    const { rerender } = render(
      <StatusBadge status="Pending" label="Pending" />,
    );

    expect(screen.getByText("Pending")).toBeInTheDocument();

    rerender(<StatusBadge status="Cancelled" label="Cancelled" />);

    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("should render a badge for an unknown status using the fallback tone", () => {
    render(<StatusBadge status="UnknownStatus" label="Unknown" />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("should render Completed status badge with label", () => {
    render(<StatusBadge status="Completed" label="Completed" />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
