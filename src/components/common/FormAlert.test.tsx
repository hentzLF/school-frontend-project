import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { FormAlert } from "./FormAlert";

afterEach(cleanup);

describe("FormAlert", () => {
  it("should render the error message", () => {
    render(<FormAlert message="Invalid email or password" />);

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });

  it("should have alert role for screen reader accessibility", () => {
    render(<FormAlert message="Form submission failed" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should render different messages correctly", () => {
    const { rerender } = render(<FormAlert message="First error" />);

    expect(screen.getByText("First error")).toBeInTheDocument();

    rerender(<FormAlert message="Second error" />);

    expect(screen.getByText("Second error")).toBeInTheDocument();
    expect(screen.queryByText("First error")).not.toBeInTheDocument();
  });
});
