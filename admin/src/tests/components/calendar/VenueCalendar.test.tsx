import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { VenueCalendar } from "@/components/calendar/VenueCalendar";

const never = () => false;

// Predicates are injected, so the real date never affects the outcome
const VISIBLE_MONTH = new Date();

function renderCalendar(
  overrides: Record<string, (date: Date) => boolean> = {},
) {
  const props = {
    isLoading: false,
    handleDayClick: vi.fn(),
    isDisabledDay: never,
    isBooked: never,
    isBlocked: never,
    isTempBlocked: never,
    isInactivityBlocked: never,
    isPast: never,
    isTooFar: never,
    isNonWorkingDay: never,
    ...overrides,
  };
  return render(<VenueCalendar {...props} />);
}

// Modifier classes land on the <td data-day="YYYY-MM-DD"> cell
function dayCellClass(container: HTMLElement, dayOfMonth: number): string {
  const year = VISIBLE_MONTH.getFullYear();
  const month = String(VISIBLE_MONTH.getMonth() + 1).padStart(2, "0");
  const day = String(dayOfMonth).padStart(2, "0");
  const cell = container.querySelector(`[data-day="${year}-${month}-${day}"]`);
  if (!cell) throw new Error(`No day cell rendered for ${day}`);
  return cell.className;
}

describe("VenueCalendar past-day styling", () => {
  it("marks a past booked day as both booked and past", () => {
    const { container } = renderCalendar({
      isBooked: (date) => date.getDate() === 1,
      isPast: (date) => date.getDate() === 1,
    });

    const className = dayCellClass(container, 1);
    expect(className).toContain("rdp-day--booked");
    // Without this class the grey rule buries the booking
    expect(className).toContain("rdp-day--past");
  });

  it("marks a past blocked day as both blocked and past", () => {
    const { container } = renderCalendar({
      isBlocked: (date) => date.getDate() === 2,
      isPast: (date) => date.getDate() === 2,
    });

    const className = dayCellClass(container, 2);
    expect(className).toContain("rdp-day--blocked");
    expect(className).toContain("rdp-day--past");
  });

  it("leaves a past day with no booking or block as plain unavailable", () => {
    const { container } = renderCalendar({
      isPast: (date) => date.getDate() === 3,
    });

    const className = dayCellClass(container, 3);
    expect(className).toContain("rdp-day--unavailable");
    expect(className).not.toContain("rdp-day--booked");
    expect(className).not.toContain("rdp-day--blocked");
  });

  it("does not mark an upcoming booked day as past", () => {
    const { container } = renderCalendar({
      isBooked: (date) => date.getDate() === 4,
    });

    const className = dayCellClass(container, 4);
    expect(className).toContain("rdp-day--booked");
    expect(className).not.toContain("rdp-day--past");
  });
});
