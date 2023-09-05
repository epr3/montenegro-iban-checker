import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Label from "./Label";

describe("Label", () => {
  it("Label to be in document", () => {
    render(<Label id="test" text="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
