import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";

import { instance } from "./lib/axios";

import App from "./App";

vi.mock("./lib/axios");

const mockedValidations = [
  {
    iban: "ME25537206105398055945",
    status: "VALID",
    session_id: "7bf45e8a-9b1f-44cd-a70f-6b1d162a9740",
    timestamp: "2023-09-07",
    id: "3f63ec85-57d2-4a9d-bfc2-17349e84b4d7",
  },
  {
    iban: "ME88888888888888888888",
    status: "INVALID",
    session_id: "7bf45e8a-9b1f-44cd-a70f-6b1d162a9740",
    timestamp: "2023-09-07",
    id: "b812ef1a-3cd7-4784-b49f-67a46ed7b7b7",
  },
  {
    iban: "ME12345678901234567890",
    status: "VALID",
    session_id: "7bf45e8a-9b1f-44cd-a70f-6b1d162a9740",
    timestamp: "2023-09-07",
    id: "a8c1e697-3b29-455b-891a-4e8f4f84a13f",
  },
  {
    iban: "ME77777777777777777777",
    status: "INVALID",
    session_id: "7bf45e8a-9b1f-44cd-a70f-6b1d162a9740",
    timestamp: "2023-09-07",
    id: "e90a9b6f-9419-4a42-837c-4e9e82e45e76",
  },
  {
    iban: "ME44444444444444444444",
    status: "VALID",
    session_id: "7bf45e8a-9b1f-44cd-a70f-6b1d162a9740",
    timestamp: "2023-09-07",
    id: "5878685c-2389-4394-a461-963ad4e3ffea",
  },
  {
    iban: "ME99999999999999999999",
    status: "INVALID",
    session_id: "7bf45e8a-9b1f-44cd-a70f-6b1d162a9740",
    timestamp: "2023-09-07",
    id: "c36c1eae-70a0-49c0-9cbb-8c62cb272d4e",
  },
  {
    iban: "ME66666666666666666666",
    status: "VALID",
    session_id: "7bf45e8a-9b1f-44cd-a70f-6b1d162a9740",
    timestamp: "2023-09-07",
    id: "f8805056-1d3d-4ad0-9a28-f465f2b7d773",
  },
  {
    iban: "ME33333333333333333333",
    status: "INVALID",
    session_id: "7bf45e8a-9b1f-44cd-a70f-6b1d162a9740",
    timestamp: "2023-09-07",
    id: "ba51e3ef-52d9-4e51-9a66-d4393ff52df1",
  },
  {
    iban: "ME11111111111111111111",
    status: "VALID",
    session_id: "7bf45e8a-9b1f-44cd-a70f-6b1d162a9740",
    timestamp: "2023-09-07",
    id: "ce1b052b-e587-4c13-9c9c-84a6f67b17f7",
  },
  {
    iban: "ME55555555555555555555",
    status: "INVALID",
    session_id: "7bf45e8a-9b1f-44cd-a70f-6b1d162a9740",
    timestamp: "2023-09-07",
    id: "e5d501e0-8da3-4ef2-8b76-35d6ac3975d3",
  },
];

describe("App", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the app and load data on render", async () => {
    vi.mocked(instance, true).get.mockResolvedValueOnce({
      data: {
        data: [],
        meta: { count: 0, page: 1 },
        success: true,
        status: 200,
      },
      status: 200,
    });
    await act(() => render(<App />));
    expect(screen.getByText("Montenegro IBAN checker")).toBeInTheDocument();
  });
  it("should load extra data on load more", async () => {
    vi.mocked(instance, true)
      .get.mockResolvedValueOnce({
        data: {
          data: mockedValidations.slice(0, 7),
          meta: { count: 10, page: 1 },
          success: true,
          status: 200,
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: mockedValidations.slice(7),
          meta: { count: 10, page: 2 },
          success: true,
          status: 200,
        },
      });

    await act(() => render(<App />));
    const loadMore = screen.getByText("Load more");
    await act(() => fireEvent.click(loadMore));
    expect(instance.get).toHaveBeenCalledTimes(2);
  });
  it("should submit the form and add a new valid IBAN to the list on success", async () => {
    vi.mocked(instance, true).get.mockResolvedValueOnce({
      data: {
        data: [],
        meta: { count: 0, page: 1 },
        success: true,
        status: 200,
      },
      status: 200,
    });
    vi.mocked(instance, true).post.mockResolvedValueOnce({
      data: {
        data: mockedValidations[0],
        message: "IBAN is valid",
        success: true,
        status: 200,
      },
    });
    render(<App />);
    const input = screen.getByPlaceholderText("ME25BBBAAAAAAAAAAAAANN");
    const submitButton = screen.getByText("Check IBAN");
    fireEvent.change(input, { target: { value: "ME25505000012345678951" } });
    await act(() => {
      return fireEvent.click(submitButton);
    });
    expect(await screen.findByText("IBAN is valid")).toBeInTheDocument();
    expect(instance.post).toHaveBeenCalledTimes(1);
  });
  it("should submit the form and add a new invalid IBAN to the list on fail", async () => {
    vi.mocked(instance, true).get.mockResolvedValueOnce({
      data: {
        data: [],
        meta: { count: 0, page: 1 },
        success: true,
        status: 200,
      },
      status: 200,
    });
    vi.mocked(instance, true).post.mockRejectedValueOnce({
      response: {
        data: {
          data: mockedValidations[0],
          message: "National check digits do not match",
          success: false,
          status: 400,
        },
      },
    });
    render(<App />);
    const input = screen.getByPlaceholderText("ME25BBBAAAAAAAAAAAAANN");
    const submitButton = screen.getByText("Check IBAN");
    fireEvent.change(input, { target: { value: "ME25505000012345678951" } });
    await act(() => {
      return fireEvent.click(submitButton);
    });
    expect(
      await screen.findByText("National check digits do not match")
    ).toBeInTheDocument();
    expect(instance.post).toHaveBeenCalledTimes(1);
  });
});
