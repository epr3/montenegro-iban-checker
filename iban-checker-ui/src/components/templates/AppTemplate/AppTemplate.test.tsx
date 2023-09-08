import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AppTemplate from "./AppTemplate";

describe("App Template", () => {
  it("should be in the document", () => {
    render(
      <AppTemplate>
        <p>Test</p>
      </AppTemplate>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
