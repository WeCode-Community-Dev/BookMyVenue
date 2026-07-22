export const validateBookingDetails = ({
  eventDate,
  startTime,
  endTime,
  venue,
}) => {
  const errors = {};

  if (!eventDate) {
    errors.eventDate = "Event date is required";
  }

  if (!startTime) {
    errors.startTime = "Start time is required";
  }

  if (!endTime) {
    errors.endTime = "End time is required";
  }

  if (startTime && endTime) {
    if (endTime <= startTime) {
      errors.endTime =
        "End time must be after start time";
    }
  }

  if (startTime && endTime && venue?.minimumBookingHours) {
    const start = convertTimeToMinutes(startTime);
    const end = convertTimeToMinutes(endTime);

    const duration = (end - start) / 60;

    if (duration < venue.minimumBookingHours) {
      errors.endTime =
        `Minimum booking duration is ${venue.minimumBookingHours} hours`;
    }
  }

  return errors;
};

const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};