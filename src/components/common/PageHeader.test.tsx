import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { PageHeader } from "./PageHeader";

afterEach(cleanup);

describe("PageHeader", () => {
  it("should render the title as an h1 heading", () => {
    render(<PageHeader title="My Listings" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("My Listings");
  });

  it("should render the description when provided", () => {
    render(
      <PageHeader title="My Listings" description="Manage your listings here" />,
    );

    expect(screen.getByText("Manage your listings here")).toBeInTheDocument();
  });

  it("should not render description paragraph when not provided", () => {
    render(<PageHeader title="My Listings" />);

    expect(
      screen.queryByText("Manage your listings here"),
    ).not.toBeInTheDocument();
  });

  it("should render the action slot when provided", () => {
    render(
      <PageHeader
        title="My Listings"
        action={<button>Add Listing</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Add Listing" }),
    ).toBeInTheDocument();
  });
});
