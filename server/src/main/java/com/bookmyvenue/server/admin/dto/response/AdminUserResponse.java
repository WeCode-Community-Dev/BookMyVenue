package com.bookmyvenue.server.admin.dto.response;

import com.bookmyvenue.server.user.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdminUserResponse {

    private UUID id;
    private String name;
    private String email;
    private String phone;
    private Role role;
}