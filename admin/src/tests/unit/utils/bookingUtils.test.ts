import { describe, it, expect } from "vitest";
import { minutesToTime } from "@/utils/bookingUtils";

describe("admin bookingUtils", () => {
  it("should convert minutes to formatted HH:MM time string", () => {
    expect(minutesToTime(0)).toBe("00:00");
    expect(minutesToTime(570)).toBe("09:30");
    expect(minutesToTime(1439)).toBe("23:59");
  });
});
