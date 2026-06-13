package com.bookmyvenue.backend.dto.venueOwnerDashboard;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class OwnerDashboardResponse {

    private Long activeVenues;

    private Long totalVenues;

    private Long totalBookings;

    private BigDecimal revenueEarned;

    private Double averageRating;

    private List<RecentBookingDto> recentBookings;

    private List<OwnerVenueDto> venues;
}