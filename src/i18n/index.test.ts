import { describe, it, expect } from "vitest";
import { getTranslation, locales, localeNames } from "./index";

describe("getTranslation", () => {
  it("should return the correct English translation", () => {
    expect(getTranslation("en", "common.loading")).toBe("Loading...");
    expect(getTranslation("en", "auth.signIn")).toBe("Sign in to AgriMarket");
  });

  it("should return the correct Estonian translation", () => {
    expect(getTranslation("et", "common.loading")).toBe("Laadimine...");
    expect(getTranslation("et", "auth.signIn")).toBe("Logi sisse AgriMarketisse");
  });

  it("should return the key for missing translations", () => {
    expect(getTranslation("en", "nonexistent.key")).toBe("nonexistent.key");
  });

  it("should handle deeply nested keys", () => {
    expect(getTranslation("en", "bookings.status.Pending")).toBe("Pending");
    expect(getTranslation("et", "bookings.status.Pending")).toBe("Ootel");
  });
});

describe("locales", () => {
  it("should have en and et locales", () => {
    expect(locales).toHaveProperty("en");
    expect(locales).toHaveProperty("et");
  });

  it("should have matching keys between en and et", () => {
    const enKeys = Object.keys(locales.en);
    const etKeys = Object.keys(locales.et);
    expect(enKeys).toEqual(etKeys);
  });
});

describe("localeNames", () => {
  it("should have correct locale display names", () => {
    expect(localeNames.en).toBe("English");
    expect(localeNames.et).toBe("Eesti");
  });
});
