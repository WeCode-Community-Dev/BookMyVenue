package com.bookmyvenue.backend.dto.authentication;

import com.bookmyvenue.backend.enums.UserRole;
import lombok.Data;

@Data
public class RegisterResponse {

    private String firstName;
    private String lastName;
    private String email;
    private long userId;
    private UserRole role;
    private String message;
}
