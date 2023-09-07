import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ValidationHistory from "./ValidationHistory";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dummyValidations = [
  {
    id: "1",
    iban: "1",
    status: "VALID",
    timestamp: "2023-09-02",
  },
];

const loadMore = () => {};

describe("Validation History", () => {
  it("should be in the document", () => {
    render(
      <ValidationHistory
        validations={dummyValidations}
        loadMore={loadMore}
        page={1}
        total={dummyValidations.length}
      />
    );
    expect(screen.getByText("Validation history")).toBeInTheDocument();
    expect(screen.getByText("VALID")).toBeInTheDocument();
  });

  it("should render a paragraph if there are no validations", () => {
    render(
      <ValidationHistory
        validations={[]}
        loadMore={loadMore}
        page={1}
        total={0}
      />
    );
    expect(screen.getByText("No validations yet.")).toBeInTheDocument();
  });
});
