import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { axiosInstance } from "@/config/axios";

vi.mock("@/config/axios", () => ({
  axiosInstance: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useApiQuery", () => {
  it("should return data from axios response api envelope", async () => {
    (axiosInstance as Mock).mockResolvedValueOnce({
      data: { data: { id: "123", name: "Test" } },
    });

    const { result } = renderHook(
      () => useApiQuery(["test"], { method: "GET", url: "/test" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ id: "123", name: "Test" });
    expect(axiosInstance).toHaveBeenCalledWith(
      expect.objectContaining({ method: "GET", url: "/test" }),
    );
  });

  it("should return data directly when no api envelope", async () => {
    (axiosInstance as Mock).mockResolvedValueOnce({
      data: { id: "123", name: "Test" },
    });

    const { result } = renderHook(
      () => useApiQuery(["test"], { method: "GET", url: "/test" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ id: "123", name: "Test" });
  });

  it("should accept non-array query key", async () => {
    (axiosInstance as Mock).mockResolvedValueOnce({
      data: { data: "value" },
    });

    const { result } = renderHook(
      () => useApiQuery("simpleKey" as never, { method: "GET", url: "/test" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe("value");
  });
});

describe("useApiMutation", () => {
  it("should call axios with config object and variables as data", async () => {
    (axiosInstance as Mock).mockResolvedValueOnce({
      data: { data: { id: "456" } },
    });

    const { result } = renderHook(
      () =>
        useApiMutation<unknown, { name: string }>({
          method: "POST",
          url: "/create",
        }),
      { wrapper: createWrapper() },
    );

    result.current.mutate({ name: "New Item" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/create",
        data: { name: "New Item" },
      }),
    );
    expect(result.current.data).toEqual({ id: "456" });
  });

  it("should call axios with function-based config builder", async () => {
    (axiosInstance as Mock).mockResolvedValueOnce({
      data: { data: { ok: true } },
    });

    const { result } = renderHook(
      () =>
        useApiMutation<unknown, { itemId: string }>((vars) => ({
          method: "POST",
          url: `/items/${vars.itemId}/process`,
          data: { action: "approve" },
        })),
      { wrapper: createWrapper() },
    );

    result.current.mutate({ itemId: "item_1" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/items/item_1/process",
        data: { action: "approve" },
      }),
    );
  });
});
