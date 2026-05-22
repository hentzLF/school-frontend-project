import { describe, it, expect } from "vitest";
import { AUTH_ROUTES, LISTING_ROUTES, BOOKING_ROUTES, CONVERSATION_ROUTES, REVIEW_ROUTES, EQUIPMENT_ROUTES } from "./constants";

describe("AUTH_ROUTES", () => {
  it("should have correct login route", () => {
    expect(AUTH_ROUTES.login).toBe("/api/auth/login");
  });

  it("should have correct register route", () => {
    expect(AUTH_ROUTES.register).toBe("/api/auth/register");
  });

  it("should have correct me route", () => {
    expect(AUTH_ROUTES.me).toBe("/api/auth/me");
  });
});

describe("LISTING_ROUTES", () => {
  it("should have correct list route", () => {
    expect(LISTING_ROUTES.list).toBe("/api/listings");
  });

  it("should generate correct detail route", () => {
    expect(LISTING_ROUTES.detail("abc-123")).toBe("/api/listings/abc-123");
  });
});

describe("BOOKING_ROUTES", () => {
  it("should generate correct status update route", () => {
    expect(BOOKING_ROUTES.updateStatus("booking-1")).toBe("/api/bookings/booking-1/status");
  });
});

describe("CONVERSATION_ROUTES", () => {
  it("should generate correct messages route", () => {
    expect(CONVERSATION_ROUTES.messages("conv-1")).toBe("/api/conversations/conv-1/messages");
  });
});

describe("REVIEW_ROUTES", () => {
  it("should generate correct detail route", () => {
    expect(REVIEW_ROUTES.detail("rev-1")).toBe("/api/reviews/rev-1");
  });
});

describe("EQUIPMENT_ROUTES", () => {
  it("should generate correct detail route", () => {
    expect(EQUIPMENT_ROUTES.detail("eq-1")).toBe("/api/equipment/eq-1");
  });
});
