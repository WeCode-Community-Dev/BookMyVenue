import { describe, it, expect } from "vitest";
import { toLocalDateStr } from "@/utils/dateUtils";

describe("admin dateUtils", () => {
  it("should format date object to YYYY-MM-DD local date string", () => {
    const date = new Date(2026, 6, 22); // July 22, 2026
    expect(toLocalDateStr(date)).toBe("2026-07-22");
  });

  it("should pad single digit month and day with zero", () => {
    const date = new Date(2026, 0, 5); // January 5, 2026
    expect(toLocalDateStr(date)).toBe("2026-01-05");
  });
});
