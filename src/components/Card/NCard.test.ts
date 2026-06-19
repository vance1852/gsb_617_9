import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import NCard from "./NCard.vue";

describe("NCard", () => {
  it("renders default slot content", () => {
    render(NCard, {
      slots: { default: "Card content" },
    });
    expect(screen.getByText("Card content")).toBeTruthy();
  });

  it("renders header slot", () => {
    render(NCard, {
      slots: { header: "Card Header", default: "Content" },
    });
    expect(screen.getByText("Card Header")).toBeTruthy();
  });

  it("renders footer slot", () => {
    render(NCard, {
      slots: { footer: "Card Footer", default: "Content" },
    });
    expect(screen.getByText("Card Footer")).toBeTruthy();
  });

  it("applies hoverable class when hoverable prop is true", () => {
    const { container } = render(NCard, {
      props: { hoverable: true },
      slots: { default: "Content" },
    });
    expect(container.firstElementChild?.className).toContain("hover:shadow-md");
  });

  it("emits click event when clickable", async () => {
    const { emitted, container } = render(NCard, {
      props: { clickable: true },
      slots: { default: "Content" },
    });
    await fireEvent.click(container.firstElementChild!);
    expect(emitted().click).toBeTruthy();
  });

  it("has correct role when clickable", () => {
    const { container } = render(NCard, {
      props: { clickable: true },
      slots: { default: "Content" },
    });
    expect(container.firstElementChild?.getAttribute("role")).toBe("button");
  });

  it("applies shadow classes based on shadow prop", () => {
    const { container } = render(NCard, {
      props: { shadow: "lg" },
      slots: { default: "Content" },
    });
    expect(container.firstElementChild?.className).toContain("shadow-lg");
  });
});
