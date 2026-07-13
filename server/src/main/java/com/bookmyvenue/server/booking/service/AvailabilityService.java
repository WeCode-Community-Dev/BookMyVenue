package com.bookmyvenue.server.booking.service;

import com.bookmyvenue.server.booking.dto.response.AvailabilityResponse;

import java.time.LocalDate;
import java.util.List;

public interface AvailabilityService {

    List<AvailabilityResponse> getAvailability(
            Long venueId,
            LocalDate date
    );
}