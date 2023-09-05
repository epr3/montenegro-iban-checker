import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("Button to be in document", () => {
    render(<Button>Test</Button>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("Button to be disabled", () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByText("Test")).toBeDisabled();
  });
});
