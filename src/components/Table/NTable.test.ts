import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import NTable from "./NTable.vue";

const columns = [
  { key: "name" as const, label: "Name", sortable: true },
  { key: "email" as const, label: "Email" },
];

const data = [
  { name: "John", email: "john@example.com" },
  { name: "Jane", email: "jane@example.com" },
];

describe("NTable", () => {
  it("renders table with data", () => {
    render(NTable, {
      props: { columns, data },
    });
    expect(screen.getByText("John")).toBeTruthy();
    expect(screen.getByText("jane@example.com")).toBeTruthy();
  });

  it("renders column headers", () => {
    render(NTable, {
      props: { columns, data },
    });
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
  });

  it("emits rowClick when row is clicked", async () => {
    const { emitted } = render(NTable, {
      props: { columns, data },
    });
    await fireEvent.click(screen.getByText("John").closest("tr")!);
    expect(emitted().rowClick).toBeTruthy();
  });

  it("sorts data when sortable column header is clicked", async () => {
    render(NTable, {
      props: { columns, data },
    });
    const nameHeader = screen.getByText("Name");
    await fireEvent.click(nameHeader);
    // After sorting, Jane should come before John
    const rows = screen.getAllByRole("row");
    expect(rows[1].textContent).toContain("Jane");
  });

  it("applies striped class when striped prop is true", () => {
    const { container } = render(NTable, {
      props: { columns, data, striped: true },
    });
    expect(
      container.querySelector("tbody tr:nth-child(even)")?.className,
    ).toContain("bg-surface-50");
  });

  it("applies compact padding when compact prop is true", () => {
    const { container } = render(NTable, {
      props: { columns, data, compact: true },
    });
    const cell = container.querySelector("td");
    expect(cell?.className).toContain("py-2");
  });

  it("applies sticky header when stickyHeader prop is true", () => {
    const { container } = render(NTable, {
      props: { columns, data, stickyHeader: true },
    });
    const thead = container.querySelector("thead");
    expect(thead?.className).toContain("sticky");
  });

  it("renders with virtual scroll enabled", () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      name: `User ${i}`,
      email: `user${i}@example.com`,
    }));
    const { container } = render(NTable, {
      props: { columns, data: largeData, virtualScroll: true, visibleRows: 10 },
    });
    // Virtual scroll container should exist
    expect(container.querySelector(".overflow-auto")).toBeTruthy();
  });

  it("renders filter inputs for filterable columns", () => {
    const filterColumns = [
      { key: "name" as const, label: "Name", filterable: true },
      { key: "email" as const, label: "Email" },
    ];
    const { container } = render(NTable, {
      props: { columns: filterColumns, data },
    });
    const filterInputs = container.querySelectorAll('input[placeholder="筛选..."]');
    expect(filterInputs.length).toBe(1);
  });

  it("filters data when filter input is used", async () => {
    const filterColumns = [
      { key: "name" as const, label: "Name", filterable: true },
      { key: "email" as const, label: "Email" },
    ];
    const { container } = render(NTable, {
      props: { columns: filterColumns, data },
    });
    const filterInput = container.querySelector('input[placeholder="筛选..."]') as HTMLInputElement;
    await fireEvent.update(filterInput, "Jane");
    // Only Jane should be visible
    expect(screen.getByText("Jane")).toBeTruthy();
    expect(screen.queryByText("John")).toBeNull();
  });

  it("renders pagination when pageSize is set", () => {
    const manyData = Array.from({ length: 20 }, (_, i) => ({
      name: `User ${i}`,
      email: `user${i}@example.com`,
    }));
    render(NTable, {
      props: { columns, data: manyData, pageSize: 5 },
    });
    // Should show pagination info
    expect(screen.getByText(/共 20 条/)).toBeTruthy();
  });

  it("navigates pages when pagination button is clicked", async () => {
    const manyData = Array.from({ length: 10 }, (_, i) => ({
      name: `User ${i}`,
      email: `user${i}@example.com`,
    }));
    const { emitted } = render(NTable, {
      props: { columns, data: manyData, pageSize: 5 },
    });
    // Page "2" button should exist
    const page2Btn = screen.getByText("2");
    await fireEvent.click(page2Btn);
    expect(emitted()["update:currentPage"]).toBeTruthy();
    expect(emitted()["update:currentPage"][0]).toEqual([2]);
  });

  it("renders column resize handles", () => {
    const { container } = render(NTable, {
      props: { columns, data },
    });
    const resizeHandles = container.querySelectorAll(".cursor-col-resize");
    expect(resizeHandles.length).toBe(columns.length);
  });

  it("shows empty state when no data matches filter", async () => {
    const filterColumns = [
      { key: "name" as const, label: "Name", filterable: true },
      { key: "email" as const, label: "Email" },
    ];
    const { container } = render(NTable, {
      props: { columns: filterColumns, data },
    });
    const filterInput = container.querySelector('input[placeholder="筛选..."]') as HTMLInputElement;
    await fireEvent.update(filterInput, "zzzzz");
    expect(screen.getByText("暂无数据")).toBeTruthy();
  });
});
