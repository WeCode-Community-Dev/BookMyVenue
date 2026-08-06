class BookingError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class BookingNotFoundError(BookingError):
    pass


class VenueScheduleNotFoundError(BookingError):
    pass


class InvalidBookingDateError(BookingError):
    pass


class VenueNotAvailableError(BookingError):
    pass


class ScheduleUnavailableError(BookingError):
    pass


class SlotAlreadyBookedError(BookingError):
    pass


class SlotLockedError(BookingError):
    pass


class RazorpayOrderCreationError(BookingError):
    pass


class BookingSessionNotFoundError(BookingError):
    pass


class BookingSessionNotActiveError(BookingError):
    pass


class BookingSessionExpiredError(BookingError):
    pass


class PaymentNotFoundError(BookingError):
    pass


class PaymentNotSuccessfulError(BookingError):
    pass


class PaymentAlreadyProcessedError(BookingError):
    pass


class InvalidPaymentStatusError(BookingError):
    pass


class InvalidPaymentSignatureError(BookingError):
    pass
