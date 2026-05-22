import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { StarRating } from "./StarRating";

afterEach(cleanup);

describe("StarRating", () => {
  it("should render the correct number of stars", () => {
    render(<StarRating rating={3} />);
    const ratingContainer = screen.getByLabelText("3 out of 5 stars");
    expect(ratingContainer).toBeInTheDocument();
    expect(ratingContainer.querySelectorAll("span")).toHaveLength(5);
  });

  it("should highlight the correct number of stars", () => {
    render(<StarRating rating={4} />);
    const ratingContainer = screen.getByLabelText("4 out of 5 stars");
    const stars = ratingContainer.querySelectorAll("span");
    const filled = Array.from(stars).filter((s) =>
      s.className.includes("text-yellow-400")
    );
    expect(filled).toHaveLength(4);
  });

  it("should support custom max", () => {
    render(<StarRating rating={2} max={10} />);
    const ratingContainer = screen.getByLabelText("2 out of 10 stars");
    expect(ratingContainer.querySelectorAll("span")).toHaveLength(10);
  });

  it("should render zero-star rating", () => {
    render(<StarRating rating={0} />);
    const ratingContainer = screen.getByLabelText("0 out of 5 stars");
    const stars = ratingContainer.querySelectorAll("span");
    const filled = Array.from(stars).filter((s) =>
      s.className.includes("text-yellow-400")
    );
    expect(filled).toHaveLength(0);
  });
});
