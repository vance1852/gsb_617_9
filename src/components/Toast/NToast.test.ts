import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import NToast from "./NToast.vue";

describe("NToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders message", () => {
    render(NToast, {
      props: { message: "Test message" },
    });
    expect(screen.getByText("Test message")).toBeTruthy();
  });

  it("renders correct icon for success type", () => {
    const { container } = render(NToast, {
      props: { message: "Success", type: "success" },
    });
    expect(container.querySelector(".i-mdi-check")).toBeTruthy();
  });

  it("renders correct icon for error type", () => {
    const { container } = render(NToast, {
      props: { message: "Error", type: "error" },
    });
    expect(container.querySelector(".i-mdi-close")).toBeTruthy();
  });

  it("renders correct icon for warning type", () => {
    const { container } = render(NToast, {
      props: { message: "Warning", type: "warning" },
    });
    expect(container.querySelector(".i-mdi-alert")).toBeTruthy();
  });

  it("renders correct icon for info type", () => {
    const { container } = render(NToast, {
      props: { message: "Info", type: "info" },
    });
    expect(container.querySelector(".i-mdi-information")).toBeTruthy();
  });

  it("emits close when close button is clicked", async () => {
    const { emitted } = render(NToast, {
      props: { message: "Test", closable: true },
    });
    await fireEvent.click(screen.getByLabelText("Close"));
    expect(emitted().close).toBeTruthy();
  });

  it("does not show close button when closable is false", () => {
    render(NToast, {
      props: { message: "Test", closable: false },
    });
    expect(screen.queryByLabelText("Close")).toBeNull();
  });

  it("auto closes after duration", async () => {
    const { emitted } = render(NToast, {
      props: { message: "Test", duration: 3000 },
    });

    vi.advanceTimersByTime(3100);

    expect(emitted().close).toBeTruthy();
  });

  it("shows progress bar when showProgress is true", () => {
    const { container } = render(NToast, {
      props: { message: "Test", showProgress: true, duration: 3000 },
    });
    expect(container.querySelector(".absolute.bottom-0")).toBeTruthy();
  });

  it("applies correct position class", () => {
    render(NToast, {
      props: { message: "Test", position: "bottom-left" },
    });
    const toast = screen.getByRole("alert");
    expect(toast.className).toContain("bottom-4");
    expect(toast.className).toContain("left-4");
  });

  it("has alert role for accessibility", () => {
    render(NToast, {
      props: { message: "Test" },
    });
    expect(screen.getByRole("alert")).toBeTruthy();
  });
});
