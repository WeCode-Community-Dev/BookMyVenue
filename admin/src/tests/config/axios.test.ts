import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

let requestHandler: ((config: object) => object) | null = null;
let successHandler: ((response: object) => object) | null = null;
let errorHandler: ((error: object) => Promise<object>) | null = null;

const mockInstance = vi.fn();
mockInstance.interceptors = {
  request: {
    use: vi.fn((fn: (config: object) => object) => {
      requestHandler = fn;
    }),
  },
  response: {
    use: vi.fn(
      (
        success: (response: object) => object,
        error: (err: object) => Promise<object>,
      ) => {
        successHandler = success;
        errorHandler = error;
      },
    ),
  },
};
mockInstance.get = vi.fn();
mockInstance.post = vi.fn();

vi.mock("axios", () => {
  const isAxiosError = vi.fn((err: unknown) => {
    if (err && typeof err === "object" && "isAxiosError" in err) {
      return (err as Record<string, unknown>).isAxiosError === true;
    }
    return false;
  });

  return {
    default: {
      create: vi.fn(() => mockInstance),
      isAxiosError,
    },
    isAxiosError,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  requestHandler = null;
  successHandler = null;
  errorHandler = null;
});

describe("config axios", () => {
  it("should create axios instance with correct baseURL and timeout", async () => {
    const { createAxiosInstance } = await import("@/config/axios");

    createAxiosInstance();

    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.stringContaining("/api/v1"),
        withCredentials: true,
        timeout: 30000,
      }),
    );
  });

  it("should set up request and response interceptors", async () => {
    const { createAxiosInstance } = await import("@/config/axios");

    createAxiosInstance();

    expect(mockInstance.interceptors.request.use).toHaveBeenCalledWith(
      expect.any(Function),
    );
    expect(mockInstance.interceptors.response.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("request interceptor should pass config through unchanged", async () => {
    const { createAxiosInstance } = await import("@/config/axios");

    createAxiosInstance();

    const config = { url: "/test", headers: {} };
    const result = requestHandler!(config);
    expect(result).toEqual(config);
  });

  it("success handler should pass response through unchanged", async () => {
    const { createAxiosInstance } = await import("@/config/axios");

    createAxiosInstance();

    const response = { data: { success: true }, status: 200 };
    const result = successHandler!(response);
    expect(result).toEqual(response);
  });

  it("should reject non-Axios errors without response", async () => {
    const { createAxiosInstance } = await import("@/config/axios");

    createAxiosInstance();

    const error = new Error("Network failure");
    await expect(errorHandler!(error as never)).rejects.toThrow(
      "Network failure",
    );
  });

  it("should dispatch auth:logout event on 401 from refresh endpoint", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const { createAxiosInstance } = await import("@/config/axios");

    createAxiosInstance();

    const axiosError = {
      isAxiosError: true,
      response: { status: 401 },
      config: { url: "/auth/refresh", _retry: false },
      message: "Token expired",
    };

    await expect(errorHandler!(axiosError as never)).rejects.toThrow(
      "Token expired",
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "auth:logout",
      }),
    );
  });

  it("should dispatch auth:forbidden event on 403", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const { createAxiosInstance } = await import("@/config/axios");

    createAxiosInstance();

    const axiosError = {
      isAxiosError: true,
      response: { status: 403, data: { message: "Forbidden" } },
      config: { url: "/admin", _retry: false },
      message: "Forbidden",
    };

    await expect(errorHandler!(axiosError as never)).rejects.toThrow(
      "Forbidden",
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "auth:forbidden",
      }),
    );
  });

  it("should attempt token refresh on 401 from non-auth endpoint", async () => {
    mockInstance.mockResolvedValueOnce({ data: { success: true } });
    mockInstance.post.mockResolvedValueOnce({
      data: { accessToken: "new_token" },
    });

    const { createAxiosInstance } = await import("@/config/axios");

    createAxiosInstance();

    const axiosError = {
      isAxiosError: true,
      response: { status: 401 },
      config: { url: "/venues", _retry: false },
      message: "Unauthorized",
    };

    const resultPromise = errorHandler!(axiosError as never);

    await expect(resultPromise).resolves.toEqual({ data: { success: true } });
    expect(mockInstance.post).toHaveBeenCalledWith("/auth/refresh");
  });
});
