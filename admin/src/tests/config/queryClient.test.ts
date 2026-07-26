import { describe, it, expect } from "vitest";
import { queryClient } from "@/config/queryClient";

describe("config queryClient", () => {
  it("should have staleTime of 5 minutes", () => {
    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(
      5 * 60 * 1000,
    );
  });

  it("should have gcTime of 5 minutes", () => {
    expect(queryClient.getDefaultOptions().queries?.gcTime).toBe(5 * 60 * 1000);
  });

  it("should have refetchOnWindowFocus set to false", () => {
    expect(queryClient.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(
      false,
    );
  });

  it("mutations should not retry by default", () => {
    expect(queryClient.getDefaultOptions().mutations?.retry).toBe(false);
  });
});
