import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import NInput from "./NInput.vue";

describe("NInput", () => {
  it("renders label when provided", () => {
    render(NInput, {
      props: { label: "Username" },
    });
    expect(screen.getByText("Username")).toBeTruthy();
  });

  it("emits update:modelValue on input", async () => {
    const { emitted } = render(NInput, {
      props: { placeholder: "Enter text" },
    });
    const input = screen.getByPlaceholderText("Enter text");
    await fireEvent.update(input, "test");
    expect(emitted()["update:modelValue"]).toBeTruthy();
  });

  it("renders help text", () => {
    render(NInput, {
      props: { helpText: "Enter your username" },
    });
    expect(screen.getByText("Enter your username")).toBeTruthy();
  });

  it("applies error status class", () => {
    render(NInput, {
      props: { status: "error", placeholder: "Input" },
    });
    const input = screen.getByPlaceholderText("Input");
    expect(input.className).toContain("ring-error-500");
  });

  it("toggles password visibility", async () => {
    render(NInput, {
      props: { type: "password", placeholder: "Password" },
    });
    const input = screen.getByPlaceholderText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");

    const toggleBtn = screen.getByRole("button");
    await fireEvent.click(toggleBtn);
    expect(input.type).toBe("text");
  });

  it("has aria-invalid when status is error", () => {
    render(NInput, {
      props: { status: "error", placeholder: "Input" },
    });
    const input = screen.getByPlaceholderText("Input");
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });
});
