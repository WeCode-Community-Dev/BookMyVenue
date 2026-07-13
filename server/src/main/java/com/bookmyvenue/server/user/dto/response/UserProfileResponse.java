package com.bookmyvenue.server.user.dto.response;

import com.bookmyvenue.server.user.enums.Role;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record UserProfileResponse(
        UUID id,
        String name,
        String email,
        String phone,
        Role role,
        LocalDateTime createdAt
) {
}