import { getTodayDateKey, isEndTimePassedForDate, toDateKey } from "./formatDate";

export const PARTIAL_SLOT_IDS = ["morning", "evening", "night"];
export const FULL_DAY_SLOT_ID = "fullday";

export const PREDEFINED_SLOTS = [
  {
    id: "morning",
    apiLabel: "morning",
    label: "Morning",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    isFullDay: false,
  },
  {
    id: "evening",
    apiLabel: "evening",
    label: "Evening",
    startTime: "03:00 PM",
    endTime: "06:00 PM",
    isFullDay: false,
  },
  {
    id: "night",
    apiLabel: "night",
    label: "Night",
    startTime: "06:00 PM",
    endTime: "10:00 PM",
    isFullDay: false,
  },
  {
    id: "fullday",
    apiLabel: "fullday",
    label: "Full Day",
    startTime: "09:00 AM",
    endTime: "10:00 PM",
    isFullDay: true,
  },
];

export const SLOT_RULES_HELPER =
  "Full Day covers the entire day and cannot be combined with Morning, Evening, or Night on the same date.";

export const getPredefinedSlotById = (id) =>
  PREDEFINED_SLOTS.find((slot) => slot.id === id);

export const getDisplayLabelForSlot = (slot) => {
  if (!slot) return "";

  const match = PREDEFINED_SLOTS.find(
    (preset) =>
      preset.apiLabel === slot.slotLabel &&
      preset.startTime === slot.startTime &&
      preset.endTime === slot.endTime
  );

  if (match) return match.label;

  const fallback = {
    morning: "Morning",
    evening: "Evening",
    night: "Night",
    fullday: "Full Day",
  };

  return fallback[slot.slotLabel] || slot.slotLabel;
};

export const slotsForDate = (slots, date) => {
  const key = toDateKey(date);
  return slots.filter((slot) => toDateKey(slot.date) === key);
};

export const slotMatchesPreset = (slot, preset) =>
  slot.slotLabel === preset.apiLabel &&
  slot.startTime === preset.startTime &&
  slot.endTime === preset.endTime;

export const findExistingPresetSlot = (slots, date, preset) =>
  slotsForDate(slots, date).find((slot) => slotMatchesPreset(slot, preset));

export const getSlotOptionState = (slots, date, preset) => {
  if (!date) {
    return { hidden: false, disabled: true, reason: "existing", existing: false };
  }

  const existing = findExistingPresetSlot(slots, date, preset);
  if (existing) {
    return { hidden: false, disabled: true, reason: "existing", existing: true };
  }

  if (isPresetExpiredForDate(date, preset)) {
    return { hidden: true, disabled: true, reason: "expired", existing: false };
  }

  const dateSlots = slotsForDate(slots, date);
  const fullDayExists = dateSlots.some((slot) => slot.slotLabel === "fullday");
  const partialExists = dateSlots.some((slot) => slot.slotLabel !== "fullday");

  if (preset.isFullDay) {
    if (partialExists) {
      return { hidden: true, disabled: true, reason: "conflict", existing: false };
    }
    return { hidden: false, disabled: false, reason: null, existing: false };
  }

  if (fullDayExists) {
    return { hidden: true, disabled: true, reason: "conflict", existing: false };
  }

  const labelTaken = dateSlots.some((slot) => slot.slotLabel === preset.apiLabel);
  if (labelTaken) {
    return { hidden: true, disabled: true, reason: "conflict", existing: false };
  }

  return { hidden: false, disabled: false, reason: null, existing: false };
};

export const getVisibleSlotOptions = (slots, date, selectedSlotIds = []) =>
  PREDEFINED_SLOTS.filter((preset) => {
    const state = getSlotOptionStateWithSelection(
      slots,
      date,
      preset,
      selectedSlotIds
    );
    return state.existing || !state.hidden;
  });

