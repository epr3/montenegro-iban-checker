import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Input from "./Input";

describe("Input", () => {
  it("Input to be in document", () => {
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

  it("Input error to be in document", () => {
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
