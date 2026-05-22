import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { HtmlLangSync } from "./HtmlLangSync";
import { useLocaleStore } from "@/stores/localeStore";

afterEach(() => {
  cleanup();
  useLocaleStore.setState({ locale: "en" });
});

describe("HtmlLangSync", () => {
  it("should set the document language to the Estonian locale", () => {
    useLocaleStore.setState({ locale: "et" });
    render(<HtmlLangSync />);
    expect(document.documentElement.lang).toBe("et");
  });

  it("should set the document language to the English locale", () => {
    useLocaleStore.setState({ locale: "en" });
    render(<HtmlLangSync />);
    expect(document.documentElement.lang).toBe("en");
  });

  it("should render nothing", () => {
    const { container } = render(<HtmlLangSync />);
    expect(container).toBeEmptyDOMElement();
  });
});