/** Extends saved-slot rules with in-form checkbox selection conflicts. */
export const getSlotOptionStateWithSelection = (
  slots,
  date,
  preset,
  selectedSlotIds = []
) => {
  const base = getSlotOptionState(slots, date, preset);
  if (base.existing || base.hidden || !date) return base;

  const selectedPresets = selectedSlotIds
    .map((id) => getPredefinedSlotById(id))
    .filter(Boolean);

  const fullDaySelected = selectedPresets.some((item) => item.isFullDay);
  const partialSelected = selectedPresets.some((item) => !item.isFullDay);
  const isSelected = selectedSlotIds.includes(preset.id);

  if (isSelected && isPresetExpiredForDate(date, preset)) {
    return { hidden: true, disabled: true, reason: "expired", existing: false };
  }

  if (isSelected) {
    return { ...base, hidden: false, disabled: false, reason: null };
  }

  if (preset.isFullDay && partialSelected) {
    return { hidden: true, disabled: true, reason: "conflict", existing: false };
  }

  if (!preset.isFullDay && fullDaySelected) {
    return { hidden: true, disabled: true, reason: "conflict", existing: false };
  }

  return base;
};

/** Apply Full Day ↔ partial mutual exclusion to checkbox selection. */
export const resolveSlotSelection = (selectedIds, toggledId) => {
  const isRemoving = selectedIds.includes(toggledId);
  let next = isRemoving
    ? selectedIds.filter((id) => id !== toggledId)
    : [...selectedIds, toggledId];

  const hasFullDay = next.includes(FULL_DAY_SLOT_ID);
  const hasPartial = next.some((id) => PARTIAL_SLOT_IDS.includes(id));

  if (hasFullDay && hasPartial) {
    if (toggledId === FULL_DAY_SLOT_ID) {
      next = next.filter((id) => !PARTIAL_SLOT_IDS.includes(id));
    } else {
      next = next.filter((id) => id !== FULL_DAY_SLOT_ID);
    }
  }

  return next;
};

export const getTodayDateInputValue = () => getTodayDateKey();

export const isPresetExpiredForDate = (date, preset) =>
  Boolean(preset) && isEndTimePassedForDate(date, preset.endTime);

export const areAllSlotsExpiredForToday = (date) => {
  if (date !== getTodayDateKey()) return false;
  return PREDEFINED_SLOTS.every((preset) => isPresetExpiredForDate(date, preset));
};

export const filterNonExpiredPresetIds = (date, presetIds) =>
  presetIds.filter((id) => {
    const preset = getPredefinedSlotById(id);
    return preset && !isPresetExpiredForDate(date, preset);
  });

export const getCreatablePresetsForDate = (slots, date, selectedSlotIds = []) =>
  PREDEFINED_SLOTS.filter((preset) => {
    const state = getSlotOptionStateWithSelection(
      slots,
      date,
      preset,
      selectedSlotIds
    );
    return !state.existing && !state.hidden && !state.disabled;
  });

export const groupSlotsByDate = (slots) => {
  const groups = {};

  slots.forEach((slot) => {
    const key = toDateKey(slot.date);
    if (!groups[key]) {
      groups[key] = { date: slot.date, slots: [] };
    }
    groups[key].slots.push(slot);
  });

  const sortPresets = PREDEFINED_SLOTS.map((preset) => preset.id);

  Object.values(groups).forEach((group) => {
    group.slots.sort((a, b) => {
      const aPreset = PREDEFINED_SLOTS.find((preset) => slotMatchesPreset(a, preset));
      const bPreset = PREDEFINED_SLOTS.find((preset) => slotMatchesPreset(b, preset));
      const aIndex = sortPresets.indexOf(aPreset?.id ?? "");
      const bIndex = sortPresets.indexOf(bPreset?.id ?? "");
      return aIndex - bIndex;
    });
  });

  return Object.values(groups).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};

export const getSlotStatusLabel = (slot) => {
  if (slot.isBooked) return "Booked";
  if (!slot.isActive) return "Inactive";
  return "Available";
};

export const getProviderAvailabilityEmptyState = (slots) => {
  if (slots.length === 0) {
    return {
      title: "No availability created yet",
      description:
        "Add your first slot so guests can start booking this venue.",
      showCta: true,
    };
  }

  return null;
};

export const getAvailabilityStats = (slots) => {
  const list = slots ?? [];

  return {
    total: list.length,
    available: list.filter((slot) => slot.isActive && !slot.isBooked).length,
    booked: list.filter((slot) => slot.isBooked).length,
    inactive: list.filter((slot) => !slot.isActive && !slot.isBooked).length,
  };
};
