import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MainContainer from "./MainContainer";

describe("Input", () => {
  it("Input to be in document", () => {
    render(<MainContainer />);
    expect(screen.getByText("Montenegro IBAN checker")).toBeInTheDocument();
  });
});
