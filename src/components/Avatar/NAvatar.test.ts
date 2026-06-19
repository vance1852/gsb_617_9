import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import NAvatar from "./NAvatar.vue";

describe("NAvatar", () => {
  it("renders image when src is provided", () => {
    render(NAvatar, {
      props: { src: "https://example.com/avatar.jpg", name: "John" },
    });
    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toBe("https://example.com/avatar.jpg");
  });

  it("renders initials when no src is provided", () => {
    const { container } = render(NAvatar, {
      props: { name: "John Doe" },
    });
    // Should show first letter of first name
    expect(container.textContent).toContain("J");
  });

  it("renders icon slot when provided", () => {
    render(NAvatar, {
      slots: { default: '<span data-testid="custom-icon">★</span>' },
    });
    expect(screen.getByTestId("custom-icon")).toBeTruthy();
  });

  it("applies correct size class", () => {
    const { container } = render(NAvatar, {
      props: { name: "John", size: "lg" },
    });
    expect(container.firstElementChild?.className).toContain("h-12");
    expect(container.firstElementChild?.className).toContain("w-12");
  });

  it("shows online indicator when online is true", () => {
    const { container } = render(NAvatar, {
      props: { name: "John", online: true },
    });
    expect(container.querySelector(".bg-success-500")).toBeTruthy();
  });

  it("shows offline indicator when online is false", () => {
    const { container } = render(NAvatar, {
      props: { name: "John", online: false },
    });
    expect(container.querySelector(".bg-surface-300")).toBeTruthy();
  });

  it("applies rounded-full class by default", () => {
    const { container } = render(NAvatar, {
      props: { name: "John" },
    });
    expect(container.firstElementChild?.className).toContain("rounded-full");
  });

  it("applies rounded-lg class when rounded is false", () => {
    const { container } = render(NAvatar, {
      props: { name: "John", rounded: false },
    });
    expect(container.firstElementChild?.className).toContain("rounded-lg");
  });
});
