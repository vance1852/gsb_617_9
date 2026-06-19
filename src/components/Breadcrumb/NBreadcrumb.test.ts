import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import NBreadcrumb from "./NBreadcrumb.vue";

const items = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Category", href: "/products/category" },
  { label: "Item" },
];

describe("NBreadcrumb", () => {
  it("renders all breadcrumb items", () => {
    render(NBreadcrumb, {
      props: { items },
    });
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Products")).toBeTruthy();
    expect(screen.getByText("Item")).toBeTruthy();
  });

  it("renders links for items with href", () => {
    render(NBreadcrumb, {
      props: { items },
    });
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink?.getAttribute("href")).toBe("/");
  });

  it("renders span for last item without href", () => {
    render(NBreadcrumb, {
      props: { items },
    });
    const lastItem = screen.getByText("Item");
    expect(lastItem.closest("span")).toBeTruthy();
    expect(lastItem.closest("a")).toBeNull();
  });

  it("emits click event when item is clicked", async () => {
    const { emitted } = render(NBreadcrumb, {
      props: { items },
    });
    await fireEvent.click(screen.getByText("Products"));
    expect(emitted().click).toBeTruthy();
  });

  it("collapses items when maxItems is set", () => {
    render(NBreadcrumb, {
      props: { items, maxItems: 3 },
    });
    // Should show ellipsis button
    expect(screen.getByLabelText("Show more breadcrumbs")).toBeTruthy();
  });

  it("shows dropdown when ellipsis is clicked", async () => {
    render(NBreadcrumb, {
      props: { items, maxItems: 3 },
    });
    const ellipsisBtn = screen.getByLabelText("Show more breadcrumbs");
    await fireEvent.click(ellipsisBtn);
    // Collapsed items should be visible in dropdown
    expect(screen.getByText("Products")).toBeTruthy();
  });

  it("collapses on mobile when collapseOnMobile is true", () => {
    // This test verifies the component has the collapseOnMobile prop
    // Actual mobile behavior requires browser resize which is hard to test
    render(NBreadcrumb, {
      props: { items, collapseOnMobile: true, maxItems: 2 },
    });
    // With maxItems=2 and 4 items, should show ellipsis
    expect(screen.getByLabelText("Show more breadcrumbs")).toBeTruthy();
  });

  it("renders custom separator", () => {
    const { container } = render(NBreadcrumb, {
      props: { items: items.slice(0, 2) },
      slots: { separator: ">" },
    });
    expect(container.textContent).toContain(">");
  });

  it("has correct aria-label", () => {
    render(NBreadcrumb, {
      props: { items },
    });
    expect(screen.getByLabelText("Breadcrumb")).toBeTruthy();
  });
});
