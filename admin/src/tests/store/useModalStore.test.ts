import { describe, it, expect, beforeEach, vi } from "vitest";
import { useModalStore } from "@/store/useModalStore";

describe("admin useModalStore (Zustand)", () => {
  beforeEach(() => {
    useModalStore.getState().close();
  });

  it("should initialize with null modal state", () => {
    expect(useModalStore.getState().modal).toBeNull();
  });

  it("should open modal and assign a unique ID", () => {
    const mockComponent = () => null;
    const mockOnClick = vi.fn();

    useModalStore.getState().open({
      title: "Approve Venue Confirmation",
      component: mockComponent,
      data: { venueId: "v_123", venueName: "Grand Palace" },
      actions: [{ label: "Approve", onClick: mockOnClick }],
    });

    const modal = useModalStore.getState().modal;
    expect(modal).not.toBeNull();
    expect(modal?.title).toBe("Approve Venue Confirmation");
    expect(modal?.id).toBeDefined();
    expect(modal?.data).toEqual({
      venueId: "v_123",
      venueName: "Grand Palace",
    });
  });

  it("should close open modal", () => {
    const mockComponent = () => null;

    useModalStore.getState().open({
      title: "Ban User Confirmation",
      component: mockComponent,
      data: { userId: "user_999" },
      actions: [],
    });

    useModalStore.getState().close();

    expect(useModalStore.getState().modal).toBeNull();
  });
});
