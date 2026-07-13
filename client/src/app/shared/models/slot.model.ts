export interface TimeSlot {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  duration: string;
  available: boolean;
  surcharge: number;
}

export interface SlotTemplate {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface CreateSlotTemplateRequest {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}
