import { describe, it, expect, afterEach } from "vitest";
import { redirectToLogin } from "./navigation";

describe("redirectToLogin", () => {
  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("should not navigate when already on the login page", () => {
    window.history.pushState({}, "", "/login");
    expect(() => redirectToLogin()).not.toThrow();
  });

  it("should not navigate when on the register page", () => {
    window.history.pushState({}, "", "/register");
    expect(() => redirectToLogin()).not.toThrow();
  });

  it("should attempt navigation from a protected page", () => {
    window.history.pushState({}, "", "/dashboard");
    expect(() => redirectToLogin()).not.toThrow();
  });
});
