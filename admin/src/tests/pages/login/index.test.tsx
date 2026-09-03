import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import LoginPage from "@/pages/login/index";
import { useApiMutation } from "@/hooks/useApi";

const mockMutate = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/hooks/useApi", () => ({
  useApiMutation: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/config/queryClient", () => ({
  queryClient: {
    invalidateQueries: vi.fn(),
  },
}));

vi.mock("@/utils/redirect", () => ({
  getSafeRedirectUrl: vi.fn((url, fallback) => url || fallback),
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={<div data-testid="dashboard-page">Dashboard</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  it("should render login form with email and password fields", () => {
    (useApiMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    });

    renderLoginPage();

    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("should show loading state on button when isPending is true", () => {
    (useApiMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
    });

    renderLoginPage();

    const submitButton = screen.getByRole("button", { name: /signing in/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("should display error message when mutation fails", () => {
    (useApiMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: { message: "Invalid credentials" },
    });

    renderLoginPage();

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("should call mutate with email and password on form submit", () => {
    (useApiMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    });

    renderLoginPage();

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockMutate).toHaveBeenCalledWith({
      email: "admin@test.com",
      password: "password123",
    });
  });
});
