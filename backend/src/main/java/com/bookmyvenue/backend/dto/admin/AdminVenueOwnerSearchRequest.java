package com.bookmyvenue.backend.dto.admin;

import com.bookmyvenue.backend.enums.UserStatus;
import lombok.Data;

@Data
public class AdminVenueOwnerSearchRequest {

    private String name;

    private String email;

    private UserStatus status;
}
