import React, { ReactElement } from "react";
import {
  render,
  screen,
  fireEvent,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import Providers from "@/store/provider";
import { describe, it } from "@jest/globals";
import Header from "@/components/Header";
import PosterForm from "@/components/CreatePoster/posterForm";
import LogIn from "@/components/auth-login-regis/login";
import { GoogleOAuthProvider } from "@react-oauth/google";

const sendComponent = (component: ReactElement): RenderResult =>
  render(
    <GoogleOAuthProvider clientId={`${process.env.GOOGLE_CLIENT_ID}`}>
      <Providers> {component}</Providers>
    </GoogleOAuthProvider>
  );
jest.mock("next/router", () => require("next-router-mock"));
jest.mock("node-fetch", () => require("jest-fetch-mock"));
jest.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  useSearchParams: () => jest.fn(),
}));

describe("Main Home Page", () => {
  it("renders Header Page", () => {
    const { container } = sendComponent(<Header />);
    expect(container).toMatchSnapshot();
  });
});

// login page test cases
describe("Login Component", () => {
  it("renders the login form", () => {
    sendComponent(<LogIn />);
    expect(screen.getByTestId("emailtest")).toBeInTheDocument();
  });

  it("redirects on successful login", async () => {
    sendComponent(<LogIn />);
    expect(screen.getByTestId("emailtest")).toBeInTheDocument();
    expect(screen.getByTestId("passwordtest")).toBeInTheDocument();
    expect(screen.getByTestId("loginSubmit")).toBeEnabled();

    await waitFor(() => {
      fireEvent.change(screen.getByTestId("emailtest"), {
        target: { value: "sutariyavansh@gmail.com" },
      });
      fireEvent.change(screen.getByTestId("passwordtest"), {
        target: { value: "74108520" },
      });

      fireEvent.submit(screen.getByTestId("loginSubmit"));
    });
  });

  it("displays validation errors for empty fields", async () => {
    sendComponent(<LogIn />);
    fireEvent.submit(screen.getByTestId("loginSubmit"));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("displays validation error for invalid email format", async () => {
    sendComponent(<LogIn />);
    fireEvent.change(screen.getByTestId("emailtest"), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(screen.getByTestId("passwordtest"), {
      target: { value: "password" },
    });
    fireEvent.submit(screen.getByTestId("loginSubmit"));

    await waitFor(() => {
      expect(screen.getByText("Email is invalid")).toBeInTheDocument();
    });
  });
});

describe("CreatePoster Page", () => {
  it("renders the CreatePoster form", () => {
    const { container } = sendComponent(<PosterForm />);
    expect(container).toMatchSnapshot();
  });

  it("displays validation errors for invalid form inputs", async () => {
    sendComponent(<PosterForm />);

    fireEvent.submit(screen.getByTestId("createPosterForm"));

    await waitFor(() => {
      expect(screen.getByText("Title must be required")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "" },
    });

    fireEvent.submit(screen.getByTestId("createPosterForm"));

    await waitFor(() => {
      expect(screen.getByText("Title must be required")).toBeInTheDocument();
    });
  });
});
