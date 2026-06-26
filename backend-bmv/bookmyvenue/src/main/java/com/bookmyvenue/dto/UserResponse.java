package com.bookmyvenue.dto;

import java.time.LocalDateTime;

import com.bookmyvenue.model.User;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Integer id;
    private String name;
    private String email;
    private String role;
    private String location;
    private LocalDateTime createdAt;
    private Boolean active;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .location(user.getLocation())
                .createdAt(user.getCreatedAt())
                .active(user.getActive())
                .build();
    }
}