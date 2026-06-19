import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import NBadge from "./NBadge.vue";

describe("NBadge", () => {
  it("renders slot content", () => {
    render(NBadge, {
      slots: { default: "<button>Click me</button>" },
    });
    expect(screen.getByText("Click me")).toBeTruthy();
  });

  it("displays numeric value", () => {
    render(NBadge, {
      props: { value: 5 },
      slots: { default: "Content" },
    });
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("displays max+ when value exceeds max", () => {
    render(NBadge, {
      props: { value: 100, max: 99 },
      slots: { default: "Content" },
    });
    expect(screen.getByText("99+")).toBeTruthy();
  });

  it("renders dot badge when dot prop is true", () => {
    const { container } = render(NBadge, {
      props: { dot: true },
      slots: { default: "Content" },
    });
    const badge = container.querySelector(".absolute");
    expect(badge?.className).toContain("h-2.5");
    expect(badge?.className).toContain("w-2.5");
    expect(badge?.className).toContain("ring-2");
  });

  it("applies correct type color for error", () => {
    const { container } = render(NBadge, {
      props: { value: 1, type: "error" },
      slots: { default: "Content" },
    });
    expect(container.querySelector(".absolute")?.className).toContain(
      "bg-error-500",
    );
  });

  it("applies correct type color for success", () => {
    const { container } = render(NBadge, {
      props: { value: 1, type: "success" },
      slots: { default: "Content" },
    });
    expect(container.querySelector(".absolute")?.className).toContain(
      "bg-success-500",
    );
  });

  it("applies correct type color for warning", () => {
    const { container } = render(NBadge, {
      props: { value: 1, type: "warning" },
      slots: { default: "Content" },
    });
    expect(container.querySelector(".absolute")?.className).toContain(
      "bg-warning-500",
    );
  });

  it("applies correct type color for info", () => {
    const { container } = render(NBadge, {
      props: { value: 1, type: "info" },
      slots: { default: "Content" },
    });
    expect(container.querySelector(".absolute")?.className).toContain(
      "bg-info-500",
    );
  });

  it("applies correct position class for top-right", () => {
    const { container } = render(NBadge, {
      props: { value: 1, position: "top-right" },
      slots: { default: "Content" },
    });
    const badge = container.querySelector(".absolute");
    expect(badge?.className).toContain("top-0");
    expect(badge?.className).toContain("right-0");
  });

  it("applies correct position class for bottom-left", () => {
    const { container } = render(NBadge, {
      props: { value: 1, position: "bottom-left" },
      slots: { default: "Content" },
    });
    const badge = container.querySelector(".absolute");
    expect(badge?.className).toContain("bottom-0");
    expect(badge?.className).toContain("left-0");
  });

  it("hides badge when hidden prop is true", () => {
    const { container } = render(NBadge, {
      props: { value: 5, hidden: true },
      slots: { default: "Content" },
    });
    expect(container.querySelector(".absolute")).toBeNull();
  });
});
