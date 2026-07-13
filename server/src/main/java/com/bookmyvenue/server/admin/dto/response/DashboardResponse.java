package com.bookmyvenue.server.admin.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {

    private long totalUsers;
    private long totalVendors;
    private long totalVenues;
    private long pendingVenues;
    private long approvedVenues;
    private long rejectedVenues;
    private long totalBookings;
}