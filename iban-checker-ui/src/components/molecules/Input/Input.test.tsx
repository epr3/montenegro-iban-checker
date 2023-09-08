import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Input from "./Input";

describe("Input", () => {
  it("should be in the document", () => {
    render(
      <Input
        name="test"
        label="Test"
        type="text"
        onBlur={() => {}}
        onChange={() => {}}
        value=""
      />
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should display the error", () => {
    render(
      <Input
        name="test"
        label="Test"
        type="text"
        onBlur={() => {}}
        onChange={() => {}}
        value="test4"
        isTouched
        errors="Test error"
      />
    );
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });
});
