import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
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

vi.mock("@/constants/queryConfig", () => ({
  PROFILE_STALE_TIME: 300000,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function renderRoleGuard(mockReturn: object, allowedRoles: string[]) {
  (useApiQuery as import("vitest").Mock).mockReturnValue(mockReturn);

  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route element={<RoleGuard allowedRoles={allowedRoles} />}>
          <Route
            path="/admin"
            element={<div data-testid="admin-content">Admin Panel</div>}
          />
        </Route>
        <Route
          path="/unauthorized"
          element={<div data-testid="unauthorized-page">Unauthorized</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("RoleGuard", () => {
  it("should return null while loading", () => {
    const { container } = renderRoleGuard(
      { data: undefined, isLoading: true },
      ["admin", "superAdmin"],
    );

    expect(container.innerHTML).toBe("");
  });

  it("should render outlet when user role is in allowed list", () => {
    renderRoleGuard(
      {
        data: {
          _id: "1",
          name: "Admin",
          email: "admin@test.com",
          role: "admin",
        },
        isLoading: false,
      },
      ["admin", "superAdmin"],
    );

    expect(screen.getByTestId("admin-content")).toBeInTheDocument();
  });

  it("should redirect to unauthorized when user role is not allowed", () => {
    renderRoleGuard(
      {
        data: {
          _id: "2",
          name: "Owner",
          email: "owner@test.com",
          role: "owner",
        },
        isLoading: false,
      },
      ["admin", "superAdmin"],
    );

    expect(screen.getByTestId("unauthorized-page")).toBeInTheDocument();
  });

  it("should redirect to unauthorized when profile is null", () => {
    renderRoleGuard({ data: null, isLoading: false }, ["admin"]);

    expect(screen.getByTestId("unauthorized-page")).toBeInTheDocument();
  });
});
