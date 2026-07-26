import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { OwnerGuard } from "@/components/guards/OwnerGuard";
import { useApiQuery } from "@/hooks/useApi";

vi.mock("@/hooks/useApi", () => ({
  useApiQuery: vi.fn(),
}));

vi.mock("@/config/queryKeys", () => ({
  QUERY_KEYS: { PROFILE: ["profile"] },
}));

vi.mock("@/constants", () => ({
  API_ENDPOINTS: { PROFILE: "/user/profile" },
}));

vi.mock("@/constants/roles", () => ({
  ROLES: { OWNER: "owner", ADMIN: "admin", SUPER_ADMIN: "superAdmin" },
}));

vi.mock("@/constants/queryConfig", () => ({
  PROFILE_STALE_TIME: 300000,
}));

vi.mock("@/constants/routes", () => ({
  ROUTES: {
    DASHBOARD: "/dashboard",
    SELECT_VENUE: "/dashboard/select-venue",
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function renderOwnerGuard(
  mockReturn: object,
  initialPath: string = "/dashboard",
) {
  (useApiQuery as Mock).mockReturnValue(mockReturn);

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<OwnerGuard />}>
          <Route
            path="/dashboard"
            element={<div data-testid="dashboard-content">Dashboard</div>}
          />
          <Route
            path="/dashboard/select-venue"
            element={<div data-testid="select-venue-page">Select Venue</div>}
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("OwnerGuard", () => {
  it("should render outlet for non-owner role on dashboard", () => {
    renderOwnerGuard({
      data: { _id: "1", name: "Admin", email: "admin@test.com", role: "admin" },
    });

    expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
  });

  it("should render outlet for superAdmin role on dashboard", () => {
    renderOwnerGuard({
      data: {
        _id: "2",
        name: "SuperAdmin",
        email: "super@test.com",
        role: "superAdmin",
      },
    });

    expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
  });

  it("should redirect owner to select-venue when on dashboard", () => {
    renderOwnerGuard(
      {
        data: {
          _id: "3",
          name: "Owner",
          email: "owner@test.com",
          role: "owner",
        },
      },
      "/dashboard",
    );

    expect(screen.getByTestId("select-venue-page")).toBeInTheDocument();
  });

  it("should render outlet for owner when not on dashboard path", () => {
    renderOwnerGuard(
      {
        data: {
          _id: "3",
          name: "Owner",
          email: "owner@test.com",
          role: "owner",
        },
      },
      "/dashboard/select-venue",
    );

    expect(screen.getByTestId("select-venue-page")).toBeInTheDocument();
  });
});
