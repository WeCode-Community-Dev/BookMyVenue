package com.bookmyvenue.backend.dto.admin;

import com.bookmyvenue.backend.enums.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
@Builder
@Data
public class AdminUserResponse {

    private Long userId;

    private String fullName;

    private String email;

    private UserStatus status;

    private LocalDateTime createdAt;

    private Long totalBookings;
}