import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/store/useAppStore";

describe("admin useAppStore (Zustand)", () => {
  beforeEach(() => {
    useAppStore.getState().setActiveVenue(null, null);
    useAppStore.getState().setLastVenueSubRoute("bookings");
  });

  it("should initialize with default state", () => {
    const state = useAppStore.getState();
    expect(state.activeVenueId).toBeNull();
    expect(state.activeVenueName).toBeNull();
    expect(state.activeVenueStatus).toBeNull();
    expect(state.lastVenueSubRoute).toBe("bookings");
  });

  it("should set active venue with id, name, and status", () => {
    useAppStore.getState().setActiveVenue("v_1", "Grand Palace", "active");

    const state = useAppStore.getState();
    expect(state.activeVenueId).toBe("v_1");
    expect(state.activeVenueName).toBe("Grand Palace");
    expect(state.activeVenueStatus).toBe("active");
  });

  it("should set active venue without status", () => {
    useAppStore.getState().setActiveVenue("v_2", "Beach Resort");

    const state = useAppStore.getState();
    expect(state.activeVenueId).toBe("v_2");
    expect(state.activeVenueName).toBe("Beach Resort");
    expect(state.activeVenueStatus).toBeNull();
  });

  it("should clear active venue when called with null", () => {
    useAppStore.getState().setActiveVenue("v_1", "Grand Palace", "active");
    useAppStore.getState().setActiveVenue(null, null);

    const state = useAppStore.getState();
    expect(state.activeVenueId).toBeNull();
    expect(state.activeVenueName).toBeNull();
    expect(state.activeVenueStatus).toBeNull();
  });

  it("should set last venue sub route", () => {
    useAppStore.getState().setLastVenueSubRoute("settings");
    expect(useAppStore.getState().lastVenueSubRoute).toBe("settings");

    useAppStore.getState().setLastVenueSubRoute("analytics");
    expect(useAppStore.getState().lastVenueSubRoute).toBe("analytics");
  });
});
