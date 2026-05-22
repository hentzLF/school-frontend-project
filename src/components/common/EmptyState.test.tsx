import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Package } from "lucide-react";
import { EmptyState } from "./EmptyState";

afterEach(cleanup);

describe("EmptyState", () => {
  it("should render the title", () => {
    render(<EmptyState icon={Package} title="No listings found" />);

    expect(screen.getByText("No listings found")).toBeInTheDocument();
  });

  it("should render the description when provided", () => {
    render(
      <EmptyState
        icon={Package}
        title="No listings found"
        description="Create your first listing to get started"
      />,
    );

    expect(
      screen.getByText("Create your first listing to get started"),
    ).toBeInTheDocument();
  });

  it("should not render description when not provided", () => {
    render(<EmptyState icon={Package} title="No listings found" />);

    expect(
      screen.queryByText("Create your first listing to get started"),
    ).not.toBeInTheDocument();
  });

  it("should render the action slot when provided", () => {
    render(
      <EmptyState
        icon={Package}
        title="No listings found"
        action={<button>Create Listing</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Create Listing" }),
    ).toBeInTheDocument();
  });
});
