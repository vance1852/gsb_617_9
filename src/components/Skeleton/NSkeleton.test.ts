import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import NSkeleton from "./NSkeleton.vue";

describe("NSkeleton", () => {
  it("renders with default props", () => {
    const { container } = render(NSkeleton);
    expect(container.firstElementChild).toBeTruthy();
  });

  it("applies pulse animation by default", () => {
    const { container } = render(NSkeleton);
    expect(container.firstElementChild?.className).toContain("animate-pulse");
  });

  it("applies wave animation when specified", () => {
    const { container } = render(NSkeleton, {
      props: { animation: "wave" },
    });
    expect(container.querySelector(".skeleton-wave")).toBeTruthy();
  });

  it("applies no animation when animation is none", () => {
    const { container } = render(NSkeleton, {
      props: { animation: "none" },
    });
    expect(container.firstElementChild?.className).not.toContain(
      "animate-pulse",
    );
    expect(container.querySelector(".skeleton-wave")).toBeNull();
  });

  it("applies circular variant class", () => {
    const { container } = render(NSkeleton, {
      props: { variant: "circular" },
    });
    expect(container.firstElementChild?.className).toContain("rounded-full");
  });

  it("applies rectangular variant class", () => {
    const { container } = render(NSkeleton, {
      props: { variant: "rectangular" },
    });
    expect(container.firstElementChild?.className).toContain("rounded-lg");
  });

  it("applies text variant class", () => {
    const { container } = render(NSkeleton, {
      props: { variant: "text" },
    });
    expect(container.firstElementChild?.className).toContain("rounded");
  });

  it("applies custom width", () => {
    const { container } = render(NSkeleton, {
      props: { width: 200 },
    });
    expect(container.firstElementChild?.getAttribute("style")).toContain(
      "width: 200px",
    );
  });

  it("applies custom height", () => {
    const { container } = render(NSkeleton, {
      props: { height: 100 },
    });
    expect(container.firstElementChild?.getAttribute("style")).toContain(
      "height: 100px",
    );
  });

  it("applies string width", () => {
    const { container } = render(NSkeleton, {
      props: { width: "50%" },
    });
    expect(container.firstElementChild?.getAttribute("style")).toContain(
      "width: 50%",
    );
  });

  it("renders multiple rows", () => {
    const { container } = render(NSkeleton, {
      props: { rows: 3 },
    });
    const skeletons = container.querySelectorAll(".bg-surface-100");
    expect(skeletons.length).toBe(3);
  });

  it("last row has 80% width when multiple rows", () => {
    const { container } = render(NSkeleton, {
      props: { rows: 3 },
    });
    const skeletons = container.querySelectorAll(".bg-surface-100");
    const lastSkeleton = skeletons[skeletons.length - 1];
    expect(lastSkeleton.getAttribute("style")).toContain("width: 80%");
  });
});
