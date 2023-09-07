import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Alert from "./Alert";

describe("Alert", () => {
  it("should be in document", () => {
    render(<Alert message="Test" type="SUCCESS" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should be of type ERROR", () => {
    const { container } = render(<Alert message="Test" type="ERROR" />);
    expect(container.firstChild).toHaveClass("bg-red-100");
  });

  it("should be of type SUCCESS", () => {
    const { container } = render(<Alert message="Test" type="SUCCESS" />);
    console.log(screen.getByText("Test").firstChild);
    expect(container.firstChild).toHaveClass("bg-green-100");
  });
});
