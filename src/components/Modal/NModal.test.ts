import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import NModal from "./NModal.vue";

describe("NModal", async () => {
  it("renders when modelValue is true", () => {
    render(NModal, {
      props: { modelValue: true, title: "Test Modal" },
    });
    expect(screen.getByText("Test Modal")).toBeTruthy();
  });

  it("does not render when modelValue is false", () => {
    render(NModal, {
      props: { modelValue: false, title: "Test Modal" },
    });
    expect(screen.queryByText("Test Modal")).toBeNull();
  });

  it("emits update:modelValue when close button is clicked", async () => {
    const { emitted } = render(NModal, {
      props: { modelValue: true, title: "Test", closable: true },
    });
    const closeBtn = screen.getByLabelText("Close modal");
    await fireEvent.click(closeBtn);
    expect(emitted()["update:modelValue"]).toBeTruthy();
    expect(emitted()["update:modelValue"][0]).toEqual([false]);
  });

  it("applies correct size class", () => {
    render(NModal, {
      props: { modelValue: true, size: "lg" },
      slots: { default: "Content" },
    });
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("max-w-lg");
  });

  it("renders footer slot", () => {
    render(NModal, {
      props: { modelValue: true },
      slots: { default: "Content", footer: "Footer Content" },
    });
    expect(screen.getByText("Footer Content")).toBeTruthy();
  });

  it("has draggable cursor when draggable prop is true", () => {
    render(NModal, {
      props: { modelValue: true, title: "Draggable", draggable: true },
    });
    const header = screen.getByText("Draggable").parentElement;
    expect(header?.className).toContain("cursor-grab");
  });

  it("has correct aria attributes", () => {
    render(NModal, {
      props: { modelValue: true },
      slots: { default: "Content" },
    });
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });

  it("closes on ESC key when closable", async () => {
    const { emitted } = render(NModal, {
      props: { modelValue: true, title: "ESC Test", closable: true },
    });
    await fireEvent.keyDown(document, { key: "Escape" });
    expect(emitted()["update:modelValue"]).toBeTruthy();
    expect(emitted()["update:modelValue"][0]).toEqual([false]);
  });

  it("does not close on ESC when closable is false", async () => {
    const { emitted } = render(NModal, {
      props: { modelValue: true, title: "No ESC", closable: false },
    });
    await fireEvent.keyDown(document, { key: "Escape" });
    expect(emitted()["update:modelValue"]).toBeFalsy();
  });

  it("accepts animation prop without error", () => {
    const animations = ["fade", "slide", "scale"] as const;
    for (const animation of animations) {
      const { unmount } = render(NModal, {
        props: { modelValue: true, animation },
        slots: { default: "Content" },
      });
      expect(screen.getByRole("dialog")).toBeTruthy();
      unmount();
    }
  });

  it("does not show close button when closable is false", () => {
    render(NModal, {
      props: { modelValue: true, title: "No Close", closable: false },
    });
    expect(screen.queryByLabelText("Close modal")).toBeNull();
  });
});
