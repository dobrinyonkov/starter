import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import SettingsPage from "./settings";

const mockUser = {
  id: "user-123",
  name: "Jane Doe",
  email: "jane@test.com",
  image: null,
};

const mockSessions = [
  {
    id: "sess-1",
    token: "tok-1",
    userAgent: "Mozilla/5.0 Chrome/120",
    ipAddress: "192.168.1.1",
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "sess-2",
    token: "tok-2",
    userAgent: null,
    ipAddress: null,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

describe("Settings page", () => {
  function renderSettings(
    user = mockUser,
    sessions = mockSessions,
  ) {
    const Stub = createRoutesStub([
      {
        path: "/app/settings",
        Component: SettingsPage,
        loader() {
          return { user, sessions };
        },
      },
    ]);
    render(<Stub initialEntries={["/app/settings"]} />);
  }

  it("renders the settings heading", async () => {
    renderSettings();
    expect(await screen.findByText("Settings")).toBeInTheDocument();
  });

  it("shows profile info", async () => {
    renderSettings();
    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@test.com")).toBeInTheDocument();
    expect(screen.getByText("user-123")).toBeInTheDocument();
  });

  it("displays active sessions with user agent", async () => {
    renderSettings();
    expect(await screen.findByText("Mozilla/5.0 Chrome/120")).toBeInTheDocument();
    expect(screen.getByText(/192\.168\.1\.1/)).toBeInTheDocument();
  });

  it("shows unknown device for sessions without user agent", async () => {
    renderSettings();
    expect(await screen.findByText("Unknown device")).toBeInTheDocument();
    expect(screen.getByText(/Unknown IP/)).toBeInTheDocument();
  });

  it("shows empty state when no sessions", async () => {
    renderSettings(mockUser, []);
    expect(await screen.findByText("No active sessions.")).toBeInTheDocument();
  });

  it("shows dash for missing name", async () => {
    renderSettings({ ...mockUser, name: "" });
    // The name row should show "—" for empty name
    expect(await screen.findByText("—")).toBeInTheDocument();
  });
});
