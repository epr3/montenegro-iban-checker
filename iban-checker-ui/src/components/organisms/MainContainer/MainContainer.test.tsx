import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MainContainer from "./MainContainer";
import { NotificationContext } from "../../../context/NotificationContext";

describe("Main Container", () => {
  const spy = vi.fn();
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("should be in the document", () => {
    render(<MainContainer submitFunc={spy} />);
    expect(screen.getByText("Montenegro IBAN checker")).toBeInTheDocument();
  });

  it("should call the submit function if all fields are valid", async () => {
    render(<MainContainer submitFunc={spy} />);

    const input = screen.getByLabelText("Enter your IBAN here");
    const submitButton = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "ME25505000012345678951" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(spy).toHaveBeenCalledOnce());
  });

  it("should display alerts if there are any", () => {
    render(
      <NotificationContext.Provider
        value={{
          notifications: [{ type: "SUCCESS", message: "Test" }],
          setNotifications: vi.fn(),
        }}
      >
        <MainContainer submitFunc={spy} />
      </NotificationContext.Provider>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
