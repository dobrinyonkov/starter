import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import AppLayout from "./layout";

describe("App layout", () => {
  function renderLayout() {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: AppLayout,
        children: [
          {
            path: "app",
            Component: () => <div>Child content</div>,
          },
          {
            path: "app/notes",
            Component: () => <div>Notes page</div>,
          },
          {
            path: "app/settings",
            Component: () => <div>Settings page</div>,
          },
        ],
      },
      {
        path: "/sign-out",
        action() { return { ok: true }; },
        Component: () => null,
      },
    ]);
    render(<Stub initialEntries={["/app"]} />);
  }

  it("renders the app name in sidebar", async () => {
    renderLayout();
    // Desktop sidebar + mobile header both have "Starter"
    const links = await screen.findAllByText("Starter");
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("renders navigation links", async () => {
    renderLayout();
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders sign out button", async () => {
    renderLayout();
    const buttons = await screen.findAllByText("Sign out");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders child content", async () => {
    renderLayout();
    expect(await screen.findByText("Child content")).toBeInTheDocument();
  });
});
