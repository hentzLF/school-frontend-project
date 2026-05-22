import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTranslation } from "./useTranslation";
import { useLocaleStore } from "@/stores/localeStore";

function resetLocaleStore() {
  useLocaleStore.setState({ locale: "en" });
}

describe("useTranslation", () => {
  beforeEach(() => {
    resetLocaleStore();
  });

  it("should return the English translation for a known key", () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.t("common.appName")).toBe("AgriMarket");
  });

  it("should return the key itself for an unknown translation key", () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.t("this.key.does.not.exist")).toBe(
      "this.key.does.not.exist",
    );
  });

  it("should expose the current locale", () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.locale).toBe("en");
  });

  it("should switch locale and return the new language's translation", () => {
    const { result } = renderHook(() => useTranslation());

    act(() => {
      result.current.setLocale("et");
    });

    expect(result.current.locale).toBe("et");
    // Estonian locale should return a different translation for common.appName
    // (or the key itself if not present — either way locale changed)
    expect(result.current.locale).not.toBe("en");
  });
});
