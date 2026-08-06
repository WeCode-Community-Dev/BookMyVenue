from enum import Enum


class BookingType(str, Enum):
    HOURLY = "hourly"
    SESSION = "session"
    FULL_DAY = "full_day"


class VenueStatus(str, Enum):
    APPROVED = "approved"
    PENDING_APPROVAL = "pending_approval"
    REJECTED = "rejected"
    SUSPENDED = "suspended"
