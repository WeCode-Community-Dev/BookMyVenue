export const VenueTypeEnum = {
  BANQUET_HALL: "BANQUET_HALL",
  CONFERENCE_ROOM: "CONFERENCE_ROOM",
  WEDDING_LAWN: "WEDDING_LAWN",
  AUDITORIUM: "AUDITORIUM",
  ROOFTOP: "ROOFTOP",
  PARTY_HALL: "PARTY_HALL",
} as const;

export type VenueTypeEnumType = (typeof VenueTypeEnum)[keyof typeof VenueTypeEnum];
