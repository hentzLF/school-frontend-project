import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "./ConfirmDialog";

afterEach(cleanup);

const defaultProps = {
  trigger: <button>Delete</button>,
  title: "Confirm deletion",
  description: "This action cannot be undone.",
  confirmLabel: "Yes, delete",
  cancelLabel: "Cancel",
  onConfirm: vi.fn(),
};

describe("ConfirmDialog", () => {
  it("should render the trigger element", () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("should show dialog title and description after clicking the trigger", async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.getByText("Confirm deletion")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("should render confirm and cancel buttons in the dialog", async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      screen.getByRole("button", { name: "Yes, delete" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("should call onConfirm when the confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Yes, delete" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
