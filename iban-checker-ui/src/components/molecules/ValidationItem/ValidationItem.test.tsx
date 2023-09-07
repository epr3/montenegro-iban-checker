import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ValidationItem from "./ValidationItem";

describe("ValidationItem", () => {
  it("should be in the document", () => {
    render(<ValidationItem iban="1" status="VALID" timestamp="2023-09-05" />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
