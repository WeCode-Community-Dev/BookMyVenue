package com.bookmyvenue.backend.dto.admin;

import com.bookmyvenue.backend.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminVenueOwnerResponse {

    private Long ownerId;

    private String ownerName;

    private String email;

    private Long totalVenues;

    private BigDecimal revenue;

    private UserStatus status;
}
