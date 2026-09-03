import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useModal } from "@/hooks/useModal";
import { useModalStore } from "@/store/useModalStore";

vi.mock("@/store/useModalStore", () => ({
  useModalStore: vi.fn(),
}));

describe("useModal", () => {
  it("should call open on useModalStore when openModal is invoked", () => {
    const open = vi.fn();
    const close = vi.fn();
    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = { open, close };
      return selector(state);
    });

    const { result } = renderHook(() => useModal());

    result.current.openModal({
      title: "Test Modal",
      component: () => null,
      data: { key: "value" },
      actions: [],
    });

    expect(open).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Modal",
      }),
    );
  });

  it("should call close on useModalStore when closeModal is invoked", () => {
    const open = vi.fn();
    const close = vi.fn();
    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = { open, close };
      return selector(state);
    });

    const { result } = renderHook(() => useModal());

    result.current.closeModal();

    expect(close).toHaveBeenCalledOnce();
  });
});
