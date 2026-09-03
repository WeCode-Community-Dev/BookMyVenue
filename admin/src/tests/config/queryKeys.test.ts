import { describe, it, expect } from "vitest";
import { QUERY_KEYS } from "@/config/queryKeys";

describe("config queryKeys", () => {
  it("should define PROFILE key", () => {
    expect(QUERY_KEYS.PROFILE).toEqual(["profile"]);
  });

  it("should define ADMIN_VENUES key", () => {
    expect(QUERY_KEYS.ADMIN_VENUES).toEqual(["admin", "venues"]);
  });

  it("should define ADMIN_BOOKINGS key", () => {
    expect(QUERY_KEYS.ADMIN_BOOKINGS).toEqual(["admin", "bookings"]);
  });

  it("should define ADMIN_OWNERS key", () => {
    expect(QUERY_KEYS.ADMIN_OWNERS).toEqual(["admin", "owners"]);
  });

  it("should define SUPER_ADMINS key", () => {
    expect(QUERY_KEYS.SUPER_ADMINS).toEqual(["superadmin", "admins"]);
  });

  it("should define MY_VENUES key", () => {
    expect(QUERY_KEYS.MY_VENUES).toEqual(["owner", "my-venues"]);
  });

  it("should generate dynamic OWNER_ANALYTICS key", () => {
    expect(QUERY_KEYS.OWNER_ANALYTICS("v_123")).toEqual([
      "owner",
      "analytics",
      "v_123",
    ]);
  });

  it("should generate dynamic OWNER_BOOKINGS key", () => {
    expect(QUERY_KEYS.OWNER_BOOKINGS("v_123")).toEqual([
      "owner",
      "bookings",
      "v_123",
    ]);
  });

  it("should generate dynamic OWNER_REVIEWS key", () => {
    expect(QUERY_KEYS.OWNER_REVIEWS("v_123")).toEqual([
      "owner",
      "reviews",
      "v_123",
    ]);
  });

  it("should generate dynamic OWNER_AVAILABILITY key", () => {
    expect(QUERY_KEYS.OWNER_AVAILABILITY("v_123")).toEqual([
      "owner",
      "availability",
      "v_123",
    ]);
  });

  it("should define MODERATION_SUMMARY key", () => {
    expect(QUERY_KEYS.MODERATION_SUMMARY).toEqual(["moderation-summary"]);
  });

  it("should define MODERATION_LOGS key", () => {
    expect(QUERY_KEYS.MODERATION_LOGS).toEqual(["moderation-logs"]);
  });

  it("should define ADMIN_REVIEWS key", () => {
    expect(QUERY_KEYS.ADMIN_REVIEWS).toEqual(["admin", "reviews"]);
  });

  it("should define OWNER_VENUE_SETTINGS key", () => {
    expect(QUERY_KEYS.OWNER_VENUE_SETTINGS).toEqual([
      "owner",
      "venue-settings",
    ]);
  });
});
