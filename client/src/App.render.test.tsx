import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, beforeAll } from "vitest";
import App from "./App";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("max-width"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

describe("App render", () => {
  it("renders home hero copy without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getAllByText(/BUILDING MORE THAN HOMES/i).length).toBeGreaterThan(0);
  });

  it("renders Jura project page without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/projects/jura-sokhna"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
  });

  it("renders Jamila project page without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/projects/jamila"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
  });

  it("renders news listing without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/news"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Latest from J Communities/i)).toBeInTheDocument();
  });
});
