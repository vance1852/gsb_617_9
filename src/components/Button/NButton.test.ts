import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import NButton from "./NButton.vue";

describe("NButton", () => {
  it("renders slot content", () => {
    render(NButton, {
      slots: { default: "Click me" },
    });
    expect(screen.getByText("Click me")).toBeTruthy();
  });

  it("emits click event", async () => {
    const { emitted } = render(NButton, {
      slots: { default: "Button" },
    });
    await fireEvent.click(screen.getByRole("button"));
    expect(emitted().click).toBeTruthy();
  });

  it("does not emit click when disabled", async () => {
    const { emitted } = render(NButton, {
      props: { disabled: true },
      slots: { default: "Button" },
    });
    await fireEvent.click(screen.getByRole("button"));
    expect(emitted().click).toBeFalsy();
  });

  it("does not emit click when loading", async () => {
    const { emitted } = render(NButton, {
      props: { loading: true },
      slots: { default: "Button" },
    });
    await fireEvent.click(screen.getByRole("button"));
    expect(emitted().click).toBeFalsy();
  });

  it("applies variant classes", () => {
    render(NButton, {
      props: { variant: "outline" },
      slots: { default: "Button" },
    });
    expect(screen.getByRole("button").className).toContain("ring-1");
  });

  it("applies size classes", () => {
    render(NButton, {
      props: { size: "lg" },
      slots: { default: "Button" },
    });
    expect(screen.getByRole("button").className).toContain("h-10");
  });

  it("has correct aria attributes when disabled", () => {
    render(NButton, {
      props: { disabled: true },
      slots: { default: "Button" },
    });
    expect(screen.getByRole("button").getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("has correct aria attributes when loading", () => {
    render(NButton, {
      props: { loading: true },
      slots: { default: "Button" },
    });
    expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");
  });
});
