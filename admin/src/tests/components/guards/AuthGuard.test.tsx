import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { AuthGuard } from "@/components/guards/AuthGuard";
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

beforeEach(() => {
  vi.clearAllMocks();
});

function renderAuthGuard(mockReturn: object) {
  (useApiQuery as Mock).mockReturnValue(mockReturn);

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<AuthGuard />}>
          <Route
            path="/dashboard"
            element={<div data-testid="protected-content">Dashboard</div>}
          />
        </Route>
        <Route
          path="/login"
          element={<div data-testid="login-page">Login</div>}
        />
        <Route
          path="/unauthorized"
          element={<div data-testid="unauthorized-page">Unauthorized</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AuthGuard", () => {
  it("should show spinner while loading", () => {
    const { container } = renderAuthGuard({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(container.querySelector("svg.animate-spin")).toBeInTheDocument();
  });

  it("should render outlet when authenticated with valid admin role", () => {
    renderAuthGuard({
      data: { _id: "1", name: "Admin", email: "admin@test.com", role: "admin" },
      isLoading: false,
      isError: false,
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("should render outlet when authenticated with owner role", () => {
    renderAuthGuard({
      data: { _id: "2", name: "Owner", email: "owner@test.com", role: "owner" },
      isLoading: false,
      isError: false,
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("should render outlet when authenticated with superAdmin role", () => {
    renderAuthGuard({
      data: {
        _id: "3",
        name: "SuperAdmin",
        email: "super@test.com",
        role: "superAdmin",
      },
      isLoading: false,
      isError: false,
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("should redirect to login when profile fetch errors", () => {
    renderAuthGuard({ data: undefined, isLoading: false, isError: true });

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("should redirect to login when profile is null", () => {
    renderAuthGuard({ data: null, isLoading: false, isError: false });

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("should redirect to unauthorized for invalid role", () => {
    renderAuthGuard({
      data: { _id: "4", name: "Guest", email: "guest@test.com", role: "user" },
      isLoading: false,
      isError: false,
    });

    expect(screen.getByTestId("unauthorized-page")).toBeInTheDocument();
  });
});
